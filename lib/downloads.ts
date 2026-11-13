/**
 * Android release configuration.
 *
 * Release-aware rules (enforced by `androidRelease()` and tests/downloads.test.ts):
 *  - A download button, QR code, version, size or checksum is shown ONLY when `status === "AVAILABLE"` and every
 *    field below is filled with values taken from a real, published APK (e.g. a GitHub Release asset).
 *  - Until then the site shows a clearly labelled "Coming soon" state. No placeholder metadata is ever displayed.
 *
 * To publish a release: upload the APK to a GitHub Release, run `sha256sum app-release.apk`, fill in the fields,
 * set status to "AVAILABLE", and run `npm test` (it validates the shape).
 */
export interface AvailableRelease {
  status: "AVAILABLE";
  version: string;
  /** HTTPS URL of the published APK */
  apkUrl: string;
  fileSizeBytes: number;
  sha256: string;
  minAndroid: string;
  releasedOn: string; // YYYY-MM-DD
  releaseNotesUrl: string;
}

export interface UnreleasedApp {
  status: "COMING_SOON";
}

export type AndroidRelease = AvailableRelease | UnreleasedApp;

export const REPO_URL = "https://github.com/niloy-datta/agrilume-web";
export const ANDROID_APP_REPO_URL = "https://github.com/niloy-datta/agri-guardian";
/** GitHub lets anyone "Watch → Custom → Releases" here; no personal data is collected by this site. */
export const RELEASES_URL = `${REPO_URL}/releases`;

/** No verified APK has been published yet (checked 2026-11-13: the repository has no releases). */
export const ANDROID_RELEASE: AndroidRelease = { status: "COMING_SOON" };

/** Returns a release only if it is complete and plausible; anything else is treated as not released. */
export function androidRelease(r: AndroidRelease = ANDROID_RELEASE): AvailableRelease | null {
  if (r.status !== "AVAILABLE") return null;
  const ok =
    /^https:\/\/[^\s]+\.apk$/i.test(r.apkUrl) &&
    /^[a-f0-9]{64}$/.test(r.sha256) &&
    Number.isInteger(r.fileSizeBytes) &&
    r.fileSizeBytes > 100_000 &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.releasedOn) &&
    r.version.trim().length > 0 &&
    /^https:\/\//.test(r.releaseNotesUrl);
  return ok ? r : null;
}

export function formatBytes(n: number): string {
  return n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}
