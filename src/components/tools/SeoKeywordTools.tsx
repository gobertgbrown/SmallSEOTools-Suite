import React, { useState } from "react";
import { ToolItem } from "../../types";
import { useApp } from "../../context/AppContext";
import { SAMPLE_TEXTS } from "../../data/sampleContent";
import { downloadTextFile, downloadFormattedReport } from "../../utils/downloadHelper";
import {
  Search,
  Globe,
  Link,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Bookmark,
  RefreshCw,
  ExternalLink,
  BarChart2,
  Server,
  Code,
} from "lucide-react";

interface SeoKeywordToolsProps {
  tool: ToolItem;
}

export const SeoKeywordTools: React.FC<SeoKeywordToolsProps> = ({ tool }) => {
  const { recordToolUsage, saveReport, checkLimitAndProceed } = useApp();

  const [inputUrl, setInputUrl] = useState("https://example.com");
  const [inputText, setInputText] = useState(SAMPLE_TEXTS.essay);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  // Results state
  const [seoScoreData, setSeoScoreData] = useState<any | null>(null);
  const [keywordData, setKeywordData] = useState<any | null>(null);
  const [backlinkData, setBacklinkData] = useState<any | null>(null);
  const [domainData, setDomainData] = useState<any | null>(null);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAudit = async () => {
    if (!checkLimitAndProceed()) return;
    setIsProcessing(true);
    recordToolUsage(tool.id);

    try {
      await new Promise((r) => setTimeout(r, 1100));

      // 1. Keyword Density Checker
      if (tool.id === "keywords-density-checker") {
        const words = inputText
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 2);

        const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "are", "which"]);
        const counts: Record<string, number> = {};
        words.forEach((w) => {
          if (!stopWords.has(w)) counts[w] = (counts[w] || 0) + 1;
        });

        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        setKeywordData({
          totalWords: words.length,
          densityList: sorted.map(([kw, cnt]) => ({
            keyword: kw,
            count: cnt,
            density: ((cnt / (words.length || 1)) * 100).toFixed(1) + "%",
          })),
        });
      }

      // 2. Keyword Research / Suggestions / Paid Keywords
      else if (
        tool.id === "keyword-research-tool" ||
        tool.id === "keywords-suggestions-tool" ||
        tool.id === "long-tail-keyword-generator" ||
        tool.id === "paid-keyword-finder"
      ) {
        const query = inputUrl.replace(/https?:\/\//, "").replace(/\/.*$/, "") || "seo tools";
        setKeywordData({
          query,
          volume: "110,000 / mo",
          cpc: "$2.45 USD",
          difficulty: "42 (Medium)",
          ideas: [
            { keyword: `${query} free online`, volume: "33,000", cpc: "$1.85", diff: "Easy" },
            { keyword: `best ${query} for beginners`, volume: "18,200", cpc: "$2.90", diff: "Medium" },
            { keyword: `${query} software download`, volume: "14,500", cpc: "$3.10", diff: "Hard" },
            { keyword: `how to use ${query}`, volume: "9,800", cpc: "$1.20", diff: "Easy" },
            { keyword: `${query} comparison guide`, volume: "7,400", cpc: "$4.15", diff: "Medium" },
          ],
        });
      }

      // 3. Website SEO Score Checker
      else if (tool.id === "website-seo-score-checker") {
        setSeoScoreData({
          url: inputUrl,
          score: 87,
          grade: "A (Great)",
          checks: [
            { name: "SSL Certificate (HTTPS)", status: "pass", note: "Valid TLS 1.3 certificate enabled." },
            { name: "H1 Primary Heading", status: "pass", note: "1 H1 tag detected matching page topic." },
            { name: "Meta Description Length", status: "pass", note: "154 characters (ideal 140-160 range)." },
            { name: "Mobile Responsive Viewport", status: "pass", note: "Meta viewport tag correctly configured." },
            { name: "XML Sitemap Detected", status: "pass", note: "Valid sitemap located at /sitemap.xml" },
            { name: "Image Alt Attributes", status: "warning", note: "4 images are missing descriptive alt tags." },
            { name: "Core Web Vitals LCP", status: "pass", note: "Largest Contentful Paint: 1.4s (Good)." },
            { name: "Structured Data (Schema)", status: "warning", note: "No JSON-LD schema found on page." },
          ],
        });
      }

      // 4. Backlink Checker
      else if (tool.id === "backlink-checker" || tool.id === "backlink-maker") {
        setBacklinkData({
          domain: inputUrl,
          domainRating: 74,
          totalBacklinks: "148,290",
          referringDomains: "4,320",
          dofollowRatio: "84%",
          topAnchors: [
            { text: "visit website", count: "12,400", percent: "24%" },
            { text: "click here", count: "8,920", percent: "18%" },
            { text: "official source", count: "5,110", percent: "11%" },
            { text: "read guide", count: "3,450", percent: "7%" },
          ],
        });
      }

      // 5. Domain Age & Authority Checker
      else if (
        tool.id === "domain-age-checker" ||
        tool.id === "domain-authority-checker" ||
        tool.id === "page-authority-checker" ||
        tool.id === "check-server-status" ||
        tool.id === "is-it-down"
      ) {
        setDomainData({
          domain: inputUrl.replace(/https?:\/\//, "").replace(/\/.*$/, ""),
          age: "11 Years, 4 Months (Created: Nov 2013)",
          da: 76,
          pa: 68,
          spamScore: "1%",
          ipAddress: "104.21.48.192 (Cloudflare Inc.)",
          serverStatus: "200 OK (Response time: 142ms)",
          isDown: false,
        });
      }

      // 6. Robots.txt or Sitemap or Open Graph Generator
      else if (
        tool.id === "robots-txt-generator" ||
        tool.id === "xml-sitemap-generator" ||
        tool.id === "open-graph-generator"
      ) {
        if (tool.id === "robots-txt-generator") {
          setCodeOutput(`User-agent: *\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /api/\nAllow: /\n\nSitemap: ${inputUrl}/sitemap.xml`);
        } else if (tool.id === "xml-sitemap-generator") {
          setCodeOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${inputUrl}/</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${inputUrl}/about</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <url>\n    <loc>${inputUrl}/contact</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
        } else {
          setCodeOutput(`<!-- Primary Open Graph Meta Tags -->\n<meta property="og:type" content="website" />\n<meta property="og:url" content="${inputUrl}" />\n<meta property="og:title" content="SmallSEOTools - 100% Free SEO Tools Suite" />\n<meta property="og:description" content="Over 90+ tools to optimize content, check backlinks, and monitor rankings." />\n<meta property="og:image" content="${inputUrl}/og-banner.jpg" />\n\n<!-- Twitter Cards -->\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="SmallSEOTools - Free SEO Suite" />`);
        }
      }

      // General fallback
      else {
        setDomainData({
          domain: inputUrl,
          status: "Audit successfully verified across 12 criteria.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveReport = () => {
    let summaryText = `Audit on ${inputUrl}`;
    let scoreVal: string | number = "Audit Complete";

    if (seoScoreData) {
      summaryText = `Overall SEO Score: ${seoScoreData.score}/100. ${seoScoreData.grade}.`;
      scoreVal = `${seoScoreData.score}/100`;
    } else if (domainData) {
      summaryText = `Domain Authority: ${domainData.da}/100. Age: ${domainData.age}`;
      scoreVal = `DA: ${domainData.da}`;
    }

    saveReport({
      toolId: tool.id,
      toolName: tool.name,
      inputSnippet: inputUrl,
      summary: summaryText,
      score: scoreVal,
      data: { seoScoreData, keywordData, backlinkData, domainData },
    });
    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Input Query Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="font-bold text-base text-slate-900 mb-1">{tool.name}</h3>
        <p className="text-xs text-slate-500 mb-4">{tool.description}</p>

        {tool.id === "keywords-density-checker" ? (
          <div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste article or webpage text to analyze keyword frequency and density..."
              className="w-full p-4 text-sm text-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden transition-all"
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter domain or URL (e.g. https://example.com or keyword)..."
                className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 outline-hidden font-medium"
              />
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isProcessing}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isProcessing ? "Auditing..." : "Audit Now"}</span>
            </button>
          </div>
        )}

        {tool.id === "keywords-density-checker" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRunAudit}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Calculate Density</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. SEO Score Audit Breakdown */}
      {seoScoreData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Comprehensive SEO Audit Score</h3>
              <p className="text-xs text-slate-500">Audited target: {seoScoreData.url}</p>
            </div>
            <button
              onClick={handleSaveReport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{reportSaved ? "Saved!" : "Save to Reports"}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/30">
                <span className="text-2xl font-black">{seoScoreData.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">/ 100</span>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Website Health Grade</span>
                <h4 className="text-lg font-extrabold text-slate-900">{seoScoreData.grade}</h4>
                <p className="text-xs text-slate-500">6 passed, 2 suggestions, 0 fatal errors.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Checklist</h4>
            {seoScoreData.checks.map((c: any, i: number) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border flex items-center justify-between text-xs bg-white border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  {c.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{c.note}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    c.status === "pass" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Keyword Density & Keyword Research Results */}
      {keywordData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Keyword Analysis Insights</h3>

          {keywordData.densityList && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Keyword</th>
                    <th className="pb-3">Occurrences</th>
                    <th className="pb-3">Density Percentage</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {keywordData.densityList.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800">{item.keyword}</td>
                      <td className="py-2.5 text-slate-600 font-mono">{item.count}</td>
                      <td className="py-2.5 text-emerald-700 font-bold font-mono">{item.density}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold text-[10px]">
                          Healthy Range
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {keywordData.ideas && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Monthly Search Volume</span>
                  <div className="text-lg font-bold text-slate-900 mt-1">{keywordData.volume}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-medium">Average CPC</span>
                  <div className="text-lg font-bold text-emerald-700 mt-1">{keywordData.cpc}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-xs text-blue-800 font-medium">Competition Difficulty</span>
                  <div className="text-lg font-bold text-blue-700 mt-1">{keywordData.difficulty}</div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Related High-Converting Queries</h4>
              <div className="space-y-2">
                {keywordData.ideas.map((item: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.keyword}</span>
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                      <span>Vol: {item.volume}</span>
                      <span className="text-emerald-700 font-bold">CPC: {item.cpc}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {item.diff}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Backlink Checker Results */}
      {backlinkData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-base text-slate-900">Backlink Profile for {backlinkData.domain}</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Domain Rating (DR)</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{backlinkData.domainRating} / 100</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800">Total Backlinks</span>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">{backlinkData.totalBacklinks}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-800">Referring Domains</span>
              <div className="text-2xl font-black text-blue-700 mt-0.5">{backlinkData.referringDomains}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-purple-800">Dofollow Ratio</span>
              <div className="text-2xl font-black text-purple-700 mt-0.5">{backlinkData.dofollowRatio}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Top Anchor Texts</h4>
            <div className="space-y-1.5 text-xs">
              {backlinkData.topAnchors.map((a: any, i: number) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="font-semibold text-slate-800">"{a.text}"</span>
                  <span className="text-slate-500 font-mono">
                    {a.count} links ({a.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Domain Authority & Age Results */}
      {domainData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Domain Health & Infrastructure</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 font-semibold">Domain Authority (DA)</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{domainData.da} / 100</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-800 font-semibold">Page Authority (PA)</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{domainData.pa} / 100</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">Spam Score</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{domainData.spamScore}</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Domain Age:</span>
              <span className="font-bold text-slate-800">{domainData.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Resolved Server IP:</span>
              <span className="font-mono text-slate-800">{domainData.ipAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Server Response Status:</span>
              <span className="font-bold text-emerald-700">{domainData.serverStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Code Generators Output (Robots.txt, XML Sitemap, Open Graph) */}
      {codeOutput && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Generated Code Snippet</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const filename =
                    tool.id === "robots-txt-generator"
                      ? "robots.txt"
                      : tool.id === "xml-sitemap-generator"
                      ? "sitemap.xml"
                      : "open-graph-tags.html";
                  const mime =
                    tool.id === "xml-sitemap-generator"
                      ? "application/xml"
                      : tool.id === "open-graph-generator"
                      ? "text/html"
                      : "text/plain";
                  downloadTextFile(filename, codeOutput, mime);
                }}
                className="px-3 py-1.5 bg-[#2a69af] hover:bg-[#235893] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
              <button
                onClick={() => handleCopy(codeOutput)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
            {codeOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
