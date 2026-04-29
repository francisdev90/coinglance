import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "CoinGlance — Live Crypto Markets",
    short_name:       "CoinGlance",
    description:      "A glance at global crypto markets. Live prices, exchange comparison, trusted news.",
    start_url:        "/",
    display:          "standalone",
    orientation:      "portrait",
    background_color: "#0A1628",
    theme_color:      "#D4A545",
    categories:       ["finance", "cryptocurrency", "markets"],
    icons: [
      // SVG — any size (modern browsers, desktop PWA)
      {
        src:     "/icon.svg",
        sizes:   "any",
        type:    "image/svg+xml",
        purpose: "any",
      },
      {
        src:     "/icon-maskable.svg",
        sizes:   "any",
        type:    "image/svg+xml",
        purpose: "maskable",
      },
      // PNG — Android home screen / Chrome PWA
      {
        src:     "/icon-192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-maskable-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "maskable",
      },
      // Apple Touch Icon
      {
        src:     "/apple-touch-icon.png",
        sizes:   "180x180",
        type:    "image/png",
      },
    ],
  };
}
