import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — CoinGlance",
  description: "CoinGlance's privacy policy. We collect minimal data, use no third-party advertising, and will never sell your information.",
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

export default function PrivacyPage() {
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
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Privacy Policy</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-accent-gold" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            CoinGlance is built on a simple principle: your data is yours. We collect the bare minimum required to operate the site, use it only to improve your experience, and will never sell it to third parties.
          </p>
        </div>

        <Section id="who-we-are" title="1. Who we are">
          <p>
            CoinGlance is a cryptocurrency data and market intelligence platform. References to &quot;CoinGlance,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot; throughout this policy refer to the operators of coinglance.app. You can reach us at{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>.
          </p>
        </Section>

        <Section id="what-we-collect" title="2. What data we collect">
          <p>
            CoinGlance does not require you to create an account, log in, or provide any personal information to use the site. The vast majority of users interact with CoinGlance entirely anonymously.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Data stored in your browser (localStorage):</strong> We store two small preferences locally on your device — your selected display currency (e.g. USD, NGN, EUR) and your daily visit streak counter. This data never leaves your device and is never transmitted to our servers. You can clear it at any time by clearing your browser&apos;s local storage.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Server logs:</strong> Like all web services, our hosting provider automatically records standard server access logs — including your IP address, browser type, referring URL, and pages visited. These logs are used solely for security and infrastructure monitoring and are retained for no longer than 30 days.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Analytics:</strong> We may use privacy-first analytics tooling (such as Vercel Analytics or Plausible) that collects aggregated, anonymised traffic data — page views, referrer sources, and country-level geography. No individual user is tracked. No cookies are set for analytics purposes.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">What we do NOT collect:</strong> We do not collect your name, email address, phone number, financial information, or any personally identifiable information. We do not use advertising trackers, Facebook Pixel, Google Analytics, or any third-party marketing tools.
          </p>
        </Section>

        <Section id="cookies" title="3. Cookies">
          <p>
            CoinGlance does not set any tracking or advertising cookies. The only browser storage we use is localStorage (for your currency preference and streak counter), which is not a cookie and cannot be accessed by third parties.
          </p>
          <p>
            Your hosting provider (Vercel) may set a session-level cookie for performance and security purposes. This cookie does not identify you personally and expires when you close your browser. For full details, see our{" "}
            <Link href="/cookies" className="text-accent-gold hover:underline">Cookie Policy</Link>.
          </p>
        </Section>

        <Section id="third-party-services" title="4. Third-party services">
          <p>
            CoinGlance fetches market data from the following third-party APIs. When your browser loads our pages, requests are made to these services from our server (not directly from your browser), so they do not receive your IP address:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">CoinGecko</strong> — cryptocurrency price and market data (coingecko.com)</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Alternative.me</strong> — Fear &amp; Greed Index data (alternative.me)</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Binance WebSocket</strong> — live ticker prices streamed directly to your browser for the market ticker</li>
          </ul>
          <p>
            When you click an affiliate link to an exchange, that exchange&apos;s website will apply their own privacy policy to your subsequent visit. We recommend reading the privacy policy of any exchange you sign up to.
          </p>
        </Section>

        <Section id="affiliate-links" title="5. Affiliate links and tracking">
          <p>
            CoinGlance includes affiliate links to cryptocurrency exchanges. When you click these links, the destination exchange may set their own tracking cookies to attribute your signup to us. This tracking is governed by the exchange&apos;s own privacy policy and is used only to calculate our referral commission. We do not receive or store any personal data about you as a result of this process.
          </p>
          <p>
            All affiliate links on CoinGlance are clearly labelled. For full details of our affiliate relationships, see our{" "}
            <Link href="/affiliate-disclosure" className="text-accent-gold hover:underline">Affiliate Disclosure</Link>.
          </p>
        </Section>

        <Section id="your-rights" title="6. Your rights (GDPR and beyond)">
          <p>
            If you are located in the European Economic Area, the United Kingdom, or another jurisdiction with comprehensive privacy law, you have certain rights regarding any personal data held about you. Given that CoinGlance collects no personally identifiable information, most of these rights have limited applicability — but we honour them in full:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Right to access:</strong> You can request a copy of any data we hold about you.</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Right to erasure:</strong> You can request deletion of any data associated with your IP address from our server logs.</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Right to object:</strong> You can object to any processing of your data.</li>
            <li><strong className="text-text-primary-light dark:text-text-primary-dark">Local storage data:</strong> You can delete your locally stored preferences at any time via your browser&apos;s developer tools or settings.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>.
          </p>
        </Section>

        <Section id="data-security" title="7. Data security">
          <p>
            CoinGlance is served exclusively over HTTPS. Server logs are stored on infrastructure operated by Vercel and protected by industry-standard security practices. Since we hold no personal data beyond access logs, the risk to you in the event of any security incident is minimal.
          </p>
        </Section>

        <Section id="children" title="8. Children's privacy">
          <p>
            CoinGlance is not directed at children under 13 years of age. We do not knowingly collect any information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
          </p>
        </Section>

        <Section id="changes" title="9. Changes to this policy">
          <p>
            We may update this privacy policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. Continued use of CoinGlance after a policy update constitutes your acceptance of the revised policy. We encourage you to review this page periodically.
          </p>
        </Section>

        <Section id="contact" title="10. Contact">
          <p>
            For any privacy-related questions or requests, contact us at:{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>
          </p>
        </Section>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link
            href="/terms"
            className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            Terms of Service →
          </Link>
          <Link
            href="/cookies"
            className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            Cookie Policy →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
