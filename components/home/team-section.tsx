"use client";

import React from "react";
import { Users } from "lucide-react";
import { TEAM_CONTENT } from "@/lib/constants";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative w-full py-20 sm:py-24 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="team-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Reveal delay={0.1} yOffset={14}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/10 mb-4">
              <Users className="w-3 h-3 text-[#94A3B8]" />
              <span className="text-[10px] font-mono tracking-[0.18em] text-[#94A3B8] uppercase">
                {TEAM_CONTENT.eyebrow}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.18} yOffset={16}>
            <h2
              id="team-title"
              className="font-space font-bold tracking-tight text-2xl sm:text-3xl text-[#F8FAFC]"
            >
              {TEAM_CONTENT.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.26} yOffset={14}>
            <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] font-light">
              {TEAM_CONTENT.supporting}
            </p>
          </Reveal>
        </div>

        {/* Small Elegant Team Grid */}
        <div className="mt-12 max-w-4xl mx-auto">
          <StaggerContainer
            staggerDelay={0.1}
            delayChildren={0.2}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {TEAM_CONTENT.members.map((member) => (
              <StaggerItem
                key={member.name}
                yOffset={16}
                className="p-5 rounded-xl bg-[#0B1220]/50 border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="text-sm font-space font-semibold text-[#F8FAFC]">
                  {member.name}
                </div>
                <div className="text-[11px] font-mono text-[#36BFFA] mt-0.5">
                  {member.role}
                </div>
                <p className="mt-2 text-xs text-[#94A3B8]/80 leading-relaxed">
                  {member.contribution}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
