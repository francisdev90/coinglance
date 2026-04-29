"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeftRight, ChevronDown, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTopCoins, type CoinMarket } from "@/lib/api/coingecko";
import { useCurrency, CURRENCY_META, type CurrencyCode } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/format";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

const CURRENCIES = Object.entries(CURRENCY_META) as [CurrencyCode, { label: string; symbol: string; cgId: string }][];

type AssetType = "crypto" | "fiat";

interface Asset {
  type: AssetType;
  coinId?: string;
  currency?: CurrencyCode;
  name: string;
  symbol: string;
  image?: string;
  priceUsd: number;
}

function CoinSearch({
  coins,
  query,
  onSelect,
  onClose,
}: {
  coins: CoinMarket[];
  query: string;
  onSelect: (c: CoinMarket) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState(query);
  const filtered = coins.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.symbol.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark shadow-2xl shadow-black/20 z-50 overflow-hidden"
    >
      <div className="p-2 border-b border-border-light dark:border-border-dark">
        <input
          autoFocus
          type="text"
          placeholder="Search coin..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-transparent text-text-primary-light dark:text-text-primary-dark outline-none placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
        />
      </div>
      <div className="max-h-56 overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => { onSelect(c); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
          >
            {c.image && <Image src={c.image} alt={c.name} width={24} height={24} className="rounded-full flex-shrink-0" unoptimized />}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">{c.name}</p>
              <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{c.symbol.toUpperCase()}</p>
            </div>
            <span className="ml-auto text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0">
              ${c.current_price.toLocaleString("en-US", { maximumFractionDigits: 6 })}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function ConverterPage() {
  const { rates, symbol, isJPY } = useCurrency();
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromAsset, setFromAsset] = useState<Asset | null>(null);
  const [toAsset, setToAsset] = useState<Asset | null>(null);
  const [fromAmount, setFromAmount] = useState("1");
  const [showFromSearch, setShowFromSearch] = useState(false);
  const [showToSearch, setShowToSearch] = useState(false);

  useEffect(() => {
    getTopCoins(100, "usd", 60).then((data) => {
      setCoins(data);
      const btc = data.find((c) => c.id === "bitcoin");
      const usdt = data.find((c) => c.id === "tether");
      if (btc) setFromAsset({ type: "crypto", coinId: btc.id, name: btc.name, symbol: btc.symbol.toUpperCase(), image: btc.image, priceUsd: btc.current_price });
      if (usdt) setToAsset({ type: "crypto", coinId: usdt.id, name: usdt.name, symbol: usdt.symbol.toUpperCase(), image: usdt.image, priceUsd: usdt.current_price });
    }).finally(() => setLoading(false));
  }, []);

  const selectCoin = useCallback((c: CoinMarket, side: "from" | "to") => {
    const asset: Asset = { type: "crypto", coinId: c.id, name: c.name, symbol: c.symbol.toUpperCase(), image: c.image, priceUsd: c.current_price };
    if (side === "from") setFromAsset(asset);
    else setToAsset(asset);
  }, []);

  const selectFiat = useCallback((code: CurrencyCode, side: "from" | "to") => {
    const meta = CURRENCY_META[code];
    const rateToUsd = 1 / rates[code];
    const asset: Asset = { type: "fiat", currency: code, name: meta.label, symbol: code, priceUsd: rateToUsd };
    if (side === "from") setFromAsset(asset);
    else setToAsset(asset);
  }, [rates]);

  const swap = () => {
    const tmp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tmp);
  };

  const fromVal = parseFloat(fromAmount) || 0;
  const fromUsd = fromVal * (fromAsset?.priceUsd ?? 1);
  const toAmount = toAsset ? fromUsd / toAsset.priceUsd : 0;

  const rate = fromAsset && toAsset
    ? fromAsset.priceUsd / toAsset.priceUsd
    : null;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <Calculator className="w-7 h-7 text-accent-gold" />
            Crypto Converter
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Convert between cryptocurrencies and fiat currencies in real time.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1].map((i) => <div key={i} className="h-24 rounded-xl animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />)}
          </div>
        ) : (
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-6 space-y-4">
            {/* FROM */}
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-text-secondary-light dark:text-text-secondary-dark mb-2 block">From</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <button
                    onClick={() => { setShowFromSearch(!showFromSearch); setShowToSearch(false); }}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-accent-gold/50 transition-colors text-left"
                  >
                    {fromAsset?.image && <Image src={fromAsset.image} alt={fromAsset.name} width={24} height={24} className="rounded-full flex-shrink-0" unoptimized />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{fromAsset?.symbol ?? "Select"}</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">{fromAsset?.name ?? "Choose asset"}</p>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark transition-transform flex-shrink-0", showFromSearch && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showFromSearch && (
                      <>
                        <button className="fixed inset-0 z-40" onClick={() => setShowFromSearch(false)} aria-hidden />
                        <div className="relative z-50">
                          <CoinSearch coins={coins} query="" onSelect={(c) => selectCoin(c, "from")} onClose={() => setShowFromSearch(false)} />
                          <div className="absolute top-full left-0 right-0 mt-0">
                            {/* Fiat options in search dropdown already above */}
                          </div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-36 px-3 py-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono font-bold text-text-primary-light dark:text-text-primary-dark outline-none focus:border-accent-gold/60 transition-colors text-right"
                  placeholder="0"
                  min={0}
                />
              </div>
              {/* Fiat quick-select */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {CURRENCIES.map(([code]) => (
                  <button
                    key={code}
                    onClick={() => selectFiat(code, "from")}
                    className={cn(
                      "px-2 py-0.5 text-xs font-mono font-bold rounded border transition-colors",
                      fromAsset?.currency === code
                        ? "bg-accent-gold text-bg-dark border-accent-gold"
                        : "border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold hover:border-accent-gold/40"
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={swap}
                className="p-2 rounded-full border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-accent-gold/50 hover:text-accent-gold text-text-secondary-light dark:text-text-secondary-dark transition-all duration-200"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* TO */}
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-text-secondary-light dark:text-text-secondary-dark mb-2 block">To</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <button
                    onClick={() => { setShowToSearch(!showToSearch); setShowFromSearch(false); }}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-accent-gold/50 transition-colors text-left"
                  >
                    {toAsset?.image && <Image src={toAsset.image} alt={toAsset.name} width={24} height={24} className="rounded-full flex-shrink-0" unoptimized />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{toAsset?.symbol ?? "Select"}</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">{toAsset?.name ?? "Choose asset"}</p>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark transition-transform flex-shrink-0", showToSearch && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showToSearch && (
                      <>
                        <button className="fixed inset-0 z-40" onClick={() => setShowToSearch(false)} aria-hidden />
                        <div className="relative z-50">
                          <CoinSearch coins={coins} query="" onSelect={(c) => selectCoin(c, "to")} onClose={() => setShowToSearch(false)} />
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <div className="w-36 px-3 py-3 rounded-lg border border-border-light dark:border-border-dark bg-black/[0.03] dark:bg-white/[0.03] text-right">
                  <p className="text-sm font-mono font-bold text-text-primary-light dark:text-text-primary-dark">
                    {toAmount === 0 ? "0" : toAmount >= 1 ? toAmount.toLocaleString("en-US", { maximumFractionDigits: 6 }) : toAmount.toFixed(8)}
                  </p>
                  <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{toAsset?.symbol}</p>
                </div>
              </div>
              {/* Fiat quick-select */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {CURRENCIES.map(([code]) => (
                  <button
                    key={code}
                    onClick={() => selectFiat(code, "to")}
                    className={cn(
                      "px-2 py-0.5 text-xs font-mono font-bold rounded border transition-colors",
                      toAsset?.currency === code
                        ? "bg-accent-gold text-bg-dark border-accent-gold"
                        : "border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold hover:border-accent-gold/40"
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {fromAsset && toAsset && fromVal > 0 && (
              <motion.div
                key={`${fromAsset.coinId ?? fromAsset.currency}-${toAsset.coinId ?? toAsset.currency}-${fromAmount}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 p-4 rounded-xl bg-accent-gold/5 border border-accent-gold/20"
              >
                <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="font-mono font-bold text-text-primary-light dark:text-text-primary-dark">{fromVal.toLocaleString()} {fromAsset.symbol}</span>
                  {" = "}
                  <span className="font-mono font-bold text-accent-gold text-base">
                    {toAmount >= 1
                      ? toAmount.toLocaleString("en-US", { maximumFractionDigits: 6 })
                      : toAmount.toFixed(8)}{" "}
                    {toAsset.symbol}
                  </span>
                </p>
                {rate != null && (
                  <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1.5">
                    1 {fromAsset.symbol} = {rate >= 1 ? rate.toLocaleString("en-US", { maximumFractionDigits: 6 }) : rate.toFixed(8)} {toAsset.symbol}
                  </p>
                )}
                <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  ≈ {formatPrice(fromUsd, symbol, isJPY)} at market rate
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Popular conversions */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-4">Popular Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              ["Bitcoin", "BTC", "bitcoin"],
              ["Ethereum", "ETH", "ethereum"],
              ["USDT", "USDT", "tether"],
              ["BNB", "BNB", "binancecoin"],
              ["Solana", "SOL", "solana"],
              ["XRP", "XRP", "ripple"],
            ].map(([name, sym, id]) => {
              const coin = coins.find((c) => c.id === id);
              if (!coin) return null;
              return (
                <button
                  key={id}
                  onClick={() => {
                    const asset: Asset = { type: "crypto", coinId: coin.id, name: coin.name, symbol: coin.symbol.toUpperCase(), image: coin.image, priceUsd: coin.current_price };
                    setFromAsset(asset);
                    const usd: Asset = { type: "fiat", currency: "USD", name: "US Dollar", symbol: "USD", priceUsd: 1 };
                    setToAsset(usd);
                    setFromAmount("1");
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:border-accent-gold/30 transition-colors text-left"
                >
                  {coin.image && <Image src={coin.image} alt={name} width={20} height={20} className="rounded-full" unoptimized />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">{sym} to USD</p>
                    <p className="text-[10px] font-mono text-text-secondary-light dark:text-text-secondary-dark truncate">{formatPrice(coin.current_price, "$")}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
