export interface Stock {
  symbol: string;      // Stock Code, e.g., "2330"
  name: string;        // Stock Name, e.g., "台積電"
  price: number;       // Current Price
  openPrice: number;   // Opening Price of the day (used to calculate change)
  change: number;      // Change amount
  changePercent: number; // Change percentage, e.g., 2.5 (%)
  volume: number;      // Cumulative Volume in lots (張)
  history: number[];   // History of recent prices (e.g., 15 points) for Sparkline
  category: string;    // Industry/Category, e.g., "半導體"
  marketCap: number;   // Market Capitalization in 億元 TWD
  peRatio: number;     // PE Ratio (本益比)
  dividendYield: number; // Dividend Yield (殖利率 %)
  high52Week: number;  // 52-Week High
  low52Week: number;   // 52-Week Low
  majorBuyPercent: number; // 主力買盤比例 (0-100)
}

export interface PinnedStock extends Stock {
  isPinned: boolean;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  stockName: string;
  targetPrice: number;
  condition: "above" | "below"; // Notify when price is >= or <= target Price
  isActive: boolean;
  createdAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[]; // List of stock symbols
  isDefault?: boolean; // Whether it is the default favorite watchlist
}

export interface UserProfile {
  email: string;
  name: string;
  watchlists: Watchlist[];
  alerts: PriceAlert[];
}

export interface TriggeredNotification {
  id: string;
  symbol: string;
  stockName: string;
  targetPrice: number;
  condition: "above" | "below";
  triggeredPrice: number;
  timestamp: string;
  isRead: boolean;
}
