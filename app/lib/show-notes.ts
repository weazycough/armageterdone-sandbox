// show-notes.ts — drop technical feed boilerplate from Libsyn notes before
// they are rendered on an episode page. Producer credits, rundowns and
// ordinary links are left alone.

const JUNK =
  /podcasting\s*2\.0|podcastindex\.org|value4value\.info|learn more about value\s*4\s*value/i;

/** A block element that is only a Podcasting 2.0 / PodcastIndex / Value 4 Value promo line. */
const JUNK_BLOCK =
  /<(div|p)\b[^>]*>[^<]*(?:<a\b[^>]*>[\s\S]*?<\/a>[^<]*)*<\/\1>/gi;

export function cleanShowNotes(html: string): string {
  const cleaned = html.replace(JUNK_BLOCK, (block) => (JUNK.test(stripTags(block)) ? "" : block));
  return cleaned.replace(/(?:<br\s*\/?>|\s)*$/i, "").trim();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
