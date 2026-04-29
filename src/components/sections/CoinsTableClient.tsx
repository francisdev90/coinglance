"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { type CoinMarket } from "@/lib/api/coingecko";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice, formatLargeNumber, formatSupply, getBadgeColor } from "@/lib/format";

type SortKey = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "price_change_percentage_7d_in_currency" | "total_volume" | "market_cap";
type FilterTab = "all" | "top10" | "top50" | "gainers" | "losers" | "trending";

const PER_PAGE = 25;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "market_cap_rank",                        label: "Market Cap" },
  { key: "current_price",                          label: "Price" },
  { key: "price_change_percentage_24h",            label: "24h Change" },
  { key: "price_change_percentage_7d_in_currency", label: "7d Change" },
  { key: "total_volume",                           label: "Volume" },
];

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "top10",    label: "Top 10" },
  { id: "top50",    label: "Top 50" },
  { id: "gainers",  label: "Gainers" },
  { id: "losers",   label: "Losers" },
  { id: "trending", label: "Trending" },
];

function Sparkline({ prices, isPositive }: { prices: number[]; isPositive: boolean }) {
  const step = Math.max(1, Math.floor(prices.length / 7));
  const pts = Array.from({ length: 7 }, (_, i) => ({ v: prices[i * step] ?? prices[prices.length - 1] ?? 0 }));
  return (
    <LineChart width={72} height={30} data={pts}>
      <Line type="monotone" dataKey="v" stroke={isPositive ? "#10B981" : "#DC2626"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  );
}

function Change({ value }: { value: number | null }) {
  const v = value ?? 0;
  const pos = v >= 0;
  return (
    <span className={cn("flex items-center gap-0.5 font-mono text-xs font-bold", pos ? "text-success" : "text-danger")}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pos ? "+" : ""}{v.toFixed(2)}%
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border-light dark:border-border-dark">
      {[40, 180, 90, 60, 60, 60, 100, 100, 72].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

interface Props {
  initialCoins: CoinMarket[];
}

export default function CoinsTableClient({ initialCoins }: Props) {
  const { cgId, symbol, isJPY } = useCurrency();
  const [coins, setCoins] = useState<CoinMarket[]>(initialCoins);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap_rank");
  const [sortDesc, setSortDesc] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  // Track which currency we last fetched so we know when to refetch
  const lastFetched = useRef("usd");

  const loadCoins = useCallback(async (currency: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/coins?currency=${currency}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid response from /api/coins");
      setCoins(data);
      lastFetched.current = currency;
    } catch (err) {
      console.error("[CoinsTableClient]", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip fetch on mount when we already have SSR USD data
    if (cgId === "usd" && lastFetched.current === "usd" && initialCoins.length > 0) return;
    loadCoins(cgId);
  }, [cgId, loadCoins, initialCoins.length]);

  const filtered = useMemo(() => {
    let list = [...coins];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    const ch7  = (c: CoinMarket) => c.price_change_percentage_7d_in_currency ?? 0;
    const ch24 = (c: CoinMarket) => c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0;

    if      (filter === "top10")    list = list.filter((c) => (c.market_cap_rank ?? 999) <= 10);
    else if (filter === "top50")    list = list.filter((c) => (c.market_cap_rank ?? 999) <= 50);
    else if (filter === "gainers")  list = list.filter((c) => ch24(c) >= 2);
    else if (filter === "losers")   list = list.filter((c) => ch24(c) < 0);
    else if (filter === "trending") list = list.filter((c) => (c.market_cap_rank ?? 999) <= 20 && Math.abs(ch24(c)) >= 3);

    list.sort((a, b) => {
      let aV = 0, bV = 0;
      if (sortKey === "market_cap_rank") {
        aV = a.market_cap_rank ?? 9999;
        bV = b.market_cap_rank ?? 9999;
        return sortDesc ? aV - bV : bV - aV;
      }
      if (sortKey === "price_change_percentage_24h") { aV = ch24(a); bV = ch24(b); }
      else if (sortKey === "price_change_percentage_7d_in_currency") { aV = ch7(a); bV = ch7(b); }
      else { aV = (a as unknown as Record<string, number>)[sortKey] ?? 0; bV = (b as unknown as Record<string, number>)[sortKey] ?? 0; }
      return sortDesc ? bV - aV : aV - bV;
    });

    return list;
  }, [coins, query, filter, sortKey, sortDesc]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageCoins = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(key !== "market_cap_rank"); }
    setPage(1);
    setSortOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          All Cryptocurrencies
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2">
          <span>{loading ? "Loading 100 coins…" : `${coins.length} assets`}</span>
          {!loading && !error && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live from CoinGecko
              </span>
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-danger/30 bg-danger/5 text-sm text-danger">
          Unable to load market data — CoinGecko may be rate-limiting us. Try refreshing in a moment.
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="text"
            placeholder="Search coins..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-sm text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark outline-none focus:border-accent-gold/60 transition-colors"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
          >
            Sort: {SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", sortOpen && "rotate-180")} />
          </button>
          {sortOpen && (
            <>
              <button className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} aria-hidden />
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark shadow-xl z-40 py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSort(opt.key)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      sortKey === opt.key
                        ? "text-accent-gold bg-accent-gold/5"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-bg-card-light dark:bg-bg-card-dark border border-border-light dark:border-border-dark w-fit mb-5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setFilter(tab.id); setPage(1); }}
            className={cn(
              "px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200",
              filter === tab.id
                ? "bg-accent-gold text-bg-dark shadow-sm"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                {[
                  { label: "#",            cls: "w-12 text-left" },
                  { label: "Coin",         cls: "text-left min-w-[160px]" },
                  { label: "Price",        cls: "text-right" },
                  { label: "1h %",         cls: "text-right hidden sm:table-cell" },
                  { label: "24h %",        cls: "text-right" },
                  { label: "7d %",         cls: "text-right hidden md:table-cell" },
                  { label: "Market Cap",   cls: "text-right hidden lg:table-cell" },
                  { label: "Volume (24h)", cls: "text-right hidden lg:table-cell" },
                  { label: "Supply",       cls: "text-right hidden xl:table-cell" },
                  { label: "7d Chart",     cls: "text-center hidden md:table-cell" },
                  { label: "Action",       cls: "text-right" },
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
                : pageCoins.map((coin) => {
                    const ch1  = coin.price_change_percentage_1h_in_currency ?? 0;
                    const ch24 = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
                    const ch7  = coin.price_change_percentage_7d_in_currency ?? 0;
                    const sparkPrices = coin.sparkline_in_7d?.price ?? [];

                    return (
                      <tr key={coin.id} className="group hover:bg-accent-gold/[0.025] dark:hover:bg-accent-gold/[0.04] transition-colors duration-150 cursor-pointer">
                        <td className="px-4 py-3.5 text-sm font-mono text-text-secondary-light dark:text-text-secondary-dark">
                          {coin.market_cap_rank ?? "—"}
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
                          {formatPrice(coin.current_price, symbol, isJPY)}
                        </td>
                        <td className="px-4 py-3.5 text-right hidden sm:table-cell"><Change value={ch1} /></td>
                        <td className="px-4 py-3.5 text-right"><Change value={ch24} /></td>
                        <td className="px-4 py-3.5 text-right hidden md:table-cell"><Change value={ch7} /></td>
                        <td className="px-4 py-3.5 text-right font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark hidden lg:table-cell">
                          {formatLargeNumber(coin.market_cap, symbol)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark hidden lg:table-cell">
                          {formatLargeNumber(coin.total_volume, symbol)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark hidden xl:table-cell">
                          {coin.circulating_supply ? formatSupply(coin.circulating_supply, coin.symbol.toUpperCase()) : "—"}
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="flex justify-center">
                            {sparkPrices.length > 0
                              ? <Sparkline prices={sparkPrices} isPositive={ch7 >= 0} />
                              : <div className="w-[72px] h-[30px]" />
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/coin/${coin.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-bg-dark transition-all duration-200"
                          >
                            Trade <ArrowRight className="w-3 h-3" />
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-md text-sm font-semibold border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-9 h-9 rounded-md text-sm font-bold transition-all",
                    page === p
                      ? "bg-accent-gold text-bg-dark"
                      : "border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-md text-sm font-semibold border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
