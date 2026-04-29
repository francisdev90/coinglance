import { NextRequest, NextResponse } from "next/server";

const CG_BASE = "https://api.coingecko.com/api/v3";

async function cgFetch(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (res.status === 429 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1200 * 2 ** attempt));
    return cgFetch(url, attempt + 1);
  }
  return res;
}

export async function GET(req: NextRequest) {
  const currency = (req.nextUrl.searchParams.get("currency") ?? "usd").toLowerCase();

  const url =
    `${CG_BASE}/coins/markets?vs_currency=${currency}` +
    `&order=market_cap_desc&per_page=100&page=1` +
    `&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;

  try {
    const res = await cgFetch(url);
    if (!res.ok) {
      console.error(`[api/coins] CoinGecko ${res.status} for ${currency}`);
      return NextResponse.json({ error: `CoinGecko ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (err) {
    console.error("[api/coins]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
