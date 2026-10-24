// dates.ts — date formatting. Always UTC, so the prerendered HTML and the
// hydrated page agree whatever the visitor's time zone.

const LONG = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
const SHORT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const TICKER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "October 22, 2026" */
export function formatLongDate(iso: string): string {
  return LONG.format(new Date(iso));
}

/** "Oct 22, 2026" */
export function formatCardDate(iso: string): string {
  return SHORT.format(new Date(iso));
}

/** "Oct 22" */
export function formatShortDate(iso: string): string {
  return TICKER.format(new Date(iso));
}

/** "2026-10-22", for <time datetime>. */
export function isoDay(iso: string): string {
  return iso.slice(0, 10);
}
