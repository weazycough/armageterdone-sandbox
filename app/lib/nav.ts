// nav.ts — the primary navigation and the footer columns, ported from the
// Ghost theme (partials/main-nav.hbs, default.hbs). Internal hrefs are router
// paths ("/support/"); anything starting with "http" is external.
//
// Differences from the Ghost theme, until pages for them exist:
// - the footer's "Hangouts" link is gone (no such page), and "Privacy" points
//   at the text-message privacy page.

export interface NavLink {
  label: string;
  href: string;
  meta?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  cta?: boolean;
  menu?: NavLink[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Shows", href: "/shows/" },
  {
    label: "Community",
    menu: [
      { label: "Meet-Ups", href: "/meet-ups/", meta: "In-person gatherings" },
      { label: "Art Submissions", href: "/artsubmission/", meta: "Community artwork" },
      { label: "Speak Pipe", href: "/speakpipe/", meta: "Leave a voicemail" },
      { label: "Discord", href: "https://discord.gg/qRcTvUUqtr", meta: "Real-time community chat" },
      { label: "Telegram", href: "https://t.me/CCNTcommunity", meta: "Producer channel" },
      {
        label: "canarycry.community",
        href: "http://canarycry.community/",
        meta: "Forum & community hub",
      },
    ],
  },
  {
    label: "Producers",
    menu: [
      { label: "The Roundtable", href: "/roundtable/", meta: "Knights, Dames, Barons" },
      { label: "T-Shirt Council", href: "/tshirt/", meta: "Wear the crest" },
      { label: "Supply Box", href: "/supplydrop/", meta: "Monthly producer mailer" },
      {
        label: "Cage Rattler Coffee",
        href: "https://cagerattlercoffee.com/",
        meta: "Drink the discernment",
      },
    ],
  },
  { label: "The Gospel", href: "/the-gospel/" },
  {
    label: "About",
    menu: [
      { label: "About the Show", href: "/about-us-mojave/" },
      { label: "Contact", href: "/contact-us-mojave/" },
    ],
  },
  { label: "Support", href: "/support/", cta: true },
];

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Listen",
    links: [
      { label: "All episodes", href: "/episodes/" },
      { label: "RSS feed", href: "https://canarycry.libsyn.com/rss" },
      { label: "Transcripts", href: "/transcripts/" },
      { label: "Roundtable", href: "/roundtable/" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Meet-Ups", href: "/meet-ups/" },
      { label: "Art Submissions", href: "/artsubmission/" },
      { label: "Speak Pipe", href: "/art-audio-upload/" },
    ],
  },
  {
    heading: "Produce the show",
    links: [
      { label: "Time, talent, treasure", href: "/support/" },
      { label: "Patreon", href: "https://www.patreon.com/ccnt" },
      { label: "Cage Rattler Coffee", href: "https://cagerattlercoffee.com/" },
      { label: "T-Shirt Council", href: "/tshirt/" },
      { label: "The Roundtable", href: "/roundtable/" },
    ],
  },
  {
    heading: "The Hosts",
    links: [
      { label: "Gonz", href: "https://gonzoshimura.com/" },
      { label: "Gonz on Facebook", href: "https://www.facebook.com/GonzoShimura/" },
      { label: "FaceLikeTheSun on X", href: "https://x.com/FaceLikeTheSun" },
      { label: "FaceLikeTheSun Patreon", href: "https://www.patreon.com/facelikethesun" },
      { label: "Basil Rosewater on X", href: "https://x.com/basil_rosewater" },
    ],
  },
];
