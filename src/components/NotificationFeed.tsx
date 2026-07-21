import React, { useState } from "react";
import { Bell, BellOff, CheckCheck, Trash2, X, AlertCircle } from "lucide-react";
import { TriggeredNotification } from "../types";

interface NotificationFeedProps {
  notifications: TriggeredNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export default function NotificationFeed({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClear,
  onRemove,
}: NotificationFeedProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notification-feed-root" className="relative">
      {/* Feed Toggle Button */}
      <button
        id="notification-feed-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[#161b22] border border-slate-800 hover:border-slate-700 hover:text-slate-100 rounded-lg text-slate-300 transition-all cursor-pointer flex items-center justify-center"
        title="歷史警示通知"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? "animate-swing" : ""}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-[#080c14] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Feed Box */}
      {isOpen && (
        <div id="notification-feed-dropdown" className="absolute right-0 mt-2 w-80 bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-850">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-200 tracking-wider uppercase font-mono">
                警示訊息通知 Alerts Feed
              </span>
              {unreadCount > 0 && (
                <span className="text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1 py-0.2 rounded">
                  {unreadCount} 筆未讀
                </span>
              )}
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions Bar */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between py-2 text-[10px] text-slate-500 font-bold border-b border-slate-850/60 uppercase tracking-wider">
              <button
                onClick={onMarkAllRead}
                className="hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                全部標記已讀 Mark All Read
              </button>
              <button
                onClick={onClear}
                className="hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清除全部 Clear All
              </button>
            </div>
          )}

          {/* List content */}
          <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs font-bold flex flex-col items-center justify-center gap-2">
                <BellOff className="w-8 h-8 text-slate-700" />
                <span>無任何警示通知紀錄</span>
              </div>
            ) : (
              [...notifications].reverse().map((notif) => {
                const isAbove = notif.condition === "above";
                return (
                  <div
                    key={notif.id}
                    onClick={() => onMarkRead(notif.id)}
                    className={`p-2.5 rounded-lg border text-[11px] font-bold transition-all relative cursor-pointer group ${
                      notif.isRead
                        ? "bg-[#161b22]/20 border-slate-900/60 text-slate-400 opacity-70"
                        : "bg-red-500/5 border-red-500/20 text-slate-200"
                    }`}
                  >
                    {/* Unread circle badge */}
                    {!notif.isRead && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] bg-slate-950 px-1 py-0.2 border border-slate-850 rounded">
                        {notif.symbol}
                      </span>
                      <span className="font-bold">{notif.stockName}</span>
                      <span className="text-[9px] text-slate-500 font-medium font-mono ml-auto">
                        {notif.timestamp}
                      </span>
                    </div>

                    <div className="mt-1 text-slate-400 font-medium leading-normal pr-5">
                      觸發價格：現價{" "}
                      <span className={`font-bold font-mono ${isAbove ? "text-red-500" : "text-emerald-500"}`}>
                        ${notif.triggeredPrice}
                      </span>{" "}
                      已{isAbove ? "突破 ≧" : "跌破 ≦"} 目標價 ${notif.targetPrice}
                    </div>

                    {/* Delete button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notif.id);
                      }}
                      className="absolute bottom-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      title="刪除紀錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
