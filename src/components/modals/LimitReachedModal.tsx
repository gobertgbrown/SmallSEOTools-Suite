import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, Crown, ShieldAlert } from "lucide-react";

export const LimitReachedModal: React.FC = () => {
  const { limitModalOpen, setLimitModalOpen, loginUser, setPricingModalOpen } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");

  if (!limitModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || (email ? email.split("@")[0] : "Verified Member"),
      email: email.trim() || "member@example.com",
      role: "user",
      plan: "Free",
      isGuest: false,
      dailyLimit: 15,
    });
  };

  const handleQuickBypass = (role: "user" | "pro") => {
    if (role === "pro") {
      loginUser({
        name: "Pro Explorer",
        email: "pro@smallseotools.com",
        role: "pro",
        plan: "Pro Business",
        isGuest: false,
        dailyLimit: 9999,
      });
    } else {
      loginUser({
        name: "Registered Free Member",
        email: "member@smallseotools.com",
        role: "user",
        plan: "Free",
        isGuest: false,
        dailyLimit: 15,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={() => setLimitModalOpen(false)}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-200/60 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Free Guest Daily Limit Reached (3/3)
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1.5 leading-relaxed">
            You have used all 3 free anonymous guest scans today. Sign up for a 100% Free Account in 15 seconds to unlock 15 daily scans!
          </p>
        </div>

        {/* Perks Comparison */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              What you get with a Free Account:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>15 daily scans</strong> (5x more)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved Cloud Report history</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant PDF & file exports</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-speed AI model routing</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm outline-hidden focus:border-[#2a69af] focus:ring-1 focus:ring-[#2a69af]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm outline-hidden focus:border-[#2a69af] focus:ring-1 focus:ring-[#2a69af]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm outline-hidden focus:border-[#2a69af] focus:ring-1 focus:ring-[#2a69af]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2a69af] hover:bg-[#235893] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{mode === "signup" ? "Create Free Account & Continue (15 Scans)" : "Sign In & Continue"}</span>
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="text-center text-xs text-slate-500">
            {mode === "signup" ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#2a69af] font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#2a69af] font-bold hover:underline cursor-pointer"
                >
                  Create Free Account
                </button>
              </span>
            )}
          </div>

          {/* Fast Testing Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Instant Demo Mode:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickBypass("user")}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Unlock Free Member (15 Scans)
              </button>
              <button
                type="button"
                onClick={() => handleQuickBypass("pro")}
                className="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                <Crown className="w-3 h-3 text-amber-500" /> PRO (Unlimited)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
