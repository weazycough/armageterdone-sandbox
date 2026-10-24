# Changelog

## Unreleased

### Added

- Static site on React Router (prerendered, `ssr: false`) and Vite+, deployed to GitHub Pages at `/Armageterdone/`.
- Episodes from the Libsyn RSS feed at every build: a paginated list (12 a page) and a page per episode with artwork,
  the MP3 in the browser's own audio player, and sanitised show notes.
- The Ghost theme's header (latest-episode ticker, nav with dropdowns, mobile menu), footer, light/dark toggle, colours
  and type, and its homepage (hero player, the three shows, recent episodes, community art wall, newsletter signup).
- The 37 pages from the Ghost demo in a generic page template, and a static 404 page.
- Guards over every build: no-index on every page, no robots.txt or sitemap, no third-party scripts or trackers, a
  leak scan of the site and the repository, a link check, page counts, and forms that send nothing.
- Gates: `vp check` (type-aware Oxlint + TypeScript), unit tests, and `pnpm gate` as the single entry point. CI runs
  the gate on every branch; `main` deploys, and a daily build picks up new episodes.
- `assets-inbox/` for sending files, README, architecture notes, notices.
- `public/labs/index.html`, the design-lab list, covered by every site check; `pnpm dev` serves lab folders.

### Changed from the Ghost theme

- Fonts are self-hosted instead of loaded from Google Fonts.
- The header no longer overflows sideways at laptop widths; the desktop nav starts at 1280px.
- The three Shows links all go to the episode list (the feed doesn't label shows reliably yet).
- The search button is left out until the site has its own search; the footer's "Hangouts" link (no such page) is
  gone and "Privacy" points to the text-message privacy page.
- Embedded players in the imported pages are links to the original for now.
