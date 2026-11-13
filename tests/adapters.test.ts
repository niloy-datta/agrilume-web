import { describe, it, expect } from "vitest";
import { fetchPowerWeather } from "@/lib/earth-intelligence/adapters/power-weather";
import { fetchPowerProjection } from "@/lib/earth-intelligence/adapters/power-projection";
import { fetchHlsVegetation } from "@/lib/earth-intelligence/adapters/hls-imagery";
import { fetchSmapSoilMoisture } from "@/lib/earth-intelligence/adapters/smap-soil-moisture";
import { fetchGpmPrecipitation } from "@/lib/earth-intelligence/adapters/gpm-imerg";
import { fetchOperaSurfaceWater } from "@/lib/earth-intelligence/adapters/opera-surface-water";
import { fetchNexGddpCmip6 } from "@/lib/earth-intelligence/adapters/nex-gddp-cmip6";
import { loadDistrictEarthIntelligence } from "@/lib/earth-intelligence/pipeline";

describe("NASA Earth Intelligence Pipeline Adapters", () => {
  it("POWER weather adapter loads authentic agroclimatology data", async () => {
    const res = await fetchPowerWeather({ districtId: "rajshahi", lat: 24.37, lon: 88.60 });
    expect(res.ok).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.parameters.tmax.length).toBeGreaterThan(20);
    expect(res.provenance.spatial.degrees).toBe(0.5);
    expect(res.provenance.quality.fillValue).toBe(-999);
  });

  it("POWER projection adapter provides downscaled climate scenarios", async () => {
    const res = await fetchPowerProjection({ districtId: "rajshahi", lat: 24.37, lon: 88.60 });
    expect(res.ok).toBe(true);
    expect(res.data?.monthlyDeltaTmax.length).toBe(12);
    expect(res.data?.monthlyDeltaTmax.every((v) => v > 0 && v < 5)).toBe(true);
    expect(res.provenance.originCategory).toBe("model-projection");
  });

  it("HLS adapter returns 30m field-scale vegetation indices with quality flags", async () => {
    const res = await fetchHlsVegetation({ districtId: "rajshahi", lat: 24.37, lon: 88.60 });
    expect(res.ok).toBe(true);
    expect(res.provenance.spatial.approxKm).toBe(0.03); // 30m
    expect(res.data?.seasonalCycleNdvi.length).toBe(12);
    expect(res.data?.seasonalCycleNdvi.every((v) => v >= 0 && v <= 1)).toBe(true);
    expect(res.data?.recentGranules.length).toBeGreaterThan(0);
    expect(res.provenance.quality.cloudMaskApplied).toBe(true);
  });

  it("SMAP adapter returns 9km volumetric soil moisture and drought indicators", async () => {
    const res = await fetchSmapSoilMoisture({ districtId: "rajshahi", lat: 24.37, lon: 88.60 });
    expect(res.ok).toBe(true);
    expect(res.provenance.spatial.approxKm).toBe(9);
    expect(res.data?.records.length).toBe(12);
    expect(res.data?.records.every((r) => r.surfaceMoisture > 0 && r.surfaceMoisture < 0.5)).toBe(true);
    expect(res.data?.barindDroughtRiskIndex).toBe("high");
  });

  it("GPM IMERG adapter returns multi-satellite precipitation and monsoon onset", async () => {
    const res = await fetchGpmPrecipitation({ districtId: "sylhet", lat: 24.89, lon: 91.86 });
    expect(res.ok).toBe(true);
    expect(res.provenance.spatial.degrees).toBe(0.1);
    expect(res.data?.monsoonOnsetDayOfYear).toBeGreaterThan(140);
    expect(res.data?.records.length).toBeGreaterThan(0);
  });

  it("OPERA adapter maps 30m dynamic surface water and historic flood benchmarks", async () => {
    const res = await fetchOperaSurfaceWater({ districtId: "sylhet", lat: 24.89, lon: 91.86 });
    expect(res.ok).toBe(true);
    expect(res.provenance.spatial.approxKm).toBe(0.03); // 30m
    expect(res.data?.historicEventComparisons.length).toBeGreaterThan(0);
    expect(res.data?.baselineSeasonalWaterPct.length).toBe(12);
  });

  it("NEX-GDDP-CMIP6 adapter calculates multi-scenario spread and uncertainty", async () => {
    const res = await fetchNexGddpCmip6({ districtId: "rajshahi" });
    expect(res.ok).toBe(true);
    expect(res.data?.scenarios.ssp126).toBeDefined();
    expect(res.data?.scenarios.ssp245).toBeDefined();
    expect(res.data?.scenarios.ssp585).toBeDefined();

    const ssp245 = res.data!.scenarios.ssp245;
    expect(ssp245.models.length).toBe(4);
    expect(ssp245.ensembleStdDev.dTmax.length).toBe(12);
    expect(ssp245.ensembleStdDev.dTmax.every((s) => s >= 0)).toBe(true);
  });

  it("Unified pipeline synthesizes multi-sensor intelligence for agricultural decisions", async () => {
    const intel = await loadDistrictEarthIntelligence("rajshahi");
    expect(intel).not.toBeNull();
    expect(intel?.nameEn).toBe("Rajshahi");
    expect(intel?.synthesis.droughtVulnerability).toBe("VERY_HIGH");
    expect(intel?.synthesis.keyRiskFactors.length).toBeGreaterThan(0);
    expect(intel?.powerWeather.ok).toBe(true);
    expect(intel?.smapMoisture.ok).toBe(true);
    expect(intel?.hlsVegetation.ok).toBe(true);
  });
});

