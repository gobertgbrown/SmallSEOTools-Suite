import React from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, ALL_TOOLS } from "../data/toolsData";
import { ToolCategory, ToolItem } from "../types";
import {
  FileText,
  Palette,
  Image as ImageIcon,
  Search,
  Link as LinkIcon,
  Globe,
  Activity,
  Server,
  Tag,
  FileSpreadsheet,
  Code,
  Calculator,
  Wrench,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Flame,
  ArrowRight,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "text-analysis": FileText,
  "design-studio": Palette,
  "images-editing": ImageIcon,
  "keywords-tools": Search,
  "backlink-tools": LinkIcon,
  "website-management": Globe,
  "website-tracking": Activity,
  "domains-tools": Server,
  "meta-tags": Tag,
  "online-pdf": FileSpreadsheet,
  development: Code,
  calculators: Calculator,
  "other-tools": Wrench,
};

export const ToolGrid: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectToolById,
    toolStates,
    setPricingModalOpen,
  } = useApp();

  // Filter tools based on active category and search
  const filteredTools = ALL_TOOLS.filter((tool) => {
    const isStateEnabled = toolStates[tool.id]?.enabled !== false;
    if (!isStateEnabled) return false;

    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords?.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  // Group by category if "all" is selected, or single category
  const displayedCategories =
    activeCategory === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>90+ Premium Digital Utilities & AI Engines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          100% Free SEO & Digital Tools
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          The all-in-one webmaster workstation. Check plagiarism, rewrite articles, compress images, inspect backlinks, analyze domain authority, and manipulate PDFs effortlessly.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        <button
          onClick={() => {
            setActiveCategory("all");
            setSearchQuery("");
          }}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
            activeCategory === "all"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Tools ({ALL_TOOLS.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery("");
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.shortName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-emerald-700/60 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search status notice if query exists */}
      {searchQuery.trim() && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="text-xs text-emerald-900 font-medium">
            Showing results for: <span className="font-bold text-emerald-700">"{searchQuery}"</span> ({filteredTools.length} tools found)
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Render Categorized Tool Cards */}
      <div className="space-y-12">
        {displayedCategories.map((cat) => {
          const categoryTools = filteredTools.filter(
            (t) => t.category === cat.id
          );
          if (categoryTools.length === 0) return null;

          const CatIcon = CATEGORY_ICONS[cat.id] || FileText;

          return (
            <div key={cat.id} className="scroll-mt-20" id={cat.id}>
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {categoryTools.length} {categoryTools.length === 1 ? "Tool" : "Tools"}
                </span>
              </div>

              {/* Tools Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryTools.map((tool) => {
                  const isPro = toolStates[tool.id]?.isProOnly;
                  const displayName = toolStates[tool.id]?.name || tool.name;

                  return (
                    <div
                      key={tool.id}
                      onClick={() => selectToolById(tool.id)}
                      className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-4 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top Bar of card */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                            <CatIcon className="w-4 h-4" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {tool.badge && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  tool.badge === "AI"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : tool.badge === "Popular"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : tool.badge === "New"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : tool.badge === "Pro"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {tool.badge}
                              </span>
                            )}
                            {isPro && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                                PRO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {displayName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      {/* Footer link indicator */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-600 font-medium">
                        <span>Free Access</span>
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Use Tool
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Why Choose SmallSEOTools Showcase Section */}
      <div className="mt-20 pt-12 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Why Digital Marketers Choose Us</h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for high accuracy, lightning fast speed, and absolute privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Instant Real-Time Execution</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              No waiting queues or software downloads. Process files, calculate formulas, and audit websites directly in your web browser.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Next-Gen AI Intelligence</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Powered by advanced neural language models for humanizer, grammar correction, deep paraphrasing, and plagiarism detection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">100% Privacy & Data Security</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Your uploaded images, articles, and sensitive files are never permanently saved or shared with third-party networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
