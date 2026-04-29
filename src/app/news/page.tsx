"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ExternalLink, Clock, Tag, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/api/news";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  thumbnail: string;
  category: string;
  publishedTs: number;
}

const SOURCES = ["All", "CoinDesk", "Cointelegraph", "Decrypt", "Bitcoin Magazine", "CryptoNews"];
const CATEGORIES = ["All", "Bitcoin", "Ethereum", "DeFi", "NFT", "Regulation", "Altcoins", "Crypto"];

const CATEGORY_COLORS: Record<string, string> = {
  Bitcoin:    "bg-orange-500/10 text-orange-500",
  Ethereum:   "bg-indigo-500/10 text-indigo-400",
  DeFi:       "bg-emerald-500/10 text-emerald-500",
  NFT:        "bg-pink-500/10 text-pink-500",
  Regulation: "bg-red-500/10 text-red-500",
  Altcoins:   "bg-purple-500/10 text-purple-500",
  Crypto:     "bg-accent-gold/10 text-accent-gold",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Bitcoin:    "from-orange-600/30 via-amber-500/15 to-transparent",
  Ethereum:   "from-blue-600/30 via-indigo-500/15 to-transparent",
  DeFi:       "from-emerald-600/30 via-green-500/15 to-transparent",
  NFT:        "from-pink-600/30 via-rose-500/15 to-transparent",
  Regulation: "from-red-600/30 via-orange-500/15 to-transparent",
  Altcoins:   "from-purple-600/30 via-violet-500/15 to-transparent",
  Crypto:     "from-amber-600/30 via-yellow-500/15 to-transparent",
};

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden hover:border-accent-gold/30 hover:shadow-lg transition-all duration-200 group"
    >
      <div className={cn(
        "relative h-44 overflow-hidden flex-shrink-0 bg-gradient-to-br",
        CATEGORY_GRADIENTS[item.category] ?? CATEGORY_GRADIENTS.Crypto
      )}>
        {item.thumbnail && !imgError && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.Crypto)}>
            {item.category}
          </span>
          <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono truncate max-w-[100px]">{item.source}</span>
        </div>
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-gold transition-colors line-clamp-2 leading-snug mb-2 flex-1"
        >
          {item.title}
        </Link>
        {item.description && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-light dark:border-border-dark">
          <span className="flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <Clock className="w-3 h-3" />
            {timeAgo(item.publishedAt)}
          </span>
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
          >
            Read <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden">
      <div className="h-44 animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
          <div className="h-5 w-20 rounded-full animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
        </div>
        <div className="h-4 w-full rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="h-4 w-4/5 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="h-3 w-full rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
        <div className="h-3 w-3/4 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeSource, setActiveSource] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchNews = useCallback(async () => {
    const res = await fetch("/api/news");
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data as NewsItem[];
  }, []);

  useEffect(() => {
    fetchNews()
      .then((data) => {
        setNews(data);
      })
      .finally(() => setLoading(false));
  }, [fetchNews]);

  const filtered = useMemo(() => {
    let list = news;
    if (activeSource !== "All") list = list.filter((n) => n.source.toLowerCase().includes(activeSource.toLowerCase()));
    if (activeCategory !== "All") list = list.filter((n) => n.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return list;
  }, [news, activeSource, activeCategory, query]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-accent-gold" />
            Crypto News
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {loading ? "Loading latest headlines…" : `${news.length} articles · Live from top crypto sources`}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="text"
            placeholder="Search headlines…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-sm text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark outline-none focus:border-accent-gold/60 transition-colors"
          />
        </div>

        {/* Source filter */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SOURCES.map((src) => (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                activeSource === src
                  ? "bg-accent-gold text-bg-dark shadow-sm"
                  : "border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
              )}
            >
              {src}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 mb-7">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                activeCategory === cat
                  ? "bg-accent-navy text-accent-gold border border-accent-gold/30"
                  : "border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
              )}
            >
              {cat !== "All" && <Tag className="w-2.5 h-2.5" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}{query || activeSource !== "All" || activeCategory !== "All" ? " matching your filters" : ""}
          </p>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 12 }, (_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
            ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">No articles match your filters.</p>
                <button
                  onClick={() => { setQuery(""); setActiveSource("All"); setActiveCategory("All"); }}
                  className="mt-3 text-sm text-accent-gold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )
            : filtered.map((item, i) => <NewsCard key={item.id || `${item.url}-${i}`} item={item} index={i} />)
          }
        </div>

      </div>

      <Footer />
    </div>
  );
}
