// face-like-the-sun-card.tsx — Other Works card for Gonz's FaceLikeTheSun
// work (YouTube, site, and the Inhuman collaboration). Spans 2/3 of the
// 3-col row, left-aligned under the three show cards.

import type * as React from "react";
import { asset } from "../lib/asset";
import { SmartLink } from "./smart-link";

const DESC =
  "Gonz's other works: his long-standing YouTube channel featuring documentaries and discernment videos, his personal website, and collaborations including the film Inhuman.";

const LINKS: { href: string; label: string; note?: string; art: string; fit?: "contain" | "cover" }[] = [
  {
    href: "https://youtube.com/@facelikethesun?si=xGgwu6XmwoGWYCAr",
    label: "YouTube Channel",
    art: "images/youtube-play.svg",
    fit: "contain",
  },
  {
    href: "https://gonzoshimura.com/",
    label: "GonzoShimura.com",
    art: "images/gonz-headshot.webp",
  },
  {
    href: "https://a.co/d/0haNI1bQ",
    label: "Inhuman",
    note: "Film",
    art: "images/inhuman-film.webp",
  },
];

export function FaceLikeTheSunCard(): React.ReactNode {
  return (
    <div className="show-card show-card--wide" aria-label="FaceLikeTheSun">
      <span className="show-card__logo show-card__logo--text">FaceLikeTheSun</span>
      <img
        className="show-card__art show-card__art--logo"
        src={asset("images/show-facelikethesun.webp")}
        alt=""
        width={128}
        height={128}
        loading="lazy"
        decoding="async"
      />
      <div className="show-card__body">
        <p className="show-card__desc">{DESC}</p>
        <ul className="show-card__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <SmartLink
                className="show-card__link"
                href={link.href}
                target="_blank"
                rel="noopener"
              >
                <img
                  className={
                    "show-card__thumb" +
                    (link.fit === "contain" ? " show-card__thumb--contain" : "")
                  }
                  src={asset(link.art)}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
                <span className="show-card__link-text">
                  <span className="show-card__link-label">{link.label}</span>
                  {link.note ? <span className="show-card__link-note">{link.note}</span> : null}
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
