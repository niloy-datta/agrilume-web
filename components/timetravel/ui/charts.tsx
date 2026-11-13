"use client";

import React from "react";
import type { Lang, MonthlyYear } from "@/lib/timetravel/types";
import { MONTHS_BN, MONTHS_EN } from "@/lib/timetravel/climate";
import { STAGE_LABEL, STAGE_ORDER } from "@/lib/timetravel/crops";
import type { SeasonResult } from "@/lib/timetravel/crops";
import type { StageId } from "@/lib/timetravel/types";
import { tt } from "./primitives";

/** Monthly temperature (lines) and rainfall (bars): selected year vs the multi-year baseline (dashed). */
export function ClimateChart({ year, base, lang, monthMarker }: { year: MonthlyYear; base: MonthlyYear; lang: Lang; monthMarker?: number }) {
  const W = 340;
  const H = 190;
  const padL = 30;
  const padR = 30;
  const padT = 10;
  const padB = 24;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const rainMo = (m: MonthlyYear) => m.rain.map((r, i) => r * days[i]);
  const ry = rainMo(year);
  const rb = rainMo(base);
  const rMax = Math.max(100, ...ry, ...rb) * 1.08;
  const tAll = [...year.tmax, ...year.tmin, ...base.tmax, ...base.tmin];
  const tMin = Math.floor(Math.min(...tAll) - 1);
  const tMax = Math.ceil(Math.max(...tAll) + 1);
  const x = (i: number) => padL + (iw / 12) * (i + 0.5);
  const yT = (t: number) => padT + ih - ((t - tMin) / (tMax - tMin)) * ih;
  const yR = (r: number) => padT + ih - (r / rMax) * ih;
  const line = (arr: number[]) => arr.map((t, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yT(t).toFixed(1)}`).join(" ");
  const months = lang === "bn" ? MONTHS_BN : MONTHS_EN;
  const bw = (iw / 12) * 0.6;
  const desc = tt(
    lang,
    `মাসিক সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা (°C) এবং বৃষ্টি (মিমি), ${year.year} সাল বনাম গড়`,
    `Monthly max and min temperature (°C) and rainfall (mm) for ${year.year} versus the multi-year mean`,
  );
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={desc}>
        <title>{desc}</title>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={padL} x2={W - padR} y1={padT + ih * f} y2={padT + ih * f} stroke="rgba(255,255,255,0.07)" />
        ))}
        {ry.map((r, i) => (
          <rect key={i} x={x(i) - bw / 2} y={yR(r)} width={bw} height={padT + ih - yR(r)} fill="#36bffa" opacity={0.45} />
        ))}
        {rb.map((r, i) => (
          <line key={i} x1={x(i) - bw / 2} x2={x(i) + bw / 2} y1={yR(r)} y2={yR(r)} stroke="#36bffa" strokeWidth={1.6} strokeDasharray="3 2" />
        ))}
        <path d={line(base.tmax)} fill="none" stroke="#ffb8a0" strokeWidth={1.3} strokeDasharray="4 3" opacity={0.8} />
        <path d={line(base.tmin)} fill="none" stroke="#d7a86e" strokeWidth={1.3} strokeDasharray="4 3" opacity={0.8} />
        <path d={line(year.tmax)} fill="none" stroke="#ffb8a0" strokeWidth={2.2} />
        <path d={line(year.tmin)} fill="none" stroke="#d7a86e" strokeWidth={2.2} />
        {monthMarker != null && <rect x={x(monthMarker) - iw / 24} y={padT} width={iw / 12} height={ih} fill="#59d98e" opacity={0.12} />}
        {months.map((m, i) => (
          <text key={i} x={x(i)} y={H - 8} fontSize={8.5} textAnchor="middle" fill="#94a3b8">
            {m.length > 4 ? m.slice(0, 3) : m}
          </text>
        ))}
        <text x={4} y={padT + 8} fontSize={9} fill="#ffb8a0">
          {tMax}°
        </text>
        <text x={4} y={padT + ih} fontSize={9} fill="#d7a86e">
          {tMin}°
        </text>
        <text x={W - 4} y={padT + 8} fontSize={9} textAnchor="end" fill="#36bffa">
          {Math.round(rMax)}mm
        </text>
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-text">
        <span>━ {tt(lang, "সর্বোচ্চ °C", "Tmax °C")}</span>
        <span>━ {tt(lang, "সর্বনিম্ন °C", "Tmin °C")}</span>
        <span>▮ {tt(lang, "বৃষ্টি (মিমি)", "Rain (mm)")}</span>
        <span>┄ {tt(lang, "বহুবছরের গড়", "multi-year mean")}</span>
      </figcaption>
    </figure>
  );
}

const STAGE_COLOR: Record<StageId, string> = {
  landprep: "#7c6a4a",
  germination: "#a3c76a",
  seedling: "#7ccf7a",
  vegetative: "#4db86a",
  reproductive: "#36a8a0",
  flowering: "#ffb8a0",
  grainfill: "#e0a03a",
  maturity: "#d7a86e",
  harvest: "#94a3b8",
};

/** Season timeline with the current day marked. */
export function StageTimeline({ sim, day, lang, total }: { sim: SeasonResult; day: number; lang: Lang; total: number }) {
  const starts = STAGE_ORDER.filter((s) => s !== "landprep" && s !== "harvest" && sim.stageStartDay[s] != null);
  const segs = starts.map((s, i) => {
    const a = sim.stageStartDay[s] ?? 0;
    const nextStart = i + 1 < starts.length ? sim.stageStartDay[starts[i + 1]] ?? total : sim.maturityDay ?? total;
    return { s, a, b: Math.max(a + 1, nextStart) };
  });
  const pct = (d: number) => `${Math.max(0, Math.min(100, (d / total) * 100))}%`;
  return (
    <div>
      <div className="relative h-6 w-full overflow-hidden rounded-md bg-white/5" role="img" aria-label={tt(lang, "ফসলের ধাপের সময়রেখা", "Crop stage timeline")}>
        {segs.map(({ s, a, b }) => (
          <div
            key={s}
            title={lang === "bn" ? STAGE_LABEL[s].bn : STAGE_LABEL[s].en}
            className="absolute top-0 h-full border-r border-space/60"
            style={{ left: pct(a), width: `calc(${pct(b)} - ${pct(a)})`, background: STAGE_COLOR[s] }}
          />
        ))}
        <div className="absolute top-0 h-full w-0.5 bg-white" style={{ left: pct(Math.max(0, day)) }} />
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-text">
        {segs.map(({ s, a }) => (
          <li key={s} className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: STAGE_COLOR[s] }} />
            <span>
              {lang === "bn" ? STAGE_LABEL[s].bn : STAGE_LABEL[s].en} · {tt(lang, "দিন", "day")} {a}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Horizontal bar of the relative yield index against the baseline marker at 100. */
export function IndexBar({ value, lang }: { value: number; lang: Lang }) {
  const max = 140;
  const v = Math.max(0, Math.min(max, value));
  return (
    <div>
      <div className="relative h-4 w-full rounded bg-white/5" role="img" aria-label={`${tt(lang, "আপেক্ষিক ফলন সূচক", "Relative yield index")} ${value.toFixed(0)} / 100`}>
        <div className="absolute left-0 top-0 h-full rounded bg-agri-green/70" style={{ width: `${(v / max) * 100}%` }} />
        <div className="absolute top-[-3px] h-[22px] w-0.5 bg-white" style={{ left: `${(100 / max) * 100}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-text">
        <span>0</span>
        <span>{tt(lang, "বেসলাইন = ১০০", "baseline = 100")}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
