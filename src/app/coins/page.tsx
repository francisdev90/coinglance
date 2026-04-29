import { type Metadata } from "next";
import { getTopCoins, type CoinMarket } from "@/lib/api/coingecko";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";
import CoinsTableClient from "@/components/sections/CoinsTableClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Cryptocurrencies — Live Prices",
  description: "Track live prices, market caps, and 24h changes for the top 100 cryptocurrencies. Sort, filter, and compare coins.",
};

export default async function CoinsPage() {
  const initialCoins = await getTopCoins(100, "usd", 60).catch(() => [] as CoinMarket[]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>
      <CoinsTableClient initialCoins={initialCoins} />
      <Footer />
    </div>
  );
}
