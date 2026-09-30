"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight, QrCode, Smartphone, Feather, MapPin, Globe2, RefreshCw } from "lucide-react";
import { DOWNLOAD_CONTENT } from "@/lib/constants";
import { APP_DOWNLOAD_CONFIG } from "@/lib/downloads";
import { Reveal } from "../motion/reveal";

export function DownloadSection() {
  const specs = [
    { icon: <Feather className="w-4 h-4 text-[#36BFFA]" />, label: "Lightweight", desc: "Works on common devices" },
    { icon: <MapPin className="w-4 h-4 text-[#59D98E]" />, label: "Field-ready", desc: "Designed for real use" },
    { icon: <Globe2 className="w-4 h-4 text-[#D7A86E]" />, label: "Multi-language", desc: "Supports local languages" },
    { icon: <RefreshCw className="w-4 h-4 text-[#36BFFA]" />, label: "Regular updates", desc: "Improving with feedback" },
  ];

  return (
    <section
      id="download"
      className="relative w-full py-24 sm:py-32 bg-[#050A12] border-t border-white/5 overflow-hidden"
      aria-labelledby="download-title"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section 06 Index Marker */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#94A3B8]/70">
          <span className="text-[#59D98E] font-bold">06</span>
          <span className="text-white/80 font-medium">Download AgriLume</span>
          <span>•</span>
          <span>Take AgriLume to the field.</span>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Download info & Action Buttons */}
          <div className="lg:col-span-8 flex flex-col">
            <Reveal delay={0.1} yOffset={16}>
              <h2
                id="download-title"
                className="font-space font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-[#F8FAFC]"
              >
                TAKE <span className="text-[#59D98E]">AGRILUME</span> TO THE FIELD.
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={14}>
              <p className="mt-4 text-base sm:text-lg text-[#94A3B8] font-normal leading-relaxed max-w-xl">
                Earth intelligence, field context, and practical guidance — available where farming decisions happen.
              </p>
            </Reveal>

            {/* Buttons Row */}
            <Reveal delay={0.3} yOffset={18}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={APP_DOWNLOAD_CONFIG.apkUrl || "#"}
                  download={APP_DOWNLOAD_CONFIG.apkFilename}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#59D98E] hover:bg-[#6ef0a4] text-[#050A12] text-sm font-bold tracking-wide transition-all shadow-[0_0_24px_rgba(89,217,142,0.4)] hover:shadow-[0_0_36px_rgba(89,217,142,0.65)] hover:scale-[1.02]"
                >
                  <span>Download for Android</span>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                </a>

                <Link
                  href="#app"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B1220] hover:bg-[#1E293B] border border-white/15 hover:border-white/30 text-[#F8FAFC] text-sm font-medium transition-all"
                >
                  <span>View App Experience</span>
                  <ArrowRight className="w-4 h-4 text-[#36BFFA]" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Phone Preview & QR Code Card */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6">
            {/* App Preview Mockup Peek */}
            <Reveal delay={0.2} yOffset={20}>
              <div className="relative w-[130px] sm:w-[150px] aspect-[576/1024] rounded-[28px] overflow-hidden border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(89,217,142,0.15)] -rotate-3 hover:rotate-0 transition-transform duration-300 hidden sm:block">
                <Image
                  src="/images/app/app-home-dashboard.png"
                  alt="AgriLume App Interface"
                  fill
                  sizes="150px"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>

            {/* QR Card */}
            <Reveal delay={0.25} yOffset={20}>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0B1220]/80 backdrop-blur-md border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                {/* QR Box */}
                <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
                  <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm6-4h2v2h-2V8zm-2 2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#59D98E] font-bold uppercase tracking-wider">
                    Scan to Download
                  </span>
                  <span className="text-xs font-bold text-white mt-0.5">Android APK</span>
                  <span className="text-[11px] text-[#94A3B8] mt-1 font-mono">Latest release</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {specs.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{item.label}</div>
                <div className="text-[11px] text-[#94A3B8]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
