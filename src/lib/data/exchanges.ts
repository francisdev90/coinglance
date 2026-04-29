export interface Exchange {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  badgeText: string;
  rating: number;
  totalUsers: string;
  makerFee: string;
  takerFee: string;
  minDeposit: string;
  supportedCountries: string[];
  pros: string[];
  cons: string[];
  affiliateLink: string;
  badgeColor: string;
  initial: string;
  isFeatured: boolean;
  isAfricaFocused?: boolean;
}

export const exchanges: Exchange[] = [
  {
    id: "binance",
    name: "Binance",
    slug: "binance",
    tagline: "World's Largest Crypto Exchange",
    description: "World's largest crypto exchange by trading volume with 180M+ users globally",
    badgeText: "Most Popular",
    rating: 4.8,
    totalUsers: "180M+",
    makerFee: "0.10%",
    takerFee: "0.10%",
    minDeposit: "$10",
    supportedCountries: ["Global (150+ countries)"],
    pros: [
      "Lowest spot fees in the industry",
      "Largest coin selection (350+)",
      "Advanced trading tools & futures",
      "Highest liquidity globally",
    ],
    cons: [
      "Complex UI for beginners",
      "Restricted in some US states",
    ],
    affiliateLink: "https://accounts.binance.com/register",
    badgeColor: "bg-yellow-500",
    initial: "B",
    isFeatured: true,
  },
  {
    id: "bybit",
    name: "Bybit",
    slug: "bybit",
    tagline: "Leading Derivatives Platform",
    description: "Leading derivatives and spot trading platform trusted by 20M+ traders worldwide",
    badgeText: "Best for Derivatives",
    rating: 4.6,
    totalUsers: "20M+",
    makerFee: "0.01%",
    takerFee: "0.06%",
    minDeposit: "$0",
    supportedCountries: ["Global (160+ countries)"],
    pros: [
      "Industry-low perpetual contract fees",
      "Strong derivatives market",
      "Copy trading feature",
    ],
    cons: [
      "Not available in the US",
      "Fewer spot pairs than Binance",
    ],
    affiliateLink: "https://www.bybit.com/en/sign-up/",
    badgeColor: "bg-yellow-400",
    initial: "By",
    isFeatured: false,
  },
  {
    id: "coinbase",
    name: "Coinbase",
    slug: "coinbase",
    tagline: "America's Most Trusted Exchange",
    description: "Fully regulated, trusted by 100M+ users — the easiest way to start buying crypto",
    badgeText: "Best for Beginners",
    rating: 4.4,
    totalUsers: "100M+",
    makerFee: "0.00%",
    takerFee: "0.05%",
    minDeposit: "$2",
    supportedCountries: ["United States", "EU", "United Kingdom", "Canada", "Australia"],
    pros: [
      "Fully regulated in all 50 US states",
      "Extremely beginner-friendly interface",
      "FDIC-insured USD balances",
      "Coinbase Card (spend crypto)",
    ],
    cons: [
      "Higher fees than competitors",
      "Fewer advanced trading features",
    ],
    affiliateLink: "https://www.coinbase.com/signup",
    badgeColor: "bg-blue-500",
    initial: "C",
    isFeatured: false,
  },
  {
    id: "kucoin",
    name: "KuCoin",
    slug: "kucoin",
    tagline: "The People's Exchange",
    description: "Over 700 cryptocurrencies — the widest altcoin selection of any major exchange",
    badgeText: "Widest Selection",
    rating: 4.5,
    totalUsers: "30M+",
    makerFee: "0.10%",
    takerFee: "0.10%",
    minDeposit: "$0",
    supportedCountries: ["Global (200+ countries)"],
    pros: [
      "700+ listed cryptocurrencies",
      "No KYC needed for small amounts",
      "Lending and earn products",
    ],
    cons: [
      "Not licensed in all jurisdictions",
      "Customer support can be slow",
    ],
    affiliateLink: "https://www.kucoin.com/ucenter/signup",
    badgeColor: "bg-green-500",
    initial: "K",
    isFeatured: false,
  },
  {
    id: "luno",
    name: "Luno",
    slug: "luno",
    tagline: "Africa & Europe's Trusted Exchange",
    description: "Trusted in Africa & Europe, simple interface, regulated across 40+ countries",
    badgeText: "Best for Africa & EU",
    rating: 4.3,
    totalUsers: "10M+",
    makerFee: "0.00%",
    takerFee: "0.10%",
    minDeposit: "$1",
    supportedCountries: ["Nigeria", "South Africa", "Kenya", "Ghana", "Malaysia", "UK", "EU"],
    pros: [
      "Regulated in 40+ countries incl. Nigeria & South Africa",
      "Supports NGN, ZAR, MYR and 12 more local currencies",
      "Extremely simple, beginner-friendly UI",
      "Very low minimum deposit ($1)",
    ],
    cons: [
      "Smaller coin selection (~50 coins)",
      "Not available in the United States",
    ],
    affiliateLink: "https://www.luno.com/en/signup",
    badgeColor: "bg-purple-600",
    initial: "L",
    isFeatured: false,
    isAfricaFocused: true,
  },
  {
    id: "mexc",
    name: "MEXC",
    slug: "mexc",
    tagline: "Up to 70% affiliate commission, 1,800+ coins",
    description: "Known for early listings of new coins, low fees, and accessible verification",
    badgeText: "New & Emerging Coins",
    rating: 4.3,
    totalUsers: "10M+",
    makerFee: "0.00%",
    takerFee: "0.05%",
    minDeposit: "$0",
    supportedCountries: ["Global (150+ countries)"],
    pros: [
      "Massive coin selection (1,800+)",
      "Very low fees (0.00% maker / 0.05% taker)",
      "No KYC required for small amounts",
      "Generous affiliate program (up to 70% commission)",
    ],
    cons: [
      "Less established brand than Binance",
      "Smaller liquidity on some pairs",
    ],
    affiliateLink: "https://www.mexc.com/register",
    badgeColor: "bg-blue-600",
    initial: "MX",
    isFeatured: false,
  },
];

export function getExchangeById(id: string): Exchange | undefined {
  return exchanges.find((e) => e.id === id);
}
