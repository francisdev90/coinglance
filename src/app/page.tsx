import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import DailyBriefing from "@/components/sections/DailyBriefing";
import MarketStats from "@/components/sections/MarketStats";
import TopCoinsTable from "@/components/sections/TopCoinsTable";
import FeaturedExchanges from "@/components/sections/FeaturedExchanges";
import NewsPreview from "@/components/sections/NewsPreview";
import DailyStreak from "@/components/features/DailyStreak";
import { getGlobalMarketData } from "@/lib/api/coingecko";
import { getFearGreedIndex } from "@/lib/api/fearGreed";
import { getNewsItems } from "@/lib/api/news";

export const revalidate = 60;

export default async function Home() {
  const [globalData, fearGreed, newsItems] = await Promise.all([
    getGlobalMarketData(60).catch(() => null),
    getFearGreedIndex().catch(() => null),
    getNewsItems().catch(() => []),
  ]);

  const totalCoins = globalData?.data?.active_cryptocurrencies ?? null;

  return (
    <>
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>
      <main>
        <Hero totalCoins={totalCoins} />
        <DailyBriefing />
        <MarketStats initialGlobal={globalData} initialFearGreed={fearGreed} />
        <TopCoinsTable />
        <FeaturedExchanges />
        <NewsPreview items={newsItems} />
      </main>
      <Footer />
      <DailyStreak />
    </>
  );
}
