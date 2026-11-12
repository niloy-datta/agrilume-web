import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  env: {
    // shown in the Time Travel help dialog so anyone can tell exactly which build they are looking at
    NEXT_PUBLIC_BUILD_SHA: (process.env.GITHUB_SHA || process.env.NEXT_PUBLIC_BUILD_SHA || "local-build").slice(0, 12),
  },
};

export default nextConfig;
