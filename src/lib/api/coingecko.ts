const BASE = "https://api.coingecko.com/api/v3";

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_date: string;
  atl: number;
  atl_date: string;
  sparkline_in_7d: { price: number[] } | null;
  last_updated: string;
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_1h_in_currency: Record<string, number>;
    price_change_percentage_24h_in_currency: Record<string, number>;
    price_change_percentage_7d_in_currency: Record<string, number>;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_date: Record<string, string>;
    market_cap_rank: number;
  };
  description: { en: string };
  categories: string[];
  market_cap_rank: number;
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    data?: {
      price: string;
      price_change_percentage_24h?: Record<string, number>;
    };
  };
}

async function cgFetch<T>(
  path: string,
  revalidate?: number
): Promise<T> {
  const opts: RequestInit & { next?: { revalidate?: number | false } } = {
    headers: { Accept: "application/json" },
  };
  if (revalidate !== undefined) opts.next = { revalidate };
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}: ${path}`);
  return res.json();
}

export async function getTopCoins(
  limit = 100,
  currency = "usd",
  revalidate = 60
): Promise<CoinMarket[]> {
  return cgFetch<CoinMarket[]>(
    `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h%2C7d`,
    revalidate
  );
}

export async function getCoinDetails(
  coinId: string,
  revalidate = 30
): Promise<CoinDetail> {
  return cgFetch<CoinDetail>(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    revalidate
  );
}

export async function getCoinMarketChart(
  coinId: string,
  days: number | "max",
  currency = "usd"
): Promise<{ prices: [number, number][] }> {
  return cgFetch<{ prices: [number, number][] }>(
    `/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
    0
  );
}

export async function getTrendingCoins(
  revalidate = 300
): Promise<{ coins: TrendingCoin[] }> {
  return cgFetch<{ coins: TrendingCoin[] }>("/search/trending", revalidate);
}

export async function getGlobalMarketData(
  revalidate = 60
): Promise<GlobalData> {
  return cgFetch<GlobalData>("/global", revalidate);
}

export async function getExchangeRates(
  currencies: string[],
  revalidate = 3600
): Promise<Record<string, number>> {
  const ids = "tether";
  const vsCurrencies = currencies.join("%2C");
  type PriceResp = Record<string, Record<string, number>>;
  const data = await cgFetch<PriceResp>(
    `/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}`,
    revalidate
  );
  const rates: Record<string, number> = { usd: 1 };
  for (const cur of currencies) {
    if (cur !== "usd") rates[cur] = data?.tether?.[cur] ?? null;
  }
  return rates;
}
