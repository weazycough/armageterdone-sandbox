// network-latest.server.ts — pick each Canary Cry Network show's latest episode
// artwork for the Shows page tile grid. News Talk / Radio / Clubhouse come from
// showOf(); Basil's Bunker and Burning Man Research are matched by title in the
// main feed; Joyspiracy Theory is a separate Libsyn feed cached at build time
// in NETWORK_LATEST_JSON (see scripts/prepare-content.ts).

import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Episode } from "./feed";
import { NETWORK_LATEST_JSON } from "./paths";
import { NETWORK_SHOWS, showOf, type NetworkShow } from "./shows";

const thumbSchema = z.object({
  title: z.string().min(1),
  published: z.string().min(1),
  artUrl: z.url({ protocol: /^https$/ }),
  /** Internal episode slug when the episode is on this site. */
  slug: z.string().optional(),
  /** Off-site episode page when the episode is not in our feed. */
  externalUrl: z.url({ protocol: /^https$/ }).optional(),
});
export type NetworkShowThumb = z.infer<typeof thumbSchema>;

const networkLatestSchema = z.object({
  joyspiracy: thumbSchema.nullable(),
});
export type NetworkLatestFile = z.infer<typeof networkLatestSchema>;

export type NetworkShowTile = NetworkShow & {
  latest: NetworkShowThumb | null;
};

function asThumb(e: Episode): NetworkShowThumb | null {
  if (!e.artUrl) return null;
  return {
    title: e.title,
    published: e.published,
    artUrl: e.artUrl,
    slug: e.slug,
  };
}

/** Latest main-feed episode classified as this showOf() slug. */
function latestByShowOf(episodes: Episode[], slug: "news-talk" | "radio" | "clubhouse"): NetworkShowThumb | null {
  for (const e of episodes) {
    if (showOf(e) === slug) return asThumb(e);
  }
  return null;
}

function isBasilsBunker(e: Episode): boolean {
  return /^basil'?s\s+bunker\b/i.test(e.title);
}

/** CCR / FLYBY Burning Man research episodes — not Clubhouse or CCNT mentions. */
export function isBurningManResearchEpisode(e: Episode): boolean {
  const t = e.title;
  if (/club\s*house|call[- ]?in/i.test(t)) return false;
  if (/\bCCNT\b/i.test(t)) return false;
  const bm = /burning\s*man|black\s*rock\s*city|trippin['’]?\s*on\s*jesus/i.test(t);
  if (!bm) return false;
  return /\bCCR\b/.test(t) || /\bFLYBY\b/i.test(t) || /^burning\s*man\b/i.test(t);
}

function latestMatching(episodes: Episode[], pred: (e: Episode) => boolean): NetworkShowThumb | null {
  for (const e of episodes) {
    if (pred(e)) return asThumb(e);
  }
  return null;
}

export function loadNetworkLatestFile(): NetworkLatestFile {
  try {
    return networkLatestSchema.parse(JSON.parse(readFileSync(NETWORK_LATEST_JSON, "utf8")));
  } catch {
    return { joyspiracy: null };
  }
}

/** Build the six Shows-page tiles with live latest-episode thumbnails. */
export function networkShowTiles(
  episodes: Episode[],
  extras: NetworkLatestFile = loadNetworkLatestFile(),
): NetworkShowTile[] {
  const bySlug: Record<string, NetworkShowThumb | null> = {
    "news-talk": latestByShowOf(episodes, "news-talk"),
    radio: latestByShowOf(episodes, "radio"),
    clubhouse: latestByShowOf(episodes, "clubhouse"),
    joyspiracy: extras.joyspiracy,
    "burning-man-research": latestMatching(episodes, isBurningManResearchEpisode),
    "basils-bunker": latestMatching(episodes, isBasilsBunker),
  };
  return NETWORK_SHOWS.map((show) => ({
    ...show,
    latest: bySlug[show.slug] ?? null,
  }));
}
