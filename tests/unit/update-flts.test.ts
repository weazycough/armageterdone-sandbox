import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

const API_FREE = [
  "scripts/update-flts.ts",
  "scripts/prepare-content.ts",
  ".github/workflows/deploy.yml",
  ".github/workflows/check.yml",
];

describe("FaceLikeTheSun updater", () => {
  it("is API-free and reads the public channel RSS feed", () => {
    for (const file of API_FREE) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/YOUTUBE_API_KEY/);
      expect(text, file).not.toMatch(/googleapis\.com\/youtube/);
    }
    const updater = readFileSync("scripts/update-flts.ts", "utf8");
    expect(updater).toContain("FLTS_RSS_URL");
    expect(updater).toContain("compactDescription");
    expect(updater).not.toContain("trimDescription(");
  });
});
