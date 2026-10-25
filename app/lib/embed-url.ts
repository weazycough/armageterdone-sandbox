// embed-url.ts — the iframe URL and sandbox for a click-to-load player
// (app/components/embed.tsx).

/** What a player may do in its frame: run, use its own cookies, open its site
 *  in a new tab, play fullscreen. Not: navigate this page. Checked with the
 *  Twitch player, which plays the same with and without it. */
export const EMBED_SANDBOX =
  "allow-scripts allow-same-origin allow-popups allow-forms allow-presentation";

/** The URL to load. Twitch only plays inside a page named in `parent=`, so
 *  with `parent` the page's hostname is added (stucny.github.io on Pages). */
export function embedUrl(src: string, parent: boolean, hostname: string): string {
  if (!parent) return src;
  const url = new URL(src);
  url.searchParams.set("parent", hostname);
  return url.toString();
}
