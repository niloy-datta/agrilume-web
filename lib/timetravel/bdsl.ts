import type { LocalizedText } from "./types";

/**
 * Bangla Sign Language (BdSL) content slot.
 *
 * AgriLume does NOT machine-translate to or from BdSL. A sign-language video is shown only when a real video made or
 * verified by a Deaf signer / certified interpreter has been added to `public/bdsl/manifest.json`. Until then the
 * app shows large captions, pictograms, vibration and flashing-free visual alerts instead, and says so plainly.
 */

export interface BdslClip {
  /** matches an `AccessPhrase.id` */
  id: string;
  /** path relative to /bdsl/, e.g. "flood-warning.mp4" */
  src: string;
  /** optional poster image */
  poster?: string;
  /** caption text in Bangla (always shown with the clip) */
  captionBn: string;
  captionEn?: string;
  /** who signed / verified it — shown to the user */
  credit: string;
  /** e.g. "Verified by <organisation>, <year>" */
  verifiedBy: string;
}

export interface BdslManifest {
  schema: "agrilume.bdsl.v1";
  notice?: string;
  clips: BdslClip[];
}

export interface AccessPhrase {
  id: string;
  icon: string;
  text: LocalizedText;
}

/** The phrases the app needs signed first (a short, high-value list to hand to interpreters). */
export const ACCESS_PHRASES: AccessPhrase[] = [
  { id: "welcome", icon: "👋", text: { bn: "স্বাগতম। সময়ের সঙ্গে খামারের ভ্রমণ।", en: "Welcome. A time-travel tour of a farm." } },
  { id: "not-forecast", icon: "⚠️", text: { bn: "এটি পূর্বাভাস নয়, শিক্ষামূলক সিমুলেশন।", en: "This is not a forecast; it is an educational simulation." } },
  { id: "flood-safety", icon: "🌊", text: { bn: "বন্যার সতর্কতা পেলে নিরাপদ স্থানে যান; বাংলাদেশ পানি উন্নয়ন বোর্ডের (FFWC) সতর্কবার্তা দেখুন।", en: "If a flood warning is issued, move to a safe place and follow FFWC warnings." } },
  { id: "cyclone-safety", icon: "🌀", text: { bn: "ঘূর্ণিঝড়ের সংকেত পেলে আশ্রয়কেন্দ্রে যান; আবহাওয়া অধিদপ্তরের (BMD) সংকেত মানুন।", en: "On a cyclone signal go to a shelter and follow BMD signals." } },
  { id: "emergency", icon: "🚨", text: { bn: "জরুরি অবস্থায় ৯৯৯ নম্বরে ফোন করুন।", en: "In an emergency call 999." } },
  { id: "krishi-call", icon: "📞", text: { bn: "কৃষি পরামর্শের জন্য কৃষি কল সেন্টার ১৬১২৩।", en: "For farming advice call the Krishi Call Centre 16123." } },
  { id: "no-burn", icon: "🔥", text: { bn: "মাঠে খড় পোড়াবেন না; কম্পোস্ট, মাশরুম বা বায়োগ্যাসে ব্যবহার করুন।", en: "Do not burn straw in the field; use it for compost, mushrooms or biogas." } },
];

export function validateManifest(x: unknown): BdslManifest | null {
  if (!x || typeof x !== "object") return null;
  const m = x as Partial<BdslManifest>;
  if (m.schema !== "agrilume.bdsl.v1" || !Array.isArray(m.clips)) return null;
  const clips = m.clips.filter(
    (c): c is BdslClip =>
      !!c && typeof c.id === "string" && typeof c.src === "string" && !c.src.includes("..") && !/^[a-z]+:/i.test(c.src) && typeof c.captionBn === "string" && typeof c.credit === "string" && typeof c.verifiedBy === "string" && c.verifiedBy.trim().length > 0,
  );
  return { schema: "agrilume.bdsl.v1", notice: m.notice, clips };
}

export async function loadBdslManifest(basePath: string): Promise<BdslManifest | null> {
  try {
    const res = await fetch(`${basePath}/bdsl/manifest.json`, { cache: "no-cache" });
    if (!res.ok) return null;
    return validateManifest(await res.json());
  } catch {
    return null;
  }
}

export function clipFor(manifest: BdslManifest | null, id: string): BdslClip | null {
  return manifest?.clips.find((c) => c.id === id) ?? null;
}
