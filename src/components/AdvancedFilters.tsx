import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export interface FilterParams {
  category: string;
  marketCap: string; // "all" | "large" | "mid" | "small"
  volume: string;    // "all" | "heavy" | "mid" | "light"
  peRatio: string;   // "all" | "low" | "mid" | "high"
  dividendYield: string; // "all" | "high" | "mid" | "low"
}

interface AdvancedFiltersProps {
  categories: string[];
  params: FilterParams;
  onChange: (params: FilterParams) => void;
  onReset: () => void;
}

export default function AdvancedFilters({ categories, params, onChange, onReset }: AdvancedFiltersProps) {
  const handleSelectChange = (key: keyof FilterParams, value: string) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  return (
    <div id="advanced-filters-panel" className="bg-[#161b22]/50 border border-slate-850 rounded-xl p-4 mt-3 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      {/* Category */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
          產業類別 Category
        </label>
        <select
          value={params.category}
          onChange={(e) => handleSelectChange("category", e.target.value)}
          className="w-full bg-[#0a0b10] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Market Cap */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
          企業市值 Market Cap
        </label>
        <select
          value={params.marketCap}
          onChange={(e) => handleSelectChange("marketCap", e.target.value)}
          className="w-full bg-[#0a0b10] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
        >
          <option value="all">不限全部 (All)</option>
          <option value="large">大型權值股 (&gt; 1,000億)</option>
          <option value="mid">中型中堅股 (200億 - 1,000億)</option>
          <option value="small">小型潛力股 (&lt; 200億)</option>
        </select>
      </div>

      {/* Trading Volume */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
          成交量 Trading Volume
        </label>
        <select
          value={params.volume}
          onChange={(e) => handleSelectChange("volume", e.target.value)}
          className="w-full bg-[#0a0b10] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
        >
          <option value="all">不限全部 (All)</option>
          <option value="heavy">爆量熱門股 (&gt; 8,000 張)</option>
          <option value="mid">一般穩健股 (2,000 - 8,000 張)</option>
          <option value="light">低量冷門股 (&lt; 2,000 張)</option>
        </select>
      </div>

      {/* PE Ratio */}
      <div>
        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
          本益比 Valuation (P/E)
        </label>
        <select
          value={params.peRatio}
          onChange={(e) => handleSelectChange("peRatio", e.target.value)}
          className="w-full bg-[#0a0b10] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer"
        >
          <option value="all">不限全部 (All)</option>
          <option value="low">低估值價值股 (&lt; 15倍)</option>
          <option value="mid">合理穩定區 (15倍 - 30倍)</option>
          <option value="high">高成長期待股 (&gt; 30倍)</option>
        </select>
      </div>

      {/* Dividend Yield */}
      <div className="relative">
        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
          殖利率 Dividend Yield
        </label>
        <select
          value={params.dividendYield}
          onChange={(e) => handleSelectChange("dividendYield", e.target.value)}
          className="w-full bg-[#0a0b10] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-bold cursor-pointer pr-16"
        >
          <option value="all">不限全部 (All)</option>
          <option value="high">高股息定存股 (&gt; 5%)</option>
          <option value="mid">一般配息股 (2% - 5%)</option>
          <option value="low">低配息成長股 (&lt; 2%)</option>
        </select>

        <button
          onClick={onReset}
          className="absolute -right-0 -top-7 text-[10px] font-black text-slate-500 hover:text-red-500 flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
          title="清除所有篩選條件"
        >
          <RotateCcw className="w-3 h-3" />
          重置 Reset
        </button>
      </div>
    </div>
  );
}
