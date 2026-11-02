// designed-pages.ts — the pages that have their own design, ported from the
// Ghost theme's page-<slug>.hbs templates. Each is app/routes/pages/<slug>.tsx;
// every other page in content/pages renders in the generic template
// (app/routes/page.tsx). The prerender list covers both, since every slug
// here also has a content/pages/<slug>.json.

export const DESIGNED_PAGES = [
  "500pledge",
  "600",
  "about-us-mojave",
  "artsubmission",
  "burningmanresearch",
  "ccbc",
  "contact-us-mojave",
  "livestream",
  "meet-ups",
  "mixtape",
  "roundtable",
  "shows",
  "softwar",
  "speakpipe",
  "streetteam",
  "supplydrop",
  "support",
  "technology-of-the-fallen",
  "textprivacy",
  "the-gospel",
  "transcripts",
  "tshirt",
  "tube",
  "watch",
  "ww3",
] as const;
