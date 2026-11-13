"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight, Feather, MapPin, Globe2, Mic, Clock, BellRing, ShieldCheck } from "lucide-react";
import { androidRelease, formatBytes, RELEASES_URL } from "@/lib/downloads";
import { Reveal } from "../motion/reveal";

export function DownloadSection() {
  const release = androidRelease();
  const specs = [
    { icon: <Mic className="w-4 h-4 text-[#36BFFA]" />, label: "Voice-First & Audio", desc: "Speak & listen • No reading needed" },
    { icon: <Globe2 className="w-4 h-4 text-[#59D98E]" />, label: "Bangla & English", desc: "Web app today; more languages planned" },
    { icon: <Feather className="w-4 h-4 text-[#D7A86E]" />, label: "Designed to be lightweight", desc: "Budget-phone testing still pending" },
    { icon: <MapPin className="w-4 h-4 text-[#59D98E]" />, label: "Zero-Literacy Design", desc: "Built for grassroots farmers" },
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
          <div className="lg:col-span-7 flex flex-col">
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
                {release ? (
                  <a
                    href={release.apkUrl}
                    download
                    rel="noopener"
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#59D98E] hover:bg-[#6ef0a4] text-[#050A12] text-sm font-bold tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                  >
                    <span>Download for Android ({formatBytes(release.fileSizeBytes)})</span>
                    <Download className="w-4 h-4 stroke-[2.5]" aria-hidden />
                  </a>
                ) : (
                  <>
                    <span
                      role="status"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-dashed border-[#59D98E]/60 text-[#59D98E] text-sm font-bold tracking-wide"
                    >
                      <Clock className="w-4 h-4" aria-hidden />
                      Android app: coming soon
                    </span>
                    <a
                      href={RELEASES_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B1220] hover:bg-[#1E293B] border border-white/15 hover:border-white/30 text-[#F8FAFC] text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                    >
                      <BellRing className="w-4 h-4 text-[#59D98E]" aria-hidden />
                      <span>Watch releases on GitHub</span>
                    </a>
                  </>
                )}

                <Link
                  href="/time-travel"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B1220] hover:bg-[#1E293B] border border-white/15 hover:border-white/30 text-[#F8FAFC] text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <span>Try the web app now</span>
                  <ArrowRight className="w-4 h-4 text-[#36BFFA]" aria-hidden />
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

            {/* Release status card: real metadata only when a verified APK exists */}
            <Reveal delay={0.25} yOffset={20}>
              <div className="flex max-w-xs flex-col gap-2 p-4 rounded-2xl bg-[#0B1220]/80 backdrop-blur-md border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                {release ? (
                  <>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#59D98E] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> Verified release
                    </span>
                    <span className="text-xs font-bold text-white">Android APK {release.version}</span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {release.minAndroid} • {formatBytes(release.fileSizeBytes)} • {release.releasedOn}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono break-all">SHA-256 {release.sha256}</span>
                    <a href={release.releaseNotesUrl} className="text-[11px] text-[#36BFFA] underline" target="_blank" rel="noopener noreferrer">
                      Release notes
                    </a>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#F59E0B] font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" aria-hidden /> Not yet released
                    </span>
                    <span className="text-xs font-bold text-white">Android APK</span>
                    <span className="text-[11px] text-[#94A3B8] leading-relaxed">
                      No public APK exists yet, so there is no download link or QR code. The web app works today in any modern browser.
                    </span>
                  </>
                )}
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
