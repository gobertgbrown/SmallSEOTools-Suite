import React from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS, CATEGORIES } from "../data/toolsData";
import { TextTools } from "./tools/TextTools";
import { DesignTools } from "./tools/DesignTools";
import { ImageTools } from "./tools/ImageTools";
import { SeoKeywordTools } from "./tools/SeoKeywordTools";
import { PdfOtherTools } from "./tools/PdfOtherTools";
import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export const ToolView: React.FC = () => {
  const { activeTool, setActiveTool, selectToolById, toolStates, setPricingModalOpen, user } = useApp();

  if (!activeTool) return null;

  const categoryObj = CATEGORIES.find((c) => c.id === activeTool.category);
  const isProRequired = toolStates[activeTool.id]?.isProOnly;
  const isProLocked = isProRequired && user.plan === "Free";

  // Related tools from same category
  const relatedTools = ALL_TOOLS.filter(
    (t) => t.category === activeTool.category && t.id !== activeTool.id
  ).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setActiveTool(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => setActiveTool(null)}>
            Home
          </span>
          <span>/</span>
          <span>{categoryObj?.name || activeTool.category}</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{activeTool.name}</span>
        </div>
      </div>

      {/* Tool Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTool.name}
              </h1>
              {activeTool.badge && (
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    activeTool.badge === "AI"
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : activeTool.badge === "Pro"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {activeTool.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {activeTool.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6">
            <div>
              <div className="flex items-center text-amber-500 gap-1 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{activeTool.rating || 4.9}</span>
                <span className="text-slate-400 text-[10px]">/ 5.0</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">User Score</p>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-900 font-bold">
                {(toolStates[activeTool.id]?.usageCount || activeTool.usageCount || 12500).toLocaleString()}+
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Scans Executed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Locked Modal Overlay if Pro tool and Free user */}
      {isProLocked ? (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-md p-10 text-center max-w-xl mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">PRO Plan Required</h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {activeTool.name} is reserved for SmallSEOTools Pro subscribers for high-capacity batch processing and zero queue waiting time.
          </p>
          <button
            onClick={() => setPricingModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Upgrade to Pro Now
          </button>
        </div>
      ) : (
        /* Render Relevant Tool Module */
        <div>
          {activeTool.category === "text-analysis" && <TextTools tool={activeTool} />}
          {activeTool.category === "design-studio" && <DesignTools tool={activeTool} />}
          {activeTool.category === "images-editing" && <ImageTools tool={activeTool} />}
          {(activeTool.category === "keywords-tools" ||
            activeTool.category === "backlink-tools" ||
            activeTool.category === "website-management" ||
            activeTool.category === "website-tracking" ||
            activeTool.category === "domains-tools" ||
            activeTool.category === "meta-tags") && <SeoKeywordTools tool={activeTool} />}
          {(activeTool.category === "online-pdf" ||
            activeTool.category === "development" ||
            activeTool.category === "calculators" ||
            activeTool.category === "other-tools") && <PdfOtherTools tool={activeTool} />}
        </div>
      )}

      {/* How It Works Guide Section */}
      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          How to Use {activeTool.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-2.5">
              1
            </span>
            <h4 className="font-bold text-slate-900 mb-1">Enter Input Data or File</h4>
            <p className="text-slate-500 leading-relaxed">
              Paste text, input target domain, or upload files directly from your computer or phone.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-2.5">
              2
            </span>
            <h4 className="font-bold text-slate-900 mb-1">Click Run Analysis</h4>
            <p className="text-slate-500 leading-relaxed">
              Our automated server algorithms inspect data points against high-accuracy search indexes.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-2.5">
              3
            </span>
            <h4 className="font-bold text-slate-900 mb-1">Download & Save Report</h4>
            <p className="text-slate-500 leading-relaxed">
              Copy results in 1-click, save to your persistent account history, or download clean PDF/TXT files.
            </p>
          </div>
        </div>
      </div>

      {/* Related Complementary Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-base text-slate-900 mb-4">
            More Tools in {categoryObj?.name || "This Category"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rt) => (
              <div
                key={rt.id}
                onClick={() => selectToolById(rt.id)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
              >
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {rt.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {rt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
