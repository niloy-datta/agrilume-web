"use client";

import React from "react";
import { InfoPage } from "./InfoPage";
import { DataRegistry, GovDirectory, RecycleCalculator } from "./info-panels";

export function NasaDataView() {
  return (
    <InfoPage
      title={{ bn: "কৃষির জন্য NASA ডেটা", en: "NASA data for farming" }}
      intro={{
        bn: "বাংলাদেশের কৃষির জন্য প্রাসঙ্গিক NASA ডেটাসেটগুলোর তালিকা — প্রতিটির পাশে সৎভাবে লেখা, অ্যাগ্রিলিউম আজ আসলে কোনগুলো ব্যবহার করে আর কোনগুলো এখনো কেবল নথিভুক্ত।",
        en: "The NASA datasets relevant to farming in Bangladesh — each with an honest note on whether AgriLume actually uses it today or only documents it.",
      }}
    >
      {(lang) => <DataRegistry lang={lang} />}
    </InfoPage>
  );
}

export function GovView() {
  return (
    <InfoPage
      title={{ bn: "বাংলাদেশ সরকারের কৃষি সংস্থা ও সেবা", en: "Bangladesh government agriculture resources" }}
      intro={{
        bn: "কৃষি পরামর্শ, আবহাওয়া ও বন্যার সতর্কতা, দুর্যোগ প্রস্তুতি — কোন সংস্থা কী দেয় এবং কখন কাকে ডাকবেন।",
        en: "Farming advice, weather and flood warnings, disaster preparedness — what each agency provides and who to contact when.",
      }}
    >
      {(lang) => <GovDirectory lang={lang} />}
    </InfoPage>
  );
}

export function RecycleView() {
  return (
    <InfoPage
      title={{ bn: "বৃত্তাকার খামার: খড়-তুষ পুনর্ব্যবহার", en: "Circular farm: recycling straw and husk" }}
      intro={{
        bn: "ফসল তোলার পর খড়, তুষ ও পানি কোথায় যেতে পারে — পুড়িয়ে ফেলার বদলে কাজে লাগানোর আনুমানিক হিসাব।",
        en: "Where straw, husk and water can go after harvest — approximate numbers for using them instead of burning them.",
      }}
    >
      {(lang) => <RecycleCalculator lang={lang} />}
    </InfoPage>
  );
}
