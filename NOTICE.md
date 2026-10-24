# Notices

Third-party material in this repository and on the published site, with its licence. The licence texts are in
[`LICENSES/`](LICENSES/). No GPL or LGPL code, fonts or assets.

## UI components (MIT)

`app/lib/utils.ts` and the components in `app/components/ui/` (button, input, label, field) are copied from a shared
React Aria component library and re-skinned for this site. That library is MIT
([`LICENSES/ui-components-MIT.txt`](LICENSES/ui-components-MIT.txt)); its components follow shadcn/ui's React Aria
registry, also MIT ([`LICENSES/shadcn-MIT.txt`](LICENSES/shadcn-MIT.txt), Copyright (c) 2023 shadcn).

## Fonts (SIL Open Font License 1.1)

Self-hosted from the Fontsource packages (byte-identical to their files, latin subset), so no visitor's browser asks a
font CDN for them. All three are under the **SIL Open Font License, Version 1.1**
([`LICENSES/OFL-1.1.txt`](LICENSES/OFL-1.1.txt)).

| Font           | Package                      | Use                      | Copyright                                                                             |
| -------------- | ---------------------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| Jost           | `@fontsource/jost`           | Headings, nav, buttons   | Copyright 2020 The Jost Project Authors (https://github.com/indestructible-type/Jost) |
| Inter          | `@fontsource/inter`          | Body text                | Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)              |
| Source Serif 4 | `@fontsource/source-serif-4` | Italic quotes and mottos | Copyright 2014-2023 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'   |

## Design and images

- `app/styles/theme.css` is the stylesheet of the Ghost theme made for Canary Cry (v0.2.2), with the changes listed at
  its top.
- `public/images/` holds the Ghost theme's images: show art, community fan art, T-shirt designs, Roundtable and
  Supply Drop graphics, and the Canary Cry crest (`cc-logo.webp`). `public/favicon.png` is the crest icon. These are
  Canary Cry's own and community submissions to the show, used with the show.
- `public/content/images/` holds the images the imported pages use, downloaded from the show's current website.

## Dependencies

Installed by pnpm, not vendored: React and React DOM (MIT), React Router (MIT), React Aria Components (Apache-2.0,
Adobe), Zod (MIT), class-variance-authority (Apache-2.0), clsx (MIT), tailwind-merge (MIT), isbot (Unlicense, used by
React Router's prerender). Build only: Vite+ (MIT), Tailwind CSS (MIT), fast-xml-parser (MIT), sanitize-html (MIT).
