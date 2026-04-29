export interface NewsItem {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  thumbnail: string;
  category: string;
}

const RSS_FEEDS = [
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", name: "CoinDesk" },
  { url: "https://cointelegraph.com/rss", name: "Cointelegraph" },
  { url: "https://decrypt.co/feed", name: "Decrypt" },
  { url: "https://bitcoinmagazine.com/.rss/full/", name: "Bitcoin Magazine" },
];

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("bitcoin") || / btc\b/.test(t)) return "Bitcoin";
  if (t.includes("ethereum") || / eth\b/.test(t)) return "Ethereum";
  if (t.includes("regulat") || t.includes(" sec ") || t.includes("legal") || t.includes("government") || t.includes(" law ")) return "Regulation";
  if (t.includes("defi") || t.includes("decentralized finance") || t.includes("yield") || t.includes("liquidity pool")) return "DeFi";
  if (t.includes("nft") || t.includes("non-fungible")) return "NFT";
  if (t.includes("solana") || t.includes("bnb") || t.includes("altcoin") || / xrp\b/.test(t) || t.includes("cardano")) return "Altcoins";
  return "Crypto";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${RSS2JSON}${encodeURIComponent(feedUrl)}`, {
      next: { revalidate: 1800 },
    } as RequestInit & { next?: { revalidate?: number } });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "ok" || !Array.isArray(json.items)) return [];

    return (json.items as Record<string, unknown>[]).slice(0, 10).flatMap((item) => {
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const url = typeof item.link === "string" ? item.link : "";
      if (!title || !url) return [];

      const rawDesc = typeof item.description === "string" ? item.description : "";
      const desc = stripHtml(rawDesc);
      const truncated = desc.length > 150 ? desc.slice(0, 147) + "..." : desc;

      const enclosure = item.enclosure as Record<string, unknown> | undefined;
      // Try sources in priority order: thumbnail field → enclosure link/url → img in description HTML
      const imgInDesc = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? "";
      const thumbnail =
        (typeof item.thumbnail === "string" && item.thumbnail.startsWith("http") ? item.thumbnail : "") ||
        (enclosure && typeof enclosure.link === "string" && enclosure.link.startsWith("http") ? enclosure.link : "") ||
        (enclosure && typeof enclosure.url === "string" && enclosure.url.startsWith("http") ? enclosure.url : "") ||
        (imgInDesc.startsWith("http") ? imgInDesc : "") ||
        "";

      return [{
        title,
        description: truncated,
        source: sourceName,
        publishedAt: typeof item.pubDate === "string" ? item.pubDate : new Date().toISOString(),
        url,
        thumbnail: thumbnail as string,
        category: detectCategory(title),
      }];
    });
  } catch {
    return [];
  }
}

export async function getNewsItems(filter?: string): Promise<NewsItem[]> {
  const settled = await Promise.allSettled(
    RSS_FEEDS.map((f) => fetchFeed(f.url, f.name))
  );

  const all = settled
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!filter) return deduped;

  const fl = filter.toLowerCase();
  const filtered = deduped.filter(
    (item) =>
      item.title.toLowerCase().includes(fl) ||
      item.description.toLowerCase().includes(fl) ||
      item.category.toLowerCase() === fl
  );
  return filtered.length > 0 ? filtered : deduped;
}

export function timeAgo(isoDate: string): string {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
