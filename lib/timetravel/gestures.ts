import type { Command } from "./commands";
import type { LocalizedText } from "./types";

/**
 * Hand-gesture CONTROL for the simulator, driven by 21 hand landmarks (MediaPipe Hands layout).
 *
 * IMPORTANT, honest scope: this is a small set of agreed control gestures that lets someone who cannot use voice,
 * mouse or touch operate the scene hands-free. It is NOT Bangla Sign Language (BdSL) recognition or translation —
 * BdSL is a full language with its own grammar, and reliable translation needs a community-built dataset and
 * validation with Deaf users and certified interpreters. See `bdsl.ts` for how real BdSL video content plugs in.
 */

export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export type GestureId = "open_palm" | "fist" | "thumb_up" | "thumb_down" | "point" | "victory" | "call" | "ily";

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

const d = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

/** A finger counts as extended when its tip is clearly farther from the wrist than its middle joint. */
export function fingerStates(lm: Landmark[]): FingerState | null {
  if (!lm || lm.length < 21) return null;
  const wrist = lm[0];
  const ext = (tip: number, pip: number) => d(lm[tip], wrist) > d(lm[pip], wrist) * 1.12;
  // The thumb folds across the palm: compare its tip with the base of the little finger.
  const thumb = d(lm[4], lm[17]) > d(lm[3], lm[17]) * 1.04 && d(lm[4], lm[5]) > d(lm[3], lm[5]) * 1.15;
  return { thumb, index: ext(8, 6), middle: ext(12, 10), ring: ext(16, 14), pinky: ext(20, 18) };
}

export function classifyGesture(lm: Landmark[]): GestureId | null {
  const f = fingerStates(lm);
  if (!f) return null;
  const { thumb, index, middle, ring, pinky } = f;
  const four = [index, middle, ring, pinky];
  const n = four.filter(Boolean).length;
  if (thumb && n === 4) return "open_palm";
  if (!thumb && n === 0) return "fist";
  if (thumb && n === 0) {
    // thumbs up / down: compare thumb tip with the thumb base joint on screen (image y grows downward)
    const verticalThreshold = Math.max(0.01, d(lm[0], lm[9]) * 0.2);
    const up = lm[4].y < lm[2].y - verticalThreshold;
    const down = lm[4].y > lm[2].y + verticalThreshold;
    return up ? "thumb_up" : down ? "thumb_down" : null;
  }
  if (!thumb && index && !middle && !ring && !pinky) return "point";
  if (!thumb && index && middle && !ring && !pinky) return "victory";
  if (thumb && !index && !middle && !ring && pinky) return "call";
  if (thumb && index && !middle && !ring && pinky) return "ily";
  return null;
}

export interface GestureInfo {
  id: GestureId;
  icon: string;
  name: LocalizedText;
  does: LocalizedText;
  command: Command | { type: "assistant" };
}

export const GESTURES: GestureInfo[] = [
  { id: "open_palm", icon: "✋", name: { bn: "খোলা হাতের তালু", en: "Open palm" }, does: { bn: "থামান", en: "Pause" }, command: { type: "pause" } },
  { id: "fist", icon: "✊", name: { bn: "মুষ্টি", en: "Fist" }, does: { bn: "মৌসুম চালান", en: "Play the season" }, command: { type: "play" } },
  { id: "thumb_up", icon: "👍", name: { bn: "বুড়ো আঙুল ওপরে", en: "Thumb up" }, does: { bn: "১ বছর সামনে", en: "+1 year" }, command: { type: "addYears", delta: 1 } },
  { id: "thumb_down", icon: "👎", name: { bn: "বুড়ো আঙুল নিচে", en: "Thumb down" }, does: { bn: "১ বছর পিছনে", en: "−1 year" }, command: { type: "addYears", delta: -1 } },
  { id: "point", icon: "☝️", name: { bn: "তর্জনী", en: "Index finger" }, does: { bn: "১০ দিন এগিয়ে", en: "+10 days" }, command: { type: "addDays", delta: 10 } },
  { id: "victory", icon: "✌️", name: { bn: "দুই আঙুল (V)", en: "Victory (V)" }, does: { bn: "১০ দিন পিছিয়ে", en: "−10 days" }, command: { type: "addDays", delta: -10 } },
  { id: "call", icon: "🤙", name: { bn: "ফোন-হাত", en: "Call hand" }, does: { bn: "ভাষা বদলান", en: "Switch language" }, command: { type: "setLang", lang: "en" } },
  { id: "ily", icon: "🤟", name: { bn: "তিন আঙুল (বুড়ো, তর্জনী, কনিষ্ঠা)", en: "Thumb + index + pinky" }, does: { bn: "সহকারী খুলুন", en: "Open assistant" }, command: { type: "assistant" } },
];

export function gestureInfo(id: GestureId): GestureInfo {
  return GESTURES.find((g) => g.id === id)!;
}

/**
 * Turns a noisy per-frame classification into one deliberate command: the same gesture must be held for
 * `holdFrames` consecutive frames, and after firing there is a cooldown so a held pose does not repeat endlessly.
 */
export class GestureDebouncer {
  private current: GestureId | null = null;
  private count = 0;
  private cooldownUntil = 0;
  constructor(
    private holdFrames = 8,
    private cooldownMs = 1400,
  ) {}

  /** Returns the gesture to act on, or null. `now` is in milliseconds. */
  push(g: GestureId | null, now: number): GestureId | null {
    if (g !== this.current) {
      this.current = g;
      this.count = 0;
    }
    if (!g) return null;
    this.count += 1;
    if (this.count >= this.holdFrames && now >= this.cooldownUntil) {
      this.cooldownUntil = now + this.cooldownMs;
      this.count = 0;
      return g;
    }
    return null;
  }

  /** 0..1 progress towards firing the current gesture, for an on-screen ring. */
  progress(): number {
    return this.current ? Math.min(1, this.count / this.holdFrames) : 0;
  }
}

/** Turn a gesture into a command, resolving the language toggle against the current language. */
export function commandForGesture(id: GestureId, lang: "bn" | "en"): Command | { type: "assistant" } {
  const g = gestureInfo(id);
  if (id === "call") return { type: "setLang", lang: lang === "bn" ? "en" : "bn" };
  return g.command;
}
