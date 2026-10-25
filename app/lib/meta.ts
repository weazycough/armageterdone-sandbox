// meta.ts — the <title> every page shares: "<page> — Canary Cry News Talk".

export const SITE_NAME = "Canary Cry News Talk";

export function pageTitle(title: string): { title: string }[] {
  return [{ title: `${title} — ${SITE_NAME}` }];
}
