"use client";

import React from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function TeamSection() {
  const members = [
    {
      name: "Niloy Chandra Datta",
      role: "Founder & Developer",
      avatar: "👨‍💻",
    },
    {
      name: "Team Member",
      role: "AI/ML & Satellite Data",
      avatar: "🛰️",
    },
    {
      name: "Team Member",
      role: "Mobile App Development",
      avatar: "📱",
    },
    {
      name: "Team Member",
      role: "Science & Research",
      avatar: "🔬",
    },
  ];

  return (
    <section
      id="team"
      className="relative w-full py-20 sm:py-28 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="team-title"
    >
      {/* Background celestial curve */}
      <div className="absolute -bottom-20 inset-x-0 h-40 opacity-20 pointer-events-none">
        <Image
          src="/images/blueprint-team-earth.jpg"
          alt="Earth curve in deep space"
          fill
          className="object-cover object-top"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">09</span>
          <span>Team</span>
          <span>•</span>
          <span>Built by AgriLume</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Reveal delay={0.1} yOffset={14}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/10 mb-4">
              <Users className="w-3 h-3 text-[#59D98E]" />
              <span className="text-[10px] font-mono tracking-[0.18em] text-[#59D98E] uppercase">
                PROJECT CREATORS
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.18} yOffset={16}>
            <h2
              id="team-title"
              className="font-space font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-[#F8FAFC]"
            >
              BUILT BY A <span className="text-[#59D98E]">PASSIONATE</span> TEAM
            </h2>
          </Reveal>

          <Reveal delay={0.26} yOffset={14}>
            <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed">
              A group of students, engineers and problem solvers building agricultural intelligence for a more resilient future.
            </p>
          </Reveal>
        </div>

        {/* 4 Team Member Cards */}
        <div className="mt-12 max-w-4xl mx-auto">
          <StaggerContainer
            staggerDelay={0.08}
            delayChildren={0.2}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {members.map((member) => (
              <StaggerItem
                key={member.name + member.role}
                yOffset={16}
                className="p-5 rounded-2xl bg-[#0B1220]/70 border border-white/5 hover:border-[#59D98E]/30 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  {member.avatar}
                </div>
                <div className="text-sm font-space font-semibold text-[#F8FAFC]">
                  {member.name}
                </div>
                <div className="text-[11px] font-mono text-[#59D98E] mt-1">
                  {member.role}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
