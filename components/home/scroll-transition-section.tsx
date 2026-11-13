"use client";

import React from "react";
import { ArrowDown, Radio, Layers, Activity } from "lucide-react";

export function ScrollTransitionSection() {

  return (
    <section
      id="mission-threshold"
      className="relative w-full pt-16 pb-28 sm:pb-36 bg-gradient-to-b from-[#050A12] via-[#08101C] to-[#0B1220] border-t border-[#36BFFA]/10 overflow-hidden"
      aria-label="Mission Introduction Transition"
    >
      {/* Subtle telemetry latitude line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#36BFFA]/25 to-transparent" />

      {/* Background warm agriculture undertone hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#D7A86E]/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Subtle section transition marker */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/10 text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase">
            <Radio className="w-3 h-3 text-[#36BFFA] animate-pulse" />
            <span>CONCEPTUAL ARCHITECTURE • PREVIEW</span>
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl lg:text-3xl font-space font-medium text-[#F8FAFC] tracking-tight max-w-2xl">
            FROM EARTH DATA TO FIELD DECISIONS.
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] max-w-xl">
            AgriLume transforms environmental observations and climate context into transparent, explainable signals designed to support farmer decisions.
          </p>

          {/* Minimal 3-step pipeline preview (Architectural concept) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl text-left">
            <div className="p-5 rounded-xl bg-[#050A12]/60 border border-white/5 backdrop-blur-sm hover:border-[#36BFFA]/25 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-[#36BFFA]">
                <Layers className="w-3.5 h-3.5" />
                <span>01. EARTH DATA</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Satellite and climate observations provide environmental context for the field.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#050A12]/60 border border-white/5 backdrop-blur-sm hover:border-[#59D98E]/25 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-[#59D98E]">
                <Activity className="w-3.5 h-3.5" />
                <span>02. SCIENTIFIC ANALYSIS</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Transparent methods transform observations into interpretable agricultural signals.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#050A12]/60 border border-white/5 backdrop-blur-sm hover:border-[#D7A86E]/25 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D7A86E]">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>03. FARMER DECISION</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Evidence, confidence, and limitations are translated into clear next-step guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
