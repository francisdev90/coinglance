"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FearGreedData } from "@/lib/api/fearGreed";

interface Props {
  current: FearGreedData;
  history: FearGreedData[];
}

const ZONES = [
  { label: "Extreme Fear",  min: 0,  max: 24,  color: "#DC2626", bg: "bg-red-600" },
  { label: "Fear",          min: 25, max: 44,  color: "#F97316", bg: "bg-orange-500" },
  { label: "Neutral",       min: 45, max: 55,  color: "#EAB308", bg: "bg-yellow-500" },
  { label: "Greed",         min: 56, max: 74,  color: "#22C55E", bg: "bg-green-500" },
  { label: "Extreme Greed", min: 75, max: 100, color: "#10B981", bg: "bg-emerald-500" },
];

function getZone(value: number) {
  return ZONES.find((z) => value >= z.min && value <= z.max) ?? ZONES[0];
}

function GaugeArc({ value }: { value: number }) {
  const angle = -135 + (value / 100) * 270;
  const zone = getZone(value);

  const arcPath = (startDeg: number, endDeg: number, r: number, cx: number, cy: number) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const cx = 150, cy = 150, r = 110;

  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-xs mx-auto">
      {/* Background track */}
      <path d={arcPath(-135, 135, r, cx, cy)} fill="none" stroke="currentColor" strokeWidth={18} strokeLinecap="round" className="text-border-light dark:text-border-dark" />

      {/* Colored zones */}
      {ZONES.map((zone) => {
        const start = -135 + (zone.min / 100) * 270;
        const end = -135 + ((zone.max + 1) / 100) * 270;
        return (
          <path
            key={zone.label}
            d={arcPath(start, Math.min(end, 135), r, cx, cy)}
            fill="none"
            stroke={zone.color}
            strokeWidth={18}
            strokeLinecap="butt"
            opacity={0.25}
          />
        );
      })}

      {/* Active fill */}
      <path
        d={arcPath(-135, -135 + (value / 100) * 270, r, cx, cy)}
        fill="none"
        stroke={zone.color}
        strokeWidth={18}
        strokeLinecap="round"
      />

      {/* Needle */}
      <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
        <line x1={0} y1={0} x2={0} y2={-r + 12} stroke={zone.color} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={0} r={6} fill={zone.color} />
      </g>

      {/* Value text */}
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize={38} fontWeight="bold" fill={zone.color} fontFamily="monospace">
        {value}
      </text>
      <text x={cx} y={cy + 42} textAnchor="middle" fontSize={11} fill="#94A3B8" fontFamily="monospace">
        {zone.label.toUpperCase()}
      </text>
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { date: string; value: number; label: string };
  const zone = getZone(d.value);
  return (
    <div className="rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark shadow-xl px-3 py-2 text-xs">
      <p className="text-text-secondary-light dark:text-text-secondary-dark mb-0.5">{d.date}</p>
      <p className="font-bold font-mono" style={{ color: zone.color }}>{d.value} — {zone.label}</p>
    </div>
  );
}

export default function FearGreedClient({ current, history }: Props) {
  const value = parseInt(current.value, 10);
  const zone = getZone(value);

  const chartData = [...history]
    .reverse()
    .map((d) => ({
      date: new Date(parseInt(d.timestamp, 10) * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseInt(d.value, 10),
      label: d.value_classification,
    }));

  const last7 = history.slice(0, 7).reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
          <Activity className="w-7 h-7 text-accent-gold" />
          Crypto Fear & Greed Index
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Market sentiment indicator from Alternative.me — 0 = Extreme Fear, 100 = Extreme Greed
        </p>
      </div>

      {/* Gauge card */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <GaugeArc value={value} />
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-text-secondary-light dark:text-text-secondary-dark mb-1">Current Reading</p>
              <p className="text-5xl font-bold font-mono" style={{ color: zone.color }}>{value}</p>
              <p className="text-lg font-semibold mt-1" style={{ color: zone.color }}>{zone.label}</p>
            </div>

            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {value <= 24 && "The market is in extreme fear. Investors are overly worried. This could be a buying opportunity."}
              {value >= 25 && value <= 44 && "Fear dominates the market. Investors are risk-averse and cautious about their positions."}
              {value >= 45 && value <= 55 && "The market is neutral. No strong fear or greed signals at the moment."}
              {value >= 56 && value <= 74 && "Greed is taking over. Investors are getting more comfortable taking risk. Stay cautious."}
              {value >= 75 && "Extreme greed — the market may be due for a correction. History shows this as a sell signal."}
            </p>

            {/* Zone scale */}
            <div className="space-y-1.5">
              {ZONES.map((z) => (
                <div key={z.label} className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", z.bg)} />
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex-1">{z.label}</span>
                  <span className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{z.min}–{z.max}</span>
                  {value >= z.min && value <= z.max && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: z.color + "22", color: z.color }}>
                      Now
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Last 7 days */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-4">Last 7 Days</h2>
        <div className="grid grid-cols-7 gap-2">
          {last7.map((d, i) => {
            const v = parseInt(d.value, 10);
            const z = getZone(v);
            const isToday = i === last7.length - 1;
            return (
              <div key={d.timestamp} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn("w-full rounded-lg flex items-center justify-center text-sm font-bold font-mono py-2 transition-all", isToday && "ring-2 ring-offset-2 ring-offset-bg-card-light dark:ring-offset-bg-card-dark")}
                  style={{ background: z.color + "22", color: z.color, ...(isToday ? { ringColor: z.color } : {}) }}
                >
                  {v}
                </div>
                <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark text-center leading-tight">
                  {new Date(parseInt(d.timestamp, 10) * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                {isToday && <span className="text-[10px] text-accent-gold font-bold">Today</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 90-day chart */}
      <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-5">90-Day History</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A545" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D4A545" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={false}
              interval={14}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={25} stroke="#F97316" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={50} stroke="#EAB308" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={75} stroke="#22C55E" strokeDasharray="3 3" strokeOpacity={0.4} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#D4A545"
              strokeWidth={2}
              fill="url(#fgGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap gap-3 justify-center">
          {ZONES.map((z) => (
            <div key={z.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: z.color }} />
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{z.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
