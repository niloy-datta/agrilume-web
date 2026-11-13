"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import type { Lang } from "@/lib/timetravel/types";
import type { AssistantReply } from "@/lib/timetravel/assistant";
import { SUGGESTIONS } from "@/lib/timetravel/assistant";
import { GESTURES } from "@/lib/timetravel/gestures";
import type { GestureId } from "@/lib/timetravel/gestures";
import { ACCESS_PHRASES, clipFor } from "@/lib/timetravel/bdsl";
import type { BdslManifest } from "@/lib/timetravel/bdsl";
import type { SpeechSupport } from "@/lib/timetravel/voice";
import type { GestureStatus } from "../hooks/useGestureCamera";
import { Btn, Chip, ExtLink, Notice, Section, tt } from "./primitives";

export interface ChatMsg {
  id: number;
  who: "me" | "bot";
  text: string;
  sources?: AssistantReply["sources"];
  kind?: AssistantReply["kind"];
  viaVoice?: boolean;
}

export function AssistantPanel({
  lang,
  messages,
  onAsk,
  listening,
  interim,
  onMic,
  support,
  speakOn,
  onSpeakToggle,
  voiceNote,
}: {
  lang: Lang;
  messages: ChatMsg[];
  onAsk: (text: string) => void;
  listening: boolean;
  interim: string;
  onMic: () => void;
  support: SpeechSupport;
  speakOn: boolean;
  onSpeakToggle: () => void;
  voiceNote: string | null;
}) {
  const [text, setText] = useState("");
  const askId = useId();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAsk(text.trim());
    setText("");
  };
  return (
    <div className="flex h-full min-h-[380px] flex-col">
      <Notice>
        {tt(
          lang,
          "আমি একটি অফলাইন নিয়মভিত্তিক সহকারী (বড় ভাষা-মডেল নই)। কমান্ড বুঝি ও জানা প্রশ্নের উত্তর দিই; না জানলে অনুমান করি না।",
          "I am an offline rule-based assistant (not a large language model). I follow commands and answer known questions; when I do not know, I do not guess.",
        )}
      </Notice>
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1" role="log" aria-live="polite" aria-label={tt(lang, "কথোপকথন", "Conversation")}>
        {messages.length === 0 && (
          <p className="text-sm text-muted-text">{tt(lang, "নিচের উদাহরণ চেপে দেখুন, বা মাইকে বলুন।", "Tap an example below, or speak into the mic.")}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.who === "me" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.who === "me" ? "bg-earth-cyan/20 text-primary-text" : m.kind === "safety" ? "border border-red-400/60 bg-red-500/10 text-primary-text" : "border border-white/10 bg-white/5 text-primary-text"}`}>
              {m.viaVoice && <span aria-hidden className="mr-1">🎤</span>}
              {m.text}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-text">
                  <span>{tt(lang, "উৎস", "Sources")}:</span>
                  {m.sources.map((s) => (s.url ? <ExtLink key={s.label} href={s.url}>{s.label}</ExtLink> : <span key={s.label}>{s.label}</span>))}
                </div>
              )}
            </div>
          </div>
        ))}
        {listening && (
          <div className="text-sm text-agri-green" role="status">
            🎤 {tt(lang, "শুনছি…", "Listening…")} {interim && <em className="text-primary-text">{interim}</em>}
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <Chip key={s.en} onClick={() => onAsk(lang === "bn" ? s.bn : s.en)}>
            {lang === "bn" ? s.bn : s.en}
          </Chip>
        ))}
      </div>

      {voiceNote && (
        <p className="mt-2 text-xs text-warning" role="status">
          {voiceNote}
        </p>
      )}
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor={askId}>
          {tt(lang, "প্রশ্ন বা কমান্ড", "Question or command")}
        </label>
        <input
          id={askId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tt(lang, "যেমন: ২০৫০ সালে যাও", "e.g. go to 2050")}
          className="min-h-[44px] min-w-0 flex-1 rounded-lg border border-white/15 bg-surface px-3 text-sm text-primary-text placeholder:text-muted-text"
          autoComplete="off"
        />
        <Btn variant="primary" onClick={() => submit({ preventDefault() {} } as React.FormEvent)} ariaLabel={tt(lang, "পাঠান", "Send")}>
          ➤
        </Btn>
        <Btn onClick={onMic} pressed={listening} disabled={!support.stt} title={support.stt ? undefined : tt(lang, "এই ব্রাউজারে ভয়েস শোনা নেই", "Voice listening unavailable in this browser")} ariaLabel={tt(lang, "মাইক", "Microphone")} className={listening ? "!border-agri-green !bg-agri-green/20" : ""}>
          🎤
        </Btn>
      </form>
      <label className="mt-2 flex min-h-[40px] items-center gap-2 text-xs text-muted-text">
        <input type="checkbox" checked={speakOn} onChange={onSpeakToggle} disabled={!support.tts} className="h-4 w-4 accent-[#59d98e]" />
        {tt(lang, "উত্তর জোরে পড়ে শোনান (ব্রাউজারে ভয়েস থাকলে)", "Read answers aloud (if the browser has a voice)")}
      </label>
    </div>
  );
}

export function AccessPanel({
  lang,
  gestureStatus,
  gestureNow,
  gestureProgress,
  onGestureStart,
  onGestureStop,
  videoRef,
  manifest,
  largeText,
  onLargeText,
  vibrateOn,
  onVibrate,
  lastGesture,
  basePath,
  onBack,
}: {
  basePath: string;
  lang: Lang;
  gestureStatus: GestureStatus;
  gestureNow: GestureId | null;
  gestureProgress: number;
  onGestureStart: () => void;
  onGestureStop: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  manifest: BdslManifest | null;
  largeText: boolean;
  onLargeText: (v: boolean) => void;
  vibrateOn: boolean;
  onVibrate: (v: boolean) => void;
  lastGesture: GestureId | null;
  onBack: () => void;
}) {
  const statusText: Record<GestureStatus, [string, string]> = {
    off: ["ক্যামেরা বন্ধ", "Camera off"],
    starting: ["চালু হচ্ছে…", "Starting…"],
    running: ["জেসচার শনাক্ত হচ্ছে", "Recognising gestures"],
    denied: ["ক্যামেরার অনুমতি দেওয়া হয়নি", "Camera permission was not granted"],
    unsupported: ["এই ব্রাউজারে ক্যামেরা নেই", "No camera support in this browser"],
    error: ["ক্যামেরা বা মডেল চালু করা যায়নি", "Could not start the camera or model"],
  };
  const st = statusText[gestureStatus];
  const hasClips = !!manifest && manifest.clips.length > 0;
  return (
    <div>
      <Btn onClick={onBack} className="mb-3">
        ← {tt(lang, "মাঠে ফিরে যান", "Back to field")}
      </Btn>
      <Notice tone="warn">
        {tt(
          lang,
          "গুরুত্বপূর্ণ: এটি হাতের জেসচার দিয়ে সিমুলেটর নিয়ন্ত্রণ — বাংলা ইশারা ভাষা (BdSL) অনুবাদ বা বোঝা নয়। BdSL একটি পূর্ণাঙ্গ ভাষা; নির্ভরযোগ্য অনুবাদের জন্য বধির সম্প্রদায় ও স্বীকৃত দোভাষীর সঙ্গে তৈরি ডেটা ও যাচাই দরকার।",
          "Important: this is hand-gesture CONTROL of the simulator — not Bangla Sign Language (BdSL) translation or understanding. BdSL is a full language; reliable translation needs data built with the Deaf community and certified interpreters.",
        )}
      </Notice>

      <Section title={tt(lang, "হাতের জেসচার (ক্যামেরা)", "Hand gestures (camera)")} hint={tt(lang, "ছবি আপনার ব্রাউজারেই প্রসেস হয়; কোথাও পাঠানো বা সংরক্ষণ হয় না। গেজচার ০.৫ সেকেন্ডের মতো ধরে রাখুন।", "Frames are processed in your browser only; never sent or stored. Hold a gesture for about half a second.")}>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <video
            ref={videoRef}
            data-gesture-camera-preview
            className={`aspect-[4/3] w-full -scale-x-100 object-cover ${gestureStatus === "starting" || gestureStatus === "running" ? "" : "hidden"}`}
            playsInline
            muted
            aria-label={tt(lang, "ক্যামেরা প্রিভিউ", "Camera preview")}
          />
          {gestureStatus !== "starting" && gestureStatus !== "running" && (
            <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-text">📷 {lang === "bn" ? st[0] : st[1]}</div>
          )}
          {gestureStatus === "running" && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-sm text-primary-text" role="status" aria-live="polite">
              <span className="text-2xl" aria-hidden>
                {gestureNow ? GESTURES.find((g) => g.id === gestureNow)?.icon : "…"}
              </span>
              <div className="flex-1">
                <div>{gestureNow ? (lang === "bn" ? GESTURES.find((g) => g.id === gestureNow)?.does.bn : GESTURES.find((g) => g.id === gestureNow)?.does.en) : tt(lang, "হাত দেখান", "Show your hand")}</div>
                <div className="mt-1 h-1.5 w-full rounded bg-white/15">
                  <div className="h-full rounded bg-agri-green" style={{ width: `${gestureProgress * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {gestureStatus === "running" || gestureStatus === "starting" ? (
            <Btn onClick={onGestureStop}>{tt(lang, "ক্যামেরা বন্ধ করুন", "Stop camera")}</Btn>
          ) : (
            <Btn variant="primary" onClick={onGestureStart}>
              {tt(lang, "ক্যামেরা চালু করুন", "Start camera")}
            </Btn>
          )}
          <span className="self-center text-xs text-muted-text" role="status">
            {lang === "bn" ? st[0] : st[1]}
            {lastGesture && ` · ${GESTURES.find((g) => g.id === lastGesture)?.icon}`}
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {GESTURES.map((g) => (
            <li key={g.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className="text-2xl" aria-hidden>
                {g.icon}
              </span>
              <span>
                <span className="block text-primary-text">{lang === "bn" ? g.does.bn : g.does.en}</span>
                <span className="block text-xs text-muted-text">{lang === "bn" ? g.name.bn : g.name.en}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={tt(lang, "দৃশ্য ও কম্পন সতর্কতা", "Visual & haptic alerts")} hint={tt(lang, "প্রতিটি উত্তর ও সতর্কতা পর্দার নিচে বড় ক্যাপশন, চিহ্ন ও লেখায় দেখানো হয় — শুধু শব্দ বা রঙে নয়।", "Every answer and alert is shown as a large caption with a pictogram and text — never by sound or colour alone.")}>
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-primary-text">
          <input type="checkbox" checked={largeText} onChange={(e) => onLargeText(e.target.checked)} className="h-5 w-5 accent-[#59d98e]" />
          {tt(lang, "বড় ক্যাপশন", "Large captions")}
        </label>
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-primary-text">
          <input type="checkbox" checked={vibrateOn} onChange={(e) => onVibrate(e.target.checked)} className="h-5 w-5 accent-[#59d98e]" />
          {tt(lang, "ফোন কাঁপিয়ে জানান (সমর্থিত হলে)", "Vibrate the phone on alerts (if supported)")}
        </label>
      </Section>

      <Section title={tt(lang, "বাংলা ইশারা ভাষা (BdSL) ভিডিও", "Bangla Sign Language (BdSL) videos")}>
        {hasClips ? (
          <ul className="space-y-3">
            {ACCESS_PHRASES.map((p) => {
              const clip = clipFor(manifest, p.id);
              return (
                <li key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-primary-text">
                    <span aria-hidden>{p.icon} </span>
                    {lang === "bn" ? p.text.bn : p.text.en}
                  </p>
                  {clip ? (
                    <>
                      <video controls preload="none" poster={clip.poster ? `${basePath}/bdsl/${clip.poster}` : undefined} className="mt-2 w-full rounded-lg" src={`${basePath}/bdsl/${clip.src}`} aria-label={clip.captionBn} />
                      <p className="mt-1 text-xs text-muted-text">
                        {clip.credit} · {clip.verifiedBy}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-muted-text">{tt(lang, "এই বাক্যের BdSL ভিডিও এখনো যোগ হয়নি।", "No BdSL video for this phrase yet.")}</p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <Notice>
              {tt(
                lang,
                "এখনো কোনো যাচাইকৃত BdSL ভিডিও যোগ করা হয়নি, তাই আমরা ভুয়া/স্বয়ংক্রিয় অনুবাদ দেখাই না। নিচের গুরুত্বপূর্ণ বাক্যগুলো BdSL দোভাষীকে দিয়ে রেকর্ড করানোর জন্য প্রস্তুত (public/bdsl/README.md দেখুন)। ততদিন ক্যাপশন, চিহ্ন ও কম্পন ব্যবহার হচ্ছে।",
                "No verified BdSL videos have been added yet, so we do not show fake or automatic translation. The key phrases below are ready to hand to a BdSL interpreter (see public/bdsl/README.md). Until then, captions, pictograms and vibration are used.",
              )}
            </Notice>
            <ul className="space-y-1.5">
              {ACCESS_PHRASES.map((p) => (
                <li key={p.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-primary-text">
                  <span aria-hidden>{p.icon} </span>
                  {lang === "bn" ? p.text.bn : p.text.en}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </div>
  );
}
