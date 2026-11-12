import { describe, it, expect } from "vitest";
import { rajshahiFixture } from "@/lib/timetravel/power";
import { monthlyForYear } from "@/lib/timetravel/climate";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";
import { CROPS, simulateSeason, baselineSim, relativeIndex, stageAtFraction, tempResponse, kcAtFraction } from "@/lib/timetravel/crops";
import type { SimInput } from "@/lib/timetravel/crops";
import { climatology } from "@/lib/timetravel/climate";
import type { MonthlyYear } from "@/lib/timetravel/types";
import { computeRecycling, DEFAULT_SHARES, toHectares, fromHectares, irrigationVolumeM3, pondAreaM2, normaliseShares } from "@/lib/timetravel/recycling";
import { HAZARDS, defaultHazardEvent, describeSeverity } from "@/lib/timetravel/hazards";
import { DISTRICTS, nearestDistrict, insideBangladeshBox, bnToAsciiDigits } from "@/lib/timetravel/locations";
import { AGENCIES, KRISHI_CALL_CENTER } from "@/lib/timetravel/gov";
import { NASA_DATASETS } from "@/lib/timetravel/nasa-datasets";

const s = rajshahiFixture();
const getYear = (y: number) => monthlyForYear(s, y, DEFAULT_SCENARIO);

function avgYear(): MonthlyYear {
  const c = (g: typeof s.tmax) => climatology(g, s.startYear, s.startYear, s.endYear).mean;
  return { year: 2000, tmax: c(s.tmax), tmin: c(s.tmin), rain: c(s.rain), tmaxSd: s.tmaxDailySd.map((v) => v ?? 2), kind: "observed", perturbed: false, notes: [] };
}

function run(cropId: keyof typeof CROPS, over: Partial<SimInput> = {}) {
  const crop = CROPS[cropId];
  return simulateSeason({
    lat: s.lat,
    crop,
    sowYear: 2022,
    sowDoy: crop.defaultSowDoy,
    getYear,
    irrigation: "irrigated",
    soilEc: 1,
    ...over,
  });
}

describe("phenology under real Rajshahi weather", () => {
  it("every crop matures with a duration in a plausible range", () => {
    for (const id of Object.keys(CROPS) as (keyof typeof CROPS)[]) {
      const r = run(id);
      expect(r.matured, id).toBe(true);
      const [lo, hi] = CROPS[id].typicalDays;
      expect(r.maturityDay!, id).toBeGreaterThan(lo * 0.75);
      expect(r.maturityDay!, id).toBeLessThan(hi * 1.25);
    }
  });
  it("stages follow the cumulative GDD order", () => {
    const c = CROPS.boro;
    expect(stageAtFraction(c, 0.01)).toBe("germination");
    expect(stageAtFraction(c, 0.3)).toBe("vegetative");
    expect(stageAtFraction(c, 0.65)).toBe("flowering");
    expect(stageAtFraction(c, 1.0)).toBe("maturity");
    const r = run("boro");
    const sd = r.stageStartDay;
    expect(sd.seedling!).toBeGreaterThan(sd.germination!);
    expect(sd.flowering!).toBeGreaterThan(sd.vegetative!);
    expect(sd.grainfill!).toBeGreaterThan(sd.flowering!);
  });
  it("temperature response is a trapezoid and kc follows FAO-like phases", () => {
    const c = CROPS.aman;
    expect(tempResponse(c, 5)).toBe(0);
    expect(tempResponse(c, 28)).toBe(1);
    expect(tempResponse(c, 41)).toBe(0);
    expect(kcAtFraction(c, 0.1)).toBe(c.kc.init);
    expect(kcAtFraction(c, 0.6)).toBe(c.kc.mid);
    expect(kcAtFraction(c, 1)).toBeCloseTo(c.kc.end, 6);
  });
});

describe("water", () => {
  it("rain-fed wheat in the dry Rajshahi winter loses yield to water stress; irrigation removes that loss", () => {
    const rainfed = run("wheat", { irrigation: "rainfed" });
    const irrigated = run("wheat", { irrigation: "irrigated" });
    expect(rainfed.loss.water).toBeGreaterThan(irrigated.loss.water);
    expect(irrigated.totals.irrigationMm).toBeGreaterThan(50);
    expect(rainfed.totals.irrigationMm).toBe(0);
    expect(irrigated.yieldProxy).toBeGreaterThan(rainfed.yieldProxy);
  });
  it("AWD uses less irrigation water than continuous irrigation for rice", () => {
    const ir = run("boro", { irrigation: "irrigated" });
    const awd = run("boro", { irrigation: "awd" });
    expect(awd.totals.irrigationMm).toBeLessThan(ir.totals.irrigationMm);
    expect(ir.totals.irrigationMm).toBeGreaterThan(300);
  });
});

describe("relative index & scenarios", () => {
  it("is 100 when scenario == baseline, and falls with warming that shortens/hurts the season", () => {
    const base = baselineSim({ lat: s.lat, crop: CROPS.boro, sowYear: 2022, sowDoy: CROPS.boro.defaultSowDoy, irrigation: "irrigated", soilEc: 1 }, avgYear());
    expect(relativeIndex(base, base)).toBeCloseTo(100, 8);
    const hot = simulateSeason({
      lat: s.lat, crop: CROPS.boro, sowYear: 2050, sowDoy: CROPS.boro.defaultSowDoy,
      getYear: (y) => monthlyForYear(s, y, { ...DEFAULT_SCENARIO, dT: 3 }),
      irrigation: "irrigated", soilEc: 1,
    });
    expect(hot.maturityDay!).toBeLessThan(base.maturityDay!);
    expect(relativeIndex(hot, base)).toBeLessThan(100);
  });
});

describe("hazards", () => {
  it("salinity follows the FAO-29 linear response (rice: threshold 3, slope 12%/dS/m)", () => {
    const clean = run("aman", { soilEc: 1 });
    const salty = run("aman", { soilEc: 6 });
    expect(clean.loss.salinity).toBe(0);
    expect(salty.loss.salinity).toBeCloseTo(0.36, 6);
    const maize = run("maize", { soilEc: 4.7 });
    expect(maize.loss.salinity).toBeCloseTo(0.36, 6); // (4.7-1.7)*12%
  });
  it("a long deep flood kills non-tolerant seedling rice more than a submergence-tolerant variety", () => {
    const ev = [{ type: "flood" as const, startDay: 20, days: 12, severity: 0.8 }];
    const plain = run("aman", { events: ev, submergenceTolerant: false });
    const tol = run("aman", { events: ev, submergenceTolerant: true });
    expect(plain.loss.flood).toBeGreaterThan(tol.loss.flood);
    expect(plain.loss.flood).toBeGreaterThan(0.5);
  });
  it("flooding hurts wheat (upland) far more than a short flood hurts rice", () => {
    const evShort = [{ type: "flood" as const, startDay: 30, days: 3, severity: 0.4 }];
    expect(run("wheat", { events: evShort }).loss.flood).toBeGreaterThan(run("aman", { events: evShort }).loss.flood);
  });
  it("a heatwave at flowering increases heat loss and cyclone at grain filling causes lodging loss", () => {
    const base = run("boro");
    const flowerDay = base.stageStartDay.flowering!;
    const hw = run("boro", { events: [{ type: "heatwave", startDay: flowerDay, days: 8, severity: 1 }] });
    expect(hw.loss.heat).toBeGreaterThan(base.loss.heat);
    const gf = base.stageStartDay.grainfill!;
    const cy = run("boro", { events: [{ type: "cyclone", startDay: gf + 2, days: 2, severity: 0.9 }] });
    expect(cy.loss.cyclone).toBeGreaterThan(0.3);
  });
  it("drought removes rain and raises water stress for rain-fed crops", () => {
    const base = run("aus", { irrigation: "rainfed", sowYear: 2022 });
    const dr = run("aus", { irrigation: "rainfed", events: [{ type: "drought", startDay: 30, days: 30, severity: 1 }] });
    expect(dr.totals.rainMm).toBeLessThan(base.totals.rainMm);
    expect(dr.yieldProxy).toBeLessThanOrEqual(base.yieldProxy);
  });
  it("every hazard has official sources and safety text; severity descriptions are readable", () => {
    for (const h of Object.values(HAZARDS)) {
      expect(h.officialSources.length).toBeGreaterThan(0);
      expect(h.mitigation.length).toBeGreaterThanOrEqual(3);
      expect(describeSeverity(h.id, 0.5).en.length).toBeGreaterThan(5);
      expect(defaultHazardEvent(h.id, 10).startDay).toBe(10);
    }
  });
});

describe("recycling calculator", () => {
  it("converts Bangladeshi land units correctly", () => {
    expect(toHectares(1, "acre")).toBeCloseTo(0.404686, 6);
    expect(toHectares(100, "decimal")).toBeCloseTo(0.404686, 5); // 100 decimal = 1 acre
    expect(fromHectares(toHectares(33, "decimal"), "decimal")).toBeCloseTo(33, 8);
    expect(toHectares(-1, "ha")).toBe(0);
  });
  it("does the rice mass balance", () => {
    const r = computeRecycling({ crop: "aman", areaHa: 2, grainYieldTHa: 4, shares: DEFAULT_SHARES });
    expect(r.grainT).toBe(8);
    expect(r.residueT.typ).toBeCloseTo(8, 8);
    expect(r.residueT.min).toBeCloseTo(6.4, 8);
    expect(r.residueT.max).toBeCloseTo(12, 8);
    expect(r.huskT!.typ).toBeCloseTo(1.6, 8);
    const strawPathways = r.byPathway.incorporate + r.byPathway.compost + r.byPathway.mushroom + r.byPathway.feed + r.byPathway.biogas + r.byPathway.burn;
    expect(strawPathways).toBeCloseTo(r.residueT.typ, 6);
    expect(r.nutrientsReturnedKg.k.typ).toBeGreaterThan(r.nutrientsReturnedKg.n.typ);
  });
  it("normalises shares and reports burned residue", () => {
    const n = normaliseShares({ ...DEFAULT_SHARES, burn: 100 });
    expect(Object.values(n).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 8);
    const r = computeRecycling({ crop: "wheat", areaHa: 1, grainYieldTHa: 3, shares: { ...DEFAULT_SHARES, burn: 100 } });
    expect(r.burnedT).toBeGreaterThan(0);
    expect(r.huskT).toBeNull();
  });
  it("water recycling: 1 mm over 1 ha is 10 m3", () => {
    expect(irrigationVolumeM3(1, 1)).toBe(10);
    expect(irrigationVolumeM3(500, 0.4)).toBeCloseTo(2000, 6);
    expect(pondAreaM2(3000, 1.5)).toBeCloseTo(2000, 6);
  });
});

describe("static reference data integrity", () => {
  it("has 64 districts in 8 divisions with unique ids and valid coordinates", () => {
    expect(DISTRICTS.length).toBe(64);
    expect(new Set(DISTRICTS.map((d) => d.id)).size).toBe(64);
    expect(new Set(DISTRICTS.map((d) => d.division)).size).toBe(8);
    for (const d of DISTRICTS) expect(insideBangladeshBox(d.lat, d.lon), d.id).toBe(true);
    expect(nearestDistrict(24.37, 88.6).id).toBe("rajshahi");
    expect(nearestDistrict(25.07, 91.4).id).toBe("sunamganj");
    expect(bnToAsciiDigits("২০৩৫")).toBe("2035");
  });
  it("every agency uses https and a .gov.bd host; Krishi call centre is 16123", () => {
    for (const a of AGENCIES) {
      const u = new URL(a.url);
      expect(u.protocol, a.id).toBe("https:");
      expect(u.hostname.endsWith(".gov.bd"), a.id).toBe(true);
      for (const l of a.deepLinks ?? []) expect(new URL(l.url).hostname.endsWith(".gov.bd")).toBe(true);
    }
    expect(KRISHI_CALL_CENTER).toBe("16123");
  });
  it("NASA registry never claims 'used' for a dataset it does not actually use", () => {
    const used = NASA_DATASETS.filter((d) => d.integration === "live-in-browser" || d.integration === "bundled-real").map((d) => d.id);
    expect(used.sort()).toEqual(["nex-gddp-cmip6", "power-daily-fixture", "power-monthly"]);
    for (const d of NASA_DATASETS) expect(new URL(d.portal).protocol).toBe("https:");
  });
});
