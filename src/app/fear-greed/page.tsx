import { Suspense } from "react";
import { getFearGreedIndex, getFearGreedHistory } from "@/lib/api/fearGreed";
import FearGreedClient from "./FearGreedClient";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const revalidate = 3600;

async function FearGreedContent() {
  const [current, history] = await Promise.all([
    getFearGreedIndex(),
    getFearGreedHistory(90),
  ]);
  return <FearGreedClient current={current} history={history} />;
}

export default function FearGreedPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>
      <Suspense fallback={<FearGreedSkeleton />}>
        <FearGreedContent />
      </Suspense>
      <Footer />
    </div>
  );
}

function FearGreedSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="h-8 w-64 rounded animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
      <div className="h-72 rounded-xl animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
      <div className="h-48 rounded-xl animate-pulse bg-black/[0.07] dark:bg-white/[0.07]" />
    </div>
  );
}
