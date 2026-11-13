"use client";

import React from "react";
import Image from "next/image";
import { Cloud, Clock, FileText } from "lucide-react";
import { FARMER_PROBLEM_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function FarmerProblemSection() {
  const cards = [
    {
      category: "WEATHER",
      question: "What happens next?",
      icon: <Cloud className="w-5 h-5 text-[#36BFFA]" />,
      accent: "#36BFFA",
    },
    {
      category: "TIMING",
      question: "Is this the right window?",
      icon: <Clock className="w-5 h-5 text-[#59D98E]" />,
      accent: "#59D98E",
    },
    {
      category: "EVIDENCE",
      question: "What supports the decision?",
      icon: <FileText className="w-5 h-5 text-[#D7A86E]" />,
      accent: "#D7A86E",
    },
  ];

  return (
    <section
      id="mission"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 02 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">02</span>
          <span className="text-white/80 font-medium">The Problem</span>
          <span>•</span>
          <span>A real decision in the field.</span>
        </div>

        {/* Content Layout: Left Headline & Story + Right 3 Decision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Problem Statement & Quote */}
          <div className="lg:col-span-7 flex flex-col">
            <Reveal delay={0.1} yOffset={16}>
              <h2
                id="problem-heading"
                className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC] leading-[1.08]"
              >
                A FARMER SEES THE FIELD. <br />
                <span className="text-white/60">BUT NOT EVERYTHING SHAPING IT.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={14}>
              <p className="mt-6 text-base sm:text-lg text-[#CBD5E1] font-normal leading-relaxed max-w-xl">
                Rainfall timing, heat, changing conditions, and crop context can turn a simple question into a difficult decision.
              </p>
            </Reveal>

            {/* Central Farmer Dilemma Question Quote */}
            <Reveal delay={0.3} yOffset={18}>
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1528] to-[#050A12] border border-[#36BFFA]/25 shadow-lg">
                <span className="font-space font-bold text-xl sm:text-2xl text-[#59D98E] block">
                  “Should I plant today — or wait?”
                </span>
                <span className="text-xs font-mono text-[#94A3B8] mt-2 block">
                  Ground truth • Rajshahi Basin observation
                </span>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: 3 Decision Cards (WEATHER, TIMING, EVIDENCE) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {cards.map((card, idx) => (
              <Reveal key={card.category} delay={0.15 * idx} yOffset={16}>
                <div className="p-5 rounded-2xl bg-[#0B1220]/80 backdrop-blur-md border border-white/10 hover:border-white/25 transition-all flex items-center gap-5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}40` }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <span
                      style={{ color: card.accent }}
                      className="text-xs font-mono font-bold tracking-wider uppercase block"
                    >
                      {card.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
                      {card.question}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
