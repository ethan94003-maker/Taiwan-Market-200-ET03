import React, { useEffect, useState, useRef } from "react";
import { Plus, Check, Star } from "lucide-react";
import { Stock } from "../types";
import MiniSparkline from "./MiniSparkline";

interface StockRowProps {
  stock: Stock;
  rank: number;
  isPinned: boolean;
  onTogglePin: (symbol: string) => void;
  onViewChart?: (symbol: string) => void;
  key?: React.Key;
}

export default function StockRow({ stock, rank, isPinned, onTogglePin, onViewChart }: StockRowProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef<number>(stock.price);

  useEffect(() => {
    // If price changes, trigger a visual flash effect (Red for Taiwan stock UP, Green for Taiwan stock DOWN)
    if (stock.price > prevPriceRef.current) {
      setFlash("up");
      const timer = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timer);
    } else if (stock.price < prevPriceRef.current) {
      setFlash("down");
      const timer = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = stock.price;
  }, [stock.price]);

  const isUp = stock.changePercent > 0;
  const isDown = stock.changePercent < 0;

  return (
    <tr
      id={`stock-row-${stock.symbol}`}
      className="border-b border-slate-800/40 hover:bg-white/5 transition-all duration-150 group"
    >
      {/* Rank */}
      <td className="px-4 py-3 text-center text-[11px] font-black text-slate-500 font-mono">
        {rank}
      </td>

      {/* Symbol Code */}
      <td className="px-4 py-3 text-left">
        <span className="font-mono text-[10px] font-black bg-[#0a0b10] text-slate-400 px-2 py-0.5 rounded border border-slate-850">
          {stock.symbol}
        </span>
      </td>

      {/* Name */}
      <td className="px-4 py-3 text-left font-bold text-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChart?.(stock.symbol)}
            className="tracking-tight hover:text-blue-400 hover:underline cursor-pointer text-left focus:outline-none transition-colors font-bold"
            title="點擊查看5分鐘價量走勢圖"
          >
            {stock.name}
          </button>
          <span className="text-[9px] text-slate-500 font-bold bg-slate-900/50 px-1.5 py-0.2 rounded border border-slate-850">
            {stock.category}
          </span>
        </div>
      </td>

      {/* Price (with Flash update animation) */}
      <td
        className={`px-4 py-3 text-right font-mono text-xs font-black transition-all duration-300 ${
          flash === "up"
            ? "bg-red-500/20 text-red-500 scale-[1.01]"
            : flash === "down"
            ? "bg-emerald-500/20 text-emerald-500 scale-[1.01]"
            : isUp
            ? "text-red-500"
            : isDown
            ? "text-emerald-500"
            : "text-slate-300"
        }`}
      >
        {stock.price.toLocaleString("zh-TW", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>

      {/* Change amount */}
      <td
        className={`px-4 py-3 text-right font-mono text-xs font-bold ${
          isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-500"
        }`}
      >
        {isUp ? "+" : isDown ? "-" : ""}
        {Math.abs(stock.change).toLocaleString("zh-TW", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>

      {/* Change Percentage */}
      <td className="px-4 py-3 text-right font-mono text-xs">
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-black leading-none inline-block ${
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
      </td>

      {/* Volume (張) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-slate-400 font-bold">
        {stock.volume.toLocaleString("zh-TW")} <span className="text-[9px] text-slate-500 font-bold uppercase">張</span>
      </td>

      {/* Market Cap (市值) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300 font-bold">
        {stock.marketCap ? `${stock.marketCap.toLocaleString("zh-TW")} 億` : "--"}
      </td>

      {/* PE Ratio (本益比) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300 font-bold">
        {stock.peRatio ? `${stock.peRatio.toFixed(1)}x` : "--"}
      </td>

      {/* Dividend Yield (殖利率) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300 font-bold">
        {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "--"}
      </td>

      {/* 52-week High (52周最高) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-rose-500/90 font-black">
        {stock.high52Week ? stock.high52Week.toLocaleString("zh-TW", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) : "--"}
      </td>

      {/* 52-week Low (52周最低) */}
      <td className="px-4 py-3 text-right font-mono text-xs text-emerald-500/90 font-black">
        {stock.low52Week ? stock.low52Week.toLocaleString("zh-TW", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) : "--"}
      </td>

      {/* 主力買賣力道 (Major Buy/Sell Strength) */}
      <td className="px-4 py-3 text-center">
        <div className="flex flex-col items-center justify-center min-w-[120px] max-w-[140px] mx-auto">
          <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold mb-1">
            <span className="text-rose-400 font-extrabold">主力 {stock.majorBuyPercent ? stock.majorBuyPercent.toFixed(0) : "50"}%</span>
            <span className="text-emerald-400 font-extrabold">散戶 {(100 - (stock.majorBuyPercent || 50)).toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="h-full bg-rose-500 transition-all duration-500 ease-out" 
              style={{ width: `${stock.majorBuyPercent || 50}%` }}
              title={`主力買盤力道: ${stock.majorBuyPercent || 50}%`}
            />
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
              style={{ width: `${100 - (stock.majorBuyPercent || 50)}%` }}
              title={`散戶/賣盤力道: ${100 - (stock.majorBuyPercent || 50)}%`}
            />
          </div>
        </div>
      </td>

      {/* Sparkline (漲跌曲線) */}
      <td className="px-4 py-3 text-center">
        <MiniSparkline
          prices={stock.history}
          isUp={isUp}
          isDown={isDown}
          symbol={stock.symbol}
        />
      </td>

      {/* Pin Action */}
      <td className="px-4 py-3 text-center">
        <button
          id={`pin-toggle-row-${stock.symbol}`}
          onClick={() => onTogglePin(stock.symbol)}
          className={`p-1 rounded transition-all ${
            isPinned
              ? "text-amber-400 hover:text-amber-300"
              : "text-slate-600 hover:text-red-500"
          }`}
          title={isPinned ? "移出關注區" : "加入關注區"}
        >
          <Star className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-400" : ""}`} />
        </button>
      </td>
    </tr>
  );
}
