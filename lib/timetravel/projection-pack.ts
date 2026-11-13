/**
 * NASA NEX-GDDP-CMIP6 "delta pack".
 *
 * The full NEX-GDDP-CMIP6 archive has 34 models. The public monthly COG subset used here has two
 * (GFDL-CM4 and GISS-E2-1-G), and is sampled offline into compact district-center JSON packs.
 * `scripts/nex_gddp_cmip6_extract.py` (Python + rasterio + internet) regenerates the packs.
 *
 * Each pack records its historical baseline and projection averaging window. Missing years use the
 * labelled trend/what-if fallback rather than pretending that a projection exists.
 */

export interface ProjectionYear {
  /** additive change in monthly mean Tmax (degC), 12 values */
  dTmax: number[];
  /** additive change in monthly mean Tmin (degC), 12 values */
  dTmin: number[];
  /** multiplicative change in monthly mean rain, 12 values (1 = no change) */
  rainRatio: number[];
}

export interface ProjectionPack {
  schema: "agrilume.projection.delta.v1";
  dataset: "NASA/NEX-GDDP-CMIP6";
  scenario: "ssp245" | "ssp585";
  /** e.g. "median of 20 models" - free text copied from the extractor */
  ensemble: string;
  deltaBaseline: [number, number];
  projectionWindow?: [number, number];
  rainRatioFallbackMonths?: number[];
  location: { name: string; lat: number; lon: number };
  generatedAt: string;
  citation: string;
  years: Record<string, ProjectionYear>;
}

function is12(a: unknown): a is number[] {
  return Array.isArray(a) && a.length === 12 && a.every((x) => typeof x === "number" && Number.isFinite(x));
}

/** Strict validation: returns the pack or throws with a readable reason. */
export function validateProjectionPack(raw: unknown): ProjectionPack {
  if (typeof raw !== "object" || raw === null) throw new Error("pack is not an object");
  const p = raw as Record<string, unknown>;
  if (p.schema !== "agrilume.projection.delta.v1") throw new Error("unknown schema");
  if (p.dataset !== "NASA/NEX-GDDP-CMIP6") throw new Error("dataset must be NASA/NEX-GDDP-CMIP6");
  if (p.scenario !== "ssp245" && p.scenario !== "ssp585") throw new Error("scenario must be ssp245 or ssp585");
  const years = p.years as Record<string, Record<string, unknown>> | undefined;
  if (!years || typeof years !== "object") throw new Error("years missing");
  if (
    p.projectionWindow !== undefined &&
    (!Array.isArray(p.projectionWindow) ||
      p.projectionWindow.length !== 2 ||
      !p.projectionWindow.every((year) => Number.isInteger(year)) ||
      p.projectionWindow[0] > p.projectionWindow[1])
  ) {
    throw new Error("projectionWindow must be an ordered pair of years");
  }
  if (
    p.rainRatioFallbackMonths !== undefined &&
    (!Array.isArray(p.rainRatioFallbackMonths) ||
      !p.rainRatioFallbackMonths.every((month) => Number.isInteger(month) && month >= 0 && month < 12))
  ) {
    throw new Error("rainRatioFallbackMonths must contain month indexes from 0 to 11");
  }
  for (const [y, v] of Object.entries(years)) {
    if (!/^\d{4}$/.test(y)) throw new Error(`bad year key ${y}`);
    if (!is12(v.dTmax) || !is12(v.dTmin) || !is12(v.rainRatio)) throw new Error(`year ${y}: need 12 finite numbers per field`);
    if ((v.rainRatio as number[]).some((r) => r < 0 || r > 5)) throw new Error(`year ${y}: implausible rainRatio`);
    if ((v.dTmax as number[]).some((d) => Math.abs(d) > 15)) throw new Error(`year ${y}: implausible dTmax`);
  }
  if (typeof p.citation !== "string" || p.citation.length < 10) throw new Error("citation required");
  return raw as ProjectionPack;
}

export async function loadProjectionPack(
  districtId: string,
  basePath = "",
  fetchImpl: typeof fetch = fetch,
): Promise<ProjectionPack | null> {
  try {
    const res = await fetchImpl(`${basePath}/data/projections/${districtId}.json`, { cache: "force-cache" });
    if (!res.ok) return null;
    return validateProjectionPack(await res.json());
  } catch {
    return null;
  }
}
