import { describe, expect, it } from "vite-plus/test";
import {
  isLibsynAudio,
  mergeEpisodes,
  normalizeAudioKey,
  titleDateKey,
  type ArchiveItem,
} from "../../app/lib/episode-archive";
import type { Episode } from "../../app/lib/feed";

function episode(partial: Partial<Episode> & Pick<Episode, "slug" | "guid" | "title">): Episode {
  return {
    published: "2019-06-12T12:00:00.000Z",
    audioUrl: `https://traffic.libsyn.com/clean/secure/canarycrynewstalk/${partial.slug}.mp3?dest-id=400745`,
    audioType: "audio/mpeg",
    notesHtml: "<p>Notes</p>",
    excerpt: "Notes",
    ...partial,
  };
}

function archive(partial: Partial<ArchiveItem> & Pick<ArchiveItem, "slug" | "guid" | "title">): ArchiveItem {
  return {
    ...episode(partial),
    ...partial,
  };
}

describe("normalizeAudioKey", () => {
  it("treats /clean and dest-id query strings as the same file", () => {
    expect(
      normalizeAudioKey(
        "https://traffic.libsyn.com/clean/secure/canarycrynewstalk/143CCNT_06.12.2019_omarchuck.mp3?dest-id=400745",
      ),
    ).toBe(
      normalizeAudioKey(
        "https://traffic.libsyn.com/secure/canarycrynewstalk/143CCNT_06.12.2019_omarchuck.mp3?dest-id=721209",
      ),
    );
  });
});

describe("isLibsynAudio", () => {
  it("allows https traffic.libsyn.com only", () => {
    expect(isLibsynAudio("https://traffic.libsyn.com/secure/canarycrynewstalk/a.mp3")).toBe(true);
    expect(isLibsynAudio("http://traffic.libsyn.com/secure/canarycrynewstalk/a.mp3")).toBe(false);
    expect(isLibsynAudio("https://example.com/a.mp3")).toBe(false);
  });
});

describe("mergeEpisodes", () => {
  const live143 = episode({
    slug: "143-ccnt-the-beast-from-down-under-06122019",
    guid: "feed-guid-143",
    title: '143 CCNT "The Beast from Down Under!" - 06.12.2019',
  });

  it("keeps live slugs and GUIDs when the archive has the same enclosure", () => {
    const older = archive({
      slug: "different-slug-for-143",
      guid: "libsyn-item-999",
      title: live143.title,
      published: "2019-06-12T12:00:00.000Z",
      audioUrl: "https://traffic.libsyn.com/secure/canarycrynewstalk/143-ccnt-the-beast-from-down-under-06122019.mp3",
    });
    // same filename as the live row
    const clash = archive({
      ...older,
      audioUrl: live143.audioUrl.replace("/clean", "").split("?")[0]!,
    });
    const merged = mergeEpisodes([live143], [clash]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.slug).toBe(live143.slug);
    expect(merged[0]?.guid).toBe(live143.guid);
  });

  it("adds archive-only episodes and suffixes a colliding slug", () => {
    const recovered = archive({
      slug: live143.slug,
      guid: "libsyn-item-1",
      title: 'CCNT "Quantum Lochte" - 8.22.16',
      published: "2016-08-23T12:00:00.000Z",
      audioUrl: "https://traffic.libsyn.com/secure/canarycrynewstalk/CCNT_001_intro_quantum_lochte_stories.mp3",
      itemId: 4611809,
    });
    const merged = mergeEpisodes([live143], [recovered]);
    expect(merged).toHaveLength(2);
    expect(merged[0]?.guid).toBe(live143.guid);
    expect(merged[1]?.guid).toBe("libsyn-item-1");
    expect(merged[1]?.slug).toBe(`${live143.slug}-2`);
  });

  it("dedupes by title and date, and drops non-Libsyn audio", () => {
    const same = archive({
      slug: "copy",
      guid: "other-guid",
      title: live143.title,
      published: "2019-06-12T00:00:00.000Z",
      audioUrl: "https://traffic.libsyn.com/secure/canarycrynewstalk/totally-different.mp3",
    });
    const remote = archive({
      slug: "offsite",
      guid: "offsite",
      title: "Offsite episode",
      published: "2016-08-23T12:00:00.000Z",
      audioUrl: "https://example.com/secret.mp3",
    });
    expect(titleDateKey(same.title, same.published)).toBe(titleDateKey(live143.title, live143.published));
    const merged = mergeEpisodes([live143], [same, remote]);
    expect(merged).toHaveLength(1);
  });
});
