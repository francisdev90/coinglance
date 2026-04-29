"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice, formatLargeNumber, formatSupply } from "@/lib/format";

interface Props {
  usdPrice: number;
  ch1h: number;
  ch24h: number;
  ch7d: number;
  usdMcap: number;
  usdVolume: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number;
  athDate: string;
  rank: number | null;
  coinSymbol: string;
}

export function CoinPriceHeader({ usdPrice, ch1h, ch24h, ch7d }: Pick<Props, "usdPrice" | "ch1h" | "ch24h" | "ch7d">) {
  const { convert, symbol, isJPY } = useCurrency();
  const price = convert(usdPrice);
  const isUp24h = ch24h >= 0;

  return (
    <div className="p-6 rounded-2xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div>
          <p className="text-4xl sm:text-5xl font-bold font-mono text-text-primary-light dark:text-text-primary-dark tracking-tight">
            {formatPrice(price, symbol, isJPY)}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn("flex items-center gap-1 font-mono font-bold text-base", isUp24h ? "text-success" : "text-danger")}>
              {isUp24h ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isUp24h ? "+" : ""}{ch24h.toFixed(2)}% (24h)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "1h",  val: ch1h  },
            { label: "24h", val: ch24h },
            { label: "7d",  val: ch7d  },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1">{label}</p>
              <p className={cn("font-mono text-sm font-bold", val >= 0 ? "text-success" : "text-danger")}>
                {val >= 0 ? "+" : ""}{val.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
      <p className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mb-1.5">{label}</p>
      <p className="font-mono text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{value}</p>
    </div>
  );
}

export function CoinKeyStats({
  usdMcap, usdVolume, circulatingSupply, totalSupply, maxSupply,
  ath, athDate, rank, coinSymbol,
}: Omit<Props, "usdPrice" | "ch1h" | "ch24h" | "ch7d">) {
  const { convert, symbol, isJPY } = useCurrency();

  return (
    <div>
      <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider mb-4">Key Statistics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Market Cap"      value={formatLargeNumber(convert(usdMcap), symbol)} />
        <StatCard label="24h Volume"      value={formatLargeNumber(convert(usdVolume), symbol)} />
        <StatCard label="Circ. Supply"    value={circulatingSupply ? formatSupply(circulatingSupply, coinSymbol) : "—"} />
        <StatCard label="Total Supply"    value={totalSupply ? formatSupply(totalSupply, coinSymbol) : "∞"} />
        <StatCard label="Max Supply"      value={maxSupply ? formatSupply(maxSupply, coinSymbol) : "∞"} />
        <StatCard label="All-Time High"   value={ath ? formatPrice(convert(ath), symbol, isJPY) : "—"} />
        <StatCard label="ATH Date"        value={athDate} />
        <StatCard label="Market Cap Rank" value={rank ? `#${rank}` : "—"} />
      </div>
    </div>
  );
}
