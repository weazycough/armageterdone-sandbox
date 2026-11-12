// pagination.tsx — newer/older links between episode list pages (Ghost's
// {{pagination}} helper). Shared by the full archive and each show's tag
// list; the chrome is the site's yellow pills and Bebas labels, but the
// paths and page math stay the same.

import type * as React from "react";
import { Link } from "react-router";

export function PagerButton({
  to,
  className,
  children,
}: {
  /** `null` renders a disabled, non-interactive stand-in so first/last pages keep their layout. */
  to: string | null;
  className: string;
  children: React.ReactNode;
}): React.ReactNode {
  if (to === null) {
    return (
      <span className={`${className} pagination__btn--disabled`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export function Pagination({
  page,
  pages,
  pathFor,
}: {
  page: number;
  pages: number;
  /** The router path of list page N. */
  pathFor: (page: number) => string;
}): React.ReactNode {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Episode pages">
      <PagerButton
        className="pagination__btn newer-posts"
        to={page > 1 ? pathFor(page - 1) : null}
      >
        ← Newer
      </PagerButton>
      <span className="page-number">
        Page {page} of {pages}
      </span>
      <PagerButton
        className="pagination__btn older-posts"
        to={page < pages ? pathFor(page + 1) : null}
      >
        Older →
      </PagerButton>
    </nav>
  );
}
