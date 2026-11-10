import React, { useEffect, useState } from 'react';
import { LOGO_ASSET_PATH } from '../data/texoraData';
import { loadExactUploadedLogo } from '../utils/logoProcessor';

interface TexoraLogoMarkProps {
  className?: string;
  variant?: 'dark-bg' | 'light-bg' | 'monumental';
  showUploadedBadge?: boolean;
}

/**
 * Renders 100% the user's exact uploaded logo (/assets/aistudio/IMG-20260827-WA0022_4b96c238.jpg)
 * with its background keyed out cleanly — zero custom/invented SVG shapes.
 */
export const TexoraLogoMark: React.FC<TexoraLogoMarkProps> = ({
  className = 'w-12 h-12',
  variant = 'dark-bg',
}) => {
  const [processedUrls, setProcessedUrls] = useState<{
    originalDataUrl: string;
    darkenedDataUrl: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    loadExactUploadedLogo()
      .then((res) => {
        if (mounted) {
          setProcessedUrls({
            originalDataUrl: res.originalDataUrl,
            darkenedDataUrl: res.darkenedDataUrl,
          });
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const srcUrl = processedUrls
    ? variant === 'light-bg' || variant === 'monumental'
      ? processedUrls.darkenedDataUrl
      : processedUrls.originalDataUrl
    : LOGO_ASSET_PATH;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      data-testid="texora-logo-mark"
    >
      <img
        src={srcUrl}
        alt="شعار شركة TEXORA الرسمي"
        referrerPolicy="no-referrer"
        className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
          processedUrls ? 'opacity-100' : 'opacity-0'
        } ${
          !processedUrls && (variant === 'light-bg' || variant === 'monumental')
            ? 'mix-blend-multiply contrast-150'
            : ''
        }`}
      />
    </div>
  );
};
