// src/components/Calculator/CalculatorComponent.jsx
import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Calculator as CalcIcon,
  Layers, RotateCcw, RotateCw, BookOpen,
  X, ChevronDown, Check, TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { calculateMultiplePlotArea } from '../../services/dataService';

const EASE = [0.16, 1, 0.3, 1];

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  bgSubtle:  isDark ? 'bg-[#18181C]' : 'bg-[#F1F3F5]',
  border:    isDark ? 'border-white/[0.12]' : 'border-gray-200',
  divide:    isDark ? 'divide-white/[0.12]' : 'divide-gray-200',
  textMain:  isDark ? 'text-white' : 'text-gray-900',
  textBody:  isDark ? 'text-gray-200' : 'text-gray-700',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
});

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
  const t = getTokens(isDark);

  const inputStateCls = isLocked
    ? isDark
      ? 'border-amber-500/70 bg-amber-500/[0.06] focus:border-amber-400'
      : 'border-amber-500/70 bg-amber-50/70 focus:border-amber-600'
    : highlighted
      ? isDark
        ? 'border-brand-red/50 bg-[#171213] focus:border-brand-red'
        : 'border-brand-red/45 bg-[#FBF6F5] focus:border-brand-red'
      : `${t.border} ${t.bgPage} focus:border-brand-red`;

  return (
    <div className="mb-4 last:mb-0">
      {/* Label & Lock Row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          htmlFor={field}
          className={`font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${t.textMuted}`}
        >
          {label}
        </label>

        {lockable && (
          <button
            type="button"
            onClick={onToggleLock}
            title={isLocked ? 'Unlock field' : 'Lock field'}
            className={`inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isLocked
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-500'
                : `${t.border} ${t.bgPage} ${t.textMuted} hover:border-brand-red hover:text-brand-red`
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-2.5 h-2.5" aria-hidden="true" />
                <span>Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-2.5 h-2.5" aria-hidden="true" />
                <span>Auto</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Input & Inline Plot Action */}
      <div className="flex items-stretch gap-2">
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
            className={`w-full px-3.5 py-2.5 border font-mono text-sm font-semibold tabular-nums transition-colors focus:outline-none ${inputStateCls} ${t.textMain} ${
              isDark ? 'placeholder:text-[#45454D]' : 'placeholder:text-[#B5B3AC]'
            } ${isProcessing || (suffix && !showButton) ? 'pr-12' : ''}`}
          />

          {/* Spinner */}
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
              <span className="block w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Unit Suffix */}
          {suffix && !showButton && !isProcessing && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-semibold select-none ${t.textMuted}`}
            >
              {suffix}
            </span>
          )}
        </div>

        {/* Multi-Plot Trigger Button */}
        {showButton && onButtonClick && (
          <button
            type="button"
            onClick={onButtonClick}
            disabled={buttonDisabled || isProcessing}
            title="Calculate total area (or press Enter)"
            aria-label="Calculate multiple plot area"
            className={`px-3.5 border font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors ${
              buttonDisabled || isProcessing
                ? `${t.border} ${t.bgPage} ${t.textMuted} cursor-not-allowed`
                : 'bg-brand-red border-brand-red hover:bg-red-700 text-white'
            }`}
          >
            <CalcIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Helper */}
      {helperText && (
        <p className={`font-mono text-[10px] mt-1.5 leading-relaxed ${t.textMuted}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
InputField.displayName = 'InputField';

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export default function CalculatorComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  /* ── State ── */
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

  /* ── Persistence ── */
  useEffect(() => {
    const savedData  = localStorage.getItem('calculatorData');
    const savedLocks = localStorage.getItem('calculatorLocks');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch {
        console.error('Failed to load data');
      }
    }
    if (savedLocks) {
      try {
        setLocks(JSON.parse(savedLocks));
      } catch {
        console.error('Failed to load locks');
      }
    }
  }, []);

  useEffect(() => {
    if (Object.values(data).some((v) => v !== '')) {
      localStorage.setItem('calculatorData', JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('calculatorLocks', JSON.stringify(locks));
  }, [locks]);

  /* ── Callbacks ── */
  const toggleLock = useCallback((field) => {
    setLocks((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const saveToHistory = useCallback((newData) => {
    setHistory((prev) => {
      const h = prev.slice(0, historyIndex + 1);
      h.push(newData);
      return h;
    });
    setHistoryIndex((prev) => prev + 1);
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
    if (s.length >= 2 && s.every((n) => /^\d+$/.test(n))) return true;
    return false;
  };

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
        if (rate > 0 && parseFloat(newData.sqYard) > 0 && !locks.value) {
          newData.value = (parseFloat(newData.sqYard) * rate).toFixed(2);
        }
        if (!locks.value && parseFloat(newData.value) > 0) {
          if (yearlyRent > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / parseFloat(newData.value)) * 100).toFixed(2);
          } else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
            newData.yearlyRent = ((roi * parseFloat(newData.value)) / 100).toFixed(2);
            newData.monthlyRent = (parseFloat(newData.yearlyRent) / 12).toFixed(2);
          }
        }
        break;
      case 'value':
        if (propValue > 0 && parseFloat(newData.sqYard) > 0) {
          newData.rate = (propValue / parseFloat(newData.sqYard)).toFixed(2);
        }
        if (propValue > 0) {
          if (yearlyRent > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.yearlyRent && !locks.monthlyRent) {
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
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;
      case 'yearlyRent':
        if (yearlyRent > 0 && !locks.monthlyRent) {
          newData.monthlyRent = (yearlyRent / 12).toFixed(2);
        }
        if (yearlyRent > 0) {
          if (propValue > 0 && !locks.roi) {
            newData.roi = ((yearlyRent / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.value) {
            newData.value = ((yearlyRent / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;
      case 'monthlyRent':
        if (monthlyRent > 0 && !locks.yearlyRent) {
          newData.yearlyRent = (monthlyRent * 12).toFixed(2);
        }
        if (monthlyRent > 0) {
          const yr = parseFloat(newData.yearlyRent) || 0;
          if (propValue > 0 && !locks.roi) {
            newData.roi = ((yr / propValue) * 100).toFixed(2);
          } else if (roi > 0 && !locks.value) {
            newData.value = ((yr / roi) * 100).toFixed(2);
            if (parseFloat(newData.sqYard) > 0) {
              newData.rate = (parseFloat(newData.value) / parseFloat(newData.sqYard)).toFixed(2);
            }
          }
        }
        break;
    }
    return newData;
  }, [LOADING_FACTOR, locks]);

  const handlePlotCalculation = useCallback(async () => {
    const value = data.sqYard;
    if (!value || !looksLikePlotNumbers(value)) return;
    setIsCalculatingPlots(true);
    try {
      const result = await calculateMultiplePlotArea(value);
      if (result.plotCount > 0) {
        setPlotResult(result);
        setData((cur) => {
          const updated = { ...cur, sqYard: result.totalSqYd.toString() };
          return calculateDependentFields('sqYard', result.totalSqYd.toString(), updated);
        });
        setTimeout(() => {
          setData((cur) => { saveToHistory(cur); return cur; });
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
  }, [data.sqYard, calculateDependentFields, saveToHistory]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    if (field === 'sqYard') {
      if (value !== '' && !/^[\d,\s.]+$/.test(value)) return;
      setData((cur) => ({ ...cur, sqYard: value }));
      if (plotResult) setPlotResult(null);
      if (!looksLikePlotNumbers(value)) {
        const num = parseFloat(value);
        if (!isNaN(num) && value !== '') {
          setData((cur) => {
            const updated = { ...cur, sqYard: value };
            return calculateDependentFields('sqYard', value, updated);
          });
        }
      }
      return;
    }
    if (value !== '' && !/^-?\d*\.?\d*$/.test(value)) return;
    setData((cur) => {
      const updated = { ...cur, [field]: value };
      return calculateDependentFields(field, value, updated);
    });
    setTimeout(() => {
      setData((cur) => { saveToHistory(cur); return cur; });
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

  const formulas = [
    { label: 'Sq. Ft',         formula: 'Sq. Yard × 9'                },
    { label: 'Carpet Area',    formula: 'Sq. Yard × 0.75'             },
    { label: 'Property Value', formula: 'Sq. Yard × Rate'             },
    { label: 'Yearly Rent',    formula: 'Monthly Rent × 12'           },
    { label: 'ROI (%)',        formula: '(Yearly Rent ÷ Value) × 100' },
    { label: 'Value from ROI', formula: '(Yearly Rent ÷ ROI) × 100'   },
  ];

  const filledCount = Object.values(data).filter((v) => v !== '').length;
  const filledPct   = Math.round((filledCount / 9) * 100);
  const lockedCount = Object.values(locks).filter(Boolean).length;

  return (
    <div className={`border ${t.border} ${t.bgSurface}`}>
      {/* ── Top Control Header ── */}
      <div className={`p-5 sm:p-6 border-b ${t.border} ${t.bgPage}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span className="text-brand-red font-bold">CALC 01</span>
              <span className={t.textMuted}>/</span>
              <span className={t.textMuted}>ROI &amp; Valuation Engine</span>
            </div>
            <h2 className={`text-xl font-bold tracking-tight ${t.textMain}`}>
              Property{' '}
              <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                Calculator
              </span>
            </h2>
            <p className={`text-xs mt-1 ${t.textBody}`}>
              Lock any financial field to hold it constant · Enter plot numbers like{' '}
              <span className={`font-mono font-bold ${t.textMain}`}>1,3,5</span> and press Enter.
            </p>
          </div>

          {/* Sharp Segmented Toolbar */}
          <div className={`inline-flex border ${t.border} divide-x ${t.divide} self-start sm:self-auto`}>
            <button
              type="button"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Undo"
              className={`px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ${t.bgSurface} ${t.textMain} hover:text-brand-red disabled:opacity-35 disabled:cursor-not-allowed`}
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
              className={`px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ${t.bgSurface} ${t.textMain} hover:text-brand-red disabled:opacity-35 disabled:cursor-not-allowed`}
            >
              <RotateCw size={12} aria-hidden="true" />
              <span>Redo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFormulas((v) => !v)}
              aria-expanded={showFormulas}
              className={`px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ${
                showFormulas
                  ? 'bg-brand-red text-white'
                  : `${t.bgSurface} ${t.textMain} hover:text-brand-red`
              }`}
            >
              <BookOpen size={12} aria-hidden="true" />
              <span>{showFormulas ? 'Hide' : 'Formulas'}</span>
            </button>
          </div>
        </div>

        {/* Minimalist Completion Meter */}
        <div className="mt-5">
          <div className={`flex justify-between items-center mb-1.5 font-mono text-[10px] uppercase tracking-wider ${t.textMuted}`}>
            <span>{filledCount} / 9 Fields Populated</span>
            <span className="tabular-nums">{filledPct}%</span>
          </div>
          <div className={`h-[2px] w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
            <motion.div
              className="h-full bg-brand-red"
              initial={{ width: 0 }}
              animate={{ width: `${filledPct}%` }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          </div>
        </div>
      </div>

      {/* ── Multi-Plot Result Drawer ── */}
      <AnimatePresence initial={false}>
        {plotResult && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`overflow-hidden border-b ${t.border} ${t.bgSubtle}`}
          >
            <div className="relative p-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4 pl-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-500 font-bold mb-2">
                    <Check size={13} aria-hidden="true" />
                    <span>
                      {plotResult.plotCount} Plot{plotResult.plotCount > 1 ? 's' : ''} Summed
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 mb-3">
                    <div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider block ${t.textMuted}`}>
                        Combined Sq. Yard
                      </span>
                      <span className={`font-mono text-lg font-bold tabular-nums ${t.textMain}`}>
                        {plotResult.totalSqYd} <span className={`text-xs font-normal ${t.textMuted}`}>sq.yd</span>
                      </span>
                    </div>
                    <div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider block ${t.textMuted}`}>
                        Combined Sq. Ft
                      </span>
                      <span className={`font-mono text-lg font-bold tabular-nums ${t.textMain}`}>
                        {plotResult.totalSqFt} <span className={`text-xs font-normal ${t.textMuted}`}>sq.ft</span>
                      </span>
                    </div>
                  </div>

                  <details className="group">
                    <summary className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none ${t.textMain} hover:text-brand-red`}>
                      <ChevronDown size={12} className="group-open:rotate-180 transition-transform" aria-hidden="true" />
                      <span>Plot Breakdown</span>
                    </summary>
                    <div className={`mt-2.5 grid grid-cols-2 sm:grid-cols-3 border-t border-l ${t.border} ${t.bgSurface}`}>
                      {plotResult.validPlots.map((plot) => (
                        <div
                          key={plot.id}
                          className={`flex justify-between gap-2 px-3 py-2 border-r border-b ${t.border} font-mono text-xs tabular-nums`}
                        >
                          <span className="font-bold text-brand-red">Plot {plot.id}</span>
                          <span className={t.textBody}>{plot.area}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>

                <button
                  type="button"
                  onClick={() => setPlotResult(null)}
                  aria-label="Dismiss plot result"
                  className={`w-7 h-7 border ${t.border} ${t.bgSurface} ${t.textMuted} hover:text-brand-red hover:border-brand-red flex items-center justify-center shrink-0 transition-colors`}
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Formula Reference Drawer ── */}
      <AnimatePresence initial={false}>
        {showFormulas && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`overflow-hidden border-b ${t.border} ${t.bgSubtle}`}
          >
            <div className="relative p-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
              <div className="pl-2">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red mb-3">
                  Formula Reference (25% Standard Loading Factor)
                </div>
                <div className={`grid sm:grid-cols-2 border-t border-l ${t.border} ${t.bgSurface}`}>
                  {formulas.map(({ label, formula }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 border-r border-b ${t.border} text-xs`}
                    >
                      <span className={`font-bold ${t.textMain}`}>{label}</span>
                      <span className={`font-mono text-[11px] text-right ${t.textBody}`}>{formula}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main 2-Column Border-Collapsed Inputs Ledger ── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${t.divide}`}>
        {/* Left: Area Measurements */}
        <div>
          <div className={`flex items-center justify-between px-5 sm:px-6 py-3.5 border-b ${t.border} ${t.bgPage}`}>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
              01 / Area Measurements
            </span>
            <Layers size={14} className={t.textMuted} aria-hidden="true" />
          </div>

          <div className="p-5 sm:p-6">
            <InputField
              label="Sq. Yard (Super Built-Up)"
              field="sqYard"
              value={data.sqYard}
              onChange={handleInputChange('sqYard')}
              onKeyDown={handleKeyDown}
              highlighted={plotResult !== null}
              helperText="Enter comma-separated plot numbers (e.g. 1,3,5) and press Enter"
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
          </div>
        </div>

        {/* Right: Financial Details */}
        <div>
          <div className={`flex items-center justify-between px-5 sm:px-6 py-3.5 border-b ${t.border} ${t.bgPage}`}>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
              02 / Financial Details
            </span>
            <TrendingUp size={14} className={t.textMuted} aria-hidden="true" />
          </div>

          <div className="p-5 sm:p-6">
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
          </div>
        </div>
      </div>

      {/* ── Footer Utility Bar ── */}
      <div className={`px-5 sm:px-6 py-4 border-t ${t.border} ${t.bgPage} flex flex-wrap items-center justify-between gap-4`}>
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors"
        >
          <X size={13} aria-hidden="true" />
          <span>Clear All</span>
        </button>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-wider">
          {lockedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-500">
              <Lock size={11} aria-hidden="true" />
              <span>{lockedCount} Locked</span>
            </span>
          )}

          <span className={`inline-flex items-center gap-2 ${t.textMuted}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Auto-Saved Locally</span>
          </span>
        </div>
      </div>
    </div>
  );
}