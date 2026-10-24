// platform-row.tsx — "Listen on" chips for the podcast apps (Ghost index.hbs;
// URLs verified for the Ghost theme 2026-06-22, Overcast built from the
// iTunes id).

import type * as React from "react";

const PLATFORMS: {
  label: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  stroke?: boolean;
}[] = [
  {
    label: "Spotify",
    title: "Spotify",
    href: "https://open.spotify.com/show/5OCF84FjYp4TkBpbF9Z7ZC",
    icon: (
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2-10.4-1.1a.75.75 0 0 1-.3-1.5c4.5-1 8.3-.7 11.5 1.3.3.2.4.7.2 1zm1.4-3.2a.94.94 0 0 1-1.3.3c-3.2-2-8.1-2.5-11.9-1.4a.94.94 0 1 1-.5-1.8c4.4-1.3 9.8-.7 13.5 1.6.4.3.5.9.2 1.3zm.1-3.4c-3.8-2.3-10.2-2.5-13.9-1.4a1.13 1.13 0 1 1-.7-2.2c4.2-1.3 11.3-1 15.7 1.6a1.13 1.13 0 1 1-1.1 2z" />
    ),
  },
  {
    label: "Apple",
    title: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/canary-cry-news-talk/id1146781072",
    icon: (
      <path d="M12 1a11 11 0 0 0-1.8 21.85c-.05-.93-.1-2.36.02-3.37.1-.92 1.07-5.83 1.07-5.83s-.27-.55-.27-1.36c0-1.28.74-2.23 1.66-2.23.79 0 1.17.59 1.17 1.3 0 .8-.5 1.99-.77 3.1-.21.93.47 1.69 1.39 1.69 1.67 0 2.96-1.76 2.96-4.3 0-2.25-1.62-3.83-3.93-3.83a4.08 4.08 0 0 0-4.25 4.09c0 .81.31 1.68.7 2.15.07.1.08.18.06.27-.07.28-.21.86-.24.97-.04.16-.13.2-.3.12-1.1-.51-1.79-2.13-1.79-3.43 0-2.79 2.02-5.36 5.83-5.36 3.06 0 5.44 2.18 5.44 5.1 0 3.04-1.92 5.49-4.58 5.49-.9 0-1.74-.47-2.03-1.02 0 0-.44 1.66-.54 2.07-.2.76-.74 1.71-1.1 2.29A11 11 0 1 0 12 1z" />
    ),
  },
  {
    label: "Amazon",
    title: "Amazon Music",
    href: "https://music.amazon.com/podcasts/07571598-7c8b-4bbe-ab4f-ab0fb9f4054d/canary-cry-news-talk",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M7 14c2 1.5 8 1.5 10 0M7.5 16c2 1 7 1 9 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    label: "iHeart",
    title: "iHeartRadio",
    href: "https://www.iheart.com/podcast/263-canary-cry-news-talk-29468479/",
    icon: <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />,
  },
  {
    label: "Castbox",
    title: "Castbox",
    href: "https://castbox.fm/channel/Canary-Cry-News-Talk-id2865097",
    stroke: true,
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 14h8" />
      </>
    ),
  },
  {
    label: "Overcast",
    title: "Overcast",
    href: "https://overcast.fm/itunes1146781072",
    stroke: true,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "YouTube",
    title: "YouTube",
    href: "https://www.youtube.com/c/CanaryCryNewsTalk",
    icon: (
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.5v-7L16 12l-6.4 3.5z" />
    ),
  },
  {
    label: "Rumble",
    title: "Rumble",
    href: "https://rumble.com/c/CanaryCryNewsTalk",
    icon: (
      <path d="M14.4528 13.5458c.8064-.6542.9297-1.8381.2756-2.6445a1.8802 1.8802 0 0 0-.2756-.2756 21.2127 21.2127 0 0 0-4.3121-2.776c-1.066-.51-2.256.2-2.4261 1.414a23.5226 23.5226 0 0 0-.14 5.5021c.116 1.23 1.292 1.964 2.372 1.492a19.6285 19.6285 0 0 0 4.5062-2.704v-.008zm6.9322-5.4002c2.0335 2.228 2.0396 5.637.014 7.8723A26.1487 26.1487 0 0 1 8.2946 23.846c-2.6848.6713-5.4168-.914-6.1662-3.5781-1.524-5.2002-1.3-11.0803.17-16.3045.772-2.744 3.3521-4.4661 6.0102-3.832 4.9242 1.174 9.5443 4.196 13.0764 8.0121v.002z" />
    ),
  },
  {
    label: "RSS",
    title: "RSS feed",
    href: "https://canarycrynewstalk.libsyn.com/rss",
    icon: (
      <path d="M5 3a16 16 0 0 1 16 16h-3A13 13 0 0 0 5 6V3zm0 6a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V9zm2 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
    ),
  },
];

export function PlatformRow(): React.ReactNode {
  return (
    <div className="platform-row" aria-label="Listen on">
      <span className="platform-row__label">Listen on</span>
      {PLATFORMS.map((p) => (
        <a
          key={p.label}
          className="platform-row__chip"
          href={p.href}
          rel="noopener"
          title={p.title}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            {...(p.stroke === true
              ? { fill: "none", stroke: "currentColor", strokeWidth: 1.6 }
              : { fill: "currentColor" })}
          >
            {p.icon}
          </svg>
          <span>{p.label}</span>
        </a>
      ))}
    </div>
  );
}
