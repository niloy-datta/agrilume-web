import type { District, DivisionId, LocalizedText, RegionPreset } from "./types";

export const DIVISIONS: { id: DivisionId; name: LocalizedText }[] = [
  { id: "dhaka", name: { bn: "ঢাকা", en: "Dhaka" } },
  { id: "chattogram", name: { bn: "চট্টগ্রাম", en: "Chattogram" } },
  { id: "rajshahi", name: { bn: "রাজশাহী", en: "Rajshahi" } },
  { id: "khulna", name: { bn: "খুলনা", en: "Khulna" } },
  { id: "barishal", name: { bn: "বরিশাল", en: "Barishal" } },
  { id: "sylhet", name: { bn: "সিলেট", en: "Sylhet" } },
  { id: "rangpur", name: { bn: "রংপুর", en: "Rangpur" } },
  { id: "mymensingh", name: { bn: "ময়মনসিংহ", en: "Mymensingh" } },
];

export const REGION_LABELS: Record<RegionPreset, LocalizedText & { blurb: LocalizedText }> = {
  floodplain: {
    bn: "সমতল প্লাবনভূমি",
    en: "Floodplain",
    blurb: {
      bn: "নদীবিধৌত সমতল জমি; বর্ষায় জলাবদ্ধতা ও বন্যার সম্ভাবনা।",
      en: "River-fed lowland; waterlogging and flooding are common monsoon concerns.",
    },
  },
  haor: {
    bn: "হাওর অঞ্চল",
    en: "Haor basin",
    blurb: {
      bn: "বর্ষায় বিশাল জলাভূমি, শুকনো মৌসুমে একফসলি বোরো; আগাম বন্যা (flash flood) ঝুঁকি।",
      en: "Huge seasonal wetland; single Boro crop in the dry season; early flash-flood risk.",
    },
  },
  coastal: {
    bn: "উপকূলীয় অঞ্চল",
    en: "Coastal belt",
    blurb: {
      bn: "জোয়ার-ভাটা, ঘূর্ণিঝড়, লবণাক্ততা ও জলোচ্ছ্বাসের ঝুঁকি।",
      en: "Tides, cyclones, soil/water salinity and storm-surge exposure.",
    },
  },
  barind: {
    bn: "বরেন্দ্র অঞ্চল",
    en: "Barind tract",
    blurb: {
      bn: "উঁচু লালচে মাটি, কম বৃষ্টি; সেচ ও ভূগর্ভস্থ পানির চাপ।",
      en: "Elevated reddish soils, lower rainfall; irrigation and groundwater pressure.",
    },
  },
  hill: {
    bn: "পার্বত্য অঞ্চল",
    en: "Hill tracts",
    blurb: {
      bn: "পাহাড়ি ঢাল, ধাপ চাষ ও ভূমিধসের ঝুঁকি।",
      en: "Sloping land, terraced farming, landslide exposure.",
    },
  },
  char: {
    bn: "চর ও নদীতীর",
    en: "Char / river bank",
    blurb: {
      bn: "যমুনা-পদ্মা-তিস্তার বালুচর; নদীভাঙন ও আকস্মিক বন্যা।",
      en: "Sandy river islands; bank erosion and sudden floods.",
    },
  },
};

type Row = [string, string, string, DivisionId, number, number, RegionPreset];

// [id, English, Bangla, division, lat, lon, preset]
// Coordinates are approximate district centres. Presets are indicative (for the 3D scene), not BARC/SRDI AEZ codes.
const ROWS: Row[] = [
  // Dhaka
  ["dhaka", "Dhaka", "ঢাকা", "dhaka", 23.81, 90.41, "floodplain"],
  ["faridpur", "Faridpur", "ফরিদপুর", "dhaka", 23.6, 89.84, "floodplain"],
  ["gazipur", "Gazipur", "গাজীপুর", "dhaka", 24.0, 90.42, "floodplain"],
  ["gopalganj", "Gopalganj", "গোপালগঞ্জ", "dhaka", 23.01, 89.83, "floodplain"],
  ["kishoreganj", "Kishoreganj", "কিশোরগঞ্জ", "dhaka", 24.43, 90.78, "haor"],
  ["madaripur", "Madaripur", "মাদারীপুর", "dhaka", 23.17, 90.2, "floodplain"],
  ["manikganj", "Manikganj", "মানিকগঞ্জ", "dhaka", 23.86, 90.0, "floodplain"],
  ["munshiganj", "Munshiganj", "মুন্সীগঞ্জ", "dhaka", 23.55, 90.53, "floodplain"],
  ["narayanganj", "Narayanganj", "নারায়ণগঞ্জ", "dhaka", 23.63, 90.5, "floodplain"],
  ["narsingdi", "Narsingdi", "নরসিংদী", "dhaka", 23.92, 90.72, "floodplain"],
  ["rajbari", "Rajbari", "রাজবাড়ী", "dhaka", 23.76, 89.64, "floodplain"],
  ["shariatpur", "Shariatpur", "শরীয়তপুর", "dhaka", 23.24, 90.43, "floodplain"],
  ["tangail", "Tangail", "টাঙ্গাইল", "dhaka", 24.25, 89.92, "floodplain"],
  // Chattogram
  ["bandarban", "Bandarban", "বান্দরবান", "chattogram", 22.19, 92.22, "hill"],
  ["brahmanbaria", "Brahmanbaria", "ব্রাহ্মণবাড়িয়া", "chattogram", 23.96, 91.11, "haor"],
  ["chandpur", "Chandpur", "চাঁদপুর", "chattogram", 23.23, 90.67, "floodplain"],
  ["chattogram", "Chattogram", "চট্টগ্রাম", "chattogram", 22.36, 91.78, "coastal"],
  ["cumilla", "Cumilla", "কুমিল্লা", "chattogram", 23.46, 91.18, "floodplain"],
  ["coxsbazar", "Cox's Bazar", "কক্সবাজার", "chattogram", 21.43, 91.98, "coastal"],
  ["feni", "Feni", "ফেনী", "chattogram", 23.02, 91.4, "coastal"],
  ["khagrachhari", "Khagrachhari", "খাগড়াছড়ি", "chattogram", 23.12, 91.98, "hill"],
  ["lakshmipur", "Lakshmipur", "লক্ষ্মীপুর", "chattogram", 22.94, 90.84, "coastal"],
  ["noakhali", "Noakhali", "নোয়াখালী", "chattogram", 22.87, 91.1, "coastal"],
  ["rangamati", "Rangamati", "রাঙ্গামাটি", "chattogram", 22.65, 92.18, "hill"],
  // Rajshahi
  ["bogura", "Bogura", "বগুড়া", "rajshahi", 24.85, 89.37, "barind"],
  ["joypurhat", "Joypurhat", "জয়পুরহাট", "rajshahi", 25.1, 89.02, "barind"],
  ["naogaon", "Naogaon", "নওগাঁ", "rajshahi", 24.8, 88.93, "barind"],
  ["natore", "Natore", "নাটোর", "rajshahi", 24.42, 89.0, "barind"],
  ["chapainawabganj", "Chapainawabganj", "চাঁপাইনবাবগঞ্জ", "rajshahi", 24.6, 88.28, "barind"],
  ["pabna", "Pabna", "পাবনা", "rajshahi", 24.0, 89.23, "floodplain"],
  ["rajshahi", "Rajshahi", "রাজশাহী", "rajshahi", 24.37, 88.6, "barind"],
  ["sirajganj", "Sirajganj", "সিরাজগঞ্জ", "rajshahi", 24.45, 89.7, "char"],
  // Khulna
  ["bagerhat", "Bagerhat", "বাগেরহাট", "khulna", 22.66, 89.79, "coastal"],
  ["chuadanga", "Chuadanga", "চুয়াডাঙ্গা", "khulna", 23.64, 88.85, "floodplain"],
  ["jashore", "Jashore", "যশোর", "khulna", 23.17, 89.21, "floodplain"],
  ["jhenaidah", "Jhenaidah", "ঝিনাইদহ", "khulna", 23.54, 89.17, "floodplain"],
  ["khulna", "Khulna", "খুলনা", "khulna", 22.82, 89.55, "coastal"],
  ["kushtia", "Kushtia", "কুষ্টিয়া", "khulna", 23.9, 89.12, "floodplain"],
  ["magura", "Magura", "মাগুরা", "khulna", 23.49, 89.42, "floodplain"],
  ["meherpur", "Meherpur", "মেহেরপুর", "khulna", 23.76, 88.63, "floodplain"],
  ["narail", "Narail", "নড়াইল", "khulna", 23.17, 89.5, "floodplain"],
  ["satkhira", "Satkhira", "সাতক্ষীরা", "khulna", 22.72, 89.07, "coastal"],
  // Barishal
  ["barguna", "Barguna", "বরগুনা", "barishal", 22.15, 90.12, "coastal"],
  ["barishal", "Barishal", "বরিশাল", "barishal", 22.7, 90.37, "floodplain"],
  ["bhola", "Bhola", "ভোলা", "barishal", 22.69, 90.65, "coastal"],
  ["jhalokati", "Jhalokati", "ঝালকাঠি", "barishal", 22.64, 90.2, "coastal"],
  ["patuakhali", "Patuakhali", "পটুয়াখালী", "barishal", 22.36, 90.33, "coastal"],
  ["pirojpur", "Pirojpur", "পিরোজপুর", "barishal", 22.58, 89.97, "coastal"],
  // Sylhet
  ["habiganj", "Habiganj", "হবিগঞ্জ", "sylhet", 24.38, 91.42, "haor"],
  ["moulvibazar", "Moulvibazar", "মৌলভীবাজার", "sylhet", 24.48, 91.77, "hill"],
  ["sunamganj", "Sunamganj", "সুনামগঞ্জ", "sylhet", 25.07, 91.4, "haor"],
  ["sylhet", "Sylhet", "সিলেট", "sylhet", 24.9, 91.87, "haor"],
  // Rangpur
  ["dinajpur", "Dinajpur", "দিনাজপুর", "rangpur", 25.63, 88.64, "barind"],
  ["gaibandha", "Gaibandha", "গাইবান্ধা", "rangpur", 25.33, 89.53, "char"],
  ["kurigram", "Kurigram", "কুড়িগ্রাম", "rangpur", 25.81, 89.64, "char"],
  ["lalmonirhat", "Lalmonirhat", "লালমনিরহাট", "rangpur", 25.92, 89.45, "char"],
  ["nilphamari", "Nilphamari", "নীলফামারী", "rangpur", 25.93, 88.86, "floodplain"],
  ["panchagarh", "Panchagarh", "পঞ্চগড়", "rangpur", 26.34, 88.55, "barind"],
  ["rangpur", "Rangpur", "রংপুর", "rangpur", 25.75, 89.25, "floodplain"],
  ["thakurgaon", "Thakurgaon", "ঠাকুরগাঁও", "rangpur", 26.03, 88.47, "barind"],
  // Mymensingh
  ["jamalpur", "Jamalpur", "জামালপুর", "mymensingh", 24.92, 89.94, "char"],
  ["mymensingh", "Mymensingh", "ময়মনসিংহ", "mymensingh", 24.75, 90.41, "floodplain"],
  ["netrokona", "Netrokona", "নেত্রকোণা", "mymensingh", 24.87, 90.73, "haor"],
  ["sherpur", "Sherpur", "শেরপুর", "mymensingh", 25.02, 90.02, "floodplain"],
];

export const DISTRICTS: District[] = ROWS.map(([id, nameEn, nameBn, division, lat, lon, region]) => ({
  id,
  nameEn,
  nameBn,
  division,
  lat,
  lon,
  region,
}));

export const DEFAULT_DISTRICT_ID = "rajshahi";

export function getDistrict(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

export function districtsOf(division: DivisionId): District[] {
  return DISTRICTS.filter((d) => d.division === division);
}

/** Rough Bangladesh bounding box used to validate custom coordinates. */
export const BANGLADESH_BBOX = { minLat: 20.5, maxLat: 26.7, minLon: 88.0, maxLon: 92.8 };

export function insideBangladeshBox(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= BANGLADESH_BBOX.minLat &&
    lat <= BANGLADESH_BBOX.maxLat &&
    lon >= BANGLADESH_BBOX.minLon &&
    lon <= BANGLADESH_BBOX.maxLon
  );
}

/** Nearest district centre to an arbitrary point (planar distance with cos(lat) correction). */
export function nearestDistrict(lat: number, lon: number): District {
  const k = Math.cos((lat * Math.PI) / 180);
  let best = DISTRICTS[0];
  let bestD = Infinity;
  for (const d of DISTRICTS) {
    const dx = (d.lon - lon) * k;
    const dy = d.lat - lat;
    const dist = dx * dx + dy * dy;
    if (dist < bestD) {
      bestD = dist;
      best = d;
    }
  }
  return best;
}

/** Bangla digits to ASCII digits. */
export function bnToAsciiDigits(s: string): string {
  return s.replace(/[০-৯]/g, (c) => String(c.charCodeAt(0) - 0x09e6));
}

export function asciiToBnDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (c) => String.fromCharCode(0x09e6 + Number(c)));
}
