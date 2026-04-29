"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo, type NewsItem } from "@/lib/api/news";

const GRADIENT_PAIRS = [
  { from: "from-orange-600/25", to: "to-amber-500/10", cls: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { from: "from-blue-600/25",   to: "to-indigo-500/10", cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { from: "from-purple-600/25", to: "to-violet-500/10", cls: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
];

interface Props {
  items: NewsItem[];
}

export default function NewsPreview({ items }: Props) {
  const articles = items.slice(0, 3);

  return (
    <section className="py-16 bg-bg-light dark:bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Market News
            </h2>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors duration-200">
              View all news
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-center gap-3">
              <Newspaper className="w-8 h-8 text-text-secondary-light dark:text-text-secondary-dark opacity-50" />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                News temporarily unavailable
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.map((article, index) => {
                const g = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
                return (
                  <motion.article
                    key={article.url}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group cursor-pointer rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-all duration-200"
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <div className={cn("h-36 bg-gradient-to-br border-b border-border-light dark:border-border-dark", g.from, g.to)} />
                      <div className="p-5">
                        <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide mb-3", g.cls)}>
                          {article.category}
                        </span>
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark leading-snug group-hover:text-accent-gold transition-colors duration-200">
                          {article.title}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          <span className="font-semibold">{article.source}</span>
                          <span>·</span>
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(article.publishedAt)}</span>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
