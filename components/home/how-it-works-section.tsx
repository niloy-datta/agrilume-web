"use client";

import React from "react";
import { Satellite, Cpu, Scale, CheckCircle2 } from "lucide-react";
import { HOW_IT_WORKS_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function HowItWorksSection() {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Satellite className="w-5 h-5 text-[#36BFFA]" />;
      case 1:
        return <Cpu className="w-5 h-5 text-[#59D98E]" />;
      case 2:
        return <Scale className="w-5 h-5 text-[#D7A86E]" />;
      case 3:
        return <CheckCircle2 className="w-5 h-5 text-[#36BFFA]" />;
      default:
        return <Satellite className="w-5 h-5 text-[#36BFFA]" />;
    }
  };

  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#36BFFA]/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#36BFFA]">04</span>
          <span>How It Works</span>
          <span>•</span>
          <span>From data to decision</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Reveal delay={0.1} yOffset={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1220] border border-[#36BFFA]/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36BFFA] animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.18em] text-[#36BFFA] uppercase">
                A SIMPLE AND TRANSPARENT JOURNEY
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.2} yOffset={20}>
            <h2
              id="how-it-works-title"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              HOW AGRILUME WORKS
            </h2>
          </Reveal>

          <Reveal delay={0.32} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              From Earth data to practical guidance — a clear journey for real field decisions.
            </p>
          </Reveal>
        </div>

        {/* 4-Step Horizontal Visual Journey */}
        <div className="mt-16 sm:mt-20 relative">
          
          {/* Subtle connecting trajectory line on desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[8%] right-[8%] h-px bg-gradient-to-r from-[#36BFFA]/20 via-[#59D98E]/30 to-[#D7A86E]/20 pointer-events-none" />

          <StaggerContainer
            staggerDelay={0.14}
            delayChildren={0.25}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {HOW_IT_WORKS_CONTENT.steps.map((step, index) => (
              <StaggerItem
                key={step.num}
                yOffset={24}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#0B1220]/60 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#050A12] border border-white/10 group-hover:border-[#36BFFA]/40 transition-colors shadow-inner">
                      {getStepIcon(index)}
                    </div>
                    <span className="font-space font-bold text-2xl sm:text-3xl text-white/20 group-hover:text-white/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono tracking-widest text-[#36BFFA] uppercase">
                    {step.stage}
                  </div>

                  <h3 className="mt-1 text-xl font-space font-semibold text-[#F8FAFC]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Conceptual Tags */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#94A3B8]/80 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
