"use client";

import React from "react";
import Image from "next/image";
import { Sprout, Calendar, TrendingUp, Users } from "lucide-react";
import { Reveal } from "../motion/reveal";

export function ImpactSection() {
  const pillars = [
    {
      icon: <Sprout className="w-5 h-5 text-[#59D98E]" />,
      title: "Climate resilience",
      desc: "Adapt to changing conditions",
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#36BFFA]" />,
      title: "Better planning",
      desc: "Aligned with seasonal patterns",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#D7A86E]" />,
      title: "Sustainable farming",
      desc: "Support long-term productivity",
    },
    {
      icon: <Users className="w-5 h-5 text-[#59D98E]" />,
      title: "Local empowerment",
      desc: "Put useful information in farmers’ hands",
    },
  ];

  return (
    <section
      id="impact"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="impact-heading"
    >
      {/* Background panoramic landscape image (Green terraced rice fields at sunrise) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/impact-terrace-sunrise.jpg"
          alt="Terraced rice farming landscape at golden sunrise"
          fill
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A12] via-[#050A12]/80 to-[#050A12]/50" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 08 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">08</span>
          <span className="text-white/80 font-medium">Impact</span>
          <span>•</span>
          <span>Real-world potential</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="impact-heading"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
            >
              STRONGER DECISIONS. <br />
              <span className="text-[#59D98E]">BRIGHTER TOMORROWS.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base sm:text-lg text-[#CBD5E1] font-normal leading-relaxed">
              Helping farmers make more informed decisions can support more resilient communities and a more food-secure future.
            </p>
          </Reveal>
        </div>

        {/* 4 Impact Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <Reveal key={p.title} delay={0.1 * idx} yOffset={18}>
              <div className="p-6 rounded-2xl bg-[#0B1220]/80 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{p.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
