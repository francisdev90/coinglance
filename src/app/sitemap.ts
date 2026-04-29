import type { MetadataRoute } from "next";
import { getTopCoins } from "@/lib/api/coingecko";

const BASE = "https://coinglance.app";

const STATIC_ROUTES: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "/",                     priority: 1.0,  changeFreq: "hourly"  },
  { path: "/coins",                priority: 0.95, changeFreq: "hourly"  },
  { path: "/exchanges",            priority: 0.9,  changeFreq: "weekly"  },
  { path: "/news",                 priority: 0.85, changeFreq: "hourly"  },
  { path: "/trending",             priority: 0.8,  changeFreq: "hourly"  },
  { path: "/fear-greed",           priority: 0.75, changeFreq: "hourly"  },
  { path: "/converter",            priority: 0.7,  changeFreq: "monthly" },
  { path: "/p2p-rates",            priority: 0.7,  changeFreq: "daily"   },
  { path: "/about",                priority: 0.5,  changeFreq: "monthly" },
  { path: "/contact",              priority: 0.4,  changeFreq: "monthly" },
  { path: "/affiliate-disclosure", priority: 0.4,  changeFreq: "monthly" },
  { path: "/privacy",              priority: 0.3,  changeFreq: "monthly" },
  { path: "/terms",                priority: 0.3,  changeFreq: "monthly" },
  { path: "/cookies",              priority: 0.3,  changeFreq: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFreq }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));

  let coinEntries: MetadataRoute.Sitemap = [];
  try {
    const coins = await getTopCoins(100, "usd", 86400);
    coinEntries = coins.map((coin, i) => ({
      url: `${BASE}/coin/${coin.id}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: i < 10 ? 0.9 : i < 50 ? 0.8 : 0.7,
    }));
  } catch {
    // Silently skip dynamic entries if CoinGecko is unavailable at build time
  }

  return [...staticEntries, ...coinEntries];
}
