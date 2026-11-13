/**
 * Bangla versions of the explanatory notes produced (in English) by the climate, crop and recycling engines.
 * Each rule matches one note template exactly. Numbers are converted to Bangla digits; dataset/product names
 * (NASA POWER, NEX-GDDP-CMIP6, SSP2-4.5) are kept as proper names. Unknown notes return null so the caller can
 * show the English text rather than a wrong translation; tests/notes-bn.test.ts checks every template is covered.
 */
import { asciiToBnDigits } from "./locations";
import type { Lang } from "./types";

const d = (s: string) => asciiToBnDigits(s);
const ssp = (s: string) => (s === "ssp245" ? "SSP2-4.5" : s === "ssp585" ? "SSP5-8.5" : s);

const RULES: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Day-to-day Tmax variability uses a default of ([\d.]+) °C \(no daily data loaded\)\.$/, (m) => `দিন-দিন সর্বোচ্চ তাপমাত্রার ওঠানামা ধরা হয়েছে ${d(m[1])} °C (দৈনিক তথ্য লোড হয়নি)।`],
  [/^Some months of this year are missing; the multi-year mean was used for them\.$/, () => "এই বছরের কিছু মাসের তথ্য নেই; সেই মাসগুলোতে বহু বছরের গড় ব্যবহার করা হয়েছে।"],
  [/^Projection pack NOT applied: /, () => "NASA প্রক্ষেপণ প্রয়োগ করা হয়নি: এটি নির্বাচিত জেলার, কিন্তু দেখানো তথ্য অন্য জায়গার বদলি তথ্য।"],
  [
    /^NASA NEX-GDDP-CMIP6 (\w+)(?: (\d{4})-(\d{4}) mean)? .* delta from (\d{4})-(\d{4}) applied to the observed NASA POWER (\d{4})-(\d{4}) mean \(same window as the model baseline\)\.$/,
    (m) =>
      `NASA NEX-GDDP-CMIP6 ${ssp(m[1])}${m[2] ? ` (${d(m[2])}–${d(m[3])} গড়)` : ""}: ${d(m[4])}–${d(m[5])}-এর তুলনায় পরিবর্তন, NASA POWER-এর ${d(m[6])}–${d(m[7])} পর্যবেক্ষিত গড়ের ওপর যোগ করা হয়েছে (মডেলের ভিত্তি-সময়ের সাথে একই সময়)।`,
  ],
  [/^Only (\d+) baseline years: /, (m) => `ভিত্তি-সময় মাত্র ${d(m[1])} বছর: এত অল্প সময়ের বছর-বছর ওঠানামায় অনিশ্চয়তা বাড়ে, বিশেষ করে বৃষ্টিতে।`],
  [/^Rainfall change is left at 1× /, () => "যেসব মাসে মডেলের অতীত বৃষ্টি প্রায় শূন্য, সেখানে বৃষ্টির পরিবর্তন ১× রাখা হয়েছে, কারণ অনুপাতটি অর্থহীন বা অস্থির।"],
  [/^The observed record does not cover the projection pack's baseline window/, () => "পর্যবেক্ষিত তথ্যে প্রক্ষেপণের ভিত্তি-সময় নেই, তাই প্রক্ষেপণ প্রয়োগ করা হয়নি।"],
  [
    /^No NASA projection for (\d{4}): the bundled NEX-GDDP-CMIP6 pack only covers the (\d{4})-(\d{4}) mean \(shown at ([\d, ]+)\)\. Showing a labelled trend what-if instead\.$/,
    (m) => `${d(m[1])} সালের জন্য NASA প্রক্ষেপণ নেই: অ্যাপের NEX-GDDP-CMIP6 প্যাক শুধু ${d(m[2])}–${d(m[3])} গড় দেয় (${d(m[4])} সালে দেখানো)। তার বদলে চিহ্নিত ‘ধরে-নিই’ প্রবণতা দেখানো হচ্ছে।`,
  ],
  [/^No NEX-GDDP-CMIP6 projection pack for this place\/year/, () => "এই জায়গা/বছরের জন্য NEX-GDDP-CMIP6 প্রক্ষেপণ নেই; তার বদলে ‘ধরে-নিই’ প্রবণতা দেখানো হচ্ছে।"],
  [
    /^Observed warming trend applied \(Tmax ([-\d.]+) °C\/decade, Tmin ([-\d.]+) °C\/decade\)\.$/,
    (m) => `পর্যবেক্ষিত উষ্ণায়নের প্রবণতা যোগ করা হয়েছে (সর্বোচ্চ তাপমাত্রা প্রতি দশকে ${d(m[1])} °C, সর্বনিম্ন ${d(m[2])} °C)।`,
  ],
  [/^The observed temperature trend in this record is not statistically distinguishable from zero/, () => "এই তথ্যে তাপমাত্রার প্রবণতা পরিসংখ্যানগতভাবে শূন্য থেকে আলাদা নয়, তাই কোনো প্রবণতা যোগ করা হয়নি।"],
  [/^Rainfall: no trend applied/, () => "বৃষ্টি: কোনো প্রবণতা যোগ করা হয়নি (বর্ষার বৃষ্টি বছর-বছর এত ওঠানামা করে যে নির্ভরযোগ্য সরল প্রবণতা পাওয়া যায় না)।"],
  [/^User what-if deltas applied/, () => "আপনার ‘ধরে-নিই’ পরিবর্তন (তাপমাত্রা / বৃষ্টি) যোগ করা হয়েছে।"],
  [/^The crop did not reach maturity within (\d+) days/, (m) => `এই আবহাওয়ায় ${d(m[1])} দিনের মধ্যে ফসল পাকেনি (মৌসুম খুব ঠান্ডা/ছোট)।`],
  [/^Using your own residue-to-grain ratio\.$/, () => "আপনার দেওয়া খড়-শস্য অনুপাত ব্যবহার করা হচ্ছে।"],
  [/^Shares summed to (\d+)%; they were normalised to 100%\.$/, (m) => `ভাগগুলোর যোগফল ছিল ${d(m[1])}%; সেগুলোকে ১০০%-এ মিলিয়ে নেওয়া হয়েছে।`],
  [/^Husk-based pathways apply to rice only\.$/, () => "তুষ-ভিত্তিক ব্যবহার শুধু ধানের ক্ষেত্রে প্রযোজ্য।"],
  [/^Nutrient concentrations are provided for rice straw only\.$/, () => "পুষ্টি-উপাদানের মান শুধু ধানের খড়ের জন্য দেওয়া আছে।"],
];

/** Bangla text for a known engine note, or null if the template is unknown. */
export function noteBn(en: string): string | null {
  for (const [re, f] of RULES) {
    const m = en.match(re);
    if (m) return f(m);
  }
  return null;
}

/** The note in the user's language (falls back to English only for an unknown template). */
export function localizeNote(en: string, lang: Lang): string {
  return lang === "bn" ? (noteBn(en) ?? en) : en;
}
