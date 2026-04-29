"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from "react";

export type CurrencyCode =
  | "USD" | "NGN" | "EUR" | "GBP" | "KES" | "GHS"
  | "ZAR" | "INR" | "JPY" | "CAD" | "AUD" | "BRL";

export const CURRENCY_META: Record<CurrencyCode, {
  label: string; symbol: string; cgId: string; flag: string;
}> = {
  USD: { label: "US Dollar",        symbol: "$",   cgId: "usd", flag: "🇺🇸" },
  NGN: { label: "Nigerian Naira",   symbol: "₦",   cgId: "ngn", flag: "🇳🇬" },
  EUR: { label: "Euro",             symbol: "€",   cgId: "eur", flag: "🇪🇺" },
  GBP: { label: "British Pound",    symbol: "£",   cgId: "gbp", flag: "🇬🇧" },
  KES: { label: "Kenyan Shilling",  symbol: "KSh", cgId: "kes", flag: "🇰🇪" },
  GHS: { label: "Ghanaian Cedi",    symbol: "₵",   cgId: "ghs", flag: "🇬🇭" },
  ZAR: { label: "South African Rand", symbol: "R", cgId: "zar", flag: "🇿🇦" },
  INR: { label: "Indian Rupee",     symbol: "₹",   cgId: "inr", flag: "🇮🇳" },
  JPY: { label: "Japanese Yen",     symbol: "¥",   cgId: "jpy", flag: "🇯🇵" },
  CAD: { label: "Canadian Dollar",  symbol: "C$",  cgId: "cad", flag: "🇨🇦" },
  AUD: { label: "Australian Dollar", symbol: "A$", cgId: "aud", flag: "🇦🇺" },
  BRL: { label: "Brazilian Real",   symbol: "R$",  cgId: "brl", flag: "🇧🇷" },
};

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,    NGN: 1620,  EUR: 0.92,  GBP: 0.79,
  KES: 129,  GHS: 15.5,  ZAR: 18.6,  INR: 83.5,
  JPY: 149,  CAD: 1.36,  AUD: 1.52,  BRL: 4.97,
};

// Currencies that should never show decimal places
const ZERO_DECIMAL_CURRENCIES = new Set<CurrencyCode>(["JPY"]);

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  symbol: string;
  flag: string;
  cgId: string;
  rates: Record<CurrencyCode, number>;
  convert: (usdPrice: number) => number;
  isJPY: boolean;
  noDecimals: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  symbol: "$",
  flag: "🇺🇸",
  cgId: "usd",
  rates: FALLBACK_RATES,
  convert: (p) => p,
  isJPY: false,
  noDecimals: false,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency") as CurrencyCode | null;
    // Also check old key for backward compat
    const savedOld = localStorage.getItem("ct_currency") as CurrencyCode | null;
    const val = saved ?? savedOld;
    if (val && val in CURRENCY_META) setCurrencyState(val as CurrencyCode);
  }, []);

  useEffect(() => {
    const ids = Object.values(CURRENCY_META)
      .map((m) => m.cgId)
      .filter((id) => id !== "usd")
      .join(",");

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd,${ids}`)
      .then((r) => r.json())
      .then((data) => {
        const t = data?.tether ?? {};
        const next = { ...FALLBACK_RATES } as Record<CurrencyCode, number>;
        for (const [code, meta] of Object.entries(CURRENCY_META) as [CurrencyCode, typeof CURRENCY_META[CurrencyCode]][]) {
          if (code !== "USD" && t[meta.cgId] != null) {
            next[code] = t[meta.cgId] as number;
          }
        }
        setRates(next);
      })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("preferred_currency", c);
  }, []);

  const meta = CURRENCY_META[currency];
  const noDecimals = ZERO_DECIMAL_CURRENCIES.has(currency);

  const convert = useCallback(
    (usdPrice: number) => usdPrice * rates[currency],
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      symbol: meta.symbol,
      flag: meta.flag,
      cgId: meta.cgId,
      rates,
      convert,
      isJPY: noDecimals,
      noDecimals,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
