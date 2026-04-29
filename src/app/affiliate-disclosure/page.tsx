import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, BarChart2, Heart, ExternalLink } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketTicker from "@/components/layout/MarketTicker";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — CoinGlance",
  description:
    "CoinGlance is transparent about how we make money. We earn commissions from exchanges we recommend — here's exactly how it works and why it doesn't affect our rankings.",
};

const PARTNER_EXCHANGES = [
  {
    name: "Binance",
    description: "World's largest exchange by volume. We recommend Binance for global users seeking the lowest spot fees and widest coin selection.",
    badge: "bg-yellow-500",
    initial: "B",
  },
  {
    name: "Bybit",
    description: "Leading derivatives platform with industry-low perpetual contract fees. Our top pick for experienced traders.",
    badge: "bg-yellow-400",
    initial: "By",
  },
  {
    name: "KuCoin",
    description: "Widest altcoin selection of any major exchange. Recommended for users hunting for early-stage projects.",
    badge: "bg-green-500",
    initial: "K",
  },
  {
    name: "Coinbase",
    description: "Most trusted regulated exchange in the United States. Our beginner recommendation for US-based users.",
    badge: "bg-blue-500",
    initial: "C",
  },
  {
    name: "Luno",
    description: "Best-in-class exchange for users in Nigeria, South Africa, Kenya, Malaysia, and the UK. Regulated in 40+ countries with local currency support.",
    badge: "bg-purple-600",
    initial: "L",
  },
  {
    name: "MEXC",
    description: "One of the largest exchanges by coin selection with 1,800+ listed assets. Recommended for users seeking early listings of new projects and very low trading fees.",
    badge: "bg-blue-600",
    initial: "MX",
  },
];

const PRINCIPLES = [
  {
    Icon: ShieldCheck,
    title: "Safety comes first",
    body: "Every exchange we list has been evaluated for regulatory compliance, insurance coverage, security practices, and track record. We would remove any exchange immediately if we had concerns about user safety — regardless of affiliate revenue.",
  },
  {
    Icon: BarChart2,
    title: "Rankings are never for sale",
    body: "Commission rates have zero bearing on our rankings, ratings, or recommendations. Binance is listed first because it has the most users and lowest fees — not because their commission rate is the highest (it isn't). Our star ratings reflect user experience, fee structure, and reliability.",
  },
  {
    Icon: Heart,
    title: "We'd tell you if we didn't recommend an exchange",
    body: "There are exchanges we have been approached by that we've declined to partner with because we don't trust them enough to recommend them to our users. We would rather turn down revenue than send you somewhere unsafe.",
  },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-8">
          <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Affiliate Disclosure</span>
        </nav>

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight mb-4">
            Affiliate Disclosure
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Last updated: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="prose-style space-y-5 mb-12">
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            CoinGlance is reader-supported. When you sign up to a cryptocurrency exchange through a link on our site, we may earn a referral commission from that exchange — at absolutely no cost to you. This is the only way CoinGlance makes money. We don&apos;t sell advertising, we don&apos;t sell your data, and we don&apos;t charge for any feature on the site.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Affiliate marketing is a standard business model used by many reputable financial publications — including NerdWallet, The Motley Fool, and Bankrate. In simple terms: an exchange pays us a small fee when someone creates a verified account through our link. This fee comes out of the exchange&apos;s marketing budget and does not add any cost to your trades, deposits, or withdrawals. You get the same fees and experience you&apos;d get signing up directly.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            In accordance with the FTC&apos;s guidelines on endorsements and testimonials (16 C.F.R. Part 255), we disclose this relationship clearly and prominently on every page where affiliate links appear.
          </p>
        </div>

        {/* Our partners */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            Our affiliate partners
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
            CoinGlance currently has affiliate relationships with the following exchanges:
          </p>
          <div className="space-y-3">
            {PARTNER_EXCHANGES.map((ex) => (
              <div
                key={ex.name}
                className="flex items-start gap-4 p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${ex.badge}`}>
                  {ex.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-0.5">{ex.name}</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{ex.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            We update this list when partnerships change. If you notice a link we haven&apos;t disclosed, please contact us.
          </p>
        </div>

        {/* Editorial principles */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            How we choose what to recommend
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Our editorial process starts with the user, not the commission rate. Before any exchange appears on CoinGlance, we evaluate it across four areas: regulatory status and jurisdiction licences, security practices and insurance, fee structure and transparency, and the quality of the user experience for beginners and advanced traders alike.
          </p>
          <div className="space-y-4">
            {PRINCIPLES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4.5 h-4.5 text-accent-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1">{title}</p>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works for you */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            What this means for you
          </h2>
          <div className="p-6 rounded-xl border border-accent-gold/25 bg-accent-gold/[0.04] space-y-3">
            {[
              "You pay the same fees you would signing up directly — affiliate commissions come from the exchange's budget, not yours.",
              "Our star ratings, rankings, and reviews are based on research, not on which exchange pays us more.",
              "We will always tell you when a link is an affiliate link. Every exchange button on this site is one.",
              "If we ever stop trusting an exchange, we remove the partnership before the link — not after.",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent-gold font-bold text-xs">{i + 1}</span>
                </div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial integrity */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Our editorial integrity promise
          </h2>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
            CoinGlance&apos;s value to you depends entirely on you trusting us. The moment our recommendations become influenced by commission rates rather than merit, we become useless as a resource. We take that seriously.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
            Our team reviews exchanges independently of our partnerships team. Researchers who write our exchange content do not have visibility into the commercial terms of any affiliate deal. Ratings are updated when the facts change — not when a business relationship changes.
          </p>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            All price data, market data, and analytics on CoinGlance are free, unsponsored, and pulled directly from public APIs (CoinGecko, Binance, Alternative.me). No exchange pays to appear in our market data tables or influence the prices shown on this site.
          </p>
        </div>

        {/* Questions */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
          <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            Questions about this disclosure?
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
            If you have questions about our affiliate relationships, how we evaluate exchanges, or anything else on this page, we&apos;re happy to answer.
          </p>
          <a
            href="mailto:contact@coinglance.app"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            Contact us
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
