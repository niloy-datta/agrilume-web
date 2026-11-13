import { describe, expect, it } from "vitest";
import { CROP_REFERENCE, CROP_REFERENCE_PHOTOS } from "../lib/timetravel/crop-reference";

describe("Bangladesh crop reference", () => {
  it("includes the crops from the seasonal reference document", () => {
    expect(CROP_REFERENCE).toHaveLength(53);
    expect(new Set(CROP_REFERENCE.map((crop) => crop.id)).size).toBe(CROP_REFERENCE.length);
    expect(CROP_REFERENCE.map((crop) => crop.id)).toEqual(
      expect.arrayContaining(["aus", "aman", "boro", "katimon-mango", "betel-leaf", "mulberry"]),
    );
  });

  it("provides an attributed photo source for every crop card", () => {
    for (const crop of CROP_REFERENCE) {
      const photo = CROP_REFERENCE_PHOTOS[crop.photo];
      expect(photo.src, crop.id).toMatch(/^https:\/\//);
      expect(photo.source, crop.id).toContain("commons.wikimedia.org/wiki/File:");
      expect(photo.artist, crop.id).not.toBe("");
      expect(photo.license, crop.id).not.toBe("");
    }
  });
});
