import React, { useState, useRef } from "react";
import { ToolItem } from "../../types";
import { useApp } from "../../context/AppContext";
import { downloadSvgAsPngOrSvg, downloadTextFile } from "../../utils/downloadHelper";
import {
  Download,
  Copy,
  Check,
  Palette,
  Sparkles,
  Type,
  Plus,
  Trash2,
  Share2,
  Printer,
  Smile,
  FileText,
} from "lucide-react";

interface DesignToolsProps {
  tool: ToolItem;
}

export const DesignTools: React.FC<DesignToolsProps> = ({ tool }) => {
  const { recordToolUsage, checkLimitAndProceed } = useApp();
  const [copiedEmoji, setCopiedEmoji] = useState("");

  // 1. Logo Maker State
  const [logoName, setLogoName] = useState("VORTEX");
  const [logoSlogan, setLogoSlogan] = useState("NEXT GENERATION SEO");
  const [logoIcon, setLogoIcon] = useState("zap");
  const [logoColor, setLogoColor] = useState("#10B981");
  const [logoBg, setLogoBg] = useState("#0F172A");
  const [logoShape, setLogoShape] = useState("rounded");

  // 2. Resume Builder State
  const [resume, setResume] = useState({
    fullName: "Alex Morgan",
    title: "Senior Digital Marketing Strategist",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    summary:
      "Results-driven SEO professional with 6+ years optimizing enterprise content architectures, increasing organic traffic by over 340%, and driving high conversion ROI.",
    skills: ["Technical SEO", "Content Marketing", "Google Analytics 4", "Keyword Strategy", "Python Data Scripts", "A/B Testing"],
    experience: [
      {
        company: "Apex Media Group",
        role: "Lead SEO Manager",
        years: "2022 - Present",
        details: "Managed 14-person content team, oversaw site migrations, increased organic revenue by $1.8M.",
      },
      {
        company: "Digital Growth Lab",
        role: "SEO Analyst",
        years: "2019 - 2022",
        details: "Conducted technical audits, resolved crawl budget bottlenecks, and published monthly SERP reports.",
      },
    ],
  });

  // 3. Meme Generator State
  const [memeTemplate, setMemeTemplate] = useState("drake");
  const [memeTopText, setMemeTopText] = useState("Relying on manual keyword research");
  const [memeBottomText, setMemeBottomText] = useState("Using SmallSEOTools in 1 click");

  // 4. Business Card State
  const [cardData, setCardData] = useState({
    name: "Sarah Jenkins",
    title: "Chief Executive Officer",
    company: "Nexus Enterprises",
    phone: "+1 (800) 555-0199",
    email: "sarah@nexus.io",
    website: "www.nexus.io",
    themeColor: "#059669",
  });

  // Emoji library
  const EMOJI_CATEGORIES = [
    {
      name: "Smileys & Emotion",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😎", "🤩", "🥳", "🤔", "🤫", "🤗", "🤖", "👻", "🔥", "✨", "💯", "💖"],
    },
    {
      name: "Gestures & People",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🚀", "🎯", "💡", "🧠", "👑", "🏆", "💎"],
    },
    {
      name: "SEO & Digital",
      emojis: ["📈", "📊", "📉", "💻", "🖥️", "📱", "🌐", "🔍", "🔎", "🔗", "📑", "📂", "📌", "⚙️", "🛠️", "⏳", "⏱️", "⚡", "🌟", "🟢", "🔴", "✅", "❌"],
    },
  ];

  const handleCopyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    recordToolUsage(tool.id);
    setTimeout(() => setCopiedEmoji(""), 1500);
  };

  const handleDownloadSVG = (elementId: string, filename: string) => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    downloadSvgAsPngOrSvg(elementId, filename, "png");
  };

  const handleDownloadResume = () => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    const textContent = `=====================================================
${resume.fullName.toUpperCase()}
${resume.title}
Email: ${resume.email} | Phone: ${resume.phone} | Location: ${resume.location}
=====================================================

PROFESSIONAL SUMMARY
${resume.summary}

WORK EXPERIENCE
${resume.experience
  .map(
    (exp) => `• ${exp.role} - ${exp.company} (${exp.years})
  ${exp.details}`
  )
  .join("\n\n")}

CORE COMPETENCIES & SKILLS
${resume.skills.join(" • ")}

=====================================================
Generated via SmallSEOTools Design Studio`;

    downloadTextFile(`${resume.fullName.replace(/\s+/g, "_")}_Resume.doc`, textContent, "application/msword");
  };

  return (
    <div className="space-y-6">
      {/* 1. Logo Maker */}
      {tool.id === "logo-maker" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              Logo Configuration
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Brand / Company Name</label>
              <input
                type="text"
                value={logoName}
                onChange={(e) => setLogoName(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Tagline / Slogan</label>
              <input
                type="text"
                value={logoSlogan}
                onChange={(e) => setLogoSlogan(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{logoColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Canvas Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logoBg}
                    onChange={(e) => setLogoBg(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{logoBg}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Icon Shape Emblem</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "zap", label: "Bolt" },
                  { id: "shield", label: "Shield" },
                  { id: "star", label: "Star" },
                  { id: "globe", label: "Globe" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLogoIcon(item.id)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border cursor-pointer ${
                      logoIcon === item.id
                        ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleDownloadSVG("custom-logo-svg", `${logoName.toLowerCase()}-logo.svg`)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Download className="w-4 h-4" />
              Download Vector Logo (SVG)
            </button>
          </div>

          {/* Live Preview Canvas */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Real-Time High Definition Vector Preview
            </div>

            <div
              style={{ backgroundColor: logoBg }}
              className="p-10 rounded-2xl shadow-xl flex flex-col items-center justify-center w-full max-w-sm aspect-video transition-all"
            >
              <svg id="custom-logo-svg" viewBox="0 0 320 200" className="w-full h-full">
                {/* Background */}
                <rect width="320" height="200" fill={logoBg} rx="16" />

                {/* Icon Emblem */}
                <g transform="translate(130, 25)">
                  <circle cx="30" cy="30" r="28" fill={logoColor} fillOpacity="0.2" />
                  <circle cx="30" cy="30" r="20" fill={logoColor} />
                  {logoIcon === "zap" ? (
                    <path d="M32 18L22 32h10l-2 14 12-16H32l2-12z" fill="#ffffff" />
                  ) : logoIcon === "shield" ? (
                    <path d="M30 18l12 5v9c0 8-6 15-12 18-6-3-12-10-12-18v-9l12-5z" fill="#ffffff" />
                  ) : logoIcon === "star" ? (
                    <polygon points="30,18 34,26 43,27 36,34 38,42 30,38 22,42 24,34 17,27 26,26" fill="#ffffff" />
                  ) : (
                    <circle cx="30" cy="30" r="10" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                  )}
                </g>

                {/* Typography */}
                <text
                  x="160"
                  y="125"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="800"
                  fontSize="22"
                  letterSpacing="2"
                >
                  {logoName}
                </text>

                <text
                  x="160"
                  y="150"
                  textAnchor="middle"
                  fill={logoColor}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                  fontSize="9"
                  letterSpacing="3"
                >
                  {logoSlogan}
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 2. Resume Builder */}
      {tool.id === "resume-builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-h-[700px] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900">Resume Details</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Email</label>
                  <input
                    type="text"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDownloadResume}
                className="flex-1 py-2.5 bg-[#2a69af] hover:bg-[#235893] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download Resume (.doc)
              </button>
              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                title="Print Preview"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* Resume A4 Live Preview */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
              <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{resume.fullName}</h1>
                <p className="text-xs font-bold text-emerald-700 tracking-wide mt-0.5">{resume.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {resume.email} • {resume.phone} • {resume.location}
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Profile Summary</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{resume.summary}</p>
              </div>

              <div className="mb-4">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Work Experience</h2>
                <div className="space-y-3">
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-500 text-[11px]">{exp.years}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-normal">{exp.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Core Competencies</h2>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Meme Generator */}
      {tool.id === "meme-generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Meme Setup</h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Top Caption Text</label>
              <input
                type="text"
                value={memeTopText}
                onChange={(e) => setMemeTopText(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Bottom Caption Text</label>
              <input
                type="text"
                value={memeBottomText}
                onChange={(e) => setMemeBottomText(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Meme Templates</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "drake", label: "Drake Hotline" },
                  { id: "buttons", label: "Two Red Buttons" },
                  { id: "brain", label: "Expanding Brain" },
                  { id: "doge", label: "Cheems & Doge" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMemeTemplate(item.id)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border cursor-pointer ${
                      memeTemplate === item.id
                        ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleDownloadSVG("meme-svg-container", "custom-meme.svg")}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Download className="w-4 h-4" />
              Download Generated Meme
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
            <svg id="meme-svg-container" viewBox="0 0 400 400" className="w-full max-w-sm rounded-xl shadow-lg border border-slate-200">
              <rect width="400" height="400" fill="#f8fafc" />
              <rect x="10" y="10" width="380" height="185" fill="#e2e8f0" rx="8" />
              <rect x="10" y="205" width="380" height="185" fill="#d1fae5" rx="8" />

              {/* Drake Style Top */}
              <circle cx="70" cy="100" r="30" fill="#ef4444" fillOpacity="0.2" />
              <text x="70" y="107" textAnchor="middle" fontSize="24">👎</text>
              <text x="140" y="105" fill="#1e293b" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                {memeTopText}
              </text>

              {/* Drake Style Bottom */}
              <circle cx="70" cy="295" r="30" fill="#10b981" fillOpacity="0.2" />
              <text x="70" y="302" textAnchor="middle" fontSize="24">👍</text>
              <text x="140" y="300" fill="#065f46" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                {memeBottomText}
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* 4. Emojis Library */}
      {tool.id === "emojis" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-600" />
                Copy-Paste Emoji Keyboard
              </h3>
              <p className="text-xs text-slate-500">Click any emoji to copy directly to your clipboard.</p>
            </div>
            {copiedEmoji && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full animate-bounce">
                Copied {copiedEmoji}!
              </span>
            )}
          </div>

          <div className="space-y-6">
            {EMOJI_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{cat.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.emojis.map((em) => (
                    <button
                      key={em}
                      onClick={() => handleCopyEmoji(em)}
                      className="w-11 h-11 text-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      title={`Copy ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Business Card / Flyer / Poster / Invitation general fallback */}
      {(tool.id === "business-card-maker" ||
        tool.id === "flyer-maker" ||
        tool.id === "poster-maker" ||
        tool.id === "invitation-maker") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">{tool.name} Studio</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Headline / Full Name</label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Subtitle / Designation</label>
                <input
                  type="text"
                  value={cardData.title}
                  onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Organization / Event Name</label>
                <input
                  type="text"
                  value={cardData.company}
                  onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Contact Email or RSVP</label>
                <input
                  type="text"
                  value={cardData.email}
                  onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={() => handleDownloadSVG("design-card-svg", `${tool.id}-export.svg`)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Download className="w-4 h-4" />
              Download High-Res Graphic (SVG)
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
            <svg id="design-card-svg" viewBox="0 0 450 250" className="w-full max-w-md rounded-2xl shadow-xl border border-slate-200">
              <rect width="450" height="250" fill="#0f172a" rx="16" />
              <rect x="0" y="0" width="8" height="250" fill="#10b981" />

              <text x="40" y="60" fill="#10b981" fontSize="12" fontWeight="bold" letterSpacing="2" fontFamily="sans-serif">
                {cardData.company.toUpperCase()}
              </text>

              <text x="40" y="115" fill="#ffffff" fontSize="22" fontWeight="bold" fontFamily="sans-serif">
                {cardData.name}
              </text>

              <text x="40" y="140" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">
                {cardData.title}
              </text>

              <line x1="40" y1="165" x2="410" y2="165" stroke="#334155" strokeWidth="1" />

              <text x="40" y="195" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">
                📞 {cardData.phone}  |  ✉️ {cardData.email}
              </text>

              <text x="40" y="218" fill="#10b981" fontSize="11" fontFamily="sans-serif">
                🌐 {cardData.website}
              </text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
