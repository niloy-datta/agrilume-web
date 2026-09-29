"use client";

import React from "react";
import Image from "next/image";
import { Sprout, Calendar, TrendingUp, Users } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function ImpactSection() {
  const pillars = [
    {
      icon: <Sprout className="w-5 h-5 text-[#59D98E]" />,
      title: "Climate resilience",
      desc: "Adapt to changing conditions with predictive weather and soil moisture context.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#36BFFA]" />,
      title: "Better planning",
      desc: "Aligned with seasonal patterns and decadal climate normal observations.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#D7A86E]" />,
      title: "Sustainable farming",
      desc: "Support long-term soil productivity and minimize costly planting missteps.",
    },
    {
      icon: <Users className="w-5 h-5 text-[#59D98E]" />,
      title: "Local empowerment",
      desc: "Put useful, explainable Earth intelligence directly in farmers' hands.",
    },
  ];

  return (
    <section
      id="impact"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="impact-heading"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#59D98E]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">08</span>
          <span>Impact</span>
          <span>•</span>
          <span>Real-world potential</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="impact-heading"
              className="font-space font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
            >
              STRONGER DECISIONS.{" "}
              <span className="text-[#59D98E]">BRIGHTER TOMORROWS.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={18}>
            <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-light leading-relaxed">
              Helping farmers make more informed decisions can support more resilient communities and a more food-secure future.
            </p>
          </Reveal>
        </div>

        {/* Impact Visual Banner */}
        <Reveal delay={0.3} yOffset={20}>
          <div className="mt-12 relative w-full h-[220px] sm:h-[300px] lg:h-[360px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/images/design-impact-landscape.jpg"
              alt="Agricultural rice terrace fields at golden sunrise"
              fill
              className="object-cover object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050A12]/80 via-transparent to-[#050A12]/80" />

            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-[#050A12]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <span className="text-xs font-mono text-[#59D98E] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#59D98E] animate-pulse" />
                COMMUNITY IMPACT • RESILIENT HARVESTS
              </span>
            </div>
          </div>
        </Reveal>

        {/* 4 Impact Pillars */}
        <StaggerContainer
          staggerDelay={0.1}
          delayChildren={0.4}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {pillars.map((pillar) => (
            <StaggerItem
              key={pillar.title}
              yOffset={16}
              className="p-6 rounded-2xl bg-[#0B1220]/70 border border-white/5 hover:border-[#59D98E]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-space font-semibold text-lg text-[#F8FAFC]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
