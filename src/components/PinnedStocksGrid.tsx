import React, { useEffect, useRef } from "react";
import { X, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Stock } from "../types";
import MiniSparkline from "./MiniSparkline";

interface PinnedStocksGridProps {
  pinnedStocks: Stock[];
  onRemovePin: (symbol: string) => void;
  onViewChart?: (symbol: string) => void;
}

export default function PinnedStocksGrid({ pinnedStocks, onRemovePin, onViewChart }: PinnedStocksGridProps) {
  return (
    <div id="pinned-stocks-section" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-red-500 rounded-full"></div>
          <h2 className="text-sm font-black text-slate-200 tracking-wider uppercase">指標與自訂關注區 PINNED BOARD</h2>
        </div>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          已加入 <span className="font-black text-red-500">{pinnedStocks.length}</span> 檔
        </span>
      </div>

      <div
        id="pinned-stocks-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {pinnedStocks.map((stock) => {
          const isUp = stock.changePercent > 0;
          const isDown = stock.changePercent < 0;
          const isIndex = stock.symbol === "IX0001";

          return (
            <div
              id={`pinned-card-${stock.symbol}`}
              key={stock.symbol}
              className={`relative bg-[#161b22] border ${
                isUp
                  ? "border-red-500/20 hover:border-red-500/40"
                  : isDown
                  ? "border-emerald-500/20 hover:border-emerald-500/40"
                  : "border-slate-800"
              } rounded-xl p-4.5 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between min-h-[140px]`}
            >
              {/* Remove pin button */}
              <button
                id={`unpin-btn-${stock.symbol}`}
                onClick={() => onRemovePin(stock.symbol)}
                className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-200 p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="從此區塊移出"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-black bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-850">
                      {isIndex ? "INDEX" : stock.symbol}
                    </span>
                    <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{stock.category}</span>
                  </div>
                  {isUp ? (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                    </span>
                  ) : isDown ? (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                    </span>
                  ) : null}
                </div>
                
                <button
                  onClick={() => onViewChart?.(stock.symbol)}
                  className="text-sm font-black text-slate-100 hover:text-blue-400 hover:underline cursor-pointer tracking-tight leading-none mb-2 text-left focus:outline-none transition-colors"
                  title="點擊查看5分鐘價量走勢圖"
                >
                  {stock.name}
                </button>
              </div>

              {/* Price and Percent change */}
              <div className="my-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-xl font-black font-mono tracking-tight ${
                    isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-100"
                  }`}>
                    {stock.price.toLocaleString("zh-TW", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`text-xs font-black font-mono px-1.5 py-0.5 rounded ${
                      isUp
                        ? "bg-red-500/10 text-red-500"
                        : isDown
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold tracking-wider uppercase">
                  <span>成交量</span>
                  <span className="font-mono font-bold text-slate-400">
                    {isIndex
                      ? `${(stock.volume / 1000).toFixed(1)} 億`
                      : `${stock.volume.toLocaleString("zh-TW")} 張`}
                  </span>
                </div>
              </div>

              {/* Sparkline block */}
              <div id={`sparkline-container-${stock.symbol}`} className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  即時動態走勢
                </span>
                <MiniSparkline
                  prices={stock.history}
                  isUp={isUp}
                  isDown={isDown}
                  symbol={stock.symbol}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
