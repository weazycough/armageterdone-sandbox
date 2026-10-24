# Architecture

The Canary Cry preview is a static site: plain HTML files built once, served by GitHub Pages at
`https://stucny.github.io/Armageterdone/`. There is no server, database or CMS at runtime. React renders every page at
build time, then hydrates in the browser for the interactive bits (menus, theme toggle, client-side navigation).

## Build pipeline

`pnpm build` runs, in order:

1. **`scripts/prepare-content.ts`**: downloads the Libsyn RSS feed (about 36 MB, every episode) once, parses it,
   validates it with Zod and sanitises the show notes (`app/lib/feed.ts`). Writes `.cache/episodes.json` (the list
   the pages read) and `.cache/site.json` (the latest episode and the year, for the header and footer). A local build
   reuses `.cache/libsyn-feed.xml`; `pnpm feed:refresh` downloads it again. CI starts empty, so every CI build has the
   current feed.
2. **`react-router build`**: React Router in framework mode with `ssr: false`, running on Vite+ (whose bundled Vite
   is wired in as `vite` through a pnpm override). `react-router.config.ts` lists every path to prerender; each
   route's `loader` runs at build time and its output is baked into the HTML (and a `_.data` file per page for
   client-side navigation).
3. **`scripts/assemble-dist.ts`**: React Router writes pages under `build/client/Armageterdone/` but assets and
   `public/` files at `build/client/`; this merges both into `dist/`, which Pages serves at `/Armageterdone/`. It
   turns the not-found page into `dist/404.html` (with the app's scripts stripped, see below) and drops React
   Router's SPA fallback.
4. **`vp test --project dist`**: the guard tests below, over `dist/`. A failing guard fails the build, so a site that
   breaks a guard is never uploaded.

`pnpm gate` is the CI entry point: `react-router typegen`, `vp check` (Oxlint with type-aware rules and the
TypeScript type check), `vp test --project unit`, then `pnpm build`.

`vp build` is not used: with the React Router plugin it builds, then never exits. `react-router build` drives the
same Vite+ build and exits cleanly.

## Routes

| Path                              | File                       | Source                                                                  |
| --------------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| `/`                               | `app/routes/home.tsx`      | latest episode (hero + native audio player), 4 recent episodes, fan art |
| `/episodes/`, `/episodes/page/N/` | `app/routes/episodes.tsx`  | the feed, 12 to a page, newest first                                    |
| `/episodes/<slug>/`               | `app/routes/episode.tsx`   | one episode: art, date, MP3, show notes                                 |
| `/<slug>/`                        | `app/routes/page.tsx`      | a page from `content/pages/` (generic template)                         |
| anything else                     | `app/routes/not-found.tsx` | prerendered once, becomes `404.html`                                    |

URL helpers and build-file locations live in `app/lib/paths.ts` so the routes, the prerender list and the tests
agree. An episode's slug is the last segment of its Libsyn page URL (`…/hackpacalypse-now-…-ccnt-984`), de-duplicated
with `-2`, `-3`.

**Adding a page design** (issue #2 and later): add a route for the slug in `app/routes.ts` before `:slug`, in its own
file. Its content can still come from `loadPages()`. Every new path must be in the prerender list (static paths are;
param paths need adding in `react-router.config.ts`).

**404.html is static.** Pages serves it at whatever URL was missing, so its URL never matches the route it was
rendered for; hydrating it would mismatch and then show an error. `assemble-dist.ts` therefore removes the app's
scripts from it (the inline theme script stays) and the `static-page` class hides the two header buttons that need
the app.

## Content sources

- **Episodes**: the Libsyn feed, fetched at every build. The daily scheduled deploy picks up new episodes.
  Show notes keep text formatting and plain links only (`sanitizeNotes`): no scripts, iframes, images, inline styles
  or tracking attributes. Libsyn's `content:encoded` is a flattened copy for recent episodes, so the field with more
  line structure is used.
- **Pages**: `content/pages/<slug>.json`, extracted once from the Ghost demo's content export by
  `scripts/extract-ghost.ts` (`pnpm extract-ghost --export <export.json> --content <ghost content dir>`). Only the
  posts table is read; the export (which also holds user accounts) is never committed. Body HTML is sanitised at
  extraction: each embed (Libsyn, Rumble, SoundCloud, Twitch…) becomes a link to its source and is listed in the page's
  `removedEmbeds`, so a page port can rebuild it deliberately. Root-relative links (`/support/`) get the base path at
  render time (`withBase`). Two Ghost pages are skipped because a route replaces them: `episodes` and `home`.
- **Posts**: `content/posts/` holds the 10 Ghost posts for reference. They are episodes that the feed already has,
  so they are not routed.
- **Images**: the Ghost theme's images are in `public/images/`; images the pages used are in `public/content/images/`
  (downloaded by the extractor).

Header and footer links are in `app/lib/nav.ts`. Its comment lists where they differ from the Ghost theme.

## Design labs

Option pages for design decisions live in `public/labs/<issue>-<slug>/index.html` and publish at
`/Armageterdone/labs/<issue>-<slug>/`; `public/labs/index.html` lists them. How to write one:
`.claude/skills/design-lab/SKILL.md`. Every check above covers them (they are just more HTML files in `dist/`).
In `pnpm dev`, a small middleware in `vite.config.ts` (`labIndexes`) serves a lab folder's `index.html`, as Pages
does; otherwise the router would take the URL.

## Styling

`app/styles/theme.css` is the Ghost theme's stylesheet with its class names unchanged, so Ghost templates port
across as-is (the changes are listed at its top). `app/styles/app.css` loads Tailwind 4, the self-hosted fonts, the
theme (in the `components` cascade layer, so Tailwind utilities override it), and maps Tailwind's colour tokens
(`bg-background`, `text-accent`…) to the theme's variables so they follow light/dark.

Light/dark: the theme toggle sets `data-theme` on `<html>` and saves it in `localStorage` (`cc-theme`); an inline
script in `<head>` applies it before first paint (`app/lib/theme.ts`). With nothing saved, the OS setting wins.

Components in `app/components/ui/` are copied shadcn-style React Aria components (see NOTICE.md), re-skinned with
the theme's tokens. Copy further ones the same way when a page needs them (dialog for the fan-art modal, disclosure
for accordions): keep the React Aria primitive, replace the colours with the theme's.

## Privacy guards

The site is public but unlisted. These are checked by tests over every build, so they hold by construction:

| Guard                                                                                                                                                                                                                                                                                       | Test                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Every HTML file (React pages, labs, anything from `public/`) has `<meta name="robots" content="noindex, nofollow, noarchive">` in its server-sent `<head>`                                                                                                                                  | `tests/dist/noindex.test.ts`                                          |
| No `robots.txt` (a Disallow would hide the noindex tag from crawlers) and no sitemap                                                                                                                                                                                                        | `tests/dist/noindex.test.ts`                                          |
| Scripts and styles only from the site; media only from the podcast's Libsyn art and MP3 hosts; no iframes (allow-list per page, empty for now); no remote `url()`/`@import` in styles; no `ping`, off-site meta refresh or form action; no analytics, trackers, font CDNs or hosted players | `tests/dist/third-party.test.ts`                                      |
| Nothing pointing at the people or machines that build the site, in `dist/` or in any committed file                                                                                                                                                                                         | `tests/dist/leak-scan.test.ts` (patterns in `tests/leak-patterns.ts`) |
| Every internal link and asset resolves under `/Armageterdone/` (relative links resolved against their page)                                                                                                                                                                                 | `tests/dist/links.test.ts`                                            |
| Every episode, list page and extracted page exists; forms have no action, method or named fields and say "Preview only"                                                                                                                                                                     | `tests/dist/content.test.ts`                                          |

Also: `<meta name="referrer" content="no-referrer">` keeps the preview's address out of other sites' logs, fonts are
self-hosted, and episodes play in the browser's own `<audio preload="none">`, so nothing downloads until play.

The HTML checks live in `tests/site-checks.ts` as plain functions, unit-tested on hand-written pages
(`tests/unit/site-checks.test.ts`), because labs are written by hand: any attribute quoting, every `srcset`
candidate, inline `<style>` and `style=""`.

The leak scan (`tests/leak-patterns.ts`) has two parts. **Shapes** are generic regexes: tailnet names and IPs, private
network IPs, loopback with a port, bare-host URLs with a port, home-directory and workspace paths, the git forge,
unconverted Ghost links, and email addresses (allowed: the show's own, and any address the episode feed itself
published). **Names** of hosts, accounts and people are stored only as SHA-256 hashes; the scanner hashes every word
and compares, and a failing run prints the hash, not the word. Names that are also ordinary words only count in host
position (`//name`, `name:22`, `name.local`), because show notes use them as words. How to add a name is in the
file's header. A file that must contain a shape goes in `LEAK_SCAN_EXEMPT_FILES` with a reason.

## Dependencies

- pnpm only. Exact versions in `package.json`.
- `pnpm-workspace.yaml` sets `minimumReleaseAge` to 7 days for every package, direct or transitive. A release that
  fixes a high-risk CVE may be exempted in `minimumReleaseAgeExclude`, with the advisory id in a comment.
- No dependency runs install scripts (`onlyBuiltDependencies: []`).
- GitHub Actions are pinned to commit SHAs.

## Gates

| Command                  | What                                                                                                                                                                                                                                                                                                           | Where                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `vp check`               | Oxlint, type-aware: no-floating-promises, no-misused-promises, switch-exhaustiveness-check, no-unnecessary-condition, await-thenable, only-throw-error, prefer-promise-reject-errors, restrict-template-expressions, react rules-of-hooks; plus the TypeScript type check (strict, `noUncheckedIndexedAccess`) | `pnpm gate`, CI         |
| `vp test --project unit` | feed parsing and sanitising, URL helpers, the leak scanner, the HTML checks on hand-written pages                                                                                                                                                                                                              | `pnpm gate`, CI         |
| `vp test --project dist` | the privacy guards above                                                                                                                                                                                                                                                                                       | end of `pnpm build`, CI |
| `vp fmt`                 | Oxfmt formatting                                                                                                                                                                                                                                                                                               | advisory, not a gate    |

Suppressing a lint finding needs a one-line comment saying why, next to the suppression. `only-throw-error` allows
React Router's `data(…, { status: 404 })`, which loaders throw by design.

## CI/CD

- `.github/workflows/deploy.yml`: on push to `main`, daily at 09:17 UTC, or by hand: install (frozen lockfile),
  `pnpm gate`, upload `dist/`, deploy to Pages. Read-only by default; only the deploy job gets `pages: write` and
  `id-token: write`.
- `.github/workflows/check.yml`: the same gate on every other branch and on pull requests, without deploying.

The daily run fails closed: if the feed can't be downloaded, or a new episode's notes trip a check (say an
address the scan doesn't allow), the run fails and the live site stays as it was. New episodes then stop
appearing until the cause is fixed. Look at the failed "Deploy" run in the repository's **Actions** tab: the
failing step and test name say what broke.
