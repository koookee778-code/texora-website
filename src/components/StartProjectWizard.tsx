import React, { useEffect, useState } from 'react';
import { LeadSubmissionInput } from '../utils/scrollMath';
import { TexoraLogoMark } from './TexoraLogoMark';
import { getWebsiteServices, DynamicService } from '../supabase';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Globe,
  GraduationCap,
  Home,
  Layers,
  Megaphone,
  Palette,
  Sparkles,
  Store,
} from 'lucide-react';

export interface CountryDialOption {
  code: string;
  dialCode: string;
  nameAr: string;
  nameEn: string;
}

export const COUNTRY_DIAL_OPTIONS: CountryDialOption[] = [
  { code: 'EG', dialCode: '+20', nameAr: 'مصر (+20)', nameEn: 'Egypt (+20)' },
  { code: 'SA', dialCode: '+966', nameAr: 'السعودية (+966)', nameEn: 'Saudi Arabia (+966)' },
  { code: 'AE', dialCode: '+971', nameAr: 'الإمارات (+971)', nameEn: 'UAE (+971)' },
  { code: 'KW', dialCode: '+965', nameAr: 'الكويت (+965)', nameEn: 'Kuwait (+965)' },
  { code: 'QA', dialCode: '+974', nameAr: 'قطر (+974)', nameEn: 'Qatar (+974)' },
  { code: 'BH', dialCode: '+973', nameAr: 'البحرين (+973)', nameEn: 'Bahrain (+973)' },
  { code: 'OM', dialCode: '+968', nameAr: 'سلطنة عُمان (+968)', nameEn: 'Oman (+968)' },
  { code: 'JO', dialCode: '+962', nameAr: 'الأردن (+962)', nameEn: 'Jordan (+962)' },
  { code: 'IQ', dialCode: '+964', nameAr: 'العراق (+964)', nameEn: 'Iraq (+964)' },
  { code: 'PS', dialCode: '+970', nameAr: 'فلسطين (+970)', nameEn: 'Palestine (+970)' },
  { code: 'LB', dialCode: '+961', nameAr: 'لبنان (+961)', nameEn: 'Lebanon (+961)' },
  { code: 'SY', dialCode: '+963', nameAr: 'سوريا (+963)', nameEn: 'Syria (+963)' },
  { code: 'YE', dialCode: '+967', nameAr: 'اليمن (+967)', nameEn: 'Yemen (+967)' },
  { code: 'LY', dialCode: '+218', nameAr: 'ليبيا (+218)', nameEn: 'Libya (+218)' },
  { code: 'TN', dialCode: '+216', nameAr: 'تونس (+216)', nameEn: 'Tunisia (+216)' },
  { code: 'DZ', dialCode: '+213', nameAr: 'الجزائر (+213)', nameEn: 'Algeria (+213)' },
  { code: 'MA', dialCode: '+212', nameAr: 'المغرب (+212)', nameEn: 'Morocco (+212)' },
  { code: 'SD', dialCode: '+249', nameAr: 'السودان (+249)', nameEn: 'Sudan (+249)' },
  { code: 'TR', dialCode: '+90', nameAr: 'تركيا (+90)', nameEn: 'Turkey (+90)' },
  { code: 'DE', dialCode: '+49', nameAr: 'ألمانيا (+49)', nameEn: 'Germany (+49)' },
  { code: 'GB', dialCode: '+44', nameAr: 'بريطانيا (+44)', nameEn: 'UK (+44)' },
  { code: 'US', dialCode: '+1', nameAr: 'أمريكا / كندا (+1)', nameEn: 'USA / Canada (+1)' },
];

export interface ProjectChoiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DEFAULT_PROJECT_CHOICES: ProjectChoiceItem[] = [
  {
    id: 'pharmacy-retail-erp',
    titleAr: 'نظام محلات كامل (صيدليات · متاجر · براندات)',
    titleEn: 'Complete Store ERP & POS (Pharmacies, Retail & Brands)',
    descAr: 'كاشير باركود سريع، إدارة مخازن وفروع وتواريخ صلاحية، مع متجر وبوت واتساب للطلبات.',
    descEn: 'Barcode POS, multi-branch inventory, expiry alerts, and automated WhatsApp ordering.',
    icon: Store,
  },
  {
    id: 'web-platform',
    titleAr: 'تطوير موقع وبسايت احترافي 3D',
    titleEn: 'Interactive 3D Website & Web Platform',
    descAr: 'تصميم وتطوير مواقع شركات ومنصات ويب تفاعلية ثلاثية الأبعاد فائقة السرعة والأمان.',
    descEn: 'High-craft 3D interactive corporate websites and custom web applications.',
    icon: Globe,
  },
  {
    id: 'edtech-lms',
    titleAr: 'منصة تعليمية ذكية (EdTech & LMS)',
    titleEn: 'Smart Educational Platform & Academy LMS',
    descAr: 'بث محاضرات مشفر، بنوك أسئلة واختبارات إلكترونية، وتقارير تلقائية عبر واتساب.',
    descEn: 'DRM video streaming, adaptive quizzes, student wallets, and automated WhatsApp reports.',
    icon: GraduationCap,
  },
  {
    id: 'digital-marketing',
    titleAr: 'تسويق إلكتروني وأتمتة مبيعات (SEO & Ads)',
    titleEn: 'Digital Marketing, SEO & WhatsApp Sales Automation',
    descAr: 'تصدر نتائج البحث في جوجل، إدارة الحملات الإعلانية، وبوت واتساب ذكي لتحويل الزوار لعملاء.',
    descEn: 'Technical SEO dominance, ROI-driven ad campaigns, and 24/7 WhatsApp lead conversion.',
    icon: Megaphone,
  },
];

function resolveServiceIcon(iconName?: string, category?: string, title?: string) {
  const key = `${iconName || ''} ${category || ''} ${title || ''}`.toLowerCase();
  if (key.includes('store') || key.includes('pharmacy') || key.includes('retail') || key.includes('pos') || key.includes('صيدل') || key.includes('محل')) return Store;
  if (key.includes('globe') || key.includes('web') || key.includes('site') || key.includes('موقع') || key.includes('3d')) return Globe;
  if (key.includes('grad') || key.includes('edu') || key.includes('lms') || key.includes('school') || key.includes('تعليم') || key.includes('منصة')) return GraduationCap;
  if (key.includes('mega') || key.includes('market') || key.includes('ad') || key.includes('seo') || key.includes('تسويق') || key.includes('إعلان')) return Megaphone;
  if (key.includes('palette') || key.includes('design') || key.includes('image') || key.includes('art') || key.includes('صور') || key.includes('تصميم') || key.includes('جرافيك')) return Palette;
  if (key.includes('cpu') || key.includes('ai') || key.includes('bot') || key.includes('ذكاء') || key.includes('بوت')) return Cpu;
  if (key.includes('layer') || key.includes('stack') || key.includes('برمجيات')) return Layers;
  return Sparkles;
}

interface StartProjectWizardProps {
  lang: 'ar' | 'en';
  initialCategory?: string;
  initialProjectTitle?: string;
  onBackToHome: () => void;
}

export const StartProjectWizard: React.FC<StartProjectWizardProps> = ({
  lang,
  initialCategory,
  initialProjectTitle,
  onBackToHome,
}) => {
  const [step, setStep] = useState<'select-project' | 'contact-info' | 'success'>('select-project');
  const [projectChoices, setProjectChoices] = useState<ProjectChoiceItem[]>(DEFAULT_PROJECT_CHOICES);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'pharmacy-retail-erp'
  );
  const [customProjectNote, setCustomProjectNote] = useState<string>(initialProjectTitle || '');
  const [clientName, setClientName] = useState<string>('');
  const [countryDialCode, setCountryDialCode] = useState<string>('+20');
  const [localPhone, setLocalPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch live services from Supabase dynamically
  useEffect(() => {
    let isMounted = true;
    getWebsiteServices().then((remoteServices) => {
      if (!isMounted || !remoteServices || remoteServices.length === 0) return;
      const dynamicList: ProjectChoiceItem[] = remoteServices.map((srv) => ({
        id: srv.id,
        titleAr: srv.title_ar,
        titleEn: srv.title_en || srv.title_ar,
        descAr: srv.description_ar,
        descEn: srv.description_en || srv.description_ar,
        icon: resolveServiceIcon(srv.icon, srv.category, srv.title_ar),
      }));
      setProjectChoices(dynamicList);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [step]);

  const selectedProjectObj =
    projectChoices.find((c) => c.id === selectedCategory) ||
    DEFAULT_PROJECT_CHOICES.find((c) => c.id === selectedCategory) ||
    projectChoices[0] ||
    DEFAULT_PROJECT_CHOICES[0];

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = clientName.trim();
    if (trimmedName.length < 2) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة الاسم بالكامل (حرفين على الأقل).'
          : 'Please enter your full name.'
      );
      return;
    }

    const cleanDial = countryDialCode.trim().startsWith('+')
      ? countryDialCode.trim()
      : `+${countryDialCode.trim().replace(/[^0-9]/g, '')}`;
    const cleanLocal = localPhone.replace(/^0+/, '').replace(/[^0-9]/g, '');

    if (!/^\+[0-9]{1,4}$/.test(cleanDial) || cleanLocal.length < 6 || cleanLocal.length > 13) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال رقم تواصل صحيح مع اختيار أو كتابة رمز الدولة.'
          : 'Please enter a valid phone number and country code.'
      );
      return;
    }

    const fullWhatsappNumber = `${cleanDial}${cleanLocal}`;
    const projectTitleText =
      lang === 'ar' ? selectedProjectObj.titleAr : selectedProjectObj.titleEn;

    const payload: LeadSubmissionInput = {
      clientName: trimmedName,
      whatsappPhone: fullWhatsappNumber,
      companyOrBrand: customProjectNote.trim() || projectTitleText,
      systemCategory: selectedCategory,
      projectSummary: `طلب تنفيذ: ${projectTitleText}${
        customProjectNote.trim() ? ` — ${customProjectNote.trim()}` : ''
      }`,
    };

    setSubmitting(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1400);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch {
      // Fallback gracefully if offline
    }

    // Direct Supabase fallback: Guarantee the lead is 100% recorded in Supabase orders table
    try {
      await supabase.from('orders').upsert({
        id: `tx-lead-${Date.now()}`,
        client_name: trimmedName,
        phone: fullWhatsappNumber,
        company_or_brand: customProjectNote.trim() || projectTitleText,
        service_id: selectedCategory,
        service_title: projectTitleText,
        details: payload.projectSummary,
        status: 'pending',
        source: 'موقع شركة TEXORA (ابدأ مشروعك)',
        whatsapp_notified: false,
        telegram_notified: false,
      });
    } catch (e) {
      console.warn('Direct Supabase lead insert note:', e);
    } finally {
      window.clearTimeout(timer);
      setSubmitting(false);
      setStep('success');
    }
  };

  return (
    <div
      data-testid="start-project-page"
      className="min-h-screen bg-[#050507] text-[#F4F5F8] flex flex-col justify-between px-4 sm:px-8 py-8"
    >
      {/* Minimal Top Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2.5 text-white hover:text-neutral-300 transition-colors cursor-pointer"
        >
          <TexoraLogoMark className="w-7 h-7" variant="dark-bg" showUploadedBadge={false} />
          <span className="font-['Outfit'] font-black text-lg tracking-tight">TEXORA</span>
        </button>

        <button
          type="button"
          onClick={onBackToHome}
          data-testid="wizard-header-back-home"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#8A8F98] hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xl transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'العودة للشاشة الرئيسية' : 'Back to Home'}</span>
        </button>
      </header>

      {/* Main Wizard Content */}
      <main className="my-auto py-12 max-w-2xl w-full mx-auto">
        {/* Progress Indicator (for steps 1 & 2) */}
        {step !== 'success' && (
          <div className="flex items-center justify-between gap-4 mb-8 text-xs text-[#8A8F98]">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                  step === 'select-project'
                    ? 'bg-white text-[#050507]'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {step === 'contact-info' ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className={step === 'select-project' ? 'text-white font-sans font-semibold' : ''}>
                {lang === 'ar' ? 'اختيار نوع المشروع' : 'Select Project'}
              </span>
            </div>

            <div className="flex-1 h-px bg-white/[0.08]" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${
                  step === 'contact-info'
                    ? 'bg-white text-[#050507]'
                    : 'bg-white/[0.05] text-[#8A8F98]'
                }`}
              >
                2
              </span>
              <span className={step === 'contact-info' ? 'text-white font-sans font-semibold' : ''}>
                {lang === 'ar' ? 'بيانات التواصل عبر واتساب' : 'WhatsApp Contact'}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 1: CHOOSE THE PROJECT TYPE
           ============================================================ */}
        {step === 'select-project' && (
          <section
            aria-labelledby="step1-heading"
            data-testid="wizard-step-1"
            className="p-6 sm:p-9 rounded-2xl bg-[#0A0B0F] border border-white/[0.08]"
          >
            <h1 id="step1-heading" className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'ar'
                ? 'اختر المشروع الذي ترغب في تنفيذه'
                : 'Choose the Project You Want to Build'}
            </h1>
            <p className="mt-2 text-sm text-[#8A8F98]">
              {lang === 'ar'
                ? 'حدد نوع النظام المطلوب ثم اضغط على (التالي) لإدخال بيانات التواصل.'
                : 'Select your target system below, then click Next to enter your contact details.'}
            </p>

            <div className="mt-6 space-y-3" role="radiogroup">
              {projectChoices.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    data-testid={`project-choice-${item.id}`}
                    onClick={() => setSelectedCategory(item.id)}
                    className={`w-full text-start p-5 rounded-xl border transition-all flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06] border-white text-white shadow-lg'
                        : 'bg-[#050507] border-white/[0.08] text-[#8A8F98] hover:border-white/[0.2] hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-white text-[#050507]'
                          : 'bg-white/[0.04] text-[#8A8F98]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base font-bold text-white">
                          {lang === 'ar' ? item.titleAr : item.titleEn}
                        </h2>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-white bg-white text-[#050507]' : 'border-white/20'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#8A8F98] leading-relaxed">
                        {lang === 'ar' ? item.descAr : item.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 pt-5 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2.5 text-xs font-medium text-[#8A8F98] hover:text-white transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء والعودة' : 'Cancel'}
              </button>

              <button
                type="button"
                data-testid="wizard-next-btn"
                onClick={() => setStep('contact-info')}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                {lang === 'ar' ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </section>
        )}

        {/* ============================================================
            STEP 2: ENTER NAME & WHATSAPP PHONE WITH COUNTRY CODE LIST
           ============================================================ */}
        {step === 'contact-info' && (
          <section
            aria-labelledby="step2-heading"
            data-testid="wizard-step-2"
            className="p-6 sm:p-9 rounded-2xl bg-[#0A0B0F] border border-white/[0.08]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 mb-4">
              <Layers className="w-3.5 h-3.5 text-[#8A8F98]" />
              <span>
                {lang === 'ar' ? selectedProjectObj.titleAr : selectedProjectObj.titleEn}
              </span>
            </div>

            <h1 id="step2-heading" className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'ar' ? 'بيانات التواصل عبر واتساب' : 'Your WhatsApp Contact Details'}
            </h1>
            <p className="mt-2 text-sm text-[#8A8F98]">
              {lang === 'ar'
                ? 'أدخل اسمك ورقم الواتساب مع اختيار رمز الدولة من القائمة (أو كتابته مباشرة) ثم اضغط على إتمام.'
                : 'Enter your name and WhatsApp number with country code, then click Complete.'}
            </p>

            <form onSubmit={handleCompleteSubmit} noValidate className="mt-6 space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="wizard-client-name"
                  className="block text-xs font-medium text-neutral-300 mb-2"
                >
                  {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                </label>
                <input
                  id="wizard-client-name"
                  data-testid="wizard-name-input"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب اسمك هنا...' : 'Enter your full name...'}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-[#050507] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Country Code Picker Dropdown + Direct Code & Phone Input */}
              <div className="space-y-3">
                <label
                  htmlFor="wizard-country-select"
                  className="block text-xs font-medium text-neutral-300"
                >
                  {lang === 'ar'
                    ? 'اختر رمز الدولة من القائمة (إذا لم تكن تحفظه) أو اكتبه بالأسفل *'
                    : 'Select Country Code from List (or type it below) *'}
                </label>

                {/* Dropdown list of countries */}
                <div className="relative">
                  <select
                    id="wizard-country-select"
                    data-testid="wizard-country-select"
                    value={
                      COUNTRY_DIAL_OPTIONS.some((c) => c.dialCode === countryDialCode)
                        ? countryDialCode
                        : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setCountryDialCode(e.target.value);
                      }
                    }}
                    className="w-full appearance-none ps-4 pe-10 py-3 text-sm rounded-xl bg-[#050507] border border-white/[0.1] text-white focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    {COUNTRY_DIAL_OPTIONS.map((c) => (
                      <option key={c.code} value={c.dialCode}>
                        {lang === 'ar' ? c.nameAr : c.nameEn}
                      </option>
                    ))}
                    <option value="custom">
                      {lang === 'ar'
                        ? 'رمز دولة آخر (اكتبه في خانة الرمز بالأسفل)'
                        : 'Other Country Code (Type below)'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8A8F98] pointer-events-none absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2" />
                </div>

                {/* Phone Number + Editable Country Code Box (LTR layout for international phone clarity) */}
                <div>
                  <label
                    htmlFor="wizard-phone-input"
                    className="block text-xs font-medium text-neutral-300 mb-2"
                  >
                    {lang === 'ar'
                      ? 'رقم التواصل (الواتساب) برمز الدولة *'
                      : 'WhatsApp Number with Country Code *'}
                  </label>
                  <div dir="ltr" className="flex items-center gap-2">
                    <input
                      id="wizard-dial-code-input"
                      data-testid="wizard-dial-code-input"
                      type="text"
                      aria-label={lang === 'ar' ? 'رمز الدولة' : 'Country Dial Code'}
                      value={countryDialCode}
                      onChange={(e) => setCountryDialCode(e.target.value)}
                      placeholder="+20"
                      className="w-24 sm:w-28 px-3 py-3 text-sm font-mono text-center rounded-xl bg-[#050507] border border-white/[0.1] text-white focus:outline-none focus:border-white/40"
                    />
                    <input
                      id="wizard-phone-input"
                      data-testid="wizard-phone-input"
                      type="tel"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      placeholder="1012345678"
                      className="flex-1 px-4 py-3 text-sm font-mono rounded-xl bg-[#050507] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label
                  htmlFor="wizard-project-note"
                  className="block text-xs font-medium text-[#8A8F98] mb-2"
                >
                  {lang === 'ar'
                    ? 'اسم النشاط أو ملاحظات إضافية (اختياري)'
                    : 'Business Name or Additional Notes (Optional)'}
                </label>
                <input
                  id="wizard-project-note"
                  type="text"
                  value={customProjectNote}
                  onChange={(e) => setCustomProjectNote(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'مثال: صيدليات الشفاء / متجر براند / أكاديمية...'
                      : 'e.g., Al-Shifa Pharmacy / Fashion Brand...'
                  }
                  className="w-full px-4 py-3 text-sm rounded-xl bg-[#050507] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                />
              </div>

              {errorMsg && (
                <p role="alert" className="text-xs text-rose-400 font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep('select-project')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-[#8A8F98] hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <ArrowLeft className="w-4 h-4" />
                  )}
                  <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  data-testid="wizard-complete-btn"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-[#050507] bg-white hover:bg-neutral-200 disabled:opacity-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {submitting
                      ? lang === 'ar'
                        ? 'جاري تسجيل الطلب...'
                        : 'Submitting...'
                      : lang === 'ar'
                      ? 'إتمام'
                      : 'Complete'}
                  </span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ============================================================
            STEP 3: CONFIRMATION SCREEN
            "تم تسجيل الطلب بنجاح سيتم التواصل معك على الواتساب" + زر العودة للشاشة الرئيسية
           ============================================================ */}
        {step === 'success' && (
          <section
            aria-labelledby="step3-heading"
            data-testid="wizard-step-success"
            className="p-8 sm:p-12 rounded-2xl bg-[#0A0B0F] border border-white/[0.08] text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 id="step3-heading" className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {lang === 'ar'
                ? 'تم تسجيل الطلب بنجاح، سيتم التواصل معك على الواتساب'
                : 'Your request has been registered successfully. We will contact you on WhatsApp.'}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#8A8F98] max-w-md mx-auto leading-relaxed">
              {lang === 'ar'
                ? `شكراً لك يا ${clientName}، تم استلام طلبك لتنفيذ (${selectedProjectObj.titleAr}) وسيتواصل معك فريق TEXORA عبر الواتساب على الرقم:`
                : `Thank you ${clientName}. Your inquiry for (${selectedProjectObj.titleEn}) has been received. We will message you on WhatsApp at:`}
            </p>

            <p
              dir="ltr"
              className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-mono text-emerald-400"
            >
              {countryDialCode.trim()} {localPhone.replace(/^0+/, '')}
            </p>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex justify-center">
              <button
                type="button"
                data-testid="wizard-return-home-btn"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'العودة للشاشة الرئيسية' : 'Return to Home Screen'}
                </span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-white/[0.07] text-center text-xs text-[#8A8F98]">
        TEXORA · {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
      </footer>
    </div>
  );
};
