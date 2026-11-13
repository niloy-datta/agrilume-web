import type { DataKind, LocalizedText } from "./types";

/**
 * Plain-language labels for what kind of data is on screen. Shown wherever a number, chart or 3D scene appears so a
 * user can never mistake a what-if for an observation.
 */
export const KIND_LABEL: Record<DataKind, LocalizedText> = {
  observed: { bn: "NASA POWER পর্যবেক্ষিত", en: "NASA POWER observed" },
  "observed-filled": { bn: "পর্যবেক্ষিত (কিছু মাস গড়ে পূরণ)", en: "Observed (some months filled with mean)" },
  "trend-what-if": { bn: "ধরে-নিই (প্রবণতা) — পূর্বাভাস নয়", en: "What-if (trend) — not a forecast" },
  "nasa-projection": { bn: "NASA NEX-GDDP-CMIP6 প্রক্ষেপণ", en: "NASA NEX-GDDP-CMIP6 projection" },
  simulator: { bn: "সিমুলেটর (শিক্ষামূলক)", en: "Simulator (educational)" },
};

export const KIND_EXPLAIN: Record<DataKind, LocalizedText> = {
  observed: {
    bn: "এই বছরের তাপমাত্রা ও বৃষ্টি NASA POWER-এর বাস্তব পর্যবেক্ষণ/পুনর্বিশ্লেষণ থেকে নেওয়া।",
    en: "This year's temperature and rain come from real NASA POWER observation/reanalysis data.",
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
  simulator: {
    bn: "শিক্ষামূলক ফসল-মডেলের ফল; বাস্তব ফলনের নিশ্চয়তা নয়।",
    en: "Educational crop-model output; not a guaranteed real yield.",
  },
};
