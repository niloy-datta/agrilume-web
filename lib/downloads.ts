export interface DownloadConfig {
  platform: string;
  version: string;
  releaseStatus: "AVAILABLE" | "COMING_SOON" | "BETA_INVITE";
  apkUrl: string | null;
  fileSize: string;
  minAndroidVersion: string;
  releaseDate: string;
  sha256Checksum: string | null;
}

export const APP_DOWNLOAD_CONFIG: DownloadConfig = {
  platform: "Android APK",
  version: "v0.9.4-preview",
  releaseStatus: "COMING_SOON",
  apkUrl: null, // Transparently null: no fake URL. Enables "Coming Soon" / Notification registration.
  fileSize: "18.4 MB",
  minAndroidVersion: "Android 8.0 (API 26) or newer",
  releaseDate: "NASA Space Apps 2026 Preview",
  sha256Checksum: null,
};
