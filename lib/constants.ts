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
  { label: "Comparison", href: "#science" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Mobile App", href: "#app" },
] as const;

export const HERO_CONTENT = {
  eyebrow: "EARTH INTELLIGENCE FOR AGRICULTURE",
  headlines: ["FROM SPACE.", "TO SOIL.", "TO ACTION."],
  supporting:
    "Turn Earth and climate intelligence into clearer, explainable decisions farmers can use in the field.",
  primaryCta: {
    label: "Download AgriLume ↓",
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

export const HOW_IT_WORKS_CONTENT = {
  eyebrow: "SYSTEM ARCHITECTURE",
  headline: "FROM SATELLITE RADIANCE TO FIELD ACTION.",
  supporting:
    "A transparent, 4-step pipeline that translates orbital observations into explainable decisions.",
  steps: [
    {
      num: "01",
      title: "OBSERVE",
      stage: "EARTH OBSERVATION",
      desc: "Multispectral satellites capture environmental signals, surface temperatures, and vegetation patterns.",
      tags: ["Orbital Radiance", "Climate Reanalysis", "Vegetation Indices"],
    },
    {
      num: "02",
      title: "UNDERSTAND",
      stage: "SCIENTIFIC CONTEXT",
      desc: "Observations are contextualized against seasonal baselines, historical soil moisture, and local weather patterns.",
      tags: ["Biophysical Retrieval", "Soil Moisture Index", "Thermal Anomalies"],
    },
    {
      num: "03",
      title: "DECIDE",
      stage: "AGRONOMIC EVIDENCE",
      desc: "Algorithms evaluate critical agronomic thresholds with explicit confidence levels and transparent limitations.",
      tags: ["Crop Phenology", "Precipitation Window", "Confidence Bounds"],
    },
    {
      num: "04",
      title: "ACT",
      stage: "FARMER GUIDANCE",
      desc: "Evidence is delivered as clear, plain-language advice: when to sow, irrigate, or delay field operations.",
      tags: ["Actionable Timing", "Irrigation Guidance", "Risk Minimization"],
    },
  ],
};

export const APP_SHOWCASE_CONTENT = {
  eyebrow: "MOBILE APPLICATION",
  headline: "THE INTELLIGENCE STAYS COMPLEX. THE EXPERIENCE STAYS SIMPLE.",
  supporting:
    "The website introduces the science. The AgriLume mobile app delivers daily, explainable guidance directly to the farmer in the field.",
  features: [
    {
      id: "overview",
      title: "Field Intelligence Dashboard",
      desc: "One clean view of current soil moisture deficit, 7-day rainfall outlook, and thermal risk.",
    },
    {
      id: "action",
      title: "Action Advisory Cards",
      desc: "Plain-language recommendations with explicit reasons: 'Hold irrigation 48 hrs — rain probability exceeds 75%'.",
    },
    {
      id: "history",
      title: "Multi-Season History",
      desc: "Track field response across different climate conditions to make better long-term soil decisions.",
    },
    {
      id: "offline",
      title: "Offline-First Field Cache",
      desc: "Designed for rural connectivity: telemetry caches locally so farmers have decisions even without network.",
    },
  ],
};

export const DOWNLOAD_CONTENT = {
  eyebrow: "GET STARTED",
  headline: "TAKE AGRILUME TO THE FIELD.",
  supporting:
    "Earth intelligence, field context, and practical guidance — available where farming decisions happen.",
  qrLabel: "SCAN FOR ANDROID PREVIEW",
};

export const SCIENCE_TRUST_CONTENT = {
  eyebrow: "TRANSPARENCY & RIGOR",
  headline: "EVIDENCE BEFORE ADVICE.",
  supporting:
    "AgriLume never presents a recommendation without showing the physical evidence, assumptions, and limitations behind it.",
  pillars: [
    {
      title: "Source Provenance",
      desc: "Every data layer is attributed to verifiable open satellite programs (Landsat, Sentinel, SMAP) and climate observations.",
    },
    {
      title: "Observable vs. Modeled",
      desc: "We strictly differentiate between directly observed surface radiances and estimated biophysical variables like root-zone moisture.",
    },
    {
      title: "Stated Limitations",
      desc: "If cloud cover obscures recent satellite passes or forecast models diverge, the app explicitly communicates reduced confidence.",
    },
    {
      title: "Farmer Agency",
      desc: "AgriLume provides decision support, not automated mandates. Local knowledge and farmer judgment always lead.",
    },
  ],
};

export const TEAM_CONTENT = {
  eyebrow: "MISSION TEAM",
  headline: "BUILT BY THE AGRILUME TEAM",
  supporting: "Developed for the NASA Space Apps Challenge 2026.",
  members: [
    {
      name: "Niloy Datta",
      role: "Lead Software & System Architecture",
      contribution: "Full-stack web architecture, 3D orbital visualization, and client systems",
    },
    {
      name: "AgriLume Science Team",
      role: "Earth Observation & Agronomy Modeling",
      contribution: "Multispectral remote sensing pipelines, soil moisture modeling, and climate indices",
    },
    {
      name: "AgriLume UX Lab",
      role: "Farmer Experience & Field Interaction",
      contribution: "Human-centered mobile design, decision cards, and low-connectivity accessibility",
    },
  ],
};
