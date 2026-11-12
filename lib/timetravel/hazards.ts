import type { HazardType, LocalizedText, RegionPreset } from "./types";
import type { HazardEvent } from "./crops";

/**
 * Educational disaster scenarios. They show what *could* happen to a crop under a hazard the user chooses.
 * They are never a prediction of when or where a real event will occur, and never replace official warnings.
 */

export interface HazardDef {
  id: HazardType;
  name: LocalizedText;
  icon: string;
  what: LocalizedText;
  cropEffect: LocalizedText;
  mitigation: LocalizedText[];
  officialSources: ("bmd" | "ffwc" | "ddm" | "bamis" | "dae")[];
  /** regions where the scenario is most relevant (others still allowed) */
  relevantRegions: RegionPreset[];
  defaultDays: number;
  defaultSeverity: number;
}

export const HAZARDS: Record<HazardType, HazardDef> = {
  flood: {
    id: "flood",
    name: { bn: "বন্যা / জলাবদ্ধতা", en: "Flood / waterlogging" },
    icon: "🌊",
    what: {
      bn: "নদী বা আগাম পাহাড়ি ঢলে জমি পানিতে ডুবে যাওয়ার শিক্ষামূলক দৃশ্য।",
      en: "Educational scene of a field submerged by river or flash flood water.",
    },
    cropEffect: {
      bn: "পানির গভীরতা, কতদিন ডুবে থাকে এবং গাছের বৃদ্ধি-পর্যায়ের উপর ক্ষতি নির্ভর করে। ধান ছাড়া অন্য ফসল (গম/ভুট্টা) ধানের চেয়ে অনেক বেশি স্পর্শকাতর।",
      en: "Damage depends on depth, duration and growth stage. Upland crops (wheat, maize) are far more sensitive than rice.",
    },
    mitigation: [
      { bn: "সহনশীল জাত (যেমন সাবমার্জেন্স-সহনশীল আমন) বিবেচনা করুন।", en: "Consider submergence-tolerant varieties for Aman." },
      { bn: "নিষ্কাশন নালা পরিষ্কার রাখুন; পানি নামলে দ্রুত সার ও আগাছা ব্যবস্থাপনা।", en: "Keep drains clear; manage nutrients and weeds quickly after water recedes." },
      { bn: "পরিপক্ব ফসল সতর্কবার্তা পেলে আগে কাটার কথা ভাবুন।", en: "If a warning is issued, consider early harvest of mature crop." },
    ],
    officialSources: ["ffwc", "bmd", "ddm"],
    relevantRegions: ["haor", "floodplain", "char", "coastal"],
    defaultDays: 6,
    defaultSeverity: 0.6,
  },
  drought: {
    id: "drought",
    name: { bn: "খরা", en: "Drought / long dry spell" },
    icon: "☀️",
    what: {
      bn: "বৃষ্টিহীন দীর্ঘ সময়ে মাটি শুকিয়ে ফাটল ও গাছ নেতিয়ে পড়ার শিক্ষামূলক দৃশ্য।",
      en: "Educational scene of long rainless days: soil cracks and plants wilt.",
    },
    cropEffect: {
      bn: "ফুল ও দানা পর্যায়ে পানির অভাব সবচেয়ে ক্ষতিকর। সেচ থাকলে ক্ষতি কমে।",
      en: "Water shortage at flowering and grain filling hurts most. Irrigation reduces the loss.",
    },
    mitigation: [
      { bn: "AWD ও মালচিং দিয়ে পানি সাশ্রয় করুন।", en: "Save water with AWD and mulching." },
      { bn: "খরা সহনশীল জাত ও আগাম বপন বিবেচনা করুন।", en: "Consider drought-tolerant varieties and earlier sowing." },
      { bn: "পুকুর/বৃষ্টির পানি সংরক্ষণ করুন (জল পুনর্ব্যবহার)।", en: "Store rainwater in ponds (water recycling)." },
    ],
    officialSources: ["bamis", "bmd", "dae"],
    relevantRegions: ["barind", "floodplain", "hill"],
    defaultDays: 25,
    defaultSeverity: 0.6,
  },
  cyclone: {
    id: "cyclone",
    name: { bn: "ঘূর্ণিঝড় ও জলোচ্ছ্বাস", en: "Cyclone & storm surge" },
    icon: "🌀",
    what: {
      bn: "প্রবল বাতাস ও ভারী বৃষ্টিতে গাছ হেলে পড়া এবং উপকূলে লোনা পানি ঢোকার শিক্ষামূলক দৃশ্য।",
      en: "Educational scene of strong wind and heavy rain: lodging, and salt water reaching coastal fields.",
    },
    cropEffect: {
      bn: "ফুল ও দানা পর্যায়ে গাছ হেলে পড়লে ক্ষতি বেশি। জলোচ্ছ্বাসের লবণ পরবর্তী মৌসুমেও প্রভাব ফেলতে পারে।",
      en: "Lodging at flowering/grain filling is worst. Surge salt can affect following seasons.",
    },
    mitigation: [
      { bn: "BMD সংকেত অনুসরণ করুন; আশ্রয়কেন্দ্রে যান — জীবন আগে, ফসল পরে।", en: "Follow BMD signals and go to a shelter — life first, crops second." },
      { bn: "পাকা ধান সম্ভব হলে আগে কেটে নিন (সতর্কবার্তা থাকলে)।", en: "Harvest mature rice early if a warning gives time." },
      { bn: "ঝড়ের পর লবণ ধুয়ে ফেলতে মিঠা পানি ও নিষ্কাশন।", en: "Flush salt with fresh water and drainage after the storm." },
    ],
    officialSources: ["bmd", "ddm"],
    relevantRegions: ["coastal"],
    defaultDays: 2,
    defaultSeverity: 0.6,
  },
  heatwave: {
    id: "heatwave",
    name: { bn: "তাপপ্রবাহ", en: "Heatwave" },
    icon: "🔥",
    what: {
      bn: "টানা অতিরিক্ত গরমে গাছের চাপ ও পানির চাহিদা বাড়ার শিক্ষামূলক দৃশ্য।",
      en: "Educational scene of persistent extreme heat: plant stress and higher water demand.",
    },
    cropEffect: {
      bn: "ফুল আসার সময় উচ্চ তাপমাত্রায় ধানে চিটা (বন্ধ্যা শীষ) বাড়তে পারে।",
      en: "High temperature at flowering can raise spikelet sterility in rice.",
    },
    mitigation: [
      { bn: "ফুল আসার সময় তাপ এড়াতে বপন/রোপণের সময় সমন্বয় করুন।", en: "Shift sowing/transplanting so flowering avoids peak heat." },
      { bn: "ক্ষেতে পানি ধরে রাখুন; সকাল বা সন্ধ্যায় সেচ।", en: "Keep water in the field; irrigate early morning or evening." },
      { bn: "তাপসহনশীল জাত বিবেচনা করুন।", en: "Consider heat-tolerant varieties." },
    ],
    officialSources: ["bmd", "bamis"],
    relevantRegions: ["barind", "floodplain", "char"],
    defaultDays: 7,
    defaultSeverity: 0.6,
  },
  salinity: {
    id: "salinity",
    name: { bn: "লবণাক্ততা", en: "Salinity intrusion" },
    icon: "🧂",
    what: {
      bn: "মাটি বা সেচের পানিতে লবণ বাড়লে জমিতে সাদা লবণের আস্তরণ পড়ার শিক্ষামূলক দৃশ্য।",
      en: "Educational scene of rising soil/irrigation-water salinity with white salt crust.",
    },
    cropEffect: {
      bn: "লবণাক্ততা বাড়লে ফলন ধাপে ধাপে কমে (FAO Maas–Hoffman সম্পর্ক)। ভুট্টা সবচেয়ে সংবেদনশীল, গম তুলনায় সহনশীল।",
      en: "Yield falls stepwise as salinity rises (FAO Maas–Hoffman response). Maize is most sensitive, wheat more tolerant.",
    },
    mitigation: [
      { bn: "লবণ-সহনশীল জাত ও মিঠা পানির সেচ।", en: "Salt-tolerant varieties and fresh-water irrigation." },
      { bn: "জৈব সার/কম্পোস্ট মাটির গঠন ভালো করে।", en: "Compost and organic matter improve soil structure." },
      { bn: "SRDI-র মাটি পরীক্ষা দিয়ে EC মাপুন।", en: "Measure EC with an SRDI soil test." },
    ],
    officialSources: ["dae", "bamis"],
    relevantRegions: ["coastal"],
    defaultDays: 30,
    defaultSeverity: 0.5,
  },
};

export const HAZARD_LIST: HazardDef[] = Object.values(HAZARDS);

export function defaultHazardEvent(type: HazardType, startDay: number): HazardEvent {
  const h = HAZARDS[type];
  return { type, startDay, days: h.defaultDays, severity: h.defaultSeverity };
}

/** Plain-language mapping of the educational severity slider (so users see what the number means). */
export function describeSeverity(type: HazardType, severity: number): LocalizedText {
  const s = Math.min(1, Math.max(0, severity));
  switch (type) {
    case "flood": {
      const m = (0.2 + 1.8 * s).toFixed(1);
      return { bn: `পানির গভীরতা ≈ ${m} মি (শিক্ষামূলক মান)`, en: `water depth ≈ ${m} m (educational mapping)` };
    }
    case "cyclone": {
      const k = Math.round(60 + 160 * s);
      return { bn: `বাতাস ≈ ${k} কিমি/ঘণ্টা (শিক্ষামূলক মান)`, en: `wind ≈ ${k} km/h (educational mapping)` };
    }
    case "heatwave": {
      const d = (2 + 6 * s).toFixed(1);
      return { bn: `স্বাভাবিকের চেয়ে +${d} °C`, en: `+${d} °C above normal Tmax` };
    }
    case "drought":
      return { bn: `বৃষ্টি ০, বাষ্পীভবন +${Math.round(15 * s)}%`, en: `rain 0, evaporative demand +${Math.round(15 * s)}%` };
    case "salinity": {
      const e = (8 * s).toFixed(1);
      return { bn: `মাটির EC +${e} dS/m`, en: `soil EC +${e} dS/m` };
    }
  }
}

