import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { getGlobalMarketData } from "@/lib/api/coingecko";
import { getFearGreedIndex } from "@/lib/api/fearGreed";
import { getTopCoins } from "@/lib/api/coingecko";
import { getTrendingCoins } from "@/lib/api/coingecko";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function fmtB(val: number): string {
  if (val >= 1e12) return (val / 1e12).toFixed(2) + "T";
  if (val >= 1e9)  return (val / 1e9).toFixed(1) + "B";
  return val.toLocaleString("en-US");
}

async function getBriefingData() {
  const [global, fearGreed, topCoins, trendingRaw] = await Promise.allSettled([
    getGlobalMarketData(3600),
    getFearGreedIndex(),
    getTopCoins(20, "usd", 3600),
    getTrendingCoins(3600),
  ]);

  return {
    global: global.status === "fulfilled" ? global.value : null,
    fearGreed: fearGreed.status === "fulfilled" ? fearGreed.value : null,
    topCoins: topCoins.status === "fulfilled" ? topCoins.value : [],
    trending: trendingRaw.status === "fulfilled" ? trendingRaw.value.coins : [],
  };
}

export default async function DailyBriefing() {
  const { global, fearGreed, topCoins, trending } = await getBriefingData();

  const gData = global?.data;
  const marketCap = gData?.total_market_cap?.usd ?? 0;
  const capChange = gData?.market_cap_change_percentage_24h_usd ?? 0;
  const fgValue = fearGreed ? parseInt(fearGreed.value) : null;

  // Find top gainer and loser from top 20 coins
  const sorted = [...topCoins].filter((c) => c.price_change_percentage_24h != null);
  const gainer = sorted.sort((a, b) =>
    (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
  )[0] ?? null;
  const loser = sorted.sort((a, b) =>
    (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)
  )[0] ?? null;

  const topTrending = trending[0]?.item ?? null;

  const now = new Date();
  const updatedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  function classifyFG(v: number): string {
    if (v >= 80) return "Extreme Greed";
    if (v >= 60) return "Greed";
    if (v >= 45) return "Neutral";
    if (v >= 25) return "Fear";
    return "Extreme Fear";
  }

  function capTrend(change: number): string {
    if (change > 2) return "rose sharply";
    if (change > 0.5) return "edged higher";
    if (change < -2) return "fell sharply";
    if (change < -0.5) return "pulled back";
    return "was little changed";
  }

  const bullets: { emoji: string; text: string }[] = [];

  if (gainer) {
    const ch = gainer.price_change_percentage_24h ?? 0;
    bullets.push({
      emoji: ch >= 5 ? "🚀" : "📈",
      text: `${gainer.name} leads gains, up ${ch.toFixed(1)}% in the past 24 hours.`,
    });
  }

  if (loser && loser.id !== gainer?.id) {
    const ch = loser.price_change_percentage_24h ?? 0;
    bullets.push({
      emoji: "📉",
      text: `${loser.name} faces selling pressure, down ${Math.abs(ch).toFixed(1)}% in the last 24 hours.`,
    });
  }

  if (fgValue !== null) {
    const label = fearGreed?.value_classification ?? classifyFG(fgValue);
    const sentiment = fgValue >= 60 ? "Investors remain broadly confident." : fgValue <= 40 ? "Caution is elevated across the market." : "Market sentiment is mixed.";
    bullets.push({
      emoji: fgValue >= 60 ? "😌" : fgValue <= 40 ? "😰" : "😐",
      text: `Fear & Greed Index: ${fgValue} (${label}) — ${sentiment}`,
    });
  }

  if (marketCap > 0) {
    bullets.push({
      emoji: capChange >= 0 ? "💹" : "🔻",
      text: `Total crypto market cap ${capTrend(capChange)} to $${fmtB(marketCap)} (${capChange >= 0 ? "+" : ""}${capChange.toFixed(1)}% 24h).`,
    });
  }

  if (topTrending) {
    bullets.push({
      emoji: "🔥",
      text: `Trending: ${topTrending.name} (${topTrending.symbol.toUpperCase()}) is the most-searched coin on CoinGecko right now.`,
    });
  }

  if (bullets.length === 0) {
    return null;
  }

  return (
    <section className="py-4 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark flex">
          {/* Gold accent bar */}
          <div className="w-1 flex-shrink-0 bg-accent-gold" />

          <div className="flex-1 p-5 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-gold">
                    Market Update
                  </p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {formatDate(now)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
                Updated {updatedTime}
              </span>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0 mt-px leading-5">{b.emoji}</span>
                  <p className="text-sm text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                    {b.text}
                  </p>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-2 flex-wrap">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Data sourced from CoinGecko and Alternative.me · For informational purposes only
              </p>
              <Link
                href="/trending"
                className="flex items-center gap-1 text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors flex-shrink-0"
              >
                View trending <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
