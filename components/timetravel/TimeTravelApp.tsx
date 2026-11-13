"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { applyCommand } from "@/lib/timetravel/commands";
import { activeHazards, computeView, initialState, MAX_YEAR, sceneParams, seasonLength } from "@/lib/timetravel/engine";
import type { TTState } from "@/lib/timetravel/engine";
import { getDistrict } from "@/lib/timetravel/locations";
import { loadBundledDistrict, loadPowerMonthly, rajshahiFixture, standInSeries } from "@/lib/timetravel/power";
import { loadProjectionPack } from "@/lib/timetravel/projection-pack";
import type { ProjectionPack } from "@/lib/timetravel/projection-pack";
import type { ClimateSeries, Lang } from "@/lib/timetravel/types";
import { respond } from "@/lib/timetravel/assistant";
import type { AssistantReply } from "@/lib/timetravel/assistant";
import { commandForGesture, GESTURES } from "@/lib/timetravel/gestures";
import type { GestureId } from "@/lib/timetravel/gestures";
import { loadBdslManifest } from "@/lib/timetravel/bdsl";
import type { BdslManifest } from "@/lib/timetravel/bdsl";
import { listenOnce, listErrorText, speak, speechSupport, stopSpeaking, vibrate } from "@/lib/timetravel/voice";
import type { Listener, SpeechSupport } from "@/lib/timetravel/voice";
import { useGestureCamera } from "./hooks/useGestureCamera";
import { useLatest } from "./hooks/useLatest";
import { requestMotionPermission } from "./scene/CameraRigs";
import type { XRStoreT } from "./scene/FieldScene";
import { AccessPanel, AssistantPanel } from "./ui/assist-panels";
import type { ChatMsg } from "./ui/assist-panels";
import { CaptionBar, HazardBanner, HonestyRibbon, StatusCard, TABS, TimeBar, TopBar } from "./ui/chrome";
import { DataRegistry, GovDirectory, RecycleCalculator } from "./ui/info-panels";
import { Btn, tt } from "./ui/primitives";
import { CropPanel, HazardPanel, PlacePanel } from "./ui/sim-panels";
import type { DataStatus } from "./ui/sim-panels";
import { Fallback2D } from "./ui/Fallback2D";

const FieldScene = dynamic(() => import("./scene/FieldScene").then((m) => m.FieldScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-text" role="status">
      Loading 3D…
    </div>
  ),
});

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const NO_SPEECH: SpeechSupport = { stt: false, tts: false };
const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA || "local-build";

type QualityPref = "auto" | "low" | "high";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectLang(text: string, fallback: Lang): Lang {
  if (/[ঀ-৿]/.test(text)) return "bn";
  if (/\b(the|is|what|how|go|show|to|please|year|flood|drought|yield|weather)\b/i.test(text)) return "en";
  return fallback;
}

interface Loaded {
  id: string;
  series: ClimateSeries;
  status: DataStatus;
}

function useClimate(districtId: string) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [packState, setPackState] = useState<{ id: string; pack: ProjectionPack | null } | null>(null);
  const isRaj = districtId === "rajshahi";
  const base = useMemo(() => {
    const d = getDistrict(districtId);
    return isRaj ? rajshahiFixture() : standInSeries(d?.nameEn ?? districtId);
  }, [districtId, isRaj]);

  useEffect(() => {
    const d = getDistrict(districtId);
    if (!d) return;
    let cancelled = false;
    // 1) build-time NASA POWER file for this district, 2) live NASA POWER API, 3) labelled stand-in.
    loadBundledDistrict(districtId, BASE_PATH)
      .then(async (b) => (b.ok ? { r: b, bundled: true } : { r: await loadPowerMonthly(d.nameEn, d.lat, d.lon), bundled: false }))
      .then(({ r, bundled }) => {
        if (cancelled) return;
        if (r.ok) {
          setLoaded({
            id: districtId,
            series: r.series,
            status: bundled ? "bundled" : r.series.provenance.origin === "nasa-power-cache" ? "cache" : "live",
          });
        } else if (!isRaj) {
          setLoaded({ id: districtId, series: standInSeries(d.nameEn), status: "stand-in" });
        }
      });
    void loadProjectionPack(districtId, BASE_PATH).then((p) => {
      if (!cancelled) setPackState({ id: districtId, pack: p });
    });
    return () => {
      cancelled = true;
    };
  }, [districtId, isRaj]);

  const mine = loaded && loaded.id === districtId ? loaded : null;
  const series = mine ? mine.series : base;
  const status: DataStatus = mine ? mine.status : isRaj ? "bundled" : "loading";
  const pack = packState && packState.id === districtId ? packState.pack : null;
  return { series, status, pack };
}

// Capabilities are read once on the client; the server snapshot is null so hydration never mismatches.
interface Caps {
  webgl: boolean;
  speech: SpeechSupport;
  lowEnd: boolean;
}
let capsCache: Caps | null = null;
function getCaps(): Caps | null {
  if (typeof window === "undefined") return null;
  if (!capsCache) {
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
    capsCache = { webgl: webglAvailable(), speech: speechSupport(), lowEnd: coarse || cores <= 4 || mem <= 4 };
  }
  return capsCache;
}
const noopSubscribe = () => () => {};
const useCaps = () => useSyncExternalStore(noopSubscribe, getCaps, () => null);

/** A boolean persisted in localStorage (falls back to in-memory behaviour if storage is blocked). */
function useStoredFlag(key: string): [boolean, (v: boolean) => void] {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    window.addEventListener(`tt-flag:${key}`, cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener(`tt-flag:${key}`, cb);
    };
  }, [key]);
  const get = useCallback(() => {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }, [key]);
  const value = useSyncExternalStore(subscribe, get, () => false);
  const set = useCallback(
    (v: boolean) => {
      try {
        localStorage.setItem(key, v ? "1" : "0");
      } catch {
        /* storage blocked: preference lasts only until reload */
      }
      window.dispatchEvent(new Event(`tt-flag:${key}`));
    },
    [key],
  );
  return [value, set];
}

export default function TimeTravelApp({ initialDistrict }: { initialDistrict?: string }) {
  const [state, dispatch] = useReducer(applyCommand, undefined, () => {
    const s = initialState();
    return initialDistrict && getDistrict(initialDistrict) ? { ...s, districtId: initialDistrict } : s;
  });
  const stateRef = useLatest<TTState>(state);

  // On phones start with the 3D field fully visible; the tab strip opens panels on demand.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 767px)").matches) dispatch({ type: "openPanel", panel: "none" });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const lang = state.lang;
  const { series, status, pack } = useClimate(state.districtId);

  // never show a year before the loaded record begins
  useEffect(() => {
    if (state.year < series.startYear) dispatch({ type: "setYear", year: series.startYear });
  }, [series.startYear, state.year]);

  const view = useMemo(() => computeView(state, series, pack), [state, series, pack]);
  const params = useMemo(() => sceneParams(view), [view]);
  const total = seasonLength(view);
  const hazardsNow = useMemo(() => activeHazards(state), [state]);

  /* ----------------------------- device / mode state ----------------------------- */
  const caps = useCaps();
  const webgl = caps ? caps.webgl : null;
  const support: SpeechSupport = caps ? caps.speech : NO_SPEECH;
  const [vrSupported, setVrSupported] = useState(false);
  const [store, setStore] = useState<XRStoreT | null>(null);
  const [mode, setMode] = useState<"flat" | "cardboard">("flat");
  const [qualityPref, setQualityPref] = useState<QualityPref>("auto");
  const [help, setHelp] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [largeText, setLargeTextPersist] = useStoredFlag("tt.largeText");
  const [vibrateOn, setVibrateOn] = useState(true);
  const [speakOn, setSpeakOn] = useState(false);
  const [manifest, setManifest] = useState<BdslManifest | null>(null);

  useEffect(() => {
    const xr = (navigator as unknown as { xr?: { isSessionSupported: (m: string) => Promise<boolean> } }).xr;
    xr?.isSessionSupported("immersive-vr").then(setVrSupported).catch(() => setVrSupported(false));
    void import("./scene/xr-store").then((m) => setStore(m.createStore()));
    void loadBdslManifest(BASE_PATH).then(setManifest);
  }, []);

  const autoQuality: "low" | "high" = caps?.lowEnd ? "low" : "high";
  const quality: "low" | "high" = qualityPref === "auto" ? autoQuality : qualityPref;

  /* --------------------------------- captions --------------------------------- */
  const [caption, setCaption] = useState<{ text: string; icon?: string } | null>(null);
  const captionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showCaption = useCallback((text: string, icon?: string, ms = 9000) => {
    setCaption({ text, icon });
    if (captionTimer.current) clearTimeout(captionTimer.current);
    captionTimer.current = setTimeout(() => setCaption(null), ms);
  }, []);

  /* ------------------------------ assistant & voice ------------------------------ */
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const msgId = useRef(1);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const listener = useRef<Listener | null>(null);
  const viewRef = useLatest(view);

  const ask = useCallback(
    (text: string, viaVoice = false) => {
      const v = viewRef.current;
      const replyLang = detectLang(text, stateRef.current.lang);
      const reply: AssistantReply = respond(text, v, replyLang);
      setMessages((m) => [
        ...m,
        { id: msgId.current++, who: "me", text, viaVoice },
        { id: msgId.current++, who: "bot", text: reply.text, sources: reply.sources, kind: reply.kind },
      ]);
      for (const c of reply.commands) dispatch(c);
      if (reply.openPanel && !reply.commands.some((c) => c.type === "openPanel" || c.type === "setPathway")) dispatch({ type: "openPanel", panel: reply.openPanel });
      showCaption(reply.text, reply.kind === "safety" ? "🚨" : reply.kind === "fallback" ? "❔" : "💬", reply.kind === "safety" ? 20000 : 10000);
      if (reply.kind === "safety" && vibrateOn) vibrate([300, 120, 300, 120, 300]);
      if (speakOn) {
        const ok = speak(reply.text, replyLang);
        setVoiceNote(ok ? null : replyLang === "bn" ? "এই ডিভাইসে বাংলা কণ্ঠ নেই; উত্তর শুধু লেখায় দেখানো হয়েছে।" : "No English voice on this device; the answer is shown as text only.");
      }
    },
    [showCaption, speakOn, vibrateOn, stateRef, viewRef],
  );

  const onMic = useCallback(() => {
    if (listening) {
      listener.current?.stop();
      return;
    }
    stopSpeaking();
    dispatch({ type: "openPanel", panel: "assistant" });
    setVoiceNote(null);
    setInterim("");
    setListening(true);
    listener.current = listenOnce(stateRef.current.lang, {
      onInterim: setInterim,
      onFinal: (t) => {
        setInterim("");
        if (t) ask(t, true);
      },
      onError: (e) => {
        setVoiceNote(listErrorText(e, stateRef.current.lang));
        setListening(false);
      },
      onEnd: () => {
        setListening(false);
        setInterim("");
      },
    });
    if (!listener.current) setListening(false);
  }, [ask, listening, stateRef]);

  const toggleSpeech = useCallback(() => {
    if (speakOn) stopSpeaking();
    setSpeakOn(!speakOn);
  }, [speakOn]);

  /* --------------------------------- gestures --------------------------------- */
  const [lastGesture, setLastGesture] = useState<GestureId | null>(null);
  const onGesture = useCallback(
    (g: GestureId) => {
      setLastGesture(g);
      const cmd = commandForGesture(g, stateRef.current.lang);
      const info = GESTURES.find((x) => x.id === g)!;
      if (cmd.type === "assistant") dispatch({ type: "openPanel", panel: "assistant" });
      else {
        if (cmd.type === "play" && stateRef.current.day >= total) dispatch({ type: "setDay", day: 0 });
        dispatch(cmd);
      }
      showCaption(`${info.icon} ${stateRef.current.lang === "bn" ? info.does.bn : info.does.en}`, info.icon, 3500);
      if (vibrateOn) vibrate(60);
    },
    [showCaption, total, vibrateOn, stateRef],
  );
  const gesture = useGestureCamera(BASE_PATH, onGesture);

  /* ------------------------------ playback & keys ------------------------------ */
  useEffect(() => {
    if (!state.playing) return;
    const id = setInterval(() => dispatch({ type: "addDays", delta: 1 }), Math.round(1000 / (8 * speed)));
    return () => clearInterval(id);
  }, [state.playing, speed]);
  useEffect(() => {
    if (state.playing && state.day >= total) dispatch({ type: "pause" });
  }, [state.day, state.playing, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const step = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case " ":
          e.preventDefault();
          dispatch({ type: "togglePlay" });
          break;
        case "ArrowRight":
          dispatch({ type: "addDays", delta: step });
          break;
        case "ArrowLeft":
          dispatch({ type: "addDays", delta: -step });
          break;
        case "ArrowUp":
          e.preventDefault();
          dispatch({ type: "addYears", delta: step });
          break;
        case "ArrowDown":
          e.preventDefault();
          dispatch({ type: "addYears", delta: -step });
          break;
        case "1": dispatch({ type: "setCrop", crop: "aman" }); break;
        case "2": dispatch({ type: "setCrop", crop: "boro" }); break;
        case "3": dispatch({ type: "setCrop", crop: "aus" }); break;
        case "4": dispatch({ type: "setCrop", crop: "wheat" }); break;
        case "5": dispatch({ type: "setCrop", crop: "maize" }); break;
        case "l":
        case "L":
          dispatch({ type: "setLang", lang: stateRef.current.lang === "bn" ? "en" : "bn" });
          break;
        case "m":
        case "M":
          onMic();
          break;
        case "?":
          setHelp(true);
          break;
        case "Escape":
          setHelp(false);
          dispatch({ type: "openPanel", panel: "none" });
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMic, stateRef]);

  // hazard banner side effects: haptic + caption when a new educational scene begins
  const hazardKey = hazardsNow.join(",");
  const prevHazard = useRef("");
  useEffect(() => {
    if (hazardKey && hazardKey !== prevHazard.current && vibrateOn) vibrate([120, 80, 120]);
    prevHazard.current = hazardKey;
  }, [hazardKey, vibrateOn]);

  /* ------------------------------- VR / Cardboard ------------------------------- */
  const enterVR = useCallback(async () => {
    if (!store) return;
    try {
      await store.enterVR();
    } catch {
      showCaption(tt(lang, "VR চালু করা যায়নি।", "Could not start VR."), "🥽");
    }
  }, [store, lang, showCaption]);
  const exitVR = useCallback(() => {
    void store?.getState().session?.end();
  }, [store]);
  const enterCardboard = useCallback(async () => {
    await requestMotionPermission();
    try {
      await document.documentElement.requestFullscreen?.();
      const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      await o.lock?.("landscape");
    } catch {
      /* fullscreen/orientation lock are optional */
    }
    dispatch({ type: "setCamera", camera: "walk" });
    setMode("cardboard");
  }, []);
  const exitCardboard = useCallback(() => {
    setMode("flat");
    try {
      if (document.fullscreenElement) void document.exitFullscreen();
      (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
    } catch {
      /* ignore */
    }
  }, []);

  /* ------------------------------------ panels ------------------------------------ */
  const panel = (() => {
    switch (state.panel) {
      case "place":
        return <PlacePanel state={state} view={view} series={series} dataStatus={status} dispatch={dispatch} packLoaded={!!pack?.years[String(state.year)]} />;
      case "crop":
        return <CropPanel state={state} view={view} base={view.baselineYear} dispatch={dispatch} />;
      case "hazard":
        return <HazardPanel state={state} dispatch={dispatch} />;
      case "recycle":
        return (
          <RecycleCalculator
            key={state.cropId}
            lang={lang}
            crop={state.cropId}
            onPickPathway={(id) => dispatch({ type: "setPathway", id })}
            activePathway={state.pathway}
            irrigationMm={view.sim.totals.irrigationMm}
          />
        );
      case "data":
        return <DataRegistry lang={lang} />;
      case "gov":
        return <GovDirectory lang={lang} />;
      case "assistant":
        return (
          <AssistantPanel
            lang={lang}
            messages={messages}
            onAsk={(t) => ask(t)}
            listening={listening}
            interim={interim}
            onMic={onMic}
            support={support}
            speakOn={speakOn}
            onSpeakToggle={toggleSpeech}
            voiceNote={voiceNote}
          />
        );
      case "access":
        return (
          <AccessPanel
            lang={lang}
            basePath={BASE_PATH}
            gestureStatus={gesture.status}
            gestureNow={gesture.current}
            gestureProgress={gesture.progress}
            onGestureStart={gesture.start}
            onGestureStop={gesture.stop}
            videoRef={gesture.videoRef}
            manifest={manifest}
            largeText={largeText}
            onLargeText={setLargeTextPersist}
            vibrateOn={vibrateOn}
            onVibrate={setVibrateOn}
            lastGesture={lastGesture}
            onBack={() => dispatch({ type: "openPanel", panel: "none" })}
          />
        );
      default:
        return null;
    }
  })();

  const tabLabel = (t: (typeof TABS)[number]) => (lang === "bn" ? t.bn : t.en);
  const openTab = (id: TTState["panel"]) => dispatch({ type: "openPanel", panel: state.panel === id ? "none" : id });
  const panelTitle = TABS.find((t) => t.id === state.panel);

  /* ---------------------------------- cardboard ---------------------------------- */
  if (mode === "cardboard" && store && webgl) {
    return (
      <div className="fixed inset-0 bg-black" style={{ height: "100dvh" }}>
        <FieldScene state={state} view={view} params={params} dispatch={dispatch} store={store} quality={quality} mode="cardboard" onExitVR={exitCardboard} />
        <button type="button" onClick={exitCardboard} className="absolute left-1/2 top-2 z-10 min-h-[44px] -translate-x-1/2 rounded-full bg-black/70 px-4 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          ✕ {tt(lang, "কার্ডবোর্ড মোড থেকে বের হোন", "Exit Cardboard mode")}
        </button>
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {tt(lang, "নিচে তাকালে মেনু খোলে · বোতামে ১.৪ সেকেন্ড তাকিয়ে থাকুন", "Look down for the menu · gaze 1.4 s at a button")}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-space text-primary-text" style={{ height: "100dvh" }}>
      <div className="relative z-30">
        <TopBar
          state={state}
          view={view}
          basePath={BASE_PATH}
          dispatch={dispatch}
          vrSupported={vrSupported && !!store && !!webgl}
          onVR={enterVR}
          onCardboard={enterCardboard}
          onAssistant={() => dispatch({ type: "openPanel", panel: "assistant" })}
          onMic={onMic}
          listening={listening}
          speakOn={speakOn}
          onSpeakToggle={toggleSpeech}
          speechOutputSupported={support.tts}
          onHelp={() => setHelp(true)}
          quality={qualityPref}
          onQuality={() => setQualityPref(qualityPref === "auto" ? "low" : qualityPref === "low" ? "high" : "auto")}
        />
        <HonestyRibbon view={view} lang={lang} />
      </div>

      <main className="relative min-h-0 flex-1" id="tt-main">
        <div className="absolute inset-0">
          {webgl === null ? null : webgl && store ? (
            <FieldScene state={state} view={view} params={params} dispatch={dispatch} store={store} quality={quality} mode="flat" onExitVR={exitVR} />
          ) : webgl === false ? (
            <Fallback2D state={state} view={view} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-text" role="status">
              {tt(lang, "লোড হচ্ছে…", "Loading…")}
            </div>
          )}
        </div>

        {/* overlays */}
        <div className="pointer-events-none absolute inset-0 flex">
          {/* desktop side panel */}
          <div className="hidden h-full md:flex">
            <nav className="pointer-events-auto flex h-full w-[76px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-white/10 bg-space/85 p-1.5 backdrop-blur" aria-label={tt(lang, "প্যানেল", "Panels")}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => openTab(t.id)}
                  aria-pressed={state.panel === t.id}
                  className={`flex min-h-[56px] flex-col items-center justify-center rounded-lg px-1 py-1.5 text-center text-[11px] leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan ${state.panel === t.id ? "bg-agri-green/20 text-agri-green" : "text-primary-text hover:bg-white/10"}`}
                >
                  <span className="text-xl" aria-hidden>
                    {t.icon}
                  </span>
                  {tabLabel(t)}
                </button>
              ))}
            </nav>
            {state.panel !== "none" && panel && (
              <section className="pointer-events-auto h-full w-[400px] overflow-y-auto border-r border-white/10 bg-space/90 p-4 backdrop-blur" aria-label={panelTitle ? tabLabel(panelTitle) : undefined}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-space text-lg font-bold text-primary-text">
                    <span aria-hidden>{panelTitle?.icon} </span>
                    {panelTitle ? tabLabel(panelTitle) : ""}
                  </h2>
                  <button type="button" onClick={() => dispatch({ type: "openPanel", panel: "none" })} aria-label={tt(lang, "প্যানেল বন্ধ", "Close panel")} className="min-h-[40px] min-w-[40px] rounded-md text-muted-text hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
                    ✕
                  </button>
                </div>
                {panel}
              </section>
            )}
          </div>

          <div className="ml-auto hidden p-3 md:block">
            <StatusCard state={state} view={view} />
          </div>
        </div>

        {/* mobile status */}
        <div className="pointer-events-none absolute right-2 top-2 md:hidden">
          <StatusCard state={state} view={view} />
        </div>

        {/* captions + alerts */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col gap-2 px-3 md:pl-[500px]">
          {series.provenance.standIn && (
            <div role="alert" className="pointer-events-auto rounded-lg border border-amber-400/70 bg-amber-950/90 px-3 py-2 text-sm text-amber-100 shadow-lg">
              <strong>⚠ {status === "loading" ? tt(lang, "লোড হচ্ছে…", "Loading…") : tt(lang, "বদলি তথ্য", "Stand-in data")}</strong>{" "}
              {status === "loading"
                ? tt(lang, "এই জেলার NASA POWER তথ্য আসা পর্যন্ত রাজশাহীর তথ্য দেখানো হচ্ছে — এটি এই জেলার নয়।", "Until this district's NASA POWER data arrives, Rajshahi's data is shown — it is NOT this district's.")
                : tt(lang, "এই জেলার তথ্য লোড করা যায়নি। রাজশাহীর আসল তথ্য দেখানো হচ্ছে — এটি এই জেলার নয়; ভবিষ্যৎ প্রক্ষেপণ বন্ধ।", "This district's data could not be loaded. Real Rajshahi data is shown — it is NOT this district's; projections are disabled.")}
            </div>
          )}
          <HazardBanner state={state} activeTypes={hazardsNow} />
          {caption && <CaptionBar text={caption.text} icon={caption.icon} large={largeText} onClose={() => setCaption(null)} />}
        </div>

        {/* mobile sheet */}
        {state.panel !== "none" && panel && (
          <section className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 max-h-[45%] overflow-y-auto rounded-t-2xl border-t border-white/15 bg-space/95 p-4 backdrop-blur md:hidden" aria-label={panelTitle ? tabLabel(panelTitle) : undefined}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-space text-base font-bold">
                <span aria-hidden>{panelTitle?.icon} </span>
                {panelTitle ? tabLabel(panelTitle) : ""}
              </h2>
              <button type="button" onClick={() => dispatch({ type: "openPanel", panel: "none" })} aria-label={tt(lang, "প্যানেল বন্ধ", "Close panel")} className="min-h-[44px] min-w-[44px] rounded-md text-muted-text">
                ✕
              </button>
            </div>
            {panel}
          </section>
        )}
      </main>

      <TimeBar state={state} view={view} minYear={Math.min(series.startYear, MAX_YEAR)} dispatch={dispatch} speed={speed} onSpeed={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)} />

      {/* mobile tab strip */}
      <nav className="flex gap-1 overflow-x-auto border-t border-white/10 bg-space px-2 py-1 md:hidden" aria-label={tt(lang, "প্যানেল", "Panels")}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => openTab(t.id)}
            aria-pressed={state.panel === t.id}
            className={`flex min-h-[48px] min-w-[64px] shrink-0 flex-col items-center justify-center rounded-lg px-2 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan ${state.panel === t.id ? "bg-agri-green/20 text-agri-green" : "text-primary-text"}`}
          >
            <span className="text-lg" aria-hidden>
              {t.icon}
            </span>
            {tabLabel(t)}
          </button>
        ))}
      </nav>

      {help && <HelpDialog lang={lang} onClose={() => setHelp(false)} />}
    </div>
  );
}

function HelpDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const keys: [string, string, string][] = [
    ["Space", "চালান / থামান", "Play / pause"],
    ["← →", "১ দিন (Shift = ১০)", "±1 day (Shift = 10)"],
    ["↑ ↓", "১ বছর (Shift = ১০)", "±1 year (Shift = 10)"],
    ["1–5", "আমন · বোরো · আউশ · গম · ভুট্টা", "Aman · Boro · Aus · Wheat · Maize"],
    ["L", "ভাষা", "Language"],
    ["M", "ভয়েস কমান্ড", "Voice command"],
    ["Esc", "প্যানেল/সাহায্য বন্ধ", "Close panel / help"],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="tt-help-title" onClick={onClose}>
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-surface p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 id="tt-help-title" className="font-space text-lg font-bold">
            {tt(lang, "সাহায্য, শর্টকাট ও তথ্যসূত্র", "Help, shortcuts & credits")}
          </h2>
          <button ref={ref} type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded-md text-muted-text hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan" aria-label="Close">
            ✕
          </button>
        </div>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {keys.map(([k, bn, en]) => (
              <tr key={k} className="border-b border-white/5">
                <td className="py-1.5 pr-3 font-mono text-agri-green">{k}</td>
                <td className="py-1.5 text-primary-text">{lang === "bn" ? bn : en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 space-y-2 text-xs leading-relaxed text-muted-text">
          <p>
            {tt(
              lang,
              "মাউস/টাচে ঘোরান। VR হেডসেটে ‘VR-এ প্রবেশ’, ফোনে ‘কার্ডবোর্ড’। সব কিছু বাটন, কিবোর্ড, ভয়েস বা হাতের জেসচারেও চালানো যায়।",
              "Drag with mouse or touch. Use 'Enter VR' on a headset, 'Cardboard' on a phone. Everything can also be done by buttons, keyboard, voice or hand gestures.",
            )}
          </p>
          <p>
            <strong className="text-primary-text">{tt(lang, "তথ্য", "Data")}:</strong> NASA POWER (NASA Langley Research Center). {tt(lang, "ফসল-মডেল শিক্ষামূলক; ফলন সূচক আপেক্ষিক।", "The crop model is educational; the yield index is relative.")}
          </p>
          <p>
            <strong className="text-primary-text">{tt(lang, "প্রযুক্তি", "Built with")}:</strong> Next.js, three.js, react-three-fiber, WebXR, MediaPipe Hands ({tt(lang, "নিজের সাইট থেকে", "self-hosted")}), Web Speech API.
          </p>
          <p>
            <strong className="text-primary-text">{tt(lang, "AI-এর ব্যবহার", "AI use")}:</strong>{" "}
            {tt(
              lang,
              "এই কোড AI সহায়তায় (Anthropic Claude) লেখা। অ্যাপের ভেতরের সহকারী কোনো বড় ভাষা-মডেল নয় — অফলাইন নিয়মভিত্তিক প্রোগ্রাম।",
              "This code was written with AI assistance (Anthropic Claude). The in-app assistant is not an LLM — it is an offline rule-based program.",
            )}
          </p>
          <p>
            <strong className="text-primary-text">Build:</strong> <code>{BUILD_SHA}</code>
          </p>
        </div>
        <div className="mt-4">
          <Btn variant="primary" onClick={onClose}>
            {tt(lang, "বুঝেছি", "Got it")}
          </Btn>
        </div>
      </div>
    </div>
  );
}
