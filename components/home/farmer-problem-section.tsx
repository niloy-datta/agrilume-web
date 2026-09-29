"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CloudRain, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { FARMER_PROBLEM_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function FarmerProblemSection() {
  const shouldReduceMotion = useReducedMotion();

  const getCueIcon = (category: string) => {
    switch (category) {
      case "WEATHER":
        return <CloudRain className="w-4 h-4 text-[#36BFFA]" />;
      case "TIMING":
        return <Clock className="w-4 h-4 text-[#D7A86E]" />;
      case "EVIDENCE":
        return <ShieldCheck className="w-4 h-4 text-[#59D98E]" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#94A3B8]" />;
    }
  };

  return (
    <section
      id="mission"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-gradient-to-b from-[#0B1220] via-[#0D1626] to-[#0B1220] border-t border-[#36BFFA]/10 overflow-hidden"
      aria-labelledby="farmer-decision-title"
    >
      {/* Background warm soil ambient glow */}
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-[#D7A86E]/4 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle terrain topography grid */}
      <div className="absolute inset-0 bg-telemetry-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Human Editorial Storytelling (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <Reveal delay={0.1} yOffset={16}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050A12]/80 border border-[#D7A86E]/25 mb-6 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E] animate-pulse" />
                <span className="text-[11px] font-mono tracking-[0.18em] text-[#D7A86E] uppercase">
                  {FARMER_PROBLEM_CONTENT.eyebrow}
                </span>
              </div>
            </Reveal>

            {/* Primary Headline */}
            <Reveal delay={0.2} yOffset={20}>
              <h2
                id="farmer-decision-title"
                className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08] max-w-2xl"
              >
                {FARMER_PROBLEM_CONTENT.headline}
              </h2>
            </Reveal>

            {/* Supporting Copy */}
            <Reveal delay={0.32} yOffset={18}>
              <p className="mt-5 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed max-w-xl">
                {FARMER_PROBLEM_CONTENT.supporting}
              </p>
            </Reveal>

            {/* THE HERO QUESTION */}
            <Reveal delay={0.45} yOffset={22}>
              <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-[#050A12]/80 border border-[#D7A86E]/30 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                {/* Accent glow corner */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#D7A86E]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#D7A86E] to-[#59D98E]" />

                <div className="flex items-center gap-2 text-xs font-mono text-[#D7A86E] tracking-wider uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E]" />
                  <span>The Fundamental Field Question</span>
                </div>

                <p className="text-2xl sm:text-3xl lg:text-4xl font-space font-semibold tracking-tight text-[#F8FAFC]">
                  {FARMER_PROBLEM_CONTENT.heroQuestion}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8]/80 font-mono">
                  Every season begins with timing uncertainty that ground inspection alone cannot resolve.
                </p>
              </div>
            </Reveal>

            {/* 3 Minimal Uncertainty Cues */}
            <div className="mt-10">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#94A3B8]/60 uppercase block mb-4">
                Three Unknowns Behind the Decision
              </span>

              <StaggerContainer
                staggerDelay={0.1}
                delayChildren={0.5}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {FARMER_PROBLEM_CONTENT.uncertaintyCues.map((cue) => (
                  <StaggerItem
                    key={cue.category}
                    yOffset={16}
                    className="p-4 rounded-xl bg-[#050A12]/50 border border-white/5 hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getCueIcon(cue.category)}
                      <span className="text-xs font-mono font-semibold tracking-wider text-[#F8FAFC]">
                        {cue.category}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-[#F8FAFC]/90">
                      {cue.question}
                    </div>
                    <div className="mt-1 text-xs text-[#94A3B8]/70 leading-relaxed">
                      {cue.detail}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* RIGHT: Cinematic Abstract Field Composition (Columns 8-12) */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-[#050A12] shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
              
              {/* Atmospheric Sky Layer */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0E2038] to-[#122824]" />

              {/* Faint cloud / weather haze */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: [-15, 15, -15],
                        opacity: [0.35, 0.55, 0.35],
                      }
                }
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-6 left-[-20%] w-[140%] h-[35%] bg-gradient-to-r from-transparent via-[#36BFFA]/12 to-transparent blur-2xl pointer-events-none"
              />

              {/* Ground Horizon & Crop Furrows SVG */}
              <svg
                viewBox="0 0 500 625"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Soil depth gradient */}
                  <linearGradient id="soilBase" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0B1820" />
                    <stop offset="40%" stopColor="#122524" />
                    <stop offset="80%" stopColor="#1B322B" />
                    <stop offset="100%" stopColor="#252D26" />
                  </linearGradient>

                  {/* Horizon glow line */}
                  <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D7A86E" stopOpacity="0" />
                    <stop offset="50%" stopColor="#D7A86E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#D7A86E" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizon line at Y = 250 */}
                <line x1="0" y1="250" x2="500" y2="250" stroke="url(#horizonGlow)" strokeWidth="1.5" />

                {/* Soil Plane (from Y = 250 to 625) */}
                <rect x="0" y="250" width="500" height="375" fill="url(#soilBase)" opacity="0.9" />

                {/* Topographic Contour Waves */}
                <path
                  d="M 0,310 Q 150,295 280,315 T 500,305"
                  fill="none"
                  stroke="#D7A86E"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
                <path
                  d="M 0,375 Q 180,360 320,380 T 500,365"
                  fill="none"
                  stroke="#59D98E"
                  strokeWidth="0.8"
                  opacity="0.25"
                />
                <path
                  d="M 0,445 Q 210,430 360,450 T 500,435"
                  fill="none"
                  stroke="#D7A86E"
                  strokeWidth="0.9"
                  opacity="0.28"
                />

                {/* Perspective Crop Rows converging to central horizon vanishing point (250, 250) */}
                <line x1="250" y1="250" x2="-20" y2="625" stroke="#59D98E" strokeWidth="1.6" opacity="0.35" />
                <line x1="250" y1="250" x2="60" y2="625" stroke="#D7A86E" strokeWidth="1.4" opacity="0.4" />
                <line x1="250" y1="250" x2="140" y2="625" stroke="#59D98E" strokeWidth="1.5" opacity="0.35" />
                <line x1="250" y1="250" x2="210" y2="625" stroke="#D7A86E" strokeWidth="1.5" opacity="0.45" />
                <line x1="250" y1="250" x2="290" y2="625" stroke="#D7A86E" strokeWidth="1.5" opacity="0.45" />
                <line x1="250" y1="250" x2="360" y2="625" stroke="#59D98E" strokeWidth="1.5" opacity="0.35" />
                <line x1="250" y1="250" x2="440" y2="625" stroke="#D7A86E" strokeWidth="1.4" opacity="0.4" />
                <line x1="250" y1="250" x2="520" y2="625" stroke="#59D98E" strokeWidth="1.6" opacity="0.35" />

                {/* Farmer Vantage Point Marker at foreground center (250, 480) */}
                <g transform="translate(250, 480)">
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#D7A86E" strokeWidth="1" className="animate-beacon-pulse" />
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#D7A86E" strokeWidth="1.2" opacity="0.7" />
                  <circle cx="0" cy="0" r="3.5" fill="#D7A86E" className="drop-shadow-[0_0_8px_#D7A86E]" />
                </g>
              </svg>

              {/* Vantage point callout tag */}
              <div className="absolute bottom-6 inset-x-6 bg-[#050A12]/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7A86E]">
                    FIELD VANTAGE POINT
                  </span>
                  <span className="text-xs font-mono text-[#F8FAFC]">
                    Rajshahi Alluvial Basin • Dry Season Onset
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#94A3B8] bg-white/5 px-2 py-1 rounded border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E]" />
                  <span>GROUND VIEW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
