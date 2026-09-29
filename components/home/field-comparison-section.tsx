"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Eye, Layers, ArrowLeftRight, Sparkles, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { FIELD_COMPARISON_CONTENT } from "@/lib/constants";
import { Reveal } from "../motion/reveal";

export function FieldComparisonSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<"farmer" | "agrilume">("farmer");
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Drag interaction handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const newPos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
      setSliderPos(Math.round(newPos));
    },
    [isDragging]
  );

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  // Keyboard navigation for accessible slider
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let step = 5;
    if (e.shiftKey) step = 10;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  return (
    <section
      id="science"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-[#36BFFA]/10 overflow-hidden select-none"
      aria-labelledby="comparison-heading"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#36BFFA]/4 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-[#59D98E]/4 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">03</span>
          <span>Same Field More Context</span>
          <span>•</span>
          <span>One field. Two perspectives.</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <Reveal delay={0.1} yOffset={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1220] border border-[#59D98E]/20 mb-6 shadow-[0_2px_12px_rgba(89,217,142,0.08)]">
              <Sparkles className="w-3.5 h-3.5 text-[#59D98E]" />
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#59D98E] uppercase">
                ONE FIELD • TWO PERSPECTIVES
              </span>
            </div>
          </Reveal>

          {/* Headline: SAME FIELD. MORE CONTEXT. */}
          <Reveal delay={0.2} yOffset={20}>
            <h2
              id="comparison-heading"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              SAME FIELD. <span className="text-[#59D98E]">MORE CONTEXT.</span>
            </h2>
          </Reveal>

          {/* Supporting Statement */}
          <Reveal delay={0.32} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              AgriLume combines what farmers already know with environmental evidence that can be difficult to see from the ground alone.
            </p>
          </Reveal>
        </div>

        {/* Mobile View Toggle Switch (Hidden on Desktop) */}
        <div className="md:hidden mt-10 flex justify-center">
          <div className="p-1 rounded-full bg-[#0B1220] border border-white/10 flex items-center gap-1 shadow-lg">
            <button
              type="button"
              onClick={() => setMobileActiveView("farmer")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                mobileActiveView === "farmer"
                  ? "bg-[#D7A86E] text-[#050A12] shadow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>FARMER VIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileActiveView("agrilume")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                mobileActiveView === "agrilume"
                  ? "bg-[#59D98E] text-[#050A12] shadow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AGRILUME VIEW</span>
            </button>
          </div>
        </div>

        {/* Interactive Comparison Stage Container */}
        <div className="mt-10 sm:mt-14 relative">
          {/* Header indicator bar above comparison */}
          <div className="hidden md:flex items-center justify-between px-4 pb-3 text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center gap-2 text-[#D7A86E]">
              <Eye className="w-4 h-4" />
              <span className="font-semibold uppercase tracking-wider">
                WHAT THE FARMER SEES
              </span>
              <span className="text-[10px] text-[#94A3B8]">• Ground-level observation</span>
            </div>

            <div className="flex items-center gap-2 text-[#59D98E]">
              <span className="text-[10px] text-[#94A3B8]">Earth observation & climate context •</span>
              <span className="font-semibold uppercase tracking-wider">
                WHAT AGRILUME SEES
              </span>
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* Interactive Split-Screen Wrapper */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-full h-[540px] sm:h-[600px] lg:h-[640px] rounded-2xl overflow-hidden border border-white/10 bg-[#050A12] shadow-[0_24px_64px_rgba(0,0,0,0.8)] cursor-ew-resize touch-none"
          >
            {/* 1. LAYER ONE: WHAT THE FARMER SEES (Base Layer - always rendered) */}
            <div className="absolute inset-0 w-full h-full bg-[#050A12]">
              <Image
                src="/images/agrilume-field-photo.jpg"
                alt="Pristine agricultural rice paddy field at golden hour"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-[#050A12]/40" />
              {/* Natural Field Sky & Horizon SVG */}
              <svg
                viewBox="0 0 1000 640"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="naturalSoil" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10232A" />
                    <stop offset="50%" stopColor="#17312C" />
                    <stop offset="100%" stopColor="#222B24" />
                  </linearGradient>
                  <linearGradient id="naturalHorizon" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D7A86E" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#D7A86E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#D7A86E" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Horizon Line at Y = 260 */}
                <line x1="0" y1="260" x2="1000" y2="260" stroke="url(#naturalHorizon)" strokeWidth="1.5" />

                {/* Soil Plane */}
                <rect x="0" y="260" width="1000" height="380" fill="url(#naturalSoil)" />

                {/* Organic Crop Furrows converging to horizon (500, 260) */}
                <g stroke="#D7A86E" strokeWidth="1.2" opacity="0.35">
                  <line x1="500" y1="260" x2="-100" y2="640" />
                  <line x1="500" y1="260" x2="80" y2="640" />
                  <line x1="500" y1="260" x2="240" y2="640" />
                  <line x1="500" y1="260" x2="380" y2="640" />
                  <line x1="500" y1="260" x2="500" y2="640" />
                  <line x1="500" y1="260" x2="620" y2="640" />
                  <line x1="500" y1="260" x2="760" y2="640" />
                  <line x1="500" y1="260" x2="920" y2="640" />
                  <line x1="500" y1="260" x2="1100" y2="640" />
                </g>

                {/* Vegetative green crop row highlights */}
                <g stroke="#59D98E" strokeWidth="1.4" opacity="0.3">
                  <line x1="500" y1="260" x2="160" y2="640" />
                  <line x1="500" y1="260" x2="310" y2="640" />
                  <line x1="500" y1="260" x2="440" y2="640" />
                  <line x1="500" y1="260" x2="560" y2="640" />
                  <line x1="500" y1="260" x2="690" y2="640" />
                  <line x1="500" y1="260" x2="840" y2="640" />
                </g>

                {/* Subtle natural clouds */}
                <ellipse cx="280" cy="110" rx="160" ry="24" fill="#36BFFA" opacity="0.06" filter="blur(20px)" />
                <ellipse cx="720" cy="140" rx="200" ry="28" fill="#D7A86E" opacity="0.08" filter="blur(24px)" />
              </svg>

              {/* Farmer View Labels (Ground Knowledge Annotations) */}
              <div className="absolute inset-0 p-6 sm:p-8 pointer-events-none flex flex-col justify-between">
                {/* Top: Sky observation */}
                <div className="flex items-start justify-start">
                  <div className="bg-[#050A12]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D7A86E]/30 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7A86E] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E]" />
                      SKY & LOCAL CLOUDS
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Immediate cloud drift & wind direction
                    </span>
                  </div>
                </div>

                {/* Mid-ground: Visible Crop & Field Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  <div className="bg-[#050A12]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-[#D7A86E]/30 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7A86E] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D7A86E]" />
                      FIELD CONDITION
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Surface crusting & visual soil dryness
                    </span>
                  </div>

                  <div className="bg-[#050A12]/80 backdrop-blur-md px-3 py-2 rounded-lg border border-[#59D98E]/30 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#59D98E] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                      VISIBLE CROP SIGNALS
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Leaf posture & localized wilt symptoms
                    </span>
                  </div>
                </div>

                {/* Bottom Left: Respectful Farmer Quote */}
                <div className="bg-[#050A12]/85 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-md text-left">
                  <p className="text-xs sm:text-sm text-[#F8FAFC] font-space italic leading-snug">
                    {FIELD_COMPARISON_CONTENT.farmerView.quote}
                  </p>
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mt-1.5 block">
                    — Ground Reality & Empirical Observation
                  </span>
                </div>
              </div>
            </div>

            {/* 2. LAYER TWO: WHAT AGRILUME SEES (Clipped over Layer One on desktop, toggled on mobile) */}
            <div
              style={{
                clipPath: `inset(0 0 0 ${sliderPos}%)`,
              }}
              className={`mobile-comparison-layer absolute inset-0 w-full h-full bg-[#050A12] transition-all duration-200 ${
                mobileActiveView === "agrilume"
                  ? "max-md:opacity-100 max-md:pointer-events-auto"
                  : "max-md:opacity-0 max-md:pointer-events-none"
              } md:opacity-100 ${
                shouldReduceMotion ? "transition-none" : "md:transition-[clip-path] md:duration-75 md:ease-out"
              }`}
            >
              <Image
                src="/images/agrilume-field-photo.jpg"
                alt="AgriLume analytical field view"
                fill
                className="object-cover object-center filter hue-rotate-15 contrast-125 brightness-90 opacity-60"
              />
              <div className="absolute inset-0 bg-[#061528]/80 mix-blend-multiply" />
              {/* Remote Sensing Raster Grid & Intelligence SVG */}
              <svg
                viewBox="0 0 1000 640"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Digital terrain elevation gradient */}
                  <linearGradient id="intelGrid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#36BFFA" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#59D98E" stopOpacity="0.05" />
                  </linearGradient>

                  {/* Spectral isoline gradient */}
                  <linearGradient id="isolineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#36BFFA" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#70D4FF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Analytical Raster Coordinates (40px square grid) */}
                <g stroke="#36BFFA" strokeWidth="0.5" opacity="0.12" strokeDasharray="2 4">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="640" />
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 40} x2="1000" y2={i * 40} />
                  ))}
                </g>

                {/* Horizon Telemetry Datum Line */}
                <line x1="0" y1="260" x2="1000" y2="260" stroke="#36BFFA" strokeWidth="1.5" opacity="0.6" />

                {/* Multi-depth Soil Moisture & Thermal Isolines */}
                <path
                  d="M 0,310 C 250,285 450,335 700,305 S 900,325 1000,310"
                  fill="none"
                  stroke="url(#isolineCyan)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <path
                  d="M 0,390 C 220,360 480,410 740,375 S 920,400 1000,385"
                  fill="none"
                  stroke="#59D98E"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                  opacity="0.7"
                />
                <path
                  d="M 0,480 C 200,450 430,510 680,470 S 910,490 1000,475"
                  fill="none"
                  stroke="#36BFFA"
                  strokeWidth="1.2"
                  opacity="0.5"
                />

                {/* Perspective Crop Rows with Spectral Scanning Wave */}
                <g stroke="#36BFFA" strokeWidth="1.5" opacity="0.45">
                  <line x1="500" y1="260" x2="-100" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="80" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="240" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="380" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="500" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="620" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="760" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="920" y2="640" strokeDasharray="3 3" />
                  <line x1="500" y1="260" x2="1100" y2="640" strokeDasharray="3 3" />
                </g>

                {/* Analytical Field Nodes with Pulse */}
                <g transform="translate(680, 390)">
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#36BFFA" strokeWidth="1" className="animate-beacon-pulse" />
                  <circle cx="0" cy="0" r="4" fill="#36BFFA" />
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#36BFFA" strokeWidth="0.8" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#36BFFA" strokeWidth="0.8" />
                </g>
                <g transform="translate(380, 460)">
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#59D98E" strokeWidth="1" className="animate-beacon-pulse" />
                  <circle cx="0" cy="0" r="4" fill="#59D98E" />
                </g>
              </svg>

              {/* AgriLume Intelligence Context Annotations */}
              <div className="absolute inset-0 p-6 sm:p-8 pointer-events-none flex flex-col justify-between">
                {/* Top Right: Rainfall Context & Thermal Trend */}
                <div className="flex flex-col sm:flex-row items-end sm:items-start justify-end gap-3">
                  <div className="bg-[#050A12]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#36BFFA]/40 text-right sm:text-left shadow-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#36BFFA] font-semibold flex items-center justify-end sm:justify-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA] animate-pulse" />
                      RAINFALL CONTEXT
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Precipitation trend & multi-week moisture buffer
                    </span>
                  </div>

                  <div className="bg-[#050A12]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#36BFFA]/30 text-right sm:text-left shadow-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#36BFFA] font-semibold flex items-center justify-end sm:justify-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                      TEMPERATURE TREND
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Surface thermal accumulation & heat stress risk
                    </span>
                  </div>
                </div>

                {/* Center / Mid: Seasonal Patterns & Field History */}
                <div className="flex flex-col sm:flex-row items-end justify-end gap-3 max-w-xl self-end">
                  <div className="bg-[#050A12]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#59D98E]/30 text-right sm:text-left shadow-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#59D98E] font-semibold flex items-center justify-end sm:justify-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                      SEASONAL PATTERN
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Decadal climate normal comparison & monsoon timing
                    </span>
                  </div>

                  <div className="bg-[#050A12]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/15 text-right sm:text-left shadow-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#F8FAFC] font-semibold flex items-center justify-end sm:justify-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA]" />
                      FIELD HISTORY
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                      Multi-season crop response across rainfall anomalies
                    </span>
                  </div>
                </div>

                {/* Bottom Right: Evidence Source & Limitations Card */}
                <div className="bg-[#050A12]/90 backdrop-blur-md p-4 rounded-xl border border-[#36BFFA]/30 max-w-md self-end text-left shadow-xl">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#36BFFA]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#36BFFA] font-semibold">
                      EVIDENCE SOURCE & LIMITATIONS
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#F8FAFC] font-mono">
                    Observations ground agricultural decisions in transparent physical context with stated revisit intervals and cloud limitations.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. INTERACTIVE VERTICAL REVEAL DIVIDER (Desktop) */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="hidden md:flex absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#36BFFA] via-[#70D4FF] to-[#59D98E] z-30 items-center justify-center -translate-x-1/2 pointer-events-none"
            >
              {/* Divider Glow Aura */}
              <div className="absolute inset-y-0 w-8 bg-[#36BFFA]/20 blur-md pointer-events-none" />

              {/* Draggable Handle Button (Accessible Slider Controller) */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Comparison slider: Farmer View vs AgriLume View"
                aria-valuenow={sliderPos}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${sliderPos}% AgriLume context revealed`}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                className="pointer-events-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#050A12] border border-[#36BFFA] text-[#F8FAFC] shadow-[0_0_20px_rgba(54,191,250,0.5)] cursor-ew-resize hover:scale-105 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A12]"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#D7A86E]" />
                <ArrowLeftRight className="w-3 h-3 text-[#36BFFA]" />
                <ChevronRight className="w-3.5 h-3.5 text-[#36BFFA]" />
                <span className="text-[9px] font-mono uppercase tracking-widest font-semibold ml-0.5">
                  DRAG
                </span>
              </div>
            </div>
          </div>

          {/* Slider Drag Hint Footer */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-[#94A3B8]/70">
            <span>◀ Drag slider or use Left / Right arrow keys to explore information layers ▶</span>
          </div>
        </div>
      </div>
    </section>
  );
}
