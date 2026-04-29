import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Globe, Shield, BarChart2, Users, Heart, Coins } from "lucide-react";
import Logo from "@/components/Logo";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About CoinGlance — Professional Crypto Market Intelligence",
  description: "CoinGlance is a free cryptocurrency data platform built to make professional-grade market intelligence accessible to everyone, with a particular focus on emerging markets.",
};

const VALUES = [
  {
    Icon: Globe,
    title: "Built for everyone",
    body: "Most crypto data tools are built for wealthy Western traders. We built CoinGlance with emerging markets in mind — with local currencies, P2P trading data, and exchange recommendations that work for users in Nigeria, Kenya, Ghana, South Africa, India, and beyond.",
  },
  {
    Icon: Shield,
    title: "Honest, always",
    body: "We earn money through affiliate commissions when you sign up to an exchange via our links. We disclose this on every page it's relevant. Our rankings and reviews are based on merit — not on who pays us more. We would rather have fewer revenue partners than recommend an exchange we don't trust.",
  },
  {
    Icon: BarChart2,
    title: "Data you can trust",
    body: "Every price, market cap, and data point on CoinGlance is pulled from reputable third-party APIs including CoinGecko, Binance, and Alternative.me. We don't manufacture data or display sponsored prices. What you see is what the market is doing.",
  },
  {
    Icon: Heart,
    title: "Free forever",
    body: "CoinGlance is completely free to use. We will never charge for access to price data, charts, or any of our tools. The affiliate model means the exchanges pay our bills — not you.",
  },
];

const STATS = [
  { label: "Coins tracked",     value: "1,000+" },
  { label: "Currencies supported", value: "12" },
  { label: "Exchanges reviewed",   value: "6+" },
  { label: "Updates per minute",   value: "Live" },
];

export default function AboutPage() {
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
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">About</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Logo size="lg" variant="icon" />
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              About CoinGlance
            </h1>
          </div>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
            CoinGlance is a professional cryptocurrency market intelligence platform built to make the data that institutional traders take for granted accessible to everyone — for free.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Founded in 2026, CoinGlance was built out of frustration with existing crypto data sites: either they required paid subscriptions, were buried in ads, showed misleading sponsored prices, or simply didn&apos;t support the currencies and exchanges used in emerging markets. We wanted to fix that.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-center">
              <p className="text-2xl font-bold font-mono text-accent-gold">{s.value}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Our mission
          </h2>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
            The global crypto market moves fast, and information is power. CoinGlance&apos;s mission is to give every person on earth — regardless of where they live or how much money they have — access to the same quality of market data and analysis that professional traders use every day.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            We believe financial transparency builds better investors. Better investors make more informed decisions. More informed decisions lead to better outcomes. That&apos;s why all of CoinGlance&apos;s core data tools will always be free.
          </p>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
            What we stand for
          </h2>
          <div className="space-y-4">
            {VALUES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-accent-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1.5">{title}</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How we make money */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            How CoinGlance makes money
          </h2>
          <div className="p-6 rounded-xl border border-accent-gold/25 bg-accent-gold/[0.04]">
            <div className="flex items-start gap-3 mb-4">
              <Coins className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                Affiliate commissions from exchanges — nothing else.
              </p>
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              When you sign up to a cryptocurrency exchange through a link on CoinGlance, the exchange pays us a small referral commission. This commission comes out of the exchange&apos;s marketing budget and costs you nothing extra.
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
              We do not sell advertising. We do not sell your data. We do not charge subscription fees. We do not accept payments from exchanges to influence our rankings or data.
            </p>
            <Link
              href="/affiliate-disclosure"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
            >
              Read our full affiliate disclosure →
            </Link>
          </div>
        </div>

        {/* Our promise */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Our promise to you
          </h2>
          <div className="space-y-3">
            {[
              "CoinGlance will always be free to use. No paywalls, no ads, no data selling.",
              "Our exchange rankings and reviews are based on safety, fees, and user experience — not affiliate revenue.",
              "We will clearly label every affiliate link on the site.",
              "If we stop trusting an exchange, we remove it — regardless of the commercial relationship.",
              "We will never show you sponsored or manipulated price data.",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-success font-bold text-xs">✓</span>
                </div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            The team
          </h2>
          <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-accent-gold" />
              <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">A small, focused team</p>
            </div>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              CoinGlance is built and maintained by a small team passionate about open financial data and emerging market access. We believe in building in public and moving fast. If you want to contribute, partner with us, or give feedback, we&apos;d love to hear from you.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors shadow-sm shadow-accent-gold/20"
          >
            Get in touch
          </Link>
          <Link
            href="/coins"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-semibold text-sm hover:border-accent-gold/40 hover:text-accent-gold transition-colors"
          >
            Explore the markets
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
