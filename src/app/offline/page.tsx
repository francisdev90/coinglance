"use client";

import Logo from "@/components/Logo";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <Logo size="lg" variant="full" />
      </div>

      <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 6.343a9 9 0 000 12.728M9.172 9.172a5 5 0 000 7.072M12 12h.01" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">You&apos;re offline</h1>
      <p className="text-text-secondary-dark text-sm max-w-xs leading-relaxed mb-8">
        No internet connection. Please check your connection and try again.
        Cached pages may still be available.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors"
      >
        Try again
      </button>

      <p className="mt-8 text-xs text-text-secondary-dark/60">
        CoinGlance · Live Crypto Markets
      </p>
    </div>
  );
}
