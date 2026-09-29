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

export const FARMER_PROBLEM_CONTENT = {
  eyebrow: "THE DECISION ON THE GROUND",
  headline: "A FARMER SEES THE FIELD. BUT NOT EVERYTHING SHAPING IT.",
  supporting:
    "Rainfall timing, heat, changing conditions, and crop context can turn a simple question into a difficult decision.",
  heroQuestion: "“Should I plant today — or wait?”",
  uncertaintyCues: [
    {
      category: "WEATHER",
      question: "What happens next?",
      detail: "Cloud cover vs. rainfall likelihood across the critical germination window.",
    },
    {
      category: "TIMING",
      question: "Is this the right window?",
      detail: "Soil thermal readiness and root-zone moisture holding capacity.",
    },
    {
      category: "EVIDENCE",
      question: "What supports the decision?",
      detail: "Multi-season climate patterns beyond what eyes can observe today.",
    },
  ],
};

export const FIELD_COMPARISON_CONTENT = {
  eyebrow: "EVIDENCE BEFORE ADVICE",
  headline: "SAME FIELD. MORE CONTEXT.",
  supporting:
    "AgriLume combines what farmers already know with environmental evidence that can be difficult to see from the ground alone.",
  equation: {
    left: "LOCAL KNOWLEDGE",
    operator1: "+",
    middle: "EARTH INTELLIGENCE",
    operator2: "→",
    right: "BETTER-INFORMED DECISIONS",
  },
  farmerView: {
    title: "WHAT THE FARMER SEES",
    badge: "GROUND OBSERVATION",
    subtitle: "Empirical field knowledge & visual soil cues",
    quote: "“You can see the field. But some of the forces shaping tomorrow are harder to see.”",
    layers: [
      { id: "sky", label: "SKY & HORIZON", hint: "Local cloud formations and immediate wind shift" },
      { id: "field", label: "FIELD CONDITION", hint: "Surface dryness, crusting, and soil texture" },
      { id: "crop", label: "VISIBLE CROP SIGNALS", hint: "Canopy color, leaf posture, and localized wilt" },
      { id: "state", label: "CURRENT FIELD STATE", hint: "Day-of-work operational readiness" },
    ],
  },
  agrilumeView: {
    title: "WHAT AGRILUME SEES",
    badge: "INTELLIGENCE LAYER",
    subtitle: "Environmental observations & explainable climate context",
    layers: [
      { id: "rainfall", label: "RAINFALL CONTEXT", hint: "Multi-week precipitation trends & soil moisture deficit context" },
      { id: "temp", label: "TEMPERATURE TREND", hint: "Thermal accumulation & forecast heat stress windows" },
      { id: "seasonal", label: "SEASONAL PATTERN", hint: "Decadal climate normal comparison & monsoon onset timing" },
      { id: "history", label: "FIELD HISTORY", hint: "Multi-year crop response zones across varying rainfall cycles" },
      { id: "evidence", label: "EVIDENCE & LIMITATIONS", hint: "Sensor revisit intervals, cloud interference flags, and confidence bounds" },
    ],
  },
};

