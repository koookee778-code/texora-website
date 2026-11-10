import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { SERVICE_PILLARS, ProjectCaseStudy } from './data/texoraData';
import { computeLogoChoreography, LeadSubmissionInput } from './utils/scrollMath';
import { Texora3DCanvas } from './components/Texora3DCanvas';
import { TexoraLogoMark } from './components/TexoraLogoMark';
import { TypewriterTitle } from './components/TypewriterTitle';
import { WhiteStageReveal } from './components/WhiteStageReveal';
import { StartProjectWizard } from './components/StartProjectWizard';
import { logPageVisit } from './supabase';
import { ArrowDown, ArrowUpLeft, ArrowUpRight, Globe2, Menu, X } from 'lucide-react';

// Lazy-load below-the-fold sections so weak devices don't load everything at once
const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
);
const WhatsAppBotHub = lazy(() =>
  import('./components/WhatsAppBotHub').then((m) => ({ default: m.WhatsAppBotHub }))
);
const ContactAndTermsSection = lazy(() =>
  import('./components/ContactAndTermsSection').then((m) => ({ default: m.ContactAndTermsSection }))
);

const PILLAR_CATEGORY_MAP: Record<string, LeadSubmissionInput['systemCategory']> = {
  'web-platforms': 'web-platform',
  'digital-marketing': 'digital-marketing',
  'edtech-platforms': 'edtech-lms',
  'pharmacy-retail-erp': 'pharmacy-retail-erp',
};

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activePage, setActivePage] = useState<'home' | 'start-project'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isInsideScrollTrack, setIsInsideScrollTrack] = useState<boolean>(true);
  const [whiteStageBlend, setWhiteStageBlend] = useState<number>(0);
  const [letterRevealProgress, setLetterRevealProgress] = useState<number>(0);
  const [isLogoDocked, setIsLogoDocked] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);

  const [preselectedCategory, setPreselectedCategory] = useState<
    LeadSubmissionInput['systemCategory'] | undefined
  >(undefined);
  const [preselectedProjectTitle, setPreselectedProjectTitle] = useState<string | undefined>(
    undefined
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Log page view visit to Supabase analytics
  useEffect(() => {
    logPageVisit(activePage === 'home' ? '/' : '/start-project');
  }, [activePage]);

  useEffect(() => {
    if (activePage !== 'home') return;

    let rafId = 0;
    let ticking = false;

    const computeCurrentProgress = () => {
      const trackEl = trackRef.current;
      if (!trackEl) return 0;
      const rect = trackEl.getBoundingClientRect();
      const totalScrollable = Math.max(1, trackEl.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      if (scrolled <= totalScrollable + 80) {
        return Math.max(0, Math.min(1, scrolled / totalScrollable));
      }
      return 1.05;
    };

    const updateScroll = () => {
      ticking = false;
      const raw = computeCurrentProgress();

      // Smoothly fade out Hero text as the user scrolls down so the descending 3D logo NEVER overlaps Hero text
      if (heroContentRef.current) {
        const heroFade = Math.max(0, Math.min(1, 1 - raw / 0.055));
        heroContentRef.current.style.opacity = String(heroFade);
        heroContentRef.current.style.pointerEvents = heroFade < 0.15 ? 'none' : 'auto';
      }

      if (raw <= 1) {
        scrollProgressRef.current = raw;
        const choreo = computeLogoChoreography(raw);
        setIsInsideScrollTrack((prev) => (prev ? prev : true));
        setStageIndex((prev) => (prev === choreo.stageIndex ? prev : choreo.stageIndex));
        setIsLogoDocked((prev) => (prev === choreo.isLogoDocked ? prev : choreo.isLogoDocked));

        const fadeOutTail = raw > 0.92 ? Math.max(0, (1 - raw) / 0.08) : 1;
        const effectiveBlend =
          Math.round(choreo.whiteStageBlend * fadeOutTail * 200) / 200;
        const effectiveLetters = Math.round(choreo.letterRevealProgress * 200) / 200;

        setWhiteStageBlend((prev) => (prev === effectiveBlend ? prev : effectiveBlend));
        setLetterRevealProgress((prev) =>
          prev === effectiveLetters ? prev : effectiveLetters
        );
      } else {
        scrollProgressRef.current = 1;
        setIsInsideScrollTrack((prev) => (prev ? false : prev));
        setWhiteStageBlend((prev) => (prev === 0 ? prev : 0));
      }
    };

    const handleScroll = () => {
      const raw = computeCurrentProgress();
      scrollProgressRef.current = Math.min(1, raw);
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [activePage]);

  const openStartProjectPage = (
    category?: LeadSubmissionInput['systemCategory'],
    projectTitle?: string
  ) => {
    setPreselectedCategory(category);
    setPreselectedProjectTitle(projectTitle);
    setActivePage('start-project');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const scrollToTrackFraction = (fraction: number) => {
    const trackEl = trackRef.current;
    if (!trackEl) return;
    const totalScrollable = Math.max(1, trackEl.offsetHeight - window.innerHeight);
    const targetY = trackEl.offsetTop + totalScrollable * fraction;
    scrollProgressRef.current = fraction;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const scrollToElementId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryForQuote = (
    category: ProjectCaseStudy['category'],
    projectTitle: string
  ) => {
    openStartProjectPage(category, projectTitle);
  };

  if (activePage === 'start-project') {
    return (
      <StartProjectWizard
        lang={lang}
        initialCategory={preselectedCategory}
        initialProjectTitle={preselectedProjectTitle}
        onBackToHome={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }}
      />
    );
  }

  const activeWhiteStageBlend = isInsideScrollTrack ? whiteStageBlend : 0;
  const hideHeaderOnWhiteStage = activeWhiteStageBlend > 0.04;

  const canvasOpacity = !isInsideScrollTrack
    ? 0
    : Math.max(0, 1 - activeWhiteStageBlend * 1.35);

  const typewriterPhrasesAr = [
    'تطوير مواقع وبسايت تفاعلية 3D',
    'أنظمة محلات كاملة: صيدليات ومتاجر وبراندات',
    'منصات تعليمية ذكية وأنظمة أكاديميات',
    'تسويق إلكتروني وأتمتة مبيعات واتساب',
  ];

  const typewriterPhrasesEn = [
    '3D Interactive Websites & Cloud Platforms',
    'Pharmacy, Retail Store & Brand ERP / POS',
    'Smart Educational Platforms & Enterprise LMS',
    'Digital Marketing & WhatsApp AI Automation',
  ];

  return (
    <div
      className="min-h-screen bg-[#050507] text-[#F4F5F8] relative selection:bg-white selection:text-[#050507]"
      data-stage-index={stageIndex}
      data-logo-docked={isLogoDocked ? 'true' : 'false'}
    >
      {/* MINIMALIST FLOATING GLASS HEADER (Hidden completely on White Stage) */}
      <header
        style={{
          opacity: hideHeaderOnWhiteStage ? 0 : 1,
          pointerEvents: hideHeaderOnWhiteStage ? 'none' : 'auto',
        }}
        className={`fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-8 px-6 sm:px-10 py-4 bg-[#050507]/80 backdrop-blur-xl border-b border-white/[0.07] text-white transition-opacity duration-300 ${
          hideHeaderOnWhiteStage ? 'invisible' : 'visible'
        }`}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTrackFraction(0);
          }}
          className="text-lg font-['Outfit'] font-black tracking-tight whitespace-nowrap shrink-0"
        >
          TEXORA
        </a>

        <nav
          aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary Navigation'}
          className="hidden md:flex items-center gap-8 text-xs font-medium text-[#8A8F98]"
        >
          <a
            href="#pillars"
            onClick={(e) => {
              e.preventDefault();
              scrollToTrackFraction(0.16);
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'الحلول والأنظمة' : 'Solutions'}
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToElementId('projects');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'الأعمال' : 'Works'}
          </a>
          <a
            href="#whatsapp-bot"
            onClick={(e) => {
              e.preventDefault();
              scrollToElementId('whatsapp-bot');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'بوت واتساب' : 'WhatsApp AI'}
          </a>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              scrollToElementId('terms');
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8A8F98] hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            data-testid="header-start-project-btn"
            onClick={() => openStartProjectPage()}
            className="px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'ابدأ مشروعك' : 'Start Project'}
          </button>

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            aria-label={lang === 'ar' ? 'قائمة التنقل' : 'Navigation Menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#8A8F98] hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full inset-x-0 bg-[#050507]/95 backdrop-blur-2xl border-b border-white/[0.08] py-4 px-6 flex flex-col gap-4 text-sm font-medium text-neutral-300">
            <a
              href="#pillars"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToTrackFraction(0.16);
              }}
              className="py-1 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'الحلول والأنظمة' : 'Solutions'}
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToElementId('projects');
              }}
              className="py-1 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'الأعمال' : 'Works'}
            </a>
            <a
              href="#whatsapp-bot"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToElementId('whatsapp-bot');
              }}
              className="py-1 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'بوت واتساب' : 'WhatsApp AI'}
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToElementId('terms');
              }}
              className="py-1 hover:text-white transition-colors"
            >
              {lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}
            </a>
          </div>
        )}
      </header>

      <main id="top">
        {/* =====================================================================
            SCROLLYTELLING 3D TRACK:
            - Fixed 3D WebGL Canvas in the center
            - Uncrowded Apple/Linear Hero -> 4 Minimal Slalom Cards -> Pure White TEXORA Screen
           ===================================================================== */}
        <div
          ref={trackRef}
          id="scrollytelling-track"
          className="relative w-full"
          style={{ height: '560vh' }}
        >
          {/* Sticky 3D WebGL Layer */}
          <div
            style={{ opacity: canvasOpacity }}
            className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300"
          >
            <Texora3DCanvas scrollProgressRef={scrollProgressRef} />
          </div>

          {/* Pure White Reveal Stage Overlay (Shows ONLY [T-Logo] EXORA, hides everything else including header) */}
          <WhiteStageReveal
            whiteStageBlend={activeWhiteStageBlend}
            letterRevealProgress={letterRevealProgress}
            isLogoDocked={isLogoDocked}
          />

          {/* STAGE 0: MINIMALIST BIG-TECH HERO VIEWPORT */}
          <section
            aria-label={lang === 'ar' ? 'واجهة TEXORA الرئيسية' : 'TEXORA Hero Stage'}
            className="relative z-20 min-h-screen flex flex-col justify-between pt-20 pb-12 px-4 sm:px-8 max-w-6xl mx-auto"
          >
            {/* Dedicated Clear Zone for the Centered 3D Logo at scroll = 0 */}
            <div
              aria-hidden="true"
              className="w-full h-56 sm:h-64 md:h-68 shrink-0 pointer-events-none"
            />

            {/* Hero Text & Proof Wrapper (fades out smoothly on scroll so 3D logo never touches it) */}
            <div
              ref={heroContentRef}
              data-hero-text-block="true"
              className="flex flex-col justify-between flex-1 transition-opacity duration-150"
            >
              <div className="flex flex-col items-center text-center px-4">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]"
                  style={{ textWrap: 'balance' }}
                >
                  {lang === 'ar' ? (
                    <>
                      نبني المستقبل الرقمي مع{' '}
                      <span className="font-['Outfit']">TEXORA</span>
                    </>
                  ) : (
                    <>
                      Engineering Digital Scale with{' '}
                      <span className="font-['Outfit']">TEXORA</span>
                    </>
                  )}
                </h1>

                {/* Typewriter Effect */}
                <div className="mt-4 min-h-[2.25rem] text-lg sm:text-2xl flex items-center justify-center">
                  <TypewriterTitle
                    phrases={lang === 'ar' ? typewriterPhrasesAr : typewriterPhrasesEn}
                  />
                </div>

                <p className="mt-4 max-w-xl text-sm sm:text-base text-[#8A8F98] leading-relaxed">
                  {lang === 'ar'
                    ? 'نطور مواقع تفاعلية ثلاثية الأبعاد، منصات تعليمية، وأنظمة متكاملة للصيدليات والمتاجر والبراندات بمعايير عالمية.'
                    : 'We build interactive 3D web platforms, digital academies, and complete pharmacy & retail systems.'}
                </p>

                {/* Minimalist Big-Tech Dual Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    data-testid="hero-start-project-btn"
                    onClick={() => openStartProjectPage()}
                    className="px-6 py-3 text-xs sm:text-sm font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project'}
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToElementId('projects')}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-medium text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'استكشف الأعمال' : 'Explore Works'}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Unboxed Architectural Proof Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 mt-8 border-t border-white/[0.08] text-center">
                <div>
                  <p dir="ltr" className="text-xl sm:text-2xl font-mono font-semibold tabular-nums text-white inline-block">
                    +120
                  </p>
                  <p className="text-xs text-[#8A8F98] mt-1">
                    {lang === 'ar' ? 'منظومة ومشروع نشط' : 'Active Systems'}
                  </p>
                </div>
                <div>
                  <p dir="ltr" className="text-xl sm:text-2xl font-mono font-semibold tabular-nums text-white inline-block">
                    24/7
                  </p>
                  <p className="text-xs text-[#8A8F98] mt-1">
                    {lang === 'ar' ? 'أتمتة واتساب ذكية' : 'WhatsApp AI Bot'}
                  </p>
                </div>
                <div>
                  <p dir="ltr" className="text-xl sm:text-2xl font-mono font-semibold tabular-nums text-white inline-block">
                    99.99%
                  </p>
                  <p className="text-xs text-[#8A8F98] mt-1">
                    {lang === 'ar' ? 'استقرار سحابي' : 'Cloud Uptime'}
                  </p>
                </div>
                <div>
                  <p dir="ltr" className="text-xl sm:text-2xl font-mono font-semibold tabular-nums text-white inline-block">
                    &lt; 45ms
                  </p>
                  <p className="text-xs text-[#8A8F98] mt-1">
                    {lang === 'ar' ? 'سرعة استجابة' : 'Edge Latency'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* STAGES 1..4: MINIMALIST SLALOM SPECIFICATION CARDS
              Strictly constrained to one side on ALL viewports so the opposite lane is 100% open for the 3D Emblem */}
          <div
            id="pillars"
            style={{
              opacity: Math.max(0, 1 - activeWhiteStageBlend * 2.5),
              pointerEvents: activeWhiteStageBlend > 0.1 ? 'none' : 'auto',
            }}
            className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8 space-y-40 pt-40 pb-20 transition-opacity duration-200"
          >
            {SERVICE_PILLARS.map((pillar) => {
              const isRightCard = pillar.side === 'right';
              const mappedCat = PILLAR_CATEGORY_MAP[pillar.id] || 'pharmacy-retail-erp';
              const flexJustify =
                lang === 'ar'
                  ? isRightCard
                    ? 'justify-start'
                    : 'justify-end'
                  : isRightCard
                  ? 'justify-end'
                  : 'justify-start';
              return (
                <div
                  key={pillar.id}
                  data-testid={`slalom-pillar-${pillar.number}`}
                  className={`min-h-[68vh] flex items-center ${flexJustify}`}
                >
                  <article
                    data-slalom-card="true"
                    data-card-side={isRightCard ? 'right' : 'left'}
                    className="w-[88%] sm:w-[48%] md:w-[38%] max-w-[400px] p-6 sm:p-8 rounded-2xl bg-[#0A0B0F]/95 border border-white/[0.08]"
                  >
                    <p className="text-xs text-[#8A8F98] mb-3">
                      <span className="font-mono">{pillar.number}</span>
                      <span> / </span>
                      <span className="font-sans">{lang === 'ar' ? pillar.subtitleAr : pillar.subtitleEn}</span>
                    </p>

                    <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                      {lang === 'ar' ? pillar.titleAr : pillar.titleEn}
                    </h2>

                    <p className="mt-3 text-xs sm:text-sm text-[#8A8F98] leading-relaxed">
                      {lang === 'ar' ? pillar.descriptionAr : pillar.descriptionEn}
                    </p>

                    {/* Clean Inline Capabilities */}
                    <div className="mt-5 pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                      {(lang === 'ar' ? pillar.deliverablesAr : pillar.deliverablesEn).map(
                        (item, i) => (
                          <React.Fragment key={item}>
                            {i > 0 && <span className="text-[#8A8F98]">·</span>}
                            <span>{item}</span>
                          </React.Fragment>
                        )
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
                      <span
                        className={`text-xs text-emerald-400 ${
                          lang === 'ar' ? 'font-medium font-sans' : 'font-mono'
                        }`}
                      >
                        {lang === 'ar' ? pillar.metricAr : pillar.metricEn}
                      </span>
                      <button
                        type="button"
                        onClick={() => openStartProjectPage(mappedCat)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-neutral-300 transition-colors cursor-pointer shrink-0"
                      >
                        <span>{lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}</span>
                        {lang === 'ar' ? (
                          <ArrowUpLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            BELOW THE FOLD (Lazy-Loaded + content-visibility: auto for weak devices)
           ===================================================================== */}
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs text-[#8A8F98] bg-[#050507]">
              {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          }
        >
          <div className="cv-auto">
            <ProjectsSection
              lang={lang}
              onSelectCategoryForQuote={handleSelectCategoryForQuote}
            />
          </div>

          <div className="cv-auto">
            <WhatsAppBotHub lang={lang} />
          </div>

          <div className="cv-auto">
            <ContactAndTermsSection
              lang={lang}
              onOpenStartProject={() => openStartProjectPage()}
            />
          </div>
        </Suspense>
      </main>

      {/* MINIMALIST ARCHITECTURAL FOOTER */}
      <footer className="relative z-30 py-12 px-6 bg-[#050507] border-t border-white/[0.07] text-xs text-[#8A8F98]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TexoraLogoMark className="w-6 h-6" variant="dark-bg" showUploadedBadge={false} />
            <span className="font-['Outfit'] font-bold text-sm text-white">TEXORA</span>
            <span aria-hidden="true">·</span>
            <span>
              {lang === 'ar'
                ? 'مواقع 3D · تسويق إلكتروني · منصات تعليمية · أنظمة صيدليات ومتاجر'
                : '3D Web · Growth · EdTech LMS · Pharmacy & Retail ERP'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#projects" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'الأعمال' : 'Works'}
            </a>
            <a href="#whatsapp-bot" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'بوت واتساب' : 'WhatsApp AI'}
            </a>
            <button
              type="button"
              onClick={() => openStartProjectPage()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'ابدأ مشروعك' : 'Start Project'}
            </button>
            <a href="#terms" className="hover:text-white transition-colors">
              {lang === 'ar' ? 'الشروط والأحكام' : 'Terms'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
