// leak-patterns.ts — what must never appear on the public site or in the
// repo: anything that points at the machines, network, accounts or people
// that build the site. Used by tests/dist/leak-scan.test.ts over dist/ and
// every committed file. This list lives in the tests, never in shipped code.
//
// Two kinds of check:
// - SHAPES: generic forms (private IP ranges, local paths, internal URLs…),
//   matched by regex. Each says what it stands for.
// - TOKENS: specific names (hosts, accounts, people), stored only as SHA-256
//   hashes of the lowercased word so this file doesn't publish them. Text is
//   split into words of [a-z0-9-]; each word and each hyphen-separated part
//   is hashed and compared. To add a name, hash it locally and paste the hash
//   (never the name, in code, comments or test names):
//     node -e 'console.log(require("crypto").createHash("sha256").update(process.argv[1].toLowerCase()).digest("hex"))' <name>
//   Some names are also ordinary words that show notes use; those go in
//   HOST_TOKEN_HASHES and only count in host position (see isHostPosition).

import { createHash } from "node:crypto";

export interface LeakPattern {
  pattern: RegExp;
  why: string;
}

export const LEAK_SHAPES: LeakPattern[] = [
  { pattern: /\.ts\.net\b/i, why: "tailnet host name" },
  {
    pattern: /(?<![\d.])100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}(?![\d.])/,
    why: "tailnet IP (100.64.0.0/10)",
  },
  {
    pattern:
      /(?<![\d.])(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}(?![\d.])/,
    why: "private network IP (RFC 1918)",
  },
  // Bare "http://localhost" is fine: React Router uses it as a dummy URL base
  // in its own code. A local server shows up with a port.
  { pattern: /127\.0\.0\.1|\blocalhost:\d/i, why: "loopback address (a local dev server)" },
  {
    pattern: /\bhttps?:\/\/[a-z0-9-]+:\d{2,5}\b/i,
    why: "internal URL (a bare host name with a port)",
  },
  { pattern: /\b[a-z][a-z0-9-]*:\d{4,5}\//i, why: "internal host:port address" },
  // Not after a host name: "news.example/home/insights/" is a web page.
  {
    pattern: /(?<![\w.%-])(?:\/home\/[a-z_][a-z0-9_.-]*\/|\/Users\/[A-Za-z0-9_.-]+\/)/,
    why: "a personal home-directory path",
  },
  { pattern: /~\/coding\//, why: "a local workspace path" },
  { pattern: /\.paseo\//, why: "a local agent workspace path" },
  { pattern: /\bforgejo\b/i, why: "the private git forge" },
  { pattern: /__GHOST_URL__/, why: "an unconverted Ghost link" },
];

/** Names that never belong on the site, in any position. */
export const TOKEN_HASHES = new Set([
  "1752b6cc2b03b941cbd01eb743c18492b229adfc0f3cfccae323b248edd4c2c9",
  "3eaf9abf052a407daaa3ed18d7a1cde31aba1396d4b8f02d1a22a70d71824678",
  "243ecfc2a2af68e59bf50e9986b0d50228a765cd685d133070ba63f57db73559",
  "1f71511371129511321c45be058c60e23cf9ba898d8a3f3309555985b5027490",
  "a80a7c8e1090e1c830abf74b587e0af8886c262687ce0b9090441d2da99dbc20",
  "d90bf91f191224f997f951e6cc765ae8ca0af2eb5def24b9e683cc87fe1d1028",
  "471c1e0c28716a367cac8a1b336d296e5624591cababf22f5f0cae80e39c4977",
  "3857326736e80ac47c9e1d04fdc1b3e5cc342ad1f266cfac827047b608b24688",
  "d67e5422495943662a681c20bb4e4545684035ecd9007133839fddfac836c509",
  "a7f3f5b70155e478c02c3ee09eabd72ffdcd3b1cfa8b2a7c5a5046b16bd9497b",
  "c4f0244606d0c1264649b5ded5f76ea327f3447153174216bc1cc9c9676c0310",
]);

/** Names that are also ordinary words: they only count as a host. */
export const HOST_TOKEN_HASHES = new Set([
  "0522a55e2d5f0993a3d66d28864b2862a7218a75ea7968b075333434404485c3",
  "7499aced43869b27f505701e4edc737f0cc346add1240d4ba86fbfa251e0fc35",
]);

/** The show's own public addresses (in its feed and on the current site), and
 *  the form placeholder. Any other address must come from the episode feed,
 *  which the show publishes itself (see `allowEmails`). */
export const SHOW_EMAILS = new Set([
  "canarycryradio@gmail.com",
  "canarycryradio@protonmail.com",
  "canarycrysupplydrop@gmail.com",
  "canarycrytechteam@gmail.com",
  "you@email.com",
]);

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/gi;

/** Files that contain shapes on purpose, each with its reason. */
export const LEAK_SCAN_EXEMPT_FILES = new Set([
  // The list itself: its regexes spell out the shapes.
  "tests/leak-patterns.ts",
  // Feeds made-up samples of each shape (none of them real) through the scanner.
  "tests/unit/leak-patterns.test.ts",
  // The Ghost importer: it finds the __GHOST_URL__ marker in order to rewrite it.
  "scripts/extract-ghost.ts",
  // The local preview server: it binds to the loopback address on purpose.
  "scripts/serve-dist.ts",
  // The MIT licence of the copied UI components. MIT requires keeping its
  // copyright line verbatim, and that line names the source library. It is
  // never published: the dist/ scan has no exemptions.
  "LICENSES/ui-components-MIT.txt",
]);

export interface ScanOptions {
  tokenHashes?: Set<string>;
  hostTokenHashes?: Set<string>;
  /** Extra addresses that may appear (lowercase): the episode feed's. */
  allowEmails?: Set<string>;
  /** Look for email addresses (off for images and fonts, whose bytes can
   *  spell one by chance). */
  emails?: boolean;
}

const hashes = new Map<string, string>();
export function sha256(word: string): string {
  let h = hashes.get(word);
  if (h === undefined) {
    h = createHash("sha256").update(word).digest("hex");
    hashes.set(word, h);
  }
  return h;
}

/** A word is a host when it follows "//" or "@", or is followed by ":<digit>"
 *  or a local-network suffix. "/word/" in a URL path or "Word." ending a
 *  sentence is not. */
function isHostPosition(text: string, start: number, end: number): boolean {
  if (text.slice(Math.max(0, start - 2), start) === "//" || text[start - 1] === "@") return true;
  return /^(?::\d|\.(?:local|lan|home|internal|localdomain)\b)/.test(text.slice(end, end + 13));
}

export function findLeaks(
  text: string,
  options: ScanOptions = {},
): { why: string; match: string }[] {
  // Hydration data escapes "<" and ">" as \u003c/\u003e; read it as the page does.
  text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_m, hex: string) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
  const tokenHashes = options.tokenHashes ?? TOKEN_HASHES;
  const hostTokenHashes = options.hostTokenHashes ?? HOST_TOKEN_HASHES;
  const hits: { why: string; match: string }[] = [];

  for (const { pattern, why } of LEAK_SHAPES) {
    const m = pattern.exec(text);
    if (m !== null) hits.push({ why, match: m[0] });
  }

  for (const m of options.emails === false ? [] : text.matchAll(EMAIL)) {
    const address = m[0].toLowerCase();
    if (!SHOW_EMAILS.has(address) && options.allowEmails?.has(address) !== true) {
      hits.push({ why: "an email address that isn't the show's", match: m[0] });
      break;
    }
  }

  // Names: report the hash, not the word, so a failing run doesn't print it.
  const lower = text.toLowerCase();
  for (const m of lower.matchAll(/[a-z0-9-]+/g)) {
    const word = m[0];
    const parts = word.includes("-")
      ? [{ w: word, at: 0 }, ...hyphenParts(word)]
      : [{ w: word, at: 0 }];
    for (const { w, at } of parts) {
      const h = sha256(w);
      const start = m.index + at;
      if (
        tokenHashes.has(h) ||
        (hostTokenHashes.has(h) && isHostPosition(lower, start, start + w.length))
      ) {
        hits.push({
          why: "a private name",
          match: `sha256 ${h.slice(0, 12)}… at offset ${String(start)}`,
        });
        return hits;
      }
    }
  }
  return hits;
}

function hyphenParts(word: string): { w: string; at: number }[] {
  const out: { w: string; at: number }[] = [];
  let at = 0;
  for (const w of word.split("-")) {
    if (w !== "") out.push({ w, at });
    at += w.length + 1;
  }
  return out;
}

/** Every address in a text, lowercased: the feed's are allowed on the site. */
export function emailsIn(text: string): Set<string> {
  return new Set([...text.matchAll(EMAIL)].map((m) => m[0].toLowerCase()));
}
