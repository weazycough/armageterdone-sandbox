// The leak scanner catches each shape and a hashed name, and lets through
// what real show notes contain. Every sample here is made up.
// (This file is exempt from the committed-file scan: its samples are shapes.)

import { describe, expect, it } from "vite-plus/test";
import { findLeaks, HOST_TOKEN_HASHES, sha256, TOKEN_HASHES } from "../leak-patterns";

describe("leak shapes", () => {
  it.each([
    "https://somebox.example-tail.ts.net/lab/",
    "ssh 100.64.0.1",
    "http://10.0.0.99:8095/",
    "printer at 192.168.1.20",
    "http://127.0.0.1:2368/",
    "http://localhost:5173/",
    "file:///home/someone/notes.txt",
    "http://examplehost:3000/owner/repo",
    "push to examplehost:3000/owner",
    "/home/someone/projects/site",
    "/Users/someone/site",
    "~/coding/site/notes",
    "worktrees under .paseo/worktrees",
    "mirrored on Forgejo",
    "__GHOST_URL__/support",
    "write to someone@example.org",
    "Example Initiative (555) 201-0146",
    "call 555-201-4477 today",
    "text +1 555.201.4477",
  ])("flags %s", (sample) => {
    expect(findLeaks(sample)).not.toEqual([]);
  });

  it.each([
    "Canary Cry News Talk #984 - 10.21.2026 - Recorded Live",
    "version 1.100.64.2 released",
    "posts.net and products.netflix.com",
    "RUSSIAN HANDLER 4:26 BEAST SYSTEM 31:27",
    "https://www.canarycrynewstalk.com/roundtable",
    "email canarycryradio@gmail.com or CanaryCrySupplyDrop@gmail.com",
    "you@email.com",
    'let base = "http://localhost";',
    "https://news.example/home/insights/story",
    // Real show-note text that looks a bit like a phone number.
    "HACKPACALYPSE NOW - 10.21.2026 - #984",
    "Recorded 01:42:37, timestamps 1:02:33 and 12:30:45",
    "https://x.com/i/status/1839045851 and id 1146781072",
    "CCNT 983 - 2026-10-20 - ep 666-777",
  ])("passes %s", (sample) => {
    expect(findLeaks(sample)).toEqual([]);
  });

  it("allows only the show's addresses, not others the feed names", () => {
    expect(findLeaks("write to canarycrynewsdesk@proton.me")).toEqual([]);
    expect(findLeaks("write to a.producer@example.org")).not.toEqual([]);
    expect(findLeaks("write to canarycryfan@example.org")).not.toEqual([]);
  });

  it("reads JSON-escaped hydration data as text", () => {
    expect(findLeaks(String.raw`>canarycryradio@gmail.com</a`)).toEqual([]);
    expect(findLeaks(String.raw`>someone@example.org</a`)).not.toEqual([]);
  });

  it("can skip the email and phone checks for binary files", () => {
    expect(findLeaks("x@y.ab 555-201-4477", { emails: false })).toEqual([]);
  });
});

describe("hashed names", () => {
  const tokenHashes = new Set([sha256("examplehost")]);
  const hostTokenHashes = new Set([sha256("examplename")]);
  const scan = (text: string) => findLeaks(text, { tokenHashes, hostTokenHashes });

  it("catches a listed name anywhere, whole or as a hyphen part, any case", () => {
    expect(scan("deployed from ExampleHost today")).not.toEqual([]);
    expect(scan("the examplehost-ui-kit library")).not.toEqual([]);
    expect(scan("a examplehostess")).toEqual([]);
  });

  it("reports the hash, not the name", () => {
    const [hit] = scan("deployed from examplehost");
    expect(hit?.match).toContain(sha256("examplehost").slice(0, 12));
    expect(hit?.match).not.toContain("examplehost");
  });

  it("catches a common-word name only as a host", () => {
    for (const host of [
      "http://examplename/",
      "examplename:22",
      "ssh user@examplename",
      "examplename.local",
      "examplename.lan",
    ]) {
      expect(scan(host)).not.toEqual([]);
    }
    for (const prose of [
      "Examplename's culture shock",
      "https://news.test/examplename/story",
      "the-examplename-story.html",
      "Ask Examplename. Then",
    ]) {
      expect(scan(prose)).toEqual([]);
    }
  });

  it("the committed lists hold only hashes", () => {
    for (const h of [...TOKEN_HASHES, ...HOST_TOKEN_HASHES]) expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(TOKEN_HASHES.size).toBeGreaterThan(0);
  });
});
