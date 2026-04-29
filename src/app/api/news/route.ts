import { NextRequest, NextResponse } from "next/server";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

const FEEDS = [
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", name: "CoinDesk" },
  { url: "https://cointelegraph.com/rss", name: "Cointelegraph" },
  { url: "https://decrypt.co/feed", name: "Decrypt" },
  { url: "https://bitcoinmagazine.com/.rss/full/", name: "Bitcoin Magazine" },
  { url: "https://cryptonews.com/news/feed/", name: "CryptoNews" },
];

function detectCategory(categories: string[], title: string): string {
  const cats = categories.join(" ").toLowerCase();
  const t = title.toLowerCase();
  if (cats.includes("btc") || cats.includes("bitcoin") || t.includes("bitcoin") || /\bbtc\b/.test(t)) return "Bitcoin";
  if (cats.includes("eth") || cats.includes("ethereum") || t.includes("ethereum") || /\beth\b/.test(t)) return "Ethereum";
  if (cats.includes("regulation") || cats.includes("policy") || t.includes("regulat") || t.includes(" sec ") || t.includes("legal")) return "Regulation";
  if (cats.includes("defi") || t.includes("defi") || t.includes("yield") || t.includes("liquidity")) return "DeFi";
  if (cats.includes("nft") || t.includes("nft") || t.includes("non-fungible")) return "NFT";
  if (cats.includes("xrp") || cats.includes("sol") || cats.includes("bnb") || t.includes("altcoin") || /\bxrp\b/.test(t) || t.includes("solana")) return "Altcoins";
  return "Crypto";
}

function extractThumbnail(item: Record<string, unknown>): string {
  const thumb = item.thumbnail;
  if (typeof thumb === "string" && thumb.startsWith("http")) return thumb;

  const enc = item.enclosure as Record<string, unknown> | undefined;
  if (enc) {
    if (typeof enc.link === "string" && enc.link.startsWith("http")) return enc.link;
    if (typeof enc.url === "string" && enc.url.startsWith("http")) return enc.url;
    if (typeof enc.thumbnail === "string" && enc.thumbnail.startsWith("http")) return enc.thumbnail;
  }

  const desc = typeof item.description === "string" ? item.description : "";
  const match = desc.match(/<img[^>]+src=["'](https?[^"']+)/i);
  return match?.[1] ?? "";
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
      next: { revalidate: 300 },
    } as RequestInit & { next?: { revalidate?: number } });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.status !== "ok" || !Array.isArray(json.items)) return [];

    return (json.items as Record<string, unknown>[]).flatMap((item) => {
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const url = typeof item.link === "string" ? item.link : "";
      if (!title || !url) return [];

      const rawDesc = typeof item.description === "string" ? item.description : "";
      const body = stripHtml(rawDesc);
      const description = body.length > 180 ? body.slice(0, 177) + "..." : body;

      const pubDateStr = typeof item.pubDate === "string" ? item.pubDate : "";
      const publishedMs = pubDateStr ? new Date(pubDateStr).getTime() : Date.now();
      const publishedTs = Math.floor(publishedMs / 1000);

      const cats = Array.isArray(item.categories) ? item.categories as string[] : [];

      return [{
        id: typeof item.guid === "string" ? item.guid : url,
        title,
        description,
        source: sourceName,
        publishedAt: new Date(publishedMs).toISOString(),
        url,
        thumbnail: extractThumbnail(item),
        category: detectCategory(cats, title),
        publishedTs,
      }];
    });
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const before = req.nextUrl.searchParams.get("before");

  // RSS feeds don't support "before" pagination — return empty to signal end
  if (before) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  }

  try {
    const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.url, f.name)));
    const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

    all.sort((a, b) => b.publishedTs - a.publishedTs);

    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(deduped, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
