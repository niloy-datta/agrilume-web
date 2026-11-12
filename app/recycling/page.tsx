import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop residue recycling and the circular farm — AgriLume",
  description: "Estimate straw and husk from your field and see where it can go instead of the fire: compost, mushroom, feed, biogas, biochar and mulch.",
};
import { RecycleView } from "@/components/timetravel/ui/page-views";

export default function RecyclingPage() {
  return <RecycleView />;
}
