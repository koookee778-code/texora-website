import React, { useState } from 'react';
import { TERMS_AND_CONDITIONS } from '../data/texoraData';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactAndTermsSectionProps {
  lang: 'ar' | 'en';
  onOpenStartProject: () => void;
}

export const ContactAndTermsSection: React.FC<ContactAndTermsSectionProps> = ({
  lang,
  onOpenStartProject,
}) => {
  const [expandedTermId, setExpandedTermId] = useState<string>(TERMS_AND_CONDITIONS[0].id);

  return (
    <div className="relative z-30 bg-[#050507] border-t border-white/[0.07]">
      {/* SECTION 03: Minimalist Conversion Callout to Open the Dedicated Start Project Page */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-32 px-4 sm:px-8 max-w-4xl mx-auto text-center"
      >
        <p
          className={`text-xs uppercase mb-3 ${
            lang === 'ar'
              ? 'font-medium text-[#8A8F98] tracking-normal'
              : 'font-mono tracking-widest text-[#8A8F98]'
          }`}
        >
          {lang === 'ar' ? '03 / تواصل معنا' : '03 / START YOUR PROJECT'}
        </p>
        <h2
          id="contact-heading"
          className="text-3xl sm:text-5xl font-bold text-white tracking-tight"
          style={{ textWrap: 'balance' }}
        >
          {lang === 'ar'
            ? 'هل أنت جاهز لبدء مشروعك مع TEXORA؟'
            : 'Ready to Build Your Next System with TEXORA?'}
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#8A8F98] max-w-xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'اختر نوع المشروع الذي ترغب في تنفيذه وسجل بياناتك في خطوتين سريعتين ليتواصل معك فريقنا فوراً عبر الواتساب.'
            : 'Select your target system and submit your WhatsApp contact details in two simple steps.'}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onOpenStartProject}
            data-testid="contact-section-start-btn"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
          >
            <span>{lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'}</span>
            {lang === 'ar' ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </section>

      {/* SECTION 04: Minimalist Hairline Terms & Conditions */}
      <section
        id="terms"
        aria-labelledby="terms-heading"
        className="py-28 px-4 sm:px-8 border-t border-white/[0.07] bg-[#050507]"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p
              className={`text-xs uppercase mb-2 ${
                lang === 'ar'
                  ? 'font-medium text-[#8A8F98] tracking-normal'
                  : 'font-mono tracking-widest text-[#8A8F98]'
              }`}
            >
              {lang === 'ar' ? '04 / الشروط والأحكام' : '04 / TERMS & CONDITIONS'}
            </p>
            <h2 id="terms-heading" className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'ar'
                ? 'ضمانات التعاقد وحقوق الملكية'
                : 'Terms, Ownership & Service Guarantees'}
            </h2>
          </div>

          <div
            className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]"
            data-testid="terms-accordion"
          >
            {TERMS_AND_CONDITIONS.map((clause) => {
              const isOpen = expandedTermId === clause.id;
              return (
                <div key={clause.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedTermId(isOpen ? '' : clause.id)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-start hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#8A8F98]">
                        {clause.number}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {lang === 'ar' ? clause.titleAr : clause.titleEn}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8A8F98] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8A8F98] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pb-5 text-sm text-[#8A8F98] leading-relaxed text-start">
                      {lang === 'ar' ? clause.bodyAr : clause.bodyEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
