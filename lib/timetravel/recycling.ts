import type { LocalizedText } from "./types";
import type { CropId } from "./crops";

/**
 * Circular-farm (recycling) calculator.
 *
 * All coefficients are TYPICAL literature ranges shown to the user as editable assumptions
 * (see `RESIDUE_COEFFS`). They are not measurements of the user's farm. Mass balance only — no yield promises.
 */

export const HA_PER_ACRE = 0.404686;
export const M2_PER_DECIMAL = 40.4686; // 1 decimal (শতাংশ) = 1/100 acre

export type AreaUnit = "ha" | "acre" | "decimal";

export function toHectares(value: number, unit: AreaUnit): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  switch (unit) {
    case "ha":
      return value;
    case "acre":
      return value * HA_PER_ACRE;
    case "decimal":
      return (value * M2_PER_DECIMAL) / 10000;
  }
}

export function fromHectares(ha: number, unit: AreaUnit): number {
  switch (unit) {
    case "ha":
      return ha;
    case "acre":
      return ha / HA_PER_ACRE;
    case "decimal":
      return (ha * 10000) / M2_PER_DECIMAL;
  }
}

export interface Range3 {
  min: number;
  typ: number;
  max: number;
}

export interface ResidueCoeff {
  /** dry residue (straw / stover) mass per unit grain mass */
  residueToGrain: Range3;
  /** husk mass per unit paddy mass (rice only) */
  huskToPaddy?: Range3;
  residueName: LocalizedText;
  note: LocalizedText;
}

export const RESIDUE_COEFFS: Record<CropId, ResidueCoeff> = {
  aman: riceCoeff(),
  boro: riceCoeff(),
  aus: riceCoeff(),
  wheat: {
    residueToGrain: { min: 1.0, typ: 1.3, max: 1.7 },
    residueName: { bn: "গমের নাড়া", en: "Wheat straw" },
    note: { bn: "সাধারণ সাহিত্য-পরিসর; জাত ও কাটার উচ্চতায় ভিন্ন।", en: "Typical literature range; varies by variety and cutting height." },
  },
  maize: {
    residueToGrain: { min: 1.0, typ: 1.3, max: 1.8 },
    residueName: { bn: "ভুট্টার গাছ/ডাঁটা (stover)", en: "Maize stover" },
    note: { bn: "সাধারণ সাহিত্য-পরিসর; যাচাই করুন।", en: "Typical literature range; verify locally." },
  },
};

function riceCoeff(): ResidueCoeff {
  return {
    residueToGrain: { min: 0.8, typ: 1.0, max: 1.5 },
    huskToPaddy: { min: 0.18, typ: 0.2, max: 0.22 },
    residueName: { bn: "ধানের খড়", en: "Rice straw" },
    note: {
      bn: "খড় ≈ দানার সমান ওজন (পরিসর ০.৮–১.৫); তুষ ≈ ধানের ২০%। সাধারণ সাহিত্য-মান — নিজের জমির মান দিয়ে বদলান।",
      en: "Straw ≈ grain weight (range 0.8–1.5); husk ≈ 20% of paddy. Typical literature values — replace with your own.",
    },
  };
}

/** Typical nutrient concentration in dry rice straw (percent of dry matter). Lab-test your own material. */
export const STRAW_NUTRIENT_PCT = {
  n: { min: 0.5, typ: 0.65, max: 0.8 },
  p: { min: 0.07, typ: 0.1, max: 0.12 },
  k: { min: 1.2, typ: 1.45, max: 1.7 },
} as const;

export type PathwayId = "incorporate" | "compost" | "mushroom" | "feed" | "biogas" | "biochar" | "burn";

export interface Pathway {
  id: PathwayId;
  name: LocalizedText;
  icon: string;
  how: LocalizedText;
  returns: LocalizedText;
  watchOut: LocalizedText;
  ask: ("dae" | "bari" | "srdi" | "brri")[];
}

export const PATHWAYS: Pathway[] = [
  {
    id: "incorporate",
    name: { bn: "মাটিতে মিশিয়ে দেওয়া / মালচ", en: "Incorporate or mulch" },
    icon: "🌾",
    how: {
      bn: "কাটার পর খড় ছোট করে মাটিতে মেশানো বা পরের ফসলে মালচ হিসেবে ব্যবহার।",
      en: "Chop straw and mix it into soil, or use it as mulch for the next crop.",
    },
    returns: { bn: "জৈব পদার্থ, পটাশিয়াম ও আর্দ্রতা ধরে রাখা।", en: "Organic matter, potassium and moisture retention." },
    watchOut: { bn: "ভেজা জমিতে পচার সময় মিথেন; পচার জন্য সময় দিন।", en: "Decomposing in flooded soil emits methane; allow time to decompose." },
    ask: ["dae", "srdi"],
  },
  {
    id: "compost",
    name: { bn: "কম্পোস্ট / ভার্মিকম্পোস্ট", en: "Compost / vermicompost" },
    icon: "🪱",
    how: {
      bn: "খড়, গোবর ও সবুজ বর্জ্য স্তরে স্তরে সাজিয়ে আর্দ্রতা বজায় রেখে পচানো।",
      en: "Layer straw, dung and green waste; keep moist and turn until stable.",
    },
    returns: { bn: "পুষ্টিসমৃদ্ধ জৈব সার; রাসায়নিক সারের চাহিদা কমাতে সাহায্য করে।", en: "Nutrient-rich organic fertilizer that can reduce chemical fertilizer demand." },
    watchOut: { bn: "ব্যবহারের আগে সম্পূর্ণ পচেছে কিনা নিশ্চিত হোন।", en: "Make sure it is fully matured before use." },
    ask: ["dae", "srdi"],
  },
  {
    id: "mushroom",
    name: { bn: "খড় মাশরুম (ধানের খড়ের ছত্রাক)", en: "Paddy-straw mushroom" },
    icon: "🍄",
    how: {
      bn: "ভেজানো খড়ের বেডে মাশরুম স্পন দিয়ে চাষ; পরে ব্যবহৃত খড় কম্পোস্টে।",
      en: "Grow mushroom on soaked straw beds; send the spent straw on to compost.",
    },
    returns: { bn: "বাড়তি আয় ও পুষ্টি; ব্যবহৃত বেড জৈব সার।", en: "Extra income and nutrition; spent bed becomes organic fertilizer." },
    watchOut: { bn: "স্বাস্থ্যবিধি ও প্রশিক্ষণ দরকার; স্থানীয় কৃষি অফিস/প্রশিক্ষণ কেন্দ্রে যোগাযোগ করুন।", en: "Needs hygiene and training; contact your agriculture office." },
    ask: ["dae"],
  },
  {
    id: "feed",
    name: { bn: "গবাদিপশুর খাদ্য (ইউরিয়া-শোধিত খড়)", en: "Animal feed (urea-treated straw)" },
    icon: "🐄",
    how: {
      bn: "খড় ইউরিয়া-দ্রবণে শোধন করে পশুখাদ্য হিসেবে ব্যবহার।",
      en: "Treat straw with urea solution to improve it as cattle feed.",
    },
    returns: { bn: "পশুখাদ্য ও গোবর (কম্পোস্ট/বায়োগ্যাসের কাঁচামাল)।", en: "Feed, and dung that feeds compost/biogas." },
    watchOut: { bn: "নিরাপদ মাত্রা ও পদ্ধতি প্রাণিসম্পদ কর্মকর্তার কাছে জেনে নিন।", en: "Get safe ratios and method from a livestock officer." },
    ask: ["dae"],
  },
  {
    id: "biogas",
    name: { bn: "বায়োগ্যাস (গোবর + খড়)", en: "Biogas (dung + straw)" },
    icon: "🔥",
    how: {
      bn: "বায়োগ্যাস প্ল্যান্টে গোবরের সাথে কৃষি বর্জ্য; রান্নার গ্যাস ও স্লারি।",
      en: "Feed dung and farm residue to a digester: cooking gas plus slurry.",
    },
    returns: { bn: "রান্নার জ্বালানি ও পুষ্টিসমৃদ্ধ স্লারি সার।", en: "Cooking fuel and nutrient-rich slurry fertilizer." },
    watchOut: { bn: "প্ল্যান্টের নকশা ও নিরাপত্তা বিশেষজ্ঞের কাছ থেকে নিন; খড় একা ভালো কাজ করে না।", en: "Get design/safety from an expert; straw alone digests poorly." },
    ask: ["dae"],
  },
  {
    id: "biochar",
    name: { bn: "তুষ → বায়োচার / ব্রিকেট", en: "Husk → biochar / briquettes" },
    icon: "⚫",
    how: {
      bn: "ধানের তুষ নিয়ন্ত্রিত পোড়ানো (পাইরোলাইসিস) করে বায়োচার; মাটির উন্নয়নে।",
      en: "Controlled pyrolysis of rice husk gives biochar for soil improvement (or briquette fuel).",
    },
    returns: { bn: "মাটির কাঠামো উন্নত, কার্বন সংরক্ষণ।", en: "Better soil structure and carbon storage." },
    watchOut: { bn: "খোলা আগুনে পোড়ানো নয় — ধোঁয়া ও দূষণ; নিরাপদ চুল্লি ব্যবহার করুন।", en: "Not open burning — use a proper kiln to limit smoke." },
    ask: ["dae", "srdi"],
  },
  {
    id: "burn",
    name: { bn: "খোলা মাঠে পোড়ানো (নিরুৎসাহিত)", en: "Open-field burning (discouraged)" },
    icon: "🚫",
    how: { bn: "মাঠেই খড়/নাড়া পোড়ানো।", en: "Burning residue in the field." },
    returns: { bn: "তাৎক্ষণিক জমি পরিষ্কার; কিন্তু জৈব পদার্থ ও পুষ্টি নষ্ট।", en: "Quick clearing, but organic matter and nutrients are lost." },
    watchOut: { bn: "বায়ুদূষণ, মাটির উপকারী জীব ও জৈব পদার্থের ক্ষতি। নাসা FIRMS স্যাটেলাইট আগুন শনাক্ত করে।", en: "Air pollution and loss of soil life and organic matter. NASA FIRMS satellites detect fires." },
    ask: ["dae"],
  },
];

export type Shares = Record<PathwayId, number>;

export const DEFAULT_SHARES: Shares = {
  incorporate: 30,
  compost: 20,
  mushroom: 5,
  feed: 30,
  biogas: 5,
  biochar: 10, // applies to husk; straw share is renormalised in the calculation
  burn: 0,
};

export interface RecyclingInput {
  crop: CropId;
  areaHa: number;
  /** grain (or paddy) yield in t/ha entered by the user */
  grainYieldTHa: number;
  shares: Shares;
  /** override coefficients (fractions) if the user has their own numbers */
  residueToGrain?: number;
  huskToPaddy?: number;
}

export interface RecyclingResult {
  grainT: number;
  residueT: Range3;
  huskT: Range3 | null;
  byPathway: Record<PathwayId, number>;
  shareSum: number;
  /** nutrients contained in the straw that is returned to soil via incorporate + compost (kg), typical range */
  nutrientsReturnedKg: { n: Range3; p: Range3; k: Range3 };
  burnedT: number;
  notes: string[];
}

function scale(r: Range3, f: number): Range3 {
  return { min: r.min * f, typ: r.typ * f, max: r.max * f };
}

export function normaliseShares(s: Shares): Shares {
  const sum = Object.values(s).reduce((a, b) => a + Math.max(0, b), 0);
  if (sum <= 0) return { ...DEFAULT_SHARES };
  const out = {} as Shares;
  (Object.keys(s) as PathwayId[]).forEach((k) => {
    out[k] = (Math.max(0, s[k]) / sum) * 100;
  });
  return out;
}

export function computeRecycling(input: RecyclingInput): RecyclingResult {
  const co = RESIDUE_COEFFS[input.crop];
  const notes: string[] = [];
  const grainT = Math.max(0, input.areaHa) * Math.max(0, input.grainYieldTHa);

  let residueT: Range3;
  if (input.residueToGrain !== undefined) {
    residueT = { min: grainT * input.residueToGrain, typ: grainT * input.residueToGrain, max: grainT * input.residueToGrain };
    notes.push("Using your own residue-to-grain ratio.");
  } else {
    residueT = scale(co.residueToGrain, grainT);
  }

  let huskT: Range3 | null = null;
  if (co.huskToPaddy) {
    huskT =
      input.huskToPaddy !== undefined
        ? { min: grainT * input.huskToPaddy, typ: grainT * input.huskToPaddy, max: grainT * input.huskToPaddy }
        : scale(co.huskToPaddy, grainT);
  }

  const shareSum = Object.values(input.shares).reduce((a, b) => a + Math.max(0, b), 0);
  const norm = normaliseShares(input.shares);
  if (Math.abs(shareSum - 100) > 0.5) notes.push(`Shares summed to ${shareSum.toFixed(0)}%; they were normalised to 100%.`);

  // Biochar is made from husk, so the straw shares exclude it.
  const strawShareSum = 100 - norm.biochar;
  const byPathway = {} as Record<PathwayId, number>;
  (Object.keys(norm) as PathwayId[]).forEach((k) => {
    if (k === "biochar") {
      byPathway[k] = huskT ? huskT.typ : 0;
    } else {
      byPathway[k] = strawShareSum > 0 ? (residueT.typ * norm[k]) / strawShareSum : 0;
    }
  });
  if (!huskT) notes.push("Husk-based pathways apply to rice only.");

  const returnedT =
    strawShareSum > 0 ? (residueT.typ * (norm.incorporate + norm.compost)) / strawShareSum : 0;
  const kg = (pct: Range3) => ({
    min: returnedT * 1000 * (pct.min / 100),
    typ: returnedT * 1000 * (pct.typ / 100),
    max: returnedT * 1000 * (pct.max / 100),
  });
  const nutrientsReturnedKg =
    input.crop === "aman" || input.crop === "boro" || input.crop === "aus"
      ? { n: kg(STRAW_NUTRIENT_PCT.n), p: kg(STRAW_NUTRIENT_PCT.p), k: kg(STRAW_NUTRIENT_PCT.k) }
      : { n: kg({ min: 0, typ: 0, max: 0 }), p: kg({ min: 0, typ: 0, max: 0 }), k: kg({ min: 0, typ: 0, max: 0 }) };
  if (!(input.crop === "aman" || input.crop === "boro" || input.crop === "aus")) {
    notes.push("Nutrient concentrations are provided for rice straw only.");
  }

  return { grainT, residueT, huskT, byPathway, shareSum, nutrientsReturnedKg, burnedT: byPathway.burn, notes };
}

/** Water volume: 1 mm over 1 ha = 10 m3. */
export function irrigationVolumeM3(mm: number, areaHa: number): number {
  return Math.max(0, mm) * 10 * Math.max(0, areaHa);
}

/** Pond surface area (m2) needed to store `volumeM3` at an average usable depth. */
export function pondAreaM2(volumeM3: number, usableDepthM = 1.5): number {
  return usableDepthM > 0 ? volumeM3 / usableDepthM : 0;
}

export const CIRCULAR_LOOPS: { id: string; name: LocalizedText; steps: LocalizedText[] }[] = [
  {
    id: "nutrient",
    name: { bn: "পুষ্টির চক্র", en: "Nutrient loop" },
    steps: [
      { bn: "ফসল কাটা", en: "Harvest" },
      { bn: "খড় সংগ্রহ", en: "Collect straw" },
      { bn: "কম্পোস্ট / মাশরুম / পশুখাদ্য", en: "Compost / mushroom / feed" },
      { bn: "জৈব সার জমিতে", en: "Organic fertilizer to field" },
      { bn: "পরের ফসল", en: "Next crop" },
    ],
  },
  {
    id: "water",
    name: { bn: "পানির চক্র", en: "Water loop" },
    steps: [
      { bn: "বর্ষার বৃষ্টি", en: "Monsoon rain" },
      { bn: "পুকুর / খাল সংরক্ষণ", en: "Pond / canal storage" },
      { bn: "শুকনো মৌসুমে সেচ (AWD)", en: "Dry-season irrigation (AWD)" },
      { bn: "মাছ চাষ ও পুকুরের মাটি জমিতে", en: "Fish culture; pond silt back to field" },
    ],
  },
  {
    id: "energy",
    name: { bn: "শক্তির চক্র", en: "Energy loop" },
    steps: [
      { bn: "গোবর + বর্জ্য", en: "Dung + waste" },
      { bn: "বায়োগ্যাস", en: "Biogas" },
      { bn: "রান্নার জ্বালানি", en: "Cooking fuel" },
      { bn: "স্লারি সার", en: "Slurry fertilizer" },
    ],
  },
];
