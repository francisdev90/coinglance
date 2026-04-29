"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useCurrency, CURRENCY_META, type CurrencyCode } from "@/contexts/CurrencyContext";

interface Props {
  coinSymbol: string;
  currentPrice: number; // always in USD
}

const CONVERTER_CURRENCIES: CurrencyCode[] = ["USD", "NGN", "EUR", "GBP"];

export default function CoinConverter({ coinSymbol, currentPrice }: Props) {
  const { rates } = useCurrency();
  const [coinAmt, setCoinAmt] = useState("1");
  const [fiatAmt, setFiatAmt] = useState(currentPrice.toFixed(2));
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  const rate = rates[currency] ?? 1;
  const sym  = CURRENCY_META[currency].symbol;
  const priceInCur = currentPrice * rate;

  const handleCoin = useCallback((val: string) => {
    setCoinAmt(val);
    const n = parseFloat(val);
    if (!isNaN(n)) setFiatAmt((n * priceInCur).toFixed(2));
    else setFiatAmt("");
  }, [priceInCur]);

  const handleFiat = useCallback((val: string) => {
    setFiatAmt(val);
    const n = parseFloat(val);
    if (!isNaN(n) && priceInCur > 0) setCoinAmt((n / priceInCur).toPrecision(6));
    else setCoinAmt("");
  }, [priceInCur]);

  const handleCurrencySwitch = (cur: CurrencyCode) => {
    setCurrencyState(cur);
    const n = parseFloat(coinAmt);
    if (!isNaN(n)) setFiatAmt((n * currentPrice * (rates[cur] ?? 1)).toFixed(2));
  };

  const displayPrice = priceInCur >= 10000
    ? sym + Math.round(priceInCur).toLocaleString("en-US")
    : sym + priceInCur.toFixed(2);

  return (
    <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
          Quick Converter
        </h3>
        <div className="flex gap-1">
          {CONVERTER_CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencySwitch(c)}
              className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                currency === c
                  ? "bg-accent-gold text-bg-dark"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
          <input
            type="number"
            value={coinAmt}
            onChange={(e) => handleCoin(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm font-semibold text-text-primary-light dark:text-text-primary-dark outline-none min-w-0"
            placeholder="0"
          />
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0 font-mono">
            {coinSymbol}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark rotate-90" />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0 font-mono">{sym}</span>
          <input
            type="number"
            value={fiatAmt}
            onChange={(e) => handleFiat(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm font-semibold text-text-primary-light dark:text-text-primary-dark outline-none min-w-0"
            placeholder="0.00"
          />
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0 font-mono">{currency}</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
        1 {coinSymbol} = {displayPrice} · Rate refreshes live
      </p>
    </div>
  );
}
