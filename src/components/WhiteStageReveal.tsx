import React from 'react';
import { TexoraLogoMark } from './TexoraLogoMark';

interface WhiteStageRevealProps {
  whiteStageBlend: number;
  letterRevealProgress: number;
  isLogoDocked: boolean;
}

/**
 * Renders the pure White Reveal Stage requested by the user:
 * Pure #FFFFFF full-viewport screen (z-50 covering everything including the header)
 * showing ONLY the giant TEXORA lockup ([Uploaded T Logo] + E X O R A) with calm, fluid motion.
 */
export const WhiteStageReveal: React.FC<WhiteStageRevealProps> = ({
  whiteStageBlend,
  letterRevealProgress,
  isLogoDocked,
}) => {
  const letters = ['E', 'X', 'O', 'R', 'A'];
  const isVisible = whiteStageBlend > 0.04;

  return (
    <div
      data-testid="white-stage-reveal"
      data-docked={isLogoDocked ? 'true' : 'false'}
      style={{
        opacity: whiteStageBlend,
        pointerEvents: 'none',
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FFFFFF] text-[#090A0F] px-4 sm:px-8 select-none transition-opacity duration-500 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
    >
      {/* Monumental LTR Wordmark ONLY: [T = Exact Uploaded Logo] + [E X O R A] */}
      <div
        dir="ltr"
        className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7"
        data-testid="texora-monumental-wordmark"
      >
        {/* First letter 'T': The exact uploaded Texora emblem gliding calmly from the side and locking in place */}
        <div
          style={{
            transform: `translate3d(${(1 - whiteStageBlend) * -80}px, 0, 0) scale(${
              0.9 + whiteStageBlend * 0.1
            })`,
          }}
          className="relative flex items-center justify-center w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 shrink-0 transition-transform duration-500 ease-out will-change-transform"
        >
          <TexoraLogoMark
            className="w-full h-full"
            variant="monumental"
            showUploadedBadge={false}
          />
          <span className="sr-only">T</span>
        </div>

        {/* Remaining giant letters: E X O R A */}
        <div className="flex items-center tracking-tighter font-['Outfit'] font-black text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] leading-none text-[#090A0F]">
          {letters.map((char, idx) => {
            const charThreshold = idx / letters.length;
            const charProg = Math.max(
              0,
              Math.min(1, (letterRevealProgress - charThreshold * 0.45) / 0.55)
            );
            return (
              <span
                key={char + idx}
                style={{
                  opacity: charProg,
                  transform: `translate3d(0, ${(1 - charProg) * 24}px, 0)`,
                }}
                className="inline-block transition-all duration-500 ease-out will-change-transform"
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
