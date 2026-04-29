import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Cookie } from "lucide-react";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy — CoinGlance",
  description: "CoinGlance's cookie policy. We use minimal cookies — no advertising trackers, no cross-site tracking.",
};

const LAST_UPDATED = "April 28, 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
        {title}
      </h2>
      <div className="space-y-4 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
        {children}
      </div>
    </section>
  );
}

type StorageEntry = {
  key: string;
  type: string;
  purpose: string;
  expires: string;
  thirdParty: string;
};

const STORAGE_TABLE: StorageEntry[] = [
  {
    key: "preferred_currency",
    type: "localStorage",
    purpose: "Remembers your selected display currency (e.g. USD, NGN, EUR) so it persists across visits",
    expires: "Persists until cleared",
    thirdParty: "No",
  },
  {
    key: "ct_streak",
    type: "localStorage",
    purpose: "Stores your daily visit streak count and dates for the streak feature on the homepage",
    expires: "Persists until cleared",
    thirdParty: "No",
  },
  {
    key: "__vercel_live_token",
    type: "Session cookie",
    purpose: "Set by Vercel (our hosting provider) for infrastructure and performance purposes",
    expires: "Session",
    thirdParty: "Vercel",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <nav className="flex items-center gap-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-8">
          <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Cookie Policy</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-accent-gold" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Cookie Policy
            </h1>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            CoinGlance uses minimal browser storage. We do not use advertising cookies, cross-site tracking, or any third-party marketing tools. This page explains exactly what we store and why.
          </p>
        </div>

        <Section id="what-are-cookies" title="1. What are cookies and localStorage?">
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Cookies</strong> are small text files that a website stores on your device when you visit. They are sent back to the website with each request and allow the site to remember information about your visit.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">localStorage</strong> is a browser feature that allows websites to store data on your device that persists between visits. Unlike cookies, localStorage data is not sent to the server with each request — it remains entirely on your device and is only accessible to the same website that stored it.
          </p>
        </Section>

        <Section id="what-we-use" title="2. What storage CoinGlance uses">
          <p>
            CoinGlance uses <strong className="text-text-primary-light dark:text-text-primary-dark">no advertising cookies</strong> and <strong className="text-text-primary-light dark:text-text-primary-dark">no cross-site tracking</strong>. The table below lists every item we store in your browser:
          </p>

          {/* Storage table */}
          <div className="overflow-x-auto mt-4 rounded-xl border border-border-light dark:border-border-dark">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-black/[0.03] dark:bg-white/[0.03]">
                  <th className="px-3 py-3 text-left font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Key / Name</th>
                  <th className="px-3 py-3 text-left font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Type</th>
                  <th className="px-3 py-3 text-left font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Purpose</th>
                  <th className="px-3 py-3 text-left font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Expires</th>
                  <th className="px-3 py-3 text-left font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">3rd Party</th>
                </tr>
              </thead>
              <tbody>
                {STORAGE_TABLE.map((row, i) => (
                  <tr key={row.key} className={i < STORAGE_TABLE.length - 1 ? "border-b border-border-light dark:border-border-dark" : ""}>
                    <td className="px-3 py-3 font-mono text-text-primary-light dark:text-text-primary-dark">{row.key}</td>
                    <td className="px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">{row.type}</td>
                    <td className="px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark">{row.purpose}</td>
                    <td className="px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">{row.expires}</td>
                    <td className="px-3 py-3 text-text-secondary-light dark:text-text-secondary-dark">{row.thirdParty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="essential-only" title="3. We use essential storage only">
          <p>
            CoinGlance does not use:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Advertising or targeting cookies</li>
            <li>Google Analytics, Facebook Pixel, or any similar tracking service</li>
            <li>Cross-site tracking or fingerprinting</li>
            <li>Persistent login cookies (we have no accounts)</li>
            <li>A/B testing or personalisation cookies</li>
          </ul>
          <p>
            Because we use only essential storage, we do not display a cookie consent banner. Essential browser storage required for the site to function does not require consent under GDPR and similar regulations.
          </p>
        </Section>

        <Section id="third-party-cookies" title="4. Third-party cookies">
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Vercel (hosting):</strong> Our infrastructure provider Vercel may set a technical session cookie for load balancing and security. This cookie contains no personal information and expires when you close your browser.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Affiliate exchanges:</strong> When you click an affiliate link to an exchange (Binance, Coinbase, etc.), that exchange&apos;s website will set its own cookies according to its privacy policy. We have no control over these cookies. We recommend reviewing the cookie policies of any exchange you visit.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Binance WebSocket:</strong> The live market ticker on CoinGlance connects directly to Binance&apos;s public WebSocket API from your browser. Binance may log this connection according to their own privacy policy.
          </p>
        </Section>

        <Section id="how-to-manage" title="5. How to manage and delete storage">
          <p>
            You can clear all CoinGlance localStorage data at any time:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Chrome:</strong> Settings → Privacy and security → Clear browsing data → Cookies and site data</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data → Clear Data</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
          </ul>
          <p>
            Note that clearing storage will reset your saved currency preference and visit streak. The site will continue to work normally.
          </p>
        </Section>

        <Section id="changes" title="6. Changes to this policy">
          <p>
            We may update this cookie policy to reflect changes in our practices or for legal reasons. The &quot;Last updated&quot; date at the top will always reflect the most recent revision. We encourage you to check this page periodically.
          </p>
        </Section>

        <Section id="contact" title="7. Contact">
          <p>
            Questions about our use of cookies or localStorage? Email us at{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>
          </p>
        </Section>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/privacy" className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors">
            Terms of Service →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
