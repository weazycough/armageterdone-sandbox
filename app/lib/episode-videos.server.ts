// episode-videos.server.ts — load the committed episode→video map at build
// time. Route loaders and assemble-dist call this; it must not ship to the
// browser.

import { existsSync, readFileSync } from "node:fs";
import {
  type EpisodeVideoItem,
  type EpisodeVideos,
  episodeRumbleSchema,
  episodeVideosSchema,
  indexEpisodeVideos,
  mergeVideoItems,
} from "./episode-videos.ts";
import { EPISODE_RUMBLE, EPISODE_VIDEOS } from "./paths.ts";

let cached: EpisodeVideos | undefined;

function loadRumbleItems(path = EPISODE_RUMBLE): EpisodeVideoItem[] {
  if (!existsSync(path)) return [];
  const catalog = episodeRumbleSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  return catalog.items.map((item) => ({ slug: item.slug, rumbleUrl: item.rumbleUrl }));
}

export function loadEpisodeVideos(path = EPISODE_VIDEOS): EpisodeVideos {
  if (cached !== undefined && path === EPISODE_VIDEOS) return cached;
  const videos = episodeVideosSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const rumble = path === EPISODE_VIDEOS ? loadRumbleItems() : [];
  const items = rumble.length === 0 ? videos.items : mergeVideoItems(videos.items, rumble);
  const data: EpisodeVideos = {
    meta: {
      ...videos.meta,
      rumble: items.filter((item) => item.rumbleUrl !== undefined).length,
    },
    items,
  };
  if (path === EPISODE_VIDEOS) cached = data;
  return data;
}

export function episodeVideoOf(slug: string, path = EPISODE_VIDEOS): EpisodeVideoItem | undefined {
  return indexEpisodeVideos(loadEpisodeVideos(path)).get(slug);
}
