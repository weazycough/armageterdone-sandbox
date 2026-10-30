// transcripts.tsx — searchable archive of episode show notes (and real
// transcripts once producers drop them in content/transcripts/). Full spoken
// transcripts are not in the Libsyn feed yet, so this indexes titles + notes
// and says so in the UI. Issue #5 test in the sandbox.

import { useEffect, useMemo, useState } from "react";
import type * as React from "react";
import { Input, SearchField } from "react-aria-components";
import { Link, useSearchParams } from "react-router";
import { BracketHero, ButtonLink, Buttons, Prose, Section } from "../../components/page-parts";
import { asset } from "../../lib/asset";
import { formatCardDate } from "../../lib/dates";
import { pageTitle } from "../../lib/meta";
import {
  type PreparedTranscript,
  type TranscriptHit,
  TRANSCRIPT_INDEX_FILE,
  prepareTranscripts,
  searchTranscripts,
  transcriptIndexSchema,
} from "../../lib/transcript-search";

export const meta = () => pageTitle("Episode Transcripts");

type IndexState =
  | { status: "loading" | "failed" }
  | { status: "ready"; index: PreparedTranscript[]; realCount: number };

async function fetchIndex(): Promise<{ index: PreparedTranscript[]; realCount: number }> {
  const res = await fetch(asset(TRANSCRIPT_INDEX_FILE));
  if (!res.ok) throw new Error(`transcript index: HTTP ${String(res.status)}`);
  const entries = transcriptIndexSchema.parse(await res.json());
  return {
    index: prepareTranscripts(entries),
    realCount: entries.filter((e) => e.source === "transcript").length,
  };
}

function HitCard({ hit }: { hit: TranscriptHit }): React.ReactNode {
  const { entry, snippet, timestamp } = hit;
  const sourceLabel = entry.source === "transcript" ? "Transcript" : "Show notes";
  const title = entry.path ? (
    <Link to={entry.path}>{entry.title}</Link>
  ) : entry.externalUrl !== undefined ? (
    <a href={entry.externalUrl} rel="noopener noreferrer" target="_blank">
      {entry.title}
    </a>
  ) : (
    entry.title
  );

  return (
    <li className="transcript-hit">
      <div className="transcript-hit__meta">
        <span className="transcript-hit__source">{sourceLabel}</span>
        {entry.date !== undefined && (
          <time dateTime={entry.date.slice(0, 10)}>{formatCardDate(entry.date)}</time>
        )}
        {timestamp !== undefined && (
          <span className="transcript-hit__time" title="Nearby timestamp from the notes">
            ~{timestamp}
          </span>
        )}
      </div>
      <h3 className="transcript-hit__title">{title}</h3>
      {snippet.length > 0 && (
        <p className="transcript-hit__snippet">
          {snippet.map((part, i) =>
            part.hit === true ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
          )}
        </p>
      )}
      <div className="transcript-hit__links">
        {entry.path !== undefined && (
          <Link to={entry.path} className="transcript-hit__link">
            Episode page
          </Link>
        )}
        {entry.audioUrl !== undefined && (
          <a
            className="transcript-hit__link"
            href={timestamp !== undefined ? `${entry.audioUrl}#t=${timestamp}` : entry.audioUrl}
            rel="noopener noreferrer"
          >
            Audio
          </a>
        )}
        {entry.videoUrl !== undefined ? (
          <a className="transcript-hit__link" href={entry.videoUrl} rel="noopener noreferrer" target="_blank">
            Video
          </a>
        ) : (
          <Link to="/watch/" className="transcript-hit__link">
            Watch
          </Link>
        )}
        {entry.externalUrl !== undefined && entry.path === undefined && (
          <a
            className="transcript-hit__link"
            href={entry.externalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open transcript
          </a>
        )}
      </div>
    </li>
  );
}

export default function Transcripts(): React.ReactNode {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [state, setState] = useState<IndexState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchIndex().then(
      ({ index, realCount }) => {
        if (!cancelled) setState({ status: "ready", index, realCount });
      },
      () => {
        if (!cancelled) setState({ status: "failed" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(
    () => (state.status === "ready" ? searchTranscripts(state.index, query) : []),
    [state, query],
  );

  const realCount = state.status === "ready" ? state.realCount : 0;
  const notesCount = state.status === "ready" ? state.index.length - realCount : 0;

  return (
    <article className="page transcripts-page">
      <BracketHero
        maxWidth="48rem"
        eyebrow="Searchable archive"
        title="Episode Transcripts"
        lede="Search past shows by topic, guest, or keyword. Results jump to the episode, with audio and video links when we have them."
      />

      <Section>
        <div className="transcript-search">
          <SearchField
            aria-label="Search transcripts and show notes"
            value={query}
            onChange={(value) => {
              if (value.trim() === "") setParams({}, { replace: true });
              else setParams({ q: value }, { replace: true });
            }}
            className="transcript-search__field"
          >
            <Input placeholder="Try bitcoin, nephilim, antarctica…" autoFocus />
          </SearchField>

          <p className="transcript-search__status muted" role="status">
            {state.status === "loading" && "Loading the index…"}
            {state.status === "failed" && "The search index didn't load. Try again later."}
            {state.status === "ready" && query.trim() === "" && (
              <>
                Ready to search {notesCount} episode{notesCount === 1 ? "" : "s"}
                {realCount > 0 && (
                  <>
                    {" "}
                    · {realCount} full transcript{realCount === 1 ? "" : "s"}
                  </>
                )}
                .
              </>
            )}
            {state.status === "ready" && query.trim() !== "" && (
              <>
                {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;.
              </>
            )}
          </p>

          {state.status === "ready" && (
            <div className="transcript-search__notice" role="note">
              <strong>Full spoken transcripts aren&apos;t loaded yet.</strong> Right now this
              searches episode <em>titles</em> and <em>show notes</em> from the Libsyn feed
              {realCount > 0 ? (
                <>
                  , plus {realCount} producer transcript{realCount === 1 ? "" : "s"}
                </>
              ) : null}
              . Drop real transcripts into <code>content/transcripts/</code> and they&apos;ll
              appear here on the next build.
            </div>
          )}

          {results.length > 0 && (
            <ol className="transcript-hits">
              {results.map((hit) => (
                <HitCard
                  key={`${hit.entry.source}:${hit.entry.path ?? hit.entry.externalUrl ?? hit.entry.title}`}
                  hit={hit}
                />
              ))}
            </ol>
          )}

          {state.status === "ready" && query.trim() !== "" && results.length === 0 && (
            <p className="muted">Nothing in the notes matches &quot;{query}&quot;.</p>
          )}
        </div>
      </Section>

      <Section alt>
        <Prose>
          <span className="eyebrow">Want to help?</span>
          <h2>Transcribe an episode.</h2>
          <p>
            Transcripts make the show searchable, citable, and accessible — and they&apos;re one of
            the highest-impact ways producers can contribute talent. Until a full archive exists,
            show notes (topics, timestamps, links) still get you most of the way there.
          </p>
          <Buttons>
            <ButtonLink
              href="https://docs.google.com/forms/d/e/1FAIpQLSfZ-Jv4t0zAmcWmeENve2V8i9FpmTTqG2CSuKd3SrkpdzQUiQ/viewform?usp=sf_link"
              newTab
            >
              Volunteer your skills →
            </ButtonLink>
          </Buttons>
        </Prose>
      </Section>
    </article>
  );
}
