// Twitch's parent= follows the page's host; other players load as given.

import { describe, expect, it } from "vite-plus/test";
import { embedUrl } from "../../app/lib/embed-url";

describe("embedUrl", () => {
  it("adds the page's hostname as parent= when asked", () => {
    expect(
      embedUrl("https://player.twitch.tv/?channel=canarycryradio", true, "stucny.github.io"),
    ).toBe("https://player.twitch.tv/?channel=canarycryradio&parent=stucny.github.io");
    expect(
      embedUrl("https://www.twitch.tv/embed/canarycryradio/chat", true, "stucny.github.io"),
    ).toBe("https://www.twitch.tv/embed/canarycryradio/chat?parent=stucny.github.io");
  });

  it("leaves other players' URLs alone", () => {
    const src = "https://player.restream.io/?token=abc";
    expect(embedUrl(src, false, "stucny.github.io")).toBe(src);
  });
});
