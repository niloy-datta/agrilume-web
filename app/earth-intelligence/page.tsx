import type { Metadata } from "next";
import { EarthIntelligenceMap } from "@/components/earth-intelligence/EarthIntelligenceMap";

export const metadata: Metadata = {
  title: "Earth Intelligence Map — AgriLume",
  description:
    "Interactive 64-district Earth Intelligence Observatory for Bangladesh powered by authentic NASA POWER, HLS, SMAP, GPM IMERG, OPERA, and NEX-GDDP-CMIP6 data.",
};

export default function EarthIntelligencePage() {
  return <EarthIntelligenceMap />;
}

