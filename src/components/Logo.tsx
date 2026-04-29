"use client";

/*
  CoinGlance — "The Glance Mark"
  ================================
  Concept: A sharp almond/lens eye shape (= glance, observation)
           containing 3 ascending filled bars (= market data, chart).

  Reading: "An eye watching rising markets" — instantly communicates
           the product purpose without words.

  Scale behaviour:
    16px favicon  → eye outline + 3 bars are distinct shapes
    32px favicon  → clean, readable, no blur
    512px app icon → all detail crisp and intentional

  Monochrome rule: all paths use `currentColor` or a direct hex value
                   so the mark works in gold, white, or navy equally.
*/

import { cn } from "@/lib/utils";

// ─── colour tokens ────────────────────────────────────────────────────────────
const GOLD  = "#D4A545";
const NAVY  = "#1E3A5F";
const WHITE = "#F1F5F9";
const BG_DARK = "#0A1628";

// ─── types ───────────────────────────────────────────────────────────────────
export type LogoSize    = "xs" | "sm" | "md" | "lg" | "xl";
export type LogoVariant = "full" | "icon" | "plain";
// full  = navy badge + SVG mark + wordmark text
// icon  = navy badge + SVG mark only (no wordmark)
// plain = bare SVG mark, no badge, no wordmark (used inside OG images, favicons)

interface LogoProps {
  size?:      LogoSize;
  variant?:   LogoVariant;
  className?: string;
}

// ─── size config ─────────────────────────────────────────────────────────────
const SIZES: Record<LogoSize, {
  badge:    number;  // badge container px
  mark:     number;  // SVG mark inside badge
  text:     string;  // Tailwind text class for wordmark
  gap:      string;  // gap between badge and wordmark
  radius:   string;  // Tailwind rounded class for badge
}> = {
  xs: { badge: 24, mark: 14, text: "text-sm   font-semibold tracking-tight", gap: "gap-1.5", radius: "rounded"    },
  sm: { badge: 32, mark: 18, text: "text-base font-semibold tracking-tight", gap: "gap-2",   radius: "rounded-md" },
  md: { badge: 38, mark: 22, text: "text-lg   font-semibold tracking-tight", gap: "gap-2.5", radius: "rounded-lg" },
  lg: { badge: 48, mark: 28, text: "text-xl   font-bold    tracking-tight", gap: "gap-3",   radius: "rounded-lg" },
  xl: { badge: 64, mark: 38, text: "text-2xl  font-bold    tracking-tight", gap: "gap-3.5", radius: "rounded-xl" },
};

// ─── the raw SVG mark ────────────────────────────────────────────────────────
// 32×32 viewBox. All paths use an explicit fill/stroke prop so colour is caller-controlled.
export function GlanceMark({
  size,
  color = GOLD,
  className,
}: {
  size: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/*
        Eye / lens outline
        Almond shape: left apex (2,16), right apex (30,16),
        top apex (~16,3), bottom apex (~16,29).
        Two cubic bezier curves create a natural, sharp almond.
      */}
      <path
        d="M2 16C5.5 7.5 10.5 3 16 3C21.5 3 26.5 7.5 30 16C26.5 24.5 21.5 29 16 29C10.5 29 5.5 24.5 2 16Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/*
        3 ascending bars — all share baseline y=24.5
        Heights: 5.5 / 10 / 14  (ascending left→right = uptrend)
        Width: 4px each, rx=1.5 for subtle rounding
        All verified to fall inside the eye outline
      */}
      {/* Bar 1 — short */}
      <rect x="8.5"  y="19"   width="4" height="5.5" rx="1.5" fill={color} />
      {/* Bar 2 — medium */}
      <rect x="14"   y="14.5" width="4" height="10"  rx="1.5" fill={color} />
      {/* Bar 3 — tall */}
      <rect x="19.5" y="10.5" width="4" height="14"  rx="1.5" fill={color} />
    </svg>
  );
}

// ─── main Logo component ──────────────────────────────────────────────────────
export default function Logo({
  size    = "sm",
  variant = "full",
  className,
}: LogoProps) {
  const cfg = SIZES[size];

  // Plain variant: bare mark, no badge, no wordmark
  if (variant === "plain") {
    return (
      <GlanceMark
        size={cfg.badge}
        color={GOLD}
        className={className}
      />
    );
  }

  // Badge: navy rounded square containing the gold mark
  const badge = (
    <div
      className={cn(
        "flex items-center justify-center flex-shrink-0 bg-accent-navy",
        cfg.radius,
        "transition-transform group-hover:scale-105 duration-200",
      )}
      style={{ width: cfg.badge, height: cfg.badge }}
    >
      <GlanceMark size={cfg.mark} color={GOLD} />
    </div>
  );

  // Icon-only: badge without wordmark
  if (variant === "icon") {
    return <div className={className}>{badge}</div>;
  }

  // Full: badge + wordmark
  return (
    <div className={cn("flex items-center", cfg.gap, className)}>
      {badge}
      <span
        className={cn(
          cfg.text,
          "text-text-primary-light dark:text-text-primary-dark",
          "transition-colors group-hover:text-accent-gold duration-200",
        )}
      >
        CoinGlance
      </span>
    </div>
  );
}

// ─── named exports for direct use ────────────────────────────────────────────
export { GOLD, NAVY, WHITE, BG_DARK };
