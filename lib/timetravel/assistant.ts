import type { Command } from "./commands";
import { CROPS, STAGE_LABEL } from "./crops";
import type { CropId } from "./crops";
import type { TTState, View } from "./engine";
import { KIND_EXPLAIN, KIND_LABEL } from "./kind-labels";
import { AGENCIES, KRISHI_CALL_CENTER, NATIONAL_EMERGENCY } from "./gov";
import { DISTRICTS, bnToAsciiDigits } from "./locations";
import { NASA_DATASETS, usedCount } from "./nasa-datasets";
import { PATHWAYS } from "./recycling";
import type { HazardType, Lang, LocalizedText } from "./types";

/**
 * Offline rule-based assistant for the Time Travel simulator.
 *
 * It is NOT a large language model. It (1) turns what a person says or types, in Bangla, English or romanised Bangla,
 * into simulator commands, and (2) answers from a small hand-written knowledge base plus the numbers currently on
 * screen. It never invents data: if it does not know, it says so and points to an official source.
 */

export interface SourceRef {
  label: string;
  url?: string;
}

export interface AssistantReply {
  kind: "command" | "answer" | "fallback" | "safety";
  text: string;
  commands: Command[];
  sources: SourceRef[];
  openPanel?: TTState["panel"];
}

/* ----------------------------- normalisation ----------------------------- */

export function normalise(input: string): string {
  return bnToAsciiDigits(input)
    .toLowerCase()
    .replace(/[।,;:!?"'“”‘’()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const REGEX_CACHE = new Map<string, RegExp>();
/** Latin-script keywords must start at a word boundary ("aus" must not match "because"); Bangla keywords match as substrings. */
function hit(t: string, w: string): boolean {
  if (/^[a-z0-9 .\-+°]+$/.test(w) && /[a-z]/.test(w)) {
    let re = REGEX_CACHE.get(w);
    if (!re) {
      re = new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      REGEX_CACHE.set(w, re);
    }
    return re.test(t);
  }
  return t.includes(w);
}
const has = (t: string, words: string[]) => words.some((w) => hit(t, w));

const CROP_WORDS: [CropId, string[]][] = [
  ["aman", ["আমন", "aman"]],
  ["boro", ["বোরো", "boro", "bora"]],
  ["aus", ["আউশ", "aus"]],
  ["wheat", ["গম", "gom", "wheat"]],
  ["maize", ["ভুট্টা", "ভুটা", "bhutta", "maize", "corn"]],
];

const HAZARD_WORDS: [HazardType, string[]][] = [
  ["flood", ["বন্যা", "জলাবদ্ধ", "banna", "flood", "ঢল"]],
  ["drought", ["খরা", "khora", "drought", "অনাবৃষ্টি"]],
  ["cyclone", ["ঘূর্ণিঝড়", "ঘুর্ণিঝড়", "ঝড়", "cyclone", "ghurnijhor", "storm", "jhor"]],
  ["heatwave", ["তাপপ্রবাহ", "তাপ প্রবাহ", "heatwave", "heat wave", "লু হাওয়া", "tap probaho"]],
  ["salinity", ["লবণ", "lobon", "salin", "salt"]],
];

const PATHWAY_WORDS: [string, string[]][] = [
  ["compost", ["কম্পোস্ট", "compost", "ভার্মি", "vermi", "জৈব সার"]],
  ["mushroom", ["মাশরুম", "mushroom"]],
  ["feed", ["গবাদি", "গরুর খাদ্য", "animal feed", "feed", "ইউরিয়া"]],
  ["biogas", ["বায়োগ্যাস", "biogas", "গোবর গ্যাস"]],
  ["biochar", ["বায়োচার", "biochar", "ব্রিকেট", "briquette", "তুষ"]],
  ["pond", ["পুকুর", "pond", "বৃষ্টির পানি", "rainwater"]],
  ["solar", ["সৌর", "solar"]],
  ["burn", ["পোড়া", "পুড়ি", "burn"]],
];

/* ------------------------------ command parsing ------------------------------ */

function findDistrict(t: string): string | null {
  let best: { id: string; len: number } | null = null;
  for (const d of DISTRICTS) {
    for (const name of [d.nameBn.toLowerCase(), d.nameEn.toLowerCase()]) {
      if (name.length >= 3 && hit(t, name) && (!best || name.length > best.len)) best = { id: d.id, len: name.length };
    }
  }
  return best?.id ?? null;
}

export function parseCommands(raw: string, state: TTState): Command[] {
  const t = normalise(raw);
  const cmds: Command[] = [];
  if (!t) return cmds;

  const clearWord = has(t, ["সরাও", "সরান", "বন্ধ", "মুছ", "remove", "clear", "stop the", "বাদ দাও", "ছাড়া"]);

  // reset / language
  if (has(t, ["রিসেট", "reset", "শুরু থেকে", "start over"])) cmds.push({ type: "reset" });
  if (has(t, ["ইংরেজি", "english", "ingreji"]) && !has(t, ["ইংরেজি তে নয়"])) cmds.push({ type: "setLang", lang: "en" });
  else if (has(t, ["বাংলা", "bangla", "bengali", "bangla te"])) cmds.push({ type: "setLang", lang: "bn" });

  // play / pause
  if (has(t, ["থামো", "থামাও", "থামুন", "pause", "stop", "থাম "])) cmds.push({ type: "pause" });
  else if (has(t, ["চালাও", "চালান", "শুরু করো", "play", "start", "run", "chalao"])) cmds.push({ type: "play" });

  // year
  const yearMatch = t.match(/\b(19[89]\d|20[0-5]\d)\b/);
  const relYears = t.match(/(\d{1,2})\s*(বছর|year|yr|sal)/);
  if (yearMatch) {
    cmds.push({ type: "setYear", year: Number(yearMatch[1]) });
  } else if (relYears && has(t, ["পরে", "পর", "later", "ahead", "forward", "সামনে", "আগামী", "future"])) {
    cmds.push({ type: "addYears", delta: Number(relYears[1]) });
  } else if (relYears && has(t, ["আগে", "পিছনে", "back", "earlier", "ago", "ago", "past"])) {
    cmds.push({ type: "addYears", delta: -Number(relYears[1]) });
  } else if (has(t, ["পরের বছর", "আগামী বছর", "next year", "পরবর্তী বছর"])) cmds.push({ type: "addYears", delta: 1 });
  else if (has(t, ["আগের বছর", "গত বছর", "previous year", "last year"])) cmds.push({ type: "addYears", delta: -1 });
  else if (has(t, ["ভবিষ্যৎ", "future", "ভবিষ্যতে"])) cmds.push({ type: "setYear", year: 2050 });
  else if (has(t, ["অতীত", "past", "পুরনো", "history"]) && !has(t, ["পাস্ট"])) cmds.push({ type: "setYear", year: 1990 });
  else if (has(t, ["এখন", "now", "আজকে", "today", "বর্তমান", "present"]) && has(t, ["যাও", "go", "show", "দেখাও", "ফিরে", "back"])) {
    cmds.push({ type: "setYear", year: Math.min(2025, new Date().getFullYear()) });
  }

  // day
  const dayMatch = t.match(/(\d{1,3})\s*(দিন|day|din)/);
  if (dayMatch && !relYears) {
    if (has(t, ["পরে", "পর ", "after", "এগিয়ে", "forward", "later"]) && state.day > 0 && has(t, ["এগিয়ে", "forward"])) cmds.push({ type: "addDays", delta: Number(dayMatch[1]) });
    else if (has(t, ["পিছিয়ে", "back", "আগে"])) cmds.push({ type: "addDays", delta: -Number(dayMatch[1]) });
    else cmds.push({ type: "setDay", day: Number(dayMatch[1]) });
  } else if (has(t, ["কাটার সময়", "harvest", "ফসল তোলা", "ফসল কাটা"])) {
    cmds.push({ type: "setDay", day: 130 });
  } else if (has(t, ["বপন", "রোপণ", "sowing", "planting", "transplant"]) && has(t, ["দেখাও", "show", "যাও", "go"])) {
    cmds.push({ type: "setDay", day: 5 });
  }

  // crop
  for (const [id, words] of CROP_WORDS) if (has(t, words)) cmds.push({ type: "setCrop", crop: id });
  if (!cmds.some((c) => c.type === "setCrop") && has(t, ["ধান", "rice", "dhan"])) {
    if (!CROPS[state.cropId].paddy) cmds.push({ type: "setCrop", crop: "boro" });
  }

  // district
  // A place name alone is a command only when it comes with a "go/show" verb or is nearly the whole sentence;
  // otherwise "price of jute in Dhaka tomorrow" would silently move the farm.
  const dist = findDistrict(t);
  const goVerb = has(t, ["দেখাও", "যাও", "চলো", "নিয়ে যাও", "খোলো", "show", "go to", "go", "switch", "open", "take me", "visit", "select"]);
  if (dist && (goVerb || t.split(" ").length <= 3)) cmds.push({ type: "setDistrict", id: dist });

  // hazards
  for (const [hz, words] of HAZARD_WORDS) {
    if (has(t, words)) {
      if (clearWord) cmds.push({ type: "toggleHazard", hazard: hz });
      else if (!state.events.some((e) => e.type === hz)) cmds.push({ type: "addHazard", hazard: hz });
    }
  }
  if (clearWord && has(t, ["দুর্যোগ", "hazard", "disaster", "সব"]) && !cmds.some((c) => c.type === "toggleHazard")) cmds.push({ type: "clearHazards" });

  // warming what-if
  const warm = t.match(/(\d(?:\.\d)?)\s*(ডিগ্রি|degree|°|c )/);
  if (warm && has(t, ["গরম", "বেশি", "warmer", "warming", "hotter", "বাড়", "ধরো", "suppose", "if", "what if"])) {
    cmds.push({ type: "setScenario", patch: { dT: Math.min(4, Number(warm[1])) } });
  }
  if (has(t, ["বৃষ্টি কম", "less rain", "rain less", "কম বৃষ্টি"])) cmds.push({ type: "setScenario", patch: { rainMonsoonPct: -20 } });
  if (has(t, ["বৃষ্টি বেশি", "more rain", "বেশি বৃষ্টি"])) cmds.push({ type: "setScenario", patch: { rainMonsoonPct: 20 } });

  // irrigation
  if (has(t, ["awd", "পর্যায়ক্রমে ভেজা", "alternate wetting"])) cmds.push({ type: "setIrrigation", mode: "awd" });
  else if (has(t, ["বৃষ্টিনির্ভর", "rainfed", "rain-fed", "সেচ ছাড়া", "without irrigation"])) cmds.push({ type: "setIrrigation", mode: "rainfed" });
  else if (has(t, ["সেচ দাও", "irrigate", "irrigated", "সেচসহ"])) cmds.push({ type: "setIrrigation", mode: "irrigated" });

  // camera & time of day
  if (has(t, ["ড্রোন", "drone", "আকাশ থেকে", "from above", "aerial"])) cmds.push({ type: "setCamera", camera: "drone" });
  else if (has(t, ["কাছ", "close up", "closeup", "close-up", "zoom"])) cmds.push({ type: "setCamera", camera: "closeup" });
  else if (has(t, ["হাঁটা", "হেঁটে", "walk", "মাঠে নামো"])) cmds.push({ type: "setCamera", camera: "walk" });
  else if (has(t, ["পুরো জমি", "overview", "পুরো মাঠ"])) cmds.push({ type: "setCamera", camera: "overview" });

  if (has(t, ["ভোর", "dawn", "sunrise", "সূর্যোদয়"])) cmds.push({ type: "setTod", tod: "dawn" });
  else if (has(t, ["রাত", "night"])) cmds.push({ type: "setTod", tod: "night" });
  else if (has(t, ["গোধূলি", "সন্ধ্যা", "dusk", "sunset", "সূর্যাস্ত"])) cmds.push({ type: "setTod", tod: "dusk" });
  else if (has(t, ["দুপুর", "noon", "daytime", "সকাল"])) cmds.push({ type: "setTod", tod: "day" });

  // recycling pathway
  for (const [id, words] of PATHWAY_WORDS) {
    if (has(t, words) && id !== "burn" && has(t, ["দেখাও", "show", "যাও", "go", "কোথায়", "where", "স্টেশন", "station"])) {
      cmds.push({ type: "setPathway", id });
      break;
    }
  }

  // panels
  if (has(t, ["nasa data", "এনএএসএ", "নাসা ডাটা", "নাসা ডেটা", "nasa ডাটা", "nasa ডেটা", "ডেটা প্যানেল", "data panel"]) && has(t, ["দেখাও", "show", "open", "খোলো", "খুলুন"])) cmds.push({ type: "openPanel", panel: "data" });
  else if (has(t, ["সরকারি", "government", "গভর্নমেন্ট", "কৃষি অধিদপ্তর"]) && has(t, ["দেখাও", "show", "open", "খোলো", "খুলুন", "তথ্য"])) cmds.push({ type: "openPanel", panel: "gov" });
  else if (has(t, ["recycl", "পুনর্ব্যবহার", "রিসাইক্লিং"]) && has(t, ["দেখাও", "show", "open", "খোলো", "খুলুন"]) && !cmds.some((c) => c.type === "setPathway")) cmds.push({ type: "openPanel", panel: "recycle" });
  else if (has(t, ["ইশারা", "sign language", "accessib", "সাহায্য প্যানেল"]) && has(t, ["দেখাও", "show", "open", "খোলো", "খুলুন"])) cmds.push({ type: "openPanel", panel: "access" });

  return dedupe(cmds);
}

function dedupe(c: Command[]): Command[] {
  const seen = new Set<string>();
  return c.filter((x) => {
    const k = JSON.stringify(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ----------------------------- knowledge base ----------------------------- */

interface Topic {
  id: string;
  keys: string[];
  answer: LocalizedText;
  sources?: SourceRef[];
}

const agency = (id: string): SourceRef => {
  const a = AGENCIES.find((x) => x.id === id);
  return { label: a ? a.acronym : id, url: a?.url };
};

const TOPICS: Topic[] = [
  {
    id: "what",
    keys: ["এটা কি", "এটি কি", "কি এটা", "what is this", "what is agrilume", "agrilume কি", "অ্যাগ্রিলিউম কি", "কি করে", "what does this do", "about"],
    answer: {
      bn: "এটি অ্যাগ্রিলিউম টাইম ট্রাভেল: বাংলাদেশের একটি জেলার খামারে সময়ের সঙ্গে ফসল, আবহাওয়া ও দুর্যোগের প্রভাব 3D/VR-এ দেখার শিক্ষামূলক সিমুলেটর। অতীতের বছরগুলো NASA POWER-এর বাস্তব তথ্য থেকে; ভবিষ্যৎ 'ধরে-নিই' বা প্রক্ষেপণ হিসেবে স্পষ্ট লেবেল করা — পূর্বাভাস নয়।",
      en: "This is AgriLume Time Travel: an educational simulator to see how crops, weather and hazards change on a Bangladeshi farm over time in 3D/VR. Past years use real NASA POWER data; future years are clearly labelled what-ifs or projections — never forecasts.",
    },
  },
  {
    id: "forecast",
    keys: ["পূর্বাভাস", "forecast", "predict", "ভবিষ্যদ্বাণী", "সঠিক কি", "accurate", "বিশ্বাস", "trust", "guarantee", "নিশ্চয়তা"],
    answer: {
      bn: "না, এটি পূর্বাভাস নয়। ফলন সূচক একটি আপেক্ষিক শিক্ষামূলক সংখ্যা (বেসলাইন = ১০০), বাস্তব ফলনের নিশ্চয়তা নয়। দুর্যোগ দৃশ্যগুলো 'যদি এমন হয়' ধরনের উদাহরণ; কোনো তারিখ বা স্থানের ভবিষ্যদ্বাণী নয়। বাস্তব সতর্কতার জন্য BMD, FFWC, DDM ও DAE দেখুন।",
      en: "No, it is not a forecast. The yield index is a relative educational number (baseline = 100), not a guaranteed real yield. Hazard scenes are 'what if' examples, never a prediction of a date or place. For real warnings use BMD, FFWC, DDM and DAE.",
    },
    sources: [agency("bmd"), agency("ffwc"), agency("ddm"), agency("dae")],
  },
  {
    id: "nasa",
    keys: ["nasa", "নাসা", "এনএএসএ", "power", "পাওয়ার", "ডাটা কোথা", "data source", "তথ্য কোথা", "তথ্যের উৎস"],
    answer: {
      bn: `তাপমাত্রা ও বৃষ্টির তথ্য NASA POWER (কৃষি-আবহাওয়া) থেকে আসে। ${NASA_DATASETS.length}টি NASA ডেটাসেটের তালিকায় প্রতিটির সৎ অবস্থা লেখা আছে; বর্তমানে ${usedCount().used}টি সরাসরি ব্যবহৃত, বাকিগুলো 'পরিকল্পিত/রেফারেন্স' — 'NASA ডেটা' প্যানেলে দেখুন।`,
      en: `Temperature and rain come from NASA POWER (agroclimatology). The NASA data panel lists ${NASA_DATASETS.length} datasets with an honest status for each; ${usedCount().used} are used directly right now and the rest are planned/reference — see the NASA data panel.`,
    },
    sources: [{ label: "NASA POWER", url: "https://power.larc.nasa.gov" }],
  },
  {
    id: "nex",
    keys: ["nex", "cmip", "projection", "প্রক্ষেপণ", "জলবায়ু মডেল", "climate model", "ভবিষ্যৎ আবহাওয়া", "future weather"],
    answer: {
      bn: "ভবিষ্যৎ বছরের জন্য অ্যাপ দুই রকম দেখাতে পারে: (১) পর্যবেক্ষিত প্রবণতা এগিয়ে নেওয়া 'ধরে-নিই' (পরিসংখ্যানগতভাবে সমর্থিত হলে), (২) NASA NEX-GDDP-CMIP6 জলবায়ু-মডেলের পরিবর্তন (delta) — নির্বাচিত জেলা ও বছরের প্যাক থাকলে। দুটোই পরিস্থিতিভিত্তিক, নির্দিষ্ট দিনের পূর্বাভাস নয়।",
      en: "For future years the app can show: (1) the observed trend extended as a what-if (only where statistically supported), or (2) NASA NEX-GDDP-CMIP6 climate-model deltas when a pack exists for the selected district and year. Both are scenarios, not day-specific forecasts.",
    },
    sources: [{ label: "NASA NEX-GDDP-CMIP6", url: "https://www.nccs.nasa.gov/services/data-collections/land-based-products/nex-gddp-cmip6" }],
  },
  {
    id: "voice",
    keys: ["ভয়েস", "voice", "কথা বলে", "speak", "মাইক", "microphone", "mic", "ভয়েস কমান্ড"],
    answer: {
      bn: "মাইক বোতামে চাপ দিয়ে বলুন, যেমন: '২০৫০ সালে যাও', 'বন্যা দেখাও', 'গম দেখাও', 'ড্রোন ভিউ', 'থামো'। ব্রাউজারের স্পিচ রিকগনিশন অনেক ক্ষেত্রে অডিও অনলাইন সার্ভিসে পাঠায় — তাই এটি ঐচ্ছিক; টাইপ, বোতাম বা জেসচারেও একই কাজ হয়।",
      en: "Press the mic button and say things like: 'go to 2050', 'show flood', 'show wheat', 'drone view', 'pause'. Browser speech recognition often sends audio to an online service, so it is optional; typing, buttons and gestures do the same things.",
    },
  },
  {
    id: "sign",
    keys: ["ইশারা", "sign language", "bdsl", "বধির", "deaf", "জেসচার", "gesture", "হাতের", "hand control"],
    answer: {
      bn: "ক্যামেরা চালু করলে ৮টি নির্দিষ্ট হাতের জেসচার দিয়ে সিমুলেটর চালানো যায় (যেমন খোলা তালু = থামুন, বুড়ো আঙুল ওপরে = ১ বছর সামনে)। এটি জেসচার-নিয়ন্ত্রণ, বাংলা ইশারা ভাষা (BdSL) অনুবাদ নয়। সব বার্তা বড় ক্যাপশন, ছবি-চিহ্ন ও কম্পনেও দেখানো হয়। প্রকৃত BdSL ভিডিও শুধু তখনই দেখানো হয় যখন বধির সম্প্রদায়/দোভাষী-যাচাইকৃত ভিডিও যোগ করা থাকে।",
      en: "With the camera on, 8 fixed hand gestures control the simulator (e.g. open palm = pause, thumb up = +1 year). This is gesture control, not Bangla Sign Language (BdSL) translation. Every message is also shown as large captions, pictograms and vibration. Real BdSL videos appear only when videos made/verified by Deaf signers or interpreters have been added.",
    },
  },
  {
    id: "vr",
    keys: ["vr", "ভিআর", "headset", "হেডসেট", "cardboard", "কার্ডবোর্ড", "quest", "virtual reality", "ভার্চুয়াল"],
    answer: {
      bn: "VR হেডসেটে (WebXR সমর্থিত ব্রাউজার) 'VR-এ প্রবেশ' চাপুন: টেলিপোর্ট করে মাঠে হাঁটুন, হাতের রে দিয়ে মেনুর বোতাম চাপুন। মোবাইলে 'কার্ডবোর্ড মোড' দুই-চোখের দৃশ্য দেখায়; মাথা নিচু করলে মেনু খোলে এবং ১.৪ সেকেন্ড তাকিয়ে থাকলে বোতাম চাপ পড়ে। PC-তে মাউস/টাচে ঘোরান।",
      en: "On a headset (WebXR browser) press 'Enter VR': teleport around the field and press menu buttons with the controller ray. On a phone, 'Cardboard mode' shows a two-eye view; look down to open the menu and gaze at a button for 1.4 s to press it. On PC, drag with mouse or touch.",
    },
  },
  {
    id: "growth",
    keys: ["পর্যায়", "stage", "growth stage", "বৃদ্ধির ধাপ", "কিভাবে বাড়ে", "how does it grow", "phenology"],
    answer: {
      bn: "ফসল তাপমাত্রার সঞ্চিত 'তাপ-সময়' (GDD) অনুযায়ী ধাপে ধাপে বাড়ে: অঙ্কুরোদগম → চারা → বাড়ন্ত → প্রজনন → ফুল → দানা ভরা → পরিপক্বতা → কর্তন। গরম বছরে ধাপ দ্রুত শেষ হয় — তাই ফসল আগে পাকে কিন্তু দানা ভরার সময় কমে যেতে পারে।",
      en: "The crop advances by accumulated thermal time (GDD): germination → seedling → vegetative → reproductive → flowering → grain fill → maturity → harvest. In a warmer year stages finish faster, so the crop ripens earlier but grain-fill time can shrink.",
    },
  },
  {
    id: "salinity",
    keys: ["লবণ", "salin", "salt", "লোনা", "উপকূল", "coastal"],
    answer: {
      bn: "মাটির লবণাক্ততা (ECe, dS/m) একটি সীমার ওপরে গেলে ফলন কমে — FAO সেচ ও নিষ্কাশন প্রবন্ধ ২৯-এর সরল মডেল ব্যবহার করা হয়। জমিতে লবণের সাদা আস্তরণ দেখা যায়। স্থানীয় সমাধানের জন্য SRDI, BINA ও BRRI-এর লবণ-সহনশীল জাতের পরামর্শ নিন।",
      en: "Above a threshold, soil salinity (ECe, dS/m) cuts yield — a simple model after FAO Irrigation & Drainage Paper 29. A white salt crust appears on the soil. For local solutions ask SRDI, BINA and BRRI about salt-tolerant varieties.",
    },
    sources: [agency("srdi"), agency("bina"), agency("brri")],
  },
  {
    id: "awd",
    keys: ["awd", "alternate wetting", "সেচ বাঁচ", "পানি বাঁচ", "water saving", "save water", "পর্যায়ক্রমে"],
    answer: {
      bn: "AWD (ভিজিয়ে-শুকিয়ে সেচ) হলো ধানে সব সময় পানি না রেখে মাটি শুকানোর পর আবার সেচ দেওয়া। সিমুলেটরে সেচ-প্যানেল থেকে 'AWD' বেছে সেচের পরিমাণের তুলনা দেখুন। সঠিক নিয়ম স্থানীয় DAE/BRRI-র কাছ থেকে জেনে নিন।",
      en: "AWD (alternate wetting and drying) lets the paddy soil dry before re-irrigating instead of keeping standing water. Pick 'AWD' in the irrigation panel to compare water use. Confirm the right rules with local DAE/BRRI.",
    },
    sources: [agency("dae"), agency("brri")],
  },
  {
    id: "recycle",
    keys: ["পুনর্ব্যবহার", "recycl", "খড়", "straw", "husk", "তুষ", "circular", "বৃত্তাকার", "বর্জ্য", "waste", "burn straw", "খড় পোড়"],
    answer: {
      bn: "মাঠে খড় পোড়ানো নিরুৎসাহিত — ধোঁয়া, পুষ্টি ও জৈব পদার্থ নষ্ট। বিকল্প: কম্পোস্ট, ছত্রাক-চাষ (মাশরুম), গবাদি খাদ্য, গোবরের সঙ্গে বায়োগ্যাস, তুষ থেকে বায়োচার/ব্রিকেট, ও মাটিতে মালচ। 'পুনর্ব্যবহার' প্যানেলে আপনার জমির আকার দিয়ে আনুমানিক পরিমাণ (সম্পাদনযোগ্য সহগসহ) দেখুন।",
      en: "Burning straw in the field is discouraged — smoke, lost nutrients and organic matter. Alternatives: compost, mushroom growing, animal feed, biogas with dung, biochar/briquettes from husk, and mulch. Open the Recycling panel to see approximate quantities for your field size (editable coefficients).",
    },
    sources: [agency("dae"), agency("bari"), agency("srdi")],
  },
  {
    id: "gov",
    keys: ["সরকারি", "government", "সরকার", "dae", "কৃষি অধিদপ্তর", "কৃষি অফিস", "extension", "কৃষি কর্মকর্তা", "krishi", "কৃষি কল"],
    answer: {
      bn: `কৃষি পরামর্শের জন্য কৃষি কল সেন্টার ${KRISHI_CALL_CENTER}; স্থানীয় উপসহকারী কৃষি কর্মকর্তা (SAAO)/DAE অফিসে যোগাযোগ করুন। সতর্কবার্তা: আবহাওয়া অধিদপ্তর (BMD), বন্যা পূর্বাভাস কেন্দ্র (FFWC), দুর্যোগ ব্যবস্থাপনা অধিদপ্তর (DDM)। 'সরকারি তথ্য' প্যানেলে সব সংস্থার লিংক আছে।`,
      en: `For farming advice call the Krishi Call Centre ${KRISHI_CALL_CENTER} or your local DAE office (SAAO). Warnings: Bangladesh Meteorological Department (BMD), Flood Forecasting & Warning Centre (FFWC), Department of Disaster Management (DDM). The Government panel links every agency.`,
    },
    sources: [agency("dae"), agency("bmd"), agency("ffwc"), agency("ddm"), agency("bamis")],
  },
  {
    id: "privacy",
    keys: ["গোপনীয়", "privacy", "ক্যামেরা", "camera", "ডেটা পাঠ", "tracking", "তথ্য সংগ্রহ"],
    answer: {
      bn: "হাতের জেসচার শনাক্তকরণ আপনার ব্রাউজারেই চলে (MediaPipe নিজের সাইট থেকে লোড হয়); ক্যামেরার ছবি কোথাও পাঠানো বা সংরক্ষণ করা হয় না। ভয়েস রিকগনিশন ব্রাউজার/ডিভাইসের সেবা ব্যবহার করে — কিছু ব্রাউজারে তা অনলাইনে অডিও পাঠায়। আপনার অবস্থান জানতে চাওয়া হয় না।",
      en: "Hand-gesture recognition runs inside your browser (MediaPipe is served from this site); camera frames are never sent or stored. Voice recognition uses your browser/device service — in some browsers that sends audio online. Your location is never requested.",
    },
  },
];

const SAFETY_WORDS = ["জরুরি", "emergency", "বাঁচাও", "help me", "আগুন", "fire", "ডুবে", "drowning", "সাপে কাম", "snake bite", "ঘূর্ণিঝড়ের সংকেত", "evacuat", "আশ্রয়কেন্দ্র", "shelter", "dizzy", "faint", "unconscious", "chest pain", "heat stroke", "heatstroke", "bleeding", "can't breathe", "মাথা ঘুরছে", "অজ্ঞান", "বুকে ব্যথা", "হিটস্ট্রোক", "রক্তপাত"];

function safetyReply(lang: Lang): AssistantReply {
  return {
    kind: "safety",
    text:
      lang === "bn"
        ? `জরুরি অবস্থায় এখনই ${NATIONAL_EMERGENCY} নম্বরে ফোন করুন এবং নিরাপদ স্থানে যান। এই অ্যাপ একটি সিমুলেটর — এটি কোনো বাস্তব ঘটনার সতর্কতা বা উদ্ধার সেবা নয়। বাস্তব সতর্কতার জন্য BMD, FFWC ও DDM দেখুন।`
        : `In an emergency call ${NATIONAL_EMERGENCY} right now and move to a safe place. This app is a simulator — not a real-time warning or rescue service. For real warnings use BMD, FFWC and DDM.`,
    commands: [],
    sources: [agency("bmd"), agency("ffwc"), agency("ddm")],
  };
}

/* ----------------------- answers that read the screen ----------------------- */

function contextAnswer(t: string, view: View, lang: Lang): AssistantReply | null {
  const bn = lang === "bn";
  const crop = CROPS[view.state.cropId];
  const cropName = bn ? crop.nameBn : crop.nameEn;
  const place = bn ? view.placeName.bn : view.placeName.en;
  const kind = KIND_LABEL[view.dataKind];

  if (has(t, ["ফলন", "yield", "কেমন হবে", "how will", "production", "উৎপাদন", "index", "সূচক"])) {
    const lossParts = Object.entries(view.sim.loss)
      .filter(([, v]) => v > 0.02)
      .map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`);
    const lossTxt = lossParts.length ? lossParts.join(", ") : bn ? "উল্লেখযোগ্য ক্ষতি নেই" : "no notable losses";
    return {
      kind: "answer",
      text: bn
        ? `${place}, ${view.state.year}, ${cropName}: আপেক্ষিক ফলন সূচক ${view.index.toFixed(0)} (বহুবছরের গড় বেসলাইন = ১০০)। মডেলের ক্ষতির উপাদান: ${lossTxt}। তথ্যের ধরন: ${kind.bn}। এটি শিক্ষামূলক আপেক্ষিক সংখ্যা, বাস্তব ফলনের নিশ্চয়তা নয়।`
        : `${place}, ${view.state.year}, ${cropName}: relative yield index ${view.index.toFixed(0)} (multi-year baseline = 100). Modelled loss factors: ${lossTxt}. Data kind: ${kind.en}. This is an educational relative number, not a guaranteed real yield.`,
      commands: [],
      sources: [{ label: "NASA POWER", url: "https://power.larc.nasa.gov" }],
      openPanel: "crop",
    };
  }
  if (has(t, ["আবহাওয়া", "weather", "তাপমাত্রা", "temperature", "বৃষ্টি কত", "how much rain", "rainfall", "গরম কত"])) {
    const a = view.annual;
    return {
      kind: "answer",
      text: bn
        ? `${place}, ${view.state.year}: বার্ষিক গড় সর্বোচ্চ তাপমাত্রা ${a.tmax.toFixed(1)}°C (বেসলাইন ${a.baseTmax.toFixed(1)}°C), গড় সর্বনিম্ন ${a.tmin.toFixed(1)}°C, মোট বৃষ্টি প্রায় ${a.rainMm.toFixed(0)} মিমি (বেসলাইন ${a.baseRainMm.toFixed(0)} মিমি)। উৎস/ধরন: ${kind.bn}।`
        : `${place}, ${view.state.year}: mean annual max temperature ${a.tmax.toFixed(1)}°C (baseline ${a.baseTmax.toFixed(1)}°C), mean min ${a.tmin.toFixed(1)}°C, total rain about ${a.rainMm.toFixed(0)} mm (baseline ${a.baseRainMm.toFixed(0)} mm). Source/kind: ${kind.en}.`,
      commands: [],
      sources: [{ label: "NASA POWER", url: "https://power.larc.nasa.gov" }],
      openPanel: "data",
    };
  }
  if (has(t, ["এই তথ্য", "এই ডাটা", "this data", "is this real", "বাস্তব", "real data", "কোন ধরনের", "what kind of data", "observed", "পর্যবেক্ষিত"])) {
    const ex = KIND_EXPLAIN[view.dataKind];
    return {
      kind: "answer",
      text: `${bn ? kind.bn : kind.en}. ${bn ? ex.bn : ex.en}`,
      commands: [],
      sources: [{ label: "NASA POWER", url: "https://power.larc.nasa.gov" }],
    };
  }
  if (has(t, ["এখন কোন ধাপ", "which stage", "what stage", "কোন পর্যায়", "এখন কি অবস্থা", "current stage"])) {
    const st = STAGE_LABEL[view.stage];
    return {
      kind: "answer",
      text: bn ? `${cropName} এখন "${st.bn}" ধাপে, বপনের ${view.state.day} দিন পরে।` : `${cropName} is in the "${st.en}" stage, ${view.state.day} days after sowing.`,
      commands: [],
      sources: [],
    };
  }
  if (has(t, ["কোন নাসা", "which nasa", "nasa data used", "কি ডাটা", "উপাত্ত কি", "what data", "datasets used"])) {
    return {
      kind: "answer",
      text: bn
        ? `এই সিমুলেশনে NASA POWER কৃষি-আবহাওয়া (১৯৮১-২০২৫ দৈনিক Tmax, Tmin, বৃষ্টি), NASA NEX-GDDP-CMIP6 ভবিষ্যৎ জলবায়ু প্রক্ষেপণ, এবং MODIS/HLS উদ্ভিদের সবুজতা সূচক (NDVI) ব্যবহৃত হয়েছে।`
        : `This simulation uses NASA POWER Agroclimatology (1981–2025 daily Tmax, Tmin, rain), NASA NEX-GDDP-CMIP6 downscaled climate projections, and MODIS/HLS vegetation indices (NDVI).`,
      commands: [],
      sources: [{ label: "NASA POWER", url: "https://power.larc.nasa.gov" }, { label: "NEX-GDDP-CMIP6", url: "https://registry.opendata.aws/nex-gddp-cmip6/" }],
      openPanel: "data",
    };
  }
  if (has(t, ["কেন পরিবর্তন", "why change", "কেন কমল", "কেন বাড়ল", "why did it change", "কেন ফলন", "কারণ কি", "what is the reason"])) {
    const losses = view.sim.loss;
    const dominant = Object.entries(losses).sort((a, b) => b[1] - a[1])[0];
    const causeBn = dominant && dominant[1] > 0.05
      ? `মূল কারণ হলো ${dominant[0] === "heat" ? "অতিরিক্ত তাপমাত্রা ও তাপপ্রবাহের চাপ" : dominant[0] === "water" ? "মূল-অঞ্চলে পানির ঘাটতি ও খরা চাপ" : dominant[0] === "salinity" ? "মাটির অতিরিক্ত লবণাক্ততা" : "প্রাকৃতিক দুর্যোগের ক্ষতি"} (${(dominant[1] * 100).toFixed(0)}% ক্ষতি)।`
      : "আবহাওয়া এবং সেচ অবস্থা ফসলের জন্য তুলনামূলকভাবে অনুকূল ছিল।";
    const causeEn = dominant && dominant[1] > 0.05
      ? `Primary driver was ${dominant[0] === "heat" ? "extreme temperature stress during reproductive stages" : dominant[0] === "water" ? "root-zone soil water deficit" : dominant[0] === "salinity" ? "soil salinity stress" : "hazard damage"} (${(dominant[1] * 100).toFixed(0)}% loss).`
      : "Weather and moisture conditions were relatively favorable for this crop.";
    return {
      kind: "answer",
      text: `${bn ? "ফলাফল পরিবর্তনের বৈজ্ঞানিক কারণ: " : "Scientific reason for outcome shift: "}${bn ? causeBn : causeEn}`,
      commands: [],
      sources: [{ label: "FAO-56 Crop Model", url: "https://www.fao.org/land-water/databases-and-software/cropwat/en/" }],
      openPanel: "crop",
    };
  }
  if (has(t, ["ধারণা কি", "কী ধরে", "assumptions", "what does it assume", "মডেল ধারণা"])) {
    return {
      kind: "answer",
      text: bn
        ? `সিমুলেশনের বৈজ্ঞানিক ধারণা: (১) FAO-56 ডুয়াল ফসল গুণাঙ্ক (Kc) পদ্ধতি, (২) Hargreaves পদ্ধতিতে সম্ভাব্য বাষ্পীভবন (ET₀) হিসাব, (৩) সার ও বালাই ব্যবস্থাপনা স্বাভাবিক ধরে নেওয়া হয়েছে। এটি বাস্তব ফলন পূর্বাভাস নয়, আপেক্ষিক সিদ্ধান্ত যাচাইয়ের মডেল।`
        : `Scientific simulation assumptions: (1) FAO-56 dual crop coefficient (Kc) method, (2) Hargreaves reference evapotranspiration (ET₀), (3) fertilizer and pest management are assumed non-limiting. It evaluates relative climate impacts, not operational yields.`,
      commands: [],
      sources: [{ label: "FAO-56 Methodology", url: "https://www.fao.org/3/x0490e/x0490e00.htm" }],
    };
  }
  if (has(t, ["অনিশ্চয়তা", "uncertainty", "কেন অনিশ্চিত", "why uncertainty", "নির্ভুল"])) {
    return {
      kind: "answer",
      text: bn
        ? `অনিশ্চয়তার কারণ: (১) NASA POWER গ্রিড প্রায় ৫০ কিমি—একটি নির্দিষ্ট ক্ষুদ্র জমির জন্য নয়, (২) মৌসুমি বৃষ্টির আন্তঃবার্ষিক প্রাকৃতিক পরিবর্তনশীলতা, (৩) ভবিষ্যৎ জলবায়ু মডেলে বিভিন্ন GCM-এর মধ্যে পার্থক্যের বিস্তার (multi-model spread)।`
        : `Sources of uncertainty: (1) NASA POWER grid is ~50 km—not a micro-scale field sensor, (2) high inter-annual variability of monsoon rains, (3) inter-model spread across different CMIP6 climate models.`,
      commands: [],
      sources: [{ label: "NASA POWER Docs", url: "https://power.larc.nasa.gov/docs/" }],
    };
  }
  return null;
}

function hazardSafety(t: string, lang: Lang): AssistantReply | null {
  if (!has(t, ["কি করব", "কী করব", "what should i do", "what to do", "কিভাবে বাঁচ", "how to protect", "প্রস্তুতি", "prepare", "mitigat"])) return null;
  for (const [hz, words] of HAZARD_WORDS) {
    if (!has(t, words)) continue;
    const tips: Record<HazardType, LocalizedText> = {
      flood: { bn: "বন্যার আগে: FFWC সতর্কতা অনুসরণ, ফসল আগাম কেটে নেওয়া (পাকা হলে), বীজ ও যন্ত্র উঁচুতে রাখা, নিষ্কাশন নালা পরিষ্কার, প্রয়োজনে নিমজ্জন-সহনশীল জাত (যেমন স্বর্ণ-সাব১) সম্পর্কে DAE/BRRI-র পরামর্শ।", en: "Before a flood: follow FFWC warnings, harvest early if mature, move seed and equipment up, clear drains, and ask DAE/BRRI about submergence-tolerant varieties." },
      drought: { bn: "খরায়: AWD বা মালচ ব্যবহার, সকালে/সন্ধ্যায় সেচ, কম পানির ফসল বিবেচনা, BAMIS-এর আবহাওয়া-কৃষি পরামর্শ দেখা।", en: "In drought: use AWD or mulch, irrigate morning/evening, consider low-water crops, and check BAMIS agro-advisories." },
      cyclone: { bn: "ঘূর্ণিঝড়ে: BMD সংকেত মানুন, নিজে ও পরিবার আশ্রয়কেন্দ্রে যান, পাকা ফসল আগে কেটে নিতে পারলে নিন, পশু-সম্পদ নিরাপদ করুন। জীবন ফসলের চেয়ে আগে।", en: "In a cyclone: follow BMD signals, move family to a shelter, harvest mature crops early only if safe, secure livestock. Life comes before crops." },
      heatwave: { bn: "তাপপ্রবাহে: ফুল ও দানা-ভরার সময় সন্ধ্যায় হালকা সেচ, দিনের গরম সময়ে মাঠে কাজ এড়ানো, প্রচুর পানি পান।", en: "In a heatwave: light evening irrigation during flowering/grain fill, avoid fieldwork at midday, drink plenty of water." },
      salinity: { bn: "লবণাক্ততায়: লবণ-সহনশীল জাত (BRRI/BINA), মিঠা পানির সেচ ও বৃষ্টির পানি সংরক্ষণ, মালচ, SRDI-র মাটি পরীক্ষা।", en: "With salinity: salt-tolerant varieties (BRRI/BINA), fresh-water irrigation and rainwater storage, mulch, and SRDI soil testing." },
    };
    const srcs: Record<HazardType, string[]> = { flood: ["ffwc", "dae", "brri"], drought: ["bamis", "dae"], cyclone: ["bmd", "ddm"], heatwave: ["bmd", "dae"], salinity: ["srdi", "bina", "brri"] };
    return {
      kind: "answer",
      text: `${lang === "bn" ? tips[hz].bn : tips[hz].en} ${lang === "bn" ? `জরুরি অবস্থায় ${NATIONAL_EMERGENCY}।` : `Emergency: ${NATIONAL_EMERGENCY}.`}`,
      commands: [{ type: "addHazard", hazard: hz }],
      sources: srcs[hz].map(agency),
      openPanel: "hazard",
    };
  }
  return null;
}

function pathwayAnswer(t: string, lang: Lang): AssistantReply | null {
  for (const [id, words] of PATHWAY_WORDS) {
    if (!has(t, words)) continue;
    const p = PATHWAYS.find((x) => x.id === id);
    if (!p) continue;
    const bn = lang === "bn";
    return {
      kind: "answer",
      text: `${bn ? p.name.bn : p.name.en}: ${bn ? p.how.bn : p.how.en} ${bn ? "পাওয়া যায়:" : "You get:"} ${bn ? p.returns.bn : p.returns.en} ${bn ? "সতর্কতা:" : "Watch out:"} ${bn ? p.watchOut.bn : p.watchOut.en}`,
      commands: id === "burn" ? [] : [{ type: "setPathway", id }],
      sources: p.ask.map(agency),
      openPanel: "recycle",
    };
  }
  return null;
}

/* ------------------------------- main entry ------------------------------- */

export function respond(raw: string, view: View, langHint?: Lang): AssistantReply {
  const state = view.state;
  const t = normalise(raw);
  const lang: Lang = langHint ?? state.lang;
  const bn = lang === "bn";

  if (!t) {
    return { kind: "fallback", text: bn ? "আমি শুনতে পাইনি। আবার বলুন বা লিখুন।" : "I did not catch that. Please say or type it again.", commands: [], sources: [] };
  }
  if (has(t, SAFETY_WORDS)) return safetyReply(lang);

  // Questions are answered before commands so "what should I do in a flood" does not just trigger a flood scene.
  const hs = hazardSafety(t, lang);
  if (hs) return hs;
  const ctx = contextAnswer(t, view, lang);
  if (ctx) return ctx;

  const commands = parseCommands(raw, state);
  if (commands.length > 0) {
    const cmdLang: Lang = commands.find((c) => c.type === "setLang")?.type === "setLang" ? (commands.find((c) => c.type === "setLang") as { lang: Lang }).lang : lang;
    const parts = commands.map((c) => describeShort(c, cmdLang));
    return { kind: "command", text: parts.join(" "), commands, sources: [] };
  }

  const pw = pathwayAnswer(t, lang);
  if (pw) return pw;

  let best: { topic: Topic; score: number } | null = null;
  for (const topic of TOPICS) {
    const score = topic.keys.reduce((s, k) => s + (hit(t, k) ? Math.max(1, Math.min(3, Math.floor(k.length / 4))) : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  if (best) {
    return { kind: "answer", text: bn ? best.topic.answer.bn : best.topic.answer.en, commands: [], sources: best.topic.sources ?? [] };
  }

  return {
    kind: "fallback",
    text: bn
      ? `দুঃখিত, এটি আমার জানা নেই — আমি অনুমান করে উত্তর দিই না। চেষ্টা করুন: "২০৫০ সালে যাও", "বন্যা দেখাও", "গম দেখাও", "ফলন কেমন?", "খড় কী করব?"। কৃষি পরামর্শে কৃষি কল সেন্টার ${KRISHI_CALL_CENTER}।`
      : `Sorry, I do not know that — I do not guess. Try: "go to 2050", "show flood", "show wheat", "how is the yield?", "what to do with straw?". For farming advice call the Krishi Call Centre ${KRISHI_CALL_CENTER}.`,
    commands: [],
    sources: [agency("dae")],
  };
}

function describeShort(c: Command, lang: Lang): string {
  // lazy import avoided: small local copy keeps this module independent of commands.ts runtime exports
  const bn = lang === "bn";
  switch (c.type) {
    case "setYear":
      return bn ? `সাল ${c.year} দেখাচ্ছি।` : `Showing ${c.year}.`;
    case "addYears":
      return bn ? `${Math.abs(c.delta)} বছর ${c.delta > 0 ? "সামনে" : "পিছনে"}।` : `${Math.abs(c.delta)} year(s) ${c.delta > 0 ? "forward" : "back"}.`;
    case "setDay":
      return bn ? `বপনের ${c.day} দিন পরে।` : `Day ${c.day}.`;
    case "addDays":
      return bn ? `${Math.abs(c.delta)} দিন ${c.delta > 0 ? "এগিয়ে" : "পিছিয়ে"}।` : `${Math.abs(c.delta)} day(s) ${c.delta > 0 ? "forward" : "back"}.`;
    case "play":
      return bn ? "চালাচ্ছি।" : "Playing.";
    case "pause":
      return bn ? "থামালাম।" : "Paused.";
    case "setCrop":
      return bn ? `ফসল: ${CROPS[c.crop].nameBn}।` : `Crop: ${CROPS[c.crop].nameEn}.`;
    case "setLang":
      return c.lang === "bn" ? "ভাষা বাংলা।" : "Language: English.";
    case "setDistrict": {
      const d = DISTRICTS.find((x) => x.id === c.id);
      return d ? (bn ? `জেলা: ${d.nameBn}।` : `District: ${d.nameEn}.`) : "";
    }
    case "addHazard":
    case "toggleHazard":
      return bn ? "শিক্ষামূলক দুর্যোগ দৃশ্য পরিবর্তিত (পূর্বাভাস নয়)।" : "Educational hazard scene changed (not a forecast).";
    case "clearHazards":
      return bn ? "দুর্যোগ দৃশ্য সরানো হলো।" : "Hazard scenes cleared.";
    case "setScenario":
      return bn ? "'ধরে-নিই' মান পরিবর্তিত (পূর্বাভাস নয়)।" : "What-if values changed (not a forecast).";
    case "setIrrigation":
      return bn ? "সেচ পদ্ধতি পরিবর্তিত।" : "Irrigation mode changed.";
    case "setCamera":
      return bn ? "ক্যামেরা পরিবর্তিত।" : "Camera changed.";
    case "setTod":
      return bn ? "দিনের সময় পরিবর্তিত।" : "Time of day changed.";
    case "setPathway":
      return bn ? "পুনর্ব্যবহার স্টেশন দেখাচ্ছি।" : "Showing the recycling station.";
    case "openPanel":
      return bn ? "প্যানেল খুলছি।" : "Opening the panel.";
    case "reset":
      return bn ? "রিসেট।" : "Reset.";
    default:
      return bn ? "ঠিক আছে।" : "Done.";
  }
}

/** Example phrases shown as tappable chips. */
export const SUGGESTIONS: { bn: string; en: string }[] = [
  { bn: "২০৫০ সালে যাও", en: "Go to 2050" },
  { bn: "বন্যা দেখাও", en: "Show flood" },
  { bn: "গম দেখাও", en: "Show wheat" },
  { bn: "ফলন কেমন?", en: "How is the yield?" },
  { bn: "ড্রোন ভিউ", en: "Drone view" },
  { bn: "খড় কী করব?", en: "What to do with straw?" },
  { bn: "বন্যায় কী করব?", en: "What to do in a flood?" },
  { bn: "এই তথ্য কি বাস্তব?", en: "Is this data real?" },
];
