import type { Metadata } from "next";
import { ClimateRiskLab } from "@/components/climate-risk/ClimateRiskLab";

export const metadata: Metadata = {
  title: "Flood & Drought Evidence Lab — AgriLume",
  description:
    "Evidence-grounded climate hazard and risk analysis platform for Bangladesh agriculture using authentic NASA OPERA, SMAP, and GPM remote sensing records.",
};

export default function ClimateRiskPage() {
  return <ClimateRiskLab />;
}

