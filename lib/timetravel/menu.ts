import { CROP_LIST } from "./crops";
import type { Command } from "./commands";
import type { CameraPreset, TimeOfDayId, TTState } from "./engine";
import type { HazardType } from "./types";
import { HAZARD_LIST } from "./hazards";

/** Pure model of the in-VR (and Cardboard gaze) control panel. Rendering lives in components/timetravel/scene/VRMenu.tsx. */

export const MENU_W = 1100;
export const MENU_H = 720;

export interface MenuButton {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  active?: boolean;
  tone?: "default" | "warn" | "good";
}

export type MenuAction = { kind: "command"; command: Command } | { kind: "exit" } | { kind: "summon" };

const CAMERAS: { id: CameraPreset; bn: string; en: string }[] = [
  { id: "overview", bn: "পুরো জমি", en: "Overview" },
  { id: "walk", bn: "হাঁটা", en: "Walk" },
  { id: "closeup", bn: "কাছে", en: "Close-up" },
  { id: "drone", bn: "ড্রোন", en: "Drone" },
  { id: "station", bn: "পুনর্ব্যবহার", en: "Recycling" },
];

const TODS: TimeOfDayId[] = ["dawn", "day", "dusk", "night"];
const TOD_LABEL: Record<TimeOfDayId, { bn: string; en: string }> = {
  dawn: { bn: "ভোর", en: "Dawn" },
  day: { bn: "দিন", en: "Day" },
  dusk: { bn: "গোধূলি", en: "Dusk" },
  night: { bn: "রাত", en: "Night" },
};
const PATH_CYCLE = ["compost", "mushroom", "feed", "biogas", "biochar", "pond", "solar"];

export function buildMenu(state: TTState): MenuButton[] {
  const bn = state.lang === "bn";
  const L = (b: string, e: string) => (bn ? b : e);
  const out: MenuButton[] = [];
  const row = (y: number, items: { id: string; label: string; w?: number; active?: boolean; tone?: MenuButton["tone"] }[], x0 = 40, gap = 12, h = 74) => {
    let x = x0;
    for (const it of items) {
      const w = it.w ?? 150;
      out.push({ id: it.id, label: it.label, x, y, w, h, active: it.active, tone: it.tone });
      x += w + gap;
    }
  };
  // year (row 1) – labels are language independent numbers
  row(150, [
    { id: "yr:-10", label: "−10", w: 120 },
    { id: "yr:-1", label: "−1", w: 120 },
    { id: "yr:+1", label: "+1", w: 120 },
    { id: "yr:+10", label: "+10", w: 120 },
    { id: "now", label: L("এখন", "Now"), w: 140 },
    { id: "lang", label: bn ? "English" : "বাংলা", w: 160 },
    { id: "exit", label: L("VR থেকে বের", "Exit VR"), w: 180, tone: "warn" },
  ]);
  // day (row 2)
  row(246, [
    { id: "day:-10", label: "−10", w: 120 },
    { id: "day:-1", label: "−1", w: 120 },
    { id: "day:+1", label: "+1", w: 120 },
    { id: "day:+10", label: "+10", w: 120 },
    { id: "play", label: state.playing ? L("থামুন", "Pause") : L("চালান", "Play"), w: 200, active: state.playing, tone: "good" },
    { id: "summon", label: L("মেনু এখানে আনুন", "Bring menu here"), w: 290 },
  ]);
  // crops
  row(342, CROP_LIST.map((c) => ({ id: `crop:${c.id}`, label: bn ? c.nameBn : c.nameEn, w: 188, active: state.cropId === c.id })), 40, 12, 70);
  // hazards (educational scenes)
  row(432, HAZARD_LIST.map((h) => ({ id: `hz:${h.id}`, label: `${h.icon} ${bn ? h.name.bn.split(" /")[0] : h.name.en.split(" /")[0]}`, w: 188, active: state.events.some((e) => e.type === h.id), tone: "warn" as const })), 40, 12, 70);
  // camera
  row(522, CAMERAS.map((c) => ({ id: `cam:${c.id}`, label: bn ? c.bn : c.en, w: 188, active: state.camera === c.id })), 40, 12, 70);
  // time of day, recycling, hazards clear
  row(612, [
    { id: "tod", label: `${L("সময়", "Time")}: ${bn ? TOD_LABEL[state.tod].bn : TOD_LABEL[state.tod].en}`, w: 250 },
    { id: "path", label: L("পুনর্ব্যবহার ▶", "Recycling ▶"), w: 250, active: !!state.pathway, tone: "good" },
    { id: "clear", label: L("দুর্যোগ সরান", "Clear hazards"), w: 250 },
    { id: "reset", label: L("রিসেট", "Reset"), w: 200 },
  ]);
  return out;
}

export function actionForButton(id: string, state: TTState): MenuAction | null {
  if (id === "exit") return { kind: "exit" };
  if (id === "summon") return { kind: "summon" };
  const cmd = (command: Command): MenuAction => ({ kind: "command", command });
  if (id.startsWith("yr:")) return cmd({ type: "addYears", delta: Number(id.slice(3)) });
  if (id === "now") return cmd({ type: "setYear", year: Math.min(2025, new Date().getFullYear()) });
  if (id.startsWith("day:")) return cmd({ type: "addDays", delta: Number(id.slice(4)) });
  if (id === "play") return cmd({ type: "togglePlay" });
  if (id === "lang") return cmd({ type: "setLang", lang: state.lang === "bn" ? "en" : "bn" });
  if (id.startsWith("crop:")) return cmd({ type: "setCrop", crop: id.slice(5) as never });
  if (id.startsWith("hz:")) return cmd({ type: "toggleHazard", hazard: id.slice(3) as HazardType });
  if (id.startsWith("cam:")) return cmd({ type: "setCamera", camera: id.slice(4) as CameraPreset });
  if (id === "tod") return cmd({ type: "setTod", tod: TODS[(TODS.indexOf(state.tod) + 1) % TODS.length] });
  if (id === "path") {
    const i = state.pathway ? PATH_CYCLE.indexOf(state.pathway) : -1;
    return cmd({ type: "setPathway", id: PATH_CYCLE[(i + 1) % PATH_CYCLE.length] });
  }
  if (id === "clear") return cmd({ type: "clearHazards" });
  if (id === "reset") return cmd({ type: "reset" });
  return null;
}

/** Which button (if any) lies under a normalised UV coordinate (origin bottom-left, as three.js reports it). */
export function buttonAtUV(buttons: MenuButton[], u: number, v: number): MenuButton | null {
  const px = u * MENU_W;
  const py = (1 - v) * MENU_H;
  for (const b of buttons) if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) return b;
  return null;
}
