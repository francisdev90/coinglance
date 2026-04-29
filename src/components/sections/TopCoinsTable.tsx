"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { getTopCoins, type CoinMarket } from "@/lib/api/coingecko";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice, formatLargeNumber, getBadgeColor } from "@/lib/format";
import { useUpdateTimer } from "@/hooks/useUpdateTimer";

type FilterType = "all" | "gainers" | "losers" | "trending";

const filters: { id: FilterType; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "gainers",  label: "Gainers" },
  { id: "losers",   label: "Losers" },
  { id: "trending", label: "Trending" },
];

interface Props {
  initialCoins?: CoinMarket[] | null;
}

function ChangeCell({ value }: { value: number | null }) {
  const v = value ?? 0;
  const isPositive = v >= 0;
  return (
    <div className={cn("inline-flex items-center gap-0.5 font-mono text-xs font-bold", isPositive ? "text-success" : "text-danger")}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{v.toFixed(2)}%
    </div>
  );
}

function Sparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  const step = Math.floor(prices.length / 7);
  const pts = Array.from({ length: 7 }, (_, i) => ({ v: prices[i * step] ?? prices[prices.length - 1] ?? 0 }));
  return (
    <LineChart width={80} height={36} data={pts}>
      <Line type="monotone" dataKey="v" stroke={positive ? "#10B981" : "#DC2626"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border-light dark:border-border-dark">
      {[40, 160, 80, 60, 60, 100, 80].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={`h-4 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function TopCoinsTable({ initialCoins }: Props) {
  const { cgId, symbol, convert, isJPY } = useCurrency();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [coins, setCoins] = useState<CoinMarket[]>(initialCoins ?? []);
  const [loading, setLoading] = useState(!initialCoins?.length);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(initialCoins?.length ? new Date() : null);
  const [flashMap, setFlashMap] = useState<Record<string, "up" | "down">>({});
  const prevPrices = useRef<Record<string, number>>({});
  const updatedAgo = useUpdateTimer(lastUpdated);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const data = await getTopCoins(10, cgId);
        if (!active) return;

        // Detect price changes for flash
        const flashes: Record<string, "up" | "down"> = {};
        for (const coin of data) {
          const prev = prevPrices.current[coin.id];
          if (prev !== undefined) {
            if (coin.current_price > prev) flashes[coin.id] = "up";
            else if (coin.current_price < prev) flashes[coin.id] = "down";
          }
          prevPrices.current[coin.id] = coin.current_price;
        }

        setCoins(data);
        setLastUpdated(new Date());
        if (Object.keys(flashes).length > 0) {
          setFlashMap(flashes);
          setTimeout(() => setFlashMap({}), 600);
        }
      } catch {
        // keep existing data
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => { active = false; clearInterval(interval); };
  }, [cgId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = coins.filter((c) => {
    const ch = c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0;
    if (activeFilter === "gainers") return ch >= 1;
    if (activeFilter === "losers")  return ch < 0;
    if (activeFilter === "trending") return (c.market_cap_rank ?? 99) <= 5;
    return true;
  });

  return (
    <section className="py-16 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Top 10 Cryptocurrencies
              </h2>
              <div className="flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </div>
              {updatedAgo && (
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark hidden sm:inline">
                  · Updated {updatedAgo}
                </span>
              )}
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-light dark:border-border-dark">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200",
                    activeFilter === f.id
                      ? "bg-accent-gold text-bg-dark shadow-sm"
                      : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark">
                    {[
                      { label: "#",          cls: "w-12 text-left" },
                      { label: "Coin",       cls: "text-left" },
                      { label: "Price",      cls: "text-right" },
                      { label: "24h",        cls: "text-right" },
                      { label: "7d",         cls: "text-right hidden lg:table-cell" },
                      { label: "Market Cap", cls: "text-right hidden lg:table-cell" },
                      { label: "7d Chart",   cls: "text-center hidden md:table-cell" },
                      { label: "Action",     cls: "text-right" },
                    ].map((col) => (
                      <th key={col.label} className={cn("px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark", col.cls)}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {loading
                    ? Array.from({ length: 10 }, (_, i) => <SkeletonRow key={i} />)
                    : filtered.map((coin) => {
                        const ch24 = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
                        const ch7  = coin.price_change_percentage_7d_in_currency ?? 0;
                        const price = cgId === "usd" ? coin.current_price : convert(coin.current_price);
                        const mcap  = cgId === "usd" ? coin.market_cap     : convert(coin.market_cap);
                        const sparkPrices = coin.sparkline_in_7d?.price ?? [];
                        const flash = flashMap[coin.id];

                        return (
                          <tr
                            key={coin.id}
                            className={cn(
                              "group hover:bg-accent-gold/[0.025] dark:hover:bg-accent-gold/[0.04] transition-colors duration-150 cursor-pointer",
                              flash === "up"   && "price-flash-up",
                              flash === "down" && "price-flash-down"
                            )}
                          >
                            <td className="px-4 py-3.5 text-sm font-mono text-text-secondary-light dark:text-text-secondary-dark">
                              {coin.market_cap_rank}
                            </td>
                            <td className="px-4 py-3.5">
                              <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
                                {coin.image
                                  ? <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full flex-shrink-0" unoptimized />
                                  : <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", getBadgeColor(coin.market_cap_rank ?? 99))}>{coin.symbol.slice(0, 2).toUpperCase()}</div>
                                }
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-accent-gold transition-colors">{coin.name}</p>
                                  <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{coin.symbol.toUpperCase()}</p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                              {formatPrice(price, symbol, isJPY)}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <ChangeCell value={ch24} />
                            </td>
                            <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                              <ChangeCell value={ch7} />
                            </td>
                            <td className="px-4 py-3.5 text-right font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark hidden lg:table-cell">
                              {formatLargeNumber(mcap, symbol)}
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <div className="flex justify-center">
                                {sparkPrices.length > 0
                                  ? <Sparkline prices={sparkPrices} positive={ch7 >= 0} />
                                  : <div className="w-20 h-9" />
                                }
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Link
                                href={`/coin/${coin.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-bg-dark transition-all duration-200"
                              >
                                Buy <ArrowRight className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/coins"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors duration-200"
            >
              View all 100+ coins <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
