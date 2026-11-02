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
    /** Title logo in the tag-page hero; null until art lands (placeholder). */
    logo: "images/newstalk-logo.webp",
  },
  {
    slug: "radio",
    title: "Canary Cry Radio",
    kicker: "Long-form",
    nav: "Long-form interviews",
    desc: "Deep-cut interviews and conversations with discerners, theologians, and researchers.",
    art: "images/show-radio.webp",
    logo: null,
  },
  {
    slug: "clubhouse",
    title: "Canary Cry Clubhouse",
    kicker: "Live",
    nav: "Live conversations",
    desc: "Open-mic conversations with the community. Wade into deep waters together.",
    art: "images/show-clubhouse.webp",
    logo: null,
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

// The six monitors on the Shows page (issue #9 Option C). The first three
// match SHOWS above; Burning Man Research has its own page; Joyspiracy and
// Basil's Bunker still need a destination and art.
export type NetworkShow = {
  slug: string;
  title: string;
  /** Short line under the monitor in list views; null = still open. */
  desc: string | null;
  /** Internal path, or null when the link is still open. */
  href: string | null;
  /** public/ asset path, or null for the colour-bar placeholder. */
  art: string | null;
};

export const NETWORK_SHOWS: NetworkShow[] = [
  {
    slug: "news-talk",
    title: "Canary Cry News Talk",
    desc: "The flagship discernment broadcast — daily news through a Biblical worldview.",
    href: "/tag/news-talk/",
    art: "images/show-news-talk.webp",
  },
  {
    slug: "radio",
    title: "Canary Cry Radio",
    desc: "Deep-cut interviews and conversations with discerners, theologians, and researchers.",
    href: "/tag/radio/",
    art: "images/show-radio.webp",
  },
  {
    slug: "clubhouse",
    title: "Canary Cry Clubhouse",
    desc: "Open-mic conversations with the community. Wade into deep waters together.",
    href: "/tag/clubhouse/",
    art: "images/show-clubhouse.webp",
  },
  {
    slug: "joyspiracy",
    title: "The Joyspiracy Theory",
    desc: null,
    href: null,
    art: null,
  },
  {
    slug: "burning-man-research",
    title: "Burning Man Research",
    desc: "The show has covered Burning Man for over a decade — annual fieldwork, theological analysis, and producer-funded ground-truthing.",
    href: "/burningmanresearch/",
    art: "content/images/e2f8d5c0-83360211-6a87-d7bf-6741-59b8ca567492.jpg",
  },
  {
    slug: "basils-bunker",
    title: "Basil's Bunker",
    desc: null,
    href: null,
    art: null,
  },
];

/** Shows on the network page that still need a link and/or art. */
export const NETWORK_SHOW_OPEN_ITEMS = NETWORK_SHOWS.filter(
  (s) => s.href === null || s.art === null,
);
