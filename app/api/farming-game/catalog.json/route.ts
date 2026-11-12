import { DISTRICTS, DIVISIONS } from "@/lib/timetravel/locations";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ districts: DISTRICTS, divisions: DIVISIONS });
}
