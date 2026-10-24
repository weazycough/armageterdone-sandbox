// react-router.config.ts — a fully static site: no server at runtime
// (ssr: false), every route prerendered to HTML at build time under the
// GitHub Pages project path. scripts/assemble-dist.ts then lays the output
// out as dist/.

import type { Config } from "@react-router/dev/config";
import { loadEpisodes, loadPages } from "./app/lib/content.server";
import {
  BASE,
  NOT_FOUND_PRERENDER_PATH,
  episodeListPath,
  episodePath,
  pageCount,
  pagePath,
} from "./app/lib/paths";

export default {
  ssr: false,
  basename: BASE,
  prerender() {
    const episodes = loadEpisodes();
    const lists = Array.from({ length: pageCount(episodes.length) }, (_, i) =>
      episodeListPath(i + 1),
    );
    return [
      "/",
      ...lists,
      ...episodes.map((e) => episodePath(e.slug)),
      ...loadPages().map((p) => pagePath(p.slug)),
      // Two segments, so only the catch-all route matches (":slug" would take
      // "/404/" and its loader would 404). assemble-dist.ts moves it to /404.html.
      NOT_FOUND_PRERENDER_PATH,
    ];
  },
} satisfies Config;
