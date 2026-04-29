export interface BinanceMiniTicker {
  s: string; // symbol e.g. BTCUSDT
  c: string; // close (current) price
  o: string; // open price 24h ago
}

interface StreamMessage {
  stream: string;
  data: BinanceMiniTicker;
}

type TickerMap = Map<string, BinanceMiniTicker>;
type TickerCallback = (tickers: TickerMap) => void;

const WATCHED_SYMBOLS = [
  "btcusdt", "ethusdt", "solusdt", "bnbusdt", "xrpusdt",
  "adausdt", "dogeusdt", "avaxusdt", "dotusdt", "linkusdt",
];

const STREAMS = WATCHED_SYMBOLS.map(s => `${s}@miniTicker`).join("/");
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`;

export function subscribeToLiveTickers(callback: TickerCallback): () => void {
  let ws: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  const store = new Map<string, BinanceMiniTicker>();

  function connect() {
    if (stopped) return;
    ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const msg: StreamMessage = JSON.parse(event.data);
        if (msg.data) {
          store.set(msg.data.s, msg.data);
          callback(new Map(store));
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => ws?.close();

    ws.onclose = () => {
      if (!stopped) {
        retryTimer = setTimeout(connect, 5000);
      }
    };
  }

  connect();

  return () => {
    stopped = true;
    if (retryTimer) clearTimeout(retryTimer);
    ws?.close();
  };
}
