// site-search.tsx — the header's search button and dialog (the Ghost theme
// used Ghost's hosted Sodo Search here). The index is a static file built
// with the site (app/lib/search.ts); it is downloaded the first time the
// dialog opens and searched in the browser, so no query leaves the page.

import { useState } from "react";
import type * as React from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  SearchField,
} from "react-aria-components";
import { Link } from "react-router";
import { asset } from "../../lib/asset";
import { formatCardDate } from "../../lib/dates";
import {
  type Prepared,
  SEARCH_INDEX_FILE,
  prepare,
  search,
  searchIndexSchema,
} from "../../lib/search";

type IndexState =
  | { status: "idle" | "loading" | "failed" }
  | { status: "ready"; index: Prepared[] };

async function fetchIndex(): Promise<Prepared[]> {
  const res = await fetch(asset(SEARCH_INDEX_FILE));
  if (!res.ok) throw new Error(`search index: HTTP ${String(res.status)}`);
  return prepare(searchIndexSchema.parse(await res.json()));
}

function SearchIcon(): React.ReactNode {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SiteSearch(): React.ReactNode {
  const [state, setState] = useState<IndexState>({ status: "idle" });
  const [query, setQuery] = useState("");

  function load(): void {
    if (state.status === "loading" || state.status === "ready") return;
    setState({ status: "loading" });
    fetchIndex().then(
      (index) => {
        setState({ status: "ready", index });
      },
      () => {
        setState({ status: "failed" });
      },
    );
  }

  const results = state.status === "ready" ? search(state.index, query) : [];

  return (
    <DialogTrigger
      onOpenChange={(open) => {
        if (open) load();
      }}
    >
      <Button className="theme-toggle search-toggle" aria-label="Search the show">
        <SearchIcon />
      </Button>
      <ModalOverlay className="site-search" isDismissable>
        <Modal className="site-search__panel">
          <Dialog className="outline-none">
            {({ close }) => (
              <>
                <Heading slot="title" className="sr-only">
                  Search the show
                </Heading>
                <SearchField
                  aria-label="Search episodes and pages"
                  value={query}
                  onChange={setQuery}
                  autoFocus
                  className="site-search__field"
                >
                  <SearchIcon />
                  <Input placeholder="Search episodes and pages" />
                </SearchField>
                {state.status === "ready" && query.trim() !== "" && (
                  <p className="sr-only" role="status">
                    {results.length} results
                  </p>
                )}
                <div className="site-search__results">
                  {state.status === "loading" && <p className="muted">Loading the index…</p>}
                  {state.status === "failed" && (
                    <p className="muted">The search index didn&apos;t load. Try again later.</p>
                  )}
                  {state.status === "ready" && query.trim() !== "" && results.length === 0 && (
                    <p className="muted">Nothing matches &quot;{query}&quot;.</p>
                  )}
                  {results.length > 0 && (
                    <ul>
                      {results.map((r) => (
                        <li key={r.path}>
                          <Link to={r.path} onClick={close}>
                            <span className="site-search__kind">
                              {r.kind === "episode" ? "Episode" : "Page"}
                              {r.date !== undefined && ` · ${formatCardDate(r.date)}`}
                            </span>
                            <span className="site-search__title">{r.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
