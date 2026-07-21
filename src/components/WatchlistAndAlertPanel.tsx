import React, { useState } from "react";
import { 
  FolderHeart, 
  Plus, 
  Trash2, 
  BellRing, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X, 
  AlertTriangle,
  Sparkles,
  Volume2
} from "lucide-react";
import { Stock, Watchlist, PriceAlert, UserProfile, TriggeredNotification } from "../types";

interface WatchlistAndAlertPanelProps {
  userProfile: UserProfile | null;
  stocks: Stock[];
  activeWatchlistId: string;
  onSelectWatchlist: (id: string) => void;
  onCreateWatchlist: (name: string) => void;
  onDeleteWatchlist: (id: string) => void;
  onAddAlert: (symbol: string, targetPrice: number, condition: "above" | "below") => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  notifications: TriggeredNotification[];
  onClearNotifications: () => void;
  onTriggerTestNotification: () => void;
}

export default function WatchlistAndAlertPanel({
  userProfile,
  stocks,
  activeWatchlistId,
  onSelectWatchlist,
  onCreateWatchlist,
  onDeleteWatchlist,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert,
  notifications,
  onClearNotifications,
  onTriggerTestNotification
}: WatchlistAndAlertPanelProps) {
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [isCreatingWatchlist, setIsCreatingWatchlist] = useState(false);

  // Alert Form State
  const [selectedStockSymbol, setSelectedStockSymbol] = useState("");
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [alertSuccessMsg, setAlertSuccessMsg] = useState("");

  const activeWatchlist = userProfile?.watchlists.find(w => w.id === activeWatchlistId) || userProfile?.watchlists[0];

  const handleCreateWatchlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWatchlistName.trim()) {
      onCreateWatchlist(newWatchlistName.trim());
      setNewWatchlistName("");
      setIsCreatingWatchlist(false);
    }
  };

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockSymbol || !alertTargetPrice) return;
    
    const priceNum = parseFloat(alertTargetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    onAddAlert(selectedStockSymbol, priceNum, alertCondition);
    
    const st = stocks.find(s => s.symbol === selectedStockSymbol);
    setAlertSuccessMsg(`已設定警示：當 ${st?.name || selectedStockSymbol} ${alertCondition === "above" ? "漲破 ≧" : "跌破 ≦"} $${priceNum}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setAlertSuccessMsg("");
    }, 3000);

    // Reset inputs
    setAlertTargetPrice("");
  };

  const selectedStockObj = stocks.find(s => s.symbol === selectedStockSymbol);

  // Filter stocks to selectable list (excluding indices or keeping simple)
  const selectableStocks = stocks.filter(s => s.symbol !== "IX0001");

  return (
    <div id="watchlist-alerts-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 1. Watchlists Panel */}
      <div className="bg-[#11141e]/70 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between min-h-[340px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-red-500" />
              <h4 className="text-xs font-black text-slate-200 tracking-wider uppercase">自訂看盤分組 Watchlists</h4>
            </div>
            
            {!isCreatingWatchlist && (
              <button
                onClick={() => setIsCreatingWatchlist(true)}
                className="text-[10px] font-bold text-red-500 hover:text-red-400 flex items-center gap-0.5 border border-red-500/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                新增分組
              </button>
            )}
          </div>

          {/* New watchlist input form */}
          {isCreatingWatchlist && (
            <form onSubmit={handleCreateWatchlistSubmit} className="mb-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <div className="text-[10px] text-slate-400 font-bold mb-1">分組名稱 (e.g. 科技ETF、波段存股)</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={15}
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  placeholder="輸入名稱..."
                  className="bg-[#0a0b10] border border-slate-800 rounded text-slate-200 px-2 py-1 text-xs focus:outline-none focus:border-red-500 flex-1 font-bold"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white rounded px-3 text-xs font-bold cursor-pointer"
                >
                  確認
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingWatchlist(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Lists lists */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {userProfile?.watchlists.map((wl) => {
              const isActive = wl.id === activeWatchlistId;
              const isDefault = wl.isDefault;
              return (
                <div
                  key={wl.id}
                  onClick={() => onSelectWatchlist(wl.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                    isActive
                      ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-sm"
                      : "bg-[#161b22]/40 border-slate-800/40 text-slate-400 hover:bg-[#161b22]/80 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    <span>{wl.name}</span>
                    <span className="text-[9px] text-slate-500 bg-slate-950 border border-slate-850 px-1 py-0.2 rounded font-mono font-bold">
                      {wl.symbols.length} 檔
                    </span>
                    {isDefault && (
                      <span className="text-[8px] bg-slate-800 text-amber-400 border border-amber-500/20 px-1 rounded uppercase tracking-wider font-bold">
                        預設
                      </span>
                    )}
                  </div>
                  
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`確定要刪除「${wl.name}」分組嗎？`)) {
                          onDeleteWatchlist(wl.id);
                        }
                      }}
                      className="text-slate-600 hover:text-red-500 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-850/60 text-[10px] text-slate-500 font-semibold leading-relaxed">
          💡 操作提示：點選上方分組可載入關注清單，在下方列表中點選 <span className="text-amber-500">★ 星號</span> 可隨時加入或移出當前看盤分組。
        </div>
      </div>

      {/* 2. Custom Price Alerts Config */}
      <div className="bg-[#11141e]/70 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between min-h-[340px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-slate-200 tracking-wider uppercase">
                股票價格警示 Alert Creator
              </h4>
            </div>
            
            <button
              onClick={onTriggerTestNotification}
              className="text-[9px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1 border border-slate-800 px-1.5 py-0.5 rounded cursor-pointer transition-colors bg-slate-900"
              title="測試警示通知效果"
            >
              <Volume2 className="w-3 h-3 text-red-500 animate-pulse" />
              測試音效 & Toast
            </button>
          </div>

          <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
            {/* Stock Selector */}
            <div>
              <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                選擇股票 Stock
              </label>
              <select
                required
                value={selectedStockSymbol}
                onChange={(e) => {
                  setSelectedStockSymbol(e.target.value);
                  const st = stocks.find(s => s.symbol === e.target.value);
                  if (st) setAlertTargetPrice(st.price.toFixed(1));
                }}
                className="w-full bg-[#0a0b10] border border-slate-800 text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
              >
                <option value="">-- 請選擇個股 --</option>
                {selectableStocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    [{s.symbol}] {s.name} (當前: ${s.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Condition Side-by-Side */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  觸發條件 Condition
                </label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full bg-[#0a0b10] border border-slate-800 text-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
                >
                  <option value="above">漲破 ≧ (Above)</option>
                  <option value="below">跌破 ≦ (Below)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  目標價 Target Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 1000"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full bg-[#0a0b10] border border-slate-800 rounded text-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 font-bold font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedStockSymbol || !alertTargetPrice}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              送出建立警示 Create Alert
            </button>
          </form>

          {/* Success / Alert message */}
          {alertSuccessMsg && (
            <div className="mt-2.5 p-2 bg-emerald-950/40 border border-emerald-900/60 rounded text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{alertSuccessMsg}</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-[9px] text-slate-500 font-bold leading-relaxed border-t border-slate-850/60 pt-2 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>警示引擎為毫秒級監控，當模擬報價符合設定時將發出「雙音叮噹響」並彈出通知！</span>
        </div>
      </div>

      {/* 3. Alerts List / Triggered History Panel */}
      <div className="bg-[#11141e]/70 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between min-h-[340px]">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black text-slate-200 tracking-wider uppercase">
                作用中警示設定 Active Alerts ({userProfile?.alerts.filter(a => a.isActive).length || 0})
              </h4>
            </div>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {!userProfile?.alerts || userProfile.alerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs font-bold border border-dashed border-slate-800 rounded-xl">
                目前沒有設定任何價格警示。
              </div>
            ) : (
              userProfile.alerts.map((al) => {
                const stock = stocks.find(s => s.symbol === al.symbol);
                const currentPrice = stock ? stock.price : 0;
                return (
                  <div
                    key={al.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-850 text-[11px] font-bold ${
                      al.isActive ? "text-slate-300" : "text-slate-500 opacity-60 line-through"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono bg-slate-950 px-1 py-0.2 border border-slate-850 rounded text-[9px]">
                          {al.symbol}
                        </span>
                        <span>{al.stockName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium font-mono">
                        條件: {al.condition === "above" ? "價格 ≧" : "價格 ≦"}{" "}
                        <span className="text-amber-500 font-bold">${al.targetPrice}</span>
                        <span className="text-slate-500 ml-2">
                          (現價: ${currentPrice})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleAlert(al.id)}
                        className={`px-1.5 py-0.5 rounded text-[9px] border cursor-pointer transition-colors ${
                          al.isActive
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40 hover:bg-emerald-900/60"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                        title={al.isActive ? "停用警示" : "啟用警示"}
                      >
                        {al.isActive ? "監控中" : "已停用"}
                      </button>

                      <button
                        onClick={() => onDeleteAlert(al.id)}
                        className="text-slate-600 hover:text-red-500 transition-colors p-1"
                        title="刪除此警示"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-3 text-[10px] text-slate-500 font-bold leading-none flex justify-between items-center border-t border-slate-850/60 pt-3">
          <span>
            已觸發歷史通知：<span className="text-amber-500 font-black">{notifications.length}</span> 筆
          </span>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className="text-red-500 hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider text-[9px]"
            >
              清除歷史紀錄 Clear
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
