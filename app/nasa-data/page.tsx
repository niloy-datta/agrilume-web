import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NASA data for farming — AgriLume",
  description: "Which NASA Earth-observation datasets matter for farming in Bangladesh, and which ones AgriLume really uses today.",
};
import { NasaDataView } from "@/components/timetravel/ui/page-views";

export default function NasaDataPage() {
  return <NasaDataView />;
}
