"use client";

import React, { useEffect, useState } from "react";
import { loadNdvi } from "@/lib/timetravel/ndvi";
import type { NdviFile } from "@/lib/timetravel/ndvi";
import type { Lang } from "@/lib/timetravel/types";
import { ExtLink, Section, tt } from "./primitives";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const M_EN = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const M_FULL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Satellite vegetation context for the area around the district centre (MODIS NDVI, 2021–2025). */
export function NdviCard({ districtId, lang, year }: { districtId: string; lang: Lang; year: number }) {
  const [state, setState] = useState<{ id: string; file: NdviFile | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    void loadNdvi(districtId, BASE_PATH).then((file) => {
      if (!cancelled) setState({ id: districtId, file });
    });
    return () => {
      cancelled = true;
    };
  }, [districtId]);

  const loading = !state || state.id !== districtId;
  const f = loading ? null : state.file;
  const showYear = f && f.monthlyByYear[String(year)] ? year : null;
  const W = 240;
  const H = 70;
  const bw = W / 12;
  const y = (v: number) => H - Math.max(0, Math.min(1, v)) * H;

  return (
    <Section
      title={tt(lang, "উদ্ভিদের সবুজভাব (স্যাটেলাইট NDVI)", "Vegetation greenness (satellite NDVI)")}
      hint={tt(lang, "NASA MODIS, জেলা-কেন্দ্রের চারপাশের ৩×৩ কিমি — কোনো নির্দিষ্ট জমি নয়।", "NASA MODIS, a 3×3 km window around the district centre — not any specific field.")}
    >
      {loading ? (
        <p className="text-xs text-muted-text" role="status">{tt(lang, "লোড হচ্ছে…", "Loading…")}</p>
      ) : !f ? (
        <p className="text-xs text-muted-text">{tt(lang, "এই জেলার NDVI তথ্য এখনো তৈরি হয়নি।", "NDVI has not been processed for this district yet.")}</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full max-w-sm" role="img" aria-labelledby={`ndvi-t-${districtId}`}>
            <title id={`ndvi-t-${districtId}`}>
              {tt(lang, "মাসিক NDVI: ২০২১–২০২৫ গড় (বার) ও নির্বাচিত বছর (বিন্দু)", "Monthly NDVI: 2021–2025 mean (bars) and selected year (dots)")}
            </title>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={0} x2={W} y1={y(g)} y2={y(g)} stroke="currentColor" strokeOpacity={0.12} />
            ))}
            {f.climatology.map((v, m) =>
              v == null ? (
                <text key={m} x={m * bw + bw / 2} y={H - 3} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.5}>
                  ☁
                </text>
              ) : (
                <rect key={m} x={m * bw + 2} y={y(v)} width={bw - 4} height={H - y(v)} rx={2} fill="#59D98E" fillOpacity={0.55} />
              ),
            )}
            {showYear &&
              f.monthlyByYear[String(showYear)].map((v, m) => (v == null ? null : <circle key={m} cx={m * bw + bw / 2} cy={y(v)} r={2.6} fill="#36BFFA" />))}
            {M_EN.map((l, m) => (
              <text key={m} x={m * bw + bw / 2} y={H + 11} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.7}>
                {l}
              </text>
            ))}
          </svg>
          <p className="mt-1 text-[11px] text-muted-text">
            <span className="mr-2"><span aria-hidden className="inline-block h-2 w-3 rounded-sm bg-agri-green/60" /> {tt(lang, "২০২১–২০২৫ গড়", "2021–2025 mean")}</span>
            {showYear ? (
              <span className="mr-2"><span aria-hidden className="inline-block h-2 w-2 rounded-full bg-earth-cyan" /> {showYear}</span>
            ) : (
              <span className="mr-2">{tt(lang, "নির্বাচিত বছরের NDVI নেই (শুধু ২০২১–২০২৫)", "No NDVI for the selected year (2021–2025 only)")}</span>
            )}
            <span>☁ {tt(lang, "মেঘে ঢাকা: যথেষ্ট পরিষ্কার পিক্সেল নেই", "cloud: too few clear pixels")}</span>
          </p>
          <table className="sr-only">
            <caption>{tt(lang, "মাসিক NDVI", "Monthly NDVI")}</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">2021–2025 mean</th>
                {showYear && <th scope="col">{showYear}</th>}
              </tr>
            </thead>
            <tbody>
              {f.climatology.map((v, m) => (
                <tr key={m}>
                  <th scope="row">{M_FULL[m]}</th>
                  <td>{v == null ? "no clear data" : v.toFixed(2)}</td>
                  {showYear && <td>{f.monthlyByYear[String(showYear)][m]?.toFixed(2) ?? "no clear data"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-[11px] text-muted-text">
            {tt(
              lang,
              `NDVI ০ = খালি মাটি/পানি, ~০.৮ = ঘন সবুজ। ${f.quality.compositesUsable}/${f.quality.compositesTotal}টি ১৬-দিনের ছবি ব্যবহারযোগ্য। এলাকায় শহর, পানি ও গাছ মিশে আছে; ফসলের মডেলে এটি ব্যবহৃত হয় না।`,
              `NDVI 0 = bare soil/water, ~0.8 = dense green. ${f.quality.compositesUsable}/${f.quality.compositesTotal} 16-day composites usable. The window mixes town, water and trees; NDVI is not used by the crop model.`,
            )}{" "}
            <ExtLink href="https://modis.ornl.gov/data/modis_webservice.html">ORNL DAAC</ExtLink>
          </p>
        </>
      )}
    </Section>
  );
}
