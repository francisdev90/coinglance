"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Flame, Zap, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTrendingCoins, getTopCoins, type TrendingCoin, type CoinMarket } from "@/lib/api/coingecko";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/format";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

function Change({ value }: { value: number | null | undefined }) {
  const v = value ?? 0;
  const pos = v >= 0;
  return (
    <span className={cn("flex items-center gap-0.5 font-mono text-xs font-bold", pos ? "text-success" : "text-danger")}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? "+" : ""}{v.toFixed(2)}%
    </span>
  );
}

function Skeleton({ w, h = 4 }: { w: number; h?: number }) {
  return (
    <div
      className="rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]"
      style={{ width: w, height: h * 4 }}
    />
  );
}

export default function TrendingPage() {
  const { cgId, symbol, isJPY } = useCurrency();
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [gainers, setGainers] = useState<CoinMarket[]>([]);
  const [losers, setLosers] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [trendingData, coinsData] = await Promise.all([
          getTrendingCoins(),
          getTopCoins(100, cgId, 60),
        ]);
        if (!active) return;
        setTrending(trendingData.coins.slice(0, 10));
        const sorted = [...coinsData].filter((c) => c.price_change_percentage_24h != null);
        setGainers([...sorted].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)).slice(0, 10));
        setLosers([...sorted].sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0)).slice(0, 10));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => { active = false; clearInterval(interval); };
  }, [cgId]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <Flame className="w-7 h-7 text-orange-500" />
            Trending Cryptocurrencies
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            What&apos;s hot on CoinGecko right now — top searches, biggest gainers, and sharpest drops
          </p>
        </div>

        {/* Trending from CoinGecko */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-accent-gold" />
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
              CoinGecko Top Searches
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {loading
              ? Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-4 space-y-2">
                    <div className="flex items-center gap-2"><Skeleton w={32} h={8} /><Skeleton w={80} /></div>
                    <Skeleton w={60} />
                  </div>
                ))
              : trending.map((t, i) => (
                  <motion.div
                    key={t.item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/coin/${t.item.id}`}
                      className="block rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-4 hover:border-accent-gold/40 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-text-secondary-light dark:text-text-secondary-dark w-5">#{i + 1}</span>
                        {t.item.thumb
                          ? <Image src={t.item.thumb} alt={t.item.name} width={28} height={28} className="rounded-full" unoptimized />
                          : <div className="w-7 h-7 rounded-full bg-accent-navy flex items-center justify-center text-accent-gold text-xs font-bold">{t.item.symbol.slice(0, 2).toUpperCase()}</div>
                        }
                      </div>
                      <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-gold transition-colors truncate">{t.item.name}</p>
                      <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{t.item.symbol.toUpperCase()}</p>
                      {t.item.data?.price && (
                        <p className="text-xs font-mono text-text-primary-light dark:text-text-primary-dark mt-1.5">{t.item.data.price}</p>
                      )}
                      {t.item.data?.price_change_percentage_24h?.usd != null && (
                        <div className="mt-1"><Change value={t.item.data.price_change_percentage_24h.usd} /></div>
                      )}
                    </Link>
                  </motion.div>
                ))
            }
          </div>
        </section>

        {/* Gainers & Losers */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-success" />
              <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                Top Gainers (24h)
              </h2>
            </div>
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
              {loading
                ? Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border-light dark:border-border-dark">
                      <div className="flex items-center gap-3"><Skeleton w={32} h={8} /><Skeleton w={100} /></div>
                      <Skeleton w={80} />
                    </div>
                  ))
                : gainers.map((coin, i) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/coin/${coin.id}`}
                        className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border-light dark:border-border-dark hover:bg-success/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark w-5">{i + 1}</span>
                          {coin.image
                            ? <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" unoptimized />
                            : <div className="w-7 h-7 rounded-full bg-accent-navy flex items-center justify-center text-accent-gold text-xs font-bold">{coin.symbol.slice(0, 2).toUpperCase()}</div>
                          }
                          <div>
                            <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-success transition-colors">{coin.name}</p>
                            <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{coin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-text-primary-light dark:text-text-primary-dark">{formatPrice(coin.current_price, symbol, isJPY)}</p>
                          <Change value={coin.price_change_percentage_24h} />
                        </div>
                      </Link>
                    </motion.div>
                  ))
              }
            </div>
          </section>

          {/* Top Losers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-danger" />
              <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
                Top Losers (24h)
              </h2>
            </div>
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
              {loading
                ? Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border-light dark:border-border-dark">
                      <div className="flex items-center gap-3"><Skeleton w={32} h={8} /><Skeleton w={100} /></div>
                      <Skeleton w={80} />
                    </div>
                  ))
                : losers.map((coin, i) => (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/coin/${coin.id}`}
                        className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-border-light dark:border-border-dark hover:bg-danger/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark w-5">{i + 1}</span>
                          {coin.image
                            ? <Image src={coin.image} alt={coin.name} width={28} height={28} className="rounded-full" unoptimized />
                            : <div className="w-7 h-7 rounded-full bg-accent-navy flex items-center justify-center text-accent-gold text-xs font-bold">{coin.symbol.slice(0, 2).toUpperCase()}</div>
                          }
                          <div>
                            <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-danger transition-colors">{coin.name}</p>
                            <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{coin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-text-primary-light dark:text-text-primary-dark">{formatPrice(coin.current_price, symbol, isJPY)}</p>
                          <Change value={coin.price_change_percentage_24h} />
                        </div>
                      </Link>
                    </motion.div>
                  ))
              }
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-accent-gold/20 bg-accent-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BarChart2 className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">Want to see all 100 cryptocurrencies?</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Browse the full market with search, filters, and sorting.</p>
            </div>
          </div>
          <Link
            href="/coins"
            className="flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-bold bg-accent-gold text-bg-dark hover:bg-accent-gold/90 transition-colors shadow-sm shadow-accent-gold/20"
          >
            View All Markets
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
