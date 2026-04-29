import { NextRequest, NextResponse } from "next/server";

const CC_BASE = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest";

function detectCategory(categories: string, title: string): string {
  const cats = categories.toLowerCase();
  const t = title.toLowerCase();
  if (cats.includes("btc") || cats.includes("bitcoin") || t.includes("bitcoin") || / btc\b/.test(t)) return "Bitcoin";
  if (cats.includes("eth") || cats.includes("ethereum") || t.includes("ethereum") || / eth\b/.test(t)) return "Ethereum";
  if (cats.includes("regulation") || cats.includes("policy") || t.includes("regulat") || t.includes(" sec ") || t.includes("legal")) return "Regulation";
  if (cats.includes("defi") || t.includes("defi") || t.includes("yield") || t.includes("liquidity")) return "DeFi";
  if (cats.includes("nft") || t.includes("nft") || t.includes("non-fungible")) return "NFT";
  if (cats.includes("xrp") || cats.includes("sol") || cats.includes("bnb") || t.includes("altcoin") || / xrp\b/.test(t) || t.includes("solana")) return "Altcoins";
  return "Crypto";
}

export async function GET(req: NextRequest) {
  const before = req.nextUrl.searchParams.get("before");
  const url = before ? `${CC_BASE}&lTs=${before}` : CC_BASE;

  try {
    const res = await fetch(url, {
      next: { revalidate: before ? 3600 : 300 },
    } as RequestInit & { next?: { revalidate?: number } });

    if (!res.ok) {
      return NextResponse.json({ error: "News unavailable" }, { status: 502 });
    }

    const json = await res.json();
    const items: Record<string, unknown>[] = json.Data ?? [];

    const news = items.map((item) => {
      const sourceInfo = item.source_info as Record<string, string> | undefined;
      const body = String(item.body ?? "");
      const description = body.length > 180 ? body.slice(0, 177) + "..." : body;
      return {
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        description,
        source: sourceInfo?.name ?? String(item.source ?? ""),
        publishedAt: new Date(Number(item.published_on) * 1000).toISOString(),
        url: String(item.url ?? ""),
        thumbnail: String(item.imageurl ?? ""),
        category: detectCategory(String(item.categories ?? ""), String(item.title ?? "")),
        publishedTs: Number(item.published_on),
      };
    });

    return NextResponse.json(news, {
      headers: {
        "Cache-Control": `public, s-maxage=${before ? 3600 : 300}, stale-while-revalidate=600`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
