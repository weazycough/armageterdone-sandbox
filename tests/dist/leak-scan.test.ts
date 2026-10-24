// leak-scan.test.ts — nothing pointing at the site's builders, their machines
// or their network may be published (dist/) or committed (every tracked file,
// plus new files not yet committed and not ignored). The shapes and hashed
// names are in tests/leak-patterns.ts.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { EPISODES_JSON } from "../../app/lib/paths";
import { emailsIn, findLeaks, LEAK_SCAN_EXEMPT_FILES } from "../leak-patterns";
import { files, isBinary, readLatin1 } from "./dist-files";

// Addresses the show itself published in its episode notes may appear where
// the notes are republished (episode pages, imported posts).
const allowEmails = emailsIn(readFileSync(EPISODES_JSON, "utf8"));

describe("leak scan", () => {
  it("dist/ contains none of the leak patterns (text and binary files)", () => {
    const hits = files.flatMap((f) =>
      findLeaks(readLatin1(f), { allowEmails, emails: !isBinary(f) }).map(
        (h) => `dist/${f}: ${h.why} (${h.match})`,
      ),
    );
    expect(hits).toEqual([]);
  });

  it("committed files contain none of the leak patterns", () => {
    const tracked = execFileSync(
      "git",
      ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
      { encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
    expect(tracked.length).toBeGreaterThan(0);
    const hits = tracked
      .filter((f) => !LEAK_SCAN_EXEMPT_FILES.has(f))
      .flatMap((f) => {
        let text: string;
        try {
          text = readFileSync(f, "latin1");
        } catch {
          return []; // deleted in the working tree, not yet committed
        }
        return findLeaks(text, { allowEmails, emails: !isBinary(f) }).map(
          (h) => `${f}: ${h.why} (${h.match})`,
        );
      });
    expect(hits).toEqual([]);
  });
});
