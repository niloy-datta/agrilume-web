import type {
  ClimateSeries,
  DataKind,
  MonthlyGrid,
  MonthlyYear,
  ScenarioSpec,
} from "./types";
import type { ProjectionPack } from "./projection-pack";

export const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_BN = [
  "জানু",
  "ফেব্রু",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/** Default day-to-day Tmax SD (degC) when a location has no daily data yet. Conservative mid value. */
export const DEFAULT_TMAX_SD = 2.0;

export function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(year: number, m0: number): number {
  return [31, isLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m0];
}

export function dayOfYear(year: number, m0: number, d: number): number {
  let n = d;
  for (let i = 0; i < m0; i++) n += daysInMonth(year, i);
  return n;
}

/** Month index (0-11) and day-of-month for a day-of-year. */
export function monthDayOf(year: number, doy: number): { m0: number; d: number } {
  let rest = doy;
  for (let m = 0; m < 12; m++) {
    const dm = daysInMonth(year, m);
    if (rest <= dm) return { m0: m, d: Math.max(1, rest) };
    rest -= dm;
  }
  return { m0: 11, d: 31 };
}

export interface Climatology {
  mean: number[];
  sd: number[];
  n: number[];
}

export function climatology(
  grid: MonthlyGrid,
  startYear: number,
  from: number,
  to: number,
): Climatology {
  const mean: number[] = [];
  const sd: number[] = [];
  const n: number[] = [];
  for (let m = 0; m < 12; m++) {
    const vals: number[] = [];
    for (let y = from; y <= to; y++) {
      const row = grid[y - startYear];
      const v = row?.[m];
      if (v != null && Number.isFinite(v)) vals.push(v);
    }
    n.push(vals.length);
    if (vals.length === 0) {
      mean.push(NaN);
      sd.push(NaN);
    } else {
      const mu = vals.reduce((s, x) => s + x, 0) / vals.length;
      mean.push(mu);
      sd.push(
        vals.length > 1
          ? Math.sqrt(vals.reduce((s, x) => s + (x - mu) ** 2, 0) / (vals.length - 1))
          : 0,
      );
    }
  }
  return { mean, sd, n };
}

export interface Trend {
  slope: number;
  intercept: number;
  se: number;
  t: number;
  n: number;
}

/** Ordinary least squares y = a + b x. Returns slope SE and t statistic. */
export function olsTrend(xs: number[], ys: number[]): Trend {
  const n = xs.length;
  if (n < 3) return { slope: 0, intercept: ys[0] ?? 0, se: Infinity, t: 0, n };
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let sse = 0;
  for (let i = 0; i < n; i++) sse += (ys[i] - (intercept + slope * xs[i])) ** 2;
  const se = Math.sqrt(sse / (n - 2) / sxx);
  return { slope, intercept, se, t: se > 0 ? slope / se : 0, n };
}

/** Annual mean of a variable for one year; requires >= 10 valid months. */
export function annualMean(grid: MonthlyGrid, startYear: number, year: number): number | null {
  const row = grid[year - startYear];
  if (!row) return null;
  const vals = row.filter((v): v is number => v != null && Number.isFinite(v));
  if (vals.length < 10) return null;
  return vals.reduce((s, x) => s + x, 0) / vals.length;
}

export function annualTrend(grid: MonthlyGrid, startYear: number, endYear: number): Trend {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const v = annualMean(grid, startYear, y);
    if (v != null) {
      xs.push(y);
      ys.push(v);
    }
  }
  return olsTrend(xs, ys);
}

export interface BaselineWindow {
  from: number;
  to: number;
}

/** WMO standard climate normal period. */
export const WMO_NORMAL: BaselineWindow = { from: 1991, to: 2020 };

/**
 * Default baseline: the WMO 1991-2020 normal when the record covers it (all 64 bundled NASA POWER district files
 * cover 1981-2025), otherwise every available year (e.g. the 2001-2025 Rajshahi daily fixture).
 */
export function defaultBaseline(series: ClimateSeries): BaselineWindow {
  if (series.startYear <= WMO_NORMAL.from && series.endYear >= WMO_NORMAL.to) return { ...WMO_NORMAL };
  return { from: series.startYear, to: series.endYear };
}

/**
 * Observed baseline used underneath a delta-method projection. The delta is a change relative to the model's own
 * historical window, so it must be added to observations averaged over the SAME window; otherwise the warming that
 * happened between the two windows is silently counted twice or dropped. Returns null if the record cannot cover it.
 */
export function deltaBaselineWindow(series: ClimateSeries, pack: ProjectionPack): BaselineWindow | null {
  const [from, to] = pack.deltaBaseline;
  if (from < series.startYear || to > series.endYear) return null;
  return { from, to };
}

export const MONSOON_MONTHS = [5, 6, 7, 8]; // Jun..Sep (0-based)

function clampRain(x: number): number {
  return x < 0 ? 0 : x;
}

/**
 * Monthly climate for one year under a scenario.
 *
 *  - years inside the observed record: the observed months (missing months filled with the
 *    multi-year mean and flagged `observed-filled`);
 *  - years after the record: multi-year mean + a temperature trend ONLY if it is statistically
 *    supported (|t| >= 2), + user what-if deltas.  This is *not* a climate-model projection;
 *  - with a NEX-GDDP-CMIP6 delta pack loaded and `mode: "pack"`: baseline mean + pack deltas.
 */
export function monthlyForYear(
  series: ClimateSeries,
  year: number,
  spec: ScenarioSpec,
  opts: { baseline?: BaselineWindow; pack?: ProjectionPack | null } = {},
): MonthlyYear {
  const base = opts.baseline ?? defaultBaseline(series);
  const climTmax = climatology(series.tmax, series.startYear, base.from, base.to);
  const climTmin = climatology(series.tmin, series.startYear, base.from, base.to);
  const climRain = climatology(series.rain, series.startYear, base.from, base.to);
  const notes: string[] = [];
  const sdArr = series.tmaxDailySd.map((v) => (v == null ? DEFAULT_TMAX_SD : v));
  if (series.tmaxDailySd.every((v) => v == null)) {
    notes.push(`Day-to-day Tmax variability uses a default of ${DEFAULT_TMAX_SD} °C (no daily data loaded).`);
  }

  let tmax: number[];
  let tmin: number[];
  let rain: number[];
  let kind: DataKind;

  const observed = year >= series.startYear && year <= series.endYear;
  if (observed) {
    let filled = false;
    const row = (g: MonthlyGrid, clim: Climatology) =>
      Array.from({ length: 12 }, (_, m) => {
        const v = g[year - series.startYear]?.[m];
        if (v != null && Number.isFinite(v)) return v;
        filled = true;
        return clim.mean[m];
      });
    tmax = row(series.tmax, climTmax);
    tmin = row(series.tmin, climTmin);
    rain = row(series.rain, climRain);
    kind = filled ? "observed-filled" : "observed";
    if (filled) notes.push("Some months of this year are missing; the multi-year mean was used for them.");
  } else {
    tmax = climTmax.mean.slice();
    tmin = climTmin.mean.slice();
    rain = climRain.mean.slice();
    const pack = spec.mode === "pack" && !series.provenance.standIn ? opts.pack : null;
    const packYear = pack?.years[String(year)];
    const packBase = pack ? deltaBaselineWindow(series, pack) : null;
    if (spec.mode === "pack" && opts.pack && series.provenance.standIn) {
      notes.push("Projection pack NOT applied: its deltas belong to the selected district, but the observations shown are a stand-in from another place.");
    }
    if (pack && packYear && packBase) {
      kind = "nasa-projection";
      const cTmax = climatology(series.tmax, series.startYear, packBase.from, packBase.to).mean;
      const cTmin = climatology(series.tmin, series.startYear, packBase.from, packBase.to).mean;
      const cRain = climatology(series.rain, series.startYear, packBase.from, packBase.to).mean;
      tmax = cTmax.slice();
      tmin = cTmin.slice();
      rain = cRain.slice();
      for (let m = 0; m < 12; m++) {
        tmax[m] += packYear.dTmax[m];
        tmin[m] += packYear.dTmin[m];
        rain[m] = clampRain(rain[m] * packYear.rainRatio[m]);
      }
      const projectionPeriod = pack.projectionWindow
        ? ` ${pack.projectionWindow[0]}-${pack.projectionWindow[1]} mean`
        : "";
      notes.push(
        `NASA NEX-GDDP-CMIP6 ${pack.scenario}${projectionPeriod} ${pack.ensemble} delta from ${pack.deltaBaseline[0]}-${pack.deltaBaseline[1]} applied to the observed NASA POWER ${packBase.from}-${packBase.to} mean (same window as the model baseline).`,
      );
      notes.push(
        `Only ${pack.deltaBaseline[1] - pack.deltaBaseline[0] + 1} baseline years: year-to-year noise in that short window adds uncertainty, especially for rainfall.`,
      );
      if (pack.rainRatioFallbackMonths?.length) {
        notes.push(
          "Rainfall change is left at 1× in months with zero or very low NEX historical precipitation because the multiplicative ratio is undefined or unstable.",
        );
      }
    } else {
      kind = "trend-what-if";
      if (spec.mode === "pack" && pack && packYear && !packBase) {
        notes.push("The observed record does not cover the projection pack's baseline window, so the pack was not applied.");
      } else if (spec.mode === "pack" && !series.provenance.standIn) {
        const win = opts.pack?.projectionWindow;
        notes.push(
          win
            ? `No NASA projection for ${year}: the bundled NEX-GDDP-CMIP6 pack only covers the ${win[0]}-${win[1]} mean (shown at ${Object.keys(opts.pack!.years).join(", ")}). Showing a labelled trend what-if instead.`
            : "No NEX-GDDP-CMIP6 projection pack for this place/year; showing the trend what-if instead.",
        );
      }
      const centre = (base.from + base.to) / 2;
      const tTmax = annualTrend(series.tmax, series.startYear, series.endYear);
      const tTmin = annualTrend(series.tmin, series.startYear, series.endYear);
      const supported = (t: { t: number }) => Math.abs(t.t) >= 2;
      if (supported(tTmax) && supported(tTmin)) {
        const dMax = tTmax.slope * (year - centre);
        const dMin = tTmin.slope * (year - centre);
        for (let m = 0; m < 12; m++) {
          tmax[m] += dMax;
          tmin[m] += dMin;
        }
        notes.push(
          `Observed warming trend applied (Tmax ${(tTmax.slope * 10).toFixed(2)} °C/decade, Tmin ${(tTmin.slope * 10).toFixed(2)} °C/decade).`,
        );
      } else {
        notes.push(
          "The observed temperature trend in this record is not statistically distinguishable from zero, so none was applied.",
        );
      }
      notes.push("Rainfall: no trend applied (monsoon rainfall varies too much from year to year for a reliable linear trend).");
    }
  }

  const perturbed = spec.dT !== 0 || spec.rainMonsoonPct !== 0 || spec.rainDryPct !== 0;
  if (perturbed) {
    for (let m = 0; m < 12; m++) {
      tmax[m] += spec.dT;
      tmin[m] += spec.dT;
      const pct = MONSOON_MONTHS.includes(m) ? spec.rainMonsoonPct : spec.rainDryPct;
      rain[m] = clampRain(rain[m] * (1 + pct / 100));
    }
    notes.push("User what-if deltas applied (temperature / rainfall).");
  }

  return { year, tmax, tmin, rain, tmaxSd: sdArr, kind, perturbed, notes };
}

/* ----------------------------- radiation & ET0 ----------------------------- */

/** Extraterrestrial radiation Ra in MJ m-2 day-1 (FAO-56 eq. 21). */
export function extraterrestrialRadiation(latDeg: number, doy: number): number {
  const phi = (latDeg * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * doy) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * doy) / 365 - 1.39);
  const x = Math.min(1, Math.max(-1, -Math.tan(phi) * Math.tan(delta)));
  const ws = Math.acos(x);
  const gsc = 0.082;
  return (
    ((24 * 60) / Math.PI) *
    gsc *
    dr *
    (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws))
  );
}

/** Hargreaves-Samani reference ET (mm/day). Only needs Tmax/Tmin/latitude. */
export function et0Hargreaves(latDeg: number, doy: number, tmax: number, tmin: number): number {
  const tmean = (tmax + tmin) / 2;
  const range = Math.max(0, tmax - tmin);
  const ra = extraterrestrialRadiation(latDeg, doy);
  return Math.max(0, 0.0023 * 0.408 * ra * (tmean + 17.8) * Math.sqrt(range));
}

/** Hargreaves solar radiation estimate Rs (MJ m-2 day-1). krs = 0.16 inland, 0.19 coastal. */
export function solarHargreaves(latDeg: number, doy: number, tmax: number, tmin: number, krs = 0.17): number {
  return krs * Math.sqrt(Math.max(0, tmax - tmin)) * extraterrestrialRadiation(latDeg, doy);
}

/* ------------------------------ daily weather ------------------------------ */

export interface DailyWeather {
  startYear: number;
  startDoy: number;
  tmax: number[];
  tmin: number[];
  rain: number[]; // mm/day
  tmaxSd: number[];
  et0: number[];
  rs: number[];
  doy: number[]; // doy within its own calendar year
  year: number[];
  /** calendar month 0-11 of each day */
  month: number[];
  kinds: DataKind[];
}

/**
 * Build smooth daily weather by interpolating monthly means between mid-month points.
 * `getYear(y)` must give the MonthlyYear for calendar year y (called for y and y+1 so seasons can cross New Year).
 * Interpolation of monthly means does NOT create realistic day-to-day weather; it only removes month-boundary jumps.
 */
export function buildDailyWeather(
  lat: number,
  getYear: (y: number) => MonthlyYear,
  startYear: number,
  startDoy: number,
  nDays: number,
): DailyWeather {
  const cache = new Map<number, MonthlyYear>();
  const get = (y: number) => {
    let v = cache.get(y);
    if (!v) {
      v = getYear(y);
      cache.set(y, v);
    }
    return v;
  };

  // Points: mid-month centres (as day index since Jan 1 of startYear) for years startYear-? .. +2
  const pts: { x: number; tmax: number; tmin: number; rain: number; sd: number }[] = [];
  let offset = 0;
  for (let y = startYear - 1; y <= startYear + 2; y++) {
    const my = get(y);
    if (y === startYear - 1) {
      offset = -(isLeap(y) ? 366 : 365);
    } else if (y === startYear) {
      offset = 0;
    } else {
      offset += isLeap(y - 1) ? 366 : 365;
    }
    let acc = 0;
    for (let m = 0; m < 12; m++) {
      const dm = daysInMonth(y, m);
      pts.push({
        x: offset + acc + dm / 2,
        tmax: my.tmax[m],
        tmin: my.tmin[m],
        rain: my.rain[m],
        sd: my.tmaxSd[m],
      });
      acc += dm;
    }
  }

  const out: DailyWeather = {
    startYear,
    startDoy,
    tmax: [],
    tmin: [],
    rain: [],
    tmaxSd: [],
    et0: [],
    rs: [],
    doy: [],
    year: [],
    month: [],
    kinds: [],
  };

  let y = startYear;
  let doy = startDoy;
  let abs = startDoy - 0.5; // day centre index since Jan 1 startYear
  let j = 0;
  for (let i = 0; i < nDays; i++) {
    while (j < pts.length - 2 && pts[j + 1].x <= abs) j++;
    const a = pts[j];
    const b = pts[j + 1];
    const f = Math.min(1, Math.max(0, (abs - a.x) / (b.x - a.x)));
    const tmax = a.tmax + (b.tmax - a.tmax) * f;
    const tmin = a.tmin + (b.tmin - a.tmin) * f;
    const rain = a.rain + (b.rain - a.rain) * f;
    const sd = a.sd + (b.sd - a.sd) * f;
    const { m0 } = monthDayOf(y, doy);
    out.tmax.push(tmax);
    out.tmin.push(tmin);
    out.rain.push(rain);
    out.tmaxSd.push(sd);
    out.et0.push(et0Hargreaves(lat, doy, tmax, tmin));
    out.rs.push(solarHargreaves(lat, doy, tmax, tmin));
    out.doy.push(doy);
    out.year.push(y);
    out.month.push(m0);
    out.kinds.push(get(y).kind);
    abs += 1;
    doy += 1;
    if (doy > (isLeap(y) ? 366 : 365)) {
      doy = 1;
      y += 1;
    }
  }
  return out;
}

/** Expected value of clamp((Tmax - thr)/range, 0, 1) for Tmax ~ N(mean, sd) using 5 fixed quantile nodes. */
export function expectedExceedance(mean: number, sd: number, thr: number, range: number): number {
  const z = [-2, -1, 0, 1, 2];
  const w = [0.054, 0.244, 0.403, 0.244, 0.054];
  let acc = 0;
  let ws = 0;
  for (let i = 0; i < z.length; i++) {
    const t = mean + z[i] * sd;
    acc += w[i] * Math.min(1, Math.max(0, (t - thr) / range));
    ws += w[i];
  }
  return acc / ws;
}
