// paths.ts — the site's URL scheme and build-file locations, in one place so
// routes, the prerender list and the tests agree.

/** GitHub Pages project path. Every URL on the site starts with it. */
export const BASE = "/armageterdone-sandbox/";

export const FEED_URL = "https://rss.libsyn.com/shows/84402/destinations/400745.xml";
export const FEED_CACHE = ".cache/libsyn-feed.xml";
export const EPISODES_JSON = ".cache/episodes.json";
export const SITE_JSON = ".cache/site.json";
export const PAGES_DIR = "content/pages";

export const EPISODES_PER_PAGE = 12;

/** Where the not-found page is prerendered before it becomes dist/404.html. */
export const NOT_FOUND_PRERENDER_PATH = "/404/not-found/";

/** Paths below are router paths: no BASE (React Router adds it). */
export function episodeListPath(page: number): string {
  return page <= 1 ? "/episodes/" : `/episodes/page/${String(page)}/`;
}

/** A show's episode list (Ghost tag.hbs), paginated like the full list. */
export function tagPath(tag: string, page = 1): string {
  return page <= 1 ? `/tag/${tag}/` : `/tag/${tag}/page/${String(page)}/`;
}

export function episodePath(slug: string): string {
  return `/episodes/${slug}/`;
}

export function pagePath(slug: string): string {
  return `/${slug}/`;
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / EPISODES_PER_PAGE));
}

/** Prefix root-relative URLs in stored HTML (content pages) with BASE, which
 *  React Router can't do for raw HTML. Leaves "//host" and absolute URLs. */
export function withBase(html: string): string {
  return html.replace(/(\s(?:href|src)=")\/(?!\/)/g, `$1${BASE}`);
}
