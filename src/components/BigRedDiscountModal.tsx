import React, { useEffect, useState } from 'react';
import { WebsitePromotion } from '../supabase';
import { X, Sparkles, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

interface BigRedDiscountModalProps {
  promo: WebsitePromotion | null;
  lang: 'ar' | 'en';
  onClaimDiscount: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(expiresAt: string): TimeRemaining {
  const total = new Date(expiresAt).getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, isExpired: false };
}

interface ThemeConfig {
  cardBg: string;
  borderColor: string;
  glowShadow: string;
  outerSpike: string;
  outerStroke: string;
  innerSpike: string;
  numberColor: string;
  headerAccent: string;
  titleColor: string;
  timerBg: string;
  timerBorder: string;
  timerNum: string;
  codeBg: string;
  codeBorder: string;
  codeText: string;
  copyBtn: string;
  btnBg: string;
  btnBorder: string;
  btnShadow: string;
  btnText: string;
  starColor: string;
  rosetteFill: string;
  rosetteStroke: string;
}

const THEMES: Record<string, ThemeConfig> = {
  'red-classic': {
    cardBg: 'bg-gradient-to-b from-[#C80C14] via-[#A80810] to-[#78040A]',
    borderColor: 'border-yellow-400',
    glowShadow: 'shadow-[0_0_60px_rgba(220,38,38,0.7)]',
    outerSpike: '#FBBF24',
    outerStroke: '#D97706',
    innerSpike: '#FFFFFF',
    numberColor: '#D31018',
    headerAccent: 'text-yellow-300',
    titleColor: 'text-white',
    timerBg: 'bg-black/50',
    timerBorder: 'border-yellow-400/30',
    timerNum: 'text-yellow-300',
    codeBg: 'bg-black/40',
    codeBorder: 'border-yellow-300/50',
    codeText: 'text-yellow-300',
    copyBtn: 'bg-yellow-400 hover:bg-yellow-300 text-black',
    btnBg: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200',
    btnBorder: 'border-yellow-200',
    btnShadow: 'shadow-yellow-500/40',
    btnText: 'text-black',
    starColor: 'text-yellow-300',
    rosetteFill: '#DC2626',
    rosetteStroke: '#EF4444',
  },
  'red-neon': {
    cardBg: 'bg-gradient-to-b from-[#1E0407] via-[#2A060C] to-[#120204]',
    borderColor: 'border-red-500',
    glowShadow: 'shadow-[0_0_60px_rgba(239,68,68,0.7)]',
    outerSpike: '#EF4444',
    outerStroke: '#991B1B',
    innerSpike: '#FFFFFF',
    numberColor: '#B91C1C',
    headerAccent: 'text-red-400',
    titleColor: 'text-white',
    timerBg: 'bg-red-950/60',
    timerBorder: 'border-red-500/30',
    timerNum: 'text-red-200',
    codeBg: 'bg-black/50',
    codeBorder: 'border-red-500/50',
    codeText: 'text-red-400',
    copyBtn: 'bg-red-600 hover:bg-red-500 text-white',
    btnBg: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600',
    btnBorder: 'border-red-400/50',
    btnShadow: 'shadow-red-600/60',
    btnText: 'text-white',
    starColor: 'text-red-400',
    rosetteFill: '#991B1B',
    rosetteStroke: '#EF4444',
  },
  'blue-neon': {
    cardBg: 'bg-gradient-to-b from-[#030B1C] via-[#091738] to-[#020712]',
    borderColor: 'border-blue-400',
    glowShadow: 'shadow-[0_0_60px_rgba(59,130,246,0.7)]',
    outerSpike: '#38BDF8',
    outerStroke: '#0284C7',
    innerSpike: '#FFFFFF',
    numberColor: '#1D4ED8',
    headerAccent: 'text-cyan-300',
    titleColor: 'text-white',
    timerBg: 'bg-blue-950/60',
    timerBorder: 'border-blue-500/30',
    timerNum: 'text-cyan-300',
    codeBg: 'bg-black/50',
    codeBorder: 'border-blue-400/50',
    codeText: 'text-cyan-300',
    copyBtn: 'bg-blue-500 hover:bg-blue-400 text-white',
    btnBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500',
    btnBorder: 'border-blue-300/40',
    btnShadow: 'shadow-blue-600/60',
    btnText: 'text-white',
    starColor: 'text-cyan-300',
    rosetteFill: '#1D4ED8',
    rosetteStroke: '#60A5FA',
  },
  'sky-blue': {
    cardBg: 'bg-gradient-to-b from-[#021822] via-[#083042] to-[#011018]',
    borderColor: 'border-cyan-400',
    glowShadow: 'shadow-[0_0_60px_rgba(34,211,238,0.6)]',
    outerSpike: '#22D3EE',
    outerStroke: '#0891B2',
    innerSpike: '#FFFFFF',
    numberColor: '#0E7490',
    headerAccent: 'text-cyan-300',
    titleColor: 'text-white',
    timerBg: 'bg-cyan-950/60',
    timerBorder: 'border-cyan-400/30',
    timerNum: 'text-cyan-200',
    codeBg: 'bg-black/50',
    codeBorder: 'border-cyan-400/50',
    codeText: 'text-cyan-300',
    copyBtn: 'bg-cyan-400 hover:bg-cyan-300 text-neutral-900',
    btnBg: 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200',
    btnBorder: 'border-cyan-200',
    btnShadow: 'shadow-cyan-400/50',
    btnText: 'text-neutral-950',
    starColor: 'text-cyan-300',
    rosetteFill: '#0E7490',
    rosetteStroke: '#22D3EE',
  },
  'dark-obsidian': {
    cardBg: 'bg-gradient-to-b from-[#111113] via-[#1A1A1F] to-[#08080A]',
    borderColor: 'border-amber-400',
    glowShadow: 'shadow-[0_0_60px_rgba(251,191,36,0.4)]',
    outerSpike: '#F59E0B',
    outerStroke: '#B45309',
    innerSpike: '#FFFFFF',
    numberColor: '#18181B',
    headerAccent: 'text-amber-300',
    titleColor: 'text-white',
    timerBg: 'bg-neutral-900/80',
    timerBorder: 'border-amber-500/30',
    timerNum: 'text-amber-300',
    codeBg: 'bg-black/60',
    codeBorder: 'border-amber-400/50',
    codeText: 'text-amber-300',
    copyBtn: 'bg-amber-400 hover:bg-amber-300 text-black',
    btnBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200',
    btnBorder: 'border-amber-300',
    btnShadow: 'shadow-amber-400/50',
    btnText: 'text-neutral-950',
    starColor: 'text-amber-400',
    rosetteFill: '#18181B',
    rosetteStroke: '#F59E0B',
  },
  'purple-cyber': {
    cardBg: 'bg-gradient-to-b from-[#120220] via-[#240638] to-[#0A0112]',
    borderColor: 'border-fuchsia-500',
    glowShadow: 'shadow-[0_0_60px_rgba(217,70,239,0.6)]',
    outerSpike: '#E879F9',
    outerStroke: '#A21CAF',
    innerSpike: '#FFFFFF',
    numberColor: '#7E22CE',
    headerAccent: 'text-fuchsia-300',
    titleColor: 'text-white',
    timerBg: 'bg-purple-950/60',
    timerBorder: 'border-fuchsia-500/30',
    timerNum: 'text-fuchsia-200',
    codeBg: 'bg-black/50',
    codeBorder: 'border-fuchsia-400/50',
    codeText: 'text-fuchsia-300',
    copyBtn: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
    btnBg: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-700 hover:from-fuchsia-500 hover:to-purple-500',
    btnBorder: 'border-fuchsia-400/40',
    btnShadow: 'shadow-fuchsia-600/60',
    btnText: 'text-white',
    starColor: 'text-fuchsia-300',
    rosetteFill: '#7E22CE',
    rosetteStroke: '#E879F9',
  },
  'silver': {
    cardBg: 'bg-gradient-to-b from-[#242831] via-[#1A1D24] to-[#0F1116]',
    borderColor: 'border-slate-300',
    glowShadow: 'shadow-[0_0_60px_rgba(226,232,240,0.45)]',
    outerSpike: '#CBD5E1',
    outerStroke: '#94A3B8',
    innerSpike: '#FFFFFF',
    numberColor: '#0F172A',
    headerAccent: 'text-slate-300',
    titleColor: 'text-white',
    timerBg: 'bg-slate-900/80',
    timerBorder: 'border-slate-400/30',
    timerNum: 'text-white',
    codeBg: 'bg-black/50',
    codeBorder: 'border-slate-400/50',
    codeText: 'text-slate-300',
    copyBtn: 'bg-slate-200 text-slate-950',
    btnBg: 'bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100',
    btnBorder: 'border-slate-300',
    btnShadow: 'shadow-slate-300/40',
    btnText: 'text-slate-950',
    starColor: 'text-slate-300',
    rosetteFill: '#334155',
    rosetteStroke: '#CBD5E1',
  },
  'silver-metallic': {
    cardBg: 'bg-gradient-to-b from-[#242831] via-[#1A1D24] to-[#0F1116]',
    borderColor: 'border-slate-300',
    glowShadow: 'shadow-[0_0_60px_rgba(226,232,240,0.45)]',
    outerSpike: '#CBD5E1',
    outerStroke: '#94A3B8',
    innerSpike: '#FFFFFF',
    numberColor: '#0F172A',
    headerAccent: 'text-slate-300',
    titleColor: 'text-white',
    timerBg: 'bg-slate-900/80',
    timerBorder: 'border-slate-400/30',
    timerNum: 'text-white',
    codeBg: 'bg-black/50',
    codeBorder: 'border-slate-400/50',
    codeText: 'text-slate-300',
    copyBtn: 'bg-slate-200 text-slate-950',
    btnBg: 'bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100',
    btnBorder: 'border-slate-300',
    btnShadow: 'shadow-slate-300/40',
    btnText: 'text-slate-950',
    starColor: 'text-slate-300',
    rosetteFill: '#334155',
    rosetteStroke: '#CBD5E1',
  },
};

export function BigRedDiscountModal({ promo, lang, onClaimDiscount }: BigRedDiscountModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    promo ? calculateTimeRemaining(promo.expires_at) : { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  );

  // Automatically open modal upon first visit after a slight smooth delay
  useEffect(() => {
    if (!promo) return;
    const initialTime = calculateTimeRemaining(promo.expires_at);
    if (initialTime.isExpired) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [promo]);

  // Real-time countdown timer tick every second
  useEffect(() => {
    if (!promo) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(promo.expires_at);
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        setIsOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [promo]);

  if (!promo || timeLeft.isExpired) {
    return null;
  }

  const handleClaim = () => {
    setIsOpen(false);
    onClaimDiscount();
  };

  const discountVal = promo.discount_percentage || 35;
  const themeKey = (promo.theme && THEMES[promo.theme]) ? promo.theme : 'red-classic';
  const theme = THEMES[themeKey];

  return (
    <>
      {/* =========================================================================
          1. FLOATING ROSETTE STARBURST BADGE (Images 2 & 3 Style)
          ========================================================================= */}
      {!isOpen && (
        <aside
          aria-label={lang === 'ar' ? 'شارة الخصم' : 'Discount Badge'}
          className="fixed bottom-6 start-6 z-40 transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={lang === 'ar' ? `فتح عرض الخصم ${discountVal}%` : `Open ${discountVal}% Discount`}
            className="group relative flex items-center justify-center cursor-pointer filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          >
            {/* 24-point Serrated Starburst Rosette Stamp */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-pulse">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-md"
              >
                <polygon
                  points="
                    50,0 59,10 72,5 78,17 91,16 93,29 100,38 98,50 100,62 93,71 91,84 78,83
                    72,95 59,90 50,100 41,90 28,95 22,83 9,84 7,71 0,62 2,50 0,38 7,29
                    9,16 22,17 28,5 41,10
                  "
                  fill={theme.rosetteFill}
                  stroke={theme.rosetteStroke}
                  strokeWidth="2"
                />
              </svg>

              {/* Inside the Rosette: Stars + Percentage + OFF */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none select-none">
                <div className={`flex items-center gap-0.5 ${theme.starColor} text-[7px] sm:text-[8px] -mb-0.5`}>
                  <span>★</span>
                  <span className="text-[9px] sm:text-[10px] -mt-0.5">★</span>
                  <span>★</span>
                </div>

                <div className="font-black text-base sm:text-xl leading-none tracking-tighter text-white drop-shadow">
                  {discountVal}%
                </div>

                <div className={`font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider ${theme.headerAccent} drop-shadow -mt-0.5`}>
                  {lang === 'ar' ? 'خصم' : 'OFF'}
                </div>
              </div>
            </div>
          </button>
        </aside>
      )}

      {/* =========================================================================
          2. THE SALE POSTER MODAL (Fully Responsive for All Screen Heights)
          ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[340px] sm:max-w-md max-h-[92vh] flex flex-col rounded-3xl ${theme.cardBg} p-4 sm:p-6 text-center text-white ${theme.glowShadow} border-4 ${theme.borderColor} overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Background Watermark Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10 select-none overflow-hidden"
            >
              <div className="absolute inset-0 flex flex-wrap gap-4 text-5xl font-black text-white/30 transform -rotate-12 scale-125">
                <span>%</span><span>{discountVal}%</span><span>%</span><span>{discountVal}%</span>
                <span>{discountVal}%</span><span>%</span><span>{discountVal}%</span><span>%</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              className="absolute top-3 end-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer z-20 border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* --- TOP HEADER (Image 1 Style: الحق التخفيضات) --- */}
            <div className="relative z-10 pt-0.5 pb-1 shrink-0">
              <div className={`inline-flex items-center justify-center gap-1.5 ${theme.headerAccent} text-[10px] sm:text-xs font-black tracking-widest uppercase mb-0.5`}>
                <span>✨</span>
                <span>{lang === 'ar' ? 'عرض الافتتاح الرسمي' : 'OFFICIAL OPENING OFFER'}</span>
                <span>✨</span>
              </div>

              {/* Playful Stylized Arabic Headline */}
              <h2
                className={`text-3xl sm:text-4xl font-black ${theme.titleColor} tracking-tight leading-none drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]`}
                style={{
                  fontFamily: `'Tajawal', 'Cairo', sans-serif`,
                }}
              >
                {lang === 'ar' ? 'الحـق التخفيضات' : 'SUPER FLASH SALE'}
              </h2>

              <div className={`flex items-center justify-center gap-1 mt-0.5 ${theme.headerAccent} text-xs font-bold`}>
                <span>•</span>
                <span>•••</span>
                <span>•</span>
              </div>
            </div>

            {/* --- JAGGED EXPLOSION STARBURST (Compact & Responsive) --- */}
            <div className="relative z-10 my-1 sm:my-2 flex items-center justify-center shrink-0">
              <div className="relative w-52 sm:w-64 h-36 sm:h-44 flex items-center justify-center">
                <svg
                  viewBox="0 0 360 260"
                  className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                >
                  {/* Outer Jagged Spikes */}
                  <polygon
                    points="
                      180,5 205,45 245,15 252,58 295,40 285,85 335,80 305,120 355,135
                      310,165 350,195 295,200 315,240 260,225 250,258 200,230 180,255
                      160,230 110,258 100,225 45,240 65,200 10,195 50,165 5,135 55,120
                      25,80 75,85 65,40 108,58 115,15 155,45
                    "
                    fill={theme.outerSpike}
                    stroke={theme.outerStroke}
                    strokeWidth="2"
                  />

                  {/* Inner Pure White Spikes */}
                  <polygon
                    points="
                      180,18 202,52 238,28 244,64 282,50 274,88 318,84 292,118 335,132
                      296,158 330,182 284,188 300,222 254,210 244,238 200,216 180,238
                      160,216 116,238 106,210 60,222 76,188 30,182 64,158 25,132 68,118
                      42,84 86,88 78,50 116,64 122,28 158,52
                    "
                    fill={theme.innerSpike}
                  />
                </svg>

                {/* Big Discount Value Inside the Starburst */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                  <div
                    className="font-black tracking-tighter flex items-baseline justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    style={{
                      color: theme.numberColor,
                      fontSize: discountVal >= 100 ? '3.8rem' : '4.6rem',
                      lineHeight: '0.85',
                      fontFamily: `'Impact', 'Arial Black', sans-serif`,
                    }}
                  >
                    <span>{discountVal}</span>
                    <span className="text-3xl sm:text-4xl font-black ml-1">%</span>
                  </div>

                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-neutral-800 -mt-0.5">
                    {lang === 'ar' ? 'خصم فوري' : 'INSTANT OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* --- BOTTOM SECTION --- */}
            <div className="relative z-10 shrink-0">
              <div
                className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mb-1 drop-shadow"
                style={{ fontFamily: `'Tajawal', 'Cairo', sans-serif` }}
              >
                {lang === 'ar' ? 'لـفـتـرة مـحـدودة !' : 'LIMITED TIME ONLY !'}
              </div>

              <p className="text-[11px] sm:text-xs text-white/90 font-medium mb-3 leading-tight max-w-xs mx-auto">
                {promo.is_global === false && promo.applicable_services && promo.applicable_services.length > 0
                  ? (lang === 'ar'
                      ? `خصم ${discountVal}% يطبّق تلقائياً على باقة من خدمات وأنظمة TEXORA المختارة.`
                      : `${discountVal}% discount automatically applied to select TEXORA systems & services.`)
                  : (lang === 'ar'
                      ? `خصم ${discountVal}% يطبّق تلقائياً وبشكل مباشر على كافة مشاريع وأنظمة وبرمجيات TEXORA.`
                      : `${discountVal}% discount automatically applied to all TEXORA systems & platforms.`)}
              </p>

              {/* Countdown Timer */}
              <div className={`mb-3 p-2 rounded-xl ${theme.timerBg} border ${theme.timerBorder} backdrop-blur-sm`}>
                <div className={`flex items-center justify-center gap-1 text-[10px] font-bold ${theme.timerNum} mb-1`}>
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'ينتهي العرض خلال:' : 'Offer Ends In:'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="p-1 rounded-lg bg-black/60 border border-white/10">
                    <div className={`text-sm sm:text-base font-black ${theme.timerNum} font-mono`}>{timeLeft.days}</div>
                    <div className="text-[8px] text-neutral-300 font-medium">{lang === 'ar' ? 'يوم' : 'Days'}</div>
                  </div>
                  <div className="p-1 rounded-lg bg-black/60 border border-white/10">
                    <div className={`text-sm sm:text-base font-black ${theme.timerNum} font-mono`}>{timeLeft.hours}</div>
                    <div className="text-[8px] text-neutral-300 font-medium">{lang === 'ar' ? 'ساعة' : 'Hours'}</div>
                  </div>
                  <div className="p-1 rounded-lg bg-black/60 border border-white/10">
                    <div className={`text-sm sm:text-base font-black ${theme.timerNum} font-mono`}>{timeLeft.minutes}</div>
                    <div className="text-[8px] text-neutral-300 font-medium">{lang === 'ar' ? 'دقيقة' : 'Mins'}</div>
                  </div>
                  <div className="p-1 rounded-lg bg-black/60 border border-white/10">
                    <div className={`text-sm sm:text-base font-black ${theme.timerNum} font-mono`}>{timeLeft.seconds}</div>
                    <div className="text-[8px] text-neutral-300 font-medium">{lang === 'ar' ? 'ثانية' : 'Secs'}</div>
                  </div>
                </div>
              </div>

              {/* Big Vibrant Action Button (Direct seamless claim without promo codes) */}
              <button
                type="button"
                onClick={handleClaim}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl ${theme.btnBg} ${theme.btnText} font-black text-xs sm:text-sm ${theme.btnShadow} border ${theme.btnBorder} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-1`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? `احصل على خصم ${discountVal}% وابدأ مشروعك الآن`
                    : `Claim ${discountVal}% Off & Start Project`}
                </span>
                {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              {/* Dismiss Link */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-1.5 text-[10px] text-white/70 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
              >
                {lang === 'ar' ? 'المتابعة لتصفح الموقع' : 'Continue browsing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
