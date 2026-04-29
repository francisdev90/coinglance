"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors"
          >
            <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              {faq.question}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 flex-shrink-0 text-text-secondary-light dark:text-text-secondary-dark transition-transform duration-200",
                open === i && "rotate-180 text-accent-gold"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              open === i ? "max-h-96" : "max-h-0"
            )}
          >
            <p className="px-5 pb-5 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
