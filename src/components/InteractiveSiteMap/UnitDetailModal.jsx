// src/components/InteractiveSiteMap/UnitDetailModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calculator, ArrowUpRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Shared mobile-first bottom-sheet / desktop modal showing complete unit dimensions,
 * full SQ.YD (Vaar) / SQ.MT / SQ.FT / Vigha conversions, and a 1-click button to send measurements into /calculator.
 */
const UnitDetailModal = React.memo(function UnitDetailModal({
  isOpen,
  isDark,
  onClose,
  unitNumber,
  title,
  locationText,
  statusLabel,
  statusColor,
  badges = [],
  primaryTotal,
  conversionRows = [],
  extraMetadata = [],
  calculatorPrefill,
  whatsappMessage,
  portalContainer,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const canCalculate = !!(calculatorPrefill && parseFloat(calculatorPrefill.sqYard) > 0);
  const targetContainer =
    portalContainer ||
    (typeof document !== 'undefined' && document.fullscreenElement) ||
    document.body;

  const handleOpenCalculator = async () => {
    if (!canCalculate) return;
    document.body.style.overflow = '';
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      await document.exitFullscreen?.().catch(() => {});
    }
    onClose();
    navigate('/calculator', { state: { prefillUnit: calculatorPrefill } });
  };

  const border = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const bgModal = isDark ? 'bg-[#121215]' : 'bg-white';
  const bgSub = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{
          zIndex: 100001,
          backdropFilter: 'blur(8px)',
          background: isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.52)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full sm:max-w-[430px] sm:rounded-2xl rounded-t-2xl max-h-[90svh] overflow-y-auto shadow-2xl border ${border} ${bgModal}`}
        >
          {/* Header */}
          <div className={`p-3.5 sm:p-4 border-b ${border} ${bgSub}`}>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white"
                  style={{ background: statusColor }}
                >
                  {statusLabel}
                </span>
                {badges.map((b) => (
                  <span
                    key={b.text}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                      b.cls || 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {b.text}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`p-1 ${textMuted} hover:text-brand-red transition-colors`}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center text-white font-mono font-bold text-base shrink-0"
                style={{ background: statusColor }}
              >
                #{unitNumber}
              </div>
              <div className="min-w-0">
                <h3 className={`text-base font-bold leading-tight truncate ${textMain}`}>{title}</h3>
                <p className={`font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 mt-0.5 truncate ${textMuted}`}>
                  <MapPin size={10} className="text-brand-red shrink-0" aria-hidden="true" />
                  <span className="truncate">{locationText}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Full Area Details & Conversions Body */}
          <div className="p-3.5 sm:p-4 space-y-3">
            {/* Hero 3-Unit Conversion Strip */}
            <div className={`border ${border} ${bgSub}`}>
              <div className={`px-3 py-1.5 border-b ${border} flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider ${textMuted}`}>
                <span>{primaryTotal?.heading || 'Total Area & Conversions'}</span>
                {primaryTotal?.vigha && (
                  <span className="text-brand-red font-bold tabular-nums">{primaryTotal.vigha} Vigha</span>
                )}
              </div>
              <div className={`grid grid-cols-3 divide-x ${isDark ? 'divide-white/[0.12]' : 'divide-gray-200'}`}>
                {[
                  { val: primaryTotal?.sqYd || '—', unit: 'SQ.YD (Vaar)', highlight: true },
                  { val: primaryTotal?.sqMt || '—', unit: 'SQ.MT' },
                  { val: primaryTotal?.sqFt || '—', unit: 'SQ.FT' },
                ].map((col) => (
                  <div key={col.unit} className="p-2.5 text-center min-w-0">
                    <span
                      className={`block font-mono text-sm sm:text-base font-bold tabular-nums truncate ${
                        col.highlight ? 'text-brand-red' : textMain
                      }`}
                    >
                      {col.val}
                    </span>
                    <span className={`block font-mono text-[9px] uppercase tracking-wider mt-0.5 ${textMuted}`}>
                      {col.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown & Unit Conversions Table */}
            {conversionRows.length > 0 && (
              <div className={`border ${border} overflow-x-auto`}>
                <table className="w-full text-left border-collapse font-mono text-[11px] tabular-nums">
                  <thead className={`text-[9px] uppercase tracking-wider border-b ${border} ${bgSub} ${textMuted}`}>
                    <tr>
                      <th scope="col" className="py-1.5 px-2.5">Component</th>
                      <th scope="col" className="py-1.5 px-2 text-right">SQ.YD</th>
                      <th scope="col" className="py-1.5 px-2 text-right">SQ.MT</th>
                      <th scope="col" className="py-1.5 px-2.5 text-right">SQ.FT</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/[0.08]' : 'divide-gray-200'}`}>
                    {conversionRows.map((row) => (
                      <tr key={row.label}>
                        <td className={`py-2 px-2.5 font-semibold whitespace-nowrap ${row.accent || textMain}`}>
                          {row.label}
                        </td>
                        <td className={`py-2 px-2 text-right whitespace-nowrap ${textMain}`}>{row.sqYd}</td>
                        <td className={`py-2 px-2 text-right whitespace-nowrap ${textMuted}`}>{row.sqMt}</td>
                        <td className={`py-2 px-2.5 text-right whitespace-nowrap ${textMuted}`}>{row.sqFt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Unit-Specific Metadata (Dimensions / Live Rent / Owner / Lessee / Loading %) */}
            {extraMetadata.length > 0 && (
              <div className={`grid grid-cols-2 gap-1.5 font-mono text-[10.5px]`}>
                {extraMetadata.map((item) => (
                  <div key={item.label} className={`p-2 border ${border} ${bgSub} min-w-0`}>
                    <span className={`text-[9px] uppercase tracking-wider block ${textMuted}`}>{item.label}</span>
                    <span className={`font-bold truncate block mt-0.5 tabular-nums ${item.accent || textMain}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions: Direct Calculator Handoff + WhatsApp + Close */}
            <div className="space-y-2 pt-0.5 pb-[env(safe-area-inset-bottom)]">
              <button
                type="button"
                onClick={handleOpenCalculator}
                disabled={!canCalculate}
                className={`w-full py-2.5 px-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  canCalculate
                    ? 'bg-brand-red hover:bg-red-700 text-white'
                    : `${bgSub} ${textMuted} border ${border} cursor-not-allowed opacity-60`
                }`}
              >
                <Calculator size={14} aria-hidden="true" />
                <span>{canCalculate ? 'Open in Calculator · Enter Rate' : 'Area Not Measured'}</span>
                {canCalculate && <ArrowUpRight size={13} aria-hidden="true" />}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <FaWhatsapp size={13} aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className={`py-2 px-4 border ${border} ${bgSub} font-mono text-[11px] font-bold uppercase ${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    targetContainer
  );
});

export default UnitDetailModal;
