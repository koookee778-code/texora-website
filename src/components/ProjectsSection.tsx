import React, { useState } from 'react';
import { PROJECT_CASE_STUDIES, ProjectCaseStudy } from '../data/texoraData';
import { ArrowUpLeft, ArrowUpRight, CheckCircle2, X } from 'lucide-react';

interface ProjectsSectionProps {
  lang: 'ar' | 'en';
  onSelectCategoryForQuote: (category: ProjectCaseStudy['category'], projectTitle: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  lang,
  onSelectCategoryForQuote,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  const filters = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'pharmacy-retail-erp', labelAr: 'صيدليات ومتاجر', labelEn: 'Pharmacy & Retail' },
    { id: 'edtech-lms', labelAr: 'منصات تعليمية', labelEn: 'EdTech LMS' },
    { id: 'digital-marketing', labelAr: 'مواقع 3D وتسويق', labelEn: '3D Web & Growth' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? PROJECT_CASE_STUDIES
      : PROJECT_CASE_STUDIES.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-30 py-32 px-4 sm:px-8 bg-[#050507] border-t border-white/[0.07]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Minimalist Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.07]">
          <div>
            <p
              className={`text-xs uppercase mb-3 ${
                lang === 'ar'
                  ? 'font-medium text-[#8A8F98] tracking-normal'
                  : 'font-mono tracking-widest text-[#8A8F98]'
              }`}
            >
              {lang === 'ar' ? '01 / الأعمال والأنظمة المنفذة' : '01 / SELECTED WORKS'}
            </p>
            <h2
              id="projects-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {lang === 'ar'
                ? 'أنظمة مصممة بمعايير الشركات العالمية'
                : 'Systems Engineered for Scale'}
            </h2>
          </div>

          {/* Clean Segmented Filter */}
          <div
            role="tablist"
            aria-label={lang === 'ar' ? 'تصفية المشاريع' : 'Filter projects'}
            className="flex flex-wrap items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl shrink-0"
          >
            {filters.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#050507] font-semibold'
                      : 'text-[#8A8F98] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? f.labelAr : f.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uncrowded 2-Column Bento Grid (Max 4 data points per card) */}
        <div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          data-testid="projects-grid"
        >
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col justify-between p-8 rounded-2xl bg-[#0A0B0F] border border-white/[0.08] hover:border-white/[0.2] transition-colors"
            >
              <div>
                {/* Data Point 1: Category & Client */}
                <div className="flex items-center gap-2 text-xs text-[#8A8F98] mb-3">
                  <span className="text-white/90 font-medium">
                    {lang === 'ar' ? project.categoryLabelAr : project.categoryLabelEn}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'ar' ? project.clientAr : project.clientEn}</span>
                </div>

                {/* Data Point 2: Title */}
                <h3 className="text-xl font-bold text-white leading-snug">
                  {lang === 'ar' ? project.titleAr : project.titleEn}
                </h3>

                {/* Data Point 3: Concise 2-Line Description */}
                <p className="mt-3 text-sm text-[#8A8F98] leading-relaxed line-clamp-2">
                  {lang === 'ar' ? project.summaryAr : project.summaryEn}
                </p>
              </div>

              {/* Data Point 4: Impact Metric + Single Clean Action */}
              <div className="mt-8 pt-5 border-t border-white/[0.07] flex items-center justify-between gap-4">
                <span
                  className={`text-xs text-emerald-400 ${
                    lang === 'ar' ? 'font-medium font-sans' : 'font-mono'
                  }`}
                >
                  {lang === 'ar' ? project.impactMetricAr : project.impactMetricEn}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Case Study'}</span>
                  {lang === 'ar' ? (
                    <ArrowUpLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Clean Case Study Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0B0C10] border border-white/[0.12] p-7 sm:p-8 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
              <div>
                <p className="text-xs text-[#8A8F98]">
                  {lang === 'ar'
                    ? selectedProject.categoryLabelAr
                    : selectedProject.categoryLabelEn}{' '}
                  · {lang === 'ar' ? selectedProject.clientAr : selectedProject.clientEn}
                </p>
                <h3 id="modal-project-title" className="mt-1 text-xl font-bold text-white">
                  {lang === 'ar' ? selectedProject.titleAr : selectedProject.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="p-2 text-[#8A8F98] hover:text-white rounded-lg bg-white/[0.04] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-5 text-sm text-[#8A8F98] leading-relaxed">
              {lang === 'ar' ? selectedProject.summaryAr : selectedProject.summaryEn}
            </p>

            <ul className="mt-6 space-y-2.5">
              {(lang === 'ar'
                ? selectedProject.featuresAr
                : selectedProject.featuresEn
              ).map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 pt-5 border-t border-white/[0.08] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-medium text-[#8A8F98] hover:text-white rounded-lg cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const cat = selectedProject.category;
                  const title =
                    lang === 'ar' ? selectedProject.titleAr : selectedProject.titleEn;
                  setSelectedProject(null);
                  onSelectCategoryForQuote(cat, title);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-[#050507] bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
              >
                {lang === 'ar' ? 'اطلب نظاماً مماثلاً' : 'Request Similar System'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
