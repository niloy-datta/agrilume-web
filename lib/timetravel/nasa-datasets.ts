import type { LocalizedText } from "./types";

/**
 * Registry of NASA Earth-observation datasets relevant to farming, and — crucially — what this build ACTUALLY does
 * with each one. `status` is the honest integration state; nothing marked "registered" is used for any number on screen.
 *
 * Sources for specs: the team's catalog (nasa_bangladesh_agriculture_datasets_updated.md), the official dataset pages,
 * and the NASA Earth Engine / AWS Open Data Registry catalog entries.
 */

export type Integration =
  | "live-in-browser" // fetched from NASA by the user's browser and used for numbers/visuals
  | "bundled-real" // a real committed extract is shipped and used
  | "adapter-script" // we ship an extractor you run with internet; output is picked up automatically
  | "backend-client" // implemented in the FastAPI backend of the mobile project, not in this web page
  | "registered"; // documented only; no number in the app comes from it yet

export type Access = "open-no-login" | "earthdata-login" | "open-cloud" | "free-key";

/**
 * Five separate questions, never conflated: is the dataset documented? is there code to read it? has real data been
 * fetched? has it been processed into the app's format? does any number or visual on screen come from it?
 */
export interface PipelineStages {
  registered: boolean;
  adapter: boolean;
  fetched: boolean;
  processed: boolean;
  displayed: boolean;
}

export function pipelineStages(d: { integration: Integration }): PipelineStages {
  const used = d.integration === "live-in-browser" || d.integration === "bundled-real";
  return {
    registered: true,
    // "backend-client" lives in a separate mobile-app repository that is not part of this build, so it is not counted.
    adapter: used || d.integration === "adapter-script",
    fetched: used,
    processed: used,
    displayed: used,
  };
}

export const STAGE_LABELS: Record<keyof PipelineStages, LocalizedText> = {
  registered: { bn: "নথিভুক্ত", en: "Registered" },
  adapter: { bn: "কোড আছে", en: "Adapter" },
  fetched: { bn: "আনা হয়েছে", en: "Fetched" },
  processed: { bn: "প্রক্রিয়াকৃত", en: "Processed" },
  displayed: { bn: "পর্দায় ব্যবহৃত", en: "Used on screen" },
};

export interface NasaDataset {
  id: string;
  name: LocalizedText;
  shortName: string;
  provider: string;
  variables: string;
  spatial: string;
  temporal: string;
  coverage: string;
  access: Access;
  farmingUse: LocalizedText;
  limitation: LocalizedText;
  portal: string;
  integration: Integration;
  integrationNote: LocalizedText;
}

export const NASA_DATASETS: NasaDataset[] = [
  {
    id: "power-monthly",
    name: { bn: "NASA POWER কৃষি-আবহাওয়া (৬৪ জেলা, ১৯৮১–২০২৫)", en: "NASA POWER agroclimatology (64 districts, 1981–2025)" },
    shortName: "POWER (AG)",
    provider: "NASA Langley / POWER project",
    variables: "T2M_MAX, T2M_MIN, PRECTOTCORR (also T2M, ALLSKY_SFC_SW_DWN, RH2M, WS2M, GWET*)",
    spatial: "≈0.5° × 0.625° meteorology grid (≈50 km); solar 1° × 1°",
    temporal: "daily, aggregated by AgriLume to monthly means",
    coverage: "1981-01-01 – 2025-12-31 (bundled); live fallback 2001 – last full year",
    access: "open-no-login",
    farmingUse: {
      bn: "তাপমাত্রা ও বৃষ্টির ইতিহাস; সময়-ভ্রমণের ‘অতীত’ অংশ; ET₀ ও জলহিসাব।",
      en: "Temperature and rainfall history; the ‘past’ half of Time Travel; ET₀ and water balance.",
    },
    limitation: {
      bn: "৫০ কিমি গ্রিড — একটি ছোট জমির মাপ নয়। ৬৪ জেলা মাত্র ৩৯টি আলাদা গ্রিড-ঘরে পড়ে। রিঅ্যানালাইসিস/স্যাটেলাইট-ভিত্তিক তথ্য, আবহাওয়া কেন্দ্রের মাপ নয়; BMD কেন্দ্রের সাথে মিলিয়ে দেখা হয়নি।",
      en: "≈50 km grid — not a measurement of one small field. The 64 district centres fall in only 39 distinct grid cells. Reanalysis/satellite-derived, not station measurements; not yet compared with BMD stations.",
    },
    portal: "https://power.larc.nasa.gov/data-access-viewer/",
    integration: "bundled-real",
    integrationNote: {
      bn: "scripts/fetch-power-districts.mjs দিয়ে প্রতিটি জেলার দৈনিক তথ্য এনে মাসিক গড় করা হয়েছে (URL ও SHA-256 সংরক্ষিত)। মানচিত্রে বেছে নেওয়া বিন্দুর জন্য ব্রাউজার সরাসরি NASA থেকে আনে।",
      en: "scripts/fetch-power-districts.mjs downloads daily data per district and averages it to monthly means (URL and SHA-256 recorded). Custom map points are fetched live by the browser.",
    },
  },
  {
    id: "power-daily-fixture",
    name: { bn: "NASA POWER দৈনিক — রাজশাহী ২০০১–২০২৫ (সংরক্ষিত আসল ফাইল)", en: "NASA POWER daily — Rajshahi 2001–2025 (bundled real file)" },
    shortName: "POWER daily fixture",
    provider: "NASA POWER (retrieved 2026-09-24)",
    variables: "PRECTOTCORR, T2M_MAX, T2M_MIN",
    spatial: "POWER grid cell containing 24.374°N, 88.601°E",
    temporal: "daily (9 131 days)",
    coverage: "2001-01-01 – 2025-12-31",
    access: "open-no-login",
    farmingUse: {
      bn: "অফলাইন ডেমো ও পরীক্ষার জন্য সত্যিকারের ডেটা; দৈনিক তাপের ওঠানামা।",
      en: "Real data for offline demo and tests; day-to-day temperature variability.",
    },
    limitation: {
      bn: "শুধু একটি জায়গা (রাজশাহী)।",
      en: "One place only (Rajshahi).",
    },
    portal: "https://power.larc.nasa.gov/docs/services/api/",
    integration: "bundled-real",
    integrationNote: {
      bn: "ফাইলের SHA-256 যাচাই করা হয়েছে (ম্যানিফেস্টের সাথে মেলে)।",
      en: "File SHA-256 verified against the manifest.",
    },
  },
  {
    id: "nex-gddp-cmip6",
    name: { bn: "NEX-GDDP-CMIP6 ভবিষ্যৎ জলবায়ু প্রক্ষেপণ", en: "NEX-GDDP-CMIP6 downscaled climate projections" },
    shortName: "NEX-GDDP-CMIP6",
    provider: "NASA Earth Exchange (NCCS)",
    variables: "tasmax, tasmin, tas, pr, rsds, hurs, sfcWind …",
    spatial: "0.25° (≈27.8 km)",
    temporal: "daily (full archive); monthly (bundled COG subset)",
    coverage: "Full archive: 1950–2100, 34 models; monthly COG subset: 2 models",
    access: "open-cloud",
    farmingUse: {
      bn: "ভবিষ্যৎ জলবায়ুর জন্য NASA-র ডাউনস্কেলড মডেল প্রক্ষেপণ; স্থানীয় আবহাওয়ার পূর্বাভাস নয়।",
      en: "NASA downscaled model projections for future climate—not a local weather forecast.",
    },
    limitation: {
      bn: "প্যাকটি ২-মডেলের মাসিক COG উপসেট, ০.২৫° গ্রিডের জেলা-কেন্দ্রের পিক্সেল এবং শুধু ২০৩৩-এর ৫-বছরের গড় ব্যবহার করে।",
      en: "The bundled pack uses the 2-model monthly COG subset, one 0.25° district-center pixel, and a 5-year mean for 2033 only.",
    },
    portal: "https://registry.opendata.aws/nex-gddp-cmip6/",
    integration: "bundled-real",
    integrationNote: {
      bn: "SSP2-4.5-এর আসল NASA মাসিক COG ডেটা থেকে ২০১০–২০১৪ বেসলাইন ও ২০৩১–২০৩৫ গড় দিয়ে ২০৩৩ প্যাক তৈরি; প্রতিটি বাংলাদেশের জেলা-কেন্দ্রের জন্য সংরক্ষিত।",
      en: "Real NASA monthly COG data, SSP2-4.5: 2033 pack derived from a 2031–2035 mean against a 2010–2014 baseline, bundled for each Bangladesh district center.",
    },
  },
  {
    id: "imerg",
    name: { bn: "GPM IMERG বৃষ্টিপাত", en: "GPM IMERG precipitation" },
    shortName: "GPM_3IMERGDF / GPM_3IMERGM",
    provider: "NASA GES DISC",
    variables: "precipitationCal",
    spatial: "0.1° (≈10 km)",
    temporal: "daily (Final) / monthly",
    coverage: "2000 – present",
    access: "earthdata-login",
    farmingUse: {
      bn: "বর্ষা শুরু, শুষ্ক সময় ও বৃষ্টির অঞ্চলভিত্তিক তারতম্য।",
      en: "Monsoon onset, dry spells, spatial rainfall variation.",
    },
    limitation: { bn: "Earthdata লগইন দরকার; স্যাটেলাইট অনুমান।", en: "Needs Earthdata login; satellite estimate." },
    portal: "https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDF_07/summary",
    integration: "backend-client",
    integrationNote: {
      bn: "মোবাইল প্রজেক্টের FastAPI backend-এ imerg_client আছে; এই ওয়েব পেজে সংযুক্ত নয়।",
      en: "Implemented as imerg_client in the mobile project's FastAPI backend; not wired into this web page.",
    },
  },
  {
    id: "smap",
    name: { bn: "SMAP L4 মাটির আর্দ্রতা", en: "SMAP L4 soil moisture" },
    shortName: "SPL4SMGP",
    provider: "NASA / NSIDC",
    variables: "sm_surface (0–5 cm), sm_rootzone (0–100 cm)",
    spatial: "9 km EASE-Grid 2.0",
    temporal: "3-hourly",
    coverage: "2015 – present",
    access: "earthdata-login",
    farmingUse: {
      bn: "চাষের উপযোগী মাটি, চারা রোপণের আগে মূল-অঞ্চলের আর্দ্রতা।",
      en: "Soil trafficability and root-zone moisture before transplanting.",
    },
    limitation: { bn: "৯ কিমি পিক্সেল — জমি-পর্যায়ের মাপ নয়।", en: "9 km pixel — not field-scale." },
    portal: "https://nsidc.org/data/spl4smgp/versions/7",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত; কোনো সংখ্যা এখান থেকে আসে না।", en: "Documented only; no on-screen number comes from it." },
  },
  {
    id: "fldas",
    name: { bn: "FLDAS ভূমি ও জলচক্র", en: "FLDAS land-surface hydrology" },
    shortName: "FLDAS_NOAH01_C_GL_M",
    provider: "NASA GES DISC",
    variables: "SoilMoi00_10cm, SoilMoi10_40cm …",
    spatial: "0.1° (≈10 km)",
    temporal: "monthly",
    coverage: "1982 – present",
    access: "earthdata-login",
    farmingUse: { bn: "SMAP-এর আগের (২০১৫-পূর্ব) মাটির আর্দ্রতার ইতিহাস।", en: "Soil-moisture history before SMAP (pre-2015)." },
    limitation: { bn: "মডেল-ভিত্তিক, পর্যবেক্ষণ নয়।", en: "Model-based, not an observation." },
    portal: "https://disc.gsfc.nasa.gov/datasets/FLDAS_NOAH01_C_GL_M_001/summary",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত।", en: "Documented only." },
  },
  {
    id: "modis-ndvi",
    name: { bn: "MODIS NDVI/EVI সবুজ সূচক", en: "MODIS vegetation indices (NDVI/EVI)" },
    shortName: "MOD13Q1 / MYD13Q1",
    provider: "NASA LP DAAC",
    variables: "NDVI, EVI, pixel reliability",
    spatial: "250 m",
    temporal: "16-day composite",
    coverage: "2000 – present",
    access: "open-no-login",
    farmingUse: { bn: "ফসলের সবুজ হওয়া, শীষ আসা ও কাটার সময়কাল যাচাই।", en: "Validate green-up, heading and harvest timing." },
    limitation: { bn: "250 মি — ছোট জমি মিশে যায়; বর্ষায় মেঘে তথ্য হারায়; জেলা-কেন্দ্র শহর হওয়ায় ৩×৩ কিমি এলাকায় শহর, পানি ও গাছ মিশে থাকে।", en: "250 m mixes small plots; monsoon cloud removes data; district centres are towns, so the 3×3 km window mixes town, water and trees." },
    portal: "https://lpdaac.usgs.gov/products/mod13q1v061/",
    integration: "bundled-real",
    integrationNote: {
      bn: "scripts/fetch-modis-ndvi.mjs দিয়ে ORNL DAAC থেকে ২০২১–২০২৫ NDVI আনা; ‘স্থান’ প্যানেলে প্রসঙ্গ হিসেবে দেখানো, ফসলের মডেলে নয়। যেসব জেলা এখনো প্রক্রিয়া হয়নি সেখানে ‘তৈরি হয়নি’ লেখা।",
      en: "2021–2025 NDVI from ORNL DAAC via scripts/fetch-modis-ndvi.mjs; shown as context in the Place panel, not used by the crop model. Districts not yet processed say so.",
    },
  },
  {
    id: "modis-et",
    name: { bn: "MODIS বাষ্পীভবন (ET)", en: "MODIS evapotranspiration" },
    shortName: "MOD16A2GF",
    provider: "NASA LP DAAC",
    variables: "ET, PET, LE",
    spatial: "500 m",
    temporal: "8-day composite",
    coverage: "2000 – present",
    access: "earthdata-login",
    farmingUse: { bn: "পানি-চাপ ও সেচ সূচি যাচাই।", en: "Cross-check water stress and irrigation scheduling." },
    limitation: { bn: "অনুমান-ভিত্তিক পণ্য।", en: "Modelled product." },
    portal: "https://lpdaac.usgs.gov/products/mod16a2gfv061/",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত। বর্তমান সিমুলেশন ET₀ Hargreaves পদ্ধতিতে।", en: "Documented only. The simulator uses Hargreaves ET₀ instead." },
  },
  {
    id: "srtm",
    name: { bn: "SRTM উচ্চতা (DEM)", en: "SRTM elevation (DEM)" },
    shortName: "SRTMGL1",
    provider: "NASA / USGS",
    variables: "elevation, slope",
    spatial: "30 m",
    temporal: "static (2000)",
    coverage: "Global 60°N–56°S",
    access: "earthdata-login",
    farmingUse: { bn: "নিচু জমি ও জলাবদ্ধতার প্রবণতা চিহ্নিতকরণ।", en: "Identify low-lying land and drainage susceptibility." },
    limitation: { bn: "২০০০ সালের ছবি; বাঁধ/ভূমি পরিবর্তন ধরে না।", en: "Year-2000 snapshot; misses later land changes." },
    portal: "https://cmr.earthdata.nasa.gov/search/concepts/C1000000240-LPDAAC_ECS.html",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত; 3D ভূমি পুরো প্রক্রিয়াগত (procedural)।", en: "Documented only; the 3D terrain is procedural, not from SRTM." },
  },
  {
    id: "merra2",
    name: { bn: "MERRA-2 পুনর্বিশ্লেষণ", en: "MERRA-2 reanalysis" },
    shortName: "M2SDNXSLV",
    provider: "NASA GMAO / GES DISC",
    variables: "T2MMAX, T2MMIN, T2MMEAN, TPRECMAX …",
    spatial: "0.5° × 0.625°",
    temporal: "daily",
    coverage: "1980 – present",
    access: "earthdata-login",
    farmingUse: { bn: "POWER-এর ভিত্তি (আবহাওয়া); দৈনিক চরম মান।", en: "Underlies POWER meteorology; daily extremes." },
    limitation: { bn: "মোটা গ্রিড।", en: "Coarse grid." },
    portal: "https://disc.gsfc.nasa.gov/",
    integration: "registered",
    integrationNote: { bn: "POWER-এর মাধ্যমে পরোক্ষভাবে ব্যবহৃত।", en: "Used indirectly through POWER." },
  },
  {
    id: "grace",
    name: { bn: "GRACE / GRACE-FO ভূগর্ভস্থ পানি", en: "GRACE / GRACE-FO groundwater storage" },
    shortName: "GRACE-FO",
    provider: "NASA JPL",
    variables: "terrestrial water storage anomaly",
    spatial: "≈300 km effective",
    temporal: "monthly",
    coverage: "2002 – present (gap 2017–18)",
    access: "earthdata-login",
    farmingUse: { bn: "বরেন্দ্র এলাকায় সেচের চাপে ভূগর্ভস্থ পানির দীর্ঘমেয়াদি প্রবণতা।", en: "Long-term groundwater trend under irrigation pressure (e.g. Barind)." },
    limitation: { bn: "অত্যন্ত মোটা — অঞ্চলভিত্তিক প্রবণতার জন্য।", en: "Very coarse — regional trends only." },
    portal: "https://grace.jpl.nasa.gov/",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত।", en: "Documented only." },
  },
  {
    id: "hls",
    name: { bn: "HLS (Landsat + Sentinel-2) জমি-পর্যায়ের ছবি", en: "HLS harmonized Landsat–Sentinel-2" },
    shortName: "HLSL30 / HLSS30",
    provider: "NASA / USGS LP DAAC",
    variables: "surface reflectance → NDVI",
    spatial: "30 m",
    temporal: "2–3 days revisit (cloud permitting)",
    coverage: "2013 – present",
    access: "earthdata-login",
    farmingUse: { bn: "জমির সীমানা-পর্যায়ে সবুজতা; ফসলের স্বাস্থ্য।", en: "Field-scale greenness and crop condition." },
    limitation: { bn: "বর্ষায় মেঘ।", en: "Monsoon cloud cover." },
    portal: "https://lpdaac.usgs.gov/products/hlsl30v002/",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত।", en: "Documented only." },
  },
  {
    id: "ecostress",
    name: { bn: "ECOSTRESS পানি-চাপ", en: "ECOSTRESS plant water stress" },
    shortName: "ECOSTRESS",
    provider: "NASA JPL",
    variables: "land-surface temperature, evapotranspiration",
    spatial: "≈70 m",
    temporal: "irregular overpasses",
    coverage: "2018 – present",
    access: "earthdata-login",
    farmingUse: { bn: "গাছের পানি-চাপ শনাক্তে সহায়ক।", en: "Helps detect plant water stress." },
    limitation: { bn: "পাসের সময় অনিয়মিত।", en: "Irregular revisit." },
    portal: "https://ecostress.jpl.nasa.gov/",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত।", en: "Documented only." },
  },
  {
    id: "firms",
    name: { bn: "FIRMS সক্রিয় আগুন (খড় পোড়ানো শনাক্ত)", en: "FIRMS active fire (residue-burning detection)" },
    shortName: "MODIS / VIIRS active fires",
    provider: "NASA LANCE / FIRMS",
    variables: "fire detections (location, time, confidence)",
    spatial: "375 m (VIIRS) / 1 km (MODIS)",
    temporal: "near-real-time",
    coverage: "2000 – present",
    access: "free-key",
    farmingUse: { bn: "রিসাইক্লিং অধ্যায়ে: খোলা মাঠে খড় পোড়ানো কমছে কিনা তা স্যাটেলাইটে দেখা।", en: "Recycling chapter: watch from space whether open residue burning is declining." },
    limitation: { bn: "আগুনের কারণ বলে না; ছোট আগুন মিস হতে পারে।", en: "Does not state the cause; small fires can be missed." },
    portal: "https://firms.modaps.eosdis.nasa.gov/",
    integration: "registered",
    integrationNote: { bn: "শুধু নথিভুক্ত (বিনামূল্যের MAP_KEY লাগে)।", en: "Documented only (needs a free MAP_KEY)." },
  },
];

export const INTEGRATION_LABEL: Record<Integration, LocalizedText> = {
  "live-in-browser": { bn: "ব্রাউজারে লাইভ ব্যবহৃত", en: "Live in browser — used" },
  "bundled-real": { bn: "আসল ফাইল সংযুক্ত — ব্যবহৃত", en: "Real file bundled — used" },
  "adapter-script": { bn: "অ্যাডাপ্টার স্ক্রিপ্ট আছে", en: "Adapter script provided" },
  "backend-client": { bn: "Backend-এ আছে (ওয়েবে নয়)", en: "In backend (not in web)" },
  registered: { bn: "নথিভুক্ত মাত্র", en: "Registered only" },
};

export const ACCESS_LABEL: Record<Access, LocalizedText> = {
  "open-no-login": { bn: "লগইন ছাড়াই", en: "Open, no login" },
  "earthdata-login": { bn: "Earthdata লগইন", en: "Earthdata login" },
  "open-cloud": { bn: "ক্লাউডে উন্মুক্ত", en: "Open on cloud" },
  "free-key": { bn: "বিনামূল্যের কী", en: "Free key" },
};

export function usedCount(): { used: number; total: number } {
  const used = NASA_DATASETS.filter((d) => d.integration === "live-in-browser" || d.integration === "bundled-real").length;
  return { used, total: NASA_DATASETS.length };
}
