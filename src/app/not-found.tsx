import Link from "next/link";
import { ArrowRight, Home, BarChart2, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Page Not Found — CoinGlance",
  description: "This page doesn't exist or has moved.",
};

const HELPFUL_LINKS = [
  { label: "Go to homepage", href: "/", Icon: Home, desc: "Live prices, market overview, and daily briefing" },
  { label: "Browse all coins", href: "/coins", Icon: BarChart2, desc: "100 cryptocurrencies with live prices and charts" },
  { label: "Compare exchanges", href: "/exchanges", Icon: Building2, desc: "Find the best exchange for your country" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">

        {/* Logo */}
        <Link href="/" className="mb-12 group">
          <Logo size="md" variant="full" />
        </Link>

        {/* 404 */}
        <div className="text-center mb-10">
          <p className="text-8xl sm:text-9xl font-bold font-mono text-accent-gold/20 dark:text-accent-gold/10 mb-6 leading-none select-none">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
            This page doesn&apos;t exist
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for may have been moved, deleted, or never existed. Here are some useful places to go instead:
          </p>
        </div>

        {/* Helpful links */}
        <div className="w-full max-w-md space-y-3 mb-10">
          {HELPFUL_LINKS.map(({ label, href, Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:border-accent-gold/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-accent-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-gold transition-colors">{label}</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-accent-gold transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
          Think this is a mistake?{" "}
          <Link href="/contact" className="text-accent-gold hover:underline">
            Let us know
          </Link>
        </p>

      </div>
    </div>
  );
}
