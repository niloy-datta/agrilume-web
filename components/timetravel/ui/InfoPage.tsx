"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/timetravel/types";
import { Btn, tt } from "./primitives";

/** Shared shell for the static information pages (NASA data, government, recycling) with a Bangla/English switch. */
export function InfoPage({
  title,
  intro,
  children,
}: {
  title: { bn: string; en: string };
  intro: { bn: string; en: string };
  children: (lang: Lang) => React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("bn");
  return (
    <div className="min-h-screen bg-space text-primary-text">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-white/10 bg-space/90 px-4 py-2 backdrop-blur">
        <Link href="/" className="rounded-md px-2 py-2 text-sm font-semibold text-muted-text hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          ← AgriLume
        </Link>
        <Link href="/time-travel" className="rounded-md px-2 py-2 text-sm font-semibold text-agri-green hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
          🥽 {tt(lang, "টাইম ট্রাভেল", "Time Travel")}
        </Link>
        <div className="ml-auto">
          <Btn onClick={() => setLang(lang === "bn" ? "en" : "bn")} ariaLabel={tt(lang, "Switch to English", "বাংলায় বদলান")}>
            {lang === "bn" ? "English" : "বাংলা"}
          </Btn>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8" id="main">
        <h1 className="font-space text-3xl font-bold tracking-tight sm:text-4xl">{lang === "bn" ? title.bn : title.en}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-text">{lang === "bn" ? intro.bn : intro.en}</p>
        <div className="mt-8">{children(lang)}</div>
      </main>
    </div>
  );
}
