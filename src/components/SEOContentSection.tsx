import React, { useState, useMemo } from 'react';
import {
  SEO_KEYWORD_GROUPS,
  ALL_SEO_KEYWORDS,
  FAQ_DATA
} from '../data/seoKeywords';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Globe2,
  Sparkles,
  Layers,
  GraduationCap,
  Store,
  Bot,
  MapPin,
  CheckCircle2,
  ArrowUpLeft,
  ArrowUpRight
} from 'lucide-react';

interface SEOContentSectionProps {
  lang: 'ar' | 'en';
  onOpenStartProject?: () => void;
}

export const SEOContentSection: React.FC<SEOContentSectionProps> = ({
  lang,
  onOpenStartProject
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'directory' | 'keywords'>('faq');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredKeywords = useMemo(() => {
    let list = ALL_SEO_KEYWORDS;
    if (selectedCategory !== 'all') {
      const group = SEO_KEYWORD_GROUPS.find((g) => g.category === selectedCategory);
      if (group) list = group.keywords;
    }
    if (!keywordFilter.trim()) return list;
    const q = keywordFilter.trim().toLowerCase();
    return list.filter((k) => k.toLowerCase().includes(q));
  }, [keywordFilter, selectedCategory]);

  return (
    <section
      id="knowledge-base"
      aria-labelledby="seo-section-heading"
      className="relative z-30 py-28 px-4 sm:px-8 bg-[#050507] border-t border-white/[0.07]"
    >
      <div className="max-w-6xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#8A8F98] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {lang === 'ar'
                ? 'دليل الخدمات والأسئلة الشائعة وقاعدة البحث'
                : 'Capabilities Directory, FAQs & Search Index'}
            </span>
          </div>
          <h2
            id="seo-section-heading"
            className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug"
            style={{ textWrap: 'balance' }}
          >
            {lang === 'ar'
              ? 'كل ما تبحث عنه حول شركة TEXORA وحلول البرمجيات المتقدمة'
              : 'Everything About TEXORA Software, Systems & Engineering Solutions'}
          </h2>
          <p className="mt-4 text-sm text-[#8A8F98] leading-relaxed">
            {lang === 'ar'
              ? 'دليل تقني مفصل وشامل يوضح خدماتنا في تطوير المواقع ثلاثية الأبعاد، المنصات التعليمية، أنظمة الكاشير والمحلات، تطبيقات الجوال والذكاء الاصطناعي في السعودية ومصر والخليج.'
              : 'Comprehensive technical overview of our 3D web platforms, LMS edtech, ERP & POS cashier systems, mobile apps, and enterprise AI automation across Saudi Arabia and the MENA region.'}
          </p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-white text-[#050507] shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-[#8A8F98] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {lang === 'ar' ? 'الأسئلة الشائعة والأجوبة (FAQ)' : 'Frequently Asked Questions'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-[#050507] shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-[#8A8F98] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {lang === 'ar' ? 'دليل الخدمات والأنظمة' : 'Systems & Capabilities'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keywords')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'keywords'
                ? 'bg-white text-[#050507] shadow-lg shadow-white/10'
                : 'bg-white/[0.03] text-[#8A8F98] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {lang === 'ar'
              ? `فهرس البحث والكلمات (${ALL_SEO_KEYWORDS.length}+)`
              : `Search Index (${ALL_SEO_KEYWORDS.length}+)`}
          </button>
        </div>

        {/* TAB 1: FAQ ACCORDION (Rich Semantic HTML for Google Rich Snippets) */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_DATA.map((item, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                    aria-expanded={isExpanded}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {item.question}
                    </h3>
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#8A8F98]">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#8A8F98] leading-relaxed border-t border-white/[0.04] pt-4">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: SYSTEM CAPABILITIES & SERVICES DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Web & 3D */}
            <article className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'تطوير المواقع والويب ثلاثي الأبعاد' : '3D Web & Enterprise Platforms'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'بناء مواقع ويب معمارية تفاعلية ثلاثية الأبعاد باستخدام Three.js و React و Next.js مع أداء خارق وسرعة تحميل فائقة وتوافق تام مع محركات البحث SEO.'
                  : 'Architectural interactive 3D web applications engineered with Three.js, React, and Next.js, optimized for sub-second speeds and top Google rankings.'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'ar' ? 'مواقع شركات ومؤسسات كبرى' : 'Corporate & Enterprise Portals'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'ar' ? 'متاجر إلكترونية وبوابات دفع' : 'Custom E-Commerce & Payment Gateways'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'ar' ? 'استضافة وحماية Cloudflare سحابية' : 'Cloudflare Global Edge Protection'}</span>
                </li>
              </ul>
            </article>

            {/* Card 2: Saudi & Gulf */}
            <article id="saudi-business" className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all scroll-mt-24">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'حلول البرمجة في الرياض والسعودية' : 'Saudi Arabia & Gulf Solutions'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'خدمات برمجة وتصميم مواقع للشركات في الرياض، جدة، والدمام، متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (الفاتورة الإلكترونية) وبوابات الدفع السعودية (مدى، Apple Pay).'
                  : 'Tailored digital platforms for businesses in Riyadh, Jeddah, and GCC, compliant with ZATCA e-invoicing and local payment gateways (Mada, Apple Pay).'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'عمل موقع للشغل في الرياض' : 'Riyadh Business Web Development'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'منصات عقارية ومقاولات بالرياض' : 'Real Estate & Contracting Portals'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'توافق تام مع رؤية المملكة 2030' : 'Saudi Vision 2030 Ready Architecture'}</span>
                </li>
              </ul>
            </article>

            {/* Card 3: LMS EdTech */}
            <article className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'منصة EduVerse التعليمية والسناتر' : 'EduVerse LMS & Academy Platform'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'بناء منصات تعليمية وكورسات للمدرسين والسناتر والأكاديميات مع حماية ضد تصوير الشاشة وتسريب الفيديوهات، وبنوك أسئلة واختبارات وتصحيح تلقائي فوري.'
                  : 'Proprietary LMS for educators, academies, and tutoring centers with dynamic anti-piracy screen watermarking, automated testing, and student tracking.'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'تشفير الفيديوهات وحماية DRM' : 'DRM Video Protection & Anti-Recording'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'حضور وغياب الطلاب بالـ QR Code' : 'QR Attendance & Student Performance'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'بوابات دفع (فوري، باي موب، مدى)' : 'Instant Multi-Gateway Checkout'}</span>
                </li>
              </ul>
            </article>

            {/* Card 4: ERP & POS */}
            <article className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'أنظمة المحلات والصيدليات PharmaCore' : 'PharmaCore ERP & Retail POS'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'نظام كاشير ونقاط بيع وإدارة مخازن سحابي متطور يعمل بدون انترنت (Offline-First) مع إدارة صلاحيات الأدوية، الباركود، والفواتير الضريبية المعتمدة.'
                  : 'High-speed offline-first POS & ERP system designed for pharmacies, retail stores, and supermarkets with barcode scanning and ZATCA compliance.'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'يعمل بدون انترنت مع مزامنة سحابية' : 'Offline-First Seamless Sync'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'إدارة متعددة الفروع والمخازن' : 'Multi-Branch & Warehouse Inventory'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'فواتير ضريبية وتقارير أرباح لحظية' : 'Instant Tax Invoices & Profit Reports'}</span>
                </li>
              </ul>
            </article>

            {/* Card 5: Mobile Apps & AI */}
            <article className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'تطبيقات الجوال وبوتات واتساب الذكية' : 'Mobile Apps & WhatsApp AI Bots'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'برمجة تطبيقات iOS و Android احترافية، وربط شات بوت واتساب الذكي لخدمة العملاء على مدار 24 ساعة، استقبال الطلبات، والحجوزات الآلية.'
                  : 'Native and cross-platform mobile apps combined with autonomous 24/7 WhatsApp AI bots for customer support, order booking, and CRM synchronization.'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تطبيقات Flutter و React Native' : 'Modern Flutter & React Native Apps'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'بوت واتساب ذكي 24/7 للرد والحجز' : '24/7 WhatsApp AI Autonomous Agents'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'ربط مباشر بأنظمة الشركات وقواعد البيانات' : 'Direct SQL & CRM Integration'}</span>
                </li>
              </ul>
            </article>

            {/* Card 6: Technical SEO & Speed */}
            <article className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 hover:border-white/[0.18] transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {lang === 'ar' ? 'السيو التقني وتصدر محركات البحث' : 'Technical SEO & Search Optimization'}
              </h3>
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-4">
                {lang === 'ar'
                  ? 'تهيئة كاملة لموقعك وفق أحدث خوارزميات جوجل لضمان الفهرسة السريعة، سرعة استجابة فائقة، وظهور موقعك في النتائج الأولى لعمليات البحث المستهدفة.'
                  : 'Full technical SEO architecture designed to pass Google Core Web Vitals, accelerate indexing, and position your brand on top of search results.'}
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 border-t border-white/[0.06] pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'ar' ? 'بيانات منظمة Schema.org JSON-LD' : 'Comprehensive Structured Data Graph'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'ar' ? 'سرعة فائقة مطابقة لمعايير Core Web Vitals' : 'Google Core Web Vitals Passed'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'ar' ? 'فهرسة سريعة في Google Search Console' : 'Accelerated Googlebot Indexing'}</span>
                </li>
              </ul>
            </article>
          </div>
        )}

        {/* TAB 3: KEYWORDS SEARCH & CLOUD INDEX (>300 keywords) */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            {/* Filter and Category Pills */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#090A0F]/60 p-4 rounded-2xl border border-white/[0.08]">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8A8F98] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'ابحث بين أكثر من 300 كلمة مفتاحية...'
                      : 'Search among 300+ keywords...'
                  }
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pr-9 pl-4 py-2.5 text-xs text-white placeholder-[#8A8F98] focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.04] text-[#8A8F98] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {SEO_KEYWORD_GROUPS.map((grp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCategory(grp.category)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === grp.category
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/[0.04] text-[#8A8F98] hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? grp.category.split(' ')[0] : grp.categoryEn.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Pills Display */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#090A0F]/60 max-h-[420px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] text-neutral-300 border border-white/[0.06] hover:border-white/20 hover:text-white transition-colors"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-[#8A8F98]">
              {lang === 'ar'
                ? `إجمالي العبارات المفهرسة: ${filteredKeywords.length} كلمة وجملة بحثية معتمدة.`
                : `Total indexed search queries: ${filteredKeywords.length} terms verified.`}
            </p>
          </div>
        )}

        {/* BOTTOM ACTION CALLOUT */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onOpenStartProject}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg shadow-white/5"
          >
            <span>{lang === 'ar' ? 'ابدأ مشروعك البرمجي مع TEXORA الآن' : 'Start Your Project with TEXORA Now'}</span>
            {lang === 'ar' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};
