"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGlobalMarketData, type GlobalData } from "@/lib/api/coingecko";
import { getFearGreedIndex, type FearGreedData } from "@/lib/api/fearGreed";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatLargeNumber } from "@/lib/format";
import { useUpdateTimer } from "@/hooks/useUpdateTimer";

interface Props {
  initialGlobal?: GlobalData | null;
  initialFearGreed?: FearGreedData | null;
}

function classifyFearGreed(value: number): string {
  if (value >= 80) return "Extreme Greed";
  if (value >= 60) return "Greed";
  if (value >= 45) return "Neutral";
  if (value >= 25) return "Fear";
  return "Extreme Fear";
}

function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
      <div className="h-3 w-24 rounded bg-black/[0.07] dark:bg-white/[0.07] animate-pulse mb-4" />
      <div className="h-8 w-32 rounded bg-black/[0.07] dark:bg-white/[0.07] animate-pulse mb-2" />
      <div className="h-3 w-16 rounded bg-black/[0.07] dark:bg-white/[0.07] animate-pulse" />
    </div>
  );
}

export default function MarketStats({ initialGlobal, initialFearGreed }: Props) {
  const { symbol, convert, cgId } = useCurrency();
  const [global, setGlobal] = useState<GlobalData | null>(initialGlobal ?? null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(initialFearGreed ?? null);
  const [loading, setLoading] = useState(!initialGlobal);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(initialGlobal ? new Date() : null);
  const updatedAgo = useUpdateTimer(lastUpdated);

  useEffect(() => {
    if (initialGlobal && initialFearGreed) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const [g, fg] = await Promise.all([
          getGlobalMarketData(60),
          getFearGreedIndex(),
        ]);
        setGlobal(g);
        setFearGreed(fg);
        setLastUpdated(new Date());
      } catch {
        // keep whatever we have
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [g, fg] = await Promise.all([
          getGlobalMarketData(60),
          getFearGreedIndex(),
        ]);
        setGlobal(g);
        setFearGreed(fg);
        setLastUpdated(new Date());
      } catch {
        // keep existing data
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-6 bg-bg-light dark:bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  const gData = global?.data;

  // Use currency-specific values from global data when available, else convert from USD
  const usdMarketCap = gData?.total_market_cap?.usd ?? 0;
  const usdVolume    = gData?.total_volume?.usd ?? 0;
  const marketCap    = gData?.total_market_cap?.[cgId] ?? convert(usdMarketCap);
  const volume       = gData?.total_volume?.[cgId]    ?? convert(usdVolume);

  const btcDom    = gData?.market_cap_percentage?.btc ?? 0;
  const capChange = gData?.market_cap_change_percentage_24h_usd ?? 0;
  const fgValue   = fearGreed ? parseInt(fearGreed.value) : null;

  const stats = [
    {
      id: "market-cap",
      label: "Total Market Cap",
      value: gData ? formatLargeNumber(marketCap, symbol) : `${symbol}—`,
      change: gData ? `${capChange >= 0 ? "+" : ""}${capChange.toFixed(1)}%` : "—",
      isPositive: capChange >= 0,
      isHighlight: false,
    },
    {
      id: "volume",
      label: "24h Volume",
      value: gData ? formatLargeNumber(volume, symbol) : `${symbol}—`,
      change: "",
      isPositive: true,
      isHighlight: false,
    },
    {
      id: "btc-dom",
      label: "BTC Dominance",
      value: gData ? btcDom.toFixed(1) + "%" : "—",
      change: "",
      isPositive: true,
      isHighlight: false,
    },
    {
      id: "fear-greed",
      label: "Fear & Greed",
      value: fgValue !== null ? String(fgValue) : "—",
      subValue: fearGreed ? (fearGreed.value_classification ?? classifyFearGreed(fgValue!)) : "—",
      change: "",
      isPositive: fgValue !== null && fgValue >= 50,
      isHighlight: true,
    },
  ];

  return (
    <section className="py-6 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {updatedAgo && (
          <div className="flex items-center justify-end gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Updated {updatedAgo}
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
              className={cn(
                "group relative p-5 rounded-xl border cursor-default",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                stat.isHighlight
                  ? "border-accent-gold/40 bg-bg-card-light dark:bg-bg-card-dark hover:shadow-accent-gold/10 hover:border-accent-gold/70"
                  : "border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:shadow-black/8 dark:hover:shadow-black/40"
              )}
            >
              {stat.isHighlight && (
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-accent-gold" />
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
                  {stat.label}
                </span>
                {stat.isHighlight && <Gauge className="w-4 h-4 text-accent-gold" />}
              </div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className={cn(
                    "text-2xl sm:text-3xl font-bold font-mono tracking-tight leading-none",
                    stat.isHighlight
                      ? "text-accent-gold"
                      : "text-text-primary-light dark:text-text-primary-dark"
                  )}>
                    {stat.value}
                  </p>
                  {"subValue" in stat && stat.subValue && (
                    <p className="text-xs font-semibold text-accent-gold/80 mt-1 tracking-wide">
                      {stat.subValue}
                    </p>
                  )}
                </div>
                {stat.change && (
                  <span className={cn(
                    "flex items-center gap-0.5 font-mono text-xs font-bold flex-shrink-0",
                    stat.isPositive ? "text-success" : "text-danger"
                  )}>
                    {stat.isPositive
                      ? <TrendingUp className="w-3.5 h-3.5" />
                      : <TrendingDown className="w-3.5 h-3.5" />}
                    {stat.change}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
