// search.tsx — dedicated search across News Talk, Radio, Clubhouse episodes
// and FaceLikeTheSun videos. The episode index is the site search file; the
// FLTS catalog is fetched only on this page.

import { useEffect, useMemo, useState } from "react";
import type * as React from "react";
import { Link, useSearchParams } from "react-router";
import { PagerButton } from "../components/pagination";
import { ButtonLink } from "../components/page-parts";
import { buttonVariants } from "../components/ui/button";
import { asset } from "../lib/asset";
import { cn } from "../lib/utils";
import { formatCardDate } from "../lib/dates";
import { type FltsItem, FLTS_INDEX_FILE, fltsIndexSchema } from "../lib/flts";
import { pageTitle } from "../lib/meta";
import {
  type ParsedQuery,
  type SearchHit,
  type SearchSort,
  type ShowFilter,
  SEARCH_PAGE_SIZE,
  SHOW_FILTERS,
  SHOW_LABELS,
  highlightParts,
  parseQuery,
  parseSearchSort,
  parseShowFilter,
  queryIsEmpty,
  searchCatalog,
  searchPagePath,
} from "../lib/search-query";
import { type SearchEntry, SEARCH_INDEX_FILE, searchIndexSchema } from "../lib/search";

export const meta = () => pageTitle("Search");

type LoadState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; episodes: SearchEntry[]; videos: FltsItem[] };

async function loadIndexes(): Promise<{ episodes: SearchEntry[]; videos: FltsItem[] }> {
  const [episodeRes, fltsRes] = await Promise.all([
    fetch(asset(SEARCH_INDEX_FILE)),
    fetch(asset(FLTS_INDEX_FILE)),
  ]);
  if (!episodeRes.ok) throw new Error(`search index: HTTP ${String(episodeRes.status)}`);
  if (!fltsRes.ok) throw new Error(`flts index: HTTP ${String(fltsRes.status)}`);
  return {
    episodes: searchIndexSchema.parse(await episodeRes.json()),
    videos: fltsIndexSchema.parse(await fltsRes.json()).items,
  };
}

function Highlight({ text, query }: { text: string; query: ParsedQuery }): React.ReactNode {
  if (queryIsEmpty(query)) return text;
  return highlightParts(text, query).map((part, i) =>
    part.mark ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
  );
}

function SearchHitCard({ hit, query }: { hit: SearchHit; query: ParsedQuery }): React.ReactNode {
  const title = <Highlight text={hit.title} query={query} />;
  const meta = [
    hit.date !== undefined ? formatCardDate(hit.date) : null,
    hit.durationLabel || null,
    hit.typeLabel ?? null,
  ].filter((x): x is string => x !== null);

  const heading = hit.external ? (
    <a className="search-hit__title-link" href={hit.href} target="_blank" rel="noopener">
      {title}
    </a>
  ) : (
    <Link className="search-hit__title-link" to={hit.href}>
      {title}
    </Link>
  );

  return (
    <article className="search-hit">
      <div className="search-hit__body">
        <p className="eyebrow">{SHOW_LABELS[hit.show]}</p>
        <h2 className="search-hit__title">{heading}</h2>
        {meta.length > 0 && <p className="search-hit__meta">{meta.join(" · ")}</p>}
        {hit.snippet !== "" && (
          <p className="search-hit__snippet">
            <Highlight text={hit.snippet} query={query} />
          </p>
        )}
      </div>
      <div className="search-hit__actions">
        {hit.episodeHref !== undefined && (
          <ButtonLink href={hit.episodeHref}>Episode page</ButtonLink>
        )}
        {hit.youtubeHref !== undefined && (
          <ButtonLink href={hit.youtubeHref} variant="ghost" newTab>
            Watch on YouTube
          </ButtonLink>
        )}
        {hit.rumbleHref !== undefined && (
          <ButtonLink href={hit.rumbleHref} variant="ghost" newTab>
            Watch on Rumble
          </ButtonLink>
        )}
      </div>
    </article>
  );
}

export default function SearchPage(): React.ReactNode {
  const [params, setParams] = useSearchParams();
  const urlQ = params.get("q") ?? "";
  const filter = parseShowFilter(params.get("show"));
  const sort = parseSearchSort(params.get("sort"));
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const [draft, setDraft] = useState(urlQ);
  const [seenQ, setSeenQ] = useState(urlQ);
  if (urlQ !== seenQ) {
    setSeenQ(urlQ);
    setDraft(urlQ);
  }
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadIndexes().then(
      (data) => {
        if (!cancelled) setState({ status: "ready", ...data });
      },
      () => {
        if (!cancelled) setState({ status: "failed" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const query = useMemo(() => parseQuery(urlQ), [urlQ]);
  const emptyQuery = queryIsEmpty(query);
  const browsing = emptyQuery && filter !== "all";
  const shouldSearch = !emptyQuery || browsing;

  const hits = useMemo(() => {
    if (state.status !== "ready" || !shouldSearch) return [];
    return searchCatalog(state.episodes, state.videos, query, filter, emptyQuery ? "newest" : sort);
  }, [state, query, filter, sort, shouldSearch, emptyQuery]);

  const pages = Math.max(1, Math.ceil(hits.length / SEARCH_PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const pageHits = hits.slice((safePage - 1) * SEARCH_PAGE_SIZE, safePage * SEARCH_PAGE_SIZE);

  function update(next: { q?: string; show?: ShowFilter; sort?: SearchSort; page?: number }): void {
    const q = next.q ?? urlQ;
    const show = next.show ?? filter;
    const nextSort = next.sort ?? sort;
    const path = searchPagePath({
      q,
      show,
      sort: emptyQuery && next.q === undefined ? "newest" : nextSort,
      page: next.page,
    });
    const qs = path.includes("?") ? path.slice(path.indexOf("?") + 1) : "";
    setParams(new URLSearchParams(qs));
  }

  return (
    <article className="page search-page">
      <header className="search-hero page-intro">
        <div className="container">
          <div className="page-intro__inner" style={{ maxWidth: "52rem", margin: "0 auto" }}>
            <span className="eyebrow">Archive</span>
            <h1 className="page-intro__title">Search</h1>
            <span className="page-intro__rule" aria-hidden="true" />
            <p className="page-intro__lede">
              Find episodes from Canary Cry News Talk, Radio, and Clubhouse, plus Gonz&apos;s
              FaceLikeTheSun videos. Put a phrase in quotes to match it exactly.
            </p>
            <div className="search-page__form" role="search">
              <label className="sr-only" htmlFor="search-q">
                Search episodes and videos
              </label>
              <input
                id="search-q"
                className="search-page__input"
                type="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    update({ q: draft, page: 1 });
                  }
                }}
                autoFocus
                autoComplete="off"
                placeholder="Search episodes and videos"
              />
              <button
                className={cn(buttonVariants(), "search-page__submit")}
                type="button"
                onClick={() => update({ q: draft, page: 1 })}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container search-page__body">
          <div className="search-page__controls">
            <div className="search-page__control">
              <p className="eyebrow search-page__control-label" id="search-filter-label">
                Filters
              </p>
              <div className="search-page__pills" role="group" aria-labelledby="search-filter-label">
                {SHOW_FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="pagination__btn search-page__pill"
                    aria-pressed={item.id === filter}
                    onClick={() => update({ show: item.id, page: 1 })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            {!emptyQuery && (
              <div className="search-page__control">
                <p className="eyebrow search-page__control-label" id="search-sort-label">
                  Sort
                </p>
                <div className="search-page__pills" role="group" aria-labelledby="search-sort-label">
                  {(["relevance", "newest"] as SearchSort[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="pagination__btn search-page__pill search-page__pill--sort"
                      aria-pressed={value === sort}
                      onClick={() => update({ sort: value, page: 1 })}
                    >
                      {value === "relevance" ? "Relevance" : "Newest"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {state.status === "loading" && <p className="muted">Loading the index…</p>}
          {state.status === "failed" && (
            <p className="muted">The search index didn&apos;t load. Try again later.</p>
          )}
          {state.status === "ready" && shouldSearch && (
            <>
              <p className="search-page__count" role="status">
                {hits.length === 0
                  ? emptyQuery
                    ? "Nothing in that show yet."
                    : `No results for “${urlQ}”.`
                  : `${String(hits.length)} result${hits.length === 1 ? "" : "s"}${
                      emptyQuery ? "" : ` for “${urlQ}”`
                    }`}
              </p>
              {pageHits.length > 0 && (
                <div className="search-page__results">
                  {pageHits.map((hit) => (
                    <SearchHitCard hit={hit} query={query} key={hit.key} />
                  ))}
                </div>
              )}
              {pages > 1 && (
                <nav className="pagination" aria-label="Search result pages">
                  <PagerButton
                    className="pagination__btn newer-posts"
                    to={
                      safePage > 1
                        ? searchPagePath({ q: urlQ, show: filter, sort, page: safePage - 1 })
                        : null
                    }
                  >
                    ← Previous
                  </PagerButton>
                  <span className="page-number">
                    Page {safePage} of {pages}
                  </span>
                  <PagerButton
                    className="pagination__btn older-posts"
                    to={
                      safePage < pages
                        ? searchPagePath({ q: urlQ, show: filter, sort, page: safePage + 1 })
                        : null
                    }
                  >
                    Next →
                  </PagerButton>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section section--alt" id="topic-index">
        <div className="container">
          <div className="page-intro__inner search-topics">
            <span className="eyebrow">Coming soon</span>
            <h2 className="search-topics__title">Topic Index</h2>
            <span className="page-intro__rule" aria-hidden="true" />
            <p className="search-topics__lede">
              Once Canary Cry transcripts are in, you&apos;ll be able to pick a topic — Antarctica,
              Nephilim, and so on — and see every episode that covers it.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
