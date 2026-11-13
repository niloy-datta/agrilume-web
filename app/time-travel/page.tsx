import type { Metadata } from "next";
import TimeTravelApp from "@/components/timetravel/TimeTravelApp";

export const metadata: Metadata = {
  title: "AgriLume Time Travel — VR farm simulator for Bangladesh",
  description:
    "Walk a Bangladeshi farm through time in 3D or VR: real NASA POWER weather for past years, clearly labelled what-ifs for the future, hazards, recycling and government resources. Educational simulation, not a forecast.",
  openGraph: {
    title: "AgriLume Time Travel",
    description: "A 3D / WebXR time-travel farm for Bangladesh built on NASA POWER data. Educational — not a forecast.",
    type: "website",
  },
};

export default function TimeTravelPage() {
  return (
    <>
      <noscript>
        <p style={{ padding: 24, color: "#f8fafc" }}>
          AgriLume Time Travel needs JavaScript. / টাইম ট্রাভেল চালাতে JavaScript দরকার।
        </p>
      </noscript>
      <TimeTravelApp />
    </>
  );
}
