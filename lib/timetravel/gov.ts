import type { LocalizedText } from "./types";

/**
 * Bangladesh Government agriculture & disaster agencies.
 *
 * Domains were checked on 2026-11-08 against web search results that returned pages on these exact hosts.
 * Agrilume is NOT an official government service and does not copy their data; it links to them and
 * tells farmers to follow them for warnings and recommendations. Re-check links with `npm run check:links`.
 */

export type AgencyRole = "extension" | "research" | "soil" | "weather" | "flood" | "disaster" | "market" | "policy";

export interface Agency {
  id: string;
  acronym: string;
  name: LocalizedText;
  url: string;
  role: AgencyRole;
  provides: LocalizedText;
  useInAgrilume: LocalizedText;
  /** deep links verified to exist in search results, if any */
  deepLinks?: { label: LocalizedText; url: string }[];
}

export const KRISHI_CALL_CENTER = "16123";
export const NATIONAL_EMERGENCY = "999";

export const AGENCIES: Agency[] = [
  {
    id: "dae",
    acronym: "DAE",
    name: { bn: "কৃষি সম্প্রসারণ অধিদপ্তর", en: "Department of Agricultural Extension" },
    url: "https://dae.gov.bd",
    role: "extension",
    provides: {
      bn: "মাঠ পর্যায়ে কৃষি পরামর্শ, উপসহকারী কৃষি কর্মকর্তা ও উপজেলা কৃষি অফিস।",
      en: "Field-level advice through block supervisors and Upazila Agriculture Offices.",
    },
    useInAgrilume: {
      bn: "যেকোনো সিদ্ধান্তের আগে স্থানীয় উপজেলা কৃষি অফিসের পরামর্শ নিন।",
      en: "Confirm any decision with your Upazila Agriculture Office.",
    },
  },
  {
    id: "ais",
    acronym: "AIS",
    name: { bn: "কৃষি তথ্য সার্ভিস", en: "Agriculture Information Service" },
    url: "https://ais.gov.bd",
    role: "extension",
    provides: {
      bn: "কৃষি কল সেন্টার (১৬১২৩), কৃষি ই-বুক ও কৃষিকথা।",
      en: "Krishi Call Centre (16123), agriculture e-books and Krishi Kotha magazine.",
    },
    useInAgrilume: {
      bn: "অ্যাসিস্ট্যান্ট উত্তর দিতে না পারলে ১৬১২৩-এ ফোন করুন।",
      en: "If the assistant cannot answer, call 16123.",
    },
    deepLinks: [
      {
        label: { bn: "কৃষি কল সেন্টার (১৬১২৩)", en: "Krishi Call Centre (16123)" },
        url: "https://ais.gov.bd/site/page/d9147061-2995-416f-b355-d7feb0d9f9a1/Krishi-call-centre-(16123)",
      },
      { label: { bn: "কৃষি ই-বুক", en: "Agriculture e-books" }, url: "https://ais.gov.bd/views/krishi-ebook" },
    ],
  },
  {
    id: "bamis",
    acronym: "BAMIS",
    name: { bn: "বাংলাদেশ কৃষি-আবহাওয়া তথ্য সার্ভিস", en: "Bangladesh Agro-Meteorological Information Service" },
    url: "https://www.bamis.gov.bd",
    role: "weather",
    provides: {
      bn: "কৃষি-আবহাওয়া পোর্টাল (DAE পরিচালিত), উপজেলাভিত্তিক agromet তথ্য, স্যাটেলাইট পণ্য।",
      en: "Agro-met portal run by DAE: upazila-level agromet data and satellite products.",
    },
    useInAgrilume: {
      bn: "আজকের সেচ/বপনের সিদ্ধান্তে BAMIS-এর সাম্প্রতিক পরামর্শ দেখুন; Agrilume সিমুলেশন পূর্বাভাস নয়।",
      en: "For today's irrigation/sowing choices use BAMIS; the Agrilume simulation is not a forecast.",
    },
  },
  {
    id: "bmd",
    acronym: "BMD",
    name: { bn: "বাংলাদেশ আবহাওয়া অধিদপ্তর", en: "Bangladesh Meteorological Department" },
    url: "https://bmd.gov.bd",
    role: "weather",
    provides: {
      bn: "আবহাওয়ার পূর্বাভাস, ঘূর্ণিঝড়ের সতর্কসংকেত ও সতর্কবার্তা।",
      en: "Weather forecasts, cyclone warning signals and alerts.",
    },
    useInAgrilume: {
      bn: "ঘূর্ণিঝড়/ভারী বৃষ্টির সতর্কবার্তার জন্য একমাত্র নির্ভরযোগ্য উৎস।",
      en: "The authoritative source for cyclone and heavy-rain warnings.",
    },
    deepLinks: [
      { label: { bn: "সতর্কবার্তা", en: "Warnings" }, url: "https://www.bmd.gov.bd/web/bn/warning" },
      { label: { bn: "পূর্বাভাস", en: "Forecast" }, url: "https://bmd.gov.bd/web/en/forecast" },
    ],
  },
  {
    id: "ffwc",
    acronym: "FFWC",
    name: { bn: "বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র (পাউবো)", en: "Flood Forecasting and Warning Centre (BWDB)" },
    url: "https://ffwc.gov.bd",
    role: "flood",
    provides: {
      bn: "নদীর পানির স্তর ও বন্যার পূর্বাভাস।",
      en: "River water-level and flood forecasts.",
    },
    useInAgrilume: {
      bn: "বন্যা-দৃশ্য শুধু শিক্ষামূলক; আসল বন্যার তথ্য FFWC থেকে নিন।",
      en: "The flood scene is educational only; get real flood information from FFWC.",
    },
  },
  {
    id: "bwdb",
    acronym: "BWDB",
    name: { bn: "বাংলাদেশ পানি উন্নয়ন বোর্ড", en: "Bangladesh Water Development Board" },
    url: "https://bwdb.gov.bd",
    role: "flood",
    provides: {
      bn: "বাঁধ, সেচ ও পানি ব্যবস্থাপনা অবকাঠামো।",
      en: "Embankments, irrigation and water-management infrastructure.",
    },
    useInAgrilume: {
      bn: "সেচ ও নিষ্কাশন পরিকল্পনায় স্থানীয় পাউবো অফিসের তথ্য কাজে লাগে।",
      en: "Useful for local irrigation and drainage planning.",
    },
  },
  {
    id: "ddm",
    acronym: "DDM",
    name: { bn: "দুর্যোগ ব্যবস্থাপনা অধিদপ্তর", en: "Department of Disaster Management" },
    url: "https://ddm.gov.bd",
    role: "disaster",
    provides: {
      bn: "দুর্যোগ প্রস্তুতি, ত্রাণ ও পুনর্বাসন কার্যক্রম।",
      en: "Disaster preparedness, relief and recovery programmes.",
    },
    useInAgrilume: {
      bn: "দুর্যোগকালে স্থানীয় প্রশাসন ও DDM-এর নির্দেশনা সবার আগে।",
      en: "In a real disaster, local administration and DDM instructions come first.",
    },
  },
  {
    id: "barc",
    acronym: "BARC",
    name: { bn: "বাংলাদেশ কৃষি গবেষণা কাউন্সিল", en: "Bangladesh Agricultural Research Council" },
    url: "https://barc.gov.bd",
    role: "research",
    provides: {
      bn: "জাতীয় কৃষি গবেষণা সমন্বয়, সার সুপারিশমালা, কৃষি-পরিবেশ অঞ্চল (AEZ)।",
      en: "National agricultural research coordination, the Fertilizer Recommendation Guide, agro-ecological zones.",
    },
    useInAgrilume: {
      bn: "সারের মাত্রা নির্ধারণে BARC-এর সার সুপারিশমালা ও মাটি পরীক্ষার ফল ব্যবহার করুন।",
      en: "Use BARC's fertilizer guide plus a soil test for nutrient rates.",
    },
  },
  {
    id: "brri",
    acronym: "BRRI",
    name: { bn: "বাংলাদেশ ধান গবেষণা ইনস্টিটিউট", en: "Bangladesh Rice Research Institute" },
    url: "https://brri.gov.bd",
    role: "research",
    provides: {
      bn: "ধানের জাত (বন্যা/লবণ/খরা সহনশীল), চাষ-পদ্ধতি।",
      en: "Rice varieties (submergence/salt/drought tolerant) and cultivation practices.",
    },
    useInAgrilume: {
      bn: "ধানের জাত বেছে নিতে BRRI-র তথ্য দেখুন।",
      en: "Check BRRI for variety choice.",
    },
  },
  {
    id: "bari",
    acronym: "BARI",
    name: { bn: "বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট", en: "Bangladesh Agricultural Research Institute" },
    url: "https://bari.gov.bd",
    role: "research",
    provides: {
      bn: "গম, ভুট্টা, সবজি, ডাল-তেলবীজসহ ধান ছাড়া অন্য ফসলের জাত ও প্রযুক্তি।",
      en: "Varieties and technologies for wheat, maize, vegetables, pulses and oilseeds.",
    },
    useInAgrilume: {
      bn: "গম/ভুট্টাসহ ধান ছাড়া অন্য ফসলের জাতের জন্য BARI।",
      en: "BARI for wheat, maize and other non-rice crops.",
    },
  },
  {
    id: "bina",
    acronym: "BINA",
    name: { bn: "বাংলাদেশ পরমাণু কৃষি গবেষণা ইনস্টিটিউট", en: "Bangladesh Institute of Nuclear Agriculture" },
    url: "https://bina.gov.bd",
    role: "research",
    provides: {
      bn: "লবণ, খরা ও বন্যা সহনশীলসহ উন্নত জাত উদ্ভাবন।",
      en: "Improved varieties including stress-tolerant lines.",
    },
    useInAgrilume: {
      bn: "লবণাক্ত ও প্রতিকূল পরিবেশের জন্য বিকল্প জাতের খোঁজে।",
      en: "Look here for stress-tolerant variety options.",
    },
  },
  {
    id: "srdi",
    acronym: "SRDI",
    name: { bn: "মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট", en: "Soil Resource Development Institute" },
    url: "https://srdi.gov.bd",
    role: "soil",
    provides: {
      bn: "মাটি পরীক্ষা, মৃত্তিকা সম্পদ তথ্য, লবণাক্ততা জরিপ।",
      en: "Soil testing, soil-resource information and salinity surveys.",
    },
    useInAgrilume: {
      bn: "সারের হিসাব নিশ্চিত করতে আগে মাটি পরীক্ষা করান।",
      en: "Get a soil test before relying on any fertilizer figure.",
    },
  },
  {
    id: "dam",
    acronym: "DAM",
    name: { bn: "কৃষি বিপণন অধিদপ্তর", en: "Department of Agricultural Marketing" },
    url: "https://dam.gov.bd",
    role: "market",
    provides: {
      bn: "কৃষিপণ্যের বাজারদর।",
      en: "Agricultural commodity market prices.",
    },
    useInAgrilume: {
      bn: "আয়-ব্যয় হিসাবের জন্য হালনাগাদ বাজারদর দেখুন।",
      en: "Check current prices for any cost-benefit estimate.",
    },
    deepLinks: [{ label: { bn: "বাজারদর", en: "Market prices" }, url: "https://market.dam.gov.bd/price_graphical_report?L=E" }],
  },
  {
    id: "cropzoning",
    acronym: "Agri-Advisory",
    name: { bn: "কৃষি পরামর্শক বাতায়ন (শস্য জোনিং)", en: "Agri-Advisory Portal (crop zoning)" },
    url: "https://portal.cropzoning.gov.bd",
    role: "policy",
    provides: {
      bn: "শস্য জোনিং ও কৃষি পরামর্শ পোর্টাল।",
      en: "Crop-zoning and agri-advisory portal.",
    },
    useInAgrilume: {
      bn: "এলাকাভিত্তিক ফসল উপযোগিতার জন্য সরকারি জোনিং তথ্য দেখুন।",
      en: "Consult official zoning for area-level crop suitability.",
    },
  },
  {
    id: "moa",
    acronym: "MoA",
    name: { bn: "কৃষি মন্ত্রণালয়", en: "Ministry of Agriculture" },
    url: "https://moa.gov.bd",
    role: "policy",
    provides: {
      bn: "কৃষি নীতি, আইন ও কর্মসূচি।",
      en: "Agriculture policy, laws and programmes.",
    },
    useInAgrilume: {
      bn: "নীতি ও কর্মসূচির সরকারি উৎস।",
      en: "Official source for policy and programmes.",
    },
  },
];

export const ROLE_LABEL: Record<AgencyRole, LocalizedText> = {
  extension: { bn: "সম্প্রসারণ", en: "Extension" },
  research: { bn: "গবেষণা", en: "Research" },
  soil: { bn: "মাটি", en: "Soil" },
  weather: { bn: "আবহাওয়া", en: "Weather" },
  flood: { bn: "পানি/বন্যা", en: "Water / flood" },
  disaster: { bn: "দুর্যোগ", en: "Disaster" },
  market: { bn: "বাজার", en: "Market" },
  policy: { bn: "নীতি/পোর্টাল", en: "Policy / portal" },
};

export function getAgency(id: string): Agency | undefined {
  return AGENCIES.find((a) => a.id === id);
}
