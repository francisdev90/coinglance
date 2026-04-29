"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Database, BarChart2 } from "lucide-react";
import Link from "next/link";

interface Props {
  totalCoins?: number | null;
}

export default function Hero({ totalCoins }: Props) {
  const coinCount = totalCoins
    ? totalCoins.toLocaleString("en-US") + "+"
    : "10,000+";

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-bg-light dark:bg-bg-dark">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#D4A545 1px, transparent 1px), linear-gradient(90deg, #D4A545 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-light/0 via-bg-light/0 to-bg-light dark:from-bg-dark/0 dark:via-bg-dark/0 dark:to-bg-dark" />
      <div className="absolute inset-0 bg-gradient-radial-subtle" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-accent-gold tracking-wide">
              Live Market Data · Tracking {coinCount} cryptocurrencies
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark leading-[1.1]">
            A Glance at Crypto.
            <br />
            <span className="text-accent-gold">Worldwide.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-text-secondary-light dark:text-text-secondary-dark leading-relaxed max-w-xl">
            Live prices, market data, and trusted exchange reviews — free for
            traders in{" "}
            <span className="text-text-primary-light dark:text-text-primary-dark font-medium">
              180+ countries
            </span>
            .
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="/coins"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-all duration-200 shadow-lg shadow-accent-gold/25"
            >
              Explore Markets
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/exchanges"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-text-secondary-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-semibold text-sm hover:border-accent-gold hover:text-accent-gold transition-all duration-200"
            >
              Compare Exchanges
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark"
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
              Live data from
            </span>
            {[
              { Icon: Activity,  label: "CoinGecko"    },
              { Icon: Database,  label: "CoinDesk RSS" },
              { Icon: BarChart2, label: "Binance"      },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
