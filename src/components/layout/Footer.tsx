import Link from "next/link";
import { Globe, Send, Hash, RefreshCw } from "lucide-react";
import Logo from "@/components/Logo";

const footerLinks = {
  product: [
    { label: "Markets",    href: "/coins" },
    { label: "Exchanges",  href: "/exchanges" },
    { label: "News",       href: "/news" },
    { label: "Trending",   href: "/trending" },
    { label: "Fear & Greed", href: "/fear-greed" },
    { label: "Converter",  href: "/converter" },
    { label: "P2P Rates",  href: "/p2p-rates" },
  ],
  company: [
    { label: "About",               href: "/about" },
    { label: "Contact",             href: "/contact" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
  legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy",    href: "/cookies" },
  ],
};

// TODO: Replace # with real social media URLs when accounts are created
const SOCIAL_LINKS = [
  { Icon: Globe,  label: "Website",  href: "#" },
  { Icon: Send,   label: "Telegram", href: "#" },
  { Icon: Hash,   label: "Discord",  href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-card-light dark:bg-bg-card-dark border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" variant="full" />
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-5">
              Professional crypto market intelligence for serious traders and
              investors worldwide.
            </p>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold hover:border-accent-gold/40 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate disclosure bar */}
        <div className="pt-5 pb-4 border-t border-border-light dark:border-border-dark">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed text-center sm:text-left">
            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Affiliate disclosure:</span>{" "}
            We may earn commissions from exchange signups, at no extra cost to you. This funds CoinGlance and keeps all data free.{" "}
            <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-accent-gold transition-colors duration-200">
              Learn how this works →
            </Link>
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>&copy; 2026 CoinGlance. All rights reserved.</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span>Not financial advice. Crypto is volatile — invest responsibly.</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 text-success" />
              Data updates every 60s
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/affiliate-disclosure" className="hover:text-accent-gold transition-colors duration-200">Disclosure</Link>
            <span className="opacity-30">|</span>
            <Link href="/privacy" className="hover:text-accent-gold transition-colors duration-200">Privacy</Link>
            <span className="opacity-30">|</span>
            <Link href="/terms" className="hover:text-accent-gold transition-colors duration-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
