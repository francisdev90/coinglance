"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NewsError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4">
          News feeds are temporarily unavailable.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
      <Footer />
    </div>
  );
}
