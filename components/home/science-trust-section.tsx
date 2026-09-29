"use client";

import React from "react";
import { Database, Sliders, ShieldAlert, Users2 } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function ScienceTrustSection() {
  const pillars = [
    {
      icon: <Database className="w-6 h-6 text-[#36BFFA]" />,
      title: "Clear sources",
      desc: "Know where data comes from.",
    },
    {
      icon: <Sliders className="w-6 h-6 text-[#59D98E]" />,
      title: "Transparent methods",
      desc: "Understand the approach.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-[#D7A86E]" />,
      title: "Known limitations",
      desc: "See what may be uncertain.",
    },
    {
      icon: <Users2 className="w-6 h-6 text-[#36BFFA]" />,
      title: "Human centered",
      desc: "Supports, not replaces, farmer knowledge.",
    },
  ];

  return (
    <section
      id="trust"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="trust-title"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">07</span>
          <span>Science & Trust</span>
          <span>•</span>
          <span>Evidence before advice</span>
        </div>

        {/* Header — left aligned matching blueprint */}
        <div className="max-w-3xl">
          <Reveal delay={0.1} yOffset={20}>
            <h2
              id="trust-title"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              EVIDENCE <span className="text-[#59D98E]">BEFORE</span> ADVICE.
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              AgriLume is designed to show where information comes from, what context was used, and what the limitations are.
            </p>
          </Reveal>
        </div>

        {/* 4 Trust Pillars — horizontal grid matching blueprint */}
        <div className="mt-14 sm:mt-16">
          <StaggerContainer
            staggerDelay={0.12}
            delayChildren={0.2}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pillars.map((pillar) => (
              <StaggerItem
                key={pillar.title}
                yOffset={20}
                className="p-6 rounded-2xl bg-[#0B1220]/60 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#050A12] border border-white/10 mb-5">
                  {pillar.icon}
                </div>

                <h3 className="text-base sm:text-lg font-space font-semibold text-[#F8FAFC]">
                  {pillar.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {pillar.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
