// pagination.tsx — newer/older links between episode list pages (Ghost's
// {{pagination}} helper).

import type * as React from "react";
import { Link } from "react-router";

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
      {page > 1 && (
        <Link className="newer-posts" to={pathFor(page - 1)}>
          ← Newer
        </Link>
      )}
      <span className="page-number">
        Page {page} of {pages}
      </span>
      {page < pages && (
        <Link className="older-posts" to={pathFor(page + 1)}>
          Older →
        </Link>
      )}
    </nav>
  );
}
