// episode-videos.server.ts — load the committed episode→video map at build
// time. Route loaders and assemble-dist call this; it must not ship to the
// browser.

import { readFileSync } from "node:fs";
import { type EpisodeVideos, episodeVideosSchema, indexEpisodeVideos, type EpisodeVideoItem } from "./episode-videos.ts";
import { EPISODE_VIDEOS } from "./paths.ts";

let cached: EpisodeVideos | undefined;

export function loadEpisodeVideos(path = EPISODE_VIDEOS): EpisodeVideos {
  cached ??= episodeVideosSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  return cached;
}

export function episodeVideoOf(slug: string, path = EPISODE_VIDEOS): EpisodeVideoItem | undefined {
  return indexEpisodeVideos(loadEpisodeVideos(path)).get(slug);
}
