import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Lock, Mail, User as UserIcon, CheckCircle2, Shield, Sparkles } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, user, setUser } = useApp();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      email: email || "user@smallseotools.com",
      name: name || (email ? email.split("@")[0] : "Verified Member"),
      plan: "Free",
      role: "user",
    }));
    setAuthModalOpen(false);
  };

  const handleQuickDemo = (role: "user" | "pro" | "admin") => {
    if (role === "admin") {
      setUser({
        id: "usr_admin_999",
        name: "Super Admin",
        email: "admin@smallseotools.com",
        role: "admin",
        plan: "Enterprise Admin",
        reportsGenerated: 42,
        joinedDate: "2024-01-01",
      });
    } else if (role === "pro") {
      setUser({
        id: "usr_pro_555",
        name: "David Vance",
        email: "david@smallseotools.com",
        role: "pro",
        plan: "Pro Business",
        reportsGenerated: 18,
        joinedDate: "2024-06-10",
      });
    } else {
      setUser({
        id: "usr_free_101",
        name: "Guest User",
        email: "guest@smallseotools.com",
        role: "user",
        plan: "Free",
        reportsGenerated: 4,
        joinedDate: "2025-01-15",
      });
    }
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {tab === "login" ? "Sign In to SmallSEOTools" : "Create Free Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access saved reports, higher word thresholds, and cloud history.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              tab === "login"
                ? "text-emerald-700 border-b-2 border-emerald-600 bg-white"
                : "text-slate-500 bg-slate-50 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
              tab === "signup"
                ? "text-emerald-700 border-b-2 border-emerald-600 bg-white"
                : "text-slate-500 bg-slate-50 hover:text-slate-800"
            }`}
          >
            Register Free
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === "signup" && (
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all mt-2"
          >
            {tab === "login" ? "Sign In to Account" : "Register Now"}
          </button>
        </form>

        {/* Quick 1-Click Role Switch for Demonstration */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Profiles
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo("user")}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer text-center"
            >
              Free User
            </button>
            <button
              onClick={() => handleQuickDemo("pro")}
              className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-800 cursor-pointer text-center"
            >
              Pro User
            </button>
            <button
              onClick={() => handleQuickDemo("admin")}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 cursor-pointer text-center"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
