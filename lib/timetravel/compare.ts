/**
 * Scenario A vs Scenario B comparison for one district + crop + sowing date.
 *
 * Both scenarios are run through exactly the same educational crop model; every number is traceable to
 * (a) observed NASA POWER data, (b) a NEX-GDDP-CMIP6 projection, or (c) a user what-if, and each scenario reports
 * which of those it used. The "explanations" are generated from the computed differences with fixed, documented
 * thresholds — they are not recommendations and contain no fertiliser / pesticide / irrigation quantities.
 */
import { monthlyForYear } from "./climate";
import { CROPS, baselineSim, relativeIndex, simulateSeason } from "./crops";
import type { CropId, SeasonResult } from "./crops";
import type { ProjectionPack } from "./projection-pack";
import type { ClimateSeries, DataKind, IrrigationMode, LocalizedText, MonthlyYear, ScenarioSpec } from "./types";
import { climatology } from "./climate";
import { defaultBaseline } from "./climate";
import { asciiToBnDigits } from "./locations";

export interface ScenarioInput {
  label: string;
  year: number;
  scenario: ScenarioSpec;
  irrigation: IrrigationMode;
  sowDoy: number;
}

export interface ScenarioMetrics {
  label: string;
  year: number;
  dataKind: DataKind;
  /** rain falling during the simulated season (mm) */
  seasonRainMm: number;
  /** mean daily Tmax over the season (degC) */
  seasonTmaxC: number;
  /** days in the season with Tmax >= the crop's heat threshold (daily values are smoothed monthly means) */
  hotDays: number;
  /** 0..1, mean water stress weighted by stage sensitivity */
  waterStress: number;
  /** modelled irrigation need (mm) — the model's water-balance output, NOT an irrigation prescription */
  irrigationMm: number;
  /** relative crop-condition index, baseline climate = 100 */
  index: number;
  matured: boolean;
  seasonDays: number;
  notes: string[];
}

export interface Comparison {
  a: ScenarioMetrics;
  b: ScenarioMetrics;
  diff: { rainMm: number; tmaxC: number; hotDays: number; waterStress: number; irrigationMm: number; index: number };
  explanations: LocalizedText[];
  caveats: LocalizedText[];
}

function averageYear(series: ClimateSeries): MonthlyYear {
  const base = defaultBaseline(series);
  const c = (g: typeof series.tmax) => climatology(g, series.startYear, base.from, base.to).mean;
  return {
    year: Math.round((base.from + base.to) / 2),
    tmax: c(series.tmax),
    tmin: c(series.tmin),
    rain: c(series.rain),
    tmaxSd: series.tmaxDailySd.map((v) => v ?? 2),
    kind: "observed",
    perturbed: false,
    notes: [],
  };
}

export function runScenario(
  series: ClimateSeries,
  pack: ProjectionPack | null,
  cropId: CropId,
  input: ScenarioInput,
): { metrics: ScenarioMetrics; result: SeasonResult } {
  const crop = CROPS[cropId];
  const getYear = (y: number) => monthlyForYear(series, y, input.scenario, { pack });
  const common = { lat: series.lat, crop, sowYear: input.year, sowDoy: input.sowDoy, irrigation: input.irrigation, soilEc: 1 };
  const result = simulateSeason({ ...common, getYear, events: [] });
  const base = baselineSim(common, averageYear(series));
  const n = result.daily.length;
  const sens = result.daily.length ? result.loss.water : 0;
  const yr = getYear(input.year);
  return {
    result,
    metrics: {
      label: input.label,
      year: input.year,
      dataKind: yr.kind,
      seasonRainMm: result.totals.rainMm,
      seasonTmaxC: n ? result.daily.reduce((s, d) => s + d.tmax, 0) / n : NaN,
      hotDays: result.daily.filter((d) => d.tmax >= crop.heat.threshold).length,
      waterStress: sens,
      irrigationMm: result.totals.irrigationMm,
      index: relativeIndex(result, base),
      matured: result.matured,
      seasonDays: n,
      notes: [...yr.notes, ...result.notes],
    },
  };
}

const sign = (x: number, d = 0) => `${x > 0 ? "+" : x < 0 ? "−" : "±"}${Math.abs(x).toFixed(d)}`;

export function compareScenarios(
  series: ClimateSeries,
  pack: ProjectionPack | null,
  cropId: CropId,
  a: ScenarioInput,
  b: ScenarioInput,
): Comparison {
  const A = runScenario(series, pack, cropId, a).metrics;
  const B = runScenario(series, pack, cropId, b).metrics;
  const diff = {
    rainMm: B.seasonRainMm - A.seasonRainMm,
    tmaxC: B.seasonTmaxC - A.seasonTmaxC,
    hotDays: B.hotDays - A.hotDays,
    waterStress: B.waterStress - A.waterStress,
    irrigationMm: B.irrigationMm - A.irrigationMm,
    index: B.index - A.index,
  };
  const crop = CROPS[cropId];
  const ex: LocalizedText[] = [];
  // Fixed thresholds below are presentation thresholds ("is the difference worth mentioning?"), not agronomic limits.
  if (Math.abs(diff.tmaxC) >= 0.3)
    ex.push({
      en: `Scenario B is ${sign(diff.tmaxC, 1)} °C ${diff.tmaxC > 0 ? "hotter" : "cooler"} on average during the season.`,
      bn: `মৌসুমজুড়ে খ সম্ভাবনায় গড়ে ${sign(diff.tmaxC, 1)} °C ${diff.tmaxC > 0 ? "বেশি গরম" : "কম গরম"}।`,
    });
  const dLen = B.seasonDays - A.seasonDays;
  if (Math.abs(dLen) >= 5)
    ex.push({
      en: `The crop takes ${Math.abs(dLen)} days ${dLen < 0 ? "less" : "more"} to mature in B: ${dLen < 0 ? "warmer weather speeds development, which can shorten grain filling" : "cooler weather slows development"}.`,
      bn: `খ-তে ফসল পাকতে ${Math.abs(dLen)} দিন ${dLen < 0 ? "কম" : "বেশি"} লাগে: ${dLen < 0 ? "গরমে বৃদ্ধি দ্রুত হয়, দানা ভরার সময় কমতে পারে" : "ঠান্ডায় বৃদ্ধি ধীর হয়"}।`,
    });
  if (Math.abs(diff.hotDays) >= 1)
    ex.push({
      en: `${sign(diff.hotDays)} days reach ${crop.heat.threshold} °C or more — the temperature above which this model starts counting heat damage for ${crop.nameEn}.`,
      bn: `${sign(diff.hotDays)} দিন তাপমাত্রা ${crop.heat.threshold} °C ছাড়ায় — এই মডেলে ${crop.nameBn}-এর তাপজনিত ক্ষতি এখান থেকে গোনা শুরু হয়।`,
    });
  if (A.seasonRainMm > 0 && Math.abs(diff.rainMm) / A.seasonRainMm >= 0.05)
    ex.push({
      en: `Season rainfall changes by ${sign(diff.rainMm)} mm (${sign((100 * diff.rainMm) / A.seasonRainMm)} %).`,
      bn: `মৌসুমের বৃষ্টি ${sign(diff.rainMm)} মিমি (${sign((100 * diff.rainMm) / A.seasonRainMm)}%) বদলায়।`,
    });
  if (Math.abs(diff.irrigationMm) >= 20)
    ex.push({
      en: `The model's water balance needs ${sign(diff.irrigationMm)} mm ${diff.irrigationMm > 0 ? "more" : "less"} added water to keep the crop unstressed (a model estimate, not an irrigation schedule).`,
      bn: `মডেলের পানির হিসাবে ফসলকে চাপমুক্ত রাখতে ${sign(diff.irrigationMm)} মিমি ${diff.irrigationMm > 0 ? "বেশি" : "কম"} পানি লাগে (মডেলের অনুমান, সেচের সময়সূচি নয়)।`,
    });
  if (Math.abs(diff.waterStress) >= 0.03)
    ex.push({
      en: `Water stress at sensitive stages is ${diff.waterStress > 0 ? "higher" : "lower"} in B (${(100 * A.waterStress).toFixed(0)} % → ${(100 * B.waterStress).toFixed(0)} %).`,
      bn: `সংবেদনশীল পর্যায়ে পানির চাপ খ-তে ${diff.waterStress > 0 ? "বেশি" : "কম"} (${(100 * A.waterStress).toFixed(0)}% → ${(100 * B.waterStress).toFixed(0)}%)।`,
    });
  if (!ex.length) ex.push({ en: "The two scenarios are very similar for this crop and date.", bn: "এই ফসল ও তারিখে দুই সম্ভাবনা প্রায় একই রকম।" });
  ex.push({
    en: `Net effect in the model: crop-condition index ${A.index.toFixed(0)} → ${B.index.toFixed(0)} (${sign(diff.index)} points; 100 = average past climate).`,
    bn: `মডেলে মোট প্রভাব: ফসল-অবস্থা সূচক ${A.index.toFixed(0)} → ${B.index.toFixed(0)} (${sign(diff.index)} পয়েন্ট; ১০০ = অতীতের গড় আবহাওয়া)।`,
  });

  const caveats: LocalizedText[] = [
    {
      en: "Educational model, not calibrated against Bangladesh yield data. The index is relative (100 = average past climate), not tonnes per hectare.",
      bn: "শিক্ষামূলক মডেল, বাংলাদেশের ফলনের তথ্যে মিলিয়ে দেখা হয়নি। সূচকটি আপেক্ষিক (১০০ = অতীতের গড়), টন/হেক্টর নয়।",
    },
    {
      en: "Daily weather is smoothed from monthly means, so short dry spells and single hot days are under-represented.",
      bn: "দৈনিক আবহাওয়া মাসিক গড় থেকে মসৃণ করা, তাই ছোট খরা বা একদিনের তীব্র গরম কম ধরা পড়ে।",
    },
    {
      en: "For decisions, ask your Upazila Agriculture Officer or call 16123 (Krishi Call Centre).",
      bn: "সিদ্ধান্তের জন্য উপজেলা কৃষি কর্মকর্তা বা ১৬১২৩ (কৃষি কল সেন্টার)-এ যোগাযোগ করুন।",
    },
  ];
  for (const m of [A, B]) {
    if (m.dataKind === "trend-what-if")
      caveats.push({
        en: `${m.label} (${m.year}) is a labelled what-if built from past data, not a NASA projection or a forecast.`,
        bn: `${m.label} (${m.year}) অতীতের তথ্য থেকে বানানো ‘যদি-হয়’ দৃশ্য — NASA প্রক্ষেপণ বা পূর্বাভাস নয়।`,
      });
    if (m.dataKind === "nasa-projection")
      caveats.push({
        en: `${m.label} uses a NASA NEX-GDDP-CMIP6 SSP2-4.5 projection from only 2 climate models — a plausible future, not a forecast.`,
        bn: `${m.label} মাত্র ২টি জলবায়ু মডেলের NASA NEX-GDDP-CMIP6 SSP2-4.5 প্রক্ষেপণ ব্যবহার করে — সম্ভাব্য ভবিষ্যৎ, পূর্বাভাস নয়।`,
      });
    if (!m.matured)
      caveats.push({ en: `${m.label}: the crop did not reach maturity in the model.`, bn: `${m.label}: মডেলে ফসল পাকেনি।` });
  }
  if (series.provenance.standIn)
    caveats.unshift({
      en: "WARNING: observations are a stand-in from another district; this comparison is not about your district.",
      bn: "সতর্কতা: অন্য জেলার বদলি তথ্য ব্যবহৃত; এই তুলনা আপনার জেলার নয়।",
    });
  // Bangla text uses Bangla digits (numbers only; product names like SSP2-4.5 live in the caveats and stay as-is)
  const explanations = ex.map((e) => ({ ...e, bn: asciiToBnDigits(e.bn) }));
  return { a: A, b: B, diff, explanations, caveats };
}
