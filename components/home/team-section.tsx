"use client";

import React from "react";
import { Users } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "../motion/reveal";

export function TeamSection() {
  const members = [
    {
      name: "Niloy Chandra Datta",
      role: "Founder & Developer",
      subtitle: "AI/ML & Satellite Data",
      avatar: "👨‍💻",
      color: "#59D98E",
    },
    {
      name: "Team Member",
      role: "AI/ML & Satellite Data",
      subtitle: "",
      avatar: "🛰️",
      color: "#36BFFA",
    },
    {
      name: "Team Member",
      role: "Mobile App Development",
      subtitle: "",
      avatar: "📱",
      color: "#D7A86E",
    },
    {
      name: "Team Member",
      role: "Science & Research",
      subtitle: "",
      avatar: "🔬",
      color: "#36BFFA",
    },
  ];

  return (
    <section
      id="team"
      className="relative w-full py-20 sm:py-28 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="team-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/60">
          <span className="text-[#59D98E]">09</span>
          <span>Team</span>
          <span>•</span>
          <span>Built by AgriLume</span>
        </div>

        {/* Header — left aligned matching blueprint */}
        <div className="max-w-2xl mb-12">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="team-title"
              className="font-space font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-[#F8FAFC]"
            >
              BUILT BY THE <span className="text-[#59D98E]">AGRILUME</span> TEAM
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-3 text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed">
              A group of students, engineers and problem solvers building agricultural intelligence for a more resilient future.
            </p>
          </Reveal>
        </div>

        {/* Team Member Cards — horizontal row */}
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
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl mb-3 shadow-lg"
                style={{
                  borderColor: `${member.color}40`,
                  background: `linear-gradient(135deg, ${member.color}15, transparent)`,
                }}
              >
                {member.avatar}
              </div>
              <div className="text-sm font-space font-semibold text-[#F8FAFC]">
                {member.name}
              </div>
              <div className="text-[11px] font-mono mt-1" style={{ color: member.color }}>
                {member.role}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
