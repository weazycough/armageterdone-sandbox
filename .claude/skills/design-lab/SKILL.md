---
name: design-lab
description: Build a design lab for the Canary Cry site — a self-contained HTML page, published with the preview on GitHub Pages, that shows design options side by side so the team can pick one. Use when an issue asks for a design decision, when someone says "make a lab", "show me options", "mock this up", "compare layouts/colours/logos", or before building any visual change that has more than one reasonable answer.
---

# Design lab

A design lab is one static HTML page that shows two or more labelled options
for a design question (a layout, a colour scheme, a logo treatment, a page
section). It is published with the preview site, so anyone with the link can
open it on a phone or a laptop, and it is linked from the issue where the
decision gets made.

Labs are for deciding. Once the decision is made, the change is built into
the real site and the lab is retired.

## Where labs live and how they publish

- Each lab is a folder: `public/labs/<issue-number>-<short-slug>/index.html`
  (for example `public/labs/12-community-map/index.html`). Images it needs go
  in the same folder.
- Everything in `public/` is copied into the built site, so the lab is
  published at:

  `https://stucny.github.io/Armageterdone/labs/<issue-number>-<short-slug>/`

- GitHub Pages only publishes `main`. A lab goes live a few minutes after it
  is merged to `main` and the "Deploy" workflow finishes. Labs are additive
  and are never linked from the site's navigation, so merging one early is
  safe.
- Add a line for the lab to `public/labs/index.html` (the lab list). Create
  that file from the template below if it doesn't exist yet.

## Rules every lab must follow

The preview site is public. These rules keep it out of search engines and
keep private information off the internet. The build's gate checks the first
two and fails if they're broken.

1. **`noindex`.** Every lab page has
   `<meta name="robots" content="noindex, nofollow, noarchive">` in its `<head>`.
2. **Nothing private.** No personal names beyond what's already public on the
   show, no email addresses, phone numbers, home addresses, internal server
   names or IP addresses, passwords, API keys, or draft material the team
   hasn't agreed to show.
3. **Self-contained.** Inline CSS and JS in the one file (or files in the lab
   folder). No external scripts, analytics, trackers, or web-font services;
   copy fonts into the folder if needed. Images come from the lab folder,
   the site's own `public/` files, or `assets-inbox/` (copy them in; files in
   `assets-inbox/` are not published on their own).
4. **Real content where it matters.** Use real episode titles, real art and
   the site's real colours and fonts, so the team judges the design, not
   placeholder text. The design tokens are at the top of
   `app/styles/theme.css`: the `:root` block under "Tokens: dark (default)"
   (colours, the `--font-display` / `--font-body` / `--font-serif` stacks,
   spacing, radii) and the "Tokens: light theme overrides" block after it.
   Copy the custom properties you need into the lab's `<style>`. The fonts
   (Jost, Inter, Source Serif 4) are self-hosted: copy the `.woff2` files you
   need from `node_modules/@fontsource/<font>/files/` into the lab folder
   and add an `@font-face` for each. Episode art may load from
   `static.libsyn.com` (the feed's own art host, which the gate allows).
5. **Works on a phone.** Most reviewers will open the link on a phone. Check a
   narrow width (about 390px) as well as desktop.

## What a good lab looks like

- A header with: the question being decided, a link back to the issue, the
  date, and a status line (`Open for feedback` → `Decided: Option B` →
  retired).
- **Two to four options**, each with a big clear label (`Option A`,
  `Option B`, …) and one line saying what's different about it. Side by side
  on desktop, stacked on a phone.
- Show each option in context (inside a realistic page section, light and
  dark theme if the site has both), not floating on a blank canvas.
- End with **"What we need from you"**: the exact question, e.g. "Which
  option for the episode card? Any change you'd make to it?"
- Keep it to one decision per lab. Two questions → two labs.

## Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <title>Lab #12: Community page map</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 1.5rem;
        line-height: 1.5;
      }
      header {
        max-width: 70rem;
        margin: 0 auto 2rem;
      }
      .status {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        background: #fde68a;
      }
      .options {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        max-width: 70rem;
        margin: 0 auto;
      }
      .option {
        border: 1px solid #ccc;
        border-radius: 0.75rem;
        padding: 1rem;
      }
      .option h2 {
        margin-top: 0;
      }
      .ask {
        max-width: 70rem;
        margin: 2rem auto 0;
        padding: 1rem;
        border-left: 4px solid #f59e0b;
      }
    </style>
  </head>
  <body>
    <header>
      <p class="status">Open for feedback</p>
      <h1>Community page: how should the meetup map look?</h1>
      <p>Issue: <a href="https://github.com/stucny/Armageterdone/issues/12">#12</a> · 2026-10-24</p>
    </header>
    <main class="options">
      <section class="option">
        <h2>Option A</h2>
        <p>One line on what's different.</p>
        <!-- the design -->
      </section>
      <section class="option">
        <h2>Option B</h2>
        <p>One line on what's different.</p>
        <!-- the design -->
      </section>
    </main>
    <section class="ask">
      <h2>What we need from you</h2>
      <p>Which option should we build? Comment on the issue with your pick and any changes.</p>
    </section>
  </body>
</html>
```

The lab list, `public/labs/index.html`, uses the same `<head>` (including the
robots tag) and a plain list of links: `#12 Community page map — Open`.

## Workflow

1. **Start from an issue.** Every lab belongs to an issue. If there isn't one,
   create it first (label `design`), describing the decision to be made.
2. Build the lab on a branch, check it locally (open the file in a browser, or
   run the site's dev server with `pnpm dev` and visit
   `/Armageterdone/labs/<folder>/` at the address it prints), at phone and
   desktop widths. `pnpm build && pnpm preview` shows the built site exactly
   as GitHub Pages will serve it.
3. Run the gate (`pnpm gate`) and the build. Fix anything it flags.
4. Merge to `main` (pull request referencing the issue, e.g. "Lab for #12").
   Don't write `Fixes #12` for a lab; the issue stays open until the real
   change ships.
5. **Wait for the deploy**, then check the live link really works:
   `gh run watch` (or the repo's Actions tab), then
   `curl -s https://stucny.github.io/Armageterdone/labs/<folder>/ | grep -c noindex`
   should print `1` or more. Open it once yourself.
6. **Post the link in the issue** as a comment: what the lab compares, the
   link, and the question you need answered. Example:

   > Design lab for this issue: https://stucny.github.io/Armageterdone/labs/12-community-map/
   > It compares two map styles (A: pins on a dark map, B: a list with a small map).
   > Which one should we build?

7. **Give your user the link too** (in chat), the same full `https://` URL,
   so they can open it straight away on any device.
8. **When the decision is made:** update the lab's status line to
   `Decided: Option X`, comment the decision on the issue, then build the real
   change in a normal pull request that says `Fixes #<n>`. In that same pull
   request, delete the lab folder and its line in the lab list, unless the
   issue says to keep it.
