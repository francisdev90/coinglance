/**
 * CoinGlance icon generator
 * Converts SVG sources in /public to PNG at required sizes.
 * Run: node scripts/gen-icons.mjs
 */

import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

function svg(name) {
  const path = `${publicDir}/${name}`;
  if (!existsSync(path)) throw new Error(`Missing: ${path}`);
  return readFileSync(path);
}

const jobs = [
  // apple-touch-icon — 180×180, iOS
  { src: "apple-touch-icon.svg", out: "apple-touch-icon.png", w: 180,  h: 180  },
  // PWA icons
  { src: "icon.svg",             out: "icon-192.png",         w: 192,  h: 192  },
  { src: "icon.svg",             out: "icon-512.png",         w: 512,  h: 512  },
  // Maskable (Android adaptive icon)
  { src: "icon-maskable.svg",    out: "icon-maskable-512.png",w: 512,  h: 512  },
  // Favicon fallback (for browsers that don't support SVG favicons, e.g. old Safari)
  { src: "favicon.svg",          out: "favicon-32.png",       w: 32,   h: 32   },
  { src: "favicon.svg",          out: "favicon-16.png",       w: 16,   h: 16   },
];

let ok = 0;
let fail = 0;

for (const { src, out, w, h } of jobs) {
  try {
    await sharp(svg(src), { density: Math.ceil((w / 32) * 72) })
      .resize(w, h, { fit: "fill" })
      .png({ compressionLevel: 9, palette: false })
      .toFile(`${publicDir}/${out}`);
    console.log(`✓  ${out}  (${w}×${h})`);
    ok++;
  } catch (err) {
    console.error(`✗  ${out}: ${err.message}`);
    fail++;
  }
}

console.log(`\n${ok} generated, ${fail} failed.`);
if (fail > 0) process.exit(1);
