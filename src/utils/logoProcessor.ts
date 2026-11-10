import { LOGO_ASSET_PATH } from '../data/texoraData';

export interface ProcessedLogoCanvases {
  /** Exact uploaded logo with transparent background (original silver metallic tones) */
  originalCanvas: HTMLCanvasElement;
  /** Exact uploaded logo with transparent background and darkened metallic tones for white backgrounds */
  darkenedCanvas: HTMLCanvasElement;
  originalDataUrl: string;
  darkenedDataUrl: string;
}

let cachedPromise: Promise<ProcessedLogoCanvases> | null = null;

/**
 * Loads the user's exact uploaded logo (/assets/aistudio/IMG-20260827-WA0022_4b96c238.jpg),
 * scales it to an optimal 512px GPU texture resolution for fast performance on weak devices,
 * and removes only the solid off-white background (#F8F8F8) using smooth alpha feathering.
 */
export function loadExactUploadedLogo(): Promise<ProcessedLogoCanvases> {
  if (cachedPromise) return cachedPromise;

  cachedPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      const natW = img.naturalWidth || img.width || 1051;
      const natH = img.naturalHeight || img.height || 893;

      // Cap texture resolution to 512px width for 4x faster processing and low VRAM usage on weak devices
      const maxDim = 512;
      const scale = Math.min(1, maxDim / Math.max(natW, natH));
      const w = Math.max(1, Math.round(natW * scale));
      const h = Math.max(1, Math.round(natH * scale));

      const origCanvas = document.createElement('canvas');
      origCanvas.width = w;
      origCanvas.height = h;
      const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });

      const darkCanvas = document.createElement('canvas');
      darkCanvas.width = w;
      darkCanvas.height = h;
      const darkCtx = darkCanvas.getContext('2d');

      if (!origCtx || !darkCtx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      origCtx.drawImage(img, 0, 0, w, h);
      const imgData = origCtx.getImageData(0, 0, w, h);
      const darkData = darkCtx.createImageData(w, h);

      const src = imgData.data;
      const dstDark = darkData.data;

      const bgThresholdHigh = 244;
      const bgThresholdLow = 230;

      for (let i = 0; i < src.length; i += 4) {
        const r = src[i];
        const g = src[i + 1];
        const b = src[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        let alpha = 255;
        if (lum >= bgThresholdHigh) {
          alpha = 0;
        } else if (lum > bgThresholdLow) {
          const ratio = (bgThresholdHigh - lum) / (bgThresholdHigh - bgThresholdLow);
          alpha = Math.round(Math.max(0, Math.min(1, ratio)) * 255);
        }

        // Dark-background texture: preserve exact silver metallic sheen
        src[i] = Math.min(255, Math.round(r * 1.08));
        src[i + 1] = Math.min(255, Math.round(g * 1.08));
        src[i + 2] = Math.min(255, Math.round(b * 1.1));
        src[i + 3] = alpha;

        // White-background texture: high-contrast metallic charcoal so it stands out on pure #FFFFFF
        dstDark[i] = Math.max(15, Math.round((r - 115) * 0.58));
        dstDark[i + 1] = Math.max(18, Math.round((g - 112) * 0.58));
        dstDark[i + 2] = Math.max(26, Math.round((b - 105) * 0.62));
        dstDark[i + 3] = alpha;
      }

      origCtx.putImageData(imgData, 0, 0);
      darkCtx.putImageData(darkData, 0, 0);

      resolve({
        originalCanvas: origCanvas,
        darkenedCanvas: darkCanvas,
        originalDataUrl: origCanvas.toDataURL('image/png'),
        darkenedDataUrl: darkCanvas.toDataURL('image/png'),
      });
    };
    img.onerror = (err) => reject(err);
    img.src = LOGO_ASSET_PATH;
  });

  return cachedPromise;
}
