"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CoinsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CoinsError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7 text-danger" />
        </div>
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          Unable to load market data
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-sm mb-6 leading-relaxed">
          We couldn&apos;t fetch data from CoinGecko right now. This is usually a temporary rate limit. Try again in a moment.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:border-accent-gold/40 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
