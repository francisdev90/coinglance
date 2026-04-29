"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-xs mb-8 leading-relaxed">
        An unexpected error occurred. This is usually temporary — please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-semibold text-sm hover:border-accent-gold/40 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
