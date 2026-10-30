# AGENTS.md

Guidance for AI coding agents (and humans) working on the Canary Cry website
redesign.

## What this repo is

A redesign of the Canary Cry News Talk website, built as a static React site
and published as a preview on GitHub Pages:

**Preview:** https://weazycough.github.io/armageterdone-sandbox/

The repo is private. The preview site is public but unlisted: it is not
linked from anywhere, and every page tells search engines not to index it, so
it never competes with the real Canary Cry site in search.

See `README.md` for local setup and `docs/ARCHITECTURE.md` for how the build
works.

## Track every change in an issue

Issues are the to-do list and the record of decisions. Use them for all
work, small or large.

1. **Find or open an issue first.** Before changing anything, look for an
   existing issue. If there isn't one, open it: a clear title, what should
   change and why, and how to tell it's done. Label it (`design`, `content`,
   `enhancement`, `backend`, `security`, `accessibility`, `bug`,
   `documentation`, `needs-discussion`, `epic`).
2. **Ask before guessing.** If an issue is unclear, or needs a decision only
   the team can make, comment the question on the issue and add
   `needs-discussion`. For a visual choice, build a design lab (below).
3. **One branch per issue**, named `issue-<number>-<short-slug>`.
4. **Pull request per issue.** Reference the issue: `Fixes #<number>` in the
   description closes it automatically when the change merges to `main`.
   Say what changed and how you checked it; include screenshots for visual
   changes.
5. **Comment on the issue when it ships**, with the preview link to the
   changed page, so the person who asked can check it.
6. Keep issues current: if scope changes, update the issue text or comment;
   split big issues into smaller ones and link them.

## Design labs

When a change has more than one reasonable design, don't pick silently:
build a **design lab**, a single published page that shows the options side
by side.

**Follow the full instructions in `.claude/skills/design-lab/SKILL.md`.**
(Claude Code loads it automatically as the `design-lab` skill; other agents
should read that file.) In short:

- Labs live in `public/labs/<issue-number>-<slug>/index.html` and publish
  with the preview at
  `https://weazycough.github.io/armageterdone-sandbox/labs/<issue-number>-<slug>/`
  once merged to `main`.
- Every lab has the `noindex` robots tag and contains nothing private.
- **Post the lab link as a comment on its issue**, and **give your user the
  link** directly, once you've confirmed it's live.

## Rules for the public preview

Everything merged to `main` is published to a public website.

- **Every page keeps the `noindex` robots tag.** Don't remove it, and don't
  add a `sitemap.xml` or `robots.txt`.
- **Nothing private goes in the repo or the site:** no email addresses, phone
  numbers, home addresses, passwords, API keys, internal server names or IP
  addresses, personal file paths.
- **No trackers.** No analytics, ad scripts, or third-party scripts that track
  visitors. Embeds (YouTube, Twitch, etc.) only where the page needs them,
  and only through `app/components/embed.tsx`, which loads the player when
  the visitor presses its button; the build rejects a plain `<iframe>`.
- **Forms don't submit anywhere** in the preview; they're marked "preview
  only".
- The build's gate enforces the `noindex` tag and scans for leaked private
  details. If it fails, fix the cause; never weaken the check to get green.

## Working on the code

- **pnpm only** (never npm or yarn). Node and package versions are pinned;
  add new dependencies with exact versions, and prefer releases that have
  been out for at least a week unless a newer one fixes a security issue.
- **Before every push, run the gate and the build:**

  ```
  pnpm install --frozen-lockfile
  pnpm gate
  pnpm build
  ```

  `pnpm gate` runs type-aware lint and type checks, the unit tests, and the
  build with its site checks (noindex, leak scan, no trackers, links).
  Formatting is not a gate: run `pnpm fmt` to tidy code. Don't push a
  failing build; `main` deploys automatically.

- TypeScript strict. Validate external data (the RSS feed, content files) with
  Zod, don't cast it.
- Match the existing style: read nearby code before writing new code.
- Content edits (episode notes, page text) follow the issue's instructions;
  don't invent copy for the show. Mark placeholder text clearly.

## Visual assets

`assets-inbox/` is where the team drops logos, photos and graphics for agents
to use. Read its `README.md` for what each file is for. Files there are not
published unless the site uses them: copy what you need into the site's
`public/` folder (or a lab folder).
