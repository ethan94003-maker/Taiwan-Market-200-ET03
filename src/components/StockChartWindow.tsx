import React, { useMemo } from "react";
import { X, ExternalLink, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Stock } from "../types";
import { generate5MinChartData } from "../utils/chartData";

interface StockChartWindowProps {
  stock: Stock;
  onClose?: () => void;
  isStandalone?: boolean;
}

export default function StockChartWindow({ stock, onClose, isStandalone = false }: StockChartWindowProps) {
  const chartData = useMemo(() => generate5MinChartData(stock), [stock]);

  const isUp = stock.changePercent > 0;
  const isDown = stock.changePercent < 0;

  // Find min and max price for y-axis padding
  const priceStats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 100, avgVol: 0 };
    let min = Infinity;
    let max = -Infinity;
    let totalVol = 0;
    chartData.forEach((d) => {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
      totalVol += d.volume;
    });
    // Add 1% padding to top/bottom
    const pad = (max - min) * 0.1 || stock.price * 0.01;
    return {
      min: parseFloat((min - pad).toFixed(2)),
      max: parseFloat((max + pad).toFixed(2)),
      avgVol: Math.round(totalVol / chartData.length),
    };
  }, [chartData, stock.price]);

  // Handle opening in a new tab
  const handleOpenNewTab = () => {
    const url = `/chart?symbol=${stock.symbol}`;
    window.open(
      url,
      `StockChart_${stock.symbol}`,
      "width=1100,height=750,resizable=yes,scrollbars=yes"
    );
  };

  // Tooltip content custom renderer for Price Chart
  const CustomPriceTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const changeFromOpen = data.close - stock.openPrice;
      const pctFromOpen = (changeFromOpen / stock.openPrice) * 100;
      const pointIsUp = changeFromOpen > 0;
      const pointIsDown = changeFromOpen < 0;

      return (
        <div className="bg-[#0f141c]/95 border border-slate-800 p-3 rounded-lg shadow-2xl backdrop-blur-md text-xs font-sans">
          <div className="text-slate-400 font-bold mb-1.5 flex items-center justify-between gap-4">
            <span>時間 Period:</span>
            <span className="font-mono text-slate-200">{data.time}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">開盤 Open:</span>
              <span className="font-mono text-slate-300 font-bold">{data.open.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">最高 High:</span>
              <span className="font-mono text-red-400 font-bold">{data.high.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">最低 Low:</span>
              <span className="font-mono text-emerald-400 font-bold">{data.low.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-850 pt-1 mt-1">
              <span className="text-slate-200 font-bold">收盤 Close:</span>
              <span className={`font-mono font-black ${
                pointIsUp ? "text-red-500" : pointIsDown ? "text-emerald-500" : "text-slate-300"
              }`}>{data.close.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[10px]">
              <span className="text-slate-500">較開盤差:</span>
              <span className={`font-mono font-bold ${
                pointIsUp ? "text-red-500" : pointIsDown ? "text-emerald-500" : "text-slate-500"
              }`}>
                {pointIsUp ? "+" : ""}{changeFromOpen.toFixed(2)} ({pointIsUp ? "+" : ""}{pctFromOpen.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip content custom renderer for Volume Chart
  const CustomVolumeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBullish = data.close >= data.open;
      return (
        <div className="bg-[#0f141c]/95 border border-slate-850 p-2.5 rounded-md shadow-xl text-xs font-sans">
          <div className="text-slate-400 font-bold mb-1 flex justify-between gap-3">
            <span>時間 Time:</span>
            <span className="font-mono text-slate-200">{data.time}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">成交量 Vol:</span>
            <span className={`font-mono font-black ${isBullish ? "text-red-500" : "text-emerald-500"}`}>
              {data.volume.toLocaleString("zh-TW")} 張
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id={`chart-window-${stock.symbol}`}
      className={`flex flex-col bg-[#0d1117] text-slate-100 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden ${
        isStandalone ? "w-full h-screen p-4 sm:p-6" : "w-full max-w-4xl h-[640px]"
      }`}
    >
      {/* Top Header/Toolbar */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-[#161b22] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-850">
                {stock.symbol}
              </span>
              <h2 className="text-base font-black tracking-tight text-slate-100">
                {stock.name}
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850">
                {stock.category}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              每5分鐘 價格與成交量即時走勢圖 (5-Min Interval Chart)
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isStandalone && (
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1 text-[11px] font-black text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/60 border border-blue-900/50 px-2.5 py-1.5 rounded-lg transition-all"
              title="在新視窗中獨立開啟此股圖表"
            >
              <ExternalLink className="w-3 h-3" />
              <span>獨立視窗</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="關閉視窗"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Stock Highlight Panel */}
      <div className="px-5 py-3.5 bg-slate-900/40 border-b border-slate-850 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col justify-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">當前價 / 昨收</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-lg font-black font-mono leading-none ${
              isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-200"
            }`}>
              {stock.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/ {stock.openPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col justify-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">當日漲跌</span>
          <div className={`flex items-center gap-1 mt-1 font-black font-mono text-base ${
            isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-500"
          }`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : isDown ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{isUp ? "+" : ""}{stock.change.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col justify-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">當日幅</span>
          <span className={`text-base font-black font-mono mt-1 ${
            isUp ? "text-red-500" : isDown ? "text-emerald-500" : "text-slate-500"
          }`}>
            {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </span>
        </div>

        <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col justify-center col-span-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">總成交量</span>
          <span className="text-base font-black font-mono text-slate-300 mt-1">
            {stock.volume.toLocaleString("zh-TW")} <span className="text-[10px] font-bold text-slate-500">張</span>
          </span>
        </div>

        <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex flex-col justify-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">5分K平均量</span>
          <span className="text-base font-black font-mono text-slate-400 mt-1">
            {priceStats.avgVol.toLocaleString("zh-TW")} <span className="text-[10px] font-bold text-slate-500">張</span>
          </span>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="flex-1 min-h-0 p-5 flex flex-col gap-4 bg-slate-950/20 overflow-y-auto">
        {chartData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
            <span className="text-xs font-bold">載入每5分鐘圖表中...</span>
          </div>
        ) : (
          <>
            {/* 1. Price Area Chart */}
            <div className="flex-[3] min-h-[220px] bg-[#0b0e14] border border-slate-850/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isUp ? "bg-red-500" : isDown ? "bg-emerald-500" : "bg-slate-500"}`}></span>
                  價格走勢 Price (TWD)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  區間最寬: {priceStats.min} ~ {priceStats.max}
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} syncId="stockChartId" margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? "#ef4444" : "#10b981"} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={isUp ? "#ef4444" : "#10b981"} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937/40" opacity={0.3} />
                    <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} stroke="#334155" />
                    <YAxis
                      domain={[priceStats.min, priceStats.max]}
                      tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }}
                      stroke="#334155"
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Tooltip content={<CustomPriceTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={isUp ? "#ef4444" : "#10b981"}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Volume Bar Chart */}
            <div className="flex-[1.2] min-h-[120px] bg-[#0b0e14] border border-slate-850/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                  成交量 Volume (張)
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} syncId="stockChartId" margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937/40" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} stroke="#334155" />
                    <Tooltip content={<CustomVolumeTooltip />} />
                    <Bar
                      dataKey="volume"
                      radius={[2, 2, 0, 0]}
                    >
                      {chartData.map((entry, index) => {
                        const isBullish = entry.close >= entry.open;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isBullish ? "#ef4444" : "#10b981"}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 border-t border-slate-850 bg-[#0a0d14] text-[10px] text-slate-500 font-bold flex flex-col sm:flex-row items-center justify-between gap-2 font-sans uppercase">
        <span>© 2026 台灣股市即時行情模擬看板 · 5分鐘 K線與成交量視窗</span>
        <div className="flex items-center gap-3">
          <span>紅漲綠跌 (台灣習慣)</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span>資料更新: 每4秒模擬同步</span>
        </div>
      </div>
    </div>
  );
}
