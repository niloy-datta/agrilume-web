"use client";

import React from "react";
import type { Command } from "@/lib/timetravel/commands";
import type { PanelId, TTState, View } from "@/lib/timetravel/engine";
import { MAX_YEAR, seasonLength } from "@/lib/timetravel/engine";
import { HAZARDS } from "@/lib/timetravel/hazards";
import { STAGE_LABEL } from "@/lib/timetravel/crops";
import { MONTHS_BN, MONTHS_EN } from "@/lib/timetravel/climate";
import { asciiToBnDigits } from "@/lib/timetravel/locations";
import type { Lang } from "@/lib/timetravel/types";
import { Btn, KindBadge, tt } from "./primitives";

export const TABS: { id: PanelId; icon: string; bn: string; en: string }[] = [
  { id: "place", icon: "📍", bn: "স্থান", en: "Place" },
  { id: "crop", icon: "🌾", bn: "ফসল", en: "Crop" },
  { id: "hazard", icon: "⛈️", bn: "দুর্যোগ", en: "Hazards" },
  { id: "recycle", icon: "♻️", bn: "পুনর্ব্যবহার", en: "Recycling" },
  { id: "data", icon: "🛰️", bn: "NASA ডেটা", en: "NASA data" },
  { id: "gov", icon: "🏛️", bn: "সরকারি", en: "Government" },
  { id: "assistant", icon: "🤖", bn: "AI সহকারী", en: "AI assistant" },
  { id: "access", icon: "🤟", bn: "সহজলভ্যতা", en: "Access" },
];

export const nd = (lang: Lang, n: number | string) => (lang === "bn" ? asciiToBnDigits(String(n)) : String(n));

function dateInputValue(date: Pick<View["date"], "year" | "m0" | "d">): string {
  return `${date.year}-${String(date.m0 + 1).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
}

function dateInputParts(value: string): { year: number; doy: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const selected = Date.UTC(year, month - 1, day);
  const check = new Date(selected);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return { year, doy: Math.floor((selected - Date.UTC(year, 0, 1)) / 86_400_000) + 1 };
}

function DigitalClock({ lang }: { lang: Lang }) {
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  const dateTime = now === null ? null : new Date(now);
  const dateParts = dateTime === null ? null : new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Dhaka",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).formatToParts(dateTime);
  const date = dateParts === null
    ? "-- -- ----"
    : ["day", "month", "year"]
        .map((type) => dateParts.find((part) => part.type === type)?.value ?? "")
        .join("-");
  const time = dateTime === null
    ? "--:--:--"
    : new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).format(dateTime);

  return (
    <div
      className="mr-1 flex flex-col items-end rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] leading-tight text-muted-text sm:mr-2"
      aria-label={tt(lang, "বাংলাদেশের বর্তমান তারিখ ও সময়", "Current Bangladesh date and time")}
      title={tt(lang, "বাংলাদেশ সময় · Asia/Dhaka", "Bangladesh time · Asia/Dhaka")}
    >
      <time className="font-mono text-xs font-semibold tabular-nums text-primary-text sm:text-sm" dateTime={now === null ? undefined : new Date(now).toISOString()}>
        {date} · {time}
      </time>
      <span>{tt(lang, "বাংলাদেশ সময়", "Dhaka time")}</span>
    </div>
  );
}

export function TopBar({
  state,
  view,
  basePath,
  dispatch,
  vrSupported,
  onVR,
  onCardboard,
  onAssistant,
  onMic,
  listening,
  speakOn,
  onSpeakToggle,
  speechOutputSupported,
  onHelp,
  quality,
  onQuality,
}: {
  state: TTState;
  view: View;
  basePath: string;
  dispatch: (c: Command) => void;
  vrSupported: boolean;
  onVR: () => void;
  onCardboard: () => void;
  onAssistant: () => void;
  onMic: () => void;
  listening: boolean;
  speakOn: boolean;
  onSpeakToggle: () => void;
  speechOutputSupported: boolean;
  onHelp: () => void;
  quality: "auto" | "low" | "high";
  onQuality: () => void;
}) {
  const lang = state.lang;
  return (
    <header className="pointer-events-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-white/10 bg-space/85 px-3 py-2 backdrop-blur">
      <a href={`${basePath}/`} className="rounded-md px-2 py-2 text-sm font-semibold text-muted-text hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan" aria-label={tt(lang, "অ্যাগ্রিলিউম হোমে ফিরুন", "Back to AgriLume home")}>
        ← AgriLume
      </a>
      <h1 className="font-space text-base font-bold text-primary-text sm:text-lg">
        {tt(lang, "টাইম ট্রাভেল", "Time Travel")}
        <span className="ml-2 hidden text-sm font-normal text-muted-text md:inline">
          {lang === "bn" ? view.placeName.bn : view.placeName.en} · {nd(lang, state.year)}
        </span>
      </h1>
      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <DigitalClock lang={lang} />
        <Btn onClick={onVR} disabled={!vrSupported} title={vrSupported ? undefined : tt(lang, "এই ডিভাইসে WebXR VR নেই — মোবাইলে কার্ডবোর্ড মোড ব্যবহার করুন", "WebXR VR not available on this device — try Cardboard mode on a phone")} ariaLabel={tt(lang, "VR-এ প্রবেশ", "Enter VR")}>
          🥽 <span className="hidden sm:inline">{tt(lang, "VR-এ প্রবেশ", "Enter VR")}</span>
        </Btn>
        <Btn onClick={onCardboard} ariaLabel={tt(lang, "কার্ডবোর্ড মোড", "Cardboard mode")} title={tt(lang, "ফোন + কার্ডবোর্ড ভিউয়ার", "Phone + Cardboard viewer")}>
          📱 <span className="hidden sm:inline">{tt(lang, "কার্ডবোর্ড", "Cardboard")}</span>
        </Btn>
        <Btn onClick={onAssistant} ariaLabel={tt(lang, "AI সহকারী খুলুন", "Open AI assistant")} title={tt(lang, "কৃষি সহায়ক", "Farming assistant")}>
          🤖 <span className="hidden sm:inline">AI</span>
        </Btn>
        <Btn onClick={onMic} pressed={listening} ariaLabel={tt(lang, "ভয়েস কমান্ড", "Voice command")} className={listening ? "!border-agri-green !bg-agri-green/20" : ""}>
          🎤
        </Btn>
        <Btn
          onClick={onSpeakToggle}
          pressed={speakOn}
          disabled={!speechOutputSupported}
          ariaLabel={speakOn ? tt(lang, "ভয়েস উত্তর বন্ধ করুন", "Turn voice answers off") : tt(lang, "ভয়েস উত্তর চালু করুন", "Turn voice answers on")}
          title={speechOutputSupported ? tt(lang, "উত্তর পড়ে শোনান", "Speak assistant answers") : tt(lang, "এই ব্রাউজারে কণ্ঠ পাওয়া যায়নি", "Speech output is unavailable in this browser")}
        >
          {speakOn ? "🔊" : "🔈"}
        </Btn>
        <Btn onClick={() => dispatch({ type: "setLang", lang: lang === "bn" ? "en" : "bn" })} ariaLabel={tt(lang, "Switch to English", "বাংলায় বদলান")}>
          {lang === "bn" ? "EN" : "বাং"}
        </Btn>
        <Btn onClick={onQuality} title={tt(lang, "গ্রাফিক্স মান", "Graphics quality")} ariaLabel={tt(lang, "গ্রাফিক্স মান", "Graphics quality")}>
          ⚙ {quality === "auto" ? "Auto" : quality === "low" ? "Low" : "High"}
        </Btn>
        <Btn onClick={onHelp} ariaLabel={tt(lang, "সাহায্য ও শর্টকাট", "Help and shortcuts")}>
          ?
        </Btn>
      </div>
    </header>
  );
}

export function HonestyRibbon({ view, lang }: { view: View; lang: Lang }) {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-2 border-b border-white/10 bg-space/80 px-3 py-1.5 text-xs text-muted-text backdrop-blur" role="note">
      <KindBadge kind={view.dataKind} lang={lang} />
      <span>{tt(lang, "সিমুলেশন", "Simulation")}</span>
    </div>
  );
}

export function StatusCard({ state, view }: { state: TTState; view: View }) {
  const lang = state.lang;
  const months = lang === "bn" ? MONTHS_BN : MONTHS_EN;
  const d = view.date;
  const stage = STAGE_LABEL[view.stage];
  return (
    <div className="pointer-events-auto rounded-xl border border-white/10 bg-space/80 p-3 text-sm backdrop-blur" aria-live="polite">
      <div className="font-space text-base font-semibold text-primary-text">
        {nd(lang, d.d)} {months[d.m0]} {nd(lang, d.year)}
      </div>
      <div className="mt-0.5 text-muted-text">
        {lang === "bn" ? stage.bn : stage.en} · {tt(lang, "দিন", "day")} {nd(lang, state.day)}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-muted-text">{tt(lang, "আপেক্ষিক ফলন সূচক", "Relative yield index")}</span>
        <span className="font-space text-xl font-bold tabular-nums text-agri-green">{nd(lang, view.index.toFixed(0))}</span>
      </div>
    </div>
  );
}

export function TimeBar({
  state,
  view,
  minYear,
  dispatch,
  speed,
  onSpeed,
}: {
  state: TTState;
  view: View;
  minYear: number;
  dispatch: (c: Command) => void;
  speed: number;
  onSpeed: () => void;
}) {
  const lang = state.lang;
  const total = seasonLength(view);
  const obsEnd = Math.min(view.lastObservedYear, MAX_YEAR);
  const pctObs = ((obsEnd - minYear) / (MAX_YEAR - minYear)) * 100;
  const dateMin = dateInputValue({ year: minYear, m0: 0, d: 1 });
  const dateMax = dateInputValue({ year: MAX_YEAR, m0: 11, d: 31 });
  const calendarDays = (Date.UTC(state.year + 1, 0, 1) - Date.UTC(state.year, 0, 1)) / 86_400_000;
  const sowingUtc = Date.UTC(state.year, 0, state.sowDoy);
  const dayMin = 1 - state.sowDoy;
  const dayMax = Math.min(
    Math.floor((Date.UTC(MAX_YEAR, 11, 31) - sowingUtc) / 86_400_000),
    Math.max(total, calendarDays - state.sowDoy),
  );
  const dateValue = dateInputValue(view.date);
  return (
    <div className="pointer-events-auto border-t border-white/10 bg-space/90 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <label className="flex items-center justify-between gap-3 text-xs text-muted-text">
          <span>{tt(lang, "তারিখ বাছুন", "Choose date")}</span>
          <input
            type="date"
            value={dateValue}
            min={dateMin}
            max={dateMax}
            aria-label={tt(lang, "ক্যালেন্ডারের তারিখ", "Calendar date")}
            onChange={(event) => {
              const selected = dateInputParts(event.target.value);
              if (!selected) return;
              dispatch({ type: "setCalendarDate", year: selected.year, doy: selected.doy });
            }}
            className="min-h-[36px] rounded-md border border-white/15 bg-surface px-2 text-sm text-primary-text [color-scheme:dark]"
          />
        </label>
        <div className="flex items-center gap-2">
          <Btn onClick={() => dispatch({ type: "addYears", delta: -1 })} ariaLabel={tt(lang, "১ বছর পিছনে", "Back 1 year")}>
            −
          </Btn>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between text-xs text-muted-text">
              <span>{nd(lang, minYear)}</span>
              <span className="font-space text-base font-bold text-primary-text">
                {nd(lang, state.year)} <span className="text-xs font-normal text-muted-text">{state.year > view.lastObservedYear ? tt(lang, "· ধরে-নিই / প্রক্ষেপণ", "· what-if / projection") : tt(lang, "· পর্যবেক্ষিত", "· observed")}</span>
              </span>
              <span>{nd(lang, MAX_YEAR)}</span>
            </div>
            <input
              type="range"
              min={minYear}
              max={MAX_YEAR}
              step={1}
              value={Math.max(minYear, state.year)}
              onChange={(e) => dispatch({ type: "setYear", year: Number(e.target.value) })}
              aria-label={tt(lang, "সাল", "Year")}
              aria-valuetext={`${state.year} ${state.year > view.lastObservedYear ? "what-if" : "observed"}`}
              className="h-3 w-full cursor-pointer appearance-none rounded-full accent-[#36bffa]"
              style={{ background: `linear-gradient(to right, #1f7a4a 0%, #1f7a4a ${pctObs}%, #8a6a1e ${pctObs}%, #8a6a1e 100%)` }}
            />
            <div className="relative h-4 text-[10px] text-muted-text">
              <span className="absolute left-0">▲ {tt(lang, "NASA পর্যবেক্ষিত", "NASA observed")}</span>
              <span className="absolute right-0">{tt(lang, "ধরে-নিই / প্রক্ষেপণ", "what-if / projection")} ▲</span>
            </div>
          </div>
          <Btn onClick={() => dispatch({ type: "addYears", delta: 1 })} ariaLabel={tt(lang, "১ বছর সামনে", "Forward 1 year")}>
            +
          </Btn>
        </div>
        <div className="flex items-center gap-2">
          <Btn
            variant="primary"
            onClick={() => {
              if (!state.playing && state.day >= total) dispatch({ type: "setDay", day: 0 });
              dispatch({ type: "togglePlay" });
            }}
            ariaLabel={state.playing ? tt(lang, "থামান", "Pause") : tt(lang, "চালান", "Play")}
            pressed={state.playing}
            className="w-12"
          >
            {state.playing ? "❚❚" : "▶"}
          </Btn>
          <Btn onClick={onSpeed} ariaLabel={tt(lang, "গতি", "Speed")} className="w-14">
            {speed}×
          </Btn>
          <div className="min-w-0 flex-1">
            <input
              type="range"
              min={dayMin}
              max={dayMax}
              step={1}
              value={state.day}
              onChange={(e) => dispatch({ type: "setDay", day: Number(e.target.value) })}
              aria-label={tt(lang, "বপনের পর দিন", "Days after sowing")}
              aria-valuetext={`${tt(lang, "দিন", "day")} ${state.day}: ${lang === "bn" ? STAGE_LABEL[view.stage].bn : STAGE_LABEL[view.stage].en}`}
              className="h-3 w-full cursor-pointer accent-[#59d98e]"
            />
            <div className="flex justify-between text-[10px] text-muted-text">
              <span>{tt(lang, "বছরের শুরু", "start of year")}</span>
              <span>{tt(lang, "বপন → কর্তন", "sowing → harvest")}</span>
              <span>{tt(lang, "বছরের শেষ", "end of year")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Large, high-contrast caption of the last assistant reply / gesture / alert (always on; sound is never the only channel). */
export function CaptionBar({ text, large, onClose, icon }: { text: string; large: boolean; onClose: () => void; icon?: string }) {
  if (!text) return null;
  return (
    <div className="pointer-events-auto mx-auto max-w-3xl rounded-xl border border-white/20 bg-black/85 px-4 py-3 text-primary-text shadow-xl backdrop-blur" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="text-2xl" aria-hidden>
            {icon}
          </span>
        )}
        <p className={`flex-1 leading-snug ${large ? "text-xl font-semibold" : "text-sm"}`}>{text}</p>
        <button type="button" onClick={onClose} aria-label="Close caption" className="min-h-[36px] min-w-[36px] rounded-md text-muted-text hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          ✕
        </button>
      </div>
    </div>
  );
}

export function HazardBanner({ state, activeTypes }: { state: TTState; activeTypes: string[] }) {
  const lang = state.lang;
  if (activeTypes.length === 0) return null;
  return (
    <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-xl border-2 border-dashed border-warning bg-black/80 px-4 py-2 text-warning" role="status">
      <span className="text-2xl" aria-hidden>
        {activeTypes.map((t) => HAZARDS[t as keyof typeof HAZARDS]?.icon).join(" ")}
      </span>
      <p className="text-sm font-semibold">
        {tt(lang, "সিমুলেশন", "Simulation")}: {activeTypes.map((t) => (lang === "bn" ? HAZARDS[t as keyof typeof HAZARDS]?.name.bn : HAZARDS[t as keyof typeof HAZARDS]?.name.en)).join(", ")}
      </p>
    </div>
  );
}
