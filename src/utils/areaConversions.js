// src/utils/areaConversions.js

export const SQ_FT_PER_SQ_YD = 9;
export const SQ_MT_PER_SQ_YD = 0.83612736;
export const SQ_YD_PER_SQ_MT = 1.19599005;
export const SQ_FT_PER_SQ_MT = 10.7639104;
export const SQ_YD_PER_GUNTA = 121;
export const DEFAULT_SHED_LOADING = 0.25;

export const sqYdToSqFt = (yd) => yd * SQ_FT_PER_SQ_YD;
export const sqYdToSqMt = (yd) => yd * SQ_MT_PER_SQ_YD;
export const sqMtToSqYd = (mt) => mt * SQ_YD_PER_SQ_MT;
export const sqMtToSqFt = (mt) => mt * SQ_FT_PER_SQ_MT;
export const sqYdToGunta = (yd) => yd / SQ_YD_PER_GUNTA;

export const fmtNum = (n, decimals = 2) => {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '—';
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Parse strings like "903.75 YD", "2876 YD", "8,133.75 SQ.FT", "755.65 SQ.MT" into Sq.Yd.
 * Rejects linear dimensions such as "112.92 FT" unless explicitly SQ.FT/FT2.
 */
export const parseAreaStringToSqYd = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.trim();
  if (/^(N\/A|LARGE)$/i.test(cleaned)) return null;
  const numMatch = cleaned.replace(/,/g, '').match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!numMatch) return null;
  const value = parseFloat(numMatch[1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  if (/\b(SQ\.?\s*MT|M2|SQM)\b/i.test(cleaned)) return sqMtToSqYd(value);
  if (/\b(SQ\.?\s*FT|FT2|SQFT)\b/i.test(cleaned)) return value / SQ_FT_PER_SQ_YD;
  if (/\bFT\b/i.test(cleaned) && !/SQ/i.test(cleaned)) return null; // linear dimension fallback, not area
  return value; // default SQ.YD / YD / GAJ / VAAR
};

/**
 * Build navigation state payload accepted cleanly by CalculatorPage -> CalculatorComponent.
 */
export const buildCalculatorPrefill = ({
  parkCode,
  parkName,
  unitTitle,
  superSqYd,
  carpetSqYd,
  monthlyRent = '',
  loadingNote = '',
}) => {
  const cleanSuperYd = Number.isFinite(superSqYd) && superSqYd > 0 ? superSqYd : 0;
  const cleanCarpetYd =
    Number.isFinite(carpetSqYd) && carpetSqYd > 0
      ? carpetSqYd
      : cleanSuperYd * (1 - DEFAULT_SHED_LOADING);

  const rentNum = parseFloat(String(monthlyRent || '').replace(/[^0-9.]/g, '')) || 0;

  return {
    parkCode,
    parkName,
    unitTitle,
    loadingNote,
    sqYard: cleanSuperYd > 0 ? cleanSuperYd.toFixed(2) : '',
    sqFt: cleanSuperYd > 0 ? sqYdToSqFt(cleanSuperYd).toFixed(2) : '',
    sqMt: cleanSuperYd > 0 ? sqYdToSqMt(cleanSuperYd).toFixed(2) : '',
    carpetArea: cleanCarpetYd > 0 ? cleanCarpetYd.toFixed(2) : '',
    carpetAreaSqFt: cleanCarpetYd > 0 ? sqYdToSqFt(cleanCarpetYd).toFixed(2) : '',
    carpetAreaSqMt: cleanCarpetYd > 0 ? sqYdToSqMt(cleanCarpetYd).toFixed(2) : '',
    monthlyRent: rentNum > 0 ? rentNum.toFixed(2) : '',
    yearlyRent: rentNum > 0 ? (rentNum * 12).toFixed(2) : '',
  };
};
