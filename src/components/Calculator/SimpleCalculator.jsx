// src/components/Calculator/SimpleCalculator.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Delete, RotateCcw, Hash } from 'lucide-react';

/* ─── Motion variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function SimpleCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ── All original state (unchanged) ── */
  const [display, setDisplay]       = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState(null);

  /* ── All original handlers (unchanged) ── */
  const handleNumber = (num) => {
    if (display === '0' || lastResult !== null) {
      setDisplay(num); setExpression(num); setLastResult(null);
    } else {
      setDisplay(display + num); setExpression(expression + num);
    }
  };

  const handleOperator = (op) => {
    setLastResult(null);
    const lastChar = expression.slice(-1);
    if (expression === '' && op !== '-') return;
    if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
      setExpression(expression.slice(0, -1) + op); setDisplay(op);
    } else {
      setExpression(expression + op); setDisplay(op);
    }
  };

  const handleDecimal = () => {
    setLastResult(null);
    const parts = expression.split(/[+\-×÷%()]/);
    const currentNumber = parts[parts.length - 1];
    if (!currentNumber.includes('.')) {
      setDisplay(display + '.'); setExpression(expression + '.');
    }
  };

  const handleBracket = (bracket) => {
    setLastResult(null);
    setExpression(expression + bracket);
    setDisplay(bracket);
  };

  const handleClear = () => {
    setDisplay('0'); setExpression(''); setLastResult(null);
  };

  const handleBackspace = () => {
    if (expression.length === 0) return;
    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
    setDisplay(newExpression.slice(-1) || '0');
    setLastResult(null);
  };

  const evaluateExpression = (expr) => {
    try {
      let calcExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');
      const result = Function('"use strict"; return (' + calcExpr + ')')();
      return result;
    } catch { return 'Error'; }
  };

  const handleEquals = () => {
    if (expression === '') return;
    try {
      const result = evaluateExpression(expression);
      if (result === 'Error' || isNaN(result) || !isFinite(result)) {
        setDisplay('Error'); setLastResult(null);
      } else {
        const formatted = parseFloat(result.toFixed(10)).toString();
        setDisplay(formatted); setLastResult(formatted); setExpression(formatted);
      }
    } catch { setDisplay('Error'); setLastResult(null); }
  };

  /* ══════════════════════════════════════════
     BUTTON COMPONENT — redesigned
     ══════════════════════════════════════════ */
  const Btn = ({ children, onClick, variant = 'num', wide = false }) => {
    const base = `
      relative flex items-center justify-center
      rounded-xl font-bold text-base
      transition-all duration-150
      active:scale-95 select-none
      ${wide ? 'col-span-4 py-3.5' : 'aspect-square'}
    `;

    const variants = {
      num: isDark
        ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200',

      op: isDark
        ? 'bg-brand-red/15 text-brand-red hover:bg-brand-red/25 border border-brand-red/20'
        : 'bg-brand-red/10 text-brand-red hover:bg-brand-red/20 border border-brand-red/15',

      action: isDark
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-200',

      equals:
        'bg-brand-red hover:bg-red-700 text-white border border-brand-red shadow-lg shadow-brand-red/25 hover:scale-[1.01]',
    };

    return (
      <button type="button" onClick={onClick} className={`${base} ${variants[variant]}`}>
        {children}
      </button>
    );
  };

  /* display value is too long → shrink font */
  const displayFontSize = display.length > 12
    ? 'text-lg'
    : display.length > 8
      ? 'text-2xl'
      : 'text-3xl';

  /* ══════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border overflow-hidden shadow-lg ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}
    >

      {/* ── Card header ── */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${
        isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-100 bg-gray-50/80'
      }`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-red/10">
          <Hash size={15} className="text-brand-red" />
        </div>
        <div>
          <h3 className={`text-sm font-extrabold uppercase tracking-widest ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Quick Calculator
          </h3>
          <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Supports BODMAS expressions
          </p>
        </div>
      </div>

      <div className="p-4">

        {/* ── Display ── */}
        <div className={`mb-4 rounded-2xl border overflow-hidden ${
          isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          {/* Expression strip */}
          <div className={`px-4 pt-3 pb-1 min-h-[28px] text-right text-xs font-mono truncate ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {expression || ' '}
          </div>

          {/* Main result */}
          <div className={`px-4 pb-4 text-right font-extrabold tabular-nums leading-none ${displayFontSize} ${
            display === 'Error'
              ? 'text-brand-red'
              : isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {display}
          </div>

          {/* Last result indicator */}
          {lastResult !== null && (
            <div className={`px-4 pb-2 text-right text-[10px] font-semibold ${
              isDark ? 'text-green-500/60' : 'text-green-600/70'
            }`}>
              ✓ Result
            </div>
          )}
        </div>

        {/* ── Button grid ── */}
        <div className="grid grid-cols-4 gap-2">

          {/* Row 1: AC, ⌫, (, ) */}
          <Btn variant="action" onClick={handleClear}>
            <span className="text-brand-red font-extrabold text-sm">AC</span>
          </Btn>
          <Btn variant="action" onClick={handleBackspace}>
            <Delete className="w-4 h-4" />
          </Btn>
          <Btn variant="op" onClick={() => handleBracket('(')}>(</Btn>
          <Btn variant="op" onClick={() => handleBracket(')')}>)</Btn>

          {/* Row 2: 7 8 9 ÷ */}
          <Btn onClick={() => handleNumber('7')}>7</Btn>
          <Btn onClick={() => handleNumber('8')}>8</Btn>
          <Btn onClick={() => handleNumber('9')}>9</Btn>
          <Btn variant="op" onClick={() => handleOperator('÷')}>÷</Btn>

          {/* Row 3: 4 5 6 × */}
          <Btn onClick={() => handleNumber('4')}>4</Btn>
          <Btn onClick={() => handleNumber('5')}>5</Btn>
          <Btn onClick={() => handleNumber('6')}>6</Btn>
          <Btn variant="op" onClick={() => handleOperator('×')}>×</Btn>

          {/* Row 4: 1 2 3 − */}
          <Btn onClick={() => handleNumber('1')}>1</Btn>
          <Btn onClick={() => handleNumber('2')}>2</Btn>
          <Btn onClick={() => handleNumber('3')}>3</Btn>
          <Btn variant="op" onClick={() => handleOperator('-')}>−</Btn>

          {/* Row 5: 0 . % + */}
          <Btn onClick={() => handleNumber('0')}>0</Btn>
          <Btn onClick={handleDecimal}>.</Btn>
          <Btn variant="op" onClick={() => handleOperator('%')}>%</Btn>
          <Btn variant="op" onClick={() => handleOperator('+')}>+</Btn>

          {/* Row 6: = full width */}
          <Btn variant="equals" wide onClick={handleEquals}>
            <span className="flex items-center gap-2">
              <span className="text-lg">=</span>
              <span className="text-sm font-bold">Calculate</span>
            </span>
          </Btn>
        </div>

        {/* ── Example hint ── */}
        <div className={`mt-4 px-3 py-2.5 rounded-xl text-[11px] ${
          isDark ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-50 text-gray-400 border border-gray-100'
        }`}>
          <p className="font-semibold mb-0.5">Example</p>
          <p className="font-mono">(100+50)×2÷3 = 100</p>
        </div>
      </div>
    </motion.div>
  );
}
