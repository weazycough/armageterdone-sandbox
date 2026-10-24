// serve-dist.ts — serve dist/ at http://127.0.0.1:4173/Armageterdone/ the way
// GitHub Pages will: directory URLs get index.html, missing paths get
// 404.html with a 404 status. Local only (bound to the loopback address).
//
//   pnpm preview        (after pnpm build)

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { BASE } from "../app/lib/paths.ts";

const PORT = Number(process.env.PORT ?? 4173);
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".data": "text/x-script",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};

function send(res: import("node:http").ServerResponse, status: number, file: string): void {
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  if (!path.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE }).end();
    return;
  }
  let file = normalize(join("dist", path.slice(BASE.length)));
  if (!file.startsWith("dist")) {
    res.writeHead(400).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith("/")) {
      res.writeHead(301, { Location: `${path}/` }).end();
      return;
    }
    file = join(file, "index.html");
  }
  if (existsSync(file)) send(res, 200, file);
  else send(res, 404, "dist/404.html");
}).listen(PORT, "127.0.0.1", () => {
  console.log(`serving dist/ at http://127.0.0.1:${String(PORT)}${BASE}`);
});
