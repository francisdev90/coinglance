import Link from "next/link";
import { ExternalLink, Shield, Zap, Globe, Star, Building2 } from "lucide-react";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

interface Exchange {
  name: string;
  slug: string;
  tagline: string;
  country: string;
  founded: number;
  fees: string;
  volume24h: string;
  coins: number;
  features: string[];
  highlight: string;
  badge?: string;
  url: string;
  color: string;
  initials: string;
}

const EXCHANGES: Exchange[] = [
  {
    name: "Binance",
    slug: "binance",
    tagline: "World's largest crypto exchange by volume",
    country: "Global (Cayman Islands)",
    founded: 2017,
    fees: "0.1% spot (reduced with BNB)",
    volume24h: "$40B+",
    coins: 600,
    features: ["Spot & Futures", "P2P Trading", "Staking", "NFT Marketplace", "Copy Trading"],
    highlight: "Highest liquidity, lowest fees with BNB",
    badge: "Most Popular",
    url: "https://www.binance.com",
    color: "#F0B90B",
    initials: "B",
  },
  {
    name: "Coinbase",
    slug: "coinbase",
    tagline: "The most trusted & easy-to-use US exchange",
    country: "United States",
    founded: 2012,
    fees: "0.5%–4.5% (Advanced: 0.05–0.6%)",
    volume24h: "$3B+",
    coins: 250,
    features: ["Beginner Friendly", "FDIC Insured USD", "Coinbase Earn", "Advanced Trade", "Custody"],
    highlight: "Best for US users & beginners",
    badge: "Most Trusted",
    url: "https://www.coinbase.com",
    color: "#0052FF",
    initials: "CB",
  },
  {
    name: "Kraken",
    slug: "kraken",
    tagline: "Secure, feature-rich exchange since 2011",
    country: "United States",
    founded: 2011,
    fees: "0.16%–0.26% maker/taker",
    volume24h: "$1.5B+",
    coins: 220,
    features: ["Spot & Margin", "Futures", "Staking", "OTC Desk", "NFTs"],
    highlight: "Best security track record",
    url: "https://www.kraken.com",
    color: "#5741D9",
    initials: "K",
  },
  {
    name: "Bybit",
    slug: "bybit",
    tagline: "Top derivatives exchange for professional traders",
    country: "Dubai, UAE",
    founded: 2018,
    fees: "0.01% maker / 0.06% taker",
    volume24h: "$8B+",
    coins: 500,
    features: ["Spot & Derivatives", "Copy Trading", "Bot Trading", "Earn", "NFT"],
    highlight: "Best for derivatives & copy trading",
    url: "https://www.bybit.com",
    color: "#F7A600",
    initials: "BY",
  },
  {
    name: "OKX",
    slug: "okx",
    tagline: "Comprehensive Web3 & trading platform",
    country: "Seychelles",
    founded: 2017,
    fees: "0.08% maker / 0.1% taker",
    volume24h: "$6B+",
    coins: 340,
    features: ["Spot & Futures", "DEX", "Web3 Wallet", "Earn", "NFT"],
    highlight: "Best Web3 & DeFi integration",
    url: "https://www.okx.com",
    color: "#000000",
    initials: "OK",
  },
  {
    name: "KuCoin",
    slug: "kucoin",
    tagline: "The People's Exchange — huge altcoin selection",
    country: "Seychelles",
    founded: 2017,
    fees: "0.1% spot (discounted with KCS)",
    volume24h: "$1B+",
    coins: 750,
    features: ["Spot & Margin", "Futures", "Bot Trading", "Lending", "P2P"],
    highlight: "Most altcoins, no KYC for basic use",
    url: "https://www.kucoin.com",
    color: "#24AE8F",
    initials: "KC",
  },
  {
    name: "Luno",
    slug: "luno",
    tagline: "Africa & Asia's leading regulated exchange",
    country: "United Kingdom / South Africa",
    founded: 2013,
    fees: "1% taker (maker: 0%)",
    volume24h: "$50M+",
    coins: 15,
    features: ["BTC, ETH, USDC, XRP", "NGN Deposits", "Mobile-First", "Instant Buy", "Savings Wallet"],
    highlight: "Best for Nigeria, SA & African markets",
    badge: "Best for Africa",
    url: "https://www.luno.com",
    color: "#0D6EFD",
    initials: "L",
  },
  {
    name: "Bitget",
    slug: "bitget",
    tagline: "Top copy trading and futures exchange",
    country: "Singapore",
    founded: 2018,
    fees: "0.02% maker / 0.06% taker",
    volume24h: "$4B+",
    coins: 800,
    features: ["Copy Trading", "Spot & Futures", "Launchpad", "Earn", "Bot"],
    highlight: "Best copy trading platform",
    url: "https://www.bitget.com",
    color: "#00C288",
    initials: "BG",
  },
  {
    name: "MEXC",
    slug: "mexc",
    tagline: "Early listings, low fees, 1,800+ coins",
    country: "Seychelles",
    founded: 2018,
    fees: "0.00% maker / 0.05% taker",
    volume24h: "$2B+",
    coins: 1800,
    features: ["Spot & Futures", "Launchpad", "Earn", "Copy Trading", "P2P"],
    highlight: "Most new coin listings, zero maker fee",
    badge: "New Coins",
    url: "https://www.mexc.com",
    color: "#1A73E8",
    initials: "MX",
  },
];

const FEATURE_ICONS: Record<string, string> = {
  "P2P Trading": "🤝",
  "Staking": "🔒",
  "Copy Trading": "📋",
  "NFT Marketplace": "🖼️",
  "NFT": "🖼️",
  "NFTs": "🖼️",
  "Futures": "📈",
  "Spot & Futures": "📊",
  "Beginner Friendly": "🌱",
  "Bot Trading": "🤖",
  "Web3 Wallet": "🔑",
  "DEX": "⚡",
  "Earn": "💰",
  "Lending": "🏦",
  "OTC Desk": "🏢",
};

function ExchangeCard({ ex }: { ex: Exchange }) {
  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark p-5 flex flex-col gap-4 hover:border-accent-gold/30 hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
      {/* Subtle color accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: ex.color }} />

      {ex.badge && (
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: ex.color + "22", color: ex.color }}>
            {ex.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
          style={{ background: ex.color }}
        >
          {ex.initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-gold transition-colors">{ex.name}</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-snug mt-0.5 line-clamp-2">{ex.tagline}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Volume</p>
          <p className="text-xs font-bold font-mono text-text-primary-light dark:text-text-primary-dark mt-0.5">{ex.volume24h}</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Coins</p>
          <p className="text-xs font-bold font-mono text-text-primary-light dark:text-text-primary-dark mt-0.5">{ex.coins}+</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] dark:bg-white/[0.03] p-2">
          <p className="text-[10px] uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Founded</p>
          <p className="text-xs font-bold font-mono text-text-primary-light dark:text-text-primary-dark mt-0.5">{ex.founded}</p>
        </div>
      </div>

      {/* Fees */}
      <div className="flex items-start gap-2 text-xs">
        <Zap className="w-3.5 h-3.5 text-accent-gold flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-text-secondary-light dark:text-text-secondary-dark">Fees: </span>
          <span className="text-text-primary-light dark:text-text-primary-dark font-mono">{ex.fees}</span>
        </div>
      </div>

      {/* Country */}
      <div className="flex items-center gap-2 text-xs">
        <Globe className="w-3.5 h-3.5 text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0" />
        <span className="text-text-secondary-light dark:text-text-secondary-dark">{ex.country}</span>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {ex.features.slice(0, 4).map((f) => (
          <span key={f} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">
            {FEATURE_ICONS[f] && <span className="mr-0.5">{FEATURE_ICONS[f]}</span>}{f}
          </span>
        ))}
      </div>

      {/* Highlight */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent-gold/5 border border-accent-gold/10">
        <Star className="w-3.5 h-3.5 text-accent-gold flex-shrink-0 mt-0.5" />
        <p className="text-xs text-accent-gold">{ex.highlight}</p>
      </div>

      {/* CTA */}
      <Link
        href={ex.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:opacity-90"
        style={{ background: ex.color + "18", color: ex.color, border: `1px solid ${ex.color}33` }}
      >
        Visit {ex.name}
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function ExchangesPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <Building2 className="w-7 h-7 text-accent-gold" />
            Crypto Exchanges
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Compare the world&apos;s top cryptocurrency exchanges — fees, features, and which one is right for you.
          </p>
        </div>

        {/* Trust notice */}
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
          <Shield className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            All exchanges listed are established and widely used platforms. Always do your own research and never invest more than you can afford to lose.
            Exchange data (fees, volume) is approximate and may change — verify on each platform before trading.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXCHANGES.map((ex) => (
            <ExchangeCard key={ex.slug} ex={ex} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
          CoinGlance is not affiliated with any exchange listed above. External links are provided for informational purposes only.
          Cryptocurrency trading involves significant risk.{" "}
          <Link href="/affiliate-disclosure" className="text-accent-gold hover:underline">Affiliate Disclosure</Link>
        </p>
      </div>

      <Footer />
    </div>
  );
}
