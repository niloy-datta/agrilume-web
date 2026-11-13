import type { Metadata } from "next";
import { DecisionLab } from "@/components/decision-lab/DecisionLab";

export const metadata: Metadata = {
  title: "Agricultural Decision Twin Lab — AgriLume",
  description:
    "Simulate alternative farming decisions side-by-side (Scenario A vs Scenario B) under NASA Earth and climate evidence.",
};

export default function DecisionLabPage() {
  return <DecisionLab />;
}

