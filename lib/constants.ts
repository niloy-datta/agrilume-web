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
  { label: "Science", href: "#science" },
  { label: "Impact", href: "#impact" },
] as const;

export const HERO_CONTENT = {
  eyebrow: "EARTH INTELLIGENCE FOR AGRICULTURE",
  headlines: ["FROM SPACE.", "TO SOIL.", "TO ACTION."],
  supporting:
    "Turn Earth observation and climate intelligence into explainable decisions farmers can actually use.",
  primaryCta: {
    label: "Launch Mission",
    href: "#mission",
  },
  secondaryCta: {
    label: "Explore the Science",
    href: "#science",
  },
  trustLine: "Evidence before advice • Earth data • Farmer action",
  demoContext: {
    satelliteLayer: "EARTH OBSERVATION LAYER",
    orbitalContext: "ORBITAL + CLIMATE CONTEXT",
    demoRegion: "RAJSHAHI • BANGLADESH",
    previewMode: "DEMONSTRATION PREVIEW",
    status: "MISSION CONCEPT • PHASE 1",
  },
};
