// content.server.ts — build-time readers for the site's content: the episode
// list (written by scripts/prepare-content.ts) and the pages extracted from
// the Ghost export (content/pages, written by scripts/extract-ghost.ts).
// Both are validated with Zod on the way in; route loaders call these during
// prerender, so nothing here ships to the browser.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { type Episode, episodeListSchema } from "./feed";
import { EPISODES_JSON, PAGES_DIR } from "./paths";

export const pageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string(),
  /** Sanitised body HTML. Root-relative links ("/support/") get BASE at render. */
  html: z.string(),
  excerpt: z.string().optional(),
  /** Embeds the extractor replaced with a link, so a later page port can see what was there. */
  removedEmbeds: z.array(z.object({ host: z.string(), src: z.string() })),
  updatedAt: z.string(),
});
export type Page = z.infer<typeof pageSchema>;

let episodes: Episode[] | undefined;
let pages: Page[] | undefined;

export function loadEpisodes(): Episode[] {
  episodes ??= episodeListSchema.parse(JSON.parse(readFileSync(EPISODES_JSON, "utf8")));
  return episodes;
}

export function loadPages(): Page[] {
  pages ??= readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => pageSchema.parse(JSON.parse(readFileSync(join(PAGES_DIR, f), "utf8"))));
  return pages;
}
