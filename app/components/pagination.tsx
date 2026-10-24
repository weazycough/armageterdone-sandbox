// pagination.tsx — newer/older links between episode list pages (Ghost's
// {{pagination}} helper).

import type * as React from "react";
import { Link } from "react-router";
import { episodeListPath } from "../lib/paths";

export function Pagination({ page, pages }: { page: number; pages: number }): React.ReactNode {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Episode pages">
      {page > 1 && (
        <Link className="newer-posts" to={episodeListPath(page - 1)}>
          ← Newer
        </Link>
      )}
      <span className="page-number">
        Page {page} of {pages}
      </span>
      {page < pages && (
        <Link className="older-posts" to={episodeListPath(page + 1)}>
          Older →
        </Link>
      )}
    </nav>
  );
}
