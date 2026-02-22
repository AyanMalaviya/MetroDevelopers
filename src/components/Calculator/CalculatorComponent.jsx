// src/components/Calculator/CalculatorComponent.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Calculator as CalcIcon,
  TrendingUp, Layers, RotateCcw, RotateCw,
  BookOpen, X, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { calculateMultiplePlotArea } from '../../services/dataService';

/* ─── Motion variants (same as ContactPage) ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ══════════════════════════════════════════════
   INPUT FIELD
   ══════════════════════════════════════════════ */
const InputField = memo(({
  label, field, value, onChange, onKeyDown,
  suffix = '', highlighted = false,
  lockable = false, isLocked = false, onToggleLock,
  helperText = null, isProcessing = false,
  allowSpecialChars = false,
  showButton = false, onButtonClick = null, buttonDisabled = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* Border/ring colours by state */
  const borderCls = isLocked
    ? 'border-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 bg-amber-500/5'
    : highlighted
      ? 'border-brand-red/40 focus:border-brand-red focus:ring-brand-red/15 bg-brand-red/5'
      : isDark
        ? 'border-gray-700 focus:border-brand-red focus:ring-brand-red/15 bg-gray-800/50'
        : 'border-gray-200 focus:border-brand-red focus:ring-brand-red/15 bg-white';

  return (
    <motion.div variants={fadeUp} className="mb-4">
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={field}
          className={`text-xs font-bold uppercase tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {label}
        </label>
        {lockable && (
          <button
            type="button"
            onClick={onToggleLock}
            title={isLocked ? 'Unlock field' : 'Lock field'}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
              isLocked
                ? 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                : isDark
                  ? 'bg-gray-700 text-gray-500 hover:text-gray-300'
                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            {isLocked
              ? <><Lock className="w-3 h-3" /> Locked</>
              : <><Unlock className="w-3 h-3" /> Auto</>
            }
          </button>
        )}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={field}
            type="text"
            inputMode={allowSpecialChars ? 'text' : 'decimal'}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="0.00"
            autoComplete="off"
            className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200
              focus:outline-none focus:ring-4
              ${borderCls}
              ${isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-300'}
              ${isProcessing ? 'pr-10' : ''}
            `}
          />

          {/* Spinner */}
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-brand-red" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {/* Suffix badge inside input */}
          {suffix && !showButton && !isProcessing && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {suffix}
            </span>
          )}
        </div>

        {/* Plot calculate button */}
        {showButton && onButtonClick && (
          <button
            type="button"
            onClick={onButtonClick}
            disabled={buttonDisabled || isProcessing}
            title="Calculate total area (or press Enter)"
            className={`px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 shadow-md ${
              buttonDisabled || isProcessing
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-brand-red hover:bg-red-700 text-white hover:scale-105 shadow-brand-red/25'
            }`}
          >
            <CalcIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Helper */}
      {helperText && (
        <p className={`text-[10px] mt-1.5 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </motion.div>
  );
});
InputField.displayName = 'InputField';

/* ══════════════════════════════════════════════
   SECTION CARD
   ══════════════════════════════════════════════ */
const SectionCard = ({ title, icon, accent = 'brand-red', children, isDark }) => {
  const accentMap = {
    'brand-red': { border: 'border-brand-red/30', text: 'text-brand-red', bg: 'bg-brand-red/8' },
    blue:        { border: 'border-blue-500/30',  text: 'text-blue-500',  bg: 'bg-blue-500/8'  },
    green:       { border: 'border-green-500/30', text: 'text-green-500', bg: 'bg-green-500/8' },
  };
  const a = accentMap[accent] ?? accentMap['brand-red'];

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl border overflow-hidden shadow-lg ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      {/* Card header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${
        isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-gray-50/80'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}>
          <span className={a.text}>{icon}</span>
        </div>
        <h3 className={`text-sm font-extrabold uppercase tracking-widest ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {title}
        </h3>
      </div>

      {/* Card body */}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function CalculatorComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ── All original state (unchanged) ── */
  const [data, setData] = useState({
    sqYard: '', sqFt: '', carpetArea: '', carpetAreaSqFt: '',
    rate: '', value: '', roi: '', yearlyRent: '', monthlyRent: '',
  });
  const [locks, setLocks] = useState({
    value: false, roi: false, yearlyRent: false, monthlyRent: false,
  });
  const [plotResult, setPlotResult]               = useState(null);
  const [isCalculatingPlots, setIsCalculatingPlots] = useState(false);
  const [showFormulas, setShowFormulas]             = useState(false);
  const [history, setHistory]                       = useState([]);
  const [historyIndex, setHistoryIndex]             = useState(-1);
  const LOADING_FACTOR = 0.25;

  /* ── All original effects (unchanged) ── */
  useEffect(() => {
    const savedData  = localStorage.getItem('calculatorData');
    const savedLocks = localStorage.getItem('calculatorLocks');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch (e) { console.error('Failed to load data'); }
    }
    if (savedLocks) {
      try { setLocks(JSON.parse(savedLocks)); }
      catch (e) { console.error('Failed to load locks'); }
    }
  }, []);

  useEffect(() => {
    if (Object.values(data).some(v => v !== ''))
      localStorage.setItem('calculatorData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('calculatorLocks', JSON.stringify(locks));
  }, [locks]);

  /* ── All original callbacks (unchanged) ── */
  const toggleLock = useCallback((field) => {
    setLocks(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const saveToHistory = useCallback((newData) => {
    setHistory(prev => {
      const h = prev.slice(0, historyIndex + 1);
      h.push(newData);
      return h;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setData(history[historyIndex - 1]);
      setPlotResult(null);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setData(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const looksLikePlotNumbers = (value) => {
    if (!value) return false;
    if (/^\d+(\s*,\s*\d+)+$/.test(value)) return true;
    const s = value.trim().split(/\s+/);
    if (s.length >= 2 && s.every(n => /^\d+$/.test(n))) return true;
    return false;
  };

  const handlePlotCalculation = useCallback(async () => {
    const value = data.sqYard;
    if (!value || !looksLikePlotNumbers(value)) return;
    setIsCalculatingPlots(true);
    try {
      const result = await calculateMultiplePlotArea(value);
      if (result.plotCount > 0) {
        setPlotResult(result);
        setData(cur => {
          const updated = { ...cur, sqYard: result.totalSqYd.toString() };
          return calculateDependentFields('sqYard', result.totalSqYd.toString(), updated);
        });
        setTimeout(() => {
          setData(cur => { saveToHistory(cur); return cur; });
        }, 500);
      } else {
        setPlotResult(null);
      }
    } catch (e) {
      console.error('Plot calculation error:', e);
      setPlotResult(null);
    } finally {
      setIsCalculatingPlots(false);
    }
  }, [data.sqYard, saveToHistory]);

  const calculateDependentFields = useCallback((field, value, currentData) => {
    const newData = { ...currentData };
    const sqYard      = parseFloat(newData.sqYard)      || 0;
    const sqFt        = parseFloat(newData.sqFt)        || 0;
    const carpetArea  = parseFloat(newData.carpetArea)  || 0;
    const rate        = parseFloat(newData.rate)        || 0;
    const propValue   = parseFloat(newData.value)       || 0;
    const roi         = parseFloat(newData.roi)         || 0;
    const yearlyRent  = parseFloat(newData.yearlyRent)  || 0;
    const monthlyRent = parseFloat(newData.monthlyRent) || 0;

    switch (field) {
      case 'sqYard':
        if (sqYard > 0) {
          newData.sqFt = (sqYard * 9).toFixed(2);
          newData.carpetArea = (sqYard * (1 - LOADING_FACTOR)).toFixed(2);
          newData.carpetAreaSqFt = (parseFloat(newData.carpetArea) * 9).toFixed(2);
          if (rate > 0 && !locks.value) newData.value = (sqYard * rate).toFixed(2);
        }
        break;
      case 'sqFt':
        if (sqFt > 0) {
          newData.sqYard = (sqFt / 9).toFixed(2);
          newData.carpetArea = (parseFloat(newData.sqYard) * (1 - LOADING_FACTOR)).toFixed(2);
          newData.carpetAreaSqFt = (parseFloat(newData.carpetArea) * 9).toFixed(2);
          if (rate > 0 && !locks.value) newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        }
        break;
      case 'carpetArea':
        if (carpetArea > 0) {
          newData.sqYard = (carpetArea / (1 - LOADING_FACTOR)).toFixed(2);
          newData.sqFt = (parseFloat(newData.sqYard) * 9).toFixed(2);
          newData.carpetAreaSqFt = (carpetArea * 9).toFixed(2);
          if (rate > 0 && !locks.value) newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        }
        break;
      case 'rate':
        if (rate > 0 && parseFloat(newData.sqYard) > 0 && !locks.value)
          newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        if (!locks.value && parseFloat(newData.value) > 0) {
          if (yearlyRent > 0 && !locks.roi)
            newData.roi = ((yearlyRent / parseFloat(newData.value)) * 100).toFixed(2);
          else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * parseFloat(newData.value)) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          }
        }
        break;
      case 'value':
        if (propValue > 0 && parseFloat(newData.sqYard) > 0)
          newData.rate = (propValue / parseFloat(newData.sqYard)).toFixed(2);
        if (propValue > 0) {
          if (yearlyRent > 0 && !locks.roi)
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * propValue) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          }
        }
        break;
      case 'roi':
        if (roi > 0) {
          if (propValue > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * propValue) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          } else if (yearlyRent > 0 && !locks.value) {
            newData.value = ((yearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0)
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
          }
        }
        break;
      case 'yearlyRent':
        if (yearlyRent > 0 && !locks.monthlyRent)
          newData.monthlyRent = (yearlyRent / 12).toFixed(2);
        if (yearlyRent > 0) {
          if (propValue > 0 && !locks.roi)
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          else if (roi > 0 && !locks.value) {
            newData.value = ((yearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0)
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
          }
        }
        break;
      case 'monthlyRent':
        if (monthlyRent > 0 && !locks.yearlyRent)
          newData.yearlyRent = (monthlyRent * 12).toFixed(2);
        if (monthlyRent > 0) {
          const yr = parseFloat(newData.yearlyRent) || 0;
          if (propValue > 0 && !locks.roi)
            newData.roi = ((yr / propValue) * 100).toFixed(2);
          else if (roi > 0 && !locks.value) {
            newData.value = ((yr / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0)
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
          }
        }
        break;
    }
    return newData;
  }, [LOADING_FACTOR, locks]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    if (field === 'sqYard') {
      if (value !== '' && !/^[\d,\s.]+$/.test(value)) return;
      setData(cur => ({ ...cur, sqYard: value }));
      if (plotResult) setPlotResult(null);
      if (!looksLikePlotNumbers(value)) {
        const num = parseFloat(value);
        if (!isNaN(num) && value !== '') {
          setData(cur => {
            const updated = { ...cur, sqYard: value };
            return calculateDependentFields('sqYard', value, updated);
          });
        }
      }
      return;
    }
    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    setData(cur => {
      const updated = { ...cur, [field]: value };
      return calculateDependentFields(field, value, updated);
    });
    setTimeout(() => {
      setData(cur => { saveToHistory(cur); return cur; });
    }, 500);
  }, [calculateDependentFields, saveToHistory, plotResult]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && looksLikePlotNumbers(data.sqYard)) {
      e.preventDefault();
      handlePlotCalculation();
    }
  }, [data.sqYard, handlePlotCalculation]);

  const clearAll = useCallback(() => {
    const empty = {
      sqYard: '', sqFt: '', carpetArea: '', carpetAreaSqFt: '',
      rate: '', value: '', roi: '', yearlyRent: '', monthlyRent: '',
    };
    setData(empty);
    setPlotResult(null);
    saveToHistory(empty);
  }, [saveToHistory]);

  /* ── Formula rows ── */
  const formulas = [
    { label: 'Sq. Ft',           formula: 'Sq. Yard × 9'                    },
    { label: 'Carpet Area',      formula: 'Sq. Yard × 0.75'                 },
    { label: 'Value',            formula: 'Sq. Yard × Rate'                 },
    { label: 'Yearly Rent',      formula: 'Monthly Rent × 12'               },
    { label: 'ROI',              formula: '(Yearly Rent ÷ Value) × 100'     },
    { label: 'Value from ROI',   formula: '(Yearly Rent ÷ ROI) × 100'      },
  ];

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Header card ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden shadow-2xl mb-5"
        style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 60%, #111827 100%)' }}
      >
        <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <TrendingUp size={15} className="text-white" />
              </div>
              <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
                ROI &amp; Valuation
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Property Calculator
            </h2>
            <p className="text-white/50 text-xs mt-0.5">
              Lock fields · Enter plot numbers e.g. <span className="font-bold text-white/70">1,3,5</span> then press Enter ⏎
            </p>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <RotateCcw size={13} /> Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <RotateCw size={13} /> Redo
            </button>
            <button
              type="button"
              onClick={() => setShowFormulas(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white text-brand-red hover:bg-gray-100 transition-all shadow-md"
            >
              <BookOpen size={13} />
              {showFormulas ? 'Hide' : 'Formulas'}
            </button>
          </div>
        </div>

        {/* Progress bar: how many fields filled */}
        {(() => {
          const filled = Object.values(data).filter(v => v !== '').length;
          const pct    = Math.round((filled / 9) * 100);
          return (
            <div className="px-5 pb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-white/40 text-[10px] font-semibold">{filled} / 9 fields filled</span>
                <span className="text-white/50 text-[10px] font-bold">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          );
        })()}
      </motion.div>

      {/* ── Plot result banner ── */}
      <AnimatePresence>
        {plotResult && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border mb-5 overflow-hidden ${
              isDark ? 'bg-green-950/40 border-green-800' : 'bg-green-50 border-green-200'
            }`}
          >
            {/* Green top strip */}
            <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 w-full" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-green-500/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-extrabold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      {plotResult.plotCount} Plot{plotResult.plotCount > 1 ? 's' : ''} Calculated
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Total</span>
                        <p className={`font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {plotResult.totalSqYd} <span className="text-xs font-normal opacity-60">sq yd</span>
                        </p>
                      </div>
                      <div>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Sq. Ft</span>
                        <p className={`font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {plotResult.totalSqFt} <span className="text-xs font-normal opacity-60">sq ft</span>
                        </p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <details className="group">
                      <summary className={`flex items-center gap-1 text-xs cursor-pointer font-bold select-none ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                        View plot breakdown
                      </summary>
                      <div className={`mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs p-3 rounded-xl ${
                        isDark ? 'bg-gray-800/50' : 'bg-white'
                      }`}>
                        {plotResult.validPlots.map(plot => (
                          <div key={plot.id} className={`flex justify-between ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <span className="font-semibold">Plot {plot.id}</span>
                            <span className="opacity-70">{plot.area}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPlotResult(null)}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    isDark ? 'text-gray-600 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Formula card ── */}
      <AnimatePresence>
        {showFormulas && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border mb-5 overflow-hidden ${
              isDark ? 'bg-amber-950/20 border-amber-800/40' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500 w-full" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-amber-500" />
                <h4 className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  Formula Reference
                </h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {formulas.map(({ label, formula }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                      isDark ? 'bg-gray-800/60 text-gray-300' : 'bg-white text-gray-700 border border-amber-100'
                    }`}
                  >
                    <span className="font-bold">{label}</span>
                    <span className="opacity-60 ml-2 text-right">{formula}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main grid: Area + Financial ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-5"
      >
        {/* Area card */}
        <SectionCard
          title="Area Measurements"
          icon={<Layers size={15} />}
          accent="blue"
          isDark={isDark}
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <InputField
              label="Sq. Yard (Super Built-Up)"
              field="sqYard"
              value={data.sqYard}
              onChange={handleInputChange('sqYard')}
              onKeyDown={handleKeyDown}
              highlighted={plotResult !== null}
              helperText="💡 Enter plot numbers like 1,3,5 then press Enter ⏎ or click ▶"
              isProcessing={isCalculatingPlots}
              allowSpecialChars={true}
              showButton={looksLikePlotNumbers(data.sqYard)}
              onButtonClick={handlePlotCalculation}
              buttonDisabled={!looksLikePlotNumbers(data.sqYard)}
            />
            <InputField
              label="Sq. Ft"
              field="sqFt"
              value={data.sqFt}
              onChange={handleInputChange('sqFt')}
              suffix="ft²"
            />
            <InputField
              label="Carpet Area (Sq. Yard)"
              field="carpetArea"
              value={data.carpetArea}
              onChange={handleInputChange('carpetArea')}
              suffix="yd²"
              highlighted={true}
            />
            <InputField
              label="Carpet Area (Sq. Ft)"
              field="carpetAreaSqFt"
              value={data.carpetAreaSqFt}
              onChange={handleInputChange('carpetAreaSqFt')}
              suffix="ft²"
              highlighted={true}
            />
          </motion.div>
        </SectionCard>

        {/* Financial card */}
        <SectionCard
          title="Financial Details"
          icon={<TrendingUp size={15} />}
          accent="green"
          isDark={isDark}
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <InputField
              label="Rate per Sq. Yard"
              field="rate"
              value={data.rate}
              onChange={handleInputChange('rate')}
              suffix="₹"
            />
            <InputField
              label="Property Value"
              field="value"
              value={data.value}
              onChange={handleInputChange('value')}
              suffix="₹"
              lockable={true}
              isLocked={locks.value}
              onToggleLock={() => toggleLock('value')}
            />
            <InputField
              label="Monthly Rent"
              field="monthlyRent"
              value={data.monthlyRent}
              onChange={handleInputChange('monthlyRent')}
              suffix="₹"
              lockable={true}
              isLocked={locks.monthlyRent}
              onToggleLock={() => toggleLock('monthlyRent')}
            />
            <InputField
              label="Yearly Rent"
              field="yearlyRent"
              value={data.yearlyRent}
              onChange={handleInputChange('yearlyRent')}
              suffix="₹"
              lockable={true}
              isLocked={locks.yearlyRent}
              onToggleLock={() => toggleLock('yearlyRent')}
            />
            <InputField
              label="ROI (%)"
              field="roi"
              value={data.roi}
              onChange={handleInputChange('roi')}
              suffix="%"
              lockable={true}
              isLocked={locks.roi}
              onToggleLock={() => toggleLock('roi')}
            />
          </motion.div>
        </SectionCard>
      </motion.div>

      {/* ── Footer bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`rounded-2xl border mt-5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        }`}
      >
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-brand-red/20"
        >
          <X size={14} /> Clear All
        </button>

        <div className="flex items-center gap-4">
          {/* Lock count */}
          {Object.values(locks).filter(Boolean).length > 0 && (
            <span className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              <Lock size={12} />
              {Object.values(locks).filter(Boolean).length} field{Object.values(locks).filter(Boolean).length > 1 ? 's' : ''} locked
            </span>
          )}

          {/* Auto-save indicator */}
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Auto-saved
          </span>
        </div>
      </motion.div>
    </div>
  );
}
