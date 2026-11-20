// src/components/Calculator/SimpleCalculator.jsx
import { useState } from 'react';
import { Delete, Hash } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SimpleCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [display, setDisplay]       = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const bgKeyAlt  = isDark ? 'bg-[#17171B]' : 'bg-[#EFECE6]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  /* ── Handlers ── */
  const handleNumber = (num) => {
    if (display === '0' || lastResult !== null) {
      setDisplay(num);
      setExpression(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op) => {
    setLastResult(null);
    const lastChar = expression.slice(-1);
    if (expression === '' && op !== '-') return;
    if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
      setExpression(expression.slice(0, -1) + op);
      setDisplay(op);
    } else {
      setExpression(expression + op);
      setDisplay(op);
    }
  };

  const handleDecimal = () => {
    setLastResult(null);
    const parts = expression.split(/[+\-×÷%()]/);
    const currentNumber = parts[parts.length - 1];
    if (!currentNumber.includes('.')) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const handleBracket = (bracket) => {
    setLastResult(null);
    setExpression(expression + bracket);
    setDisplay(bracket);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
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
      const calcExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');
      return Function('"use strict"; return (' + calcExpr + ')')();
    } catch {
      return 'Error';
    }
  };

  const handleEquals = () => {
    if (expression === '') return;
    try {
      const result = evaluateExpression(expression);
      if (result === 'Error' || isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setLastResult(null);
      } else {
        const formatted = parseFloat(result.toFixed(10)).toString();
        setDisplay(formatted);
        setLastResult(formatted);
        setExpression(formatted);
      }
    } catch {
      setDisplay('Error');
      setLastResult(null);
    }
  };

  /* ── Border-Collapsed Keypad Button ── */
  const KeyBtn = ({ children, onClick, variant = 'num', wide = false, ariaLabel }) => {
    const styles = {
      num:    `${bgSurface} ${textMain} ${isDark ? 'hover:bg-[#1A1A20]' : 'hover:bg-[#FAF9F6]'}`,
      op:     `${bgKeyAlt} text-brand-red ${isDark ? 'hover:bg-[#221A1B]' : 'hover:bg-[#F7EAE8]'}`,
      action: `${bgPage} ${textMain} ${isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#E7E4DC]'}`,
      equals: 'bg-brand-red hover:bg-red-700 text-white',
    };

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex items-center justify-center border-r border-b ${border} font-mono font-bold text-base select-none transition-colors active:opacity-75 ${
          wide ? 'col-span-4 py-4' : 'h-14'
        } ${styles[variant]}`}
      >
        {children}
      </button>
    );
  };

  const displayFontSize =
    display.length > 12 ? 'text-xl' : display.length > 8 ? 'text-2xl' : 'text-4xl';

  return (
    <div className={`border ${border} ${bgSurface}`}>
      {/* ── Header Strip ── */}
      <div className={`flex items-center justify-between px-5 py-3.5 border-b ${border} ${bgPage}`}>
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red block">
            TOOL 02
          </span>
          <h3 className={`text-sm font-extrabold tracking-tight ${textMain}`}>
            Quick Calculator
          </h3>
        </div>
        <Hash size={15} className={textMuted} aria-hidden="true" />
      </div>

      {/* ── Recessed Readout Screen ── */}
      <div className={`px-5 py-5 border-b ${border} ${bgPage}`}>
        <div className={`min-h-[20px] text-right font-mono text-xs truncate mb-2 ${textMuted}`}>
          {expression || '0'}
        </div>

        <div
          className={`text-right font-mono font-bold tabular-nums leading-none tracking-tight ${displayFontSize} ${
            display === 'Error' ? 'text-brand-red' : textMain
          }`}
        >
          {display}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className={textMuted}>BODMAS Enabled</span>
          <span className={lastResult !== null ? 'text-emerald-500 font-semibold' : 'opacity-0'}>
            Result
          </span>
        </div>
      </div>

      {/* ── Border-Collapsed Keypad Grid ── */}
      <div className={`grid grid-cols-4 border-l ${border}`}>
        {/* Row 1 */}
        <KeyBtn variant="action" onClick={handleClear} ariaLabel="Clear all">
          <span className="text-brand-red text-xs tracking-wider">AC</span>
        </KeyBtn>
        <KeyBtn variant="action" onClick={handleBackspace} ariaLabel="Backspace">
          <Delete className="w-4 h-4" aria-hidden="true" />
        </KeyBtn>
        <KeyBtn variant="op" onClick={() => handleBracket('(')} ariaLabel="Open parenthesis">(</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleBracket(')')} ariaLabel="Close parenthesis">)</KeyBtn>

        {/* Row 2 */}
        <KeyBtn onClick={() => handleNumber('7')}>7</KeyBtn>
        <KeyBtn onClick={() => handleNumber('8')}>8</KeyBtn>
        <KeyBtn onClick={() => handleNumber('9')}>9</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleOperator('÷')} ariaLabel="Divide">÷</KeyBtn>

        {/* Row 3 */}
        <KeyBtn onClick={() => handleNumber('4')}>4</KeyBtn>
        <KeyBtn onClick={() => handleNumber('5')}>5</KeyBtn>
        <KeyBtn onClick={() => handleNumber('6')}>6</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleOperator('×')} ariaLabel="Multiply">×</KeyBtn>

        {/* Row 4 */}
        <KeyBtn onClick={() => handleNumber('1')}>1</KeyBtn>
        <KeyBtn onClick={() => handleNumber('2')}>2</KeyBtn>
        <KeyBtn onClick={() => handleNumber('3')}>3</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleOperator('-')} ariaLabel="Subtract">−</KeyBtn>

        {/* Row 5 */}
        <KeyBtn onClick={() => handleNumber('0')}>0</KeyBtn>
        <KeyBtn onClick={handleDecimal} ariaLabel="Decimal point">.</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleOperator('%')} ariaLabel="Percent">%</KeyBtn>
        <KeyBtn variant="op" onClick={() => handleOperator('+')} ariaLabel="Add">+</KeyBtn>

        {/* Row 6 */}
        <KeyBtn variant="equals" wide onClick={handleEquals} ariaLabel="Calculate result">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
            <span className="text-base">=</span>
            <span>Calculate</span>
          </span>
        </KeyBtn>
      </div>

      {/* ── Example Footer ── */}
      <div className={`px-5 py-3 flex items-center justify-between font-mono text-[10px] ${bgPage} ${textMuted}`}>
        <span className="uppercase tracking-wider">Example</span>
        <span>(100+50)×2÷3 = 100</span>
      </div>
    </div>
  );
}