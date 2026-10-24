import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { parseFeed, plainExcerpt, sanitizeNotes, slugify } from "../../app/lib/feed";

const episodes = parseFeed(readFileSync("tests/fixtures/feed.xml", "utf8"));
const byGuid = (g: string) => episodes.find((e) => e.guid === g)!;

describe("parseFeed", () => {
  it("keeps items with playable audio, newest first", () => {
    expect(episodes.map((e) => e.guid)).toEqual(["guid-flat", "guid-901", "guid-dup", "guid-900"]);
  });

  it("takes the slug from the Libsyn link and de-duplicates it", () => {
    expect(byGuid("guid-901").slug).toBe("newest-episode-ccnt-901");
    expect(byGuid("guid-900").slug).toBe("older-episode-ccnt-900");
    expect(byGuid("guid-dup").slug).toBe("older-episode-ccnt-900-2");
  });

  it("decodes title entities and normalises URLs to https", () => {
    const e = byGuid("guid-900");
    expect(e.title).toBe("OLDER EPISODE & FRIENDS | CCNT 900");
    expect(e.audioUrl).toMatch(/^https:\/\/traffic\.libsyn\.com\//);
    expect(e.published).toBe("2026-06-01T05:00:00.000Z");
  });

  it("falls back to the channel art", () => {
    expect(byGuid("guid-900").artUrl).toBe("https://static.libsyn.com/p/assets/channel.png");
    expect(byGuid("guid-901").artUrl).toBe("https://static.libsyn.com/p/assets/901.png");
    expect(byGuid("guid-901").duration).toBe("02:00:01");
  });

  it("takes the description when content:encoded is a flattened copy", () => {
    expect(byGuid("guid-flat").notesHtml).toBe(
      "<div><strong>Line one</strong></div><div>Line two</div>",
    );
  });

  it("prefers content:encoded and sanitises it", () => {
    const html = byGuid("guid-901").notesHtml;
    expect(html).toContain("<h2>Top</h2>");
    expect(html).toContain("<div>Big story</div>");
    expect(html).toContain(
      '<a href="https://CanaryCry.Support" rel="noopener noreferrer nofollow">Support</a>',
    );
    expect(html).toContain("🧬");
    for (const banned of [
      "<script",
      "alert(1)",
      "<iframe",
      "<img",
      "style=",
      "class=",
      "data-",
      "onclick",
      "javascript:",
      "target=",
    ]) {
      expect(html).not.toContain(banned);
    }
    expect(html).not.toContain("<span></span>");
  });
});

describe("helpers", () => {
  it("sanitizeNotes drops tracking attributes and unknown tags", () => {
    expect(sanitizeNotes('<p class="x"><font>hi</font></p>')).toBe("<p>hi</p>");
  });

  it("plainExcerpt cuts to whole words and decodes entities", () => {
    expect(plainExcerpt("<p>one &amp; two three</p>", 3)).toBe("one & two…");
    expect(plainExcerpt("<p>short</p>")).toBe("short");
    expect(plainExcerpt("<p>hear from you</p><p>at the show</p>")).toBe(
      "hear from you at the show",
    );
  });

  it("slugify", () => {
    expect(slugify("Hunter’s RE-ENCHANTMENT!")).toBe("hunter-s-re-enchantment");
    expect(slugify("Café Déjà")).toBe("cafe-deja");
  });
});
