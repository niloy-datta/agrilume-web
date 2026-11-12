import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";

// Fonts are self-hosted (app/fonts/*.woff2, SIL OFL) so `next build` works offline
// and Bangla (Noto Sans Bengali) renders correctly without a third-party request.
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-latin.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
  weight: "300 700",
});

const inter = localFont({
  src: "./fonts/Inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const notoBengali = localFont({
  src: "./fonts/NotoSansBengali-bengali.woff2",
  variable: "--font-bengali",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: [
    "Earth Intelligence",
    "Precision Agriculture",
    "NASA Space Apps 2026",
    "Satellite Remote Sensing",
    "Climate Intelligence",
    "Soil Moisture",
    "Agricultural Decisions",
    "Agrilume Time Travel",
    "WebXR Virtual Reality Farming",
    "Bangladesh Agriculture",
    "NASA POWER",
    "Crop Residue Recycling",
  ],
  authors: [{ name: "AgriLume Mission Team" }],
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.statement,
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050A12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${notoBengali.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#050A12] text-[#F8FAFC] font-sans antialiased selection:bg-[#36BFFA]/20 selection:text-[#36BFFA] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
