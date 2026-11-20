import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { episodeRumbleSchema } from "../../app/lib/episode-videos";
import { EPISODE_RUMBLE } from "../../app/lib/paths";

const RUMBLE_URL = /^https:\/\/(?:www\.)?rumble\.com\/v[0-9a-z]+(?:-[\w.-]+)?\.html\/?$/i;

describe("episode rumble map", () => {
  const catalog = episodeRumbleSchema.parse(JSON.parse(readFileSync(EPISODE_RUMBLE, "utf8")));

  it("contains valid unique rumble.com URLs, one per episode", () => {
    expect(catalog.items.length).toBeGreaterThan(700);
    expect(catalog.meta.included).toBe(catalog.items.length);
    const urls = catalog.items.map((item) => item.rumbleUrl);
    const slugs = catalog.items.map((item) => item.slug);
    expect(urls.every((url) => RUMBLE_URL.test(url))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
