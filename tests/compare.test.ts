import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDistrictFile, standInSeries } from "@/lib/timetravel/power";
import { validateProjectionPack } from "@/lib/timetravel/projection-pack";
import { compareScenarios } from "@/lib/timetravel/compare";
import type { ScenarioInput } from "@/lib/timetravel/compare";
import { CROPS } from "@/lib/timetravel/crops";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";

const ROOT = join(__dirname, "..");
const series = (id: string) => parseDistrictFile(JSON.parse(readFileSync(join(ROOT, "public/data/power", `${id}.json`), "utf8")), id);
const pack = (id: string) => validateProjectionPack(JSON.parse(readFileSync(join(ROOT, "public/data/projections", `${id}.json`), "utf8")));
const inp = (over: Partial<ScenarioInput> = {}): ScenarioInput => ({
  label: "A",
  year: 2015,
  scenario: DEFAULT_SCENARIO,
  irrigation: "irrigated",
  sowDoy: CROPS.boro.defaultSowDoy,
  ...over,
});

describe("Scenario A vs B comparison", () => {
  it("identical scenarios give zero difference", () => {
    const c = compareScenarios(series("rajshahi"), pack("rajshahi"), "boro", inp(), inp({ label: "B" }));
    expect(c.diff.index).toBe(0);
    expect(c.diff.rainMm).toBe(0);
    expect(c.explanations.map((e) => e.en).join(" ")).toContain("very similar");
  });
  it("+2 °C what-if is explained as hotter, with a shorter season and a lower index for Boro", () => {
    const c = compareScenarios(
      series("rajshahi"),
      null,
      "boro",
      inp({ year: 2040 }),
      inp({ label: "B", year: 2040, scenario: { ...DEFAULT_SCENARIO, dT: 2 } }),
    );
    // seasonal mean rises by less than 2 °C because the warmer crop matures earlier, before the hottest weeks
    expect(c.diff.tmaxC).toBeGreaterThan(0.5);
    expect(c.b.seasonDays).toBeLessThan(c.a.seasonDays);
    expect(c.explanations.map((e) => e.en).join(" ")).toMatch(/days less to mature/);
    expect(c.b.index).toBeLessThan(c.a.index);
    expect(c.explanations[0].en).toMatch(/hotter/);
    expect(c.caveats.map((x) => x.en).join(" ")).toMatch(/what-if built from past data, not a NASA projection/);
  });
  it("labels a NASA projection side as a projection from 2 models, never a forecast", () => {
    const p = pack("sylhet");
    const y = Number(Object.keys(p.years)[0]);
    const c = compareScenarios(series("sylhet"), p, "aman", inp({ sowDoy: CROPS.aman.defaultSowDoy }), inp({ label: "B", year: y, sowDoy: CROPS.aman.defaultSowDoy, scenario: { ...DEFAULT_SCENARIO, mode: "pack" } }));
    expect(c.a.dataKind).toBe("observed");
    expect(c.b.dataKind).toBe("nasa-projection");
    expect(c.caveats.map((x) => x.en).join(" ")).toMatch(/2 climate models .* not a forecast/);
  });
  it("rainfed drought needs no irrigation but raises water stress versus irrigated", () => {
    const dry = { ...DEFAULT_SCENARIO, rainMonsoonPct: -50, rainDryPct: -50 };
    const c = compareScenarios(series("rajshahi"), null, "maize", inp({ year: 2040, sowDoy: CROPS.maize.defaultSowDoy, scenario: dry }), inp({ label: "B", year: 2040, sowDoy: CROPS.maize.defaultSowDoy, scenario: dry, irrigation: "rainfed" }));
    expect(c.b.irrigationMm).toBe(0);
    expect(c.b.waterStress).toBeGreaterThan(c.a.waterStress);
  });
  it("never gives quantity prescriptions (fertiliser, pesticide, kg, litres)", () => {
    const c = compareScenarios(series("dhaka"), pack("dhaka"), "wheat", inp({ sowDoy: CROPS.wheat.defaultSowDoy }), inp({ label: "B", year: 2045, sowDoy: CROPS.wheat.defaultSowDoy, scenario: { ...DEFAULT_SCENARIO, dT: 3, rainDryPct: -40 } }));
    const text = [...c.explanations, ...c.caveats].map((x) => `${x.en} ${x.bn}`).join(" ");
    expect(text).not.toMatch(/fertili[sz]er|pesticide|\bkg\b|litre|urea|TSP/i);
    expect(text).toMatch(/not an irrigation schedule|16123/);
  });
  it("warns loudly when observations are a stand-in from another district", () => {
    const c = compareScenarios(standInSeries("Dhaka"), null, "boro", inp(), inp({ label: "B", year: 2016 }));
    expect(c.caveats[0].en).toMatch(/^WARNING/);
  });
});
