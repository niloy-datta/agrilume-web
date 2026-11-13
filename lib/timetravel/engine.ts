import { annualMean, climatology, dayOfYear, daysInMonth, defaultBaseline, isLeap, monthDayOf, monthlyForYear } from "./climate";
import type { BaselineWindow } from "./climate";
import { CROPS, baselineSim, relativeIndex, simulateSeason, stageAtDay } from "./crops";
import type { CropId, HazardEvent, SeasonResult } from "./crops";
import { getDistrict } from "./locations";
import type { ProjectionPack } from "./projection-pack";
import type {
  ClimateSeries,
  DataKind,
  HazardType,
  IrrigationMode,
  Lang,
  MonthlyYear,
  RegionPreset,
  ScenarioSpec,
  StageId,
} from "./types";
import { DEFAULT_SCENARIO } from "./types";

export type CameraPreset = "overview" | "walk" | "closeup" | "drone" | "station";
export type TimeOfDayId = "dawn" | "day" | "dusk" | "night";

export type PanelId = "place" | "crop" | "data" | "hazard" | "recycle" | "gov" | "assistant" | "access" | "none";

export interface TTState {
  lang: Lang;
  districtId: string;
  custom: { lat: number; lon: number } | null;
  year: number;
  cropId: CropId;
  irrigation: IrrigationMode;
  soilEc: number;
  sowDoy: number;
  /** days after sowing (negative = before sowing / land preparation) */
  day: number;
  scenario: ScenarioSpec;
  events: HazardEvent[];
  tolerant: boolean;
  panel: PanelId;
  playing: boolean;
  /** which recycling pathway is highlighted in 3D */
  pathway: string | null;
  camera: CameraPreset;
  tod: TimeOfDayId;
}

export const MIN_YEAR = 1981;
export const MAX_YEAR = 2056;
export const CURRENT_YEAR = 2026;

export function initialState(now = new Date()): TTState {
  const y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, now.getFullYear()));
  return {
    lang: "bn",
    districtId: "rajshahi",
    custom: null,
    year: Math.min(y, 2025), // the bundled real series ends in 2025
    cropId: "boro",
    irrigation: "irrigated",
    soilEc: 1.5,
    sowDoy: CROPS.boro.defaultSowDoy,
    day: 60,
    scenario: { ...DEFAULT_SCENARIO },
    events: [],
    tolerant: false,
    panel: "place",
    playing: false,
    pathway: null,
    camera: "overview",
    tod: "day",
  };
}

export interface CalendarDate {
  year: number;
  m0: number;
  d: number;
  doy: number;
}

/** Calendar date `day` days after sowing (sowing in `sowYear` at `sowDoy`). Negative days go back in time. */
export function dateAtDay(sowYear: number, sowDoy: number, day: number): CalendarDate {
  let y = sowYear;
  let doy = sowDoy + day;
  while (doy > (isLeap(y) ? 366 : 365)) {
    doy -= isLeap(y) ? 366 : 365;
    y += 1;
  }
  while (doy < 1) {
    y -= 1;
    doy += isLeap(y) ? 366 : 365;
  }
  const { m0, d } = monthDayOf(y, doy);
  return { year: y, m0, d, doy };
}

/** 0 outside the event window; ramps up over the first quarter, plateaus, recedes over the last third. */
export function eventEnvelope(ev: HazardEvent, day: number): number {
  const t = day - ev.startDay;
  if (t < 0 || t >= ev.days) return 0;
  const up = Math.max(1, ev.days * 0.25);
  const down = Math.max(1, ev.days * 0.33);
  if (t < up) return (t + 1) / (up + 1);
  if (t > ev.days - down) return Math.max(0, (ev.days - t) / (down + 1));
  return 1;
}

export interface View {
  state: TTState;
  lat: number;
  lon: number;
  placeName: { bn: string; en: string };
  region: RegionPreset;
  monthly: MonthlyYear;
  dataKind: DataKind;
  baselineYear: MonthlyYear;
  baseline: BaselineWindow;
  sim: SeasonResult;
  base: SeasonResult;
  index: number;
  stage: StageId;
  frac: number;
  date: CalendarDate;
  annual: { tmax: number; tmin: number; rainMm: number; baseTmax: number; baseTmin: number; baseRainMm: number };
  lastObservedYear: number;
  isFuture: boolean;
  notes: string[];
}

export function annualRainMm(m: MonthlyYear): number {
  return m.rain.reduce((s, v, i) => s + v * daysInMonth(m.year, i), 0);
}

function averageYear(series: ClimateSeries, baseline: BaselineWindow): MonthlyYear {
  const c = (g: typeof series.tmax) => climatology(g, series.startYear, baseline.from, baseline.to).mean;
  return {
    year: Math.round((baseline.from + baseline.to) / 2),
    tmax: c(series.tmax),
    tmin: c(series.tmin),
    rain: c(series.rain),
    tmaxSd: series.tmaxDailySd.map((v) => (v == null ? 2 : v)),
    kind: "observed",
    perturbed: false,
    notes: [],
  };
}

export function resolvePlace(state: TTState): { lat: number; lon: number; name: { bn: string; en: string }; region: RegionPreset } {
  if (state.custom) {
    return {
      lat: state.custom.lat,
      lon: state.custom.lon,
      name: { bn: "নির্বাচিত বিন্দু", en: "Selected point" },
      region: "floodplain",
    };
  }
  const d = getDistrict(state.districtId) ?? getDistrict("rajshahi")!;
  return { lat: d.lat, lon: d.lon, name: { bn: d.nameBn, en: d.nameEn }, region: d.region };
}

export function computeView(
  state: TTState,
  series: ClimateSeries,
  pack: ProjectionPack | null,
  regionOverride?: RegionPreset,
): View {
  const place = resolvePlace(state);
  const crop = CROPS[state.cropId];
  const baseline = defaultBaseline(series);
  const baselineYear = averageYear(series, baseline);
  const getYear = (y: number) => monthlyForYear(series, y, state.scenario, { baseline, pack });
  const monthly = getYear(state.year);

  const common = {
    lat: place.lat,
    crop,
    sowYear: state.year,
    sowDoy: state.sowDoy,
    irrigation: state.irrigation,
    soilEc: state.soilEc,
    submergenceTolerant: state.tolerant,
  };
  const sim = simulateSeason({ ...common, getYear, events: state.events });
  const base = baselineSim(
    { lat: place.lat, crop, sowYear: state.year, sowDoy: state.sowDoy, irrigation: state.irrigation, soilEc: state.soilEc, submergenceTolerant: state.tolerant },
    baselineYear,
  );
  const { stage, frac } = stageAtDay(sim, state.day);
  const date = dateAtDay(state.year, state.sowDoy, state.day);

  const meanOf = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
  const annual = {
    tmax: meanOf(monthly.tmax),
    tmin: meanOf(monthly.tmin),
    rainMm: annualRainMm(monthly),
    baseTmax: meanOf(baselineYear.tmax),
    baseTmin: meanOf(baselineYear.tmin),
    baseRainMm: annualRainMm(baselineYear),
  };
  void annualMean; // exported helper kept for UI components

  return {
    state,
    lat: place.lat,
    lon: place.lon,
    placeName: place.name,
    region: regionOverride ?? place.region,
    monthly,
    dataKind: monthly.kind,
    baselineYear,
    baseline,
    sim,
    base,
    index: relativeIndex(sim, base),
    stage: state.day < 0 ? "landprep" : stage,
    frac,
    date,
    annual,
    lastObservedYear: series.endYear,
    isFuture: state.year > series.endYear,
    notes: monthly.notes,
  };
}

/* ------------------------------ 3D scene parameters ------------------------------ */

export interface SceneParams {
  region: RegionPreset;
  /** 0..1 relative plant height */
  growth: number;
  /** 0 green .. 1 golden */
  ripeness: number;
  /** after harvest: stubble only */
  harvested: boolean;
  /** 0..1 */
  rain: number;
  /** metres above field level, from a flood event */
  floodDepth: number;
  /** ponded water in the paddy (m) */
  paddyWater: number;
  /** 0..1 */
  dryness: number;
  /** 0..1 wind/cyclone strength */
  wind: number;
  /** 0..1 plants leaning */
  lodging: number;
  /** 0..1 heat haze / warm tint */
  heat: number;
  /** 0..1 salt crust on soil */
  salt: number;
  /** 0..1 wetness of the season (for lakes/canals) */
  wetness: number;
  /** 0..1 cloud cover */
  cloud: number;
  /** wilt 0..1 */
  wilt: number;
  /** is the crop a flooded-paddy crop */
  paddy: boolean;
  cropId: CropId;
  /** month 0..11 for colour grading of surroundings */
  month: number;
  irrigating: boolean;
}

export function sceneParams(view: View): SceneParams {
  const { state, sim } = view;
  const crop = CROPS[state.cropId];
  const day = state.day;
  const rec = sim.daily[Math.min(sim.daily.length - 1, Math.max(0, day))];
  const date = view.date;
  const monthRain = view.monthly.rain[date.m0]; // mm/day
  let flood = 0;
  let drought = 0;
  let cyclone = 0;
  let heatwave = 0;
  let saltEv = 0;
  let cycloneSev = 0;
  let floodSev = 0;
  for (const ev of state.events) {
    const e = eventEnvelope(ev, day);
    if (e <= 0) continue;
    if (ev.type === "flood") {
      flood = Math.max(flood, e);
      floodSev = Math.max(floodSev, ev.severity);
    } else if (ev.type === "drought") drought = Math.max(drought, e * ev.severity);
    else if (ev.type === "cyclone") {
      cyclone = Math.max(cyclone, e);
      cycloneSev = Math.max(cycloneSev, ev.severity);
    } else if (ev.type === "heatwave") heatwave = Math.max(heatwave, e * ev.severity);
    else if (ev.type === "salinity") saltEv = Math.max(saltEv, e * ev.severity);
  }
  const tmax = rec ? rec.tmax : view.monthly.tmax[date.m0];
  const frac = view.frac;
  const harvested = view.stage === "harvest";
  const growth = day < 0 ? 0 : harvested ? 0.06 : Math.min(1, Math.pow(Math.min(1, frac), 0.7));
  const ripeness = Math.min(1, Math.max(0, (frac - 0.7) / 0.28));
  const stress = rec ? rec.stress : 0;
  const ec = state.soilEc + 8 * saltEv + 4 * cycloneSev * cyclone;
  const salt = Math.min(1, Math.max(0, (ec - crop.salinity.thresholdDsM) / 7));
  const baseWind = Math.min(0.35, 0.12 + monthRain / 60);
  const wind = Math.max(baseWind, cyclone * (0.5 + 0.5 * cycloneSev));
  const rain = Math.min(1, ((rec?.rain ?? monthRain) / 25) + cyclone * 0.6 + flood * 0.35);
  const floodDepth = flood > 0 ? flood * (0.2 + 1.8 * floodSev) : 0;
  return {
    region: view.region,
    growth,
    ripeness: harvested ? 1 : ripeness,
    harvested,
    rain,
    floodDepth,
    paddyWater: crop.paddy && day >= 0 && view.stage !== "maturity" && !harvested ? 0.06 : 0,
    dryness: Math.min(1, Math.max(drought, stress * 0.9, monthRain < 0.4 ? 0.35 : 0)),
    wind,
    lodging: cyclone * cycloneSev * (frac > 0.5 ? 1 : 0.4),
    heat: Math.min(1, Math.max(heatwave, (tmax - 34) / 8)),
    salt,
    wetness: Math.min(1, Math.max(0, monthRain / 10)),
    cloud: Math.min(1, 0.15 + monthRain / 14 + cyclone * 0.6),
    wilt: Math.min(1, Math.max(0, stress * 1.2 + drought * 0.6)),
    paddy: crop.paddy,
    cropId: state.cropId,
    month: date.m0,
    irrigating: !!rec && rec.irrigation > 0,
  };
}

/* ------------------------------- helpers for UI ------------------------------- */

export function seasonLength(view: View): number {
  return Math.max(30, (view.sim.maturityDay ?? view.sim.daysSimulated) + 12);
}

export function activeHazards(state: TTState, day = state.day): HazardType[] {
  return state.events.filter((e) => eventEnvelope(e, day) > 0).map((e) => e.type);
}

export function sowDateLabel(year: number, doy: number, lang: Lang): string {
  const { m0, d } = monthDayOf(year, doy);
  const en = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m0];
  const bn = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"][m0];
  return lang === "bn" ? `${bn} ${d}` : `${en} ${d}`;
}

export { dayOfYear };
