// src/pages/CalculatorPage.jsx
import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  FileText, MapPin, ArrowLeft, X,
  ChevronLeft, ChevronRight, Calculator as CalcIcon,
  Layers,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CalculatorComponent from '../components/Calculator/CalculatorComponent';
import SimpleCalculator from '../components/Calculator/SimpleCalculator';
import SEO from '../components/SEO/SEO';
import { propertySchema } from '../utils/schemas.js';

const EASE = [0.16, 1, 0.3, 1];

const TABLES = [
  { src: '/images/metro-industrial-park-area-details-table-1.jpg', alt: 'Area Sheet - Table 1' },
  { src: '/images/metro-industrial-park-area-details-table-2.jpg', alt: 'Area Sheet - Table 2' },
];

const CALCULATOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Metro Industrial Park ROI Calculator',
  applicationCategory: 'BusinessApplication',
  description:
    'Calculate ROI, rental yield, and property values for industrial sheds at Metro Industrial Park, Ahmedabad.',
  operatingSystem: 'Web',
  url: 'https://www.metrodevelopers.co.in/calculator',
};

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  border:    isDark ? 'border-white/[0.12]' : 'border-gray-200',
  divide:    isDark ? 'divide-white/[0.12]' : 'divide-gray-200',
  textMain:  isDark ? 'text-white' : 'text-gray-900',
  textBody:  isDark ? 'text-gray-200' : 'text-gray-700',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
});

/* ─── Hoisted Architectural Modal ─── */
const Modal = memo(({ show, onClose, children, label }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="relative max-w-5xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">
            <span>{label || 'Reference Drawing'}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 border border-white/25 bg-black hover:bg-brand-red hover:border-brand-red text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

const Calculator = () => {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDark    = theme === 'dark';
  const t         = getTokens(isDark);

  const prefillUnit = location.state?.prefillUnit || null;

  const [showAreaSheet, setShowAreaSheet]   = useState(false);
  const [showSiteLayout, setShowSiteLayout] = useState(false);
  const [currentTable, setCurrentTable]     = useState(0);

  const calcRef    = useRef(null);
  const calcInView = useInView(calcRef, { once: true, margin: '-60px' });

  const nextTable = useCallback(() => setCurrentTable((p) => (p + 1) % TABLES.length), []);
  const prevTable = useCallback(() => setCurrentTable((p) => (p - 1 + TABLES.length) % TABLES.length), []);

  useEffect(() => {
    if (!prefillUnit) {
      window.scrollTo(0, 0);
    }
  }, [prefillUnit]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowAreaSheet(false);
        setShowSiteLayout(false);
      }
      if (showAreaSheet) {
        if (e.key === 'ArrowRight') nextTable();
        if (e.key === 'ArrowLeft')  prevTable();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAreaSheet, nextTable, prevTable]);

  return (
    <>
      <SEO
        title="Industrial Shed ROI Calculator for Moraiya, Changodar, Ahmedabad"
        description="Calculate ROI, rental yield, and estimated returns for industrial sheds and warehouses in Moraiya, Changodar, and Ahmedabad."
        canonical="/calculator"
        ogImageAlt="Industrial shed ROI calculator for Moraiya Changodar Ahmedabad"
        structuredData={[propertySchema, CALCULATOR_SCHEMA]}
      />

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ══════════════════════════════════
            AREA SHEET MODAL
            ══════════════════════════════════ */}
        <Modal
          show={showAreaSheet}
          onClose={() => setShowAreaSheet(false)}
          label={`Area Schedule — Table 0${currentTable + 1} / 0${TABLES.length}`}
        >
          <div className="relative border border-white/15 bg-black">
            <img
              src={TABLES[currentTable].src}
              alt={TABLES[currentTable].alt}
              className="w-full h-auto max-h-[80vh] object-contain select-none"
              draggable={false}
            />

            {TABLES.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevTable}
                  aria-label="Previous table"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 hover:bg-brand-red border border-white/25 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextTable}
                  aria-label="Next table"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/80 hover:bg-brand-red border border-white/25 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {TABLES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentTable(i)}
                      aria-label={`View table ${i + 1}`}
                      className={`h-[3px] transition-all duration-300 ${
                        i === currentTable ? 'w-10 bg-brand-red' : 'w-4 bg-white/45 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* ══════════════════════════════════
            SITE LAYOUT MODAL
            ══════════════════════════════════ */}
        <Modal
          show={showSiteLayout}
          onClose={() => setShowSiteLayout(false)}
          label="Metro Industrial Park — Master Site Plan"
        >
          <div className="border border-white/15 bg-black">
            <img
              src="/images/metro-industrial-park-site-plan-moraiya.jpg"
              alt="Metro Industrial Park - Site Layout"
              className="w-full h-auto max-h-[80vh] object-contain select-none"
              draggable={false}
            />
          </div>
        </Modal>

        {/* ══════════════════════════════════
            HERO — ARCHITECTURAL HEADER
            ══════════════════════════════════ */}
        <section className={`pt-20 sm:pt-24 border-b ${t.border} ${t.bgSurface}`}>
          {/* Top Utility Strip */}
          <div className={`border-y ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${t.textMuted} hover:text-brand-red transition-colors`}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                <span>Back</span>
              </button>

              <span className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] ${t.textMuted}`}>
                Financial Tool · Moraiya &amp; Changodar
              </span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
            >
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span className="text-brand-red font-semibold">TOOL 01</span>
                  <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                  <span className={t.textMuted}>Real-Time ROI &amp; Valuation</span>
                </div>

                <h1 className={`text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15] mb-4 ${t.textMain}`}>
                  Property{' '}
                  <span className="font-calligraphy font-normal text-[1.25em] tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                    Calculator
                  </span>
                  <span className="text-brand-red">.</span>
                </h1>

                <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${t.textBody}`}>
                  Estimate annual rental yield, monthly lease cashflow, and total industrial shed valuation across Moraiya and Changodar in real time.
                </p>
              </div>

              {/* Reference Drawing Triggers */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAreaSheet(true)}
                  className={`py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red font-bold text-xs uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap`}
                >
                  <FileText size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                  <span>Area Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSiteLayout(true)}
                  className={`py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red font-bold text-xs uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap`}
                >
                  <MapPin size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                  <span>Site Layout</span>
                </button>
              </div>
            </motion.div>

            {/* 4-Cell Benchmark Strip */}
            <div className={`mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {[
                { code: '01', value: '12–16%',  label: 'Yield + Appreciation', accent: true  },
                { code: '02', value: '4K–50K',  label: 'Sq.ft Shed Range',     accent: false },
                { code: '03', value: '90 Days', label: 'Possession Timeline',  accent: false },
                { code: '04', value: '63',      label: 'Units in MIP 1',       accent: false },
              ].map((m) => (
                <div key={m.code} className={`p-5 border-r border-b ${t.border} ${t.bgPage}`}>
                  <div className={`font-mono text-[10px] mb-2.5 ${t.textMuted}`}>{m.code}</div>
                  <div className={`text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${m.accent ? 'text-brand-red' : t.textMain}`}>
                    {m.value}
                  </div>
                  <div className={`font-mono text-[10px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            OPERATIONAL INSTRUCTION BAR
            ══════════════════════════════════ */}
        <div className={`border-b ${t.border} ${t.bgPage}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <p className={`font-mono text-[11px] uppercase tracking-[0.12em] ${t.textMuted}`}>
              How to use · Enter shed area below → get instant ROI &amp; rent estimates
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: CalcIcon, label: 'ROI Calculator'   },
                { icon: Layers,   label: 'Simple Converter' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 border ${t.border} ${t.bgSurface} font-mono text-[10px] uppercase tracking-[0.12em] ${t.textMain}`}
                >
                  <Icon size={12} className="text-brand-red" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            CALCULATOR WORKSPACE
            ══════════════════════════════════ */}
        <section ref={calcRef} className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={calcInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
            >
              {/* Main Calculator — 2 cols */}
              <div className="lg:col-span-2">
                <CalculatorComponent prefillUnit={prefillUnit} />
              </div>

              {/* Simple Calculator — 1 col */}
              <div className="lg:col-span-1">
                <SimpleCalculator />
              </div>
            </motion.div>

            <p className={`font-mono text-[11px] uppercase tracking-[0.12em] text-center mt-8 ${t.textMuted}`}>
              All calculations are estimates based on prevailing corridor market rates · Contact site office for exact unit pricing
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Calculator;