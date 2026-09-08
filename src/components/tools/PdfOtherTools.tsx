import React, { useState } from "react";
import { ToolItem } from "../../types";
import { useApp } from "../../context/AppContext";
import { SAMPLE_TEXTS } from "../../data/sampleContent";
import { downloadTextFile, downloadFormattedReport } from "../../utils/downloadHelper";
import {
  FileText,
  Upload,
  Download,
  Copy,
  Check,
  Calculator,
  Key,
  QrCode,
  Code,
  RefreshCw,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

interface PdfOtherToolsProps {
  tool: ToolItem;
}

export const PdfOtherTools: React.FC<PdfOtherToolsProps> = ({ tool }) => {
  const { recordToolUsage, checkLimitAndProceed, saveReport } = useApp();

  // PDF tools state
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isPdfWorking, setIsPdfWorking] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);

  // Age Calculator state
  const [birthDate, setBirthDate] = useState("1998-05-15");
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthdayDays: number;
  } | null>(null);

  // Percentage Calculator state
  const [pctNum1, setPctNum1] = useState("25");
  const [pctNum2, setPctNum2] = useState("240");
  const [pctResult, setPctResult] = useState<string | null>(null);

  // Password Generator state
  const [pwLength, setPwLength] = useState(16);
  const [pwIncludeUpper, setPwIncludeUpper] = useState(true);
  const [pwIncludeNumbers, setPwIncludeNumbers] = useState(true);
  const [pwIncludeSymbols, setPwIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("q$9G#xL2@mK8vP!4");
  const [copied, setCopied] = useState(false);

  // JSON Viewer state
  const [jsonInput, setJsonInput] = useState(SAMPLE_TEXTS.jsonSample);
  const [jsonFormatted, setJsonFormatted] = useState(SAMPLE_TEXTS.jsonSample);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // QR Code & Other utilities state
  const [qrText, setQrText] = useState("https://smallseotools.com");
  const [utilInput, setUtilInput] = useState("Hello World!");
  const [utilOutput, setUtilOutput] = useState("");

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f: File) => f.name);
      setUploadedFiles(names);
      setPdfDone(false);
    }
  };

  const handleRunPdfProcess = () => {
    if (!checkLimitAndProceed()) return;
    setIsPdfWorking(true);
    recordToolUsage(tool.id);
    setTimeout(() => {
      setIsPdfWorking(false);
      setPdfDone(true);
    }, 1000);
  };

  const handleDownloadPdfResult = () => {
    const sourceName = uploadedFiles[0] || "document.pdf";
    const baseName = sourceName.substring(0, sourceName.lastIndexOf(".")) || sourceName;
    let extension = "pdf";
    let mimeType = "application/pdf";
    let fileContent = `%PDF-1.4\n%SmallSEOTools PDF Engine\n1 0 obj\n<<\n/Title (${tool.name} Processed Document)\n/Author (SmallSEOTools Suite)\n/Subject (${tool.description})\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF`;

    if (tool.id === "pdf-to-word") {
      extension = "doc";
      mimeType = "application/msword";
      fileContent = `SmallSEOTools Converted Document\n\nOriginal Source: ${sourceName}\nTool: ${tool.name}\nTimestamp: ${new Date().toISOString()}\nStatus: Processed & Formatted for Word.\n\n[Converted Content]\nThis document was extracted and converted using SmallSEOTools PDF engine.\nAll original tables, text formatting, and paragraph alignments have been preserved.`;
    } else if (tool.id === "pdf-to-excel") {
      extension = "csv";
      mimeType = "text/csv;charset=utf-8;";
      fileContent = `ID,Source File,Row Count,Status,Processed Date\n1,${sourceName},125,Converted,${new Date().toLocaleDateString()}\n2,Extracted Table 1,48,Success,${new Date().toLocaleDateString()}`;
    } else if (tool.id === "pdf-to-text") {
      extension = "txt";
      mimeType = "text/plain;charset=utf-8;";
      fileContent = `SmallSEOTools PDF To Text Extraction\nSource: ${sourceName}\nDate: ${new Date().toLocaleString()}\n\n-- Extracted Text Content --\n${SAMPLE_TEXTS.plagiarismSample}`;
    }

    downloadTextFile(`${baseName}_${tool.id}.${extension}`, fileContent, mimeType);
  };

  const handleSavePdfReport = () => {
    saveReport({
      toolId: tool.id,
      toolName: tool.name,
      inputSnippet: uploadedFiles.join(", ") || "PDF Document",
      summary: `Successfully processed ${uploadedFiles.length || 1} file(s) via ${tool.name}.`,
      score: "Ready",
    });
  };

  const calculateAge = () => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    const bDate = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - bDate.getFullYear();
    let months = today.getMonth() - bDate.getMonth();
    let days = today.getDate() - bDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - bDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBday = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    const nextBdayDays = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setAgeResult({ years, months, days, totalDays, nextBirthdayDays: nextBdayDays });
  };

  const calculatePercentage = () => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    const n1 = parseFloat(pctNum1);
    const n2 = parseFloat(pctNum2);
    if (!isNaN(n1) && !isNaN(n2)) {
      const res = ((n1 / 100) * n2).toFixed(2);
      setPctResult(`${n1}% of ${n2} = ${res}`);
    }
  };

  const generateNewPassword = () => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (pwIncludeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwIncludeNumbers) chars += "0123456789";
    if (pwIncludeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let pw = "";
    for (let i = 0; i < pwLength; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pw);
  };

  const formatJson = (minify = false) => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonFormatted(JSON.stringify(parsed, null, minify ? 0 : 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  const runEncoder = (type: "encode" | "decode" | "base64" | "md5") => {
    if (!checkLimitAndProceed()) return;
    recordToolUsage(tool.id);
    if (type === "encode") setUtilOutput(encodeURIComponent(utilInput));
    else if (type === "decode") setUtilOutput(decodeURIComponent(utilInput));
    else if (type === "base64") setUtilOutput(btoa(utilInput));
    else setUtilOutput("5d41402abc4b2a76b9719d911017c592"); // sample md5 hash
  };

  return (
    <div className="space-y-6">
      {/* 1. PDF Tools (21 tools) */}
      {tool.category === "online-pdf" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-bold text-lg text-slate-900 mb-1">{tool.name}</h3>
            <p className="text-xs text-slate-500">{tool.description}</p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl bg-slate-50 text-center transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Select PDF Documents from Your Device
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              All files are processed securely in your browser and never stored.
            </p>

            <input
              type="file"
              id="pdf-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              multiple
              className="hidden"
              onChange={handlePdfUpload}
            />
            <label
              htmlFor="pdf-upload"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Choose PDF File(s)</span>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Selected Files ({uploadedFiles.length})
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((fn, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <FileText className="w-4 h-4 text-rose-500" />
                      <span>{fn}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Ready
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunPdfProcess}
                  disabled={isPdfWorking}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isPdfWorking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isPdfWorking ? "Processing Document..." : `Execute ${tool.name}`}</span>
                </button>
              </div>
            </div>
          )}

          {pdfDone && (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Conversion Successful!</h4>
                  <p className="text-xs text-emerald-700">Your processed file is ready for instant browser download and cloud archive.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSavePdfReport}
                  className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-emerald-600" />
                  <span>Save Cloud</span>
                </button>
                <button
                  onClick={handleDownloadPdfResult}
                  className="px-5 py-2.5 bg-[#2a69af] hover:bg-[#235893] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Age Calculator */}
      {tool.id === "age-calculator" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="font-bold text-base text-slate-900 text-center">Online Chronological Age Calculator</h3>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Select Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold outline-hidden focus:border-emerald-500"
              />
            </div>
            <button
              onClick={calculateAge}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Exact Age</span>
            </button>
          </div>

          {ageResult && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="text-3xl font-extrabold text-emerald-700">{ageResult.years}</div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">Years</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-3xl font-extrabold text-slate-800">{ageResult.months}</div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Months</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-3xl font-extrabold text-slate-800">{ageResult.days}</div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Days</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-xs">
                <span>Total Days Lived: <strong className="text-slate-900">{ageResult.totalDays.toLocaleString()} days</strong></span>
                <span>Days Until Next Birthday: <strong className="text-emerald-700">{ageResult.nextBirthdayDays} days</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Percentage Calculator */}
      {tool.id === "percentage-calculator" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-base text-slate-900 text-center">Percentage Calculator</h3>
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span>What is</span>
              <input
                type="number"
                value={pctNum1}
                onChange={(e) => setPctNum1(e.target.value)}
                className="w-20 p-2 border border-slate-200 rounded-lg text-center font-bold"
              />
              <span>% of</span>
              <input
                type="number"
                value={pctNum2}
                onChange={(e) => setPctNum2(e.target.value)}
                className="w-28 p-2 border border-slate-200 rounded-lg text-center font-bold"
              />
              <span>?</span>
            </div>
            <button
              onClick={calculatePercentage}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Calculate
            </button>
          </div>

          {pctResult && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-lg font-bold text-emerald-800">
              {pctResult}
            </div>
          )}
        </div>
      )}

      {/* 4. Password Generator */}
      {tool.id === "password-generator" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="max-w-lg mx-auto space-y-4">
            <h3 className="font-bold text-base text-slate-900 text-center">Strong Password Generator</h3>

            {/* Generated Output Display */}
            <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-between font-mono text-lg font-bold">
              <span className="truncate mr-2">{generatedPassword}</span>
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Password Length: {pwLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={pwLength}
                onChange={(e) => setPwLength(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwIncludeUpper}
                    onChange={(e) => setPwIncludeUpper(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwIncludeNumbers}
                    onChange={(e) => setPwIncludeNumbers(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwIncludeSymbols}
                    onChange={(e) => setPwIncludeSymbols(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={generateNewPassword}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate New Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. JSON Viewer */}
      {tool.id === "json-viewer" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">JSON Viewer & Validator</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => formatJson(false)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Prettify / Format
              </button>
              <button
                onClick={() => formatJson(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Minify
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Input JSON</label>
              <textarea
                rows={12}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-50 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Formatted Output</label>
              <pre className="w-full h-[270px] p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl overflow-auto">
                {jsonError ? `Error: ${jsonError}` : jsonFormatted}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 6. QR Code Generator */}
      {tool.id === "qr-code-generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">QR Code Generator</h3>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Target URL or Plain Text</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => {
                  setQrText(e.target.value);
                  recordToolUsage(tool.id);
                }}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-md">
              <svg viewBox="0 0 160 160" className="w-36 h-36">
                {/* SVG QR Code pattern simulation */}
                <rect width="160" height="160" fill="#ffffff" />
                <rect x="10" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="16" width="28" height="28" fill="#ffffff" />
                <rect x="22" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="110" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="116" y="16" width="28" height="28" fill="#ffffff" />
                <rect x="122" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="10" y="110" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="116" width="28" height="28" fill="#ffffff" />
                <rect x="22" y="22" width="16" height="16" fill="#0f172a" />

                {/* Random QR pixels */}
                <rect x="60" y="20" width="10" height="20" fill="#0f172a" />
                <rect x="80" y="30" width="15" height="10" fill="#0f172a" />
                <rect x="60" y="60" width="40" height="40" fill="#10b981" rx="4" />
                <rect x="110" y="70" width="20" height="15" fill="#0f172a" />
                <rect x="70" y="120" width="25" height="25" fill="#0f172a" />
                <rect x="120" y="120" width="20" height="20" fill="#0f172a" />
              </svg>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-3 truncate max-w-xs">{qrText}</p>
          </div>
        </div>
      )}

      {/* 7. URL Encoder / Base64 Encoder general utility fallback */}
      {(tool.id === "url-encoder-decoder" || tool.id === "base64-encoder-decoder" || tool.id === "md5-generator") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">{tool.name}</h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Input Text</label>
            <textarea
              rows={4}
              value={utilInput}
              onChange={(e) => setUtilInput(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => runEncoder("encode")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Encode
            </button>
            <button
              onClick={() => runEncoder("decode")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Decode
            </button>
            <button
              onClick={() => runEncoder("base64")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Base64 Format
            </button>
            <button
              onClick={() => runEncoder("md5")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Generate Hash
            </button>
          </div>

          {utilOutput && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">Output Result:</span>
                <button
                  onClick={() => handleCopy(utilOutput)}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="font-mono text-xs break-all text-slate-900">{utilOutput}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
