import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { rajshahiFixture, parseDaily, monthlyUrl, standInSeries } from "@/lib/timetravel/power";
import {
  annualTrend,
  climatology,
  et0Hargreaves,
  extraterrestrialRadiation,
  monthlyForYear,
  olsTrend,
  daysInMonth,
  dayOfYear,
  monthDayOf,
  buildDailyWeather,
  expectedExceedance,
} from "@/lib/timetravel/climate";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";
import { validateProjectionPack } from "@/lib/timetravel/projection-pack";
import type { ProjectionPack } from "@/lib/timetravel/projection-pack";
import { DISTRICTS } from "@/lib/timetravel/locations";

const s = rajshahiFixture();

describe("bundled real NASA POWER fixture (Rajshahi)", () => {
  it("is marked real, with provenance and the verified file hash", () => {
    expect(s.provenance.synthetic).toBe(false);
    expect(s.provenance.provider).toBe("NASA POWER");
    expect(s.provenance.sourceFileSha256).toBe(
      "47a2fb929709a7732f64dad395b070bb222c6d1d959ef915398938a81cffb713",
    );
    expect(s.startYear).toBe(2001);
    expect(s.endYear).toBe(2025);
  });
  it("matches the climatology of Rajshahi (April is the hottest month of Tmax, Jul is wet, Jan is dry)", () => {
    const tmax = climatology(s.tmax, s.startYear, 2001, 2025);
    const rain = climatology(s.rain, s.startYear, 2001, 2025);
    const hottest = tmax.mean.indexOf(Math.max(...tmax.mean));
    expect(hottest).toBe(3); // April
    expect(tmax.mean[3]).toBeGreaterThan(36);
    expect(rain.mean[5]).toBeGreaterThan(5); // Jun mm/day
    expect(rain.mean[0]).toBeLessThan(0.5);
    expect(tmax.n.every((n) => n >= 24)).toBe(true);
  });
  it("source file on disk still hashes to the recorded value", async () => {
    const { readFileSync } = await import("node:fs");
    const { createHash } = await import("node:crypto");
    const buf = readFileSync(
      "data/source/nasa_power/27717dd3626e987c473672153816593e26f91d20bc97f419be81ea8686aa3435.json",
    );
    expect(createHash("sha256").update(buf).digest("hex")).toBe(s.provenance.sourceFileSha256);
  });
});

describe("statistics", () => {
  it("OLS recovers an exact line", () => {
    const xs = [1, 2, 3, 4, 5, 6];
    const ys = xs.map((x) => 2 + 0.5 * x);
    const t = olsTrend(xs, ys);
    expect(t.slope).toBeCloseTo(0.5, 10);
    expect(t.intercept).toBeCloseTo(2, 10);
  });
  it("trend of a noisy flat series is not significant", () => {
    const xs = Array.from({ length: 25 }, (_, i) => 2001 + i);
    const ys = xs.map((_, i) => 27 + (i % 2 ? 0.3 : -0.3));
    expect(Math.abs(olsTrend(xs, ys).t)).toBeLessThan(2);
  });
  it("annualTrend works on the fixture and returns finite numbers", () => {
    const t = annualTrend(s.tmax, s.startYear, s.endYear);
    expect(Number.isFinite(t.slope)).toBe(true);
    expect(t.n).toBeGreaterThanOrEqual(24);
  });
});

describe("calendar helpers", () => {
  it("handles leap years", () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2025, 1)).toBe(28);
    expect(dayOfYear(2025, 6, 1)).toBe(182);
    expect(monthDayOf(2025, 182)).toEqual({ m0: 6, d: 1 });
    expect(monthDayOf(2025, 365)).toEqual({ m0: 11, d: 31 });
  });
});

describe("radiation and ET0", () => {
  it("Ra at 24N is near the FAO-56 values (about 41 in June, 23 in December MJ/m2/d)", () => {
    const june = extraterrestrialRadiation(24, 172);
    const dec = extraterrestrialRadiation(24, 355);
    expect(june).toBeGreaterThan(40);
    expect(june).toBeLessThan(43);
    expect(dec).toBeGreaterThan(22);
    expect(dec).toBeLessThan(26);
  });
  it("Hargreaves ET0 is in a physically plausible range for pre-monsoon Bangladesh", () => {
    const et = et0Hargreaves(24.4, 110, 39, 24); // April hot dry
    expect(et).toBeGreaterThan(5);
    expect(et).toBeLessThan(9);
    expect(et0Hargreaves(24.4, 15, 24, 11)).toBeLessThan(3.5); // January
  });
});

describe("monthlyForYear (honest data kinds)", () => {
  it("returns observed values for years in the record", () => {
    const m = monthlyForYear(s, 2010, DEFAULT_SCENARIO);
    expect(m.kind).toBe("observed");
    expect(m.tmax[3]).toBe(s.tmax[2010 - s.startYear][3]);
    expect(m.perturbed).toBe(false);
  });
  it("labels future years as trend-what-if, never as observed", () => {
    const m = monthlyForYear(s, 2050, DEFAULT_SCENARIO);
    expect(m.kind).toBe("trend-what-if");
    expect(m.notes.join(" ")).toMatch(/trend|statistically/i);
  });
  it("applies user what-if deltas exactly", () => {
    const a = monthlyForYear(s, 2050, DEFAULT_SCENARIO);
    const b = monthlyForYear(s, 2050, { ...DEFAULT_SCENARIO, dT: 2, rainMonsoonPct: -30, rainDryPct: 10 });
    expect(b.tmax[3] - a.tmax[3]).toBeCloseTo(2, 10);
    expect(b.rain[6]).toBeCloseTo(a.rain[6] * 0.7, 10); // July
    expect(b.rain[0]).toBeCloseTo(a.rain[0] * 1.1, 10); // January
    expect(b.perturbed).toBe(true);
  });
  const testPack = (deltaBaseline: [number, number]): ProjectionPack => ({
    schema: "agrilume.projection.delta.v1",
    dataset: "NASA/NEX-GDDP-CMIP6",
    scenario: "ssp245",
    ensemble: "TEST-FIXTURE (synthetic, test only)",
    deltaBaseline,
    projectionWindow: [2039, 2041],
    rainRatioFallbackMonths: [0],
    location: { name: "test", lat: 24, lon: 88 },
    generatedAt: "2026-01-01T00:00:00Z",
    citation: "Test fixture only - not real projection data",
    years: { "2040": { dTmax: Array(12).fill(1.5), dTmin: Array(12).fill(1.2), rainRatio: Array(12).fill(1.1) } },
  });
  it("uses a NASA delta pack only when one exists for that year, on the SAME observed baseline window", () => {
    const pack = testPack([2010, 2014]);
    const withPack = monthlyForYear(s, 2040, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack });
    expect(withPack.kind).toBe("nasa-projection");
    const c = climatology(s.tmax, s.startYear, 2010, 2014).mean;
    const r = climatology(s.rain, s.startYear, 2010, 2014).mean;
    for (let m = 0; m < 12; m++) {
      expect(withPack.tmax[m]).toBeCloseTo(c[m] + 1.5, 9);
      expect(withPack.rain[m]).toBeCloseTo(r[m] * 1.1, 9);
    }
    expect(withPack.notes.join(" ")).toContain("2039-2041 mean");
    expect(withPack.notes.join(" ")).toContain("2010-2014 mean (same window as the model baseline)");
    expect(withPack.notes.join(" ")).toContain("multiplicative ratio is undefined or unstable");
    const noYear = monthlyForYear(s, 2041, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack });
    expect(noYear.kind).toBe("trend-what-if");
    expect(noYear.notes.join(" ")).toContain("No NASA projection for 2041");
  });
  it("refuses a pack whose baseline window is outside the observed record", () => {
    const out = monthlyForYear(s, 2040, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack: testPack([1995, 2014]) });
    expect(out.kind).toBe("trend-what-if");
    expect(out.notes.join(" ")).toContain("does not cover the projection pack's baseline window");
  });
  it("never applies a district's projection to stand-in observations from another place", () => {
    const stand = standInSeries("Dhaka");
    const out = monthlyForYear(stand, 2040, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack: testPack([2010, 2014]) });
    expect(out.kind).toBe("trend-what-if");
    expect(out.notes.join(" ")).toContain("Projection pack NOT applied");
  });
  it("validates projection packs strictly", () => {
    expect(() => validateProjectionPack({})).toThrow();
    expect(() =>
      validateProjectionPack({
        schema: "agrilume.projection.delta.v1",
        dataset: "NASA/NEX-GDDP-CMIP6",
        scenario: "ssp245",
        citation: "long enough citation",
        years: { "2040": { dTmax: [1], dTmin: [1], rainRatio: [1] } },
      }),
    ).toThrow(/12/);
  });
  it("rejects malformed projection windows", () => {
    expect(() =>
      validateProjectionPack({
        schema: "agrilume.projection.delta.v1",
        dataset: "NASA/NEX-GDDP-CMIP6",
        scenario: "ssp245",
        citation: "long enough citation",
        projectionWindow: [2040, 2030],
        years: {},
      }),
    ).toThrow(/projectionWindow/);
  });
  it("bundles validated NASA SSP2-4.5 packs for each district center", () => {
    const directory = join(process.cwd(), "public", "data", "projections");
    const files = readdirSync(directory).filter((file) => file.endsWith(".json")).sort();
    expect(files).toEqual(DISTRICTS.map((district) => `${district.id}.json`).sort());

    const rajshahi = validateProjectionPack(
      JSON.parse(readFileSync(join(directory, "rajshahi.json"), "utf8")),
    );
    expect(rajshahi.scenario).toBe("ssp245");
    expect(rajshahi.deltaBaseline).toEqual([2010, 2014]);
    expect(rajshahi.projectionWindow).toEqual([2031, 2035]);
    expect(Object.keys(rajshahi.years)).toEqual(["2033"]);
    expect(rajshahi.ensemble).toContain("GFDL-CM4");
    expect(rajshahi.ensemble).toContain("GISS-E2-1-G");
    const dhaka = validateProjectionPack(
      JSON.parse(readFileSync(join(directory, "dhaka.json"), "utf8")),
    );
    expect(dhaka.rainRatioFallbackMonths).toContain(0);
  });
});

describe("daily weather interpolation", () => {
  it("is continuous across month and year boundaries and preserves monthly means approximately", () => {
    const w = buildDailyWeather(24.37, (y) => monthlyForYear(s, Math.min(y, 2025), DEFAULT_SCENARIO), 2024, 300, 120);
    for (let i = 1; i < w.tmax.length; i++) expect(Math.abs(w.tmax[i] - w.tmax[i - 1])).toBeLessThan(1.5);
    expect(w.year[0]).toBe(2024);
    expect(w.year[w.year.length - 1]).toBe(2025);
    expect(w.doy[0]).toBe(300);
  });
  it("expectedExceedance is monotone and bounded", () => {
    const a = expectedExceedance(30, 2, 35, 6);
    const b = expectedExceedance(34, 2, 35, 6);
    const c = expectedExceedance(40, 2, 35, 6);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c).toBeLessThanOrEqual(1);
    expect(a).toBeGreaterThanOrEqual(0);
  });
});

describe("NASA POWER response parsing", () => {
  const mk = (vals: Record<string, number>) => ({
    properties: { parameter: { T2M_MAX: vals, T2M_MIN: vals, PRECTOTCORR: vals } },
    header: { fill_value: -999 },
    parameters: { PRECTOTCORR: { units: "mm/day" }, T2M_MAX: { units: "C" }, T2M_MIN: { units: "C" } },
  });
  const meta = { name: "t", lat: 24, lon: 88, startYear: 2020, endYear: 2021, url: "u", origin: "nasa-power-live" as const, retrievedAt: "x" };
  const days = (ym: string, n: number, f: (d: number) => number) =>
    Object.fromEntries(Array.from({ length: n }, (_, i) => [`${ym}${String(i + 1).padStart(2, "0")}`, f(i)]));
  it("averages DAILY values per month (not the monthly extreme) and drops -999 fill", () => {
    // Jan 2020: 31 days alternating 10 / 20 (mean 15, max 20) + one fill value that must be ignored
    const jan = days("202001", 31, (i) => (i === 5 ? -999 : i % 2 ? 20 : 10));
    const out = parseDaily(mk(jan), meta);
    const valid = Object.values(jan).filter((v) => v !== -999);
    expect(out.tmax[0][0]).toBeCloseTo(valid.reduce((s, v) => s + v, 0) / valid.length, 10);
    expect(out.tmax[0][0]).toBeLessThan(20); // the monthly extreme would be 20
    expect(out.tmax[0][1]).toBeNull(); // February has no data -> null, never 0
  });
  it("refuses a monthly mean built from fewer than 20 valid days", () => {
    const out = parseDaily(mk(days("202003", 19, () => 30)), meta);
    expect(out.tmax[0][2]).toBeNull();
    expect(parseDaily(mk(days("202003", 20, () => 30)), meta).tmax[0][2]).toBe(30);
  });
  it("ignores monthly-format keys (YYYYMM / YYYY13)", () => {
    const out = parseDaily(mk({ "202001": 10, "202013": 99 }), meta);
    expect(out.tmax[0].every((v) => v === null)).toBe(true);
  });
  it("derives day-to-day Tmax SD from the daily values", () => {
    const vals: Record<string, number> = {};
    for (const y of ["2020", "2021"]) for (let m = 1; m <= 12; m++) Object.assign(vals, days(`${y}${String(m).padStart(2, "0")}`, 28, (i) => (i % 2 ? 31 : 29)));
    const out = parseDaily(mk(vals), meta);
    for (const sd of out.tmaxDailySd) expect(sd).toBeCloseTo(Math.sqrt(56 / 55), 6); // +/-1 deviations, n-1
  });
  it("rejects unexpected rainfall units instead of guessing", () => {
    const j = mk(days("202001", 31, () => 1));
    j.parameters.PRECTOTCORR.units = "kg/m2/s";
    expect(() => parseDaily(j, meta)).toThrow(/units/);
  });
  it("builds the documented monthly URL", () => {
    const u = monthlyUrl(24.37, 88.6, 1981, 2025, ["T2M_MAX"]);
    expect(u).toContain("https://power.larc.nasa.gov/api/temporal/monthly/point?");
    expect(u).toContain("community=AG");
    expect(u).toContain("latitude=24.3700");
  });
});
