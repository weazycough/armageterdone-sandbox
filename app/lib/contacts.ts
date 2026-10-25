// contacts.ts — the show's own email addresses, and the removal of everyone
// else's contact details from text the site republishes. Show notes name
// producers' and guests' personal addresses (and once a phone number); the
// preview is public, so those become a neutral marker in the episode pages,
// the search index and the imported Ghost posts. The leak scan
// (tests/leak-patterns.ts) checks the result with the same shapes.

/** The show's public addresses, and the newsletter form's placeholder. */
export const SHOW_EMAILS = new Set([
  "canarycryradio@gmail.com",
  "canarycryradio@protonmail.com",
  "canarycrysupplydrop@gmail.com",
  "canarycrytechteam@gmail.com",
  "you@email.com",
]);

/** Also the show's: any other canarycry… mailbox at the providers it uses. */
const SHOW_MAILBOX = /^canarycry[a-z0-9._-]*@(?:gmail\.com|protonmail\.com|proton\.me)$/;

export function isShowEmail(address: string): boolean {
  const a = address.toLowerCase();
  return SHOW_EMAILS.has(a) || SHOW_MAILBOX.test(a);
}

export const EMAIL = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi;

/** A North American phone number with separators: (NNN) NNN-NNNN,
 *  NNN-NNN-NNNN, +1 NNN.NNN.NNNN. Not dates (10.21.2026), times or bare digit
 *  runs (IDs in links); checked against the whole feed. */
export const PHONE =
  /(?<![\d.:/#-])(?:\+?1[\s.-]?)?(?:\(\d{3}\)\s?|\d{3}[\s.-])\d{3}[\s.-]\d{4}(?![\d.:/-])/g;

/** The show's own numbers, digits only: its Textedly line (text-privacy page). */
const SHOW_PHONES = new Set(["8777403226"]);

export function isShowPhone(number: string): boolean {
  return SHOW_PHONES.has(number.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""));
}

export const CONTACT_REMOVED = "[contact removed in preview]";

/** Plain text with other people's addresses and phone numbers replaced. */
export function redactContacts(text: string): string {
  return text
    .replace(EMAIL, (a) => (isShowEmail(a) ? a : CONTACT_REMOVED))
    .replace(PHONE, (n) => (isShowPhone(n) ? n : CONTACT_REMOVED));
}

/** The same for HTML: a mailto or tel link to someone else becomes the marker
 *  (text and all), then the text between tags is redacted. Attributes other
 *  than those links are left alone. */
export function redactContactsHtml(html: string): string {
  return html
    .replace(
      /<a\b[^>]*\bhref="(mailto|tel):([^"?]*)[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
      (link, scheme: string, to: string) =>
        scheme.toLowerCase() === "mailto" && isShowEmail(safeDecode(to).trim())
          ? link
          : CONTACT_REMOVED,
    )
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith("<") ? part : redactContacts(part)))
    .join("");
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
