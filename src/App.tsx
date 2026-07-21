import React, { useState, useEffect, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download, 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Clock, 
  Plus, 
  Check, 
  Star,
  Layers,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import { Stock, UserProfile, TriggeredNotification, Watchlist, PriceAlert } from "./types";
import { generate200Stocks, simulateTick } from "./data/stocks";
import StockSearchBox from "./components/StockSearchBox";
import PinnedStocksGrid from "./components/PinnedStocksGrid";
import StockRow from "./components/StockRow";

// Advanced custom components
import AdvancedFilters, { FilterParams } from "./components/AdvancedFilters";
import UserProfileManager from "./components/UserProfileManager";
import WatchlistAndAlertPanel from "./components/WatchlistAndAlertPanel";
import TriggeredNotificationToast from "./components/TriggeredNotificationToast";
import NotificationFeed from "./components/NotificationFeed";
import StockChartWindow from "./components/StockChartWindow";

// Native Audio Synth Chime
import { playAlertChime } from "./utils/audio";

// Helper to check if Taiwan Stock Market is open (Mon-Fri, 09:00 - 13:30 Taipei Time)
function isTaiwanMarketOpen(): boolean {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find(p => p.type === "weekday")?.value;
    const hourStr = parts.find(p => p.type === "hour")?.value;
    const minuteStr = parts.find(p => p.type === "minute")?.value;

    if (!weekday || !hourStr || !minuteStr) return false;

    const isWeekday = weekday !== "Saturday" && weekday !== "Sunday";
    if (!isWeekday) return false;

    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const minutes = hour * 60 + minute;
    const start = 9 * 60; // 09:00
    const end = 13 * 60 + 30; // 13:30

    return minutes >= start && minutes <= end;
  } catch (e) {
    const utcDay = now.getUTCDay();
    const isUtcWeekday = utcDay >= 1 && utcDay <= 5;
    if (!isUtcWeekday) return false;

    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const minutes = utcHour * 60 + utcMinute;

    return minutes >= 60 && minutes <= (5 * 60 + 30);
  }
}

export default function App() {
  // 1. Initial Core States
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [pinnedSymbols, setPinnedSymbols] = useState<string[]>(["IX0001", "2330", "3481", "3231"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [selectedChartStock, setSelectedChartStock] = useState<Stock | null>(null);
  const [standaloneSymbol, setStandaloneSymbol] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("symbol");
  });

  const handleViewChart = (symbol: string) => {
    const targetStock = stocksRef.current.find((s) => s.symbol === symbol);
    if (targetStock) {
      setSelectedChartStock(targetStock);
    }
  };

  // Advanced Filtering State
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    category: "全部",
    marketCap: "all",
    volume: "all",
    peRatio: "all",
    dividendYield: "all"
  });

  // Sorting State (expanded options)
  const [sortBy, setSortBy] = useState<string>("changePercentDesc");

  // Multi-user & Watchlists & Alerts State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>(["ethan94003@gmail.com"]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>("default");
  const [isSimulatedEmailEnabled, setIsSimulatedEmailEnabled] = useState(true);
  const [notifications, setNotifications] = useState<TriggeredNotification[]>([]);

  // Keep a ref to stocks for use inside the timer interval to avoid closure issues
  const stocksRef = useRef(stocks);
  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  // Load real-time stocks from backend
  const fetchStocksFromAPI = async () => {
    try {
      const res = await fetch("/api/stocks");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStocks(data);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch real-time stocks:", err);
    }
    
    // Fallback to offline generation if API is not available/failed
    setStocks((current) => {
      if (current.length === 0) {
        return generate200Stocks();
      }
      return current;
    });
  };

  // Initialize stocks on load
  useEffect(() => {
    fetchStocksFromAPI();
  }, []);

  // Live Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("zh-TW", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const dateVal = String(now.getDate()).padStart(2, "0");
      const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      const weekday = weekdays[now.getDay()];
      setCurrentDate(`${year}-${month}-${dateVal} (${weekday})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-Refresh: Automatically and continuously update in background (with simulation support when closed)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let secondsSinceLastFetch = 0;

    const tick = () => {
      secondsSinceLastFetch++;
      if (secondsSinceLastFetch >= 5) {
        fetchStocksFromAPI();
        secondsSinceLastFetch = 0;
      }
    };

    // Run tick checker every second
    timer = setInterval(tick, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  // Seeding Default profile and loading state on startup
  useEffect(() => {
    const saved = localStorage.getItem("tw_stock_profiles");
    let profilesList: UserProfile[] = [];
    if (saved) {
      try {
        profilesList = JSON.parse(saved);
      } catch (e) {
        profilesList = [];
      }
    }

    // Seed default profile for ethan94003@gmail.com if not present
    const ethanEmail = "ethan94003@gmail.com";
    let ethanProfile = profilesList.find(p => p.email === ethanEmail);

    if (!ethanProfile) {
      ethanProfile = {
        email: ethanEmail,
        name: "Ethan",
        watchlists: [
          { id: "default", name: "預設最愛 ⭐", symbols: ["IX0001", "2330", "3481", "3231", "2454"], isDefault: true },
          { id: "ai", name: "AI概念特選 🤖", symbols: ["2330", "2317", "2382", "3231", "2376"] },
          { id: "dividend", name: "高殖利率精選 💰", symbols: ["3045", "1216", "2303", "3702"] }
        ],
        alerts: [
          { id: "al-1", symbol: "2330", stockName: "台積電", targetPrice: 1000, condition: "above", isActive: true, createdAt: new Date().toISOString() },
          { id: "al-2", symbol: "2454", stockName: "聯發科", targetPrice: 1300, condition: "below", isActive: true, createdAt: new Date().toISOString() },
          { id: "al-3", symbol: "2317", stockName: "鴻海", targetPrice: 195, condition: "above", isActive: true, createdAt: new Date().toISOString() }
        ]
      };
      profilesList.push(ethanProfile);
      localStorage.setItem("tw_stock_profiles", JSON.stringify(profilesList));
    }

    setRegisteredEmails(profilesList.map(p => p.email));

    // Determine logged in email
    const loggedInEmail = localStorage.getItem("tw_stock_logged_in_email") || ethanEmail;
    const activeProf = profilesList.find(p => p.email === loggedInEmail) || ethanProfile;
    setCurrentUser(activeProf);
    
    // Load notifications
    const storedNotifs = localStorage.getItem("tw_stock_notifications");
    if (storedNotifs) {
      try {
        setNotifications(JSON.parse(storedNotifs));
      } catch (e) {
        setNotifications([]);
      }
    }
  }, []);

  // Save profile helper
  const saveProfileToStorage = (profile: UserProfile) => {
    const saved = localStorage.getItem("tw_stock_profiles");
    let list: UserProfile[] = [];
    if (saved) {
      list = JSON.parse(saved);
    }
    const index = list.findIndex(p => p.email === profile.email);
    if (index !== -1) {
      list[index] = profile;
    } else {
      list.push(profile);
    }
    localStorage.setItem("tw_stock_profiles", JSON.stringify(list));
    localStorage.setItem("tw_stock_logged_in_email", profile.email);
  };

  // Alert Trigger Monitor Engine
  const prevStocksPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (stocks.length === 0 || !currentUser) return;

    const activeAlerts = currentUser.alerts.filter(al => al.isActive);
    if (activeAlerts.length === 0) return;

    let alertTriggered = false;
    const triggeredList: TriggeredNotification[] = [];
    const updatedAlerts = currentUser.alerts.map(al => {
      if (!al.isActive) return al;

      const currentStock = stocks.find(s => s.symbol === al.symbol);
      if (!currentStock) return al;

      const prevPrice = prevStocksPricesRef.current[al.symbol];
      const currentPrice = currentStock.price;

      // Only check if price has actually changed
      if (prevPrice !== undefined && prevPrice === currentPrice) {
        return al;
      }

      let conditionMet = false;
      if (al.condition === "above" && currentPrice >= al.targetPrice) {
        conditionMet = true;
      } else if (al.condition === "below" && currentPrice <= al.targetPrice) {
        conditionMet = true;
      }

      if (conditionMet) {
        alertTriggered = true;
        // Create notification
        const newNotif: TriggeredNotification = {
          id: `${al.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          symbol: al.symbol,
          stockName: al.stockName,
          targetPrice: al.targetPrice,
          condition: al.condition,
          triggeredPrice: currentPrice,
          timestamp: new Date().toLocaleTimeString("zh-TW", { hour12: false }),
          isRead: false
        };
        triggeredList.push(newNotif);

        // Deactivate alert
        return {
          ...al,
          isActive: false
        };
      }

      return al;
    });

    // Update prices ref
    const priceMap: Record<string, number> = {};
    stocks.forEach(s => {
      priceMap[s.symbol] = s.price;
    });
    prevStocksPricesRef.current = priceMap;

    if (alertTriggered && triggeredList.length > 0) {
      // 1. Play synthesized bell chime
      playAlertChime();

      // 2. Add notifications state
      const updatedNotifications = [...notifications, ...triggeredList];
      setNotifications(updatedNotifications);
      localStorage.setItem("tw_stock_notifications", JSON.stringify(updatedNotifications));

      // 3. Update user profile
      const updatedUser = {
        ...currentUser,
        alerts: updatedAlerts
      };
      setCurrentUser(updatedUser);
      saveProfileToStorage(updatedUser);
    }
  }, [stocks]);

  // 3. Manual Immediate Update Handler
  const handleManualRefresh = () => {
    fetchStocksFromAPI();
  };

  // Account switching / Auth simulated state hooks
  const handleLoginUser = (email: string, name: string) => {
    const saved = localStorage.getItem("tw_stock_profiles") || "[]";
    const profilesList: UserProfile[] = JSON.parse(saved);
    let found = profilesList.find(p => p.email === email);
    
    if (!found) {
      found = {
        email,
        name,
        watchlists: [
          { id: "default", name: "預設最愛 ⭐", symbols: ["IX0001", "2330", "3481", "3231"], isDefault: true }
        ],
        alerts: []
      };
      profilesList.push(found);
      localStorage.setItem("tw_stock_profiles", JSON.stringify(profilesList));
      setRegisteredEmails(profilesList.map(p => p.email));
    }
    
    setCurrentUser(found);
    localStorage.setItem("tw_stock_logged_in_email", email);
    setActiveWatchlistId("default");
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("tw_stock_logged_in_email");
    setActiveWatchlistId("default");
  };

  // Custom watchlist handlers
  const handleSelectWatchlist = (id: string) => {
    setActiveWatchlistId(id);
  };

  const handleCreateWatchlist = (name: string) => {
    if (!currentUser) return;
    const newId = `wl-${Date.now()}`;
    const newWl: Watchlist = {
      id: newId,
      name,
      symbols: []
    };
    const updatedUser = {
      ...currentUser,
      watchlists: [...currentUser.watchlists, newWl]
    };
    setCurrentUser(updatedUser);
    saveProfileToStorage(updatedUser);
    setActiveWatchlistId(newId);
  };

  const handleDeleteWatchlist = (id: string) => {
    if (!currentUser) return;
    const updatedWatchlists = currentUser.watchlists.filter(w => w.id !== id);
    const updatedUser = {
      ...currentUser,
      watchlists: updatedWatchlists
    };
    setCurrentUser(updatedUser);
    saveProfileToStorage(updatedUser);
    setActiveWatchlistId("default");
  };

  // Price alert handlers
  const handleAddAlert = (symbol: string, targetPrice: number, condition: "above" | "below") => {
    if (!currentUser) return;
    const stock = stocks.find(s => s.symbol === symbol);
    const newAlert: PriceAlert = {
      id: `al-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol,
      stockName: stock ? stock.name : symbol,
      targetPrice,
      condition,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    const updatedUser = {
      ...currentUser,
      alerts: [newAlert, ...currentUser.alerts]
    };
    setCurrentUser(updatedUser);
    saveProfileToStorage(updatedUser);
  };

  const handleToggleAlert = (id: string) => {
    if (!currentUser) return;
    const updatedAlerts = currentUser.alerts.map(al => {
      if (al.id === id) {
        return {
          ...al,
          isActive: !al.isActive
        };
      }
      return al;
    });
    const updatedUser = {
      ...currentUser,
      alerts: updatedAlerts
    };
    setCurrentUser(updatedUser);
    saveProfileToStorage(updatedUser);
  };

  const handleDeleteAlert = (id: string) => {
    if (!currentUser) return;
    const updatedAlerts = currentUser.alerts.filter(al => al.id !== id);
    const updatedUser = {
      ...currentUser,
      alerts: updatedAlerts
    };
    setCurrentUser(updatedUser);
    saveProfileToStorage(updatedUser);
  };

  // Toast / Chime test function
  const handleTriggerTestNotification = () => {
    playAlertChime();
    
    // Choose a random stock to alert
    const selectable = stocks.filter(s => s.symbol !== "IX0001");
    const randomStock = selectable.length > 0 ? selectable[Math.floor(Math.random() * selectable.length)] : { symbol: "2330", name: "台積電", price: 985.00 };
    
    const testNotif: TriggeredNotification = {
      id: `test-${Date.now()}`,
      symbol: randomStock.symbol,
      stockName: randomStock.name,
      targetPrice: parseFloat((randomStock.price * 0.98).toFixed(1)),
      condition: "above",
      triggeredPrice: randomStock.price,
      timestamp: new Date().toLocaleTimeString("zh-TW", { hour12: false }),
      isRead: false
    };

    setNotifications(prev => [...prev, testNotif]);
  };

  // Notification Inbox popover handlers
  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    localStorage.setItem("tw_stock_notifications", JSON.stringify(updated));
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem("tw_stock_notifications", JSON.stringify(updated));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("tw_stock_notifications");
  };

  const handleRemoveNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("tw_stock_notifications", JSON.stringify(updated));
  };

  // 4. Pin / Unpin handlers (now maps directly to active watchlist if logged in!)
  const handleAddPin = (symbol: string) => {
    if (currentUser) {
      const updatedWatchlists = currentUser.watchlists.map(wl => {
        if (wl.id === activeWatchlistId) {
          if (!wl.symbols.includes(symbol)) {
            return {
              ...wl,
              symbols: [...wl.symbols, symbol]
            };
          }
        }
        return wl;
      });
      const updatedUser = {
        ...currentUser,
        watchlists: updatedWatchlists
      };
      setCurrentUser(updatedUser);
      saveProfileToStorage(updatedUser);
    } else {
      if (!pinnedSymbols.includes(symbol)) {
        setPinnedSymbols([...pinnedSymbols, symbol]);
      }
    }
  };

  const handleRemovePin = (symbol: string) => {
    if (currentUser) {
      const updatedWatchlists = currentUser.watchlists.map(wl => {
        if (wl.id === activeWatchlistId) {
          return {
            ...wl,
            symbols: wl.symbols.filter(s => s !== symbol)
          };
        }
        return wl;
      });
      const updatedUser = {
        ...currentUser,
        watchlists: updatedWatchlists
      };
      setCurrentUser(updatedUser);
      saveProfileToStorage(updatedUser);
    } else {
      setPinnedSymbols(pinnedSymbols.filter((sym) => sym !== symbol));
    }
  };

  const handleTogglePin = (symbol: string) => {
    const activeSymbols = currentUser 
      ? (currentUser.watchlists.find(w => w.id === activeWatchlistId)?.symbols || [])
      : pinnedSymbols;

    if (activeSymbols.includes(symbol)) {
      handleRemovePin(symbol);
    } else {
      handleAddPin(symbol);
    }
  };

  // 5. Excel Export Function (handles advanced columns)
  const handleExportToExcel = () => {
    if (stocks.length === 0) return;

    // Prepare data matching current filtered and sorted table view
    const exportData = sortedAndFilteredStocks.map((stock, index) => {
      const isIndex = stock.symbol === "IX0001";
      return {
        "排行 (Rank)": index + 1,
        "股票代號 (Symbol)": stock.symbol,
        "股票名稱 (Name)": stock.name,
        "產業類別 (Sector)": stock.category,
        "即時收盤價 (Price)": stock.price,
        "今日開盤價 (Open)": stock.openPrice,
        "漲跌 (Change)": stock.change,
        "漲跌幅 % (Change %)": `${stock.changePercent > 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`,
        "即時成交量 (Volume)": isIndex ? `${(stock.volume / 1000).toFixed(1)} 億` : `${stock.volume} 張`,
        "市值 (Market Cap)": `${stock.marketCap ? stock.marketCap.toLocaleString("zh-TW") : "--"} 億`,
        "本益比 (PE Ratio)": `${stock.peRatio ? stock.peRatio.toFixed(1) : "--"} 倍`,
        "殖利率 (Dividend Yield)": `${stock.dividendYield ? stock.dividendYield.toFixed(2) : "--"}%`
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "台股前200即時排行");

    // Adjust column widths for pretty formatting
    const wscols = [
      { wch: 10 }, // Rank
      { wch: 12 }, // Symbol
      { wch: 12 }, // Name
      { wch: 12 }, // Sector
      { wch: 15 }, // Price
      { wch: 15 }, // Open
      { wch: 10 }, // Change
      { wch: 12 }, // Change %
      { wch: 15 }, // Volume
      { wch: 15 }, // Market Cap
      { wch: 12 }, // PE Ratio
      { wch: 12 }, // Dividend Yield
    ];
    worksheet["!cols"] = wscols;

    const fileName = `台股即時行情前200檔_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // 6. Split Stocks into Pinned (Watchlist) and List Stocks
  const activeWatchlistSymbols = useMemo(() => {
    if (!currentUser) {
      return pinnedSymbols;
    }
    const wl = currentUser.watchlists.find(w => w.id === activeWatchlistId) || currentUser.watchlists[0];
    return wl ? wl.symbols : [];
  }, [currentUser, activeWatchlistId, pinnedSymbols]);

  const pinnedStocksList = useMemo(() => {
    return activeWatchlistSymbols
      .map((symbol) => stocks.find((s) => s.symbol === symbol))
      .filter((s): s is Stock => !!s);
  }, [activeWatchlistSymbols, stocks]);

  // List of unique industries/categories for filters
  const categoriesList = useMemo(() => {
    if (stocks.length === 0) return ["全部"];
    const cats = Array.from(new Set(stocks.map((s) => s.category)))
      .filter(cat => cat !== "指數"); // Exclude indices from normal sector filter
    return ["全部", ...cats];
  }, [stocks]);

  // Reset advanced filter parameters helper
  const handleResetFilters = () => {
    setFilterParams({
      category: "全部",
      marketCap: "all",
      volume: "all",
      peRatio: "all",
      dividendYield: "all"
    });
  };

  // 7. Advanced Filter and Sort the main list of 200 stocks
  const sortedAndFilteredStocks = useMemo(() => {
    let list = stocks.filter(s => s.symbol !== "IX0001"); // Main list excludes index directly

    // Category Selector
    if (filterParams.category !== "全部") {
      list = list.filter((s) => s.category === filterParams.category);
    }

    // Market Cap Filter
    if (filterParams.marketCap === "large") {
      list = list.filter((s) => s.marketCap >= 1000);
    } else if (filterParams.marketCap === "mid") {
      list = list.filter((s) => s.marketCap >= 200 && s.marketCap < 1000);
    } else if (filterParams.marketCap === "small") {
      list = list.filter((s) => s.marketCap < 200);
    }

    // Trading Volume Filter
    if (filterParams.volume === "heavy") {
      list = list.filter((s) => s.volume >= 8000);
    } else if (filterParams.volume === "mid") {
      list = list.filter((s) => s.volume >= 2000 && s.volume < 8000);
    } else if (filterParams.volume === "light") {
      list = list.filter((s) => s.volume < 2000);
    }

    // PE Ratio Filter
    if (filterParams.peRatio === "low") {
      list = list.filter((s) => s.peRatio <= 15);
    } else if (filterParams.peRatio === "mid") {
      list = list.filter((s) => s.peRatio > 15 && s.peRatio <= 30);
    } else if (filterParams.peRatio === "high") {
      list = list.filter((s) => s.peRatio > 30);
    }

    // Dividend Yield Filter
    if (filterParams.dividendYield === "high") {
      list = list.filter((s) => s.dividendYield >= 5.0);
    } else if (filterParams.dividendYield === "mid") {
      list = list.filter((s) => s.dividendYield >= 2.0 && s.dividendYield < 5.0);
    } else if (filterParams.dividendYield === "low") {
      list = list.filter((s) => s.dividendYield < 2.0);
    }

    // Search Query (Filter by Code or Name)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    // Advanced Sorting Options
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "changePercentDesc":
          return b.changePercent - a.changePercent;
        case "changePercentAsc":
          return a.changePercent - b.changePercent;
        case "priceDesc":
          return b.price - a.price;
        case "priceAsc":
          return a.price - b.price;
        case "volumeDesc":
          return b.volume - a.volume;
        case "volumeAsc":
          return a.volume - b.volume;
        case "marketCapDesc":
          return b.marketCap - a.marketCap;
        case "marketCapAsc":
          return a.marketCap - b.marketCap;
        case "peRatioDesc":
          return b.peRatio - a.peRatio;
        case "peRatioAsc":
          return a.peRatio - b.peRatio;
        case "dividendYieldDesc":
          return b.dividendYield - a.dividendYield;
        case "dividendYieldAsc":
          return a.dividendYield - b.dividendYield;
        case "symbolAsc":
          return a.symbol.localeCompare(b.symbol);
        default:
          return b.changePercent - a.changePercent;
      }
    });
  }, [stocks, searchQuery, filterParams, sortBy]);

  // Market stats for header summary
  const marketSummary = useMemo(() => {
    if (stocks.length === 0) return { upCount: 0, downCount: 0, flatCount: 0, totalVol: 0 };
    let up = 0;
    let down = 0;
    let flat = 0;
    let vol = 0;
    stocks.forEach((s) => {
      if (s.symbol === "IX0001") return; // exclude index from counts
      vol += s.volume;
      if (s.changePercent > 0) up++;
      else if (s.changePercent < 0) down++;
      else flat++;
    });
    return { upCount: up, downCount: down, flatCount: flat, totalVol: vol };
  }, [stocks]);

  // Standalone full-screen chart rendering if URL has ?symbol=XXXX
  if (standaloneSymbol) {
    if (stocks.length === 0) {
      return (
        <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs font-bold tracking-wider uppercase font-mono">載入即時盤後股市數據中 Loading...</span>
        </div>
      );
    }
    const matchedStock = stocks.find((s) => s.symbol === standaloneSymbol);
    if (!matchedStock) {
      return (
        <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-slate-100 p-6">
          <div className="bg-[#161b22] border border-slate-800 p-8 rounded-2xl max-w-md text-center shadow-xl">
            <h1 className="text-lg font-black text-red-500 mb-2 uppercase">無此股票代號 Not Found</h1>
            <p className="text-xs text-slate-400 mb-6 font-bold">
              我們在 200 檔模擬台股中找不到代號「{standaloneSymbol}」的相關資訊。
            </p>
            <button
              onClick={() => {
                setStandaloneSymbol(null);
                window.close();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all"
            >
              關閉視窗 Close Window
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-0">
        <StockChartWindow 
          stock={matchedStock} 
          isStandalone={true} 
          onClose={() => {
            setStandaloneSymbol(null);
            window.close();
          }} 
        />
      </div>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-[#080c14] text-slate-100 font-sans antialiased pb-12">
      {/* 1. Header Banner Area */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#080c14]/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Title and Status */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-red-600 to-amber-500 p-2 rounded-xl shadow-md shadow-red-950/40">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="main-app-title" className="text-sm font-black text-slate-100 tracking-wider font-display uppercase">
                  台股即時前200-ET03
                </h1>
                {isTaiwanMarketOpen() ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 animate-pulse" title="市場交易中">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    交易中 (LIVE)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700" title="市場已收盤，資料暫停變動">
                    <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                    已收盤 (CLOSED)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 font-sans">Taiwan Stock Market · 數據來源: 台灣證券交易所 (TWSE) / 櫃買中心 (TPEx)</p>
            </div>
          </div>

          {/* Real-time stats ticker */}
          <div className="hidden lg:flex items-center gap-3.5 bg-[#161b22] border border-slate-800/80 rounded-lg px-4 py-1.5 text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-slate-500">家數:</span>
              <span className="text-slate-200">200</span>
            </div>
            <div className="w-px h-2.5 bg-slate-800"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">上漲:</span>
              <span className="text-red-500">{marketSummary.upCount} 檔</span>
            </div>
            <div className="w-px h-2.5 bg-slate-800"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">下跌:</span>
              <span className="text-emerald-500">{marketSummary.downCount} 檔</span>
            </div>
            <div className="w-px h-2.5 bg-slate-800"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">平盤:</span>
              <span className="text-slate-400">{marketSummary.flatCount}</span>
            </div>
          </div>

          {/* Clock, Notifications, and Profiles */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Date */}
            <div className="flex items-center gap-1.5 bg-[#161b22] border border-slate-800/80 px-3 py-1.5 rounded-lg text-slate-300 text-xs font-mono font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDate || "載入中..."}</span>
            </div>

            {/* Clock */}
            <div className="flex items-center gap-1.5 bg-[#161b22] border border-slate-800/80 px-3 py-1.5 rounded-lg text-slate-300 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentTime || "載入中..."}</span>
            </div>

            {/* Notification Inbox Popover Feed */}
            <NotificationFeed
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onClear={handleClearNotifications}
              onRemove={handleRemoveNotification}
            />

            {/* User Profile Simulated Authenticator */}
            <UserProfileManager
              currentUser={currentUser}
              onLogin={handleLoginUser}
              onLogout={handleLogoutUser}
              registeredEmails={registeredEmails}
              isSimulatedEmailEnabled={isSimulatedEmailEnabled}
              onToggleSimulatedEmail={() => setIsSimulatedEmailEnabled(!isSimulatedEmailEnabled)}
            />

            {/* Auto Refresh Status Badge */}
            <div
              id="market-status-badge"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border select-none ${
                isTaiwanMarketOpen()
                  ? "bg-[#161b22] border-emerald-500/30 text-emerald-400"
                  : "bg-[#161b22] border-amber-500/30 text-amber-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                isTaiwanMarketOpen()
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500 animate-pulse"
              }`}></span>
              {isTaiwanMarketOpen() ? (
                <span>盤中交易 (自動更新中)</span>
              ) : (
                <span>已收盤 (模擬更新中)</span>
              )}
            </div>

            {/* Export Excel Button */}
            <button
              id="export-excel-btn"
              onClick={handleExportToExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 transition-all border border-emerald-500/20 cursor-pointer"
              title="匯出 Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出 Excel</span>
            </button>
          </div>

        </div>
      </header>

      {/* Real-time floating alert toast queue overlay */}
      <TriggeredNotificationToast
        notifications={notifications}
        onDismiss={handleMarkNotificationRead}
        isSimulatedEmailEnabled={isSimulatedEmailEnabled}
      />

      {/* 2. Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Top Pinned Block with Independent Section */}
        <section id="pinned-grid-container" className="bg-[#11141e]/40 border border-slate-850 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 tracking-wider font-display uppercase">
                {currentUser 
                  ? `自訂看板分組：${currentUser.watchlists.find(w => w.id === activeWatchlistId)?.name || "關注中個股"}`
                  : "PINNED MARKET BOARD 獨立追蹤"}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">獨立追蹤看板：預設含台灣加權指數及熱門指標個股，可在下方搜尋自訂新增或移出。</p>
            </div>
            
            {/* Search Box to Add/Remove from Pinned area */}
            <div className="w-full md:w-auto">
              <StockSearchBox 
                stocks={stocks} 
                pinnedSymbols={activeWatchlistSymbols}
                onAddPin={handleAddPin}
                onRemovePin={handleRemovePin}
              />
            </div>
          </div>

          {/* Grid Render */}
          {pinnedStocksList.length > 0 ? (
            <PinnedStocksGrid 
              pinnedStocks={pinnedStocksList} 
              onRemovePin={handleRemovePin}
              onViewChart={handleViewChart}
            />
          ) : (
            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs font-semibold">
              目前關注區為空。請利用右上方的搜尋框輸入代號，將個股加入此看盤區。
            </div>
          )}
        </section>

        {/* Watchlist & Threshold Price Alerts configuration panel */}
        <section id="watchlist-alerts-section" className="mb-6">
          <WatchlistAndAlertPanel
            userProfile={currentUser}
            stocks={stocks}
            activeWatchlistId={activeWatchlistId}
            onSelectWatchlist={handleSelectWatchlist}
            onCreateWatchlist={handleCreateWatchlist}
            onDeleteWatchlist={handleDeleteWatchlist}
            onAddAlert={handleAddAlert}
            onToggleAlert={handleToggleAlert}
            onDeleteAlert={handleDeleteAlert}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            onTriggerTestNotification={handleTriggerTestNotification}
          />
        </section>

        {/* 3. Top 200 Stocks Heat List Section */}
        <section id="main-heat-list-section">
          <div className="bg-[#11141e]/40 border border-slate-850 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Table Filters & Search Area */}
            <div className="p-5 border-b border-slate-850 bg-[#161b22]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Left Title and Sub */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                  <h2 className="text-sm font-black text-slate-200 tracking-wider font-display uppercase">台股即時漲幅排行前 200 檔 TAIWAN TOP 200</h2>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">即時行情更新，台灣個股多空趨勢一覽無遺</p>
              </div>

              {/* Right Side Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                
                {/* Search Bar for the table */}
                <div className="relative w-full sm:w-52">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    id="table-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋代號或名稱..."
                    className="w-full bg-[#0a0b10] border border-slate-800 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                {/* Advanced Filters Toggle Button */}
                <button
                  id="toggle-advanced-filters-btn"
                  onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isAdvancedFiltersOpen || Object.values(filterParams).some(v => v !== "all" && v !== "全部")
                      ? "bg-red-500/10 border-red-500/40 text-red-400 font-black"
                      : "bg-[#161b22] border-slate-800 text-slate-200 hover:bg-slate-800"
                  }`}
                  title="展開/收合進階過濾條件"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>進階過濾</span>
                  {Object.values(filterParams).some(v => v !== "all" && v !== "全部") && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">排序:</span>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-36 bg-[#0a0b10] border border-slate-850 text-slate-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 font-bold font-sans cursor-pointer"
                  >
                    <option value="changePercentDesc">漲幅：高到低 (預設)</option>
                    <option value="changePercentAsc">跌幅：高到低</option>
                    <option value="priceDesc">股價：高到低</option>
                    <option value="priceAsc">股價：低到高</option>
                    <option value="volumeDesc">成交量：大到小</option>
                    <option value="volumeAsc">成交量：小到大</option>
                    <option value="marketCapDesc">市值：大到小</option>
                    <option value="marketCapAsc">市值：小到大</option>
                    <option value="peRatioDesc">本益比：高到低</option>
                    <option value="peRatioAsc">本益比：低到高</option>
                    <option value="dividendYieldDesc">殖利率：高到低</option>
                    <option value="dividendYieldAsc">殖利率：低到高</option>
                    <option value="symbolAsc">代號：依序排列</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Advanced Filters panel rendered dynamically */}
            {isAdvancedFiltersOpen && (
              <div className="px-5 pb-5 pt-1 border-b border-slate-850 bg-[#161b22]/10">
                <AdvancedFilters
                  categories={categoriesList}
                  params={filterParams}
                  onChange={setFilterParams}
                  onReset={handleResetFilters}
                />
              </div>
            )}

            {/* Real Stock Table */}
            <div className="overflow-x-auto">
              <table id="stock-market-table" className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 bg-[#161b22]/50 text-slate-400 uppercase text-[10px] tracking-wider font-black font-mono">
                    <th className="px-4 py-3 text-center w-14">排行</th>
                    <th className="px-4 py-3 text-left w-24">代號</th>
                    <th className="px-4 py-3 text-left">名稱</th>
                    <th className="px-4 py-3 text-right w-24">當前價</th>
                    <th className="px-4 py-3 text-right w-24">漲跌</th>
                    <th className="px-4 py-3 text-right w-24">漲跌幅</th>
                    <th className="px-4 py-3 text-right w-28">成交量</th>
                    <th className="px-4 py-3 text-right w-28">市值</th>
                    <th className="px-4 py-3 text-right w-22">本益比</th>
                    <th className="px-4 py-3 text-right w-22">殖利率</th>
                    <th className="px-4 py-3 text-right w-26">52周最高</th>
                    <th className="px-4 py-3 text-right w-26">52周最低</th>
                    <th className="px-4 py-3 text-center w-36">主力買賣力道</th>
                    <th className="px-4 py-3 text-center w-36">即時動態走勢</th>
                    <th className="px-4 py-3 text-center w-20">關注</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredStocks.length > 0 ? (
                    sortedAndFilteredStocks.slice(0, 200).map((stock, idx) => (
                      <StockRow
                        key={stock.symbol}
                        stock={stock}
                        rank={idx + 1}
                        isPinned={activeWatchlistSymbols.includes(stock.symbol)}
                        onTogglePin={handleTogglePin}
                        onViewChart={handleViewChart}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="text-center py-12 text-slate-500 text-xs font-semibold">
                        沒有符合當前過濾條件的個股資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom table info bar */}
            <div className="px-6 py-4 border-t border-slate-850 text-[10px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-bold uppercase tracking-wider">
              <span>
                顯示 <span className="text-slate-300 font-bold">{Math.min(200, sortedAndFilteredStocks.length)}</span> 檔 / 共 {stocks.length - 1} 檔台股個股資料 (指數除外)
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-red-500 inline-block"></span>
                  <span className="text-red-500 font-black">紅色上漲 (台股標準)</span>
                </span>
                <span className="flex items-center gap-1 ml-4">
                  <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                  <span className="text-emerald-500 font-black">綠色下跌 (台股標準)</span>
                </span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-[10px] font-bold text-slate-600 border-t border-slate-900 pt-6 leading-relaxed">
        <p>© 2026 台股即時行情資訊看板. 本系統之收盤與即時行情基礎數據直接對接自 台灣證券交易所 (TWSE) 及 中華民國證券櫃檯買賣中心 (TPEx) 的公開數據，所有收盤資訊皆符合官方證交所公告。僅供學術研究與看板操作參考，請勿作為實際交易依據。</p>
      </footer>

      {/* 5-Min Price & Volume Chart Modal Popup */}
      {selectedChartStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl shadow-2xl transition-all duration-150">
            <StockChartWindow
              stock={selectedChartStock}
              onClose={() => setSelectedChartStock(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
