import { buildDailyWeather, expectedExceedance } from "./climate";
import type { DailyWeather } from "./climate";
import type { HazardType, IrrigationMode, LocalizedText, MonthlyYear, StageId } from "./types";

/**
 * Educational crop simulator.
 *
 * This is a transparent radiation-use / thermal-time / water-balance model, NOT DSSAT or APSIM and NOT calibrated to
 * any variety. All parameters below are typical textbook-range defaults and are shown to the user as editable
 * assumptions. Its output is a *relative* performance index (baseline climate = 100), never tonnes per hectare and
 * never a forecast. For real planning use BRRI/BARI/DAE guidance and a calibrated crop model.
 */

export type CropId = "aman" | "boro" | "aus" | "wheat" | "maize";

export interface CropDef {
  id: CropId;
  nameEn: string;
  nameBn: string;
  paddy: boolean;
  /** thermal-time parameters (degC) */
  tbase: number;
  tcap: number;
  topt1: number;
  topt2: number;
  tmaxCrop: number;
  /** thermal time from sowing (seedbed for transplanted rice) to maturity, degC-days above tbase */
  gddMaturity: number;
  /** cumulative GDD fraction at the END of each stage */
  edges: Record<"germination" | "seedling" | "vegetative" | "reproductive" | "flowering" | "grainfill", number>;
  kc: { init: number; mid: number; end: number };
  heat: { threshold: number; range: number; maxLoss: number; stages: StageId[] };
  cold?: { threshold: number; range: number; maxLoss: number; stages: StageId[] };
  /** FAO Irrigation & Drainage Paper 29 (Maas-Hoffman) salinity response */
  salinity: { thresholdDsM: number; slopePctPerDsM: number };
  defaultSowDoy: number;
  /** typical duration range in days, for sanity display only */
  typicalDays: [number, number];
  seasonLabel: LocalizedText;
  /** plant height (m) by stage, used for submergence tolerance */
  heightM: Partial<Record<StageId, number>>;
  note: LocalizedText;
}

export const CROPS: Record<CropId, CropDef> = {
  aman: {
    id: "aman",
    nameEn: "T. Aman rice",
    nameBn: "আমন ধান",
    paddy: true,
    tbase: 10,
    tcap: 32,
    topt1: 25,
    topt2: 32,
    tmaxCrop: 40,
    gddMaturity: 2500,
    edges: { germination: 0.06, seedling: 0.2, vegetative: 0.5, reproductive: 0.6, flowering: 0.7, grainfill: 0.97 },
    kc: { init: 1.05, mid: 1.2, end: 0.9 },
    heat: { threshold: 35, range: 6, maxLoss: 0.6, stages: ["flowering"] },
    salinity: { thresholdDsM: 3.0, slopePctPerDsM: 12 },
    defaultSowDoy: 182,
    typicalDays: [110, 150],
    seasonLabel: { bn: "খরিফ-২ (জুলাই–নভেম্বর)", en: "Kharif-2 (Jul–Nov)" },
    heightM: { germination: 0.1, seedling: 0.25, vegetative: 0.6, reproductive: 0.9, flowering: 1.0, grainfill: 1.05, maturity: 1.05 },
    note: {
      bn: "বর্ষার ধান; বন্যা ও জলাবদ্ধতায় সহনশীল জাত (যেমন ব্রি ধান৫১, ৫২) আছে — ব্রি-র সাইটে যাচাই করুন।",
      en: "Monsoon rice; submergence-tolerant varieties exist (e.g. BRRI dhan51/52) — verify with BRRI.",
    },
  },
  boro: {
    id: "boro",
    nameEn: "Boro rice",
    nameBn: "বোরো ধান",
    paddy: true,
    tbase: 10,
    tcap: 32,
    topt1: 25,
    topt2: 32,
    tmaxCrop: 40,
    gddMaturity: 2000,
    edges: { germination: 0.06, seedling: 0.2, vegetative: 0.5, reproductive: 0.6, flowering: 0.7, grainfill: 0.97 },
    kc: { init: 1.05, mid: 1.2, end: 0.9 },
    heat: { threshold: 35, range: 6, maxLoss: 0.6, stages: ["flowering"] },
    cold: { threshold: 15, range: 5, maxLoss: 0.5, stages: ["reproductive", "flowering"] },
    salinity: { thresholdDsM: 3.0, slopePctPerDsM: 12 },
    defaultSowDoy: 335,
    typicalDays: [140, 165],
    seasonLabel: { bn: "রবি (ডিসেম্বর–মে)", en: "Rabi (Dec–May)" },
    heightM: { germination: 0.1, seedling: 0.25, vegetative: 0.6, reproductive: 0.9, flowering: 1.0, grainfill: 1.05, maturity: 1.05 },
    note: {
      bn: "শুকনো মৌসুমের সেচনির্ভর ধান; হাওরে আগাম বন্যা ও শীতজনিত বন্ধ্যাত্ব ঝুঁকি।",
      en: "Irrigated dry-season rice; haor flash-flood and cold-induced sterility are the main risks.",
    },
  },
  aus: {
    id: "aus",
    nameEn: "Aus rice",
    nameBn: "আউশ ধান",
    paddy: true,
    tbase: 10,
    tcap: 32,
    topt1: 25,
    topt2: 32,
    tmaxCrop: 40,
    gddMaturity: 2000,
    edges: { germination: 0.06, seedling: 0.2, vegetative: 0.5, reproductive: 0.6, flowering: 0.7, grainfill: 0.97 },
    kc: { init: 1.05, mid: 1.2, end: 0.9 },
    heat: { threshold: 35, range: 6, maxLoss: 0.6, stages: ["flowering"] },
    salinity: { thresholdDsM: 3.0, slopePctPerDsM: 12 },
    defaultSowDoy: 79,
    typicalDays: [100, 120],
    seasonLabel: { bn: "খরিফ-১ (মার্চ–জুলাই)", en: "Kharif-1 (Mar–Jul)" },
    heightM: { germination: 0.1, seedling: 0.25, vegetative: 0.6, reproductive: 0.9, flowering: 1.0, grainfill: 1.05, maturity: 1.05 },
    note: {
      bn: "আগাম বর্ষার বৃষ্টিনির্ভর ধান; প্রাক-বর্ষা তাপ ও খরায় ঝুঁকি।",
      en: "Rain-fed pre-monsoon rice; exposed to pre-monsoon heat and dry spells.",
    },
  },
  wheat: {
    id: "wheat",
    nameEn: "Wheat",
    nameBn: "গম",
    paddy: false,
    tbase: 0,
    tcap: 25,
    topt1: 15,
    topt2: 24,
    tmaxCrop: 35,
    gddMaturity: 2100,
    edges: { germination: 0.05, seedling: 0.18, vegetative: 0.45, reproductive: 0.6, flowering: 0.7, grainfill: 0.97 },
    kc: { init: 0.4, mid: 1.15, end: 0.3 },
    heat: { threshold: 30, range: 6, maxLoss: 0.5, stages: ["flowering", "grainfill"] },
    salinity: { thresholdDsM: 6.0, slopePctPerDsM: 7.1 },
    defaultSowDoy: 324,
    typicalDays: [100, 120],
    seasonLabel: { bn: "রবি (নভেম্বর–মার্চ)", en: "Rabi (Nov–Mar)" },
    heightM: { germination: 0.05, seedling: 0.15, vegetative: 0.4, reproductive: 0.7, flowering: 0.8, grainfill: 0.85, maturity: 0.85 },
    note: {
      bn: "শীতকালীন ফসল; দেরিতে বপন করলে শেষ দিকের তাপে ক্ষতি বাড়ে। জলাবদ্ধতায় খুব স্পর্শকাতর।",
      en: "Cool-season crop; late sowing raises terminal-heat loss. Very sensitive to waterlogging.",
    },
  },
  maize: {
    id: "maize",
    nameEn: "Maize (rabi)",
    nameBn: "ভুট্টা (রবি)",
    paddy: false,
    tbase: 10,
    tcap: 30,
    topt1: 22,
    topt2: 30,
    tmaxCrop: 40,
    gddMaturity: 1750,
    edges: { germination: 0.05, seedling: 0.18, vegetative: 0.5, reproductive: 0.58, flowering: 0.68, grainfill: 0.97 },
    kc: { init: 0.3, mid: 1.2, end: 0.6 },
    heat: { threshold: 35, range: 6, maxLoss: 0.6, stages: ["flowering"] },
    salinity: { thresholdDsM: 1.7, slopePctPerDsM: 12 },
    defaultSowDoy: 329,
    typicalDays: [130, 160],
    seasonLabel: { bn: "রবি (নভেম্বর–এপ্রিল)", en: "Rabi (Nov–Apr)" },
    heightM: { germination: 0.05, seedling: 0.2, vegetative: 1.0, reproductive: 1.8, flowering: 2.0, grainfill: 2.1, maturity: 2.1 },
    note: {
      bn: "লবণাক্ততা ও জলাবদ্ধতায় সংবেদনশীল; ফুল আসার সময় সেচ জরুরি।",
      en: "Sensitive to salinity and waterlogging; irrigation at flowering is critical.",
    },
  },
};

export const CROP_LIST: CropDef[] = Object.values(CROPS);

/** Returns a list of problems with a crop definition (empty = valid). Guards against silently nonsensical parameters. */
export function cropDefProblems(def: CropDef): string[] {
  const p: string[] = [];
  const fin = (x: number) => typeof x === "number" && Number.isFinite(x);
  if (![def.tbase, def.topt1, def.topt2, def.tmaxCrop, def.tcap, def.gddMaturity].every(fin)) p.push("non-finite temperature/GDD parameter");
  if (!(def.tbase < def.topt1 && def.topt1 <= def.topt2 && def.topt2 < def.tmaxCrop)) p.push("need tbase < topt1 <= topt2 < tmaxCrop");
  if (!(def.tcap > def.tbase)) p.push("tcap must exceed tbase");
  if (!(def.gddMaturity > 0)) p.push("gddMaturity must be positive");
  for (const k of ["init", "mid", "end"] as const) if (!(def.kc[k] > 0 && def.kc[k] < 2)) p.push(`kc.${k} outside (0, 2)`);
  if (!(def.heat.maxLoss >= 0 && def.heat.maxLoss <= 1) || !(def.heat.range > 0)) p.push("heat loss parameters invalid");
  if (def.cold && (!(def.cold.maxLoss >= 0 && def.cold.maxLoss <= 1) || !(def.cold.range > 0))) p.push("cold loss parameters invalid");
  if (!(def.salinity.thresholdDsM >= 0 && def.salinity.slopePctPerDsM >= 0)) p.push("salinity parameters invalid");
  return p;
}

export const STAGE_ORDER: StageId[] = [
  "landprep",
  "germination",
  "seedling",
  "vegetative",
  "reproductive",
  "flowering",
  "grainfill",
  "maturity",
  "harvest",
];

export const STAGE_LABEL: Record<StageId, LocalizedText> = {
  landprep: { bn: "জমি তৈরি", en: "Land preparation" },
  germination: { bn: "অঙ্কুরোদগম", en: "Germination" },
  seedling: { bn: "চারা অবস্থা", en: "Seedling" },
  vegetative: { bn: "বৃদ্ধি পর্যায়", en: "Vegetative growth" },
  reproductive: { bn: "থোড় / কুশি পর্যায়", en: "Booting / reproductive" },
  flowering: { bn: "ফুল আসা", en: "Flowering" },
  grainfill: { bn: "দানা পুষ্টি", en: "Grain filling" },
  maturity: { bn: "পরিপক্বতা", en: "Maturity" },
  harvest: { bn: "ফসল কাটা", en: "Harvest" },
};

export function stageAtFraction(def: CropDef, frac: number): StageId {
  const e = def.edges;
  if (frac < e.germination) return "germination";
  if (frac < e.seedling) return "seedling";
  if (frac < e.vegetative) return "vegetative";
  if (frac < e.reproductive) return "reproductive";
  if (frac < e.flowering) return "flowering";
  if (frac < e.grainfill) return "grainfill";
  return "maturity";
}

export function kcAtFraction(def: CropDef, frac: number): number {
  const { init, mid, end } = def.kc;
  if (frac < 0.2) return init;
  if (frac < 0.5) return init + ((mid - init) * (frac - 0.2)) / 0.3;
  if (frac < 0.85) return mid;
  return mid + (end - mid) * Math.min(1, (frac - 0.85) / 0.15);
}

export function canopyAtFraction(frac: number): number {
  if (frac < 0.35) return Math.max(0.05, frac / 0.35);
  if (frac < 0.85) return 1;
  return 1 - 0.4 * Math.min(1, (frac - 0.85) / 0.15);
}

/** Trapezoid temperature response 0..1 */
export function tempResponse(def: CropDef, t: number): number {
  if (t <= def.tbase || t >= def.tmaxCrop) return 0;
  if (t < def.topt1) return (t - def.tbase) / (def.topt1 - def.tbase);
  if (t <= def.topt2) return 1;
  return (def.tmaxCrop - t) / (def.tmaxCrop - def.topt2);
}

export interface HazardEvent {
  type: HazardType;
  /** days after sowing when the event starts (0 = sowing day) */
  startDay: number;
  days: number;
  /** 0..1 educational severity slider */
  severity: number;
}

export interface SimInput {
  lat: number;
  crop: CropDef;
  sowYear: number;
  sowDoy: number;
  getYear: (y: number) => MonthlyYear;
  irrigation: IrrigationMode;
  /** background root-zone salinity ECe (dS/m) */
  soilEc: number;
  /** plant-available water in the root zone (mm) for upland crops */
  whcMm?: number;
  submergenceTolerant?: boolean;
  events?: HazardEvent[];
}

export interface DayRecord {
  day: number;
  frac: number;
  stage: StageId;
  tmax: number;
  tmin: number;
  rain: number;
  et0: number;
  irrigation: number;
  stress: number;
}

export interface SeasonResult {
  matured: boolean;
  maturityDay: number | null;
  daysSimulated: number;
  stageStartDay: Partial<Record<StageId, number>>;
  daily: DayRecord[];
  totals: { rainMm: number; et0Mm: number; irrigationMm: number; etcMm: number };
  loss: { heat: number; cold: number; water: number; salinity: number; flood: number; cyclone: number };
  /** Σ radiation × canopy × temperature response × (1 − water stress), before event/stress multipliers. Unitless proxy. */
  growthProxy: number;
  /** growthProxy after all multiplicative losses. Compare only against another run of the same crop. */
  yieldProxy: number;
  endDoy: number;
  endYear: number;
  notes: string[];
}

const MAX_DAYS = 250;

export function simulateSeason(input: SimInput): SeasonResult {
  const { crop, lat } = input;
  const events = input.events ?? [];
  const whc = input.whcMm ?? 120;
  const problems = cropDefProblems(crop);
  if (problems.length) throw new Error(`invalid crop "${crop.id}": ${problems.join("; ")}`);
  if (!Number.isFinite(input.soilEc) || input.soilEc < 0) throw new Error("soilEc must be a finite, non-negative dS/m value");
  const weather: DailyWeather = buildDailyWeather(lat, input.getYear, input.sowYear, input.sowDoy, MAX_DAYS);
  for (const arr of [weather.tmax, weather.tmin, weather.rain]) {
    if (arr.some((v) => !Number.isFinite(v))) throw new Error("weather contains missing/non-finite values; refusing to simulate");
  }

  // Apply hazard modifications to the daily weather
  let ecEff = input.soilEc;
  const rain = weather.rain.slice();
  const tmaxArr = weather.tmax.slice();
  const et0Arr = weather.et0.slice();
  const notes: string[] = [];
  for (const ev of events) {
    const s = Math.max(0, ev.severity);
    for (let d = Math.max(0, ev.startDay); d < Math.min(MAX_DAYS, ev.startDay + ev.days); d++) {
      if (ev.type === "drought") {
        rain[d] = 0;
        et0Arr[d] *= 1 + 0.15 * s;
      } else if (ev.type === "heatwave") {
        tmaxArr[d] += 2 + 6 * s;
      } else if (ev.type === "cyclone") {
        rain[d] += 50 + 150 * s;
      } else if (ev.type === "flood") {
        rain[d] += 20 + 60 * s;
      }
    }
    if (ev.type === "salinity") ecEff += 8 * s;
    if (ev.type === "cyclone") ecEff += 4 * s; // storm-surge salt (coastal only in the UI)
  }

  const daily: DayRecord[] = [];
  const stageStartDay: Partial<Record<StageId, number>> = {};
  let gdd = 0;
  let growth = 0;
  let irrTotal = 0;
  let rainTotal = 0;
  let et0Total = 0;
  let etcTotal = 0;
  let heatAcc = 0;
  let heatDays = 0;
  let coldAcc = 0;
  let coldDays = 0;
  let waterStressAcc = 0;
  let matured = false;
  let maturityDay: number | null = null;

  // water state
  let ponded = 20; // paddy: mm of standing water (negative = soil water deficit)
  let sw = 0.7 * whc; // upland soil water (mm)

  const stressSens: Partial<Record<StageId, number>> = {
    germination: 0.5,
    seedling: 0.4,
    vegetative: 0.6,
    reproductive: 1,
    flowering: 1,
    grainfill: 0.8,
    maturity: 0,
  };

  let d = 0;
  for (; d < MAX_DAYS; d++) {
    const tmin = weather.tmin[d];
    const tmax = tmaxArr[d];
    const tm = (tmax + tmin) / 2;
    gdd += Math.max(0, Math.min(tm, crop.tcap) - crop.tbase);
    const frac = Math.min(1.2, gdd / crop.gddMaturity);
    const stage = stageAtFraction(crop, frac);
    if (stageStartDay[stage] === undefined) stageStartDay[stage] = d;

    const et0 = et0Arr[d];
    const etc = kcAtFraction(crop, frac) * et0;
    const r = rain[d];
    let irr = 0;
    let stress = 0;

    if (crop.paddy) {
      const seep = 3.0 * (input.irrigation === "awd" ? 0.75 : 1);
      const prep = d < 12 ? 8 : 0; // puddling / land preparation water (assumption)
      const demand = etc + seep + prep;
      ponded += r - demand;
      if (ponded > 100) ponded = 100; // bund overflow
      if (input.irrigation === "irrigated") {
        if (ponded < 10) {
          irr = 40 - ponded;
          ponded = 40;
        }
      } else if (input.irrigation === "awd") {
        if (ponded < -30) {
          irr = 20 - ponded;
          ponded = 20;
        }
      } else if (ponded < -60) {
        stress = Math.min(1, (-ponded - 60) / 60);
        if (ponded < -120) ponded = -120;
      }
    } else {
      const ks = Math.max(0, Math.min(1, sw / (0.5 * whc)));
      const eta = etc * ks;
      stress = 1 - ks;
      sw = Math.min(whc, sw + r - eta);
      if (sw < 0) sw = 0;
      if (input.irrigation !== "rainfed" && sw < 0.5 * whc) {
        irr = 0.9 * whc - sw;
        sw = 0.9 * whc;
        stress = 0;
      }
    }
    irrTotal += irr;
    rainTotal += r;
    et0Total += et0;
    etcTotal += etc;

    // Growth proxy
    const canopy = canopyAtFraction(frac);
    const g = weather.rs[d] * canopy * tempResponse(crop, tm);
    const sens = stressSens[stage] ?? 0;
    growth += g * (1 - Math.min(1, sens * stress));
    waterStressAcc += stress * sens;

    // Heat / cold windows
    if (crop.heat.stages.includes(stage)) {
      heatAcc += expectedExceedance(tmax, weather.tmaxSd[d], crop.heat.threshold, crop.heat.range);
      heatDays += 1;
    }
    if (crop.cold && crop.cold.stages.includes(stage)) {
      coldAcc += Math.min(1, Math.max(0, (crop.cold.threshold - tmin) / crop.cold.range));
      coldDays += 1;
    }

    daily.push({ day: d, frac, stage, tmax, tmin, rain: r, et0, irrigation: irr, stress });

    if (gdd >= crop.gddMaturity) {
      matured = true;
      maturityDay = d;
      d += 1;
      break;
    }
  }

  const growthDays = daily.filter((x) => (stressSens[x.stage] ?? 0) > 0).length;
  const lossHeat = heatDays > 0 ? (heatAcc / heatDays) * crop.heat.maxLoss : 0;
  const lossCold = crop.cold && coldDays > 0 ? (coldAcc / coldDays) * crop.cold.maxLoss : 0;
  const lossWater = growthDays > 0 ? Math.min(1, waterStressAcc / growthDays) : 0;

  // Salinity (FAO-29 linear response)
  let lossSal = 0;
  if (ecEff > crop.salinity.thresholdDsM) {
    lossSal = Math.min(1, ((ecEff - crop.salinity.thresholdDsM) * crop.salinity.slopePctPerDsM) / 100);
  }

  // Flood & cyclone events
  const lossFlood = floodLoss(events, daily, crop, input.submergenceTolerant ?? false);
  const lossCyclone = cycloneLoss(events, daily);

  const yieldProxy =
    growth * (1 - lossHeat) * (1 - lossCold) * (1 - lossSal) * (1 - lossFlood) * (1 - lossCyclone);

  if (!matured) notes.push("The crop did not reach maturity within 250 days under this climate (too cool/short season).");

  const end = weather.doy[Math.max(0, daily.length - 1)];
  const endYear = weather.year[Math.max(0, daily.length - 1)];

  return {
    matured,
    maturityDay,
    daysSimulated: daily.length,
    stageStartDay,
    daily,
    totals: { rainMm: rainTotal, et0Mm: et0Total, irrigationMm: irrTotal, etcMm: etcTotal },
    loss: { heat: lossHeat, cold: lossCold, water: lossWater, salinity: lossSal, flood: lossFlood, cyclone: lossCyclone },
    growthProxy: growth,
    yieldProxy,
    endDoy: end,
    endYear,
    notes,
  };
}

function stageHeightAt(crop: CropDef, daily: DayRecord[], day: number): { stage: StageId; h: number } {
  const rec = daily[Math.min(daily.length - 1, Math.max(0, day))];
  const stage = rec?.stage ?? "germination";
  const h = crop.heightM[stage] ?? 0.5;
  return { stage, h };
}

function floodLoss(events: HazardEvent[], daily: DayRecord[], crop: CropDef, tolerant: boolean): number {
  let keep = 1;
  for (const ev of events) {
    if (ev.type !== "flood" || ev.startDay >= daily.length) continue;
    const depth = 0.2 + 1.8 * ev.severity; // m, educational mapping
    const { stage, h } = stageHeightAt(crop, daily, ev.startDay);
    let loss: number;
    if (crop.paddy) {
      if (depth >= 0.95 * h) {
        const tol = tolerant ? 14 : 7;
        const stageFactor = stage === "reproductive" || stage === "flowering" ? 1.0 : stage === "germination" || stage === "seedling" ? 1.0 : 0.9;
        loss = Math.min(1, Math.max(0, (ev.days - 3) / (tol - 3))) * stageFactor;
      } else {
        loss = Math.min(0.5, 0.012 * ev.days);
      }
    } else {
      loss = depth > 0.05 ? Math.min(0.95, Math.max(0, (ev.days - 1) / 6) * 0.9) : 0;
    }
    keep *= 1 - loss;
  }
  return 1 - keep;
}

function cycloneLoss(events: HazardEvent[], daily: DayRecord[]): number {
  const sens: Partial<Record<StageId, number>> = {
    germination: 0.05,
    seedling: 0.1,
    vegetative: 0.2,
    reproductive: 0.6,
    flowering: 0.8,
    grainfill: 0.9,
    maturity: 0.9,
  };
  let keep = 1;
  for (const ev of events) {
    if (ev.type !== "cyclone" || ev.startDay >= daily.length) continue;
    const wind = 60 + 160 * ev.severity; // km/h, educational mapping
    const wf = Math.min(1, Math.max(0, (wind - 60) / 120));
    const stage = daily[ev.startDay].stage;
    keep *= 1 - wf * (sens[stage] ?? 0.2) * 0.8;
  }
  return 1 - keep;
}

/** Average-year MonthlyYear function (baseline for the relative index). */
export function baselineSim(
  base: Omit<SimInput, "getYear" | "events">,
  baselineYear: MonthlyYear,
): SeasonResult {
  return simulateSeason({ ...base, getYear: () => baselineYear, events: [] });
}

/** Relative performance index: 100 = same crop & management under the baseline climate. */
export function relativeIndex(scenario: SeasonResult, baseline: SeasonResult): number {
  if (baseline.yieldProxy <= 0) return 0;
  return (100 * scenario.yieldProxy) / baseline.yieldProxy;
}

export function stageAtDay(result: SeasonResult, day: number): { stage: StageId; frac: number } {
  if (day < 0) return { stage: "landprep", frac: 0 };
  const rec = result.daily[Math.min(result.daily.length - 1, day)];
  if (!rec) return { stage: "landprep", frac: 0 };
  if (result.matured && result.maturityDay !== null && day > result.maturityDay) return { stage: "harvest", frac: 1 };
  return { stage: rec.stage, frac: Math.min(1, rec.frac) };
}

export function irrigationLabel(mode: IrrigationMode): LocalizedText {
  return {
    rainfed: { bn: "বৃষ্টিনির্ভর", en: "Rain-fed" },
    irrigated: { bn: "নিয়মিত সেচ", en: "Irrigated" },
    awd: { bn: "জল সাশ্রয়ী (AWD)", en: "Alternate wetting & drying (AWD)" },
  }[mode];
}
