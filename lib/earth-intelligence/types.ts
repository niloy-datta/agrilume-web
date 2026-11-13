/**
 * Types and interfaces for the NASA Earth Intelligence pipeline.
 *
 * Implements strict scientific data provenance, quality masks, unit tracking,
 * and transparent retrieval metadata according to NASA Earth Science standards.
 */

export type EarthIntelligenceDatasetId =
  | "nasa-power-weather"
  | "nasa-power-projection"
  | "nasa-hls-imagery"
  | "nasa-smap-soil-moisture"
  | "nasa-gpm-imerg"
  | "nasa-opera-surface-water"
  | "nasa-nex-gddp-cmip6";

export type DataStatusCategory =
  | "real-observation"
  | "cached-observation"
  | "model-projection"
  | "educational-simulation"
  | "unavailable-data";

export interface SpatialResolution {
  degrees: number;
  approxKm: number;
  label: string;
}

export interface TemporalResolution {
  cadence: "hourly" | "daily" | "16-day" | "monthly" | "static";
  periodStart: string;
  periodEnd: string;
}

export interface QualityMaskInfo {
  hasQualityMask: boolean;
  cloudMaskApplied: boolean;
  fillValue: number | string;
  validMin?: number;
  validMax?: number;
  notes?: string;
}

export interface AdapterProvenance {
  datasetId: EarthIntelligenceDatasetId;
  productName: string;
  sourceUrl: string;
  doi?: string;
  provider: string;
  retrievedAt: string;
  freshness: "live" | "cached" | "bundled-real" | "fallback-sample";
  originCategory: DataStatusCategory;
  spatial: SpatialResolution;
  temporal: TemporalResolution;
  quality: QualityMaskInfo;
  isCustomCoordinates?: boolean;
}

export interface AdapterResult<T> {
  ok: boolean;
  status: "live" | "cached" | "bundled" | "rate-limited" | "unauthenticated" | "error";
  data?: T;
  provenance: AdapterProvenance;
  error?: string;
  warnings?: string[];
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface DistrictLocation {
  districtId: string;
  nameEn: string;
  nameBn: string;
  division: string;
  lat: number;
  lon: number;
  regionPreset: "barind" | "haor" | "coastal" | "floodplain" | "hill" | "char";
}

/* =========================================================================
 * 1. NASA POWER Weather Types
 * ========================================================================= */
export interface PowerWeatherData {
  districtId: string;
  startYear: number;
  endYear: number;
  parameters: {
    tmax: (number | null)[][]; // [yearIndex][monthIndex 0..11] in °C
    tmin: (number | null)[][]; // °C
    tmean: (number | null)[][]; // °C
    rain: (number | null)[][]; // mm/day
    radiation: (number | null)[][]; // MJ/m^2/day
    rh2m: (number | null)[][]; // %
    windSpeed: (number | null)[][]; // m/s
  };
  units: Record<string, string>;
  dailyMaxSd: (number | null)[];
}

/* =========================================================================
 * 2. NASA POWER Projection Types
 * ========================================================================= */
export interface PowerProjectionData {
  districtId: string;
  scenario: "RCP4.5" | "RCP8.5" | "SSP2-4.5" | "SSP5-8.5";
  baselineWindow: [number, number];
  projectionWindow: [number, number];
  monthlyDeltaTmax: number[]; // 12 months in °C
  monthlyDeltaTmin: number[]; // 12 months in °C
  monthlyPrecipRatio: number[]; // 12 months ratio vs baseline (1.0 = no change)
  sourceModel: string;
}

/* =========================================================================
 * 3. NASA HLS (Harmonized Landsat-Sentinel) Types
 * ========================================================================= */
export interface HlsGranule {
  granuleId: string;
  acquisitionDate: string; // YYYY-MM-DD
  cloudCoveragePct: number;
  sensor: "HLSL30" | "HLSS30";
  tileId: string;
  browseUrl?: string;
  ndviMean: number; // 0..1
  ndviP10: number;
  ndviP90: number;
  usablePixelPct: number;
  qualityMaskSummary: "clear" | "cloudy" | "partially-usable";
}

export interface HlsVegetationData {
  districtId: string;
  lat: number;
  lon: number;
  recentGranules: HlsGranule[];
  seasonalCycleNdvi: number[]; // 12 months average field-scale NDVI
}

/* =========================================================================
 * 4. NASA SMAP Soil Moisture Types
 * ========================================================================= */
export interface SmapSoilMoistureRecord {
  month: number; // 1..12
  surfaceMoisture: number; // m^3/m^3 (0-5 cm)
  rootZoneMoisture: number; // m^3/m^3 (0-100 cm)
  surfaceAnomalyPct: number; // % deviation from 2015-2025 mean
  qualityFlag: "nominal" | "degraded" | "saturated";
}

export interface SmapSoilMoistureData {
  districtId: string;
  lat: number;
  lon: number;
  resolutionKm: 9;
  records: SmapSoilMoistureRecord[];
  barindDroughtRiskIndex: "low" | "moderate" | "high" | "severe";
  fieldCapacityRatio: number; // current moisture / field capacity
}

/* =========================================================================
 * 5. NASA GPM IMERG Precipitation Types
 * ========================================================================= */
export interface GpmPrecipitationRecord {
  year: number;
  month: number; // 1..12
  dailyRateMm: number; // mm/day
  monthlyTotalMm: number; // mm
  climatologyMeanMm: number; // 2000-2025 mean
  anomalyMm: number;
  consecutiveDryDays: number;
}

export interface GpmImergData {
  districtId: string;
  lat: number;
  lon: number;
  records: GpmPrecipitationRecord[];
  monsoonOnsetDayOfYear: number;
  monsoonWithdrawalDayOfYear: number;
  heavyRainDaysCount: number; // days with > 50 mm/day
}

/* =========================================================================
 * 6. NASA OPERA Dynamic Surface Water Extent Types
 * ========================================================================= */
export interface OperaWaterExtentRecord {
  observationDate: string; // YYYY-MM-DD
  openWaterPct: number;
  partialSurfaceWaterPct: number;
  dryLandPct: number;
  cloudCoveredPct: number;
  floodAnomalyVsHistoricalPct: number;
  inundationCategory: "normal" | "low-water" | "moderate-flood" | "severe-flood";
}

export interface OperaSurfaceWaterData {
  districtId: string;
  records: OperaWaterExtentRecord[];
  baselineSeasonalWaterPct: number[]; // 12 months
  historicEventComparisons: {
    event: string; // e.g. "1998 Mega Flood", "2022 Sylhet Flash Flood", "2024 Eastern Flood"
    inundationPct: number;
    reference: string;
  }[];
}

/* =========================================================================
 * 7. NASA NEX-GDDP-CMIP6 Multi-Scenario Types
 * ========================================================================= */
export interface Cmip6ScenarioSpread {
  scenario: "ssp126" | "ssp245" | "ssp585";
  scenarioLabel: string;
  timeWindow: [number, number]; // e.g. [2031, 2035]
  models: {
    modelName: string;
    dTmax: number[]; // 12 months °C
    dTmin: number[]; // 12 months °C
    rainRatio: number[]; // 12 months ratio
  }[];
  ensembleMean: {
    dTmax: number[];
    dTmin: number[];
    rainRatio: number[];
  };
  ensembleStdDev: {
    dTmax: number[];
    rainRatio: number[];
  };
}

export interface NexGddpCmip6Data {
  districtId: string;
  baselineWindow: [number, number];
  scenarios: Record<"ssp126" | "ssp245" | "ssp585", Cmip6ScenarioSpread>;
  uncertaintyNotes: string[];
}

