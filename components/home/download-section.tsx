"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Reveal } from "../motion/reveal";

const APP_SOURCE_URL = "https://github.com/niloy-datta/agri-guardian";
const APP_SOURCE_ZIP_URL = `${APP_SOURCE_URL}/archive/refs/heads/main.zip`;

export function DownloadSection() {
  return (
    <section
      id="download"
      className="relative w-full overflow-hidden border-t border-white/5 bg-[#050A12] py-24 sm:py-32"
      aria-labelledby="download-title"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
          <span className="font-bold text-[#59D98E]">06</span>
          <span className="font-medium text-white/80">Android app source</span>
          <span>•</span>
          <span>Build it for your device.</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-7">
            <Reveal delay={0.1} yOffset={16}>
              <h2
                id="download-title"
                className="font-space text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl"
              >
                EXPLORE THE <span className="text-[#59D98E]">ANDROID APP</span> SOURCE.
              </h2>
            </Reveal>

            <Reveal delay={0.2} yOffset={14}>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
                The AgriGuardian Flutter app is open source. Get the code, build it on your computer, and run it on an Android device.
              </p>
            </Reveal>

            <Reveal delay={0.3} yOffset={18}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={APP_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#59D98E] px-8 py-3.5 text-sm font-bold tracking-wide text-[#050A12] transition-all hover:bg-[#6ef0a4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <span>View app source on GitHub</span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a
                  href={APP_SOURCE_ZIP_URL}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0B1220] px-7 py-3.5 text-sm font-medium text-[#F8FAFC] transition-all hover:border-white/30 hover:bg-[#1E293B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <span>Download source ZIP</span>
                  <Download className="h-4 w-4 text-[#36BFFA]" aria-hidden />
                </a>
                <Link
                  href="/time-travel"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0B1220] px-7 py-3.5 text-sm font-medium text-[#F8FAFC] transition-all hover:border-white/30 hover:bg-[#1E293B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#36BFFA]"
                >
                  <span>Try the web app now</span>
                  <ArrowRight className="h-4 w-4 text-[#36BFFA]" aria-hidden />
                </Link>
              </div>
              <p className="mt-5 max-w-xl text-sm text-[#94A3B8]">
                There is no public installable APK yet. Source code needs a Flutter and Android setup before it can run on a phone.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.25} yOffset={20}>
              <div className="rounded-2xl border border-white/15 bg-[#0B1220]/80 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <h3 className="font-space text-lg font-bold text-white">Run it from source</h3>
                <ol className="mt-5 space-y-5 text-sm text-[#94A3B8]">
                  <li><span className="mr-3 font-mono font-bold text-[#59D98E]">01</span>Download or clone the GitHub repository.</li>
                  <li><span className="mr-3 font-mono font-bold text-[#59D98E]">02</span>Install Flutter and the Android SDK, then run <code className="text-white">flutter pub get</code>.</li>
                  <li><span className="mr-3 font-mono font-bold text-[#59D98E]">03</span>Connect an Android device and run <code className="text-white">flutter run</code>.</li>
                </ol>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#94A3B8]">
                  Some features need backend and Firebase configuration. Follow the repository&apos;s setup instructions before building.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
