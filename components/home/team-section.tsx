"use client";

import React from "react";
import Image from "next/image";
import { Reveal } from "../motion/reveal";

export function TeamSection() {
  const members = [
    {
      name: "Niloy Bhattacharjee",
      role: "Lead Full-Stack Engineer",
      tag: "Lead Architect",
      initials: "NB",
      accent: "#59D98E",
      image: "/images/team/niloy-bhattacharjee.jpg",
    },
    {
      name: "Niloy Chandra Datta",
      role: "AI/ML & Backend Engineer",
      tag: "AI Systems Architect",
      initials: "ND",
      accent: "#36BFFA",
      image: "/images/team/niloy-datta.jpg",
    },
    {
      name: "Amlan Sarker Turna",
      role: "Earth Observation & Satellite Data",
      tag: "Remote Sensing",
      initials: "AT",
      accent: "#59D98E",
      image: "/images/team/amlan-turna.jpg",
    },
    {
      name: "Debarati Chakraborty",
      role: "Science & Research",
      tag: "Agronomic Modeling",
      initials: "DC",
      accent: "#D7A86E",
      image: "/images/team/debarati-chakraborty.jpg",
    },
    {
      name: "Monisha Das",
      role: "GIS & Environmental Intelligence",
      tag: "AI/ML Engineer",
      initials: "MD",
      accent: "#36BFFA",
      image: "/images/team/monisha-das.jpg",
    },
    {
      name: "Arpita Bhattacharjee",
      role: "Data Analysis & UX/UI",
      tag: "UX/UI Designer",
      initials: "AB",
      accent: "#59D98E",
      image: "/images/team/arpita-bhattacharjee.jpg",
    },
  ];

  return (
    <section
      id="team"
      className="relative w-full py-20 sm:py-28 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="team-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 09 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">09</span>
          <span className="text-white/80 font-medium">Team</span>
          <span>•</span>
          <span>Built by AgriLume</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <Reveal delay={0.1} yOffset={16}>
            <h2
              id="team-title"
              className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
            >
              BUILT BY A <span className="text-[#59D98E]">PASSIONATE TEAM</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2} yOffset={14}>
            <p className="mt-3 text-sm text-[#94A3B8] font-normal leading-relaxed">
              A group of students, engineers and problem solvers building agricultural intelligence for a more resilient future.
            </p>
          </Reveal>
        </div>

        {/* 6-Column Responsive Team Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {members.map((m, idx) => (
            <Reveal key={m.name + idx} delay={0.06 * idx} yOffset={16}>
              <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#0B1220]/60 border border-white/10 hover:border-white/25 transition-all duration-300 group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                {/* Circular Profile Avatar Ring with Real Photo */}
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr mb-4 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${m.accent}, rgba(255,255,255,0.15))`,
                  }}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0B1528] border border-white/15">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-space font-bold text-lg text-white">
                        {m.initials}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-white tracking-tight leading-snug">{m.name}</div>
                <div className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{m.role}</div>
                <div className="mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#CBD5E1]">
                  {m.tag}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
