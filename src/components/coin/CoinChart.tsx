"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

type TimeRange = "1H" | "24H" | "7D" | "1M" | "3M" | "1Y" | "ALL";

const RANGES: TimeRange[] = ["1H", "24H", "7D", "1M", "3M", "1Y", "ALL"];

const RANGE_DAYS: Record<TimeRange, number | "max"> = {
  "1H":  1,
  "24H": 1,
  "7D":  7,
  "1M":  30,
  "3M":  90,
  "1Y":  365,
  "ALL": "max",
};

interface PricePoint { timestamp: number; price: number }

function formatChartDate(ts: number, range: TimeRange): string {
  const d = new Date(ts);
  if (range === "1H" || range === "24H")
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (range === "7D")
    return d.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" });
  if (range === "1M" || range === "3M")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtPrice(price: number, sym: string, isJPY: boolean): string {
  if (isJPY) return sym + Math.round(price).toLocaleString("en-US");
  if (price >= 10000) return sym + Math.round(price).toLocaleString("en-US");
  if (price >= 1)    return sym + price.toFixed(2);
  if (price >= 0.001) return sym + price.toFixed(4);
  return sym + price.toFixed(8);
}

interface TooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  range: TimeRange;
  sym: string;
  isJPY: boolean;
}
function ChartTooltip({ active, payload, range, sym, isJPY }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const { timestamp, price } = payload[0].payload;
  return (
    <div className="bg-bg-card-dark border border-border-dark rounded-lg px-3 py-2 shadow-xl shadow-black/40 pointer-events-none">
      <p className="font-mono font-bold text-accent-gold text-sm">{fmtPrice(price, sym, isJPY)}</p>
      <p className="text-xs text-text-secondary-dark mt-0.5">{formatChartDate(timestamp, range)}</p>
    </div>
  );
}

interface Props {
  coinId: string;
}

export default function CoinChart({ coinId }: Props) {
  const { cgId, symbol, isJPY } = useCurrency();
  const [range, setRange] = useState<TimeRange>("7D");
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadChart = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const days = RANGE_DAYS[range];
      const res = await fetch(
        `/api/chart/${encodeURIComponent(coinId)}?currency=${cgId}&days=${days}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const resp = await res.json() as { prices: [number, number][] };
      if (!Array.isArray(resp.prices)) throw new Error("Invalid chart data");
      let prices = resp.prices.map(([ts, p]) => ({ timestamp: ts, price: p }));

      // For 1H: take last 60 points from 1-day data
      if (range === "1H") prices = prices.slice(-60);

      setData(prices);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [coinId, range, cgId]);

  useEffect(() => { loadChart(); }, [loadChart]);

  const isUp = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const lineColor = "#D4A545";

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
          Price Chart
        </span>
        <div className="flex gap-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-200",
                range === r
                  ? "bg-accent-gold text-bg-dark"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 sm:h-72 rounded-lg bg-black/5 dark:bg-white/5 animate-pulse" />
      ) : error ? (
        <div className="h-64 sm:h-72 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Unable to load chart data — please try again.
        </div>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`cg-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={isUp ? 0.18 : 0.08} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#1E2A3F" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(v) => formatChartDate(v, range)}
                tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
                tickLine={false}
                axisLine={false}
                minTickGap={65}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) => fmtPrice(v, symbol, isJPY)}
                tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                width={84}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} range={range} sym={symbol} isJPY={isJPY} />}
                cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: "3 3", opacity: 0.6 }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#cg-${coinId})`}
                dot={false}
                isAnimationActive={true}
                animationDuration={350}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
