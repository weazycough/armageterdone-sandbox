// art-gallery.tsx — the producer art wall on /artsubmission/: thumbnails that
// open the full piece in a modal, with previous/next buttons and the arrow
// keys (Ghost page-artsubmission.hbs, whose inline script this replaces).
// React Aria's modal does the rest: Escape or a click outside closes it, focus
// stays inside while open and returns to the thumbnail after, and the page
// behind doesn't scroll.

import { useEffect, useState } from "react";
import type * as React from "react";
import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { asset } from "../lib/asset";
import type { FanArtTile } from "../lib/fan-art";

function Icon({ d, size }: { d: string; size: number }): React.ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function ArtGallery({ tiles }: { tiles: FanArtTile[] }): React.ReactNode {
  const [current, setCurrent] = useState<number | null>(null);
  const tile = current === null ? undefined : tiles[current];
  const count = tiles.length;

  function step(by: number): void {
    setCurrent((i) => (i === null ? i : (i + by + count) % count));
  }

  const open = current !== null;
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent): void {
      const by = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (by !== 0) setCurrent((i) => (i === null ? i : (i + by + count) % count));
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, count]);

  return (
    <>
      <div className="art-ribbon__grid art-gallery">
        {tiles.map((t, i) => (
          <button
            className="art-ribbon__tile art-gallery__thumb"
            type="button"
            aria-label={`View: ${t.alt}`}
            key={t.file}
            onClick={() => {
              setCurrent(i);
            }}
          >
            <img
              src={asset(`images/fan-art/${t.file}`)}
              alt={t.alt}
              loading="lazy"
              width="200"
              height="200"
            />
          </button>
        ))}
      </div>

      <ModalOverlay
        className="art-modal"
        isDismissable
        isOpen={tile !== undefined}
        onOpenChange={(open) => {
          if (!open) setCurrent(null);
        }}
      >
        <Modal>
          <Dialog aria-label="Artwork preview" className="outline-none">
            {({ close }) =>
              tile !== undefined && (
                <>
                  <Button className="art-modal__close" aria-label="Close (Esc)" onPress={close}>
                    <Icon d="M6 6l12 12M6 18L18 6" size={24} />
                  </Button>
                  <Button
                    className="art-modal__nav art-modal__nav--prev"
                    aria-label="Previous"
                    onPress={() => {
                      step(-1);
                    }}
                  >
                    <Icon d="M15 6l-6 6 6 6" size={28} />
                  </Button>
                  <Button
                    className="art-modal__nav art-modal__nav--next"
                    aria-label="Next"
                    onPress={() => {
                      step(1);
                    }}
                  >
                    <Icon d="M9 6l6 6-6 6" size={28} />
                  </Button>
                  <figure className="art-modal__figure">
                    <img
                      className="art-modal__img"
                      src={asset(`images/fan-art-large/${tile.file}`)}
                      alt={tile.caption}
                      decoding="async"
                    />
                    <figcaption className="art-modal__caption">{tile.caption}</figcaption>
                  </figure>
                </>
              )
            }
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
