import React, { useEffect, useState } from 'react';

interface TypewriterTitleProps {
  phrases: string[];
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseMs?: number;
}

export const TypewriterTitle: React.FC<TypewriterTitleProps> = ({
  phrases,
  typingSpeedMs = 55,
  deletingSpeedMs = 30,
  pauseMs = 1900,
}) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState(phrases[0] || '');
  const [isDeleting, setIsDeleting] = useState(false);

  // Smoothly reset typewriter when language switches
  useEffect(() => {
    setPhraseIdx(0);
    setDisplayed(phrases[0] || '');
    setIsDeleting(false);
  }, [phrases]);

  useEffect(() => {
    if (!phrases.length) return;
    const currentFull = phrases[phraseIdx % phrases.length];

    const timer = window.setTimeout(
      () => {
        if (!isDeleting) {
          if (displayed.length < currentFull.length) {
            setDisplayed(currentFull.slice(0, displayed.length + 1));
          } else {
            setIsDeleting(true);
          }
        } else {
          if (displayed.length > 0) {
            setDisplayed(currentFull.slice(0, displayed.length - 1));
          } else {
            setIsDeleting(false);
            setPhraseIdx((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      !isDeleting && displayed.length === currentFull.length
        ? pauseMs
        : isDeleting
        ? deletingSpeedMs
        : typingSpeedMs
    );

    return () => window.clearTimeout(timer);
  }, [displayed, isDeleting, phraseIdx, phrases, typingSpeedMs, deletingSpeedMs, pauseMs]);

  return (
    <span
      className="inline-flex items-center text-[#3B82F6] font-bold"
      data-testid="typewriter-text"
    >
      <span>{displayed || phrases[0]}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] h-[1.1em] bg-[#3B82F6] mx-1.5 align-middle animate-pulse"
      />
    </span>
  );
};
