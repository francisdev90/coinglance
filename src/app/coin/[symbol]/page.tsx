import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, Heart } from "lucide-react";
import { getCoinDetails, getTopCoins, type CoinDetail } from "@/lib/api/coingecko";
import { getNewsItems } from "@/lib/api/news";
import { exchanges } from "@/lib/data/exchanges";
import CoinChart from "@/components/coin/CoinChart";
import CoinConverter from "@/components/coin/CoinConverter";
import FaqAccordion, { type FaqItem } from "@/components/coin/FaqAccordion";
import { CoinPriceHeader, CoinKeyStats } from "@/components/coin/CoinPriceDisplay";
import { cn } from "@/lib/utils";
import { formatPrice, formatLargeNumber, formatSupply, formatDate, stripHtml, getBadgeColor } from "@/lib/format";
import { timeAgo } from "@/lib/api/news";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const coins = await getTopCoins(100, "usd", 3600);
    return coins.map((c) => ({ symbol: c.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { symbol: string } }) {
  try {
    const coin = await getCoinDetails(params.symbol, 3600);
    const price = coin.market_data?.current_price?.usd ?? 0;
    const ch24  = coin.market_data?.price_change_percentage_24h_in_currency?.usd ?? 0;
    return {
      title: `${coin.name} (${coin.symbol.toUpperCase()}) Price Today — CoinGlance`,
      description: `${coin.name} live price is ${formatPrice(price)} with a 24h change of ${ch24 >= 0 ? "+" : ""}${ch24.toFixed(2)}%. View charts, key stats and buy on trusted exchanges.`,
    };
  } catch {
    return { title: "Coin — CoinGlance" };
  }
}

function buildFaqs(coin: CoinDetail): FaqItem[] {
  const md = coin.market_data;
  const mcap  = formatLargeNumber(md?.market_cap?.usd ?? 0);
  const vol   = formatLargeNumber(md?.total_volume?.usd ?? 0);
  const sym   = coin.symbol.toUpperCase();
  const name  = coin.name;
  const rank  = coin.market_cap_rank;
  const desc  = stripHtml(coin.description?.en ?? "").split(/\.[\s]/)[0];
  const circ  = md?.circulating_supply ?? 0;
  const maxSup = md?.max_supply ?? 0;

  return [
    {
      question: `What is ${name}?`,
      answer: `${name} (${sym}) is ranked #${rank} by market capitalisation with a current market cap of ${mcap}. ${desc}.`,
    },
    {
      question: `How can I buy ${name}?`,
      answer: `You can buy ${name} on several major exchanges: Binance (global, lowest fees), Bybit (great for derivatives), KuCoin (widest altcoin selection), and Coinbase (best for US users). If you're in Nigeria, South Africa, Kenya, or Malaysia, Luno is an excellent regulated option. Simply create an account, verify your identity, deposit funds, and place a market or limit buy order for ${sym}.`,
    },
    {
      question: `Is ${name} a good investment?`,
      answer: `Whether ${name} is a good investment depends on your financial goals and risk tolerance. Cryptocurrency is highly volatile. ${name} has a current market cap of ${mcap}, which reflects its market position. Always do your own research (DYOR), never invest more than you can afford to lose, and consider consulting a financial advisor. CoinGlance does not provide financial advice.`,
    },
    {
      question: `How is the ${name} price determined?`,
      answer: `The price of ${name} is determined by supply and demand on cryptocurrency exchanges worldwide. Key factors include: overall market sentiment, Bitcoin's price movement, protocol developments, regulatory news, macroeconomic factors, and social media activity. The current 24h trading volume of ${vol} reflects market activity.`,
    },
    {
      question: `Where can I store ${name} safely?`,
      answer: `You can store ${name} in several ways. Exchange wallets (like Binance or Coinbase) are convenient but carry counterparty risk. Software wallets give you control of your private keys. For maximum security, hardware wallets like Ledger or Trezor store your keys offline. Remember: not your keys, not your coins.`,
    },
    sym === "BTC"
      ? {
          question: "How many Bitcoin are left to mine?",
          answer: `Bitcoin has a hard-capped supply of 21 million BTC. As of today, approximately ${formatSupply(circ, "BTC")} are in circulation, meaning around ${formatSupply((maxSup || 21_000_000) - circ, "BTC")} remain to be mined. The final Bitcoin is estimated to be mined around 2140 due to the halving schedule.`,
        }
      : {
          question: `What is the difference between ${name} and Bitcoin?`,
          answer: `Bitcoin (BTC) is the original cryptocurrency, primarily used as a store of value. ${name} (${sym}) is a different asset with its own unique use case. Both can be purchased on the same exchanges, but they serve different purposes in a portfolio.`,
        },
  ];
}

function ExchangeCard({ exchange }: { exchange: typeof exchanges[0] }) {
  return (
    <div className={cn(
      "relative flex flex-col p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
      exchange.isFeatured
        ? "border-accent-gold/60 bg-accent-gold/[0.04] hover:shadow-accent-gold/10"
        : "border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:shadow-black/10 dark:hover:shadow-black/30"
    )}>
      {exchange.isFeatured && (
        <div className="absolute -top-3 left-3">
          <span className="px-2.5 py-0.5 text-xs font-bold bg-accent-gold text-bg-dark rounded-full uppercase tracking-wide">{exchange.badgeText}</span>
        </div>
      )}
      {!exchange.isFeatured && (
        <div className="mb-2">
          <span className="px-2 py-0.5 text-xs font-semibold bg-bg-light dark:bg-bg-dark text-text-secondary-light dark:text-text-secondary-dark rounded-full border border-border-light dark:border-border-dark">{exchange.badgeText}</span>
        </div>
      )}
      <div className={cn("flex items-center gap-2.5 mb-3", exchange.isFeatured && "mt-2")}>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0", exchange.badgeColor)}>
          {exchange.initial}
        </div>
        <div>
          <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">{exchange.name}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono">Fee: {exchange.takerFee}</p>
        </div>
      </div>
      <a
        href={exchange.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-auto w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
          exchange.isFeatured
            ? "bg-accent-gold text-bg-dark hover:bg-accent-gold/90 shadow-md shadow-accent-gold/25"
            : "border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-accent-gold hover:text-accent-gold"
        )}
      >
        Buy on {exchange.name} <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

const NEWS_GRADIENTS = [
  { grad: "from-orange-600/20 to-amber-500/10",   cat: "bg-accent-gold/10 text-accent-gold" },
  { grad: "from-blue-600/20 to-indigo-500/10",    cat: "bg-blue-500/10 text-blue-500" },
  { grad: "from-purple-600/20 to-violet-500/10",  cat: "bg-purple-500/10 text-purple-500" },
];

export default async function CoinPage({ params }: { params: { symbol: string } }) {
  let coin: CoinDetail;
  try {
    coin = await getCoinDetails(params.symbol, 30);
  } catch {
    notFound();
  }

  const md = coin.market_data;
  const price   = md?.current_price?.usd ?? 0;
  const ch1h    = md?.price_change_percentage_1h_in_currency?.usd ?? 0;
  const ch24h   = md?.price_change_percentage_24h_in_currency?.usd ?? 0;
  const ch7d    = md?.price_change_percentage_7d_in_currency?.usd ?? 0;
  const mcap    = md?.market_cap?.usd ?? 0;
  const vol24h  = md?.total_volume?.usd ?? 0;
  const circ    = md?.circulating_supply ?? 0;
  const total   = md?.total_supply ?? null;
  const maxSup  = md?.max_supply ?? null;
  const ath     = md?.ath?.usd ?? 0;
  const athDate = md?.ath_date?.usd ?? "";
  const sym     = coin.symbol.toUpperCase();
  const rank    = coin.market_cap_rank;
  const badgeColor = getBadgeColor(rank ?? 99);
  const categories = (coin.categories ?? []).filter(Boolean).slice(0, 5);

  const descRaw = stripHtml(coin.description?.en ?? "");
  const descParagraphs = descRaw.split(/\n+/).filter((p) => p.trim().length > 40).slice(0, 4);

  const faqs = buildFaqs(coin);

  // Fetch related coins and news in parallel
  const [relatedRaw, newsArticles] = await Promise.all([
    getTopCoins(20, "usd", 300).catch(() => [] as Awaited<ReturnType<typeof getTopCoins>>),
    getNewsItems(coin.name).then((items) => items.slice(0, 3)).catch(() => []),
  ]);
  const relatedCoins = relatedRaw.filter((c) => c.id !== coin.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",  "item": "https://coinglance.app/" },
          { "@type": "ListItem", "position": 2, "name": "Coins", "item": "https://coinglance.app/coins" },
          { "@type": "ListItem", "position": 3, "name": coin.name, "item": `https://coinglance.app/coin/${coin.id}` },
        ],
      },
      {
        "@type": "FinancialProduct",
        "name": `${coin.name} (${sym})`,
        "description": stripHtml(coin.description?.en ?? "").slice(0, 200) || `${coin.name} live price, market cap, and chart data.`,
        "url": `https://coinglance.app/coin/${coin.id}`,
        "image": coin.image?.large ?? "",
        "offers": {
          "@type": "Offer",
          "price": price.toString(),
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/coins" className="hover:text-accent-gold transition-colors">Coins</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">{coin.name}</span>
        </nav>

        {/* 2. Coin Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {coin.image?.large
              ? <Image src={coin.image.large} alt={coin.name} width={64} height={64} className="rounded-full flex-shrink-0" unoptimized />
              : <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0", badgeColor)}>{sym.slice(0, 2)}</div>
            }
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{coin.name}</h1>
                <span className="text-sm font-mono font-bold text-text-secondary-light dark:text-text-secondary-dark">{sym}</span>
                {rank && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-bg-card-light dark:bg-bg-card-dark border border-border-light dark:border-border-dark rounded-full text-text-secondary-light dark:text-text-secondary-dark">
                    Rank #{rank}
                  </span>
                )}
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {categories.map((cat) => (
                    <span key={cat} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-gold/10 text-accent-gold">{cat}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="p-2.5 rounded-xl border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-danger hover:border-danger/40 transition-colors flex-shrink-0" aria-label="Add to watchlist">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Price Display — client component for currency switching */}
        <CoinPriceHeader usdPrice={price} ch1h={ch1h} ch24h={ch24h} ch7d={ch7d} />

        {/* 4. Chart */}
        <CoinChart coinId={coin.id} />

        {/* 5. Key Stats — client component for currency switching */}
        <CoinKeyStats
          usdMcap={mcap}
          usdVolume={vol24h}
          circulatingSupply={circ}
          totalSupply={total}
          maxSupply={maxSup}
          ath={ath}
          athDate={athDate ? formatDate(athDate) : "—"}
          rank={rank}
          coinSymbol={sym}
        />

        {/* 6. Buy Section */}
        <div className="rounded-2xl border border-accent-gold/25 bg-gradient-to-br from-accent-gold/[0.07] to-accent-gold/[0.03] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Buy {coin.name} Now</h2>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">Compare top exchanges. All verified safe and regulated.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {exchanges.map((ex) => (
              <ExchangeCard key={ex.id} exchange={ex} />
            ))}
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-accent-gold/10">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              When you sign up through our links, we earn a commission. You pay nothing extra. We only recommend exchanges we trust.
            </p>
            <Link
              href="/affiliate-disclosure"
              className="text-xs font-semibold text-accent-gold/70 hover:text-accent-gold transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Affiliate disclosure →
            </Link>
          </div>
        </div>

        {/* 7. About */}
        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
          <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider mb-4">About {coin.name}</h2>
          <div className="space-y-4">
            {descParagraphs.length > 0
              ? descParagraphs.map((p, i) => (
                  <p key={i} className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{p}</p>
                ))
              : <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">No description available.</p>
            }
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {categories.map((cat) => (
                <span key={cat} className="px-3 py-1 text-xs font-semibold rounded-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">{cat}</span>
              ))}
            </div>
          )}
        </div>

        {/* 8. Related Coins */}
        {relatedCoins.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCoins.map((rc) => {
                const rcCh24 = rc.price_change_percentage_24h_in_currency ?? rc.price_change_percentage_24h ?? 0;
                return (
                  <Link
                    key={rc.id}
                    href={`/coin/${rc.id}`}
                    className="group p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      {rc.image
                        ? <Image src={rc.image} alt={rc.name} width={32} height={32} className="rounded-full flex-shrink-0" unoptimized />
                        : <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", getBadgeColor(rc.market_cap_rank ?? 99))}>{rc.symbol.slice(0, 2).toUpperCase()}</div>
                      }
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate group-hover:text-accent-gold transition-colors">{rc.name}</p>
                        <p className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{rc.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{formatPrice(rc.current_price)}</p>
                    <p className={cn("font-mono text-xs font-bold mt-0.5", rcCh24 >= 0 ? "text-success" : "text-danger")}>
                      {rcCh24 >= 0 ? "+" : ""}{rcCh24.toFixed(2)}%
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 9. News */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
              Latest {coin.name} News
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {newsArticles.length > 0
              ? newsArticles.map((article, i) => {
                  const g = NEWS_GRADIENTS[i % NEWS_GRADIENTS.length];
                  return (
                    <a
                      key={article.url}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cursor-pointer rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                    >
                      <div className={cn("h-24 bg-gradient-to-br border-b border-border-light dark:border-border-dark", g.grad)} />
                      <div className="p-4">
                        <span className={cn("inline-block px-2 py-0.5 text-xs font-bold rounded mb-2", g.cat)}>
                          {article.category}
                        </span>
                        <p className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark leading-snug group-hover:text-accent-gold transition-colors">
                          {article.title}
                        </p>
                        <p className="mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          {article.source} · {timeAgo(article.publishedAt)}
                        </p>
                      </div>
                    </a>
                  );
                })
              : (
                <div className="col-span-3 flex flex-col items-center justify-center py-10 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-center gap-2">
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">News temporarily unavailable</p>
                </div>
              )
            }
          </div>
        </div>

        {/* 10. Converter + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CoinConverter
              coinSymbol={sym}
              currentPrice={price}
            />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider mb-4">Frequently Asked Questions</h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </div>

      </div>
      <Footer />
    </div>
    </>
  );
}
