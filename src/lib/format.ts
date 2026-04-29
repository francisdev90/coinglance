export function formatPrice(
  price: number,
  currencySymbol = "$",
  isJPY = false
): string {
  if (!price && price !== 0) return "—";
  if (isJPY) return currencySymbol + Math.round(price).toLocaleString("en-US");
  if (price >= 10000) return currencySymbol + Math.round(price).toLocaleString("en-US");
  if (price >= 1) return currencySymbol + price.toFixed(2);
  if (price >= 0.001) return currencySymbol + price.toFixed(4);
  return currencySymbol + price.toFixed(8);
}

export function formatLargeNumber(
  val: number,
  currencySymbol = "$"
): string {
  if (!val && val !== 0) return "—";
  if (val >= 1e12) return currencySymbol + (val / 1e12).toFixed(2) + "T";
  if (val >= 1e9) return currencySymbol + (val / 1e9).toFixed(1) + "B";
  if (val >= 1e6) return currencySymbol + (val / 1e6).toFixed(0) + "M";
  return currencySymbol + val.toLocaleString("en-US");
}

export function formatSupply(amount: number, symbol: string): string {
  if (!amount) return "—";
  if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "B " + symbol;
  if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M " + symbol;
  return amount.toLocaleString("en-US") + " " + symbol;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function getBadgeColor(rank: number): string {
  const colors = [
    "bg-orange-500", "bg-indigo-500", "bg-purple-600", "bg-emerald-600",
    "bg-yellow-500", "bg-sky-500", "bg-blue-600", "bg-yellow-600",
    "bg-blue-700", "bg-red-500", "bg-green-600", "bg-pink-500",
    "bg-teal-500", "bg-cyan-600", "bg-violet-500", "bg-rose-500",
    "bg-lime-600", "bg-amber-600", "bg-fuchsia-500", "bg-orange-600",
  ];
  return colors[(rank - 1) % colors.length];
}
