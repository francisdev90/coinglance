import React from "react";

export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-50 h-16 border-b border-border-light dark:border-border-dark bg-bg-card-light/80 dark:bg-bg-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="h-7 w-32 rounded-md animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="hidden md:flex items-center gap-4">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="h-4 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" style={{ width: 48 + (i % 3) * 12 }} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded-md animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
          <div className="h-8 w-8 rounded-md animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
          <div className="h-8 w-24 rounded-md animate-pulse bg-accent-gold/20" />
        </div>
      </div>
    </div>
  );
}

export function TickerSkeleton() {
  return (
    <div className="h-9 border-b border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark animate-pulse" />
  );
}

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-black/[0.07] dark:bg-white/[0.07] ${className ?? ""}`} style={style} />
  );
}
