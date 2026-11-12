import { describe, expect, it } from "vite-plus/test";
import { cleanShowNotes } from "../../app/lib/show-notes";

describe("cleanShowNotes", () => {
  it("removes Podcasting 2.0 / PodcastIndex and Value 4 Value promo lines", () => {
    const html = [
      "<div>Hello world</div>",
      '<div> Podcasting 2.0:  <a href="https://PodcastIndex.org">https://PodcastIndex.org</a></div>',
      "<div>Producers of TIME</div>",
      '<div> Learn More About Value 4 Value: <a href="https://value4value.info/">https://value4value.info/</a></div>',
    ].join(" ");
    const out = cleanShowNotes(html);
    expect(out).toContain("Hello world");
    expect(out).toContain("Producers of TIME");
    expect(out).not.toMatch(/Podcasting 2\.0/i);
    expect(out).not.toMatch(/PodcastIndex/i);
    expect(out).not.toMatch(/value4value/i);
  });

  it("keeps a rundown line that is not a promo block", () => {
    const html = "<div>PODCASTING/VALUE FOR VALUE 1:00:30</div>";
    expect(cleanShowNotes(html)).toBe(html);
  });
});
