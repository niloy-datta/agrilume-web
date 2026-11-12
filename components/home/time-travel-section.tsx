"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "../motion/reveal";

const FEATURES = [
  { icon: "🛰️", title: "Real NASA POWER weather", desc: "Past years use real NASA POWER temperature and rainfall for 64 districts. Future years are clearly labelled what-ifs or NASA projections — never forecasts." },
  { icon: "🥽", title: "3D, VR and phone-in-Cardboard", desc: "Walk the field on a PC, a phone or a WebXR headset. Teleport, press menu buttons with a controller ray, or look down to open the menu in Cardboard." },
  { icon: "🎤", title: "Voice, gestures and an assistant", desc: "Speak in Bangla or English, type, or control the scene with eight hand gestures. Everything also has captions, pictograms and vibration." },
  { icon: "♻️", title: "The circular farm", desc: "Straw, husk, dung and water: compost, mushroom, feed, biogas, biochar and a rain-fed pond — instead of the fire." },
  { icon: "🏛️", title: "Bangladesh government links", desc: "DAE, BMD, FFWC, DDM, BARI, BRRI, SRDI and the Krishi Call Centre 16123 — what each is for and when to call." },
  { icon: "🔬", title: "Honest science", desc: "Every screen says whether it shows observed data, a what-if or a model. Yield is a relative index, not a promise." },
];

export function TimeTravelSection() {
  return (
    <section id="time-travel" className="relative w-full overflow-hidden border-t border-white/5 bg-[#050A12] py-20 sm:py-28" aria-labelledby="time-travel-heading">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(89,217,142,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]/70">
            <span className="text-[#59D98E]">NEW</span>
            <span>•</span>
            <span>Virtual reality</span>
          </div>
          <h2 id="time-travel-heading" className="mt-4 max-w-3xl font-space text-4xl font-bold tracking-tight text-[#F8FAFC] sm:text-5xl">
            AgriLume <span className="text-[#59D98E]">Time Travel</span>
          </h2>
          <p className="mt-2 font-space text-lg text-[#36BFFA]">অ্যাগ্রিলিউম টাইম ট্রাভেল — সময়ের সঙ্গে আপনার খামার</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#94A3B8]">
            Stand in a Bangladeshi rice field, then move the timeline from 1981 to 2056. Watch the season, the weather, a flood or a drought change what grows —
            and see what the straw could become after harvest. An educational simulator built on NASA Earth data.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/time-travel"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#59D98E] px-7 py-3 text-sm font-bold text-[#050A12] shadow-[0_0_24px_rgba(89,217,142,0.45)] transition hover:bg-[#6ef0a4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
            >
              🥽 Launch Time Travel
            </Link>
            <Link href="/nasa-data" className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]">
              NASA data we use
            </Link>
            <Link href="/bangladesh-agriculture" className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]">
              Government resources
            </Link>
            <Link href="/recycling" className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]">
              Recycling calculator
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-[#0B1220] p-6">
                  <div className="text-2xl" aria-hidden>
                    {f.icon}
                  </div>
                  <h3 className="mt-3 font-space text-lg font-semibold text-[#F8FAFC]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{f.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[#94A3B8]/80">
          Time Travel is an educational simulation, not a forecast and not an official warning. For real warnings follow BMD, FFWC and DDM; for farming advice call the Krishi Call Centre 16123.
        </p>
      </div>
    </section>
  );
}
