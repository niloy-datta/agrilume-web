/**
 * Shared types for Agrilume Time Travel.
 *
 * Design rule (NASA Space Apps judging: "Real data & provenance"): every number that reaches
 * the screen carries a `DataKind` so the UI can label it as observed, what-if, projection,
 * or simulator output. Nothing is ever presented as a forecast of a specific future day.
 */

export type Lang = "bn" | "en";

export type RegionPreset = "floodplain" | "haor" | "coastal" | "barind" | "hill" | "char";

export type DivisionId =
  | "dhaka"
  | "chattogram"
  | "rajshahi"
  | "khulna"
  | "barishal"
  | "sylhet"
  | "rangpur"
  | "mymensingh";

export interface District {
  id: string;
  nameEn: string;
  nameBn: string;
  division: DivisionId;
  /** Approximate district centre (decimal degrees). NASA POWER cells are ~50 km, so +-10 km is immaterial. */
  lat: number;
  lon: number;
  /** Indicative landscape preset used for the 3D scene and defaults. Not an official AEZ code. */
  region: RegionPreset;
}

export interface LocalizedText {
  bn: string;
  en: string;
}

/** What kind of number is this? Drives labels, colours and the honesty banner. */
export type DataKind =
  | "observed" // NASA POWER observation/reanalysis-derived value for that year
  | "observed-filled" // observed year with some missing months filled by the multi-year mean
  | "trend-what-if" // multi-year mean (+ statistically supported trend) + user what-if deltas
  | "nasa-projection" // NEX-GDDP-CMIP6 delta pack (only if a pack has been generated)
  | "simulator"; // output of the educational crop/hazard simulator

export type DataOrigin =
  | "nasa-power-live"
  | "nasa-power-cache"
  | "nasa-power-fixture"
  | "nasa-power-bundled" // per-district monthly file fetched at build time (scripts/fetch-power-districts.mjs)
  | "stand-in-fixture";

export interface Provenance {
  origin: DataOrigin;
  provider: string;
  dataset: string;
  endpoint?: string;
  sourceUrl?: string;
  community?: string;
  retrievedAt?: string;
  parameters: string[];
  units: Record<string, string>;
  spatial: string;
  temporal: string;
  derived?: string;
  sourceFileSha256?: string;
  synthetic: false;
  /** True when the series belongs to another place (offline fallback). Must be shown to the user. */
  standIn?: boolean;
  note?: string;
}

/** 12 values per year, Jan..Dec. null = not available. */
export type MonthlyGrid = (number | null)[][];

export interface ClimateSeries {
  name: string;
  lat: number;
  lon: number;
  startYear: number;
  endYear: number;
  /** degC (monthly mean of daily maximum) */
  tmax: MonthlyGrid;
  /** degC (monthly mean of daily minimum) */
  tmin: MonthlyGrid;
  /** mm/day (monthly mean daily rainfall); multiply by days in month for monthly totals */
  rain: MonthlyGrid;
  /** Day-to-day SD of Tmax around its monthly mean, per calendar month (degC). null => default. */
  tmaxDailySd: (number | null)[];
  provenance: Provenance;
}

export interface MonthlyYear {
  year: number;
  tmax: number[];
  tmin: number[];
  rain: number[];
  tmaxSd: number[];
  kind: DataKind;
  /** true if user what-if deltas were applied on top */
  perturbed: boolean;
  notes: string[];
}

export interface ScenarioSpec {
  /** "trend" uses only the statistically supported observed trend; "pack" uses a NEX-GDDP-CMIP6 delta pack if loaded. */
  mode: "trend" | "pack";
  /** Additional warming applied to Tmax and Tmin (degC). User-chosen what-if. */
  dT: number;
  /** Rain change in the monsoon months Jun-Sep (percent). User-chosen what-if. */
  rainMonsoonPct: number;
  /** Rain change in the other months (percent). User-chosen what-if. */
  rainDryPct: number;
}

export const DEFAULT_SCENARIO: ScenarioSpec = {
  mode: "trend",
  dT: 0,
  rainMonsoonPct: 0,
  rainDryPct: 0,
};

export type StageId =
  | "landprep"
  | "germination"
  | "seedling"
  | "vegetative"
  | "reproductive"
  | "flowering"
  | "grainfill"
  | "maturity"
  | "harvest";

export type HazardType = "flood" | "drought" | "cyclone" | "heatwave" | "salinity";

export type IrrigationMode = "rainfed" | "irrigated" | "awd";
