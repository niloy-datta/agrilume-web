import type { Lang } from "./types";

/**
 * Thin, defensive wrappers around the browser's Web Speech API.
 *
 * Honest notes shown to users in the UI:
 *  - Speech RECOGNITION in most browsers is provided by an online service (audio may leave the device). It is optional.
 *  - Bangla (bn-BD) recognition/voices are not available in every browser or phone; when missing we say so and fall back
 *    to typing, buttons or gestures. Spoken output is always mirrored as on-screen captions.
 */

interface RecognitionResultAlt {
  transcript: string;
  confidence: number;
}
interface RecognitionEventLike {
  results: ArrayLike<ArrayLike<RecognitionResultAlt> & { isFinal: boolean }>;
  resultIndex: number;
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const LOCALE: Record<Lang, string> = { bn: "bn-BD", en: "en-US" };

export interface SpeechSupport {
  stt: boolean;
  tts: boolean;
}

export function speechSupport(): SpeechSupport {
  return {
    stt: !!getCtor(),
    tts: typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined",
  };
}

export type ListenError = "unsupported" | "not-allowed" | "no-speech" | "network" | "language-not-supported" | "aborted" | "other";

export interface Listener {
  stop(): void;
}

/** Listen for one phrase. `onInterim` receives partial text; `onFinal` the final text. */
export function listenOnce(lang: Lang, h: { onInterim?: (t: string) => void; onFinal: (t: string) => void; onError: (e: ListenError) => void; onEnd?: () => void }): Listener | null {
  const Ctor = getCtor();
  if (!Ctor) {
    h.onError("unsupported");
    return null;
  }
  const rec = new Ctor();
  rec.lang = LOCALE[lang];
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  let gotFinal = false;
  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      const text = r[0]?.transcript ?? "";
      if (r.isFinal) {
        gotFinal = true;
        h.onFinal(text.trim());
      } else interim += text;
    }
    if (interim) h.onInterim?.(interim.trim());
  };
  rec.onerror = (e) => {
    const map: Record<string, ListenError> = {
      "not-allowed": "not-allowed",
      "service-not-allowed": "not-allowed",
      "no-speech": "no-speech",
      network: "network",
      "language-not-supported": "language-not-supported",
      aborted: "aborted",
    };
    h.onError(map[e.error] ?? "other");
  };
  rec.onend = () => {
    if (!gotFinal) {
      /* silence or error already reported */
    }
    h.onEnd?.();
  };
  try {
    rec.start();
  } catch {
    h.onError("other");
    return null;
  }
  return { stop: () => rec.stop() };
}

export function listErrorText(e: ListenError, lang: Lang): string {
  const bn = lang === "bn";
  switch (e) {
    case "unsupported":
      return bn ? "এই ব্রাউজারে ভয়েস শোনা সমর্থিত নয়। টাইপ করুন বা বোতাম ব্যবহার করুন।" : "Voice listening is not supported in this browser. Type or use the buttons.";
    case "not-allowed":
      return bn ? "মাইক্রোফোনের অনুমতি দেওয়া হয়নি।" : "Microphone permission was not granted.";
    case "no-speech":
      return bn ? "কোনো কথা শোনা যায়নি; আবার চেষ্টা করুন।" : "No speech heard; please try again.";
    case "network":
      return bn ? "ভয়েস সেবায় সংযোগ হয়নি (অনলাইন লাগে)। টাইপ করুন।" : "Could not reach the speech service (it needs internet). Please type instead.";
    case "language-not-supported":
      return bn ? "এই ডিভাইসে বাংলা ভয়েস শোনা সমর্থিত নয়। ইংরেজি বা টাইপ চেষ্টা করুন।" : "Bangla listening is not supported on this device. Try English or type.";
    default:
      return bn ? "ভয়েস কাজ করেনি।" : "Voice did not work.";
  }
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === "bn" ? "bn" : "en";
  const exact = voices.find((v) => v.lang.toLowerCase() === LOCALE[lang].toLowerCase());
  return exact ?? voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ?? null;
}

/** Speak text. Returns false when no voice for that language exists (the caller keeps showing the caption). */
export function speak(text: string, lang: Lang): boolean {
  if (!speechSupport().tts || !text) return false;
  const v = pickVoice(lang);
  if (!v) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = v;
  u.lang = v.lang;
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking(): void {
  if (speechSupport().tts) window.speechSynthesis.cancel();
}

/** Short vibration pattern for alerts (phones). No-op where unsupported. */
export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
