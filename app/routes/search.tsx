// search.tsx — dedicated search across News Talk, Radio, Clubhouse episodes
// and FaceLikeTheSun videos. The episode index is the site search file; the
// FLTS catalog is fetched only on this page.

import { useEffect, useMemo, useState } from "react";
import type * as React from "react";
import { Link, useSearchParams } from "react-router";
import { NewsletterDispatch } from "../components/newsletter-dispatch";
import { PagerButton } from "../components/pagination";
import { V4vBand } from "../components/v4v-band";
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
      <header className="search-hero page-intro hero-top-glow">
        <div className="container">
          <div className="page-intro__inner" style={{ maxWidth: "52rem", margin: "0 auto" }}>
            <span className="eyebrow">Archive</span>
            <h1 className="page-intro__title">Search</h1>
            <div className="search-hero__craft" aria-hidden="true">
              <img
                className="search-hero__ufo"
                src={asset("images/search-ufo.webp")}
                alt=""
                width={1400}
                height={383}
              />
              <span className="search-hero__beam">
                <span className="search-hero__beam-glow" />
                <span className="search-hero__beam-cone" />
                <span className="search-hero__beam-core" />
                <svg
                  className="search-hero__beam-shade"
                  viewBox="0 0 1000 800"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="search-beam-shade-fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0.14" stopColor="#061828" stopOpacity="0.75" />
                      <stop offset="0.22" stopColor="#050f1c" stopOpacity="1" />
                      <stop offset="0.46" stopColor="#050f1c" stopOpacity="1" />
                      <stop offset="0.56" stopColor="#061828" stopOpacity="0.88" />
                      <stop offset="0.66" stopColor="#050f1c" stopOpacity="0" />
                    </linearGradient>
                    <filter
                      id="search-beam-shade-blur"
                      x="-40%"
                      y="-12%"
                      width="180%"
                      height="130%"
                    >
                      <feGaussianBlur stdDeviation="6" />
                    </filter>
                    <filter
                      id="search-beam-rim-blur"
                      x="-40%"
                      y="-12%"
                      width="180%"
                      height="130%"
                    >
                      <feGaussianBlur stdDeviation="9" />
                    </filter>
                  </defs>
                  <path
                    filter="url(#search-beam-rim-blur)"
                    fill="rgba(6, 186, 223, 0.32)"
                    d="M428 152 L428 338 C428 372 382 388 330 408 L670 408 C618 388 572 372 572 338 L572 152 Z"
                  />
                  <path
                    filter="url(#search-beam-shade-blur)"
                    fill="url(#search-beam-shade-fade)"
                    d="M450 152 L450 345 C450 378 412 392 378 408 L622 408 C588 392 550 378 550 345 L550 152 Z"
                  />
                </svg>
              </span>
            </div>
            <p className="page-intro__lede">
              Search the full Canary Cry archive by transcript, title, or topic. Put a phrase in
              quotes to match it exactly.
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

      <V4vBand />
      <NewsletterDispatch />
    </article>
  );
}
