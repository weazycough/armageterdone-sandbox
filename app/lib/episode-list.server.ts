// episode-list.server.ts — one page of an episode list (the full archive or a
// show's), for the list routes' loaders. Page 1 is the list's own URL;
// ".../page/1/" and pages past the end are 404s.

import { data } from "react-router";
import type { Episode } from "./feed";
import { EPISODES_PER_PAGE, pageCount } from "./paths";

export function listPage(episodes: Episode[], pageParam: string | undefined) {
  const pages = pageCount(episodes.length);
  const page = pageParam === undefined ? 1 : Number(pageParam);
  if (!Number.isInteger(page) || page < 1 || page > pages || pageParam === "1") {
    throw data(null, { status: 404 });
  }
  const start = (page - 1) * EPISODES_PER_PAGE;
  return {
    page,
    pages,
    total: episodes.length,
    // Card fields only: the show notes stay out of the list pages' data.
    episodes: episodes
      .slice(start, start + EPISODES_PER_PAGE)
      .map(({ slug, title, published, excerpt, duration }) => ({
        slug,
        title,
        published,
        excerpt,
        duration,
      })),
  };
}
