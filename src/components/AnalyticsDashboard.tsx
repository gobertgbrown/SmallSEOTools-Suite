import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS, CATEGORIES } from "../data/toolsData";
import {
  Activity,
  Users,
  Zap,
  Globe,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  const { liveActivities, toolStates, selectToolById } = useApp();

  const [activeUsers, setActiveUsers] = useState(1482);
  const [totalScansToday, setTotalScansToday] = useState(184290);
  const [avgResponseTime, setAvgResponseTime] = useState(385);
  const [isLiveStreamOn, setIsLiveStreamOn] = useState(true);

  // Periodic subtle fluctuation to simulate live traffic
  useEffect(() => {
    if (!isLiveStreamOn) return;
    const timer = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 7) - 3);
      setTotalScansToday((prev) => prev + Math.floor(Math.random() * 4) + 1);
      setAvgResponseTime((prev) => Math.max(280, prev + Math.floor(Math.random() * 11) - 5));
    }, 3500);
    return () => clearInterval(timer);
  }, [isLiveStreamOn]);

  // Top tools leaderboard
  const topTools = ALL_TOOLS.map((t) => ({
    ...t,
    currentUsage: toolStates[t.id]?.usageCount || t.usageCount || 10000,
  }))
    .sort((a, b) => b.currentUsage - a.currentUsage)
    .slice(0, 8);

  const categoryDistribution = [
    { name: "Text Analysis Tools", percent: 36, count: "66,340", color: "bg-emerald-500" },
    { name: "Image Editing Tools", percent: 26, count: "47,910", color: "bg-blue-500" },
    { name: "Keywords & SEO Auditing", percent: 18, count: "33,170", color: "bg-purple-500" },
    { name: "Online PDF Tools", percent: 12, count: "22,110", color: "bg-amber-500" },
    { name: "Domains & Web Tracking", percent: 8, count: "14,760", color: "bg-rose-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Platform Analytics
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global telemetry, processing loads, and tool engagement metrics streaming live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStreamOn(!isLiveStreamOn)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isLiveStreamOn
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreamOn ? "animate-spin" : ""}`} />
            <span>{isLiveStreamOn ? "Live Polling Active" : "Polling Paused"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Active Users</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {activeUsers.toLocaleString()}
          </div>
          <div className="flex items-center text-emerald-600 text-xs font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>+14.2% from last hour</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Scans Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalScansToday.toLocaleString()}
          </div>
          <div className="flex items-center text-blue-600 text-xs font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>99.98% Success SLA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Execution Latency</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {avgResponseTime} ms
          </div>
          <div className="flex items-center text-emerald-600 text-xs font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>Fast CDN Response</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Countries</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            142
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Top: US, UK, DE, PK, IN, CA
          </div>
        </div>
      </div>

      {/* Main Analytics Content: Live Feed & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Execution Stream */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Live Global Activity Stream</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Real-Time Ingestion</span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {liveActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 flex items-center justify-center text-[10px]">
                    {act.countryCode}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{act.toolName}</span>
                    <p className="text-[11px] text-slate-500">
                      {act.country} • <span className="text-emerald-600 font-medium">{act.category}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {act.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Tools Leaderboard */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Top Performing Tools</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">By Total Runs</span>
          </div>

          <div className="space-y-3">
            {topTools.map((tool, idx) => (
              <div
                key={tool.id}
                onClick={() => selectToolById(tool.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 flex items-center justify-between cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-black text-slate-400 group-hover:text-emerald-600 text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                      {tool.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{tool.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900">
                    {tool.currentUsage.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">+8.4%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Usage Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Category Traffic Distribution</h3>

        <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          {categoryDistribution.map((cat, i) => (
            <div
              key={i}
              style={{ width: `${cat.percent}%` }}
              className={`${cat.color} transition-all duration-500`}
              title={`${cat.name}: ${cat.percent}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {categoryDistribution.map((cat, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                <span className="font-bold text-slate-800">{cat.percent}%</span>
              </div>
              <span className="font-semibold text-slate-700 block truncate">{cat.name}</span>
              <span className="text-[10px] text-slate-400">{cat.count} calls</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
