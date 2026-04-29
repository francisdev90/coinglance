export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export async function getFearGreedIndex(): Promise<FearGreedData> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1", {
    next: { revalidate: 3600 },
  } as RequestInit & { next?: { revalidate?: number } });
  if (!res.ok) throw new Error(`Fear & Greed API ${res.status}`);
  const json = await res.json();
  return json.data[0] as FearGreedData;
}

export async function getFearGreedHistory(limit = 90): Promise<FearGreedData[]> {
  const res = await fetch(`https://api.alternative.me/fng/?limit=${limit}&format=json`, {
    next: { revalidate: 3600 },
  } as RequestInit & { next?: { revalidate?: number } });
  if (!res.ok) throw new Error(`Fear & Greed API ${res.status}`);
  const json = await res.json();
  return (json.data ?? []) as FearGreedData[];
}
