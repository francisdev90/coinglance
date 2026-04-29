"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { subscribeToLiveTickers, type BinanceMiniTicker } from "@/lib/api/binance";
import { useCurrency } from "@/contexts/CurrencyContext";

interface TickerItem {
  symbol: string;
  price: number;    // stored in USD
  change24h: number;
  flash?: "up" | "down";
}

const FALLBACK: TickerItem[] = [
  { symbol: "BTC",  price: 87000,  change24h: 1.2 },
  { symbol: "ETH",  price: 3500,   change24h: -0.8 },
  { symbol: "SOL",  price: 210,    change24h: 3.1 },
  { symbol: "BNB",  price: 690,    change24h: 0.9 },
  { symbol: "XRP",  price: 2.45,   change24h: -1.5 },
  { symbol: "ADA",  price: 1.05,   change24h: 1.8 },
  { symbol: "DOGE", price: 0.38,   change24h: 4.2 },
  { symbol: "AVAX", price: 42,     change24h: -0.5 },
  { symbol: "DOT",  price: 9.8,    change24h: 2.1 },
  { symbol: "LINK", price: 18,     change24h: 1.6 },
];

function formatTickerPrice(price: number, symbol: string, noDecimals: boolean): string {
  if (noDecimals) return symbol + Math.round(price).toLocaleString("en-US");
  if (price >= 10000) return symbol + Math.round(price).toLocaleString("en-US");
  if (price >= 1)     return symbol + price.toFixed(2);
  if (price >= 0.001) return symbol + price.toFixed(4);
  return symbol + price.toFixed(8);
}

function TickerCoin({ symbol: coinSymbol, price: usdPrice, change24h, flash, currencySymbol, convert, noDecimals }: TickerItem & {
  currencySymbol: string;
  convert: (v: number) => number;
  noDecimals: boolean;
}) {
  const isPositive = change24h >= 0;
  const displayPrice = convert(usdPrice);
  return (
    <div className="flex items-center gap-2.5 px-5 flex-shrink-0">
      <span className="text-xs font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark uppercase">
        {coinSymbol}
      </span>
      <span
        className={`font-mono text-sm font-semibold transition-colors duration-500 ${
          flash === "up"   ? "text-success" :
          flash === "down" ? "text-danger"  :
          "text-text-primary-light dark:text-text-primary-dark"
        }`}
      >
        {formatTickerPrice(displayPrice, currencySymbol, noDecimals)}
      </span>
      <span className={`flex items-center gap-0.5 font-mono text-xs font-bold ${isPositive ? "text-success" : "text-danger"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? "+" : ""}{change24h.toFixed(2)}%
      </span>
      <span className="w-px h-3 bg-border-light dark:bg-border-dark flex-shrink-0" />
    </div>
  );
}

export default function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK);
  const { symbol: currencySymbol, convert, noDecimals } = useCurrency();
  const prevPrices = useRef<Record<string, number>>({});
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const unsubscribe = subscribeToLiveTickers((tickerMap) => {
      setItems((prev) => {
        const next = prev.map((item) => {
          const binanceKey = item.symbol + "USDT";
          const t: BinanceMiniTicker | undefined = tickerMap.get(binanceKey);
          if (!t) return { ...item, flash: undefined };

          const price   = parseFloat(t.c);
          const open24h = parseFloat(t.o);
          const change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : item.change24h;
          const prevPrice = prevPrices.current[binanceKey];
          const flash: "up" | "down" | undefined =
            prevPrice !== undefined
              ? price > prevPrice ? "up" : price < prevPrice ? "down" : undefined
              : undefined;

          prevPrices.current[binanceKey] = price;

          if (flash) {
            if (flashTimers.current[binanceKey]) clearTimeout(flashTimers.current[binanceKey]);
            flashTimers.current[binanceKey] = setTimeout(() => {
              setItems((cur) =>
                cur.map((c) => c.symbol === item.symbol ? { ...c, flash: undefined } : c)
              );
            }, 600);
          }

          return { symbol: item.symbol, price, change24h, flash };
        });
        return next;
      });
    });

    const timers = flashTimers.current;
    return () => {
      unsubscribe();
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrapper overflow-hidden border-b border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark py-2">
      <div className="animate-ticker flex w-max">
        {doubled.map((coin, i) => (
          <TickerCoin
            key={`${coin.symbol}-${i}`}
            {...coin}
            currencySymbol={currencySymbol}
            convert={convert}
            noDecimals={noDecimals}
          />
        ))}
      </div>
    </div>
  );
}
