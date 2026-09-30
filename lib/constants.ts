export const SITE_CONFIG = {
  name: "AgriLume",
  tagline: "FROM SPACE. TO SOIL. TO ACTION.",
  statement: "Earth intelligence for better farming decisions.",
  description:
    "Turn Earth observation and climate intelligence into explainable decisions farmers can actually use. Prepared for NASA Space Apps Challenge 2026.",
  url: "https://agrilume.earth",
};

export const NAV_LINKS = [
  { label: "Mission", href: "#mission" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Science", href: "#science" },
  { label: "App", href: "#app" },
] as const;

export const HERO_CONTENT = {
  eyebrow: "EARTH INTELLIGENCE FOR AGRICULTURE",
  headlines: ["FROM SPACE.", "TO SOIL.", "TO ACTION."],
  supporting:
    "Turn Earth and climate intelligence into clearer, explainable decisions farmers can use in the field.",
  primaryCta: {
    label: "Download AgriLume",
    href: "#download",
  },
  secondaryCta: {
    label: "Explore How It Works",
    href: "#how-it-works",
  },
  trustLine: "Earth context • Evidence • Farmer action",
  demoContext: {
    satelliteLayer: "EARTH OBSERVATION LAYER",
    orbitalContext: "ORBITAL + CLIMATE CONTEXT",
    demoRegion: "RAJSHAHI • BANGLADESH",
    previewMode: "DEMONSTRATION PREVIEW",
    status: "MISSION CONCEPT • PHASE 2",
  },
};

export const FARMER_PROBLEM_CONTENT = {
  eyebrow: "02 / THE PROBLEM / A real decision in the field.",
  headingLine1: "A FARMER SEES THE FIELD.",
  headingLine2: "BUT NOT EVERYTHING SHAPING IT.",
  supporting:
    "Rainfall timing, heat, changing conditions, and crop context can turn a simple question into a difficult decision.",
  heroQuote: "“Should I plant today — or wait?”",
  uncertaintyCards: [
    {
      id: "weather",
      category: "WEATHER",
      question: "What happens next?",
      icon: "cloud",
      accent: "#36BFFA",
    },
    {
      id: "timing",
      category: "TIMING",
      question: "Is this the right window?",
      icon: "clock",
      accent: "#59D98E",
    },
    {
      id: "evidence",
      category: "EVIDENCE",
      question: "What supports the decision?",
      icon: "file-text",
      accent: "#D7A86E",
    },
  ],
};

export const FIELD_COMPARISON_CONTENT = {
  eyebrow: "03 / SAME FIELD MORE CONTEXT / One field. Two perspectives.",
  heading: "SAME FIELD. MORE CONTEXT.",
  supporting:
    "AgriLume combines what farmers already know with environmental evidence that can be difficult to see from the ground alone.",
};

export const DOWNLOAD_CONTENT = {
  eyebrow: "06 / DOWNLOAD AGRILUME / Take AgriLume to the field.",
  heading: "TAKE AGRILUME TO THE FIELD.",
  supporting:
    "Earth intelligence, field context, and practical guidance — available where farming decisions happen.",
};
