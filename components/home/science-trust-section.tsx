"use client";

import React from "react";
import { ShieldCheck, Database, Sliders, Users2 } from "lucide-react";
import { SCIENCE_TRUST_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function ScienceTrustSection() {
  const getPillarIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Database className="w-5 h-5 text-[#36BFFA]" />;
      case 1:
        return <Sliders className="w-5 h-5 text-[#59D98E]" />;
      case 2:
        return <ShieldCheck className="w-5 h-5 text-[#D7A86E]" />;
      case 3:
        return <Users2 className="w-5 h-5 text-[#36BFFA]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#36BFFA]" />;
    }
  };

  return (
    <section
      id="trust"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="trust-title"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">07</span>
          <span>Science & Trust</span>
          <span>•</span>
          <span>Evidence before advice</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Reveal delay={0.1} yOffset={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1220] border border-[#59D98E]/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#59D98E]" />
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#59D98E] uppercase">
                SCIENTIFIC FOUNDATION
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.2} yOffset={20}>
            <h2
              id="trust-title"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              EVIDENCE <span className="text-[#59D98E]">BEFORE</span> ADVICE.
            </h2>
          </Reveal>

          <Reveal delay={0.32} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              AgriLume is designed to show where information comes from, what context was used, and what the limitations are.
            </p>
          </Reveal>
        </div>

        {/* 4 Trust Pillars */}
        <div className="mt-16 sm:mt-20">
          <StaggerContainer
            staggerDelay={0.12}
            delayChildren={0.2}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SCIENCE_TRUST_CONTENT.pillars.map((pillar, index) => (
              <StaggerItem
                key={pillar.title}
                yOffset={20}
                className="p-6 rounded-2xl bg-[#0B1220]/60 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#050A12] border border-white/10 mb-5">
                    {getPillarIcon(index)}
                  </div>

                  <h3 className="text-base sm:text-lg font-space font-semibold text-[#F8FAFC]">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-[#59D98E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E]" />
                  <span>CORE PRINCIPLE</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
