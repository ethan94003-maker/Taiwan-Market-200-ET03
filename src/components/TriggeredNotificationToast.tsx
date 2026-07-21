import React from "react";
import { BellRing, X, ArrowUpRight, ArrowDownRight, Mail } from "lucide-react";
import { TriggeredNotification } from "../types";

interface TriggeredNotificationToastProps {
  notifications: TriggeredNotification[];
  onDismiss: (id: string) => void;
  isSimulatedEmailEnabled: boolean;
}

export default function TriggeredNotificationToast({
  notifications,
  onDismiss,
  isSimulatedEmailEnabled,
}: TriggeredNotificationToastProps) {
  // Show only unread/active notifications in the toast queue (limit to latest 3 for clean layout)
  const activeToasts = notifications.filter((n) => !n.isRead).slice(-3);

  if (activeToasts.length === 0) return null;

  return (
    <div id="toast-alerts-viewport" className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {activeToasts.map((toast) => {
        const isAbove = toast.condition === "above";
        return (
          <div
            key={toast.id}
            className="pointer-events-auto w-full bg-[#0d1117]/95 border-l-4 border-amber-500 rounded-lg shadow-2xl p-4 flex gap-3 items-start animate-slideIn backdrop-blur-md"
            style={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Bell Icon */}
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500 flex-shrink-0 animate-bounce">
              <BellRing className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 tracking-wider font-mono bg-slate-950 px-1.5 py-0.2 rounded border border-slate-850">
                  {toast.symbol}
                </span>
                <span className="text-[9px] text-slate-500 font-bold font-mono">{toast.timestamp}</span>
              </div>

              <h4 className="text-xs font-black text-slate-100 mt-1 flex items-center gap-1">
                <span>{toast.stockName}</span>
                <span className={isAbove ? "text-red-500" : "text-emerald-500"}>
                  價格警報已觸發！
                </span>
              </h4>

              <p className="text-[11px] text-slate-300 font-semibold mt-1 font-sans">
                設定條件：{isAbove ? "漲破 ≧" : "跌破 ≦"} ${toast.targetPrice}
                <br />
                <span className="flex items-center gap-0.5 mt-0.5">
                  目前即時報價：
                  <span className={`font-mono font-bold ${isAbove ? "text-red-500" : "text-emerald-500"}`}>
                    ${toast.triggeredPrice}
                  </span>
                  {isAbove ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-500 inline" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500 inline" />
                  )}
                </span>
              </p>

              {isSimulatedEmailEnabled && (
                <div className="mt-2 py-1 px-1.5 bg-slate-950 border border-slate-850 rounded text-[9px] font-bold text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-400" />
                  <span>模擬郵件已寄送至信箱</span>
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
