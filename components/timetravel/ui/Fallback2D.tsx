"use client";

import React from "react";
import type { TTState, View } from "@/lib/timetravel/engine";
import { STAGE_LABEL } from "@/lib/timetravel/crops";
import { ClimateChart, IndexBar } from "./charts";
import { Notice, Stat, tt } from "./primitives";

/** Shown when WebGL is unavailable: the same simulation numbers as a 2D summary so nothing is lost. */
export function Fallback2D({ state, view }: { state: TTState; view: View }) {
  const lang = state.lang;
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-surface to-space p-4 md:pl-[500px] lg:pr-80">
      <div className="mx-auto max-w-xl space-y-4">
        <Notice tone="warn">
          {tt(
            lang,
            "এই ডিভাইস/ব্রাউজারে 3D (WebGL) চালু নেই, তাই 2D সারাংশ দেখানো হচ্ছে। সব সংখ্যা ও প্যানেল একই কাজ করে।",
            "3D (WebGL) is not available on this device/browser, so a 2D summary is shown. All numbers and panels work the same.",
          )}
        </Notice>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={tt(lang, "সাল", "Year")} value={state.year} />
          <Stat label={tt(lang, "ধাপ", "Stage")} value={lang === "bn" ? STAGE_LABEL[view.stage].bn : STAGE_LABEL[view.stage].en} sub={`${tt(lang, "দিন", "day")} ${state.day}`} />
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-primary-text">{tt(lang, "আপেক্ষিক ফলন সূচক", "Relative yield index")}</h3>
          <IndexBar value={view.index} lang={lang} />
        </div>
        <ClimateChart year={view.monthly} base={view.baselineYear} lang={lang} monthMarker={view.date.m0} />
      </div>
    </div>
  );
}
