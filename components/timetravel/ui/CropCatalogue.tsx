"use client";

import Image from "next/image";
import type { ImageLoader } from "next/image";
import React, { useMemo, useState } from "react";
import { CROP_REFERENCE, CROP_REFERENCE_PHOTOS } from "@/lib/timetravel/crop-reference";
import type { CropCategory } from "@/lib/timetravel/crop-reference";
import type { Lang } from "@/lib/timetravel/types";
import { tt } from "./primitives";

const cropImageLoader: ImageLoader = ({ src }) => src;

const FILTERS: ({ id: CropCategory | "all"; bn: string; en: string })[] = [
  { id: "all", bn: "সব", en: "All" },
  { id: "rice", bn: "ধান", en: "Rice" },
  { id: "rabi", bn: "রবি", en: "Rabi" },
  { id: "vegetable", bn: "সবজি", en: "Vegetables" },
  { id: "flower", bn: "ফুল", en: "Flowers" },
  { id: "fruit", bn: "ফল", en: "Fruits" },
  { id: "cash", bn: "অর্থকরী", en: "Cash crops" },
];

function CropPhoto({ crop, lang }: { crop: (typeof CROP_REFERENCE)[number]; lang: Lang }) {
  const [failed, setFailed] = useState(false);
  const photo = CROP_REFERENCE_PHOTOS[crop.photo];
  if (failed) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-agri-green/20 via-earth-cyan/10 to-surface text-4xl" aria-label={tt(lang, "ছবি লোড হয়নি", "Photo unavailable")}>
        🌱
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      loader={cropImageLoader}
      width={640}
      height={400}
      unoptimized
      alt={tt(lang, `${crop.nameBn} ফসলের তথ্যসূত্রের ছবি`, `Reference photo for ${crop.nameEn}`)}
      className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

export function CropCatalogue({ lang }: { lang: Lang }) {
  const [category, setCategory] = useState<CropCategory | "all">("all");
  const [query, setQuery] = useState("");
  const crops = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return CROP_REFERENCE.filter((crop) => category === "all" || crop.category === category).filter(
      (crop) => !term || `${crop.nameEn} ${crop.nameBn}`.toLocaleLowerCase().includes(term),
    );
  }, [category, query]);

  return (
    <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.03]">
      <summary className="cursor-pointer rounded-xl px-3 py-3 text-sm font-semibold text-earth-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan">
        {tt(lang, `বাংলাদেশের ফসলের ছবির তালিকা · ${CROP_REFERENCE.length}টি`, `Bangladesh crop photo library · ${CROP_REFERENCE.length} crops`)}
      </summary>
      <div className="space-y-3 px-3 pb-3">
        <p className="text-xs leading-relaxed text-muted-text">
          {tt(
            lang,
            "মৌসুম ও এলাকার তথ্য আপনার দেওয়া নথি থেকে নেওয়া। ছবিগুলো Wikimedia Commons-এর; প্রতিটি ছবির পাশে আলোকচিত্রী ও লাইসেন্সের সূত্র আছে। এই তালিকার সব ফসল এখনো ফলন সিমুলেটরে চালানো যায় না।",
            "Season and area notes come from your document. Photos are from Wikimedia Commons with creator and license links. Not every listed crop is currently supported by the yield simulator.",
          )}
        </p>
        <label className="block text-xs font-medium text-muted-text">
          {tt(lang, "ফসল খুঁজুন", "Search crops")}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tt(lang, "বাংলা বা ইংরেজি নাম", "Bangla or English name")}
            className="mt-1 min-h-[42px] w-full rounded-lg border border-white/15 bg-surface px-3 text-sm text-primary-text placeholder:text-muted-text"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={tt(lang, "ফসলের ধরন", "Crop category")}>
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategory(filter.id)}
              aria-pressed={category === filter.id}
              className={`min-h-[36px] rounded-full border px-3 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan ${
                category === filter.id
                  ? "border-agri-green/70 bg-agri-green/15 text-agri-green"
                  : "border-white/10 text-muted-text hover:bg-white/5 hover:text-primary-text"
              }`}
            >
              {lang === "bn" ? filter.bn : filter.en}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-text" aria-live="polite">
          {tt(lang, `${crops.length}টি ফসল`, `${crops.length} crops`)}
        </p>
        {crops.length === 0 ? (
          <p className="rounded-lg border border-white/10 p-3 text-sm text-muted-text">
            {tt(lang, "এই নামে কোনো ফসল পাওয়া যায়নি।", "No crops match that name.")}
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {crops.map((crop) => {
              const photo = CROP_REFERENCE_PHOTOS[crop.photo];
              return (
                <li key={crop.id} className="group overflow-hidden rounded-xl border border-white/10 bg-surface">
                  <CropPhoto crop={crop} lang={lang} />
                  <div className="space-y-1.5 p-3">
                    <h4 className="font-semibold leading-snug text-primary-text">{lang === "bn" ? crop.nameBn : crop.nameEn}</h4>
                    <p className="text-xs text-agri-green">{lang === "bn" ? crop.seasonBn : crop.seasonEn}</p>
                    <p className="text-xs leading-relaxed text-muted-text">{lang === "bn" ? crop.areasBn : crop.areasEn}</p>
                    {crop.photoNoteEn && (
                      <p className="text-[10px] text-muted-text">{lang === "bn" ? crop.photoNoteBn : crop.photoNoteEn}</p>
                    )}
                    <a
                      href={photo.source}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[32px] items-center text-[10px] leading-relaxed text-earth-cyan underline decoration-white/20 underline-offset-2 hover:decoration-earth-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-cyan"
                    >
                      {tt(lang, "ছবি: ", "Photo: ")}{photo.artist} · {photo.license}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </details>
  );
}
