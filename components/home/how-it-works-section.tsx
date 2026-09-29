"use client";

import React from "react";
import { Satellite, Brain, Scale, Smartphone, ArrowRight } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Observe",
      icon: <Satellite className="w-6 h-6 text-[#36BFFA]" />,
      desc: "Satellite and climate data provide the big picture.",
      color: "#36BFFA",
    },
    {
      num: "02",
      title: "Understand",
      icon: <Brain className="w-6 h-6 text-[#59D98E]" />,
      desc: "Environmental context is analyzed into clear signals.",
      color: "#59D98E",
    },
    {
      num: "03",
      title: "Decide",
      icon: <Scale className="w-6 h-6 text-[#D7A86E]" />,
      desc: "Evidence and limitations help make better choices.",
      color: "#D7A86E",
    },
    {
      num: "04",
      title: "Act",
      icon: <Smartphone className="w-6 h-6 text-[#59D98E]" />,
      desc: "Practical guidance in the AgriLume app for real field use.",
      color: "#59D98E",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-gradient-to-b from-[#050A12] via-[#0B1220] to-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#36BFFA]/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#59D98E]/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
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
              HOW <span className="text-[#36BFFA]">AGRILUME</span> WORKS
            </h2>
          </Reveal>

          <Reveal delay={0.32} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              From <em className="text-[#F8FAFC] not-italic font-medium">Earth data</em> to practical guidance — a clear journey for real field decisions.
            </p>
          </Reveal>
        </div>

        {/* 4-Step Horizontal Journey — matching blueprint layout */}
        <div className="mt-16 sm:mt-20 relative">
          
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-px bg-gradient-to-r from-[#36BFFA]/30 via-[#59D98E]/30 to-[#D7A86E]/30 pointer-events-none" />

          <StaggerContainer
            staggerDelay={0.14}
            delayChildren={0.25}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4"
          >
            {steps.map((step, index) => (
              <StaggerItem
                key={step.num}
                yOffset={24}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Circle */}
                <div
                  className="w-[72px] h-[72px] rounded-full bg-[#0B1220] border-2 flex items-center justify-center mb-5 relative z-10 shadow-lg"
                  style={{ borderColor: `${step.color}40` }}
                >
                  {step.icon}
                </div>

                {/* Arrow connector (between steps, desktop only) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-[34px] -right-3 z-20">
                    <ArrowRight className="w-5 h-5 text-[#94A3B8]/40" />
                  </div>
                )}

                {/* Step Number */}
                <div className="text-xs font-mono font-bold tracking-wider mb-1" style={{ color: step.color }}>
                  {step.num}
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-space font-bold text-[#F8FAFC] mb-2">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
