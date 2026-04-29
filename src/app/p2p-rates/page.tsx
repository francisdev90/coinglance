"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Info, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTopCoins, type CoinMarket } from "@/lib/api/coingecko";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/format";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";
import { useUpdateTimer } from "@/hooks/useUpdateTimer";

const COINS_TO_SHOW = ["bitcoin", "ethereum", "tether", "binancecoin", "solana", "ripple", "usd-coin", "matic-network"];

interface P2PPlatform {
  name: string;
  slug: string;
  spread: number;
  buyPremium: number;
  sellDiscount: number;
  paymentMethods: string[];
  minAmountNGN: string;
  url: string;
  color: string;
  note: string;
}

const PLATFORMS: P2PPlatform[] = [
  {
    name: "Binance P2P",
    slug: "binance",
    spread: 1.5,
    buyPremium: 1.5,
    sellDiscount: 0.5,
    paymentMethods: ["Bank Transfer", "Opay", "Palmpay", "GTBank", "Zenith"],
    minAmountNGN: "₦5,000",
    url: "https://p2p.binance.com",
    color: "#F0B90B",
    note: "Largest P2P market, most merchants",
  },
  {
    name: "Bybit P2P",
    slug: "bybit",
    spread: 2.0,
    buyPremium: 2.0,
    sellDiscount: 0.8,
    paymentMethods: ["Bank Transfer", "Opay", "Palmpay", "MTN MoMo"],
    minAmountNGN: "₦3,000",
    url: "https://www.bybit.com/en/trade/spot/p2p",
    color: "#F7A600",
    note: "Growing P2P with competitive rates",
  },
  {
    name: "Noones",
    slug: "noones",
    spread: 3.5,
    buyPremium: 3.5,
    sellDiscount: 1.2,
    paymentMethods: ["Bank Transfer", "Opay", "Cash", "Gift Cards"],
    minAmountNGN: "₦1,500",
    url: "https://noones.com",
    color: "#7C3AED",
    note: "Global P2P, previously Paxful",
  },
  {
    name: "KuCoin P2P",
    slug: "kucoin",
    spread: 2.5,
    buyPremium: 2.5,
    sellDiscount: 1.0,
    paymentMethods: ["Bank Transfer", "Palmpay"],
    minAmountNGN: "₦5,000",
    url: "https://www.kucoin.com/otc",
    color: "#24AE8F",
    note: "OTC-style P2P with 750+ coins",
  },
  {
    name: "Remitano",
    slug: "remitano",
    spread: 4.0,
    buyPremium: 4.0,
    sellDiscount: 1.5,
    paymentMethods: ["Bank Transfer", "Quick Teller", "Cash"],
    minAmountNGN: "₦2,000",
    url: "https://remitano.com",
    color: "#E94E4E",
    note: "Nigeria-focused, escrow protected",
  },
];

function CoinRow({ coin, convert, currencySymbol, isJPY }: {
  coin: CoinMarket;
  convert: (v: number) => number;
  currencySymbol: string;
  isJPY: boolean;
}) {
  const displayPrice = convert(coin.current_price);
  const ch24 = coin.price_change_percentage_24h ?? 0;

  return (
    <Link
      href={`/coin/${coin.id}`}
      className="flex items-center justify-between px-4 py-3.5 border-b last:border-b-0 border-border-light dark:border-border-dark hover:bg-accent-gold/[0.025] transition-colors group"
    >
      <div className="flex items-center gap-3">
        {coin.image && (
          <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" unoptimized />
        )}
        <div>
          <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-gold transition-colors">{coin.name}</p>
          <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold font-mono text-text-primary-light dark:text-text-primary-dark">
          {formatPrice(displayPrice, currencySymbol, isJPY)}
        </p>
        <span className={cn("flex items-center justify-end gap-0.5 text-xs font-mono font-bold", ch24 >= 0 ? "text-success" : "text-danger")}>
          {ch24 >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {ch24 >= 0 ? "+" : ""}{ch24.toFixed(2)}%
        </span>
      </div>
    </Link>
  );
}

export default function P2PRatesPage() {
  const { rates, convert, symbol, isJPY } = useCurrency();
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState("100");
  const [selectedCoin, setSelectedCoin] = useState("tether");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const updatedAgo = useUpdateTimer(lastUpdated);

  const ngnRate = rates.NGN;

  useEffect(() => {
    async function load() {
      try {
        const data = await getTopCoins(100, "usd", 60);
        setCoins(data);
        setLastUpdated(new Date());
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  const displayCoins = coins.filter((c) => COINS_TO_SHOW.includes(c.id));
  const calcCoin = coins.find((c) => c.id === selectedCoin);
  const inputVal = parseFloat(inputAmount.replace(/,/g, "")) || 0;

  // inputVal is in selected currency; convert coin price to same currency, then divide
  const cryptoResult = calcCoin
    ? inputVal / convert(calcCoin.current_price)
    : 0;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            P2P Crypto Rates
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 flex-wrap">
            <span>Live crypto prices and P2P spread estimates · Prices in {symbol}</span>
            {updatedAgo && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Updated {updatedAgo}
                </span>
              </>
            )}
          </p>
        </div>

        {/* NGN Rate banner — always shown since P2P is NGN-focused */}
        <div className="mb-6 p-4 rounded-xl border border-accent-gold/20 bg-accent-gold/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">USD / NGN Rate</p>
            <p className="text-xl font-bold font-mono text-text-primary-light dark:text-text-primary-dark">
              1 USD ≈ <span className="text-accent-gold">₦{ngnRate.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Live rate from CoinGecko via USDT price</p>
          </div>
          <div className="flex items-start gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-xs">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>P2P rates include merchant spreads (1–4% above market). Actual rates vary by merchant, payment method, and timing.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coin prices */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                  Crypto Prices in {symbol}
                </h2>
                <span className="text-xs text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Live
                </span>
              </div>
              {loading
                ? Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3.5 border-b last:border-b-0 border-border-light dark:border-border-dark">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
                        <div className="space-y-1">
                          <div className="h-4 w-24 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
                          <div className="h-3 w-12 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
                        </div>
                      </div>
                      <div className="h-4 w-24 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
                    </div>
                  ))
                : displayCoins.map((c) => (
                    <CoinRow key={c.id} coin={c} convert={convert} currencySymbol={symbol} isJPY={isJPY} />
                  ))
              }
            </div>

            {/* Platform comparison — always in NGN since these are Africa-focused platforms */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-1">P2P Platform Comparison — USDT/NGN</h2>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-4">Spread estimates based on typical merchant premiums for Nigerian Naira</p>
              <div className="space-y-3">
                {PLATFORMS.map((p, i) => {
                  const usdtCoin = coins.find((c) => c.id === "tether");
                  const baseRate = (usdtCoin?.current_price ?? 1) * ngnRate;
                  const buyRate = baseRate * (1 + p.buyPremium / 100);
                  const sellRate = baseRate * (1 - p.sellDiscount / 100);

                  return (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: p.color }}
                          >
                            {p.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark">{p.name}</p>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{p.note}</p>
                          </div>
                        </div>
                        <Link
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-accent-gold hover:underline flex-shrink-0"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
                          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Buy Rate</p>
                          <p className="text-xs font-bold font-mono text-danger mt-0.5">
                            ≈ ₦{buyRate.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
                          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Sell Rate</p>
                          <p className="text-xs font-bold font-mono text-success mt-0.5">
                            ≈ ₦{sellRate.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
                          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Min Order</p>
                          <p className="text-xs font-bold font-mono text-text-primary-light dark:text-text-primary-dark mt-0.5">{p.minAmountNGN}</p>
                        </div>
                        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
                          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Spread</p>
                          <p className="text-xs font-bold font-mono text-warning mt-0.5">~{p.spread}%</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.paymentMethods.slice(0, 4).map((m) => (
                          <span key={m} className="text-[10px] px-2 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">
                            {m}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Calculator + tips */}
          <div className="space-y-4">
            {/* Currency Calculator */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-4">
                {symbol} Calculator
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Amount ({symbol})</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark">{symbol}</span>
                    <input
                      type="number"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono font-bold text-text-primary-light dark:text-text-primary-dark outline-none focus:border-accent-gold/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 block">Get Crypto</label>
                  <select
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm text-text-primary-light dark:text-text-primary-dark outline-none focus:border-accent-gold/60 transition-colors"
                  >
                    {displayCoins.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                {calcCoin && inputVal > 0 && (
                  <div className="p-3 rounded-lg bg-accent-gold/5 border border-accent-gold/20 text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">You get approximately</p>
                    <p className="text-lg font-bold font-mono text-accent-gold">
                      {cryptoResult < 1 ? cryptoResult.toFixed(8) : cryptoResult.toLocaleString("en-US", { maximumFractionDigits: 6 })} {calcCoin.symbol.toUpperCase()}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">at market rate (P2P may vary)</p>
                  </div>
                )}

                <Link
                  href="/converter"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-accent-gold/30 text-sm font-semibold text-accent-gold hover:bg-accent-gold/5 transition-colors"
                >
                  Advanced Converter <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* P2P Tips */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-4">P2P Trading Tips</h3>
              <ul className="space-y-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {[
                  "Always use the platform's escrow — never pay outside it",
                  "Check merchant completion rate (aim for 95%+)",
                  "For large amounts, split orders across multiple merchants",
                  "NGN P2P rates include merchant spreads of 1–4% above spot",
                  "Bank transfers are safest — avoid reversible payment methods",
                  "Never release crypto before confirming bank credit",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent-gold font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-lg border border-warning/20 bg-warning/5">
              <Info className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Rates are estimates based on spot prices + typical spreads. Actual P2P rates vary by merchant. Always verify on the platform before trading.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
