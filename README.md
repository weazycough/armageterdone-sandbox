# Canary Cry website preview

A preview of a redesigned website for the Canary Cry News Talk podcast. It is built from this repository and published
at **https://stucny.github.io/Armageterdone/**.

The preview is public but unlisted: every page tells search engines not to index it, and nothing on it tracks
visitors. Forms (newsletter, contact) are marked "Preview only" and send nothing.

## How previews work

- Every change merged into `main` rebuilds and republishes the site, usually within a few minutes (see the
  **Actions** tab).
- The site also rebuilds once a day, so new episodes from the podcast's RSS feed appear without anyone doing
  anything.
- Episodes come straight from the Libsyn RSS feed: each one gets its own page with its artwork, show notes and an
  audio player.
- The other pages (Support, Roundtable, Meet-Ups…) currently use a simple shared layout. Their custom designs are
  being ported next.

## Giving feedback

Open an issue in this repository (**Issues → New issue**). One issue per problem or idea works best. Screenshots
and the page address help. To send logos, photos or other files, see [`assets-inbox/`](assets-inbox/).

## Design labs

When a change has more than one reasonable design, the options are shown side by side on a "design lab" page,
linked from its issue. All labs are listed at https://stucny.github.io/Armageterdone/labs/.

## Working on the site

Needs Node.js 24 and pnpm 10.

```bash
pnpm install          # install the exact versions in pnpm-lock.yaml
pnpm dev              # local dev server with live reload
pnpm build            # build the site into dist/ and run the site checks
pnpm preview          # serve dist/ locally, as GitHub Pages will
pnpm gate             # everything CI runs: lint, type check, tests, build, site checks
pnpm feed:refresh     # download the RSS feed again (local builds reuse a cached copy)
```

## Checks

`pnpm gate` must pass before anything is published, and CI runs it on every push:

- **Lint and type check** (`vp check`): TypeScript in strict mode and Oxlint with type-aware rules.
- **Unit tests** (`vp test`): RSS parsing and show-note cleaning, URL helpers, the site checks themselves.
- **Site checks**, run over the built site at the end of `pnpm build`: every page carries the no-index tag; no
  robots.txt or sitemap; no analytics, trackers or third-party scripts; no personal or internal details anywhere in
  the site or the repository; every internal link works; every episode and page was built; forms send nothing.

How it all fits together: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Third-party licences:
[`NOTICE.md`](NOTICE.md). Changes: [`CHANGELOG.md`](CHANGELOG.md).
