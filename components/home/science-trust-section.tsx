"use client";

import React from "react";
import { Database, Search, ShieldAlert, Heart } from "lucide-react";
import { Reveal } from "../motion/reveal";

export function ScienceTrustSection() {
  const cards = [
    {
      icon: <Database className="w-5 h-5 text-[#36BFFA]" />,
      title: "Clear sources",
      desc: "Know where data comes from",
    },
    {
      icon: <Search className="w-5 h-5 text-[#59D98E]" />,
      title: "Transparent methods",
      desc: "Understand the approach",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#D7A86E]" />,
      title: "Known limitations",
      desc: "See what may be uncertain",
    },
    {
      icon: <Heart className="w-5 h-5 text-[#59D98E]" />,
      title: "Human centered",
      desc: "Supports, not replaces, farmer knowledge",
    },
  ];

  return (
    <section
      id="science-trust"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="science-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 07 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#36BFFA] font-bold">07</span>
          <span className="text-white/80 font-medium">Science & Trust</span>
          <span>•</span>
          <span>Evidence before advice</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="science-title"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
            >
              EVIDENCE BEFORE ADVICE.
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-4 text-base text-[#94A3B8] font-normal leading-relaxed">
              AgriLume is designed to show where information comes from, what context was used, and what the limitations are.
            </p>
          </Reveal>
        </div>

        {/* 4 Trust Cards Grid (Matching 1:1 blueprint) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={0.1 * i} yOffset={18}>
              <div className="flex flex-col justify-between h-full p-6 rounded-2xl bg-[#0B1220]/75 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{c.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
