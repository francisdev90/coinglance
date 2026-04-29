"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrency, CURRENCY_META, type CurrencyCode } from "@/contexts/CurrencyContext";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Markets", href: "/coins" },
  { label: "Exchanges", href: "/exchanges" },
  { label: "News", href: "/news" },
  { label: "Trending", href: "/trending" },
  { label: "Fear & Greed", href: "/fear-greed" },
  { label: "Converter", href: "/converter" },
  { label: "P2P Rates", href: "/p2p-rates" },
];

const CURRENCIES = Object.entries(CURRENCY_META) as [CurrencyCode, typeof CURRENCY_META[CurrencyCode]][];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { currency, setCurrency, symbol } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-light dark:border-border-dark bg-bg-card-light/80 dark:bg-bg-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Logo size="sm" variant="full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = link.href !== "#" && pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm transition-colors duration-200 group",
                    isActive
                      ? "text-accent-gold"
                      : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-1 left-3 right-3 h-px bg-accent-gold origin-left transition-transform duration-200",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-1.5">

            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-sm">{CURRENCY_META[currency].flag}</span>
                <span className="font-mono text-xs font-bold tracking-wider">{currency}</span>
                <span className="font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark opacity-70">{symbol}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isCurrencyOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isCurrencyOpen && (
                  <>
                    <button
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCurrencyOpen(false)}
                      aria-hidden
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark shadow-xl shadow-black/20 py-1 z-50 max-h-80 overflow-y-auto"
                    >
                      {CURRENCIES.map(([code, meta]) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCurrency(code);
                            setIsCurrencyOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3",
                            currency === code
                              ? "text-accent-gold bg-accent-gold/5"
                              : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5"
                          )}
                        >
                          <span className="text-base w-6 flex-shrink-0">{meta.flag}</span>
                          <span className="font-mono font-bold text-xs tracking-wider w-8">{code}</span>
                          <span className="text-xs opacity-70 flex-1 truncate">{meta.label}</span>
                          <span className="font-mono text-xs opacity-60 flex-shrink-0">{meta.symbol}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            {/* Get Started CTA */}
            <Link
              href="/coins"
              className="px-4 py-1.5 rounded-md text-sm font-semibold bg-accent-gold text-bg-dark hover:bg-accent-gold/90 transition-colors duration-200 shadow-sm shadow-accent-gold/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>
            <button
              className="p-2 rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark"
          >
            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2.5 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold rounded-md hover:bg-accent-gold/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-3 border-t border-border-light dark:border-border-dark space-y-3">
              {/* Mobile currency grid — all 12 */}
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Currency</p>
              <div className="grid grid-cols-4 gap-1.5">
                {CURRENCIES.map(([code, meta]) => (
                  <button
                    key={code}
                    onClick={() => { setCurrency(code); setIsMenuOpen(false); }}
                    className={cn(
                      "flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-xs font-mono font-bold transition-all",
                      currency === code
                        ? "bg-accent-gold text-bg-dark"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold border border-border-light dark:border-border-dark"
                    )}
                  >
                    <span className="text-base leading-none">{meta.flag}</span>
                    <span className="text-[10px] leading-none">{code}</span>
                  </button>
                ))}
              </div>
              <Link
                href="/coins"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-accent-gold text-bg-dark hover:bg-accent-gold/90 transition-colors duration-200 shadow-sm shadow-accent-gold/20"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
