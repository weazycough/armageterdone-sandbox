// site-checks.ts — the HTML/CSS checks behind tests/dist, as pure functions so
// they can be unit-tested on hand-written pages (design labs are written by
// hand, not by React, so quoting and markup vary).

/** Hosts a page may load media from (img/audio/video), and why. */
export const MEDIA_HOSTS = new Set([
  "static.libsyn.com", // episode artwork from the RSS feed
  "traffic.libsyn.com", // episode MP3s (the feed's <enclosure>)
]);

/** Pages (dist-relative file) allowed to embed an iframe, and from where. None yet. */
export const IFRAME_ALLOW: Record<string, string[]> = {};

const TRACKERS =
  /google-analytics\.com|googletagmanager\.com|\bgtag\(|doubleclick\.net|facebook\.net|connect\.facebook|plausible\.io|umami\.is|cdn\.segment\.(?:io|com)|hotjar\.com|clarity\.ms|fonts\.googleapis\.com|fonts\.gstatic\.com|play\.libsyn\.com|html5-player\.libsyn\.com/i;

export interface Tag {
  name: string;
  attrs: Map<string, string>;
}

function decode(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Attributes of one opening tag, quoted with "…", '…' or not at all. */
export function parseAttrs(source: string): Map<string, string> {
  const attrs = new Map<string, string>();
  for (const m of source.matchAll(
    /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,
  )) {
    const name = (m[1] ?? "").toLowerCase();
    if (!attrs.has(name)) attrs.set(name, decode(m[2] ?? m[3] ?? m[4] ?? ""));
  }
  return attrs;
}

export interface ParsedPage {
  tags: Tag[];
  /** Bodies of <script> elements without a src. */
  inlineScripts: string[];
  /** Bodies of <style> elements. */
  styles: string[];
}

/** Opening tags plus script and style bodies. Comments are dropped, and tags
 *  inside scripts and styles are not tags. */
export function parsePage(html: string): ParsedPage {
  const inlineScripts: string[] = [];
  const styles: string[] = [];
  const body = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /(<script\b(?:[^>"']|"[^"]*"|'[^']*')*>)([\s\S]*?)<\/script\s*>/gi,
      (_m, open: string, inner: string) => {
        if (!/\ssrc\s*=/i.test(open)) inlineScripts.push(inner);
        return open;
      },
    )
    .replace(/(<style\b[^>]*>)([\s\S]*?)<\/style\s*>/gi, (_m, open: string, inner: string) => {
      styles.push(inner);
      return open;
    });
  const tags = [...body.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)].map(
    (m) => ({
      name: (m[1] ?? "").toLowerCase(),
      attrs: parseAttrs(m[2] ?? ""),
    }),
  );
  return { tags, inlineScripts, styles };
}

/** The robots meta must sit in the server-sent <head> and say all three. */
export function robotsProblem(html: string): string | null {
  const end = html.search(/<\/head\s*>/i);
  if (end === -1) return "no </head>";
  const metas = parsePage(html.slice(0, end)).tags.filter(
    (t) => t.name === "meta" && t.attrs.get("name")?.toLowerCase() === "robots",
  );
  const ok = metas.some((t) => {
    const words = new Set((t.attrs.get("content") ?? "").toLowerCase().split(/[\s,]+/));
    return words.has("noindex") && words.has("nofollow") && words.has("noarchive");
  });
  return ok ? null : 'no <meta name=robots content="noindex, nofollow, noarchive"> in <head>';
}

/** The host of an absolute or protocol-relative URL; null for same-site URLs. */
export function externalHost(url: string): string | null {
  const u = url.trim();
  if (/^(?:data|blob|mailto|tel|javascript):/i.test(u)) return null;
  try {
    if (u.startsWith("//")) return new URL(`https:${u}`).hostname;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return new URL(u).hostname || u;
  } catch {
    return u;
  }
  return null;
}

/** Every URL in a srcset ("a.png 1x, b.png 2x"). */
export function srcsetUrls(srcset: string): string[] {
  return srcset
    .split(",")
    .map((c) => c.trim().split(/\s+/)[0] ?? "")
    .filter((u) => u !== "");
}

/** url(…) and @import targets in a stylesheet or a style attribute. */
export function cssUrls(css: string): string[] {
  const urls = [...css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi)].map(
    (m) => m[1] ?? m[2] ?? m[3] ?? "",
  );
  const imports = [...css.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)].map(
    (m) => m[1] ?? m[2] ?? "",
  );
  return [...urls, ...imports].filter((u) => u !== "");
}

/** Stylesheet loads that leave the site. */
export function cssProblems(css: string): string[] {
  return cssUrls(css)
    .filter((u) => externalHost(u) !== null)
    .map((u) => `css loads ${u}`);
}

const MEDIA_TAGS = new Set(["img", "audio", "video", "source", "track", "picture", "input"]);
/** SVG elements that load what their href points at. */
const SVG_LOADS = new Set(["image", "use", "feimage"]);

/** React Router's hydration data: one call with one string literal, so it
 *  carries text (show notes may mention any site) but can't run anything. */
const HYDRATION_DATA =
  /^window\.__reactRouterContext\.streamController\.enqueue\("(?:[^"\\]|\\[\s\S])*"\);$/;

/** Hosts named in a script ("https://host/…", "//host/…"). */
export function scriptHosts(js: string): string[] {
  return [...js.matchAll(/(?:https?:)?\/\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi)].map((m) =>
    (m[1] ?? "").toLowerCase(),
  );
}
const LINK_LOADS =
  /\b(?:stylesheet|preload|modulepreload|prefetch|prerender|preconnect|dns-prefetch|icon|apple-touch-icon|manifest)\b/i;

/** Everything on a page that would load, run or send something off-site. */
export function thirdPartyProblems(html: string, file: string): string[] {
  const page = parsePage(html);
  const problems: string[] = [];
  const iframeAllow = IFRAME_ALLOW[file] ?? [];

  for (const { name, attrs } of page.tags) {
    const urls = (...keys: string[]) =>
      keys.flatMap((k) =>
        attrs.has(k)
          ? k.endsWith("srcset")
            ? srcsetUrls(attrs.get(k) ?? "")
            : [attrs.get(k) ?? ""]
          : [],
      );
    const external = (list: string[]) => list.filter((u) => externalHost(u) !== null);

    if (name === "script") for (const u of external(urls("src"))) problems.push(`script from ${u}`);
    if (name === "link" && LINK_LOADS.test(attrs.get("rel") ?? "")) {
      const imagePreload = (attrs.get("as") ?? "") === "image";
      for (const u of external(urls("href", "imagesrcset"))) {
        if (!(imagePreload && MEDIA_HOSTS.has(externalHost(u) ?? "")))
          problems.push(`<link rel=${attrs.get("rel") ?? ""}> to ${u}`);
      }
    }
    if (MEDIA_TAGS.has(name)) {
      for (const u of external(urls("src", "srcset", "poster"))) {
        if (!MEDIA_HOSTS.has(externalHost(u) ?? "")) problems.push(`<${name}> loads ${u}`);
      }
    }
    if (name === "iframe" || name === "embed" || name === "object" || name === "frame") {
      const target = urls("src", "data")[0] ?? "";
      if (!iframeAllow.includes(externalHost(target) ?? "")) problems.push(`<${name}> ${target}`);
    }
    if (SVG_LOADS.has(name)) {
      for (const u of external(urls("href", "xlink:href"))) problems.push(`<${name}> loads ${u}`);
    }
    // <body background>, and the same legacy attribute on tables.
    for (const u of external(urls("background"))) problems.push(`<${name} background=${u}>`);
    if (attrs.has("ping")) problems.push(`<${name} ping=${attrs.get("ping") ?? ""}>`);
    if (name === "meta" && (attrs.get("http-equiv") ?? "").toLowerCase() === "refresh") {
      const target = /url\s*=\s*['"]?([^'";]+)/i.exec(attrs.get("content") ?? "")?.[1] ?? "";
      if (externalHost(target) !== null) problems.push(`meta refresh to ${target}`);
    }
    if (name === "form" && (attrs.has("action") || attrs.has("method")))
      problems.push("form with an action or method (preview forms send nothing)");
    if (name === "base" && externalHost(attrs.get("href") ?? "") !== null)
      problems.push(`<base href=${attrs.get("href") ?? ""}>`);
    if (attrs.has("style")) problems.push(...cssProblems(attrs.get("style") ?? ""));
  }

  for (const css of page.styles) problems.push(...cssProblems(css));
  for (const js of page.inlineScripts) {
    if (HYDRATION_DATA.test(js.trim())) continue;
    const m = TRACKERS.exec(js);
    if (m !== null) problems.push(`inline script references ${m[0]}`);
    // A script that names another site can load or send to it (a beacon).
    for (const host of scriptHosts(js)) {
      if (!MEDIA_HOSTS.has(host)) problems.push(`inline script names ${host}`);
    }
  }
  return problems;
}

/** Tracker or hosted-player references in a script or stylesheet file. */
export function trackerIn(text: string): string | null {
  return TRACKERS.exec(text)?.[0] ?? null;
}

/** Every URL a page links to or loads, for the link check. */
export function pageUrls(html: string): string[] {
  const out: string[] = [];
  for (const { attrs } of parsePage(html).tags) {
    for (const k of ["href", "src", "poster", "data", "action"]) {
      const v = attrs.get(k);
      if (v !== undefined) out.push(v);
    }
    for (const k of ["srcset", "imagesrcset"]) {
      const v = attrs.get(k);
      if (v !== undefined) out.push(...srcsetUrls(v));
    }
  }
  return out;
}
