/**
 * MODIS NDVI seasonal context (MOD13Q1, built by scripts/fetch-modis-ndvi.mjs from NASA's ORNL DAAC web service).
 * Context only: it is NOT used by the crop model, and the window around a district centre (a town) mixes land covers.
 */
export interface NdviComposite {
  date: string;
  ndvi: number | null;
  goodFrac: number;
}

export interface NdviFile {
  schema: "agrilume.ndvi.v1";
  location: { id: string; name: string; lat: number; lon: number };
  product: string;
  window: { kmAboveBelow: number; kmLeftRight: number; pixels: number; cellsizeM: number };
  years: number[];
  composites: NdviComposite[];
  monthlyByYear: Record<string, (number | null)[]>;
  climatology: (number | null)[];
  quality: { rule: string; compositesTotal: number; compositesUsable: number };
  provenance: { provider: string; service: string; citation: string; spatial: string; temporal: string; unit: string };
}

const isNdvi = (v: unknown) => v === null || (typeof v === "number" && Number.isFinite(v) && v >= -0.2 && v <= 1);

export function parseNdviFile(raw: unknown, expectedId?: string): NdviFile {
  if (typeof raw !== "object" || raw === null) throw new Error("NDVI file is not an object");
  const r = raw as Partial<NdviFile>;
  if (r.schema !== "agrilume.ndvi.v1") throw new Error("unknown NDVI schema");
  if (!r.location || (expectedId && r.location.id !== expectedId)) throw new Error("NDVI file is for another district");
  if (!Array.isArray(r.climatology) || r.climatology.length !== 12 || !r.climatology.every(isNdvi)) throw new Error("climatology must be 12 NDVI values or null");
  if (!r.monthlyByYear || !Object.values(r.monthlyByYear).every((a) => Array.isArray(a) && a.length === 12 && a.every(isNdvi))) throw new Error("monthlyByYear invalid");
  if (!Array.isArray(r.composites) || !r.composites.every((c) => isNdvi(c.ndvi) && c.goodFrac >= 0 && c.goodFrac <= 1)) throw new Error("composites invalid");
  if (!r.provenance?.citation || !r.provenance.service) throw new Error("NDVI provenance missing");
  return r as NdviFile;
}

export async function loadNdvi(districtId: string, basePath = "", fetchImpl: typeof fetch = fetch): Promise<NdviFile | null> {
  if (!/^[a-z]+$/.test(districtId)) return null;
  try {
    const res = await fetchImpl(`${basePath}/data/ndvi/${districtId}.json`, { cache: "force-cache" });
    if (!res.ok) return null;
    return parseNdviFile(await res.json(), districtId);
  } catch {
    return null;
  }
}

/** Anomaly of one year-month vs the 2021-2025 mean for that month; null when either value is missing. */
export function ndviAnomaly(f: NdviFile, year: number, m0: number): number | null {
  const v = f.monthlyByYear[String(year)]?.[m0];
  const c = f.climatology[m0];
  return v == null || c == null ? null : v - c;
}
