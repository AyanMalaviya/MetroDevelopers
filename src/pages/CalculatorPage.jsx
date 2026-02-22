// src/pages/Calculator.jsx
import { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  FileText, MapPin, ArrowLeft, X,
  ChevronLeft, ChevronRight, Calculator as CalcIcon,
  TrendingUp, Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalculatorComponent from '../components/Calculator/CalculatorComponent';
import SimpleCalculator from '../components/Calculator/SimpleCalculator';
import SEO from '../components/SEO/SEO';

/* ─── Motion variants (same as ContactPage) ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Calculator = () => {
  const { theme }  = useTheme();
  const navigate   = useNavigate();
  const isDark     = theme === 'dark';

  const [showAreaSheet, setShowAreaSheet]   = useState(false);
  const [showSiteLayout, setShowSiteLayout] = useState(false);
  const [currentTable, setCurrentTable]     = useState(0);

  /* ─── Section refs ─── */
  const heroRef  = useRef(null);
  const calcRef  = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const calcInView = useInView(calcRef, { once: true, margin: '-60px' });

  const tables = [
    { src: '/images/table1.jpg', alt: 'Area Sheet - Table 1' },
    { src: '/images/table2.jpg', alt: 'Area Sheet - Table 2' },
  ];

  const nextTable = () => setCurrentTable(p => (p + 1) % tables.length);
  const prevTable = () => setCurrentTable(p => (p - 1 + tables.length) % tables.length);

  /* ─── Shared modal backdrop + container ─── */
  const Modal = ({ show, onClose, children, label }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{ scale: 0.92,    opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-11 right-0 p-2 text-white/70 hover:text-brand-red transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            {children}

            {label && (
              <p className="text-center text-white/50 text-xs mt-3">{label}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <SEO
        title="Property ROI Calculator – Metro Industrial Park"
        description="Calculate ROI, rental yield and property values for industrial sheds at Metro Industrial Park, Moraiya, Ahmedabad."
        canonical="/calculator"
      />

      <div className={`min-h-screen theme-bg-primary ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

        {/* ══════════════════════════════════
            AREA SHEET MODAL
            ══════════════════════════════════ */}
        <Modal
          show={showAreaSheet}
          onClose={() => setShowAreaSheet(false)}
          label={`Table ${currentTable + 1} of ${tables.length}`}
        >
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={tables[currentTable].src}
              alt={tables[currentTable].alt}
              className="w-full h-auto select-none"
              draggable={false}
            />

            {tables.length > 1 && (
              <>
                <button
                  onClick={prevTable}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-brand-red/90 hover:bg-brand-red text-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTable}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-brand-red/90 hover:bg-brand-red text-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {tables.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTable(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === currentTable
                          ? 'w-7 bg-brand-red'
                          : 'w-2.5 bg-white/70 hover:bg-white'
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
          label="Metro Industrial Park — Site Layout"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/metro-industrial-map.jpg"
              alt="Metro Industrial Park - Site Layout"
              className="w-full h-auto select-none"
              draggable={false}
            />
          </div>
        </Modal>

        {/* ══════════════════════════════════
            HERO
            ══════════════════════════════════ */}
        <section
          ref={heroRef}
          className={`relative overflow-hidden pt-28 pb-10 sm:pt-32 sm:pb-14 ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-black to-black'
              : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          }`}
        >
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-brand-red/4 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 mb-7 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

              {/* Left: title block */}
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/10 border border-brand-red/20 rounded-full text-brand-red text-[11px] font-bold tracking-widest uppercase mb-4"
                >
                  <TrendingUp size={12} />
                  Real-time ROI Calculator
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Property <span className="text-brand-red">Calculator</span>
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={heroInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mb-3"
                />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Calculate ROI, rent &amp; property values instantly
                </motion.p>

                {/* Trust pills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 }}
                  className={`mt-4 flex flex-wrap gap-4 text-xs font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
                >
                  {['✓ 6–8% Annual ROI', '✓ From ₹4,000 sq.ft', '✓ 90 Day Possession', '✓ 63 Sheds'].map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </motion.div>
              </div>

              {/* Right: action buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => setShowAreaSheet(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 hover:border-brand-red hover:text-brand-red shadow-sm ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-200'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 text-brand-red" />
                  Area Sheet
                </button>

                <button
                  onClick={() => setShowSiteLayout(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 hover:border-brand-red hover:text-brand-red shadow-sm ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-200'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-red" />
                  Site Layout
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            QUICK STAT BAR
            ══════════════════════════════════ */}
        <div className={`border-y ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                How to use · Enter shed area below → get instant ROI &amp; rent estimates
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: <CalcIcon size={13} />,  label: 'ROI Calculator' },
                  { icon: <Layers size={13} />,    label: 'Simple Converter' },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      isDark
                        ? 'bg-gray-900 border-gray-800 text-gray-400'
                        : 'bg-white border-gray-200 text-gray-500 shadow-sm'
                    }`}
                  >
                    <span className="text-brand-red">{icon}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            CALCULATOR GRID
            ══════════════════════════════════ */}
        <section ref={calcRef} className="px-4 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto">

            <motion.div
              variants={stagger}
              initial="hidden"
              animate={calcInView ? 'visible' : 'hidden'}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Main Calculator — 2 cols */}
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <CalculatorComponent />
              </motion.div>

              {/* Simple Calculator — 1 col */}
              <motion.div variants={fadeUp} className="lg:col-span-1">
                <SimpleCalculator />
              </motion.div>
            </motion.div>

            {/* Bottom hint */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={calcInView ? 'visible' : 'hidden'}
              className={`text-center text-xs mt-6 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}
            >
              All calculations are estimates based on current market rates · Contact us for exact pricing
            </motion.p>
          </div>
        </section>

      </div>
    </>
  );
};

export default Calculator;
