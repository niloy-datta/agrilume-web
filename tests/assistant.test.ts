import { describe, it, expect } from "vitest";
import { rajshahiFixture } from "@/lib/timetravel/power";
import { computeView, dateAtDay, initialState } from "@/lib/timetravel/engine";
import { applyCommand } from "@/lib/timetravel/commands";
import type { Command } from "@/lib/timetravel/commands";
import { normalise, parseCommands, respond } from "@/lib/timetravel/assistant";
import { GestureDebouncer, classifyGesture, fingerStates, GESTURES, commandForGesture } from "@/lib/timetravel/gestures";
import type { Landmark } from "@/lib/timetravel/gestures";
import { actionForButton, buildMenu, buttonAtUV, MENU_H, MENU_W } from "@/lib/timetravel/menu";
import { validateManifest } from "@/lib/timetravel/bdsl";

const series = rajshahiFixture();
const st = initialState(new Date("2026-11-08"));
const view = () => computeView(st, series, null);

describe("normalise", () => {
  it("converts Bangla digits and strips punctuation", () => {
    expect(normalise("২০৫০ সালে যাও!")).toBe("2050 সালে যাও");
  });
});

describe("parseCommands (Bangla / English / romanised)", () => {
  it("jumps to a year", () => {
    expect(parseCommands("২০৫০ সালে যাও", st)).toContainEqual({ type: "setYear", year: 2050 });
    expect(parseCommands("go to 1995", st)).toContainEqual({ type: "setYear", year: 1995 });
  });
  it("adds a flood scene and a crop together", () => {
    const c = parseCommands("গম দেখাও আর বন্যা দেখাও", st);
    expect(c).toContainEqual({ type: "setCrop", crop: "wheat" });
    expect(c).toContainEqual({ type: "addHazard", hazard: "flood" });
  });
  it("does not match short Latin words inside other words", () => {
    expect(parseCommands("because", st).some((c) => c.type === "setCrop")).toBe(false);
  });
  it("recognises districts in both scripts", () => {
    expect(parseCommands("সিলেট দেখাও", st)).toContainEqual({ type: "setDistrict", id: "sylhet" });
    expect(parseCommands("show khulna", st)).toContainEqual({ type: "setDistrict", id: "khulna" });
  });
  it("play / pause / camera / language", () => {
    expect(parseCommands("থামো", st)).toContainEqual({ type: "pause" });
    expect(parseCommands("drone view", st)).toContainEqual({ type: "setCamera", camera: "drone" });
    expect(parseCommands("switch to english", st)).toContainEqual({ type: "setLang", lang: "en" });
  });
  it("what-if warming is capped at 4 °C", () => {
    const c = parseCommands("what if 9 degree warmer", st);
    const sc = c.find((x) => x.type === "setScenario") as Extract<Command, { type: "setScenario" }>;
    expect(sc.patch.dT).toBeLessThanOrEqual(4);
  });
});

describe("respond", () => {
  it("answers yield questions from the numbers on screen, with the not-a-forecast caveat", () => {
    const r = respond("ফলন কেমন?", view());
    expect(r.kind).toBe("answer");
    expect(r.text).toMatch(/১০০|100/);
    expect(r.text).toMatch(/নিশ্চয়তা|guarantee/);
  });
  it("routes emergencies to 999 and does not simulate", () => {
    const r = respond("emergency help me", { ...view(), state: { ...st, lang: "en" } });
    expect(r.kind).toBe("safety");
    expect(r.text).toContain("999");
    expect(r.commands).toHaveLength(0);
  });
  it("routes medical distress phrases to 999", () => {
    for (const q of ["I feel dizzy and sick", "মাথা ঘুরছে", "chest pain"]) {
      const r = respond(q, { ...view(), state: { ...st, lang: "en" } });
      expect(r.kind).toBe("safety");
      expect(r.text).toContain("999");
    }
  });
  it("gives safety advice with official sources for 'what to do in a flood'", () => {
    const r = respond("what should i do in a flood", { ...view(), state: { ...st, lang: "en" } });
    expect(r.sources.some((s) => s.label === "FFWC")).toBe(true);
  });
  it("admits when it does not know instead of guessing", () => {
    const r = respond("what is the price of jute in dhaka tomorrow", { ...view(), state: { ...st, lang: "en" } });
    expect(r.kind).toBe("fallback");
    expect(r.text.toLowerCase()).toMatch(/do not know|don't know|guess/);
  });
  it("explains the data kind", () => {
    const r = respond("is this data real", { ...view(), state: { ...st, lang: "en" } });
    expect(r.text).toMatch(/NASA POWER/);
  });
});

describe("applyCommand", () => {
  it("clamps year and calendar day, and clears events when the year changes", () => {
    let s = applyCommand(st, { type: "addHazard", hazard: "flood" });
    expect(s.events).toHaveLength(1);
    s = applyCommand(s, { type: "setYear", year: 3000 });
    expect(s.year).toBe(2056);
    expect(s.events).toHaveLength(0);
    s = applyCommand(s, { type: "setDay", day: 9999 });
    expect(s.day).toBe(31);
    s = applyCommand(st, { type: "setDay", day: -9999 });
    expect(s.day).toBe(-334);
  });
  it("jumps to any supported calendar date and keeps the selected day in sync", () => {
    const first = applyCommand(st, { type: "setCalendarDate", year: 2056, doy: 1 });
    expect(first.year).toBe(2056);
    expect(first.day).toBe(-334);
    expect(dateAtDay(first.year, first.sowDoy, first.day)).toMatchObject({ year: 2056, m0: 0, d: 1 });
    const last = applyCommand(st, { type: "setCalendarDate", year: 2056, doy: 366 });
    expect(last.year).toBe(2056);
    expect(last.day).toBe(31);
    expect(dateAtDay(last.year, last.sowDoy, last.day)).toMatchObject({ year: 2056, m0: 11, d: 31 });
    const clamped = applyCommand(last, { type: "setCalendarDate", year: 9999, doy: 999 });
    expect(clamped.year).toBe(2056);
    expect(clamped.day).toBe(31);
  });
  it("toggleHazard is idempotent in pairs", () => {
    const a = applyCommand(st, { type: "toggleHazard", hazard: "drought" });
    const b = applyCommand(a, { type: "toggleHazard", hazard: "drought" });
    expect(a.events).toHaveLength(1);
    expect(b.events).toHaveLength(0);
  });
  it("what-if values are bounded", () => {
    const s = applyCommand(st, { type: "setScenario", patch: { dT: 50, rainMonsoonPct: -500 } });
    expect(s.scenario.dT).toBe(4);
    expect(s.scenario.rainMonsoonPct).toBe(-40);
  });
});

/* ---- synthetic hands: wrist at bottom, fingers pointing up (image y grows downward) ---- */
function hand(f: { thumb?: boolean | "down"; index?: boolean; middle?: boolean; ring?: boolean; pinky?: boolean }): Landmark[] {
  const lm: Landmark[] = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.8 }));
  lm[0] = { x: 0.5, y: 0.85 };
  const bases = [0.44, 0.48, 0.52, 0.56]; // index..pinky MCP x
  const ids = [
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
  ];
  const flags = [f.index, f.middle, f.ring, f.pinky];
  ids.forEach((id, i) => {
    const x = bases[i];
    lm[id[0]] = { x, y: 0.65 };
    if (flags[i]) {
      lm[id[1]] = { x, y: 0.55 };
      lm[id[2]] = { x, y: 0.47 };
      lm[id[3]] = { x, y: 0.4 };
    } else {
      // curled: tip folds back toward the palm, closer to the wrist than the PIP joint
      lm[id[1]] = { x, y: 0.58 };
      lm[id[2]] = { x, y: 0.62 };
      lm[id[3]] = { x, y: 0.68 };
    }
  });
  // thumb: CMC 1, MCP 2, IP 3, TIP 4
  lm[1] = { x: 0.43, y: 0.8 };
  lm[2] = { x: 0.4, y: 0.74 };
  if (f.thumb === true) {
    lm[3] = { x: 0.34, y: 0.7 };
    lm[4] = { x: 0.28, y: 0.66 };
  } else if (f.thumb === "down") {
    lm[3] = { x: 0.38, y: 0.8 };
    lm[4] = { x: 0.37, y: 0.88 };
  } else {
    lm[3] = { x: 0.45, y: 0.72 };
    lm[4] = { x: 0.5, y: 0.7 };
  }
  return lm;
}

describe("gesture classifier", () => {
  it("recognises the control gestures", () => {
    expect(classifyGesture(hand({ thumb: true, index: true, middle: true, ring: true, pinky: true }))).toBe("open_palm");
    expect(classifyGesture(hand({}))).toBe("fist");
    expect(classifyGesture(hand({ index: true }))).toBe("point");
    expect(classifyGesture(hand({ index: true, middle: true }))).toBe("victory");
    expect(classifyGesture(hand({ thumb: true, pinky: true }))).toBe("call");
    expect(classifyGesture(hand({ thumb: true, index: true, pinky: true }))).toBe("ily");
  });
  it("recognises a scaled-down thumbs-down gesture and applies its back-year command", () => {
    const smallHand = hand({ thumb: "down" }).map((point) => ({
      ...point,
      x: 0.5 + (point.x - 0.5) * 0.25,
      y: 0.5 + (point.y - 0.5) * 0.25,
    }));
    expect(classifyGesture(smallHand)).toBe("thumb_down");
    const command = commandForGesture("thumb_down", "bn");
    if (command.type !== "assistant") expect(applyCommand(st, command).year).toBe(st.year - 1);
  });
  it("returns null for incomplete data", () => {
    expect(classifyGesture([])).toBeNull();
    expect(fingerStates([{ x: 0, y: 0 }])).toBeNull();
  });
  it("every gesture has a command, a pictogram and both languages", () => {
    for (const g of GESTURES) {
      expect(g.icon.length).toBeGreaterThan(0);
      expect(g.name.bn && g.name.en && g.does.bn && g.does.en).toBeTruthy();
    }
    expect(commandForGesture("call", "bn")).toEqual({ type: "setLang", lang: "en" });
    expect(commandForGesture("call", "en")).toEqual({ type: "setLang", lang: "bn" });
  });
});

describe("GestureDebouncer", () => {
  it("fires only after the gesture is held, then respects the cooldown", () => {
    const d = new GestureDebouncer(4, 1000);
    let fired = 0;
    for (let i = 0; i < 3; i++) if (d.push("fist", i * 50)) fired++;
    expect(fired).toBe(0);
    expect(d.push("fist", 200)).toBe("fist");
    for (let i = 0; i < 8; i++) expect(d.push("fist", 300 + i * 50)).toBeNull(); // inside cooldown
    for (let i = 0; i < 4; i++) d.push("fist", 1500 + i * 50);
  });
  it("resets when the gesture changes", () => {
    const d = new GestureDebouncer(3, 0);
    d.push("fist", 0);
    d.push("fist", 10);
    d.push("point", 20);
    expect(d.push("fist", 30)).toBeNull();
  });
});

describe("VR menu model", () => {
  it("buttons stay inside the panel and never overlap", () => {
    const bs = buildMenu(st);
    for (const b of bs) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(MENU_W);
      expect(b.y + b.h).toBeLessThanOrEqual(MENU_H);
    }
    for (let i = 0; i < bs.length; i++)
      for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i];
        const b = bs[j];
        const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false);
      }
  });
  it("every button maps to an action and uv hit-testing finds it", () => {
    for (const lang of ["bn", "en"] as const) {
      const bs = buildMenu({ ...st, lang });
      for (const b of bs) {
        expect(actionForButton(b.id, st), b.id).not.toBeNull();
        const u = (b.x + b.w / 2) / MENU_W;
        const v = 1 - (b.y + b.h / 2) / MENU_H;
        expect(buttonAtUV(bs, u, v)?.id).toBe(b.id);
      }
    }
  });
});

describe("BdSL manifest validation", () => {
  it("ignores clips without a verification statement or with unsafe paths", () => {
    const m = validateManifest({
      schema: "agrilume.bdsl.v1",
      clips: [
        { id: "a", src: "a.mp4", captionBn: "ক", credit: "x", verifiedBy: "Org 2026" },
        { id: "b", src: "b.mp4", captionBn: "খ", credit: "x", verifiedBy: "" },
        { id: "c", src: "../c.mp4", captionBn: "গ", credit: "x", verifiedBy: "Org" },
        { id: "d", src: "https://evil.example/d.mp4", captionBn: "ঘ", credit: "x", verifiedBy: "Org" },
      ],
    });
    expect(m?.clips.map((c) => c.id)).toEqual(["a"]);
    expect(validateManifest({ schema: "other" })).toBeNull();
  });
});
