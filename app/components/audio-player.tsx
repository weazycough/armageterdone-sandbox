// audio-player.tsx — the episode MP3 in the browser's own <audio> player.
// No hosted player widget, so no third-party scripts or tracking pixels;
// preload="none" means nothing downloads until the listener presses play.

import type * as React from "react";

export function AudioPlayer({
  src,
  type,
  title,
}: {
  src: string;
  type: string;
  title: string;
}): React.ReactNode {
  return (
    <audio controls preload="none" title={title}>
      <source src={src} type={type} />
      <a href={src}>Download the episode audio</a>
    </audio>
  );
}
