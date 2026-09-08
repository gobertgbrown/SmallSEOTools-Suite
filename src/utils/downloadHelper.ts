/**
 * SmallSEOTools Universal Robust File Download Helper
 * Works across all browsers, cloud deployments, and sandboxed iframe environments.
 */

export interface DownloadOptions {
  filename: string;
  content: string | Blob;
  mimeType?: string;
}

/**
 * Downloads a text string as a file safely with DOM attachment & cleanup.
 */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string = "text/plain;charset=utf-8"
): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    return downloadBlob(filename, blob);
  } catch (err) {
    console.error("Blob creation failed, falling back to data URI:", err);
    return downloadViaDataUri(filename, `data:${mimeType},${encodeURIComponent(content)}`);
  }
}

/**
 * Downloads a Blob object by creating an object URL, appending an <a> tag to document.body,
 * triggering click, and safely delaying URL revocation so the browser download stream completes.
 */
export function downloadBlob(filename: string, blob: Blob): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    link.setAttribute("target", "_blank");

    document.body.appendChild(link);
    link.click();

    // Clean up DOM and delay revocation so download stream initiates safely
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch (e) {
        // Ignore cleanup errors
      }
    }, 4000);

    return true;
  } catch (e) {
    console.error("downloadBlob error:", e);
    return false;
  }
}

/**
 * Downloads a base64 Data URL (e.g., image/png, image/jpeg, image/svg+xml).
 */
export function downloadDataUrl(filename: string, dataUrl: string): boolean {
  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.rel = "noopener noreferrer";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      } catch (e) {}
    }, 2000);

    return true;
  } catch (err) {
    console.error("downloadDataUrl error:", err);
    return downloadViaDataUri(filename, dataUrl);
  }
}

/**
 * Fallback download via hidden iframe or direct window trigger
 */
function downloadViaDataUri(filename: string, dataUri: string): boolean {
  try {
    const a = document.createElement("a");
    a.href = dataUri;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 2000);
    return true;
  } catch (e) {
    console.error("downloadViaDataUri failed:", e);
    return false;
  }
}

/**
 * Serializes an SVG element and downloads it as .svg file
 */
export function downloadSvgElement(elementId: string, filename: string): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID ${elementId} not found for download.`);
    return false;
  }
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(element);

  // Add xml namespaces if missing
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  return downloadBlob(filename, blob);
}

/**
 * Converts an SVG element to a PNG image via Canvas and triggers download.
 */
export function downloadSvgAsPng(elementId: string, filename: string, scale = 2): Promise<boolean> {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId) as unknown as SVGGraphicsElement | null;
    if (!element) {
      resolve(false);
      return;
    }

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(element);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = (img.width || 400) * scale;
      canvas.height = (img.height || 400) * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        downloadDataUrl(filename, pngUrl);
        URL.revokeObjectURL(url);
        resolve(true);
      } else {
        URL.revokeObjectURL(url);
        resolve(false);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Generates and downloads a complete formatted HTML or Document report.
 */
export function downloadFormattedReport(
  filename: string,
  title: string,
  content: string,
  metrics?: Record<string, string | number>
): boolean {
  const metricRows = metrics
    ? Object.entries(metrics)
        .map(
          ([k, v]) =>
            `<tr><td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #334155;">${k}</td><td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${v}</td></tr>`
        )
        .join("")
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - SmallSEOTools Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #f8fafc; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 36px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #2a69af; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { background: #2a69af; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .metrics-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 8px; overflow: hidden; }
    .content-box { background: #f1f5f9; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">${title}</h1>
        <div class="subtitle">Generated by SmallSEOTools Suite • ${new Date().toLocaleString()}</div>
      </div>
      <span class="badge">Official Report</span>
    </div>

    ${metrics ? `<table class="metrics-table">${metricRows}</table>` : ""}

    <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 8px;">Analysis & Content Details</h3>
    <div class="content-box">${content}</div>

    <div class="footer">
      Generated automatically by SmallSEOTools. 100% Browser Verified.
    </div>
  </div>
</body>
</html>`;

  return downloadTextFile(filename.endsWith(".html") ? filename : `${filename}.html`, html, "text/html;charset=utf-8");
}

export const downloadSvgAsPngOrSvg = (elementId: string, filename: string, format: "png" | "svg" = "png") => {
  if (format === "svg") {
    return downloadSvgElement(elementId, filename.endsWith(".svg") ? filename : `${filename}.svg`);
  }
  return downloadSvgAsPng(elementId, filename.endsWith(".png") ? filename : `${filename}.png`);
};

export const downloadDataUri = (dataUrl: string, filename: string) => {
  return downloadDataUrl(filename, dataUrl);
};

