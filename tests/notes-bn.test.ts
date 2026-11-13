import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { noteBn, localizeNote } from "@/lib/timetravel/notes-bn";
import { parseDistrictFile, standInSeries } from "@/lib/timetravel/power";
import { monthlyForYear } from "@/lib/timetravel/climate";
import { validateProjectionPack } from "@/lib/timetravel/projection-pack";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";
import type { ClimateSeries } from "@/lib/timetravel/types";

const ROOT = join(__dirname, "..");
const s = parseDistrictFile(JSON.parse(readFileSync(join(ROOT, "public/data/power/rajshahi.json"), "utf8")), "rajshahi");
const pack = validateProjectionPack(JSON.parse(readFileSync(join(ROOT, "public/data/projections/rajshahi.json"), "utf8")));

describe("Bangla notes", () => {
  it("every note the climate engine produces has a Bangla version (no English leaks in Bangla mode)", () => {
    const holed: ClimateSeries = { ...s, tmax: s.tmax.map((r, i) => (i === 10 ? r.map((v, m) => (m === 2 ? null : v)) : r)), tmaxDailySd: Array(12).fill(null) };
    const notes = new Set<string>();
    const cases = [
      monthlyForYear(s, 2015, DEFAULT_SCENARIO),
      monthlyForYear(holed, 1991, DEFAULT_SCENARIO),
      monthlyForYear(s, 2033, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack }),
      monthlyForYear(s, 2045, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack }),
      monthlyForYear(s, 2045, { ...DEFAULT_SCENARIO, dT: 1, rainMonsoonPct: -10 }),
      monthlyForYear(standInSeries("Dhaka"), 2033, { ...DEFAULT_SCENARIO, mode: "pack" }, { pack }),
    ];
    for (const c of cases) for (const n of c.notes) notes.add(n);
    expect(notes.size).toBeGreaterThan(6);
    for (const n of notes) {
      const bn = noteBn(n);
      expect(bn, `untranslated note: ${n}`).not.toBeNull();
      // Bangla digits only; product names (NEX-GDDP-CMIP6, SSP2-4.5) keep their official spelling
      expect(bn!.replace(/NEX-GDDP-CMIP6|SSP\d-\d\.\d/g, "")).not.toMatch(/[0-9]/);
    }
  });
  it("converts numbers to Bangla digits", () => {
    expect(noteBn("Observed warming trend applied (Tmax 0.21 °C/decade, Tmin 0.18 °C/decade).")).toBe(
      "পর্যবেক্ষিত উষ্ণায়নের প্রবণতা যোগ করা হয়েছে (সর্বোচ্চ তাপমাত্রা প্রতি দশকে ০.২১ °C, সর্বনিম্ন ০.১৮ °C)।",
    );
  });
  it("keeps English in English mode and falls back to English for unknown templates", () => {
    expect(localizeNote("User what-if deltas applied (temperature / rainfall).", "en")).toMatch(/^User/);
    expect(localizeNote("Some brand new note", "bn")).toBe("Some brand new note");
  });
});
