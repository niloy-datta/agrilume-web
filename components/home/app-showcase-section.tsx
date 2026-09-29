"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Smartphone, WifiOff, AlertCircle, Droplets } from "lucide-react";
import { Reveal } from "../motion/reveal";

export function AppShowcaseSection() {
  const [activeScreen, setActiveScreen] = useState<"overview" | "moisture" | "thermal" | "action">("overview");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6; // max 3 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="app"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-gradient-to-b from-[#050A12] via-[#081322] to-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="app-showcase-title"
    >
      {/* Background cyan halo */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#36BFFA]/4 rounded-full blur-[190px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">05</span>
          <span>App Showcase</span>
          <span>•</span>
          <span>Complex intelligence. Simple experience.</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Reveal delay={0.1} yOffset={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1220] border border-[#59D98E]/25 mb-6">
              <Smartphone className="w-3.5 h-3.5 text-[#59D98E]" />
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#59D98E] uppercase">
                MOBILE APPLICATION
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.2} yOffset={20}>
            <h2
              id="app-showcase-title"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              THE INTELLIGENCE STAYS COMPLEX.{" "}
              <span className="text-[#59D98E]">THE EXPERIENCE STAYS SIMPLE.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.32} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              A clean and intuitive mobile app designed for farmers, backed by Earth and climate intelligence.
            </p>
          </Reveal>
        </div>

        {/* Showcase Grid: Features on Left, Interactive Phone Mockup on Right */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Feature Tabs & Interaction Switches (Columns 1-6) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#94A3B8]/60 mb-2">
              Select Phone Experience
            </span>

            {/* Tab 1: Field Overview */}
            <button
              type="button"
              onClick={() => setActiveScreen("overview")}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                activeScreen === "overview"
                  ? "bg-[#0B1220] border-[#36BFFA]/40 shadow-[0_8px_24px_rgba(54,191,250,0.12)]"
                  : "bg-[#050A12]/60 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-[#36BFFA] uppercase">
                  01 • Ground Reality Dashboard
                </span>
                {activeScreen === "overview" && (
                  <span className="w-2 h-2 rounded-full bg-[#36BFFA] animate-pulse" />
                )}
              </div>
              <h3 className="mt-1 text-base sm:text-lg font-space font-semibold text-[#F8FAFC]">
                Daily Field Status & Weather Context
              </h3>
              <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed">
                Clear high-level overview of surface conditions, rainfall accumulation trend, and immediate planting safety window.
              </p>
            </button>

            {/* Tab 2: Soil Moisture & Deficit */}
            <button
              type="button"
              onClick={() => setActiveScreen("moisture")}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                activeScreen === "moisture"
                  ? "bg-[#0B1220] border-[#59D98E]/40 shadow-[0_8px_24px_rgba(89,217,142,0.12)]"
                  : "bg-[#050A12]/60 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-[#59D98E] uppercase">
                  02 • Root-Zone Soil Water
                </span>
                {activeScreen === "moisture" && (
                  <span className="w-2 h-2 rounded-full bg-[#59D98E] animate-pulse" />
                )}
              </div>
              <h3 className="mt-1 text-base sm:text-lg font-space font-semibold text-[#F8FAFC]">
                Multi-Week Moisture Deficit Modeling
              </h3>
              <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed">
                Combines radar surface observations with precipitation context to indicate whether seeds will find moisture below the dry crust.
              </p>
            </button>

            {/* Tab 3: Action Advisory */}
            <button
              type="button"
              onClick={() => setActiveScreen("action")}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                activeScreen === "action"
                  ? "bg-[#0B1220] border-[#D7A86E]/40 shadow-[0_8px_24px_rgba(215,168,110,0.12)]"
                  : "bg-[#050A12]/60 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-[#D7A86E] uppercase">
                  03 • Action Advisory Cards
                </span>
                {activeScreen === "action" && (
                  <span className="w-2 h-2 rounded-full bg-[#D7A86E] animate-pulse" />
                )}
              </div>
              <h3 className="mt-1 text-base sm:text-lg font-space font-semibold text-[#F8FAFC]">
                Plain-Language Guidance With Reasons
              </h3>
              <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed">
                Action cards answer the core question: “Wait 48 hours — rainfall incoming.” Never an unexplained score.
              </p>
            </button>

            {/* Offline badge */}
            <div className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-[#94A3B8]">
              <WifiOff className="w-4 h-4 text-[#59D98E]" />
              <span>Offline-First Architecture: Cached for remote field use</span>
            </div>
          </div>

          {/* RIGHT: Floating Phone Mockup (Columns 7-12) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 flex items-center justify-center perspective-[1200px]"
          >
            <div
              style={{
                transform: shouldReduceMotion
                  ? "none"
                  : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: "transform 0.15s ease-out",
              }}
              className="relative w-[300px] sm:w-[340px] h-[610px] sm:h-[660px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1220] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(54,191,250,0.1)] border-[3px] border-white/15 select-none"
            >
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-6 inset-x-0 mx-auto w-24 h-4 rounded-full bg-black z-30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>

              {/* Screen Inner Bezel */}
              <div className="w-full h-full rounded-[38px] bg-[#050A12] overflow-hidden flex flex-col justify-between relative border border-white/5 p-4 sm:p-5 pt-9">
                
                {/* Mobile App Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-widest text-[#36BFFA] uppercase">
                      AGRILUME MOBILE
                    </span>
                    <span className="text-xs font-space font-semibold text-[#F8FAFC]">
                      Rajshahi Plot #04
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#59D98E]/10 border border-[#59D98E]/30 text-[9px] font-mono text-[#59D98E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
                    <span>CACHED</span>
                  </div>
                </div>

                {/* DYNAMIC SCREEN CONTENT BASED ON SELECTED TAB */}
                <div className="my-auto flex flex-col gap-3.5">
                  {activeScreen === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/10">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#94A3B8]">
                          7-DAY FIELD OUTLOOK
                        </span>
                        <div className="mt-1 text-sm font-space font-semibold text-[#F8FAFC]">
                          Rainfall Window Approaching
                        </div>
                        <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
                          Favorable germination conditions expected within 48 to 72 hours.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-[9px] font-mono text-[#36BFFA] uppercase block">
                            RAIN CONTEXT
                          </span>
                          <span className="text-xs font-semibold text-[#F8FAFC]">Rising Trend</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-[9px] font-mono text-[#D7A86E] uppercase block">
                            HEAT STRESS
                          </span>
                          <span className="text-xs font-semibold text-[#F8FAFC]">Moderate</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === "moisture" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#59D98E]/30">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-[#59D98E]">
                          <Droplets className="w-3 h-3" />
                          <span>SOIL MOISTURE BUFFER</span>
                        </div>
                        <div className="mt-1 text-sm font-space font-semibold text-[#F8FAFC]">
                          Subsurface Reserve Deficit
                        </div>
                        <p className="mt-1 text-[11px] text-[#94A3B8]">
                          Surface crust is dry, but upcoming front will replenish seed-depth moisture.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-[#94A3B8]">
                        <span>HISTORICAL BASELINE: 10-YR REGIONAL NORMAL MATCHED</span>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === "action" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="p-4 rounded-xl bg-[#0B1220] border border-[#D7A86E]/40 shadow-lg">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-[#D7A86E]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>RECOMMENDED TIMING</span>
                        </div>
                        <div className="mt-1 text-base font-space font-semibold text-[#F8FAFC]">
                          HOLD SOWING 48 HOURS
                        </div>
                        <p className="mt-2 text-xs text-[#F8FAFC]/90 leading-relaxed">
                          Evidence: High precipitation probability over 3 days provides natural germination moisture, saving irrigation fuel.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#59D98E]/10 border border-[#59D98E]/20 text-[10px] font-mono text-[#59D98E] text-center">
                        CONFIDENCE: HIGH • BASED ON 3 CONCURRENT PASSES
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className="border-t border-white/10 pt-3 flex items-center justify-around text-[#94A3B8]">
                  <span className="text-[10px] font-mono text-[#36BFFA] font-semibold">FIELDS</span>
                  <span className="text-[10px] font-mono">ADVISORY</span>
                  <span className="text-[10px] font-mono">HISTORY</span>
                </div>

                {/* Home Indicator Bar */}
                <div className="mx-auto w-24 h-1 rounded-full bg-white/20 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
