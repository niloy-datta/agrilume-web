import { CROPS } from "./crops";
import type { CropId } from "./crops";
import { defaultHazardEvent } from "./hazards";
import { getDistrict } from "./locations";
import { MAX_YEAR, MIN_YEAR } from "./engine";
import type { CameraPreset, PanelId, TimeOfDayId, TTState } from "./engine";
import type { HazardType, IrrigationMode, Lang, ScenarioSpec } from "./types";

/**
 * One command vocabulary is shared by the on-screen HUD, the VR menu, the voice assistant, the text assistant and
 * the gesture controller. Everything that changes the simulation goes through `applyCommand`, so every input
 * method behaves identically and can be unit-tested without a browser.
 */
export type Command =
  | { type: "setYear"; year: number }
  | { type: "addYears"; delta: number }
  | { type: "setCalendarDate"; year: number; doy: number }
  | { type: "setDay"; day: number }
  | { type: "addDays"; delta: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "togglePlay" }
  | { type: "setCrop"; crop: CropId }
  | { type: "setLang"; lang: Lang }
  | { type: "setDistrict"; id: string }
  | { type: "addHazard"; hazard: HazardType }
  | { type: "toggleHazard"; hazard: HazardType }
  | { type: "clearHazards" }
  | { type: "updateEvent"; hazard: HazardType; patch: { startDay?: number; days?: number; severity?: number } }
  | { type: "setIrrigation"; mode: IrrigationMode }
  | { type: "setScenario"; patch: Partial<ScenarioSpec> }
  | { type: "setSoilEc"; ec: number }
  | { type: "setTolerant"; value: boolean }
  | { type: "openPanel"; panel: PanelId }
  | { type: "setPathway"; id: string | null }
  | { type: "setCamera"; camera: CameraPreset }
  | { type: "setTod"; tod: TimeOfDayId }
  | { type: "reset" };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const DAY_MS = 86_400_000;

function clampDayForYear(state: TTState, year: number, day: number): number {
  const minDay = 1 - state.sowDoy;
  const sowingDate = Date.UTC(year, 0, state.sowDoy);
  const lastSupportedDate = Date.UTC(MAX_YEAR, 11, 31);
  const maxDay = Math.min(249, Math.floor((lastSupportedDate - sowingDate) / DAY_MS));
  return clamp(Math.round(day), minDay, maxDay);
}

export function applyCommand(state: TTState, cmd: Command): TTState {
  switch (cmd.type) {
    case "setYear": {
      const year = clamp(Math.round(cmd.year), MIN_YEAR, MAX_YEAR);
      return { ...state, year, day: clampDayForYear(state, year, state.day), events: [] };
    }
    case "addYears": {
      const year = clamp(state.year + Math.round(cmd.delta), MIN_YEAR, MAX_YEAR);
      return { ...state, year, day: clampDayForYear(state, year, state.day), events: [] };
    }
    case "setCalendarDate": {
      const year = clamp(Math.round(cmd.year), MIN_YEAR, MAX_YEAR);
      const yearDays = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / DAY_MS;
      const doy = clamp(Math.round(cmd.doy), 1, yearDays);
      return { ...state, year, day: clampDayForYear(state, year, doy - state.sowDoy), events: [] };
    }
    case "setDay":
      return { ...state, day: clampDayForYear(state, state.year, cmd.day) };
    case "addDays":
      return { ...state, day: clampDayForYear(state, state.year, state.day + Math.round(cmd.delta)) };
    case "play":
      return { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "togglePlay":
      return { ...state, playing: !state.playing };
    case "setCrop": {
      const crop = CROPS[cmd.crop];
      if (!crop) return state;
      return { ...state, cropId: cmd.crop, sowDoy: crop.defaultSowDoy, day: 30, events: [] };
    }
    case "setLang":
      return { ...state, lang: cmd.lang };
    case "setDistrict":
      return getDistrict(cmd.id) ? { ...state, districtId: cmd.id, custom: null } : state;
    case "addHazard": {
      if (state.events.some((e) => e.type === cmd.hazard)) return state;
      return { ...state, events: [...state.events, defaultHazardEvent(cmd.hazard, Math.max(5, state.day))] };
    }
    case "toggleHazard": {
      if (state.events.some((e) => e.type === cmd.hazard)) return { ...state, events: state.events.filter((e) => e.type !== cmd.hazard) };
      return { ...state, events: [...state.events, defaultHazardEvent(cmd.hazard, Math.max(5, state.day))] };
    }
    case "clearHazards":
      return { ...state, events: [] };
    case "updateEvent":
      return {
        ...state,
        events: state.events.map((e) =>
          e.type === cmd.hazard
            ? {
                ...e,
                startDay: clamp(Math.round(cmd.patch.startDay ?? e.startDay), 0, 240),
                days: clamp(Math.round(cmd.patch.days ?? e.days), 1, 60),
                severity: clamp(cmd.patch.severity ?? e.severity, 0, 1),
              }
            : e,
        ),
      };
    case "setIrrigation":
      return { ...state, irrigation: cmd.mode };
    case "setScenario": {
      const sc = { ...state.scenario, ...cmd.patch };
      sc.dT = clamp(sc.dT, 0, 4);
      sc.rainMonsoonPct = clamp(sc.rainMonsoonPct, -40, 40);
      sc.rainDryPct = clamp(sc.rainDryPct, -60, 60);
      return { ...state, scenario: sc };
    }
    case "setSoilEc":
      return { ...state, soilEc: clamp(cmd.ec, 0, 20) };
    case "setTolerant":
      return { ...state, tolerant: cmd.value };
    case "openPanel":
      return { ...state, panel: cmd.panel };
    case "setPathway":
      return { ...state, pathway: cmd.id, panel: cmd.id ? "recycle" : state.panel, camera: cmd.id ? "station" : state.camera };
    case "setCamera":
      return { ...state, camera: cmd.camera };
    case "setTod":
      return { ...state, tod: cmd.tod };
    case "reset":
      return {
        ...state,
        year: Math.min(state.year, 2025),
        day: 60,
        events: [],
        scenario: { mode: "trend", dT: 0, rainMonsoonPct: 0, rainDryPct: 0 },
        pathway: null,
        playing: false,
      };
  }
}

/** Short spoken/printed confirmation for a command, in the requested language. */
export function describeCommand(cmd: Command, lang: Lang, state?: TTState): string {
  const bn = lang === "bn";
  switch (cmd.type) {
    case "setYear":
      return bn ? `সাল ${cmd.year} দেখানো হচ্ছে।` : `Showing the year ${cmd.year}.`;
    case "addYears":
      return bn ? `${Math.abs(cmd.delta)} বছর ${cmd.delta >= 0 ? "সামনে" : "পিছনে"} যাচ্ছি।` : `Moving ${Math.abs(cmd.delta)} years ${cmd.delta >= 0 ? "forward" : "back"}.`;
    case "setCalendarDate":
      return bn ? `${cmd.year} সালের তারিখ দেখানো হচ্ছে।` : `Showing the date in ${cmd.year}.`;
    case "setDay":
      return bn ? `বপনের ${cmd.day} দিন পরে।` : `Day ${cmd.day} after sowing.`;
    case "addDays":
      return bn ? `${Math.abs(cmd.delta)} দিন ${cmd.delta >= 0 ? "এগিয়ে" : "পিছিয়ে"}।` : `${Math.abs(cmd.delta)} days ${cmd.delta >= 0 ? "forward" : "back"}.`;
    case "play":
      return bn ? "সময়ের চলা শুরু।" : "Playing the season.";
    case "pause":
      return bn ? "থামানো হলো।" : "Paused.";
    case "togglePlay":
      return state?.playing ? (bn ? "থামানো হলো।" : "Paused.") : bn ? "সময়ের চলা শুরু।" : "Playing the season.";
    case "setCrop":
      return bn ? `ফসল: ${CROPS[cmd.crop]?.nameBn ?? cmd.crop}।` : `Crop: ${CROPS[cmd.crop]?.nameEn ?? cmd.crop}.`;
    case "setLang":
      return cmd.lang === "bn" ? "ভাষা বাংলা করা হলো।" : "Language set to English.";
    case "setDistrict": {
      const d = getDistrict(cmd.id);
      return d ? (bn ? `স্থান: ${d.nameBn}।` : `Place: ${d.nameEn}.`) : bn ? "জেলা পাওয়া যায়নি।" : "District not found.";
    }
    case "addHazard":
    case "toggleHazard":
      return bn ? "শিক্ষামূলক দুর্যোগ দৃশ্য পরিবর্তন করা হলো (এটি পূর্বাভাস নয়)।" : "Educational hazard scene changed (this is not a forecast).";
    case "clearHazards":
      return bn ? "সব দুর্যোগ দৃশ্য সরানো হলো।" : "All hazard scenes cleared.";
    case "updateEvent":
      return bn ? "দুর্যোগ দৃশ্যের মাত্রা/সময় পরিবর্তিত।" : "Hazard scene strength/timing changed.";
    case "setIrrigation":
      return bn ? "সেচ পদ্ধতি পরিবর্তিত।" : "Irrigation mode changed.";
    case "setScenario":
      return bn ? "ধরে-নিই (what-if) অবস্থা পরিবর্তিত; এটি পূর্বাভাস নয়।" : "What-if setting changed; this is not a forecast.";
    case "setSoilEc":
      return bn ? "মাটির লবণাক্ততা পরিবর্তিত।" : "Soil salinity changed.";
    case "setTolerant":
      return bn ? "জাতের সহনশীলতা পরিবর্তিত।" : "Variety tolerance changed.";
    case "openPanel":
      return bn ? "প্যানেল খোলা হলো।" : "Panel opened.";
    case "setPathway":
      return cmd.id ? (bn ? "পুনর্ব্যবহার পথ দেখানো হচ্ছে।" : "Showing the recycling pathway.") : bn ? "নির্বাচন সরানো হলো।" : "Selection cleared.";
    case "setCamera":
      return bn ? "ক্যামেরা পরিবর্তিত।" : "Camera changed.";
    case "setTod":
      return bn ? "দিনের সময় পরিবর্তিত।" : "Time of day changed.";
    case "reset":
      return bn ? "রিসেট করা হলো।" : "Reset.";
  }
}
