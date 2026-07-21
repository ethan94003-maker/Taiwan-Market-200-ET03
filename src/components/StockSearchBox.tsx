import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, X } from "lucide-react";
import { Stock } from "../types";

interface StockSearchBoxProps {
  stocks: Stock[];
  pinnedSymbols: string[];
  onAddPin: (symbol: string) => void;
  onRemovePin: (symbol: string) => void;
}

export default function StockSearchBox({
  stocks,
  pinnedSymbols,
  onAddPin,
  onRemovePin,
}: StockSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter stocks based on query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    const cleanQuery = query.toLowerCase().trim();
    const filtered = stocks
      // Filter out TAIEX index itself (not typically added/removed in the same way, but let the user do it if they want)
      .filter((stock) => {
        return (
          stock.symbol.toLowerCase().includes(cleanQuery) ||
          stock.name.toLowerCase().includes(cleanQuery)
        );
      })
      .slice(0, 8); // Limit suggestions to top 8 items
    setSuggestions(filtered);
  }, [query, stocks]);

  const handleSelectStock = (stock: Stock) => {
    if (pinnedSymbols.includes(stock.symbol)) {
      onRemovePin(stock.symbol);
    } else {
      onAddPin(stock.symbol);
    }
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div id="stock-search-container" ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="stock-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜尋代號或名稱 (e.g. 2330, 台積電)..."
          className="w-full bg-[#0a0b10] border border-slate-800 text-slate-100 rounded-lg pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-red-500 transition-colors"
        />
        {query && (
          <button
            id="clear-search-button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div id="search-suggestions-dropdown" className="absolute z-50 w-full mt-1 bg-[#161b22] border border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((stock) => {
            const isPinned = pinnedSymbols.includes(stock.symbol);
            const isUp = stock.changePercent > 0;
            const isDown = stock.changePercent < 0;
            
            return (
              <div
                id={`suggestion-item-${stock.symbol}`}
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-900/60 cursor-pointer transition-colors border-b border-slate-850 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold bg-[#0a0b10] text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    {stock.symbol}
                  </span>
                  <span className="text-slate-200 font-bold text-xs">{stock.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stock.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-300">
                      ${stock.price.toLocaleString("zh-TW", { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[10px] font-bold font-mono ${
                        isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-400"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <button
                    id={`toggle-pin-btn-${stock.symbol}`}
                    className={`p-1.5 rounded transition-colors ${
                      isPinned
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-900"
                        : "bg-red-950/60 text-red-400 border border-red-900/40 hover:bg-red-900"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStock(stock);
                    }}
                    title={isPinned ? "移出最愛區塊" : "加入最愛區塊"}
                  >
                    {isPinned ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && query.trim() !== "" && suggestions.length === 0 && (
        <div id="no-suggestions" className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-4 text-center text-xs text-slate-400 shadow-xl">
          找不到符合「{query}」的股票
        </div>
      )}
    </div>
  );
}
