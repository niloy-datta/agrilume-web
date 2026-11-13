import { describe, it, expect } from "vitest";
import { ANDROID_RELEASE, androidRelease, formatBytes } from "@/lib/downloads";
import type { AvailableRelease } from "@/lib/downloads";

const good: AvailableRelease = {
  status: "AVAILABLE",
  version: "1.0.0",
  apkUrl: "https://github.com/x/y/releases/download/v1.0.0/app-release.apk",
  fileSizeBytes: 18_000_000,
  sha256: "a".repeat(64),
  minAndroid: "Android 8.0+",
  releasedOn: "2026-12-01",
  releaseNotesUrl: "https://github.com/x/y/releases/tag/v1.0.0",
};

describe("Android release gating", () => {
  it("shows nothing downloadable while no verified APK is published", () => {
    expect(ANDROID_RELEASE.status).toBe("COMING_SOON");
    expect(androidRelease()).toBeNull();
  });
  it("accepts a complete release", () => expect(androidRelease(good)).toEqual(good));
  it.each([
    ["non-https URL", { apkUrl: "http://x/app.apk" }],
    ["placeholder URL", { apkUrl: "#" }],
    ["bad checksum", { sha256: "abc" }],
    ["tiny/unknown size", { fileSizeBytes: 0 }],
    ["missing date", { releasedOn: "soon" }],
    ["blank version", { version: " " }],
  ])("rejects an incomplete release: %s", (_, patch) => {
    expect(androidRelease({ ...good, ...patch } as AvailableRelease)).toBeNull();
  });
  it("formats sizes", () => {
    expect(formatBytes(18_874_368)).toBe("18.0 MB");
    expect(formatBytes(512_000)).toBe("500 KB");
  });
});
