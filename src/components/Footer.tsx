import React from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/toolsData";
import { Shield, Sparkles, Heart, ExternalLink, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  const { setActiveCategory, selectToolById, setPricingModalOpen, setUserDashboardOpen, setAuthModalOpen } = useApp();

  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 text-sm mt-16">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              SEO
            </div>
            <div>
              <h4 className="text-white font-bold text-base">SmallSEOTools Digital Suite</h4>
              <p className="text-xs text-slate-400">90+ high-precision webmaster, SEO & content production tools.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPricingModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Get Pro Access (Unlimited Words)
            </button>
          </div>
        </div>
      </div>

      {/* Main Categories Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Text Analysis</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => selectToolById("plagiarism-checker")} className="hover:text-emerald-400 cursor-pointer">
                Plagiarism Checker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("article-rewriter")} className="hover:text-emerald-400 cursor-pointer">
                Article Rewriter
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("free-grammar-checker")} className="hover:text-emerald-400 cursor-pointer">
                Grammar Checker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("ai-content-detector")} className="hover:text-emerald-400 cursor-pointer">
                AI Content Detector
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("ai-writer")} className="hover:text-emerald-400 cursor-pointer">
                AI Writer
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("ai-humanizer")} className="hover:text-emerald-400 cursor-pointer">
                AI Humanizer
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Design & Images</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => selectToolById("logo-maker")} className="hover:text-emerald-400 cursor-pointer">
                Logo Maker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("resume-builder")} className="hover:text-emerald-400 cursor-pointer">
                Resume Builder
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("meme-generator")} className="hover:text-emerald-400 cursor-pointer">
                Meme Generator
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("image-compressor")} className="hover:text-emerald-400 cursor-pointer">
                Image Compressor
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("compress-image-to-50kb")} className="hover:text-emerald-400 cursor-pointer">
                Compress to 50KB
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("favicon-generator")} className="hover:text-emerald-400 cursor-pointer">
                Favicon Generator
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">SEO & Keywords</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => selectToolById("keywords-density-checker")} className="hover:text-emerald-400 cursor-pointer">
                Keyword Density
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("keyword-research-tool")} className="hover:text-emerald-400 cursor-pointer">
                Keyword Research
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("backlink-checker")} className="hover:text-emerald-400 cursor-pointer">
                Backlink Checker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("website-seo-score-checker")} className="hover:text-emerald-400 cursor-pointer">
                SEO Score Checker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("xml-sitemap-generator")} className="hover:text-emerald-400 cursor-pointer">
                XML Sitemap Generator
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("open-graph-generator")} className="hover:text-emerald-400 cursor-pointer">
                Open Graph Generator
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Domains & Tracking</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => selectToolById("domain-age-checker")} className="hover:text-emerald-400 cursor-pointer">
                Domain Age Checker
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("domain-authority-checker")} className="hover:text-emerald-400 cursor-pointer">
                Domain Authority (DA)
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("check-server-status")} className="hover:text-emerald-400 cursor-pointer">
                Server Status
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("page-authority-checker")} className="hover:text-emerald-400 cursor-pointer">
                Page Authority (PA)
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("geo-ip-locator")} className="hover:text-emerald-400 cursor-pointer">
                GEO IP Locator
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("is-it-down")} className="hover:text-emerald-400 cursor-pointer">
                Is It Down
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">PDF & Utilities</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => selectToolById("merge-pdf")} className="hover:text-emerald-400 cursor-pointer">
                Merge PDF
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("pdf-to-word")} className="hover:text-emerald-400 cursor-pointer">
                PDF To Word
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("compress-pdf")} className="hover:text-emerald-400 cursor-pointer">
                Compress PDF
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("json-viewer")} className="hover:text-emerald-400 cursor-pointer">
                JSON Viewer
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("age-calculator")} className="hover:text-emerald-400 cursor-pointer">
                Age Calculator
              </button>
            </li>
            <li>
              <button onClick={() => selectToolById("password-generator")} className="hover:text-emerald-400 cursor-pointer">
                Password Generator
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SmallSEOTools Pro Suite. All rights reserved. 100% Browser Verified & Live Cloud Ready.</p>
          <div className="flex items-center space-x-5 flex-wrap justify-center">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <button
              onClick={() => setUserDashboardOpen(true)}
              className="text-[#2a69af] hover:text-blue-400 font-semibold cursor-pointer"
            >
              User Account
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1 text-[11px]"
              title="Admin & Member Sign In"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
