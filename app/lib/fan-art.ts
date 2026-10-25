// fan-art.ts — the producer art: the homepage's community art wall (Ghost
// index.hbs) and the gallery on /artsubmission/ (page-artsubmission.hbs).
// Thumbnails are in public/images/fan-art/, full size in
// public/images/fan-art-large/ (copied from the Ghost theme).

export interface FanArtTile {
  title: string;
  file: string;
  alt: string;
  /** The gallery's caption under the full-size piece. */
  caption: string;
}

export const ART_RIBBON: FanArtTile[] = [
  {
    title: "SirSammons — episode 442",
    file: "sirsammons-ep442-02-04-2022.webp",
    alt: "SirSammons — episode 442",
    caption: "SirSammons — episode 442",
  },
  {
    title: "DOVE — episode 449",
    file: "dove-449-02-21-2022-psalm-126.webp",
    alt: "DOVE — episode 449",
    caption: "DOVE — Psalm 126 (episode 449)",
  },
  {
    title: "Grace — episode 303",
    file: "1grace-ep303-02-22-2021.webp",
    alt: "Grace — episode 303",
    caption: "Grace — episode 303",
  },
  {
    title: "MLCook — episode 348",
    file: "1mlcook-ep348-06-09-2021.webp",
    alt: "MLCook — episode 348",
    caption: "MLCook — episode 348",
  },
  {
    title: "MikeB — episode 317",
    file: "2mikeb-ep317-03-29-2021.webp",
    alt: "MikeB — episode 317",
    caption: "MikeB — episode 317",
  },
  {
    title: "Gonz — Seasoned Splumlord (ep 88)",
    file: "88-gonz-seasoned-splumlord.webp",
    alt: "Gonz — Seasoned Splumlord",
    caption: "Gonz, Seasoned Splumlord (episode 88)",
  },
  {
    title: "Not Chinese News (ep 88)",
    file: "88-if-its-not-good-news-than-it-is-not-chinese-news.webp",
    alt: "If it's not good news, it's not Chinese News",
    caption: "If it isn't good news, it isn't Chinese News (episode 88)",
  },
  {
    title: "Allie — episode 313",
    file: "allie-ep313-03-19-2021.webp",
    alt: "Allie — episode 313",
    caption: "Allie — episode 313",
  },
  {
    title: "Dove — episode 355",
    file: "dove-ep355-06-25-2021.webp",
    alt: "Dove — episode 355",
    caption: "Dove — episode 355",
  },
  {
    title: "SirSammons — episode 451",
    file: "sirsammons451.webp",
    alt: "SirSammons — episode 451",
    caption: "SirSammons — episode 451",
  },
  {
    title: "Allie — episode 448",
    file: "allie-448-02-18-2022.webp",
    alt: "Allie — episode 448",
    caption: "Allie — episode 448",
  },
  {
    title: "MarkA — episode 441",
    file: "marka-ep441-02-02-2022.webp",
    alt: "MarkA — episode 441",
    caption: "MarkA — episode 441",
  },
  {
    title: "Dove — 10 year anniversary poster (ep 439)",
    file: "dove-ep439-01-28-2021-10-year-anniversary-poster.webp",
    alt: "Dove — 10 year anniversary poster",
    caption: "Dove — 10-year anniversary poster (episode 439)",
  },
  {
    title: "mrJAG — episode 434",
    file: "1mrjag-ep434-01-17-2022.webp",
    alt: "mrJAG — episode 434",
    caption: "mrJAG — episode 434",
  },
  {
    title: "JVela — episode 415",
    file: "jvela-ep415-11-24-2021.webp",
    alt: "JVela — episode 415",
    caption: "JVela — episode 415",
  },
  {
    title: "Allie — episode 414",
    file: "allie-ep414-11-22-2021.webp",
    alt: "Allie — episode 414",
    caption: "Allie — episode 414",
  },
  {
    title: "Scenes from the Great Penguin War",
    file: "scenes-from-the-great-penguin-war.webp",
    alt: "Scenes from the Great Penguin War",
    caption: "Scenes from the Great Penguin War",
  },
  { title: "AoL — page 9", file: "aol-page9.webp", alt: "AoL — page 9", caption: "AoL — page 9" },
  {
    title: "ChristineC — episode 394",
    file: "christinec-ep394-09-27-2021.webp",
    alt: "ChristineC — episode 394",
    caption: "ChristineC — episode 394",
  },
  {
    title: "RyanN — episode 389",
    file: "ryann-ep389-09-15-2021.webp",
    alt: "RyanN — episode 389",
    caption: "RyanN — episode 389",
  },
  {
    title: "Dove — Meet the Kevins (ep 386)",
    file: "dove-ep386-09-09-2021-meet-the-kevins.webp",
    alt: "Dove — Meet the Kevins",
    caption: "Dove — Meet the Kevins (episode 386)",
  },
];
