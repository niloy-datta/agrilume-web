"use client";

import React, { useMemo, useState } from "react";
import type { TTState } from "@/lib/timetravel/engine";
import { CROPS } from "@/lib/timetravel/crops";
import { compareScenarios } from "@/lib/timetravel/compare";
import type { ScenarioInput } from "@/lib/timetravel/compare";
import type { ProjectionPack } from "@/lib/timetravel/projection-pack";
import type { ClimateSeries, IrrigationMode, Lang } from "@/lib/timetravel/types";
import { DEFAULT_SCENARIO } from "@/lib/timetravel/types";
import { monthDayOf } from "@/lib/timetravel/climate";
import { irrigationLabel } from "@/lib/timetravel/crops";
import { KindBadge, Notice, Section, tt } from "./primitives";

interface Side {
  year: number;
  mode: "observed" | "pack" | "whatif";
  dT: number;
  rainPct: number;
  irrigation: IrrigationMode;
  sowShift: number;
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toInput(side: Side, label: string, baseSowDoy: number): ScenarioInput {
  return {
    label,
    year: side.year,
    irrigation: side.irrigation,
    sowDoy: Math.min(365, Math.max(1, baseSowDoy + side.sowShift)),
    scenario: {
      ...DEFAULT_SCENARIO,
      mode: side.mode === "pack" ? "pack" : "trend",
      dT: side.mode === "whatif" ? side.dT : 0,
      rainMonsoonPct: side.mode === "whatif" ? side.rainPct : 0,
      rainDryPct: side.mode === "whatif" ? side.rainPct : 0,
    },
  };
}

function SideForm({ id, lang, side, onChange, packYear, lastObserved }: { id: string; lang: Lang; side: Side; onChange: (s: Side) => void; packYear: number | null; lastObserved: number }) {
  const field = "mt-1 w-full rounded-md border border-white/20 bg-space px-2 py-2 text-sm text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan";
  return (
    <fieldset className="rounded-lg border border-white/10 p-3">
      <legend className="px-1 text-sm font-semibold text-primary-text">{id === "a" ? tt(lang, "সম্ভাবনা ক", "Scenario A") : tt(lang, "সম্ভাবনা খ", "Scenario B")}</legend>
      <label className="block text-xs text-muted-text">
        {tt(lang, "আবহাওয়ার উৎস", "Weather source")}
        <select
          className={field}
          value={side.mode}
          onChange={(e) => {
            const mode = e.target.value as Side["mode"];
            onChange({ ...side, mode, year: mode === "observed" ? Math.min(side.year, lastObserved) : mode === "pack" && packYear ? packYear : side.year });
          }}
        >
          <option value="observed">{tt(lang, "পর্যবেক্ষিত NASA POWER বছর", "Observed NASA POWER year")}</option>
          {packYear && <option value="pack">{tt(lang, `NASA প্রক্ষেপণ (SSP2-4.5, ${packYear})`, `NASA projection (SSP2-4.5, ${packYear})`)}</option>}
          <option value="whatif">{tt(lang, "যদি-হয় (আপনার পরিবর্তন)", "What-if (your changes)")}</option>
        </select>
      </label>
      {side.mode !== "pack" && (
        <label className="mt-2 block text-xs text-muted-text">
          {tt(lang, "বছর", "Year")}
          <input
            type="number"
            className={field}
            min={1981}
            max={side.mode === "observed" ? lastObserved : 2056}
            value={side.year}
            onChange={(e) => {
              const y = Math.round(Number(e.target.value));
              if (Number.isFinite(y)) onChange({ ...side, year: Math.min(side.mode === "observed" ? lastObserved : 2056, Math.max(1981, y)) });
            }}
          />
        </label>
      )}
      {side.mode === "whatif" && (
        <>
          <label className="mt-2 block text-xs text-muted-text">
            {tt(lang, `তাপমাত্রা পরিবর্তন: ${side.dT > 0 ? "+" : ""}${side.dT} °C`, `Temperature change: ${side.dT > 0 ? "+" : ""}${side.dT} °C`)}
            <input type="range" className="mt-1 w-full accent-agri-green" min={-2} max={4} step={0.5} value={side.dT} onChange={(e) => onChange({ ...side, dT: Number(e.target.value) })} />
          </label>
          <label className="mt-2 block text-xs text-muted-text">
            {tt(lang, `বৃষ্টি পরিবর্তন: ${side.rainPct > 0 ? "+" : ""}${side.rainPct}%`, `Rain change: ${side.rainPct > 0 ? "+" : ""}${side.rainPct}%`)}
            <input type="range" className="mt-1 w-full accent-agri-green" min={-50} max={50} step={5} value={side.rainPct} onChange={(e) => onChange({ ...side, rainPct: Number(e.target.value) })} />
          </label>
        </>
      )}
      <label className="mt-2 block text-xs text-muted-text">
        {tt(lang, "সেচ", "Water management")}
        <select className={field} value={side.irrigation} onChange={(e) => onChange({ ...side, irrigation: e.target.value as IrrigationMode })}>
          {(["irrigated", "awd", "rainfed"] as IrrigationMode[]).map((m) => (
            <option key={m} value={m}>
              {lang === "bn" ? irrigationLabel(m).bn : irrigationLabel(m).en}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-2 block text-xs text-muted-text">
        {tt(lang, `বপনের তারিখ সরানো: ${side.sowShift > 0 ? "+" : ""}${side.sowShift} দিন`, `Shift sowing date: ${side.sowShift > 0 ? "+" : ""}${side.sowShift} days`)}
        <input type="range" className="mt-1 w-full accent-agri-green" min={-30} max={30} step={5} value={side.sowShift} onChange={(e) => onChange({ ...side, sowShift: Number(e.target.value) })} />
      </label>
    </fieldset>
  );
}

export function ComparePanel({ state, series, pack }: { state: TTState; series: ClimateSeries; pack: ProjectionPack | null }) {
  const lang = state.lang;
  const crop = CROPS[state.cropId];
  const packYear = pack && !series.provenance.standIn ? Number(Object.keys(pack.years)[0]) || null : null;
  const lastObs = series.endYear;
  const [a, setA] = useState<Side>({ year: Math.min(2015, lastObs), mode: "observed", dT: 0, rainPct: 0, irrigation: state.irrigation, sowShift: 0 });
  const [b, setB] = useState<Side>({ year: packYear ?? 2040, mode: packYear ? "pack" : "whatif", dT: 1.5, rainPct: -10, irrigation: state.irrigation, sowShift: 0 });

  const result = useMemo(() => {
    try {
      return { ok: true as const, cmp: compareScenarios(series, pack, state.cropId, toInput(a, tt(lang, "ক", "A"), state.sowDoy), toInput(b, tt(lang, "খ", "B"), state.sowDoy)) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : String(e) };
    }
  }, [series, pack, state.cropId, state.sowDoy, a, b, lang]);

  const sow = (shift: number) => {
    const { m0, d } = monthDayOf(2021, Math.min(365, Math.max(1, state.sowDoy + shift)));
    return `${MONTHS_EN[m0]} ${d}`;
  };
  const fmt = (n: number, d = 0) => (Number.isFinite(n) ? n.toFixed(d) : "—");
  const dfmt = (n: number, d = 0) => (Number.isFinite(n) ? `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toFixed(d)}` : "—");

  return (
    <div>
      <Section
        title={tt(lang, `${series.name}: ${crop.nameBn} — দুই সম্ভাবনার তুলনা`, `${series.name}: ${crop.nameEn} — compare two scenarios`)}
        hint={tt(lang, "জেলা ও ফসল বদলাতে ‘স্থান’ ও ‘ফসল’ ট্যাব ব্যবহার করুন।", "Change district and crop in the Place and Crop tabs.")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SideForm id="a" lang={lang} side={a} onChange={setA} packYear={packYear} lastObserved={lastObs} />
          <SideForm id="b" lang={lang} side={b} onChange={setB} packYear={packYear} lastObserved={lastObs} />
        </div>
      </Section>

      <Section title={tt(lang, "ফলাফল", "Result")}>
        {!result.ok ? (
          <Notice tone="warn">{tt(lang, `হিসাব করা যায়নি: ${result.error}`, `Could not compute: ${result.error}`)}</Notice>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">{tt(lang, "সম্ভাবনা ক ও খ-এর তুলনা", "Scenario A versus B")}</caption>
                <thead>
                  <tr className="text-left text-xs text-muted-text">
                    <th scope="col" className="py-1 pr-2 font-normal">{tt(lang, "সূচক", "Measure")}</th>
                    <th scope="col" className="py-1 pr-2 font-normal">{tt(lang, "ক", "A")}</th>
                    <th scope="col" className="py-1 pr-2 font-normal">{tt(lang, "খ", "B")}</th>
                    <th scope="col" className="py-1 font-normal">{tt(lang, "পার্থক্য", "B − A")}</th>
                  </tr>
                </thead>
                <tbody className="text-primary-text">
                  <tr className="border-t border-white/10">
                    <th scope="row" className="py-1.5 pr-2 text-left font-normal text-muted-text">{tt(lang, "তথ্যের ধরন", "Data type")}</th>
                    <td className="py-1.5 pr-2"><KindBadge kind={result.cmp.a.dataKind} lang={lang} compact /></td>
                    <td className="py-1.5 pr-2"><KindBadge kind={result.cmp.b.dataKind} lang={lang} compact /></td>
                    <td />
                  </tr>
                  {(
                    [
                      [tt(lang, "বছর · বপন", "Year · sowing"), `${result.cmp.a.year} · ${sow(a.sowShift)}`, `${result.cmp.b.year} · ${sow(b.sowShift)}`, ""],
                      [tt(lang, "মৌসুমের বৃষ্টি (মিমি)", "Season rain (mm)"), fmt(result.cmp.a.seasonRainMm), fmt(result.cmp.b.seasonRainMm), dfmt(result.cmp.diff.rainMm)],
                      [tt(lang, "গড় সর্বোচ্চ তাপ (°C)", "Mean max temp (°C)"), fmt(result.cmp.a.seasonTmaxC, 1), fmt(result.cmp.b.seasonTmaxC, 1), dfmt(result.cmp.diff.tmaxC, 1)],
                      [tt(lang, `গরম দিন (≥${crop.heat.threshold} °C)`, `Hot days (≥${crop.heat.threshold} °C)`), fmt(result.cmp.a.hotDays), fmt(result.cmp.b.hotDays), dfmt(result.cmp.diff.hotDays)],
                      [tt(lang, "পানির চাপ (%)", "Water stress (%)"), fmt(100 * result.cmp.a.waterStress), fmt(100 * result.cmp.b.waterStress), dfmt(100 * result.cmp.diff.waterStress)],
                      [tt(lang, "মডেলের বাড়তি পানি (মিমি)", "Model added water (mm)"), fmt(result.cmp.a.irrigationMm), fmt(result.cmp.b.irrigationMm), dfmt(result.cmp.diff.irrigationMm)],
                      [tt(lang, "ফসল-অবস্থা সূচক (১০০ = গড়)", "Crop-condition index (100 = avg)"), fmt(result.cmp.a.index), fmt(result.cmp.b.index), dfmt(result.cmp.diff.index)],
                    ] as [string, string, string, string][]
                  ).map(([k, va, vb, d]) => (
                    <tr key={k} className="border-t border-white/10">
                      <th scope="row" className="py-1.5 pr-2 text-left font-normal text-muted-text">{k}</th>
                      <td className="py-1.5 pr-2 tabular-nums">{va}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{vb}</td>
                      <td className="py-1.5 tabular-nums">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-primary-text">{tt(lang, "কেন এই পার্থক্য?", "Why the difference?")}</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-primary-text" aria-live="polite">
              {result.cmp.explanations.map((e, i) => (
                <li key={i}>{lang === "bn" ? e.bn : e.en}</li>
              ))}
            </ul>
            <Notice tone="warn">
              <ul className="list-disc space-y-1 pl-4">
                {result.cmp.caveats.map((c, i) => (
                  <li key={i}>{lang === "bn" ? c.bn : c.en}</li>
                ))}
              </ul>
            </Notice>
          </>
        )}
      </Section>
    </div>
  );
}
