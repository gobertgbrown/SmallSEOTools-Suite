import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS } from "../data/toolsData";
import {
  Search,
  Sparkles,
  Bookmark,
  Shield,
  Activity,
  User as UserIcon,
  Crown,
  ChevronDown,
  Globe,
  Sliders,
  Check,
  X,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    searchQuery,
    setSearchQuery,
    user,
    setAuthModalOpen,
    setPricingModalOpen,
    setSavedReportsModalOpen,
    adminPanelOpen,
    setAdminPanelOpen,
    analyticsViewOpen,
    setAnalyticsViewOpen,
    userDashboardOpen,
    setUserDashboardOpen,
    savedReports,
    scansRemaining,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English (US)");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredTools = searchQuery.trim()
    ? ALL_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    setActiveTool(null);
    setAdminPanelOpen(false);
    setAnalyticsViewOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top utility sub-header */}
      <div className="bg-[#1E293B] text-slate-300 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5 inline-block"></span>
              90+ Free SEO, Content & PDF Digital Utilities
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">100% Browser-Based • Privacy Assured</span>
          </div>

          <div className="flex items-center space-x-5">
            <button
              onClick={() => setPricingModalOpen(true)}
              className="hover:text-amber-300 flex items-center text-amber-400 font-semibold cursor-pointer transition-colors"
            >
              <Crown className="w-3.5 h-3.5 mr-1" />
              Pro Plans (No Ads & Limits)
            </button>

            <button
              onClick={() => setSavedReportsModalOpen(true)}
              className="hover:text-white flex items-center cursor-pointer transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Saved Reports ({savedReports.length})
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center text-slate-300 hover:text-white cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                  {["English (US)", "Español", "Deutsch", "Français", "Urdu", "Hindi"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{lang}</span>
                      {selectedLang === lang && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center cursor-pointer select-none shrink-0" onClick={handleHomeClick}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 mr-2.5">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Small<span className="text-emerald-600">SEO</span>Tools
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide hidden sm:block">
                100% Free SEO & Digital Utilities
              </p>
            </div>
          </div>

          {/* Search bar with instant autocomplete */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-6 relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search 90+ tools (e.g. Plagiarism, Compressor, Age, PDF)..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-900 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/50 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 flex justify-between items-center">
                  <span>Found {filteredTools.length} matching tools</span>
                  <span className="text-[10px] text-slate-400">Press Esc to close</span>
                </div>

                {filteredTools.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No tools match "{searchQuery}". Browse categories below.
                  </div>
                ) : (
                  <div className="py-1 divide-y divide-slate-100">
                    {filteredTools.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          setActiveTool(tool);
                          setAdminPanelOpen(false);
                          setAnalyticsViewOpen(false);
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="px-4 py-2.5 hover:bg-emerald-50/70 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                  tool.badge === "AI"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : tool.badge === "Pro"
                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                          Launch →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time analytics view toggle */}
            <button
              onClick={() => {
                setAnalyticsViewOpen(!analyticsViewOpen);
                setAdminPanelOpen(false);
                setActiveTool(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center transition-all cursor-pointer ${
                analyticsViewOpen
                  ? "bg-[#2a69af] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              title="Real-time Tool Usage & Analytics"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-[#2a69af] animate-pulse" />
              <span className="hidden sm:inline">Live Stats</span>
            </button>

            {/* Admin Panel button - ONLY VISIBLE TO ADMIN */}
            {user.role === "admin" && (
              <button
                onClick={() => {
                  setAdminPanelOpen(!adminPanelOpen);
                  setAnalyticsViewOpen(false);
                  setActiveTool(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center transition-all cursor-pointer ${
                  adminPanelOpen
                    ? "bg-purple-900 text-white shadow-xs"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
                title="Admin Control Center"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Pro Pricing Button */}
            <button
              onClick={() => setPricingModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg shadow-xs shadow-amber-500/20 flex items-center cursor-pointer transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 mr-1" />
              <span className="hidden xs:inline">{user.plan === "Free" ? "Upgrade PRO" : user.plan}</span>
              <span className="xs:hidden">PRO</span>
            </button>

            {/* User Section & Profile Button */}
            <div className="flex items-center gap-1.5">
              {user.isGuest ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setUserDashboardOpen(true)}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Free guest daily limit"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>{user.dailyScansUsed}/{user.dailyLimit} Free Scans</span>
                  </button>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1.5 bg-[#2a69af] hover:bg-[#235893] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    Sign Up Free
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setUserDashboardOpen(true)}
                  className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-[#2a69af] bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  title="User Dashboard & Account Settings"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#2a69af]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2a69af] text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <span className="text-xs font-bold text-slate-800 block max-w-[80px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {user.role === "pro" ? "Unlimited" : `${scansRemaining} left`}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
