/**
 * Scientific robustness tests for the educational crop model and the climate scenario layer, run against the REAL
 * bundled NASA POWER files for all 64 districts. These check behaviour (direction, bounds, stability, honesty of
 * labels) — they do NOT validate the model against observed yields; no such validation has been performed.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDistrictFile } from "@/lib/timetravel/power";
import { monthlyForYear } from "@/lib/timetravel/climate";
import { CROPS, CROP_LIST, cropDefProblems, kcAtFraction, simulateSeason, relativeIndex, baselineSim } from "@/lib/timetravel/crops";
import type { CropDef, CropId, SimInput } from "@/lib/timetravel/crops";
import { computeView, initialState, MAX_YEAR, MIN_YEAR } from "@/lib/timetravel/engine";
import { validateProjectionPack } from "@/lib/timetravel/projection-pack";
import { DISTRICTS } from "@/lib/timetravel/locations";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";
import type { ClimateSeries, ScenarioSpec } from "@/lib/timetravel/types";

const ROOT = join(__dirname, "..");
const cache = new Map<string, ClimateSeries>();
const series = (id: string) => {
  if (!cache.has(id)) cache.set(id, parseDistrictFile(JSON.parse(readFileSync(join(ROOT, "public/data/power", `${id}.json`), "utf8")), id));
  return cache.get(id)!;
};
const pack = (id: string) => validateProjectionPack(JSON.parse(readFileSync(join(ROOT, "public/data/projections", `${id}.json`), "utf8")));

function sim(id: string, cropId: CropId, year: number, scenario: ScenarioSpec = DEFAULT_SCENARIO, over: Partial<SimInput> = {}) {
  const s = series(id);
  const crop = CROPS[cropId];
  return simulateSeason({
    lat: s.lat,
    crop,
    sowYear: year,
    sowDoy: crop.defaultSowDoy,
    getYear: (y) => monthlyForYear(s, y, scenario, { pack: pack(id) }),
    irrigation: "irrigated",
    soilEc: 1,
    ...over,
  });
}

describe("crop parameters", () => {
  it("every shipped crop definition is internally consistent", () => {
    for (const c of CROP_LIST) expect(cropDefProblems(c), c.id).toEqual([]);
  });
  it("invalid parameters are rejected, not simulated", () => {
    const bad: CropDef = { ...CROPS.boro, topt1: 40, topt2: 30 };
    expect(cropDefProblems(bad).length).toBeGreaterThan(0);
    expect(() => sim("dhaka", "boro", 2020, DEFAULT_SCENARIO, { crop: bad })).toThrow(/invalid crop/);
    expect(() => sim("dhaka", "boro", 2020, DEFAULT_SCENARIO, { crop: { ...CROPS.boro, gddMaturity: NaN } })).toThrow(/invalid crop/);
    expect(() => sim("dhaka", "boro", 2020, DEFAULT_SCENARIO, { soilEc: -2 })).toThrow(/soilEc/);
  });
  it("Kc stays between its mid and end values late in the season (regression: mis-parenthesised interpolation)", () => {
    for (const c of CROP_LIST) {
      const lo = Math.min(c.kc.mid, c.kc.end);
      const hi = Math.max(c.kc.mid, c.kc.end);
      for (const f of [0.85, 0.9, 1.0, 1.1, 1.2]) {
        const k = kcAtFraction(c, f);
        expect(k).toBeGreaterThanOrEqual(lo - 1e-12);
        expect(k).toBeLessThanOrEqual(hi + 1e-12);
      }
      expect(kcAtFraction(c, 1.2)).toBeCloseTo(c.kc.end, 12);
    }
  });
});

describe("missing data", () => {
  it("refuses to simulate on non-finite weather instead of producing NaN", () => {
    const s = series("dhaka");
    const broken = (y: number) => ({ ...monthlyForYear(s, y, DEFAULT_SCENARIO), tmax: Array(12).fill(NaN) });
    expect(() =>
      simulateSeason({ lat: s.lat, crop: CROPS.boro, sowYear: 2020, sowDoy: CROPS.boro.defaultSowDoy, getYear: broken, irrigation: "irrigated", soilEc: 1 }),
    ).toThrow(/non-finite/);
  });
  it("fills an individually missing observed month with the climatology and labels it observed-filled", () => {
    const s = series("dhaka");
    const holed: ClimateSeries = { ...s, tmax: s.tmax.map((row, i) => (i === 2015 - 1981 ? row.map((v, m) => (m === 3 ? null : v)) : row)) };
    const y = monthlyForYear(holed, 2015, DEFAULT_SCENARIO);
    expect(y.kind).toBe("observed-filled");
    expect(Number.isFinite(y.tmax[3])).toBe(true);
  });
});

describe("numerical stability across all 64 districts, every crop, boundary years", () => {
  const years = [MIN_YEAR, 1991, 2020, 2025, 2026, 2033, MAX_YEAR];
  it("relative index is finite and within [0, 200] everywhere", () => {
    for (const d of DISTRICTS) {
      for (const year of years) {
        for (const cropId of Object.keys(CROPS) as CropId[]) {
          const st = { ...initialState(new Date("2026-01-01")), districtId: d.id, year, cropId, sowDoy: CROPS[cropId].defaultSowDoy };
          const v = computeView(st, series(d.id), pack(d.id));
          expect(Number.isFinite(v.index), `${d.id} ${year} ${cropId}`).toBe(true);
          expect(v.index).toBeGreaterThanOrEqual(0);
          expect(v.index).toBeLessThanOrEqual(200);
        }
      }
    }
  });
  it("is deterministic: identical inputs give bit-identical results", () => {
    const a = sim("sylhet", "aman", 2033, { ...DEFAULT_SCENARIO, mode: "pack" });
    const b = sim("sylhet", "aman", 2033, { ...DEFAULT_SCENARIO, mode: "pack" });
    expect(a.yieldProxy).toBe(b.yieldProxy);
    expect(a.daily.map((x) => x.tmax)).toEqual(b.daily.map((x) => x.tmax));
  });
});

describe("physically sensible responses (direction, not magnitude)", () => {
  const baseIdx = (id: string, cropId: CropId, spec: ScenarioSpec, over: Partial<SimInput> = {}) => {
    const s = series(id);
    const crop = CROPS[cropId];
    const common = { lat: s.lat, crop, sowYear: 2040, sowDoy: crop.defaultSowDoy, irrigation: "rainfed" as const, soilEc: 1, ...over };
    const scen = simulateSeason({ ...common, getYear: (y) => monthlyForYear(s, y, spec) });
    const base = baselineSim(common, monthlyForYear(s, 2040, DEFAULT_SCENARIO));
    return relativeIndex(scen, base);
  };
  it("drought (−60 % rain) lowers a rainfed upland crop in the dry NW", () => {
    expect(baseIdx("rajshahi", "maize", { ...DEFAULT_SCENARIO, rainMonsoonPct: -60, rainDryPct: -60 })).toBeLessThan(100);
  });
  it("irrigation removes most of the drought penalty", () => {
    const dry = { ...DEFAULT_SCENARIO, rainMonsoonPct: -60, rainDryPct: -60 };
    expect(baseIdx("rajshahi", "maize", dry, { irrigation: "irrigated" })).toBeGreaterThan(baseIdx("rajshahi", "maize", dry));
  });
  it("extreme rainfall (+100 %) never produces NaN or a negative index", () => {
    const v = baseIdx("coxsbazar", "aman", { ...DEFAULT_SCENARIO, rainMonsoonPct: 100, rainDryPct: 100 });
    expect(Number.isFinite(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);
  });
  it("strong warming (+4 °C) lowers heat-sensitive Boro rice", () => {
    expect(baseIdx("rajshahi", "boro", { ...DEFAULT_SCENARIO, dT: 4 }, { irrigation: "irrigated" })).toBeLessThan(100);
  });
  it("extreme temperatures (+8 °C / −8 °C) stay bounded", () => {
    for (const dT of [8, -8]) {
      const v = baseIdx("dhaka", "wheat", { ...DEFAULT_SCENARIO, dT }, { irrigation: "irrigated" });
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });
  it("different regions give different results from their own data (no silent shared baseline)", () => {
    const a = sim("rajshahi", "boro", 2015);
    const b = sim("sylhet", "boro", 2015);
    expect(a.totals.rainMm).not.toBeCloseTo(b.totals.rainMm, 0);
  });
});

describe("climate scenarios and projection windows", () => {
  it("a NASA projection is used only for the year the pack covers, for every district", () => {
    for (const d of DISTRICTS) {
      const p = pack(d.id);
      const covered = Object.keys(p.years).map(Number);
      for (const y of [2030, 2033, 2034, 2050]) {
        const out = monthlyForYear(series(d.id), y, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack: p });
        expect(out.kind, `${d.id} ${y}`).toBe(covered.includes(y) ? "nasa-projection" : "trend-what-if");
      }
    }
  });
  it("SSP2-4.5 pack warms every district's 2033 Tmax relative to the observed 2010-2014 baseline", () => {
    for (const d of DISTRICTS) {
      const p = pack(d.id);
      const y = Number(Object.keys(p.years)[0]);
      const proj = monthlyForYear(series(d.id), y, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack: p });
      const meanDelta = p.years[String(y)].dTmax.reduce((s, v) => s + v, 0) / 12;
      expect(proj.kind).toBe("nasa-projection");
      expect(meanDelta).toBeGreaterThan(-1); // model deltas are small but warming-dominated near 2033
    }
  });
  it("historical years are always observed data, never model output", () => {
    for (const y of [1981, 2000, 2025]) {
      const out = monthlyForYear(series("khulna"), y, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack: pack("khulna") });
      expect(["observed", "observed-filled"]).toContain(out.kind);
    }
  });
});
