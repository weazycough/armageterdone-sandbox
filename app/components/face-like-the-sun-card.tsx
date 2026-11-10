// face-like-the-sun-card.tsx — Other Works cell for Gonz's FaceLikeTheSun
// work. Sits in the 2×2 grid with the other three works; the transparent
// lion art is unchanged.

import type * as React from "react";
import { asset } from "../lib/asset";

const DESC =
  "Gonz's other works: his long-standing YouTube channel featuring documentaries and discernment videos, his personal website, and collaborations including the film Inhuman.";

export function FaceLikeTheSunCard(): React.ReactNode {
  return (
    <div className="show-card" aria-label="FaceLikeTheSun">
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
      </div>
    </div>
  );
}
