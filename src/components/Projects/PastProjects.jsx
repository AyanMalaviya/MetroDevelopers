// src/components/Projects/PastProjects.jsx
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PAST_PROJECTS = [
  {
    code: '01',
    name: 'Shiv Industrial Estate',
    location: 'Moraiya, Ahmedabad',
    year: '2020–2021',
    area: '30,000 sq.ft',
    units: '8 Industrial Sheds',
    status: 'Fully Occupied',
    description: 'Industrial complex engineered with modern utility infrastructure. Successfully completed and handed over.',
    highlights: ['High-ceiling units', '24/7 power backup', 'Wide access roads', 'Modern offices'],
  },
  {
    code: '02',
    name: 'Chavda Estate Development',
    location: 'Changodar, Ahmedabad',
    year: '2019–2020',
    area: '25,000 sq.ft',
    units: '6 Industrial Units',
    status: 'Completed',
    description: 'Dedicated facility delivered for manufacturing and regional logistics operations in Changodar.',
    highlights: ['Heavy-duty flooring', 'Three-phase power', 'Ample parking', 'Security systems'],
  },
  {
    code: '03',
    name: 'Moraiya Industrial Complex',
    location: 'Moraiya, Ahmedabad',
    year: '2018–2019',
    area: '40,000 sq.ft',
    units: '10 Warehouse Units',
    status: 'Operational',
    description: 'Large-format warehousing development catering to diverse industrial occupiers with comprehensive utilities.',
    highlights: ['Multi-purpose units', 'Loading docks', 'Fire safety', 'CCTV surveillance'],
  },
];

const PastProjects = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const divide    = isDark ? 'divide-white/[0.1]' : 'divide-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <section
      className={`min-h-screen py-16 sm:py-24 ${bgPage} ${textMain}`}
      style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Asymmetric Editorial Header */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 sm:pb-12 mb-12 border-b ${border}`}>
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="text-brand-red font-semibold">ARCHIVE</span>
              <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
              <span className={textMuted}>Delivered Developments · 2018–2021</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.06] ${textMain}`}>
              Our Legacy <span className="text-brand-red">Projects</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex items-end lg:justify-end lg:text-right">
            <p className={`text-sm sm:text-base leading-relaxed max-w-md ${textBody}`}>
              A verified track record of completed industrial estates and warehouses across Moraiya and Changodar prior to the Metro Industrial Park series.
            </p>
          </div>
        </div>

        {/* Project Dossiers */}
        <div className="space-y-8">
          {PAST_PROJECTS.map((project) => (
            <article
              key={project.code}
              className={`border ${border} ${bgSurface} grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${divide}`}
            >
              {/* Left 8 Cols: Description & Highlights */}
              <div className="lg:col-span-8 p-6 sm:p-9 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
                    <span className="text-brand-red font-bold">PROJECT {project.code}</span>
                    <span className={`inline-flex items-center gap-2 ${textMuted}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      {project.status}
                    </span>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 ${textMain}`}>
                    {project.name}
                  </h3>

                  <div className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-xs mb-5 ${textMuted}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-brand-red" aria-hidden="true" />
                      {project.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-brand-red" aria-hidden="true" />
                      {project.year}
                    </span>
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed ${textBody}`}>
                    {project.description}
                  </p>
                </div>

                <div className={`pt-5 border-t ${border}`}>
                  <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-3 ${textMuted}`}>
                    Key Highlights
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2.5 text-sm">
                        <Check size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                        <span className={textMain}>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Border-Collapsed Metric Column */}
              <div className={`lg:col-span-4 divide-y ${divide} flex flex-col justify-between ${bgPage}`}>
                <div className="p-6">
                  <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-1.5 ${textMuted}`}>
                    Total Built Area
                  </div>
                  <div className={`text-2xl font-extrabold tracking-tight tabular-nums ${textMain}`}>
                    {project.area}
                  </div>
                </div>

                <div className="p-6">
                  <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-1.5 ${textMuted}`}>
                    Units Delivered
                  </div>
                  <div className={`text-2xl font-extrabold tracking-tight tabular-nums ${textMain}`}>
                    {project.units}
                  </div>
                </div>

                <div className="p-6 relative flex-1 flex flex-col justify-center">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                  <div className="text-3xl font-extrabold tracking-tight tabular-nums text-brand-red">
                    100%
                  </div>
                  <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mt-1 ${textMuted}`}>
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className={`mt-14 border ${border} ${bgSurface} p-7 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6`}>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-red font-semibold mb-2">
              Next Development
            </div>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}>
              Partner with Metro Enterprise on your next facility
            </h3>
            <p className={`text-sm sm:text-base ${textBody}`}>
              Join manufacturing and logistics businesses operating across our Ahmedabad parks.
            </p>
          </div>
          <Link
            to="/contact"
            className="py-4 px-7 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2.5 shrink-0 transition-colors"
          >
            <span>Contact Site Office</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PastProjects;