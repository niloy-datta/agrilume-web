// Minimal static server for the `next build` export in ./out (used by the Playwright end-to-end tests).
// Mirrors static hosting: /path -> /path.html or /path/index.html. Refuses paths outside ./out.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../out", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".wasm": "application/wasm", ".ico": "image/x-icon", ".txt": "text/plain", ".mp4": "video/mp4", ".webp": "image/webp", ".tflite": "application/octet-stream", ".binarypb": "application/octet-stream", ".data": "application/octet-stream" };

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^[\\/]+/, "");
  const base = join(root, clean);
  if (!base.startsWith(root)) return null;
  // Next 16 export stores RSC payloads as nested folders (__next.a/__PAGE__.txt) while the client requests dotted
  // names (__next.a.__PAGE__.txt); Vercel maps these natively, plain static hosts do not.
  const rscNested = base.replace(/(__next\.[^\\/]+)\.(__PAGE__)\.txt$/, "$1/$2.txt");
  for (const c of [base, `${base}.html`, join(base, "index.html"), rscNested]) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/html" });
    return res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, "127.0.0.1", () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
