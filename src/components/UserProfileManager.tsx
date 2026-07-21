import React, { useState } from "react";
import { User, LogOut, Check, ChevronDown, UserCheck, Mail, Bell, ShieldCheck, X } from "lucide-react";
import { UserProfile } from "../types";

interface UserProfileManagerProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
  registeredEmails: string[];
  isSimulatedEmailEnabled: boolean;
  onToggleSimulatedEmail: () => void;
}

export default function UserProfileManager({
  currentUser,
  onLogin,
  onLogout,
  registeredEmails,
  isSimulatedEmailEnabled,
  onToggleSimulatedEmail,
}: UserProfileManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regEmail.trim() && regName.trim()) {
      onLogin(regEmail.trim().toLowerCase(), regName.trim());
      setRegEmail("");
      setRegName("");
      setIsRegistering(false);
      setIsOpen(false);
    }
  };

  const handleSwitchAccount = (email: string) => {
    // Look up name or default
    const savedProfiles = localStorage.getItem("tw_stock_profiles");
    let name = "用戶";
    if (savedProfiles) {
      const parsed = JSON.parse(savedProfiles) as UserProfile[];
      const found = parsed.find(p => p.email === email);
      if (found) name = found.name;
    }
    onLogin(email, name);
    setIsOpen(false);
  };

  return (
    <div id="user-profile-manager-root" className="relative">
      {/* Trigger Button */}
      <button
        id="user-profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-bold text-slate-200 transition-colors cursor-pointer"
      >
        <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-[10px] uppercase font-mono">
          {currentUser ? currentUser.name.slice(0, 2) : "G"}
        </div>
        <div className="text-left hidden sm:block">
          <div className="leading-none text-[11px] font-black">{currentUser ? currentUser.name : "訪客瀏覽"}</div>
          <div className="leading-none text-[9px] text-slate-500 font-mono mt-0.5">
            {currentUser ? currentUser.email : "未登入帳戶"}
          </div>
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div id="user-profile-dropdown" className="absolute right-0 mt-2 w-72 bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
          {currentUser ? (
            <div>
              {/* Logged in state info */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-850">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-950/40">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-200 flex items-center gap-1">
                    {currentUser.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Notification preferences */}
              <div className="py-3 border-b border-slate-850">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span>模擬發送 Email 通知</span>
                  </div>
                  <button
                    onClick={onToggleSimulatedEmail}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSimulatedEmailEnabled ? "bg-red-600" : "bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isSimulatedEmailEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase leading-normal">
                  啟用後，價格觸發時系統將同步模擬發送即時郵件至你的註冊信箱。
                </p>
              </div>

              {/* Switch accounts */}
              {registeredEmails.length > 1 && (
                <div className="py-2.5 border-b border-slate-850">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                    快速切換帳戶 Switch Accounts
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {registeredEmails
                      .filter((email) => email !== currentUser.email)
                      .map((email) => (
                        <button
                          key={email}
                          onClick={() => handleSwitchAccount(email)}
                          className="w-full text-left px-2 py-1 text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded font-mono transition-colors cursor-pointer truncate"
                        >
                          {email}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex justify-between gap-2">
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-[10px] font-bold text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                >
                  註冊新帳號
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  安全登出
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center py-2 text-xs text-slate-400 font-bold mb-3">
                請登入或註冊以啟用個人化看盤分組與警示功能
              </div>

              {/* Quick defaults */}
              <div className="mb-3.5 p-2 bg-slate-950 border border-slate-850 rounded-lg">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  快速以測試帳戶登入
                </div>
                <button
                  onClick={() => {
                    onLogin("ethan94003@gmail.com", "Ethan");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 text-xs text-red-400 hover:text-red-300 font-bold flex items-center justify-between rounded hover:bg-red-500/5 cursor-pointer"
                >
                  <span>Ethan (ethan94003@gmail.com)</span>
                  <UserCheck className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  自訂註冊新帳戶 Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Inline registration sub-form */}
          {isRegistering && (
            <div className="absolute inset-0 bg-[#0d1117] rounded-xl p-4 flex flex-col justify-between z-50">
              <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-850">
                <h4 className="text-xs font-black text-slate-200">註冊新帳戶 Registered User</h4>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      電子郵件 Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#0a0b10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      用戶名稱 Name
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="e.g. 投資大師"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-[#0a0b10] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    註冊並登入
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
