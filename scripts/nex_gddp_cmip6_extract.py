#!/usr/bin/env python3
"""Build district-center delta packs from NASA's public monthly NEX-GDDP-CMIP6 COGs.

Requires Python 3.10+ and rasterio:
    python -m pip install rasterio
    python scripts/nex_gddp_cmip6_extract.py

The default pack compares the 2031-2035 SSP2-4.5 monthly mean with the
2010-2014 historical monthly mean. It samples the same 0.25-degree pixel at
each district center; it does not represent a district-wide or field-scale
average.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import re
import sys

try:
    import numpy as np
    import rasterio
except ImportError as exc:
    raise SystemExit("Install rasterio and numpy with: python -m pip install rasterio") from exc


ROOT = Path(__file__).resolve().parents[1]
LOCATIONS_FILE = ROOT / "lib" / "timetravel" / "locations.ts"
OUTPUT_DIR = ROOT / "public" / "data" / "projections"
COG_ROOT = "https://nex-gddp-cmip6-cog.s3.us-west-2.amazonaws.com/monthly/CMIP6_ensemble_median"
VARIABLES = ("tasmax", "tasmin", "pr")
SCENARIO = "ssp245"
BASELINE_START, BASELINE_END = 2010, 2014
TARGET_YEAR, TARGET_WINDOW_YEARS = 2033, 5
ROW_PATTERN = re.compile(
    r'^\s*\["([^"]+)",\s*"([^"]+)",\s*"[^"]+",\s*"[^"]+",'
    r'\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*"[^"]+"\],\s*$',
    re.MULTILINE,
)


def locations() -> list[dict[str, object]]:
    source = LOCATIONS_FILE.read_text(encoding="utf-8")
    parsed = [
        {"id": match[0], "name": match[1], "lat": float(match[2]), "lon": float(match[3])}
        for match in ROW_PATTERN.findall(source)
    ]
    if not parsed:
        raise ValueError(f"No district coordinate rows found in {LOCATIONS_FILE}")
    ids = [str(row["id"]) for row in parsed]
    if len(set(ids)) != len(ids):
        raise ValueError("District IDs in locations.ts must be unique")
    return parsed


def cogs(scenario: str, baseline_years: range, target_years: range) -> list[tuple[str, str, int, int]]:
    keys = {
        (variable, period, year, month)
        for variable in VARIABLES
        for period, years in (("historical", baseline_years), (scenario, target_years))
        for year in years
        for month in range(1, 13)
    }
    return sorted(keys)


def sample_cog(
    key: tuple[str, str, int, int],
    points: list[tuple[float, float]],
) -> tuple[tuple[str, str, int, int], list[float]]:
    variable, scenario, year, month = key
    stamp = f"{year}{month:02d}"
    url = f"{COG_ROOT}/{variable}/{variable}_month_ensemble-median_{scenario}_{stamp}.tif"
    with rasterio.open(url) as dataset:
        if dataset.crs is None or dataset.crs.to_epsg() != 4326:
            raise ValueError(f"Unexpected CRS for {url}: {dataset.crs}")
        values: list[float] = []
        for sample in dataset.sample(points, masked=True):
            value = sample[0]
            if np.ma.is_masked(value) or not math.isfinite(float(value)):
                raise ValueError(f"Missing sample in {url}")
            values.append(float(value))
    return key, values


def average(
    samples: dict[tuple[str, str, int, int], list[float]],
    variable: str,
    scenario: str,
    years: range,
    month: int,
    location_index: int,
) -> float:
    values = [
        samples[(variable, scenario, year, month)][location_index]
        for year in years
    ]
    return sum(values) / len(values)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.workers < 1:
        parser.error("--workers must be positive.")

    half = TARGET_WINDOW_YEARS // 2
    target_start = TARGET_YEAR - half
    target_end = target_start + TARGET_WINDOW_YEARS - 1
    if target_start < 2015:
        parser.error("The projection window must start in 2015 or later.")

    baseline_years = range(BASELINE_START, BASELINE_END + 1)
    target_years = range(target_start, target_end + 1)
    points = locations()
    keys = cogs(SCENARIO, baseline_years, target_years)
    print(
        f"{len(points)} district centers; {len(keys)} NASA COG files; "
        f"baseline {BASELINE_START}-{BASELINE_END}; "
        f"{SCENARIO} target window {target_start}-{target_end} "
        f"(pack key {TARGET_YEAR}).",
        flush=True,
    )
    if args.dry_run:
        return

    coordinates = [(float(row["lon"]), float(row["lat"])) for row in points]
    samples: dict[tuple[str, str, int, int], list[float]] = {}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(sample_cog, key, coordinates) for key in keys]
        for i, future in enumerate(as_completed(futures), start=1):
            key, values = future.result()
            samples[key] = values
            if i % 12 == 0 or i == len(futures):
                print(f"Sampled {i}/{len(futures)} NASA COG files.", flush=True)

    retrieved_at = datetime.now(timezone.utc).isoformat()
    citation = (
        "NASA Earth Exchange Global Daily Downscaled Projections (NEX-GDDP-CMIP6), "
        "monthly COG ensemble-median product from the public two-model subset "
        "(GFDL-CM4 and GISS-E2-1-G), CC0. "
        "Source: https://registry.opendata.aws/nex-gddp-cmip6/ ; "
        "documentation: https://doi.org/10.7917/OFSG3345 . "
        f"Accessed {retrieved_at[:10]}. "
        f"Monthly COG means for {target_start}-{target_end} minus "
        f"{BASELINE_START}-{BASELINE_END}; precipitation uses the "
        "future-to-historical monthly ratio; if the historical mean is zero or the ratio exceeds 5, "
        "the ratio is set to 1 because the multiplicative delta is undefined or unstable. "
        "Temperature deltas are K differences "
        "(numerically equal to °C differences)."
    )
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for location_index, location in enumerate(points):
        d_tmax: list[float] = []
        d_tmin: list[float] = []
        rain_ratio: list[float] = []
        rain_ratio_fallback_months: list[int] = []
        for month in range(1, 13):
            historic_max = average(samples, "tasmax", "historical", baseline_years, month, location_index)
            future_max = average(samples, "tasmax", SCENARIO, target_years, month, location_index)
            historic_min = average(samples, "tasmin", "historical", baseline_years, month, location_index)
            future_min = average(samples, "tasmin", SCENARIO, target_years, month, location_index)
            historic_rain = average(samples, "pr", "historical", baseline_years, month, location_index)
            future_rain = average(samples, "pr", SCENARIO, target_years, month, location_index)
            ratio = future_rain / historic_rain if historic_rain > 0 else math.inf
            if not math.isfinite(ratio) or ratio > 5:
                rain_ratio.append(1.0)
                rain_ratio_fallback_months.append(month - 1)
            else:
                rain_ratio.append(round(ratio, 4))
            d_tmax.append(round(future_max - historic_max, 4))
            d_tmin.append(round(future_min - historic_min, 4))

        pack = {
            "schema": "agrilume.projection.delta.v1",
            "dataset": "NASA/NEX-GDDP-CMIP6",
            "scenario": SCENARIO,
            "ensemble": "2-model monthly COG ensemble median (GFDL-CM4, GISS-E2-1-G)",
            "deltaBaseline": [BASELINE_START, BASELINE_END],
            "projectionWindow": [target_start, target_end],
            "rainRatioFallbackMonths": rain_ratio_fallback_months,
            "location": {
                "name": location["name"],
                "lat": location["lat"],
                "lon": location["lon"],
            },
            "generatedAt": retrieved_at,
            "citation": citation,
            "years": {
                str(TARGET_YEAR): {
                    "dTmax": d_tmax,
                    "dTmin": d_tmin,
                    "rainRatio": rain_ratio,
                }
            },
        }
        out = args.output_dir / f"{location['id']}.json"
        out.write_text(json.dumps(pack, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Wrote {len(points)} packs to {args.output_dir}", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"NEX-GDDP-CMIP6 extraction failed: {error}", file=sys.stderr)
        raise
