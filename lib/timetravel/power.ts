import type { ClimateSeries, MonthlyGrid, Provenance } from "./types";
import rajshahiRaw from "./data/rajshahi-power-monthly.json";

/**
 * NASA POWER client (browser). POWER is an open API: no key, no login.
 * Docs: https://power.larc.nasa.gov/docs/services/api/
 *
 * Honesty rules implemented here:
 *  - fill values (-999) become null, never 0;
 *  - units are read from the response, not assumed;
 *  - a failed request returns an error object, never made-up numbers;
 *  - the bundled Rajshahi file is REAL NASA POWER data (see scripts/build-power-fixture.mjs) and is only used for
 *    Rajshahi or, clearly flagged as a stand-in, when a place cannot be loaded.
 */

export const POWER_BASE = "https://power.larc.nasa.gov/api/temporal";
export const POWER_START_YEAR = 1981;
const CACHE_PREFIX = "agrilume.power.v1:";
const CACHE_TTL_MS = 14 * 24 * 3600 * 1000;

export interface PowerOk {
  ok: true;
  series: ClimateSeries;
}
export interface PowerErr {
  ok: false;
  error: string;
}
export type PowerResult = PowerOk | PowerErr;

export function monthlyUrl(lat: number, lon: number, startYear: number, endYear: number, params: string[]): string {
  const q = new URLSearchParams({
    parameters: params.join(","),
    community: "AG",
    longitude: lon.toFixed(4),
    latitude: lat.toFixed(4),
    start: String(startYear),
    end: String(endYear),
    format: "JSON",
  });
  return `${POWER_BASE}/monthly/point?${q.toString()}`;
}

export function dailyUrl(lat: number, lon: number, start: string, end: string, params: string[]): string {
  const q = new URLSearchParams({
    parameters: params.join(","),
    community: "AG",
    longitude: lon.toFixed(4),
    latitude: lat.toFixed(4),
    start,
    end,
    format: "JSON",
    "time-standard": "LST",
  });
  return `${POWER_BASE}/daily/point?${q.toString()}`;
}

interface PowerJson {
  properties?: { parameter?: Record<string, Record<string, number>> };
  header?: { fill_value?: number; api?: { version?: string } };
  parameters?: Record<string, { units?: string; longname?: string }>;
  messages?: unknown[];
}

function emptyGrid(years: number): MonthlyGrid {
  return Array.from({ length: years }, () => Array.from({ length: 12 }, () => null as number | null));
}

/** Parse a POWER monthly response into a ClimateSeries. Exported for tests. */
export function parseMonthly(
  json: PowerJson,
  meta: { name: string; lat: number; lon: number; startYear: number; endYear: number; url: string; origin: Provenance["origin"]; retrievedAt: string },
): ClimateSeries {
  const P = json.properties?.parameter;
  if (!P) throw new Error("POWER response has no properties.parameter");
  const fill = json.header?.fill_value ?? -999;
  const n = meta.endYear - meta.startYear + 1;
  const grids: Record<string, MonthlyGrid> = {};
  const units: Record<string, string> = {};
  for (const name of ["T2M_MAX", "T2M_MIN", "PRECTOTCORR"]) {
    const data = P[name];
    if (!data) throw new Error(`POWER response is missing ${name}`);
    const g = emptyGrid(n);
    for (const [key, v] of Object.entries(data)) {
      // keys are YYYYMM; YYYY13 is the annual value and is ignored on purpose
      if (!/^\d{6}$/.test(key)) continue;
      const y = Number(key.slice(0, 4));
      const m = Number(key.slice(4, 6));
      if (m < 1 || m > 12 || y < meta.startYear || y > meta.endYear) continue;
      g[y - meta.startYear][m - 1] = v === fill || !Number.isFinite(v) ? null : v;
    }
    grids[name] = g;
    units[name] = json.parameters?.[name]?.units ?? (name === "PRECTOTCORR" ? "mm/day" : "C");
  }
  if (units.PRECTOTCORR && !/mm\/day|mm\/d/i.test(units.PRECTOTCORR)) {
    throw new Error(`Unexpected rainfall units: ${units.PRECTOTCORR}`);
  }
  const provenance: Provenance = {
    origin: meta.origin,
    provider: "NASA POWER",
    dataset: "POWER Monthly (AG community)",
    endpoint: "/api/temporal/monthly/point",
    sourceUrl: meta.url,
    community: "AG",
    retrievedAt: meta.retrievedAt,
    parameters: ["T2M_MAX", "T2M_MIN", "PRECTOTCORR"],
    units,
    spatial: "NASA POWER grid (about 0.5 x 0.625 deg) - not a farm-level measurement",
    temporal: "monthly means",
    synthetic: false,
  };
  return {
    name: meta.name,
    lat: meta.lat,
    lon: meta.lon,
    startYear: meta.startYear,
    endYear: meta.endYear,
    tmax: grids.T2M_MAX,
    tmin: grids.T2M_MIN,
    rain: grids.PRECTOTCORR,
    tmaxDailySd: Array.from({ length: 12 }, () => null),
    provenance,
  };
}

/** The real, bundled Rajshahi series (NASA POWER daily 2001-2025 aggregated to monthly). */
export function rajshahiFixture(): ClimateSeries {
  const r = rajshahiRaw as unknown as {
    location: { name: string; lat: number; lon: number };
    startYear: number;
    endYear: number;
    tmax: MonthlyGrid;
    tmin: MonthlyGrid;
    rain: MonthlyGrid;
    tmaxDailySd: (number | null)[];
    provenance: {
      provider: string;
      dataset: string;
      endpoint: string;
      sourceUrl: string;
      community: string;
      retrievedAt: string;
      parameters: string[];
      units: Record<string, string>;
      sourceFileSha256: string;
      derived: string;
      spatial: string;
      temporal: string;
    };
  };
  return {
    name: r.location.name,
    lat: r.location.lat,
    lon: r.location.lon,
    startYear: r.startYear,
    endYear: r.endYear,
    tmax: r.tmax,
    tmin: r.tmin,
    rain: r.rain,
    tmaxDailySd: r.tmaxDailySd,
    provenance: {
      origin: "nasa-power-fixture",
      provider: r.provenance.provider,
      dataset: r.provenance.dataset,
      endpoint: r.provenance.endpoint,
      sourceUrl: r.provenance.sourceUrl,
      community: r.provenance.community,
      retrievedAt: r.provenance.retrievedAt,
      parameters: r.provenance.parameters,
      units: r.provenance.units,
      spatial: r.provenance.spatial,
      temporal: r.provenance.temporal,
      derived: r.provenance.derived,
      sourceFileSha256: r.provenance.sourceFileSha256,
      synthetic: false,
    },
  };
}

/** Same real Rajshahi data, relabelled so the UI can warn: "this is NOT data for your place". */
export function standInSeries(forName: string): ClimateSeries {
  const s = rajshahiFixture();
  return {
    ...s,
    provenance: {
      ...s.provenance,
      origin: "stand-in-fixture",
      standIn: true,
      note: `Live NASA POWER data for ${forName} could not be loaded. Showing the bundled Rajshahi series as a stand-in. It is NOT data for ${forName}.`,
    },
  };
}

function cacheKey(lat: number, lon: number): string {
  return `${CACHE_PREFIX}${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function readCache(lat: number, lon: number): ClimateSeries | null {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon));
    if (!raw) return null;
    const obj = JSON.parse(raw) as { savedAt: number; series: ClimateSeries };
    if (Date.now() - obj.savedAt > CACHE_TTL_MS) return null;
    return { ...obj.series, provenance: { ...obj.series.provenance, origin: "nasa-power-cache" } };
  } catch {
    return null;
  }
}

function writeCache(lat: number, lon: number, series: ClimateSeries): void {
  try {
    localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ savedAt: Date.now(), series }));
  } catch {
    /* storage may be unavailable (private mode / quota): the app works without it */
  }
}

async function getJson(url: string, timeoutMs: number, fetchImpl: typeof fetch): Promise<PowerJson> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`NASA POWER HTTP ${res.status}`);
    return (await res.json()) as PowerJson;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Load monthly NASA POWER data for a point. Order: cache (<= 14 days) -> live API.
 * The caller decides what to do on failure (the UI shows "Data unavailable" and offers the labelled stand-in).
 */
export async function loadPowerMonthly(
  name: string,
  lat: number,
  lon: number,
  opts: { fetchImpl?: typeof fetch; now?: Date; timeoutMs?: number; useCache?: boolean } = {},
): Promise<PowerResult> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const now = opts.now ?? new Date();
  const useCache = opts.useCache ?? true;
  if (useCache) {
    const c = readCache(lat, lon);
    if (c) return { ok: true, series: { ...c, name } };
  }
  // POWER monthly data lags real time; ask up to the previous calendar year to keep the request valid.
  const endYear = now.getUTCFullYear() - 1;
  const url = monthlyUrl(lat, lon, POWER_START_YEAR, endYear, ["T2M_MAX", "T2M_MIN", "PRECTOTCORR"]);
  try {
    const json = await getJson(url, opts.timeoutMs ?? 25000, fetchImpl);
    const series = parseMonthly(json, {
      name,
      lat,
      lon,
      startYear: POWER_START_YEAR,
      endYear,
      url,
      origin: "nasa-power-live",
      retrievedAt: now.toISOString(),
    });
    if (useCache) writeCache(lat, lon, series);
    return { ok: true, series };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Best-effort: day-to-day Tmax variability for a point (daily API, 2001-2025). Returns 12 SD values or null.
 * Only improves the heat-stress estimate; failing it is harmless.
 */
export async function loadTmaxDailySd(
  lat: number,
  lon: number,
  opts: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<number[] | null> {
  try {
    const url = dailyUrl(lat, lon, "20010101", "20251231", ["T2M_MAX"]);
    const json = await getJson(url, opts.timeoutMs ?? 40000, opts.fetchImpl ?? fetch);
    const data = json.properties?.parameter?.T2M_MAX;
    if (!data) return null;
    const fill = json.header?.fill_value ?? -999;
    const byYM = new Map<string, number[]>();
    for (const [d, v] of Object.entries(data)) {
      if (v === fill || !Number.isFinite(v)) continue;
      const key = d.slice(0, 6);
      const arr = byYM.get(key) ?? [];
      arr.push(v);
      byYM.set(key, arr);
    }
    const dev: number[][] = Array.from({ length: 12 }, () => []);
    for (const [key, arr] of byYM) {
      if (arr.length < 20) continue;
      const mu = arr.reduce((s, x) => s + x, 0) / arr.length;
      const m = Number(key.slice(4, 6)) - 1;
      for (const v of arr) dev[m].push(v - mu);
    }
    const sd = dev.map((a) => {
      if (a.length < 30) return NaN;
      const mu = a.reduce((s, x) => s + x, 0) / a.length;
      return Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / (a.length - 1));
    });
    return sd.every((x) => Number.isFinite(x)) ? sd : null;
  } catch {
    return null;
  }
}
