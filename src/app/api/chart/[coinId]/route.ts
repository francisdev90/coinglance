import { NextRequest, NextResponse } from "next/server";

const CG_BASE = "https://api.coingecko.com/api/v3";

export async function GET(
  req: NextRequest,
  { params }: { params: { coinId: string } }
) {
  const { coinId } = params;
  const currency = (req.nextUrl.searchParams.get("currency") ?? "usd").toLowerCase();
  const days = req.nextUrl.searchParams.get("days") ?? "7";
  const ttl = days === "max" || Number(days) >= 90 ? 3600 : 300;

  const url =
    `${CG_BASE}/coins/${encodeURIComponent(coinId)}/market_chart` +
    `?vs_currency=${currency}&days=${days}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: ttl },
    });
    if (!res.ok) {
      console.error(`[api/chart/${coinId}] CoinGecko ${res.status}`);
      return NextResponse.json({ error: `CoinGecko ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}` },
    });
  } catch (err) {
    console.error(`[api/chart/${coinId}]`, err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
