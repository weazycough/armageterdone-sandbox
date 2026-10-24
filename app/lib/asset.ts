// asset.ts — URL for a file in public/ ("images/cc-logo.webp"), under the
// site's base path.

export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
