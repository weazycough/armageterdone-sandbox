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
- The custom designs of all 24 Ghost page templates: Support, the Roundtable (96 Knights and Dames, the Barons),
  About, Contact, Meet-Ups, Art Submissions (the art wall opens each piece in a modal, with arrow keys), the T-Shirt
  Council gallery, the Supply Drop, Watch, Livestream, Mixtape, Transcripts, The Gospel, Speak Pipe, Street Team,
  Babysitters Club, Burning Man Research, CanaryCry.Tube, the WW3 tracker, Softwar, Technology of the Fallen, the
  500 pledge, 600 and the text-message privacy terms.
- A list per show (News Talk, Radio, Clubhouse) at `/tag/<show>/`, linked from the Shows menu, the homepage and
  About.
- Site search in the header: a static index built with the site, searched in the browser, no search service.
- Players (Twitch, Restream, SoundCloud, the Dropbox PDF) load only when the visitor asks for them; until then the
  page contacts no other site.
- Site checks also catch other sites named in inline scripts, remote SVG images and `background` attributes.

### Changed from the Ghost theme

- Fonts are self-hosted instead of loaded from Google Fonts.
- The header no longer overflows sideways at laptop widths; the desktop nav starts at 1280px.
- The footer's "Hangouts" link (no such page) is gone and "Privacy" points to the text-message privacy page.
- Embedded players load on request (see above). Inside the pages without a custom design they are links to the
  original for now.
- Meet-up hosts' personal emails and phone number are not published; each contact goes through the show's inbox.
- Instructions written for the Ghost editor ("paste it into a Ghost card") now ask the team to send the material
  in; Twitch's `parent=` follows the page's address, so the Watch page's note about changing it is gone.
- Page titles in the browser tab are the pages' headings (the Ghost pages were mostly titled "Support The Show").
- Two-column tier grids (Babysitters Club, Tube, Associate & Executive) stack on phones instead of squeezing.
- On phones the latest-episode ticker is one still line instead of a marquee that starts off-screen.

### Fixed

- Pages were 1280px wide at desktop sizes, and narrower than the screen on tablets: Tailwind's `container`
  utility overrode the theme's.
- Outlined ("ghost") buttons had no outline.
