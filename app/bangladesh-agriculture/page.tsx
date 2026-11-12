import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bangladesh government agriculture resources — AgriLume",
  description: "Official Bangladesh agriculture, weather, flood and disaster agencies, with what each one is for. AgriLume links to them; it is not an official service.",
};
import { GovView } from "@/components/timetravel/ui/page-views";

export default function BangladeshAgriculturePage() {
  return <GovView />;
}
