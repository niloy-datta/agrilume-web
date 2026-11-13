# NASA dataset provenance matrix

Audience: judges and reviewers verifying which NASA data actually powers AgriLume. The five columns are kept separate
on purpose: documenting a dataset is not the same as using it.

| Dataset | Registered | Adapter | Fetched | Processed | Used on screen | Where |
|---|---|---|---|---|---|---|
| NASA POWER daily (T2M_MAX, T2M_MIN, PRECTOTCORR), 64 districts, 1981–2025 | ✓ | ✓ `scripts/fetch-power-districts.mjs` | ✓ | ✓ monthly means + Tmax SD | ✓ history, baselines, crop model, comparison | `public/data/power/` |
| NASA POWER daily, live (custom map point / fallback), 2001 – last full year | ✓ | ✓ `loadPowerMonthly` → `parseDaily` | at runtime | ✓ | ✓ when used | browser |
| NASA POWER daily, Rajshahi fixture 2001–2025 | ✓ | ✓ `scripts/build-power-fixture.mjs` | ✓ | ✓ | first paint for Rajshahi; tests | `data/source/nasa_power/` |
| NEX-GDDP-CMIP6 SSP2-4.5 (2 models, monthly COG) | ✓ | ✓ `scripts/nex_gddp_cmip6_extract.py` | ✓ | ✓ 2031–2035 vs 2010–2014 deltas | ✓ year 2033 only | `public/data/projections/` |
| MODIS MOD13Q1 NDVI (via ORNL DAAC), 2021–2025 | ✓ | ✓ `scripts/fetch-modis-ndvi.mjs` | see note | ✓ | ✓ Place panel context card (not in the crop model) | `public/data/ndvi/` |
| GPM IMERG, SMAP L4, HLS, MOD16, NASADEM/SRTM, GRACE, ECOSTRESS, FIRMS, FLDAS, MERRA-2 | ✓ | ✗ | ✗ | ✗ | ✗ | registry only (`lib/timetravel/nasa-datasets.ts`) |

Note on MODIS: the ORNL service allows 10 dates per request and averaged ~20 s per request during the build, so the
number of districts processed is whatever `public/data/ndvi/` contains (the app shows "not processed yet" otherwise).

## Details

### NASA POWER
* Endpoint: `https://power.larc.nasa.gov/api/temporal/daily/point`, community `AG`, LST days, API v2.10.0 (from the
  response header). No login.
* Units: °C, mm/day (read from each response; a different rainfall unit is rejected).
* Spatial: POWER grid cell (~0.5° × 0.625°) containing the district centre. 64 centres → 39 distinct cells.
* Per-file: `sourceUrl`, `retrievedAt`, `sourceFileSha256`, `apiVersion`, `quality.missingMonthValues` (0 for all 64).
* Raw daily responses (~0.8 MB each) are git-ignored; `data/source/nasa_power/districts/manifest.json` records URL,
  time and SHA-256 of each.
* Citation: "These data were obtained from the NASA Langley Research Center (LaRC) POWER Project funded through the
  NASA Earth Science/Applied Science Program."
* Known caveat: monthly-endpoint `T2M_MAX/T2M_MIN` are monthly extremes; AgriLume uses daily data for this reason.

### NEX-GDDP-CMIP6
* AWS Open Data registry, public monthly COG subset (GFDL-CM4, GISS-E2-1-G), CC0.
* 0.25° district-centre pixel; SSP2-4.5; deltas = mean(2031–2035) − mean(2010–2014) per month.
* Applied to observed POWER means over the same 2010–2014 window (METHODOLOGY §3.1).
* Not available: SSP5-8.5 packs, other projection windows, ensemble spread. These would require re-running the
  extractor against the full daily archive.

### MODIS NDVI
* MOD13Q1, 250 m, 16-day; NDVI band + VI pixel-reliability band from `https://modis.ornl.gov/rst/api/v1/`.
* 9 × 9 pixel (≈3 × 3 km) window; reliability 0 or 1 kept; composite kept only if ≥ 25 % usable; median.
* The ORNL API does not report the collection version; each composite's `procDate` is stored.
* Citation: Didan, K. (2021) MOD13Q1 v061, NASA LP DAAC; ORNL DAAC (2018) MODIS and VIIRS Land Products Global
  Subsetting and Visualization Tool.

## Third-party assets
| Item | Licence |
|---|---|
| MediaPipe Hands (lite model) | Apache-2.0 (`public/mediapipe/hands/NOTICE.txt`) |
| Inter, Space Grotesk, Noto Sans Bengali | SIL OFL (`app/fonts/LICENSE-*.txt`) |
| Next.js, React, three, @react-three/*, Tailwind, framer-motion, lucide-react | MIT / ISC |
| Playwright (dev only) | Apache-2.0 |

AgriLume is not endorsed by NASA. NASA data are used under NASA's open data policy.
