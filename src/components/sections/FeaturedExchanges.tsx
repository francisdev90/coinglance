"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { exchanges } from "@/lib/data/exchanges";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              "w-3 h-3",
              filled
                ? "fill-accent-gold text-accent-gold"
                : half
                ? "fill-accent-gold/40 text-accent-gold"
                : "text-text-secondary-light dark:text-text-secondary-dark"
            )}
          />
        );
      })}
      <span className="ml-1 text-xs font-mono font-bold text-text-secondary-light dark:text-text-secondary-dark">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function FeaturedExchanges() {
  return (
    <section className="py-16 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Trusted Exchanges
            </h2>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Verified, secure, and rated by our team
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {exchanges.map((exchange, index) => (
              <motion.div
                key={exchange.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className={cn(
                  "relative group flex flex-col p-5 rounded-xl border transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-xl",
                  exchange.isFeatured
                    ? "border-accent-gold/50 bg-bg-card-light dark:bg-bg-card-dark hover:shadow-accent-gold/10"
                    : exchange.isAfricaFocused
                    ? "border-purple-500/30 bg-bg-card-light dark:bg-bg-card-dark hover:shadow-purple-500/10 hover:border-purple-500/50"
                    : "border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:shadow-black/10 dark:hover:shadow-black/40"
                )}
              >
                {/* Accent strip */}
                {exchange.isFeatured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-accent-gold" />
                )}
                {exchange.isAfricaFocused && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-purple-500" />
                )}

                {/* Badge */}
                {(exchange.isFeatured || exchange.isAfricaFocused) && (
                  <div className="absolute -top-3.5 left-4">
                    <span className={cn(
                      "px-2.5 py-0.5 text-xs font-bold rounded-full tracking-wider uppercase",
                      exchange.isFeatured
                        ? "bg-accent-gold text-bg-dark"
                        : "bg-purple-600 text-white"
                    )}>
                      {exchange.isFeatured ? "Most Popular" : "Africa & EU"}
                    </span>
                  </div>
                )}

                <div className={cn("flex items-start gap-3 mb-3", (exchange.isFeatured || exchange.isAfricaFocused) && "mt-2")}>
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0", exchange.badgeColor)}>
                    {exchange.initial}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">
                      {exchange.name}
                    </h3>
                    <StarRating rating={exchange.rating} />
                  </div>
                </div>

                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2 leading-relaxed flex-1">
                  {exchange.description}
                </p>

                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  <span className="font-mono font-bold text-text-primary-light dark:text-text-primary-dark">
                    {exchange.totalUsers}
                  </span>{" "}users
                </p>

                <a
                  href={exchange.affiliateLink}
                  data-affiliate={exchange.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                    exchange.isFeatured
                      ? "bg-accent-gold text-bg-dark hover:bg-accent-gold/90 shadow-sm shadow-accent-gold/20"
                      : exchange.isAfricaFocused
                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-600/20"
                      : "border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-accent-gold hover:text-accent-gold"
                  )}
                >
                  Sign Up
                  <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed max-w-2xl">
              <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Affiliate disclosure:</span>{" "}
              We earn commissions when you sign up to exchanges through our links, at no extra cost to you. This funds CoinGlance and doesn&apos;t influence our ratings — we rank exchanges based on safety, fees, and user experience only.
            </p>
            <Link
              href="/affiliate-disclosure"
              className="text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors flex-shrink-0"
            >
              Learn more →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
