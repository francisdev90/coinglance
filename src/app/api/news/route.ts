import { NextResponse } from "next/server";

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
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function fetchFeed(feedUrl: string, sourceName: string) {
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
        thumbnail,
        category: detectCategory(title),
      }];
    });
  } catch {
    return [];
  }
}

export async function GET() {
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

  return NextResponse.json(deduped, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
