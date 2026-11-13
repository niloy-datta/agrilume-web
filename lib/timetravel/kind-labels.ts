import type { DataKind, LocalizedText } from "./types";

/**
 * Plain-language labels for what kind of data is on screen. Shown wherever a number, chart or 3D scene appears so a
 * user can never mistake a what-if for an observation.
 */
export const KIND_LABEL: Record<DataKind, LocalizedText> = {
  observed: { bn: "NASA POWER পর্যবেক্ষিত", en: "NASA POWER observed" },
  "cached-observation": { bn: "সংরক্ষিত পর্যবেক্ষণ (ক্যাশ)", en: "Cached observation" },
  "observed-filled": { bn: "পর্যবেক্ষিত (কিছু মাস গড়ে পূরণ)", en: "Observed (some months filled with mean)" },
  "trend-what-if": { bn: "ধরে-নিই (প্রবণতা) — পূর্বাভাস নয়", en: "What-if (trend) — not a forecast" },
  "nasa-projection": { bn: "NASA NEX-GDDP-CMIP6 প্রক্ষেপণ", en: "NASA NEX-GDDP-CMIP6 projection" },
  "model-projection": { bn: "NASA জলবায়ু মডেল প্রক্ষেপণ", en: "NASA model projection" },
  simulator: { bn: "সিমুলেটর (শিক্ষামূলক)", en: "Simulator (educational)" },
  "educational-simulation": { bn: "শিক্ষামূলক সিমুলেশন", en: "Educational simulation" },
  "unavailable-data": { bn: "তথ্য অপ্রাপ্য (সতর্কবার্তা)", en: "Unavailable data (alert)" },
};

export const KIND_EXPLAIN: Record<DataKind, LocalizedText> = {
  observed: {
    bn: "এই বছরের তাপমাত্রা ও বৃষ্টি NASA POWER-এর বাস্তব পর্যবেক্ষণ/পুনর্বিশ্লেষণ থেকে নেওয়া।",
    en: "This year's temperature and rain come from real NASA POWER observation/reanalysis data.",
  },
  "cached-observation": {
    bn: "পূর্বে ডাউনলোডকৃত আসল NASA পর্যবেক্ষণ ডেটা ব্রাউজার ক্যাশ থেকে লোড করা হয়েছে।",
    en: "Authentic NASA observation data loaded from local browser cache.",
  },
  "observed-filled": {
    bn: "এই বছরের কিছু মাসের তথ্য পাওয়া যায়নি, সেগুলো বহুবছরের গড় দিয়ে ভরা হয়েছে।",
    en: "Some months of this year were missing and were filled with the multi-year mean.",
  },
  "trend-what-if": {
    bn: "ভবিষ্যৎ বছর: পর্যবেক্ষিত তাপমাত্রা-প্রবণতা এগিয়ে নেওয়া হয়েছে (যতটুকু পরিসংখ্যানগতভাবে সমর্থিত) এবং আপনার বেছে নেওয়া 'ধরে-নিই' মান যোগ হয়েছে। এটি পূর্বাভাস নয়।",
    en: "Future year: the observed temperature trend is extended (only where statistically supported) plus your chosen what-if values. This is not a forecast.",
  },
  "nasa-projection": {
    bn: "NASA NEX-GDDP-CMIP6 জলবায়ু মডেলের পরিবর্তন (delta) পর্যবেক্ষিত গড়ের ওপর যোগ করা হয়েছে। এটি পরিস্থিতিভিত্তিক প্রক্ষেপণ, নির্দিষ্ট দিনের পূর্বাভাস নয়।",
    en: "NASA NEX-GDDP-CMIP6 model deltas are added to the observed mean. This is a scenario projection, not a day-specific forecast.",
  },
  "model-projection": {
    bn: "NASA জলবায়ু মডেল বা প্রক্ষেপণ API থেকে প্রাপ্ত বৈজ্ঞানিক প্রক্ষেপণ। এটি আবহাওয়ার পূর্বাভাস নয়।",
    en: "Scientific projection from NASA downscaled climate models. Not a weather forecast.",
  },
  simulator: {
    bn: "শিক্ষামূলক ফসল-মডেলের ফল; বাস্তব ফলনের নিশ্চয়তা নয়।",
    en: "Educational crop-model output; not a guaranteed real yield.",
  },
  "educational-simulation": {
    bn: "শিক্ষামূলক সিদ্ধান্ত পরীক্ষাগারের ফলাফল; কৃষকের বাস্তব সিদ্ধান্তের জন্য স্থানীয় কৃষি অফিসে যোগাযোগ করুন।",
    en: "Educational decision lab result; consult your local agriculture extension office for field decisions.",
  },
  "unavailable-data": {
    bn: "এই অঞ্চলের জন্য নির্দিষ্ট ডেটা সরাসরি পাওয়া যায়নি; ভুয়া বা কাল্পনিক ডেটা দেখানো হয় না।",
    en: "Specific data for this location could not be loaded; simulated or fabricated numbers are never shown.",
  },
};
