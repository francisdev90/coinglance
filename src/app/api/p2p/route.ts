import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const asset = req.nextUrl.searchParams.get("asset") ?? "USDT";
  const fiat = req.nextUrl.searchParams.get("fiat") ?? "NGN";
  const tradeType = req.nextUrl.searchParams.get("tradeType") ?? "BUY";

  try {
    const res = await fetch(
      "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset,
          fiat,
          tradeType,
          page: 1,
          rows: 10,
          payTypes: [],
          countries: [],
          publisherType: null,
          merchantCheck: false,
        }),
        next: { revalidate: 60 },
      } as RequestInit & { next?: { revalidate?: number } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "P2P API unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const items = (data.data ?? []) as Record<string, unknown>[];
    const prices = items
      .slice(0, 5)
      .map((item) => {
        const adv = item.adv as Record<string, unknown> | undefined;
        return parseFloat((adv?.price as string) ?? "0");
      })
      .filter((p) => p > 0);

    const avg = prices.length > 0
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : null;

    return NextResponse.json({
      asset,
      fiat,
      tradeType,
      avg: avg ? parseFloat(avg.toFixed(2)) : null,
      rates: prices,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch P2P rates" }, { status: 500 });
  }
}
