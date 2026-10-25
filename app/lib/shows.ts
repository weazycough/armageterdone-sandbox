// shows.ts — the three shows of the Canary Cry Network, and which one an
// episode belongs to. The feed mixes all three and doesn't label them, so
// showOf() reads the title ("… | CCNT 983", "… | CCR 196", "… Canary Cry
// Clubhouse") and then the MP3's file name ("CCNT983_mixdown.mp3",
// "Clubhouse_….mp3"). Episodes it can't place (Basil's Bunker, X Spaces,
// specials) are only in the full list. Each show has a list at /tag/<slug>/,
// as the Ghost theme's tag pages did.

export const SHOWS = [
  {
    slug: "news-talk",
    title: "Canary Cry News Talk",
    kicker: "The main show",
    nav: "The main show",
    desc: "The flagship discernment broadcast — daily news through a Biblical worldview.",
    art: "images/show-news-talk.webp",
  },
  {
    slug: "radio",
    title: "Canary Cry Radio",
    kicker: "Long-form",
    nav: "Long-form interviews",
    desc: "Deep-cut interviews and conversations with discerners, theologians, and researchers.",
    art: "images/show-radio.webp",
  },
  {
    slug: "clubhouse",
    title: "Canary Cry Clubhouse",
    kicker: "Live",
    nav: "Live conversations",
    desc: "Open-mic conversations with the community. Wade into deep waters together.",
    art: "images/show-clubhouse.webp",
  },
] as const;

export type Show = (typeof SHOWS)[number];
export type ShowSlug = Show["slug"];

export function findShow(slug: string | undefined): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}

/** The MP3's file name, without the query string. */
function fileName(audioUrl: string): string {
  const last = audioUrl.split("?")[0]?.split("/").pop() ?? "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

export function showOf(episode: { title: string; audioUrl: string }): ShowSlug | null {
  const { title } = episode;
  const file = fileName(episode.audioUrl);
  if (/\bCCNT\b/i.test(title)) return "news-talk";
  if (/\bCCR\b/.test(title)) return "radio";
  if (/club ?house|call[- ]?in/i.test(title) || /club ?house|call[-_ ]?in/i.test(file))
    return "clubhouse";
  if (/ccnt/i.test(file)) return "news-talk";
  if (/^ccr/i.test(file)) return "radio";
  return null;
}
