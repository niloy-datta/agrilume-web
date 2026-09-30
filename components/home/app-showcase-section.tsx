"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Satellite,
  Home,
  Camera,
  Sparkles,
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  CheckCircle2,
  Layers,
  ArrowRight,
  Zap,
  Mic,
  Volume2,
  Globe2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "../motion/reveal";

interface FloatingCallout {
  title: string;
  desc: string;
  badge: string;
  side: "left" | "right";
  topOffset: string;
  accent: string;
}

interface AppScreen {
  id: string;
  label: string;
  shortLabel: string;
  sub: string;
  tag: string;
  lang: string;
  icon: React.ReactNode;
  accent: string;
  glowColor: string;
  image: string;
  description: string;
  headline: string;
  callouts: FloatingCallout[];
}

const APP_SCREENS: AppScreen[] = [
  {
    id: "field-ndvi",
    label: "Satellite NDVI & Field Health",
    shortLabel: "Satellite NDVI",
    sub: "Mapbox multispectral vegetation index & localized alert",
    tag: "কিশোরগঞ্জ • জমি ১ (১.২৫ একর)",
    lang: "বাংলা / English",
    icon: <Satellite className="w-4 h-4 text-[#59D98E]" />,
    accent: "#59D98E",
    glowColor: "rgba(89,217,142,0.35)",
    image: "/images/app/app-field-ndvi.png",
    headline: "HEALTH MAPPING BEFORE SYMPTOMS APPEAR",
    description: "Multispectral Sentinel-2 & Landsat NDVI indices map vegetative vigor across 100m field cells — instantly flagging stressed zones (72% score) before visible leaf yellowing occurs.",
    callouts: [
      {
        title: "Multi-Spectral Heatmap",
        desc: "Precision Sentinel NDVI 100m grid",
        badge: "🛰️ Sentinel-2",
        side: "left",
        topOffset: "18%",
        accent: "#59D98E",
      },
      {
        title: "Localized Alert",
        desc: "“এই অংশে স্বাস্থ্য কম” — Early detection",
        badge: "⚠️ Zoned Risk",
        side: "right",
        topOffset: "32%",
        accent: "#F59E0B",
      },
    ],
  },
  {
    id: "diagnosis-result",
    label: "AI Pathogen Diagnostics",
    shortLabel: "Disease Diagnosis",
    sub: "Rice blast identification with 92% accuracy",
    tag: "Magnaporthe oryzae (High Risk)",
    lang: "English",
    icon: <Sparkles className="w-4 h-4 text-[#36BFFA]" />,
    accent: "#36BFFA",
    glowColor: "rgba(54,191,250,0.35)",
    image: "/images/app/app-diagnosis-result.png",
    headline: "INSTANT IN-FIELD COMPUTER VISION DIAGNOSIS",
    description: "Deep convolutional models identify fungal pathogens with 92% verified confidence, providing immediate risk grading and comparative vector match against Brown Spot and Leaf Smut.",
    callouts: [
      {
        title: "92% AI Accuracy",
        desc: "Magnaporthe oryzae (Rice Blast)",
        badge: "🔬 High Precision",
        side: "left",
        topOffset: "22%",
        accent: "#36BFFA",
      },
      {
        title: "Instant Rx Regimen",
        desc: "Tricyclazole / Isoprothiolane treatment",
        badge: "💊 Actionable Rx",
        side: "right",
        topOffset: "44%",
        accent: "#59D98E",
      },
    ],
  },
  {
    id: "treatment-plan",
    label: "IRRI 7-Day Treatment Plan",
    shortLabel: "7-Day Care Plan",
    sub: "Stage-by-stage agronomic actions certified by IRRI",
    tag: "IRRI বিশ্ব গবেষণা ভিত্তিতে",
    lang: "বাংলা",
    icon: <ClipboardList className="w-4 h-4 text-[#59D98E]" />,
    accent: "#59D98E",
    glowColor: "rgba(89,217,142,0.35)",
    image: "/images/app/app-treatment-plan.png",
    headline: "EVIDENCE-BACKED RECOVERY PROTOCOL",
    description: "Every advice card is backed by International Rice Research Institute (IRRI) crop pathology standards — preventing toxic over-fertilization and prescribing timed fungicide cycles.",
    callouts: [
      {
        title: "🔊 “শুনুন” ভয়েস রিড-আউট",
        desc: "পড়তে না পারা কৃষকদের মুখে বাংলায় চিকিৎসা পড়ে শোনায়",
        badge: "অডিও অ্যাসিস্ট্যান্ট",
        side: "right",
        topOffset: "12%",
        accent: "#59D98E",
      },
      {
        title: "IRRI Research Backed",
        desc: "Certified agronomic scientific solutions",
        badge: "🏛️ IRRI Verified",
        side: "left",
        topOffset: "25%",
        accent: "#59D98E",
      },
      {
        title: "Immediate Action",
        desc: "অতিরিক্ত নাইট্রোজেন সার আপাতত বন্ধ রাখুন",
        badge: "🛑 Step 1 Action",
        side: "right",
        topOffset: "40%",
        accent: "#EF4444",
      },
    ],
  },
  {
    id: "market-price",
    label: "Market Price Intelligence",
    shortLabel: "Market Rates",
    sub: "Live wholesale mandi rates & 7-day trend forecasts",
    tag: "৳ 2,430 / maund (+12%)",
    lang: "English / বাংলা",
    icon: <TrendingUp className="w-4 h-4 text-[#D7A86E]" />,
    accent: "#D7A86E",
    glowColor: "rgba(215,168,110,0.35)",
    image: "/images/app/app-market-price.png",
    headline: "SMALLHOLDER SELLING POWER & LIVE MANDI RATES",
    description: "Tracks Kishoreganj, Mymensingh, and Dhaka wholesale market prices with weather-aware harvest timing — recommending whether to sell 30% today or hold for peak profits.",
    callouts: [
      {
        title: "Live Price: ৳ 2,430",
        desc: "Up +12% from last week in Kishoreganj",
        badge: "📈 Strong Demand",
        side: "left",
        topOffset: "20%",
        accent: "#59D98E",
      },
      {
        title: "Weather-Smart Advisory",
        desc: "Rain forecast warning before transport",
        badge: "🌦️ Logistics AI",
        side: "right",
        topOffset: "46%",
        accent: "#D7A86E",
      },
    ],
  },
  {
    id: "home-dashboard",
    label: "Farm Intelligence Dashboard",
    shortLabel: "Farm Overview",
    sub: "Real-time field telemetry, weather & condition",
    tag: "North Field • Boro Rice • 2.5 acres",
    lang: "English",
    icon: <Home className="w-4 h-4 text-[#36BFFA]" />,
    accent: "#36BFFA",
    glowColor: "rgba(54,191,250,0.35)",
    image: "/images/app/app-home-dashboard.png",
    headline: "INTEGRATED CROP HEALTH TELEMETRY",
    description: "At-a-glance field radar combining 28°C local microclimate temperature, 72% humidity, satellite polygon tracking, and rapid disease scan shortcuts.",
    callouts: [
      {
        title: "Microclimate Telemetry",
        desc: "28°C • 72% Humidity • Field Condition",
        badge: "🌤️ Micro-Weather",
        side: "left",
        topOffset: "22%",
        accent: "#36BFFA",
      },
      {
        title: "Polygon Field Boundaries",
        desc: "Interactive satellite parcel tracking",
        badge: "📍 Georeferenced",
        side: "right",
        topOffset: "40%",
        accent: "#59D98E",
      },
    ],
  },
  {
    id: "scan-bangla",
    label: "In-Field AI Disease Scanner",
    shortLabel: "Crop Scanner",
    sub: "Live computer vision camera with auto-focus guidance",
    tag: "AI বিশ্লেষণ চলছে...",
    lang: "বাংলা",
    icon: <Camera className="w-4 h-4 text-[#59D98E]" />,
    accent: "#59D98E",
    glowColor: "rgba(89,217,142,0.35)",
    image: "/images/app/app-scan-bangla.png",
    headline: "ON-DEVICE RETICLE GUIDANCE FOR ACCURATE SHOTS",
    description: "Coaches farmers in real-time — verifying illumination quality, focal distance, and target positioning before committing to neural network inference.",
    callouts: [
      {
        title: "Intelligent Guidance",
        desc: "“পাতার দাগটি ফ্রেমের মধ্যে রাখুন”",
        badge: "🎯 Smart Reticle",
        side: "left",
        topOffset: "18%",
        accent: "#59D98E",
      },
      {
        title: "Lighting Quality Check",
        desc: "“✓ ছবি পরিষ্কার • আলো ভালো” verified",
        badge: "⚡ Real-time Quality",
        side: "right",
        topOffset: "42%",
        accent: "#36BFFA",
      },
    ],
  },
];

export function AppShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = APP_SCREENS[activeIndex];
  const prevIndex = (activeIndex - 1 + APP_SCREENS.length) % APP_SCREENS.length;
  const nextIndex = (activeIndex + 1) % APP_SCREENS.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + APP_SCREENS.length) % APP_SCREENS.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % APP_SCREENS.length);
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="app"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#040810] border-t border-white/5 overflow-hidden"
      aria-labelledby="app-showcase-title"
    >
      {/* Dynamic Ambient Neon Aura (Super vivid & eye-catching) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[550px] sm:h-[650px] rounded-full blur-[160px] sm:blur-[220px] pointer-events-none transition-all duration-700 opacity-70"
        style={{
          background: `radial-gradient(circle, ${active.accent}33 0%, ${active.accent}15 45%, transparent 70%)`,
        }}
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 05 Index & Live Demo Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]/70">
            <span className="text-[#36BFFA] font-bold">05</span>
            <span className="text-white/80 font-medium">App Showcase</span>
            <span>•</span>
            <span className="text-[#59D98E]">NASA Space Apps 2026</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#59D98E] animate-pulse" />
            <span>Dual-Language • বাংলা & English</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-4xl mb-12">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="app-showcase-title"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F8FAFC] leading-[1.06]"
            >
              THE INTELLIGENCE STAYS COMPLEX. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#59D98E] via-[#36BFFA] to-[#6EE7B7]">
                THE EXPERIENCE STAYS SIMPLE.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base sm:text-lg text-[#CBD5E1] font-normal leading-relaxed max-w-2xl">
              From satellite multispectral NDVI to in-field camera diagnostics and IRRI recovery schedules — built to give farmers immediate certainty.
            </p>
          </Reveal>
        </div>

        {/* VOICE-FIRST & GLOBAL LANGUAGE ACCESSIBILITY HIGHLIGHT BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Reveal delay={0.25} yOffset={14}>
            <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0B1E2E]/80 to-[#071322]/80 backdrop-blur-md border border-[#36BFFA]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-12 rounded-xl bg-[#36BFFA]/15 border border-[#36BFFA]/40 flex items-center justify-center shrink-0">
                <Mic className="w-6 h-6 text-[#36BFFA] animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">ভয়েস কন্ট্রোল ও অডিও প্লেব্যাক (Voice-First)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#36BFFA]/20 border border-[#36BFFA]/40 text-[#36BFFA] font-bold">
                    জিরো-লিটারেসি ব্যারিয়ার
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1.5 leading-relaxed font-light">
                  পড়তে না পারা প্রান্তিক কৃষকদের জন্য প্রতিটি পেজে <strong className="text-[#59D98E]">“🔊 শুনুন / Listen”</strong> অডিও বাটন ও ভয়েস কন্ট্রোল যুক্ত। মুখে বাংলায় প্রশ্ন করলে অ্যাপ কথ্য আঞ্চলিক ভাষায় সরাসরি উত্তর ও চিকিৎসা বলে দেয়।
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3} yOffset={14}>
            <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0B2018]/80 to-[#061410]/80 backdrop-blur-md border border-[#59D98E]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-12 rounded-xl bg-[#59D98E]/15 border border-[#59D98E]/40 flex items-center justify-center shrink-0">
                <Globe2 className="w-6 h-6 text-[#59D98E]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">বিশ্বের ১০০+ ভাষা ও আঞ্চলিক উপভাষা (Global & Dialect)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#59D98E]/20 border border-[#59D98E]/40 text-[#59D98E] font-bold">
                    100+ Languages
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1.5 leading-relaxed font-light">
                  কিশোরগঞ্জ, ময়মনসিংহ, সিলেট বা চট্টগ্রামের গ্রামীণ উপভাষা থেকে শুরু করে ইংরেজি, হিন্দি, স্প্যানিশসহ বিশ্বের প্রধান সকল ভাষায় স্বয়ংক্রিয় রিয়েল-টাইম অনুবাদ ও কথ্য স্পিচ ইঞ্জিন।
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* HORIZONTAL GLASS SEGMENTED CONTROLS (Top Navigation for easy clicking) */}
        <div className="mb-12 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B1528]/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-max">
            {APP_SCREENS.map((s, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[#1E293B] to-[#0F1E2E] text-white border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                  style={{
                    borderColor: isSelected ? `${s.accent}80` : undefined,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      background: isSelected ? `${s.accent}20` : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <span>{s.shortLabel}</span>
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: s.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN HERO SHOWCASE STAGE */}
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-14 bg-gradient-to-b from-[#0B1528]/50 via-[#070D18]/80 to-[#03060C] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Subtle Stage Backlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: `${active.accent}18` }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* LEFT COLUMN: Active Screen Deep-Dive Explanation */}
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 w-fit"
                style={{
                  borderColor: `${active.accent}40`,
                  backgroundColor: `${active.accent}10`,
                  color: active.accent,
                }}
              >
                {active.icon}
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                  {active.tag}
                </span>
              </div>

              <h3 className="font-space font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {active.headline}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-light">
                {active.description}
              </p>

              {/* Feature Highlights Grid */}
              <div className="mt-8 space-y-3">
                {active.callouts.map((c) => (
                  <div
                    key={c.title}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: c.accent }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{c.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                          {c.badge}
                        </span>
                      </div>
                      <div className="text-xs text-[#94A3B8] mt-0.5 font-light">
                        {c.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Fullscreen Inspect & Next Screen */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold tracking-wide transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Full Resolution</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveIndex(nextIndex)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#59D98E] hover:bg-[#6ef0a4] text-[#050A12] text-xs font-bold tracking-wide transition-all hover:scale-[1.02] cursor-pointer shadow-[0_0_20px_rgba(89,217,142,0.3)]"
                >
                  <span>Next Screen</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: BIG HIGH-IMPACT PHONE SHOWCASE */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2">
              
              <div className="relative w-full flex items-center justify-center py-4">
                
                {/* PREVIOUS PHONE (Tilted Left, Clickable) */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(prevIndex)}
                  className="absolute left-[-2%] sm:left-[2%] lg:left-[5%] w-[190px] sm:w-[240px] aspect-[576/1024] rounded-[36px] overflow-hidden border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] -rotate-6 scale-90 z-10 hidden md:block opacity-45 hover:opacity-85 transition-all duration-500 cursor-pointer hover:scale-95 group"
                  title={`Switch to ${APP_SCREENS[prevIndex].label}`}
                >
                  <Image
                    src={APP_SCREENS[prevIndex].image}
                    alt={APP_SCREENS[prevIndex].label}
                    fill
                    sizes="240px"
                    className="object-cover object-center group-hover:brightness-110 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
                  <div className="absolute bottom-4 inset-x-3 text-center">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white/90">
                      ← {APP_SCREENS[prevIndex].shortLabel}
                    </span>
                  </div>
                </button>

                {/* NEXT PHONE (Tilted Right, Clickable) */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(nextIndex)}
                  className="absolute right-[-2%] sm:right-[2%] lg:right-[5%] w-[190px] sm:w-[240px] aspect-[576/1024] rounded-[36px] overflow-hidden border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rotate-6 scale-90 z-10 hidden md:block opacity-45 hover:opacity-85 transition-all duration-500 cursor-pointer hover:scale-95 group"
                  title={`Switch to ${APP_SCREENS[nextIndex].label}`}
                >
                  <Image
                    src={APP_SCREENS[nextIndex].image}
                    alt={APP_SCREENS[nextIndex].label}
                    fill
                    sizes="240px"
                    className="object-cover object-center group-hover:brightness-110 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
                  <div className="absolute bottom-4 inset-x-3 text-center">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white/90">
                      {APP_SCREENS[nextIndex].shortLabel} →
                    </span>
                  </div>
                </button>

                {/* CENTER HERO PHONE (LARGE, CLEAR, SUPER READABLE!) */}
                <div
                  onClick={() => setLightboxOpen(true)}
                  className="relative w-[280px] sm:w-[340px] lg:w-[380px] aspect-[576/1024] rounded-[48px] p-2 bg-gradient-to-b from-[#2A374A] via-[#15202E] to-[#080E18] border-2 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-20 cursor-pointer transition-all duration-500 group hover:scale-[1.01]"
                  style={{
                    borderColor: `${active.accent}90`,
                    boxShadow: `0 30px 90px rgba(0,0,0,0.95), 0 0 55px ${active.glowColor}`,
                  }}
                >
                  {/* Phone Bezel Inner Housing */}
                  <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black shadow-inner">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={active.image}
                          alt={active.label}
                          fill
                          priority
                          sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                          className="object-cover object-center"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Hover Magnify Overlay Banner */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white text-xs font-semibold shadow-xl">
                        <Maximize2 className="w-3.5 h-3.5 text-[#59D98E]" />
                        <span>Click to View Full Size</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOATING GLASS CALLOUT BADGES (Eye-catching visual anchor) */}
                {active.callouts.map((c) => (
                  <motion.div
                    key={c.title + active.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className={`absolute z-30 hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0B1528]/95 backdrop-blur-xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.7)] pointer-events-none ${
                      c.side === "left"
                        ? "left-[2%] -translate-x-2"
                        : "right-[2%] translate-x-2"
                    }`}
                    style={{
                      top: c.topOffset,
                      borderColor: `${c.accent}50`,
                      boxShadow: `0 15px 40px rgba(0,0,0,0.7), 0 0 25px ${c.accent}20`,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full animate-ping"
                      style={{ backgroundColor: c.accent }}
                    />
                    <div>
                      <div className="text-[11px] font-bold text-white tracking-tight">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        {c.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Prev / Next Chevrons on Mobile & Quick Selector */}
              <div className="mt-6 flex items-center justify-between w-full max-w-sm px-4">
                <button
                  type="button"
                  onClick={() => setActiveIndex(prevIndex)}
                  className="flex items-center gap-1 text-xs font-mono text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {APP_SCREENS.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? "w-7 bg-[#59D98E]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Jump to ${s.label}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIndex(nextIndex)}
                  className="flex items-center gap-1 text-xs font-mono text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM THUMBNAIL STRIP (Instant Hop between all 6 screens with clear preview) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {APP_SCREENS.map((s, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#0B1528] border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                    : "bg-[#0B1220]/50 border-white/5 hover:border-white/15 hover:bg-[#0B1220]/80"
                }`}
                style={{
                  borderColor: isSelected ? `${s.accent}80` : undefined,
                  boxShadow: isSelected ? `0 0 25px ${s.accent}20` : undefined,
                }}
              >
                {/* Thumbnail Mini */}
                <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                  <Image
                    src={s.image}
                    alt={s.label}
                    fill
                    sizes="40px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {s.shortLabel}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                    {s.lang}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL (Click to inspect every single pixel in HD!) */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[480px] w-full max-h-[92vh] flex flex-col items-center"
            >
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between pb-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#59D98E]">
                    {active.shortLabel}
                  </span>
                  <span className="text-xs text-[#94A3B8]">• {active.tag}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Image Frame */}
              <div className="relative w-full aspect-[576/1024] max-h-[82vh] rounded-[42px] overflow-hidden border-2 border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-black">
                <Image
                  src={active.image}
                  alt={active.label}
                  fill
                  priority
                  sizes="480px"
                  className="object-contain object-center"
                />
              </div>

              {/* Modal Bottom Switcher */}
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => setActiveIndex(prevIndex)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#94A3B8]">
                  {activeIndex + 1} / {APP_SCREENS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveIndex(nextIndex)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
