// Build-time facts baked into the bundle by vite.config.ts (`define`), from
// .cache/site.json. Kept out of a root loader so every page, including the
// prerendered 404 page, renders without loader data.

declare const __SITE__: {
  latest: { slug: string; title: string; published: string } | null;
  year: number;
};
