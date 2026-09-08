import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS, CATEGORIES } from "../data/toolsData";
import {
  Sliders,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Edit2,
  Save,
  Search,
  Shield,
  UserCheck,
  Zap,
  RefreshCw,
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const {
    toolStates,
    toggleToolStatus,
    toggleToolPro,
    updateToolName,
    user,
    setUser,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");

  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingToolId(id);
    setEditNameValue(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editNameValue.trim()) {
      updateToolName(id, editNameValue.trim());
    }
    setEditingToolId(null);
  };

  const handleSwitchRole = (role: "user" | "pro" | "admin") => {
    if (role === "admin") {
      setUser((prev) => ({
        ...prev,
        role: "admin",
        plan: "Enterprise Admin",
        name: "Administrator",
        email: "admin@smallseotools.com",
      }));
    } else if (role === "pro") {
      setUser((prev) => ({
        ...prev,
        role: "pro",
        plan: "Pro Business",
        name: "Pro Subscriber",
        email: "pro@smallseotools.com",
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        role: "user",
        plan: "Free",
        name: "Guest User",
        email: "guest@smallseotools.com",
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              Master Admin & Tools Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle tool availability, enforce PRO subscriptions, modify titles, and switch runtime user test roles.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold px-2">Active Session Role:</span>
          <button
            onClick={() => handleSwitchRole("user")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              user.role === "user" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            Free User
          </button>
          <button
            onClick={() => handleSwitchRole("pro")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              user.role === "pro" ? "bg-amber-500 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            Pro Tier
          </button>
          <button
            onClick={() => handleSwitchRole("admin")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              user.role === "admin" ? "bg-emerald-500 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            Super Admin
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools to manage..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-xs border border-slate-200 rounded-xl outline-hidden focus:border-emerald-500 bg-white font-medium"
          >
            <option value="all">All Categories ({ALL_TOOLS.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 flex justify-between items-center">
          <span>Showing {filteredTools.length} tools</span>
          <span>Click to toggle tool access status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Tool Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Access Tier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTools.map((tool) => {
                const state = toolStates[tool.id] || {
                  enabled: true,
                  isProOnly: tool.badge === "Pro",
                  usageCount: tool.usageCount || 10000,
                  name: tool.name,
                };
                const isEditing = editingToolId === tool.id;

                return (
                  <tr key={tool.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="p-1 border border-emerald-500 rounded text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(tool.id)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{state.name}</span>
                          <button
                            onClick={() => handleStartEdit(tool.id, state.name)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Rename tool"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono block">{tool.id}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{tool.category}</td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {state.usageCount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleToolStatus(tool.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          state.enabled
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                      >
                        {state.enabled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active / Live</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleToolPro(tool.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          state.isProOnly
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {state.isProOnly ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>PRO Only</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-400" />
                            <span>Free for All</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleToolStatus(tool.id)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline"
                      >
                        {state.enabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
