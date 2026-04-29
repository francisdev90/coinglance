import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

const securityHeaders = [
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "coin-images.coingecko.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      // News thumbnails from RSS feeds
      { protocol: "https", hostname: "*.coindesk.com" },
      { protocol: "https", hostname: "*.cointelegraph.com" },
      { protocol: "https", hostname: "*.decrypt.co" },
      { protocol: "https", hostname: "*.bitcoinmagazine.com" },
      { protocol: "https", hostname: "images.cointelegraph.com" },
      { protocol: "https", hostname: "s3.cointelegraph.com" },
      { protocol: "https", hostname: "**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Suppress console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};

export default withPWA(nextConfig);
