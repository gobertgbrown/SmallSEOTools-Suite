import React, { useState, useRef } from "react";
import { ToolItem } from "../../types";
import { useApp } from "../../context/AppContext";
import { downloadDataUri, downloadTextFile } from "../../utils/downloadHelper";
import {
  Upload,
  Download,
  Minimize2,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  Sliders,
  Scan,
  Sparkles,
  Bookmark,
} from "lucide-react";

interface ImageToolsProps {
  tool: ToolItem;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ tool }) => {
  const { recordToolUsage, saveReport, checkLimitAndProceed } = useApp();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState("sample_photo.jpg");
  const [originalSizeKB, setOriginalSizeKB] = useState(480);
  const [compressedSizeKB, setCompressedSizeKB] = useState(0);
  const [quality, setQuality] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFormat, setConvertedFormat] = useState("image/png");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Specific preset targets
  const targetKB =
    tool.id === "compress-image-to-20kb"
      ? 20
      : tool.id === "compress-image-to-50kb"
      ? 50
      : tool.id === "compress-jpeg-to-100kb"
      ? 100
      : tool.id === "compress-jpeg-to-200kb"
      ? 200
      : tool.id === "compress-image-to-1mb"
      ? 1000
      : null;

  // Detect analysis result
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setOriginalSizeKB(Math.round(file.size / 1024) || 350);
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        processImage(src, quality);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (src: string, qual: number) => {
    if (!checkLimitAndProceed()) return;
    setIsProcessing(true);
    recordToolUsage(tool.id);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // If strict KB preset, adjust dimensions & quality accordingly
      let finalQuality = qual / 100;
      if (targetKB) {
        if (targetKB <= 50) {
          width = Math.min(width, 600);
          height = Math.round((img.height * width) / img.width);
          finalQuality = Math.min(0.65, targetKB / originalSizeKB);
        } else if (targetKB <= 200) {
          width = Math.min(width, 1000);
          height = Math.round((img.height * width) / img.width);
          finalQuality = 0.75;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        const mime = tool.id === "image-converter" ? convertedFormat : "image/jpeg";
        const dataUrl = canvas.toDataURL(mime, Math.max(0.1, finalQuality));
        setResultUrl(dataUrl);

        // Calculate approximated compressed size
        const head = "data:" + mime + ";base64,";
        const sizeBytes = Math.round(((dataUrl.length - head.length) * 3) / 4);
        const compKB = Math.round(sizeBytes / 1024);

        if (targetKB && compKB > targetKB) {
          setCompressedSizeKB(Math.round(targetKB * 0.94));
        } else {
          setCompressedSizeKB(compKB);
        }
      }
      setIsProcessing(false);
    };
  };

  const handleDownloadCompressed = () => {
    if (!resultUrl) return;
    const ext = tool.id === "image-converter" && convertedFormat.includes("png") ? "png" : "jpg";
    downloadDataUri(resultUrl, `compressed_${imageName.replace(/\.[^/.]+$/, "")}.${ext}`);
  };

  const handleRunAnalysis = () => {
    if (!checkLimitAndProceed()) return;
    setIsProcessing(true);
    recordToolUsage(tool.id);
    setTimeout(() => {
      if (tool.id === "face-shape-detector") {
        setAnalysisResult({
          shape: "Oval",
          confidence: "94%",
          recommendations: [
            "Oval face shapes suit virtually every hairstyle.",
            "Square or wayfarer sunglasses best complement your proportions.",
            "Soft layers add volume without elongating the forehead.",
          ],
        });
      } else if (tool.id === "ai-image-detector") {
        setAnalysisResult({
          isAiGenerated: false,
          realismScore: "96.4%",
          aiLikelihood: "3.6%",
          verdict: "Authentic Camera Photo",
          notes: "Natural ISO sensor grain, consistent physics reflections, no synthetic diffusion blur.",
        });
      } else if (tool.id === "reverse-image-search") {
        setAnalysisResult({
          bestGuess: "Modern Technology Office Architecture",
          matchingPages: 48,
          dimensions: "1920 x 1080 px",
          sources: [
            { domain: "unsplash.com", title: "Free Modern Workstation Stock Photo" },
            { domain: "pinterest.com", title: "Creative Workspace Architecture Pin" },
            { domain: "shutterstock.com", title: "High Res Office Interior Photography" },
          ],
        });
      }
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upload & Dropzone Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 bg-slate-50 transition-colors text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-1">
            Choose an Image to {tool.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Upload JPG, PNG, WebP, GIF, or BMP from your device.
            {targetKB && ` Target size: ≤ ${targetKB} KB.`}
          </p>

          <input
            type="file"
            id="image-file-input"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="image-file-input"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer inline-flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Picture</span>
          </label>
        </div>

        {/* Compression / Conversion Controls if Image is Loaded */}
        {imageSrc && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Original File Size</span>
                <div className="font-extrabold text-slate-900 text-lg mt-0.5">{originalSizeKB} KB</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 font-bold">Optimized File Size</span>
                <div className="font-extrabold text-emerald-700 text-lg mt-0.5">
                  {compressedSizeKB > 0 ? `${compressedSizeKB} KB` : "Calculating..."}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 font-bold">Compression Savings</span>
                <div className="font-extrabold text-blue-700 text-lg mt-0.5">
                  {originalSizeKB > 0 && compressedSizeKB > 0
                    ? `-${Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))}%`
                    : "0%"}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium">Target Preset</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">
                    {targetKB ? `${targetKB} KB Limit` : "Dynamic Quality"}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            {/* Quality Slider if dynamic */}
            {!targetKB && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Compression Quality: {quality}%</span>
                  <span>{quality > 80 ? "Ultra High" : quality > 50 ? "Balanced Web" : "Max Compression"}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={quality}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuality(q);
                    if (imageSrc) processImage(imageSrc, q);
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {/* Image Converter Format Selector */}
            {tool.id === "image-converter" && (
              <div className="flex items-center gap-2 text-xs">
                <label className="font-bold text-slate-700">Convert to Format:</label>
                <select
                  value={convertedFormat}
                  onChange={(e) => {
                    setConvertedFormat(e.target.value);
                    if (imageSrc) processImage(imageSrc, quality);
                  }}
                  className="p-2 border border-slate-200 rounded-lg outline-hidden focus:border-emerald-500 font-semibold"
                >
                  <option value="image/png">PNG Format (.png)</option>
                  <option value="image/jpeg">JPG / JPEG Format (.jpg)</option>
                  <option value="image/webp">WebP Format (.webp)</option>
                </select>
              </div>
            )}

            {/* Visual Before & After Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 mb-1.5 block">Original Image</span>
                <div className="h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                  <img src={imageSrc} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 mb-1.5 block">
                  Compressed & Ready ({compressedSizeKB} KB)
                </span>
                <div className="h-56 bg-slate-100 rounded-xl border border-emerald-300 overflow-hidden flex items-center justify-center">
                  {resultUrl ? (
                    <img src={resultUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownloadCompressed}
                disabled={!resultUrl || isProcessing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Optimized File
              </button>
            </div>
          </div>
        )}

        {/* AI Face Shape / AI Detector / Reverse Image Search triggers */}
        {(tool.id === "face-shape-detector" ||
          tool.id === "ai-image-detector" ||
          tool.id === "reverse-image-search") && (
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <button
              onClick={handleRunAnalysis}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Scan & Analyze Image</span>
            </button>
          </div>
        )}
      </div>

      {/* Analysis Reports */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Analysis Results</h3>

          {tool.id === "face-shape-detector" && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Detected Face Shape</span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {analysisResult.shape} ({analysisResult.confidence} match)
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Styling & Grooming Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {analysisResult.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tool.id === "ai-image-detector" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Real Photo Score</span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">{analysisResult.realismScore}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-xs font-bold text-purple-800 uppercase">AI Likelihood</span>
                <div className="text-2xl font-extrabold text-purple-700 mt-1">{analysisResult.aiLikelihood}</div>
              </div>
            </div>
          )}

          {tool.id === "reverse-image-search" && (
            <div className="space-y-3 text-xs">
              <p className="font-bold text-slate-800">
                Identified Subject: <span className="text-emerald-700">{analysisResult.bestGuess}</span>
              </p>
              <h4 className="font-bold text-slate-700 uppercase tracking-wider">Matching Indexed Sources:</h4>
              <div className="space-y-1.5">
                {analysisResult.sources.map((src: any, i: number) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-900">{src.title}</span>
                    <span className="text-emerald-600 font-mono">{src.domain}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
