// src/utils/park1UnitData.js
import { plotCoordinates } from '../data/plotcoordinates';
import { getShedPhase } from '../data/phaseCoordinates';
import {
  parseAreaStringToSqYd,
  sqYdToSqFt,
  sqYdToSqMt,
  sqYdToVigha,
  DEFAULT_SHED_LOADING,
  fmtNum,
  buildCalculatorPrefill,
} from './areaConversions';

export const PARK1_ADMIN_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

export const PARK1_PLOT_ENTRIES = Object.entries(plotCoordinates);
export const PARK1_PLOT_IDS = PARK1_PLOT_ENTRIES.map(([id]) => id);

export const normalizePark1Status = (status) => {
  const s = String(status || 'available').toLowerCase().trim();
  if (s === 'sold' || s === 'for-lease' || s === 'pre-leased' || s === 'available') {
    return s;
  }
  return 'available';
};

export const getPark1StatusColor = (status, isDark = false) => {
  switch (normalizePark1Status(status)) {
    case 'sold':       return '#808080';
    case 'for-lease':  return isDark ? '#EF4444' : '#DC2626';
    case 'pre-leased': return isDark ? '#60A5FA' : '#3B82F6';
    default:           return isDark ? '#34D399' : '#10B981';
  }
};

export const getPark1StatusHex = (status) => {
  switch (normalizePark1Status(status)) {
    case 'sold':       return '#808080';
    case 'for-lease':  return '#DC2626';
    case 'pre-leased': return '#3B82F6';
    default:           return '#10B981';
  }
};

export const getPark1StatusLabel = (status) => {
  switch (normalizePark1Status(status)) {
    case 'sold':       return 'Sold';
    case 'for-lease':  return 'For Lease';
    case 'pre-leased': return 'Pre-Leased';
    default:           return 'Available';
  }
};

export const computePark1Stats = (plotData = {}) => {
  const total = PARK1_PLOT_ENTRIES.length;
  let available = 0;
  let preLeased = 0;
  let forLease = 0;
  let sold = 0;

  for (let i = 0; i < total; i++) {
    const id = PARK1_PLOT_ENTRIES[i][0];
    const st = normalizePark1Status(plotData[id]?.status);
    if (st === 'available') available++;
    else if (st === 'pre-leased') preLeased++;
    else if (st === 'for-lease') forLease++;
    else if (st === 'sold') sold++;
  }

  return { total, available, preLeased, forLease, sold };
};

/**
 * Shared ordered availability ledger items for both 2D and 3D Park 1 site-maps:
 * All Units -> Available -> Pre-Leased -> For Lease -> Sold.
 */
export const getPark1StatItems = (stats, isDark) => [
  { key: 'ALL', filterKey: 'ALL', value: stats.total, label: 'All Units', numClass: isDark ? 'text-white' : 'text-gray-900', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#E11D48' },
  { key: 'available', filterKey: 'available', value: stats.available, label: 'Available', numClass: 'text-emerald-500', lblClass: 'text-emerald-500', accentHex: '#10B981' },
  { key: 'pre-leased', filterKey: 'pre-leased', value: stats.preLeased, label: 'Pre-Leased', numClass: 'text-blue-500', lblClass: 'text-blue-500', accentHex: '#3B82F6' },
  { key: 'for-lease', filterKey: 'for-lease', value: stats.forLease, label: 'For Lease', numClass: 'text-red-500', lblClass: 'text-red-500', accentHex: '#EF4444' },
  { key: 'sold', filterKey: 'sold', value: stats.sold, label: 'Sold', numClass: isDark ? 'text-gray-400' : 'text-gray-600', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#6B7280' },
];

export const getPark1HoverSummary = ({ shedId, plotData = {}, isDark = false }) => {
  const id = String(shedId);
  const coord = plotCoordinates[id] || {};
  const live = plotData[id] || {};
  const status = normalizePark1Status(live.status);
  const statusColor = getPark1StatusColor(status, isDark);
  const statusLabel = getPark1StatusLabel(status);
  const rawArea = live.area || coord.area || 'N/A';
  const sqYd = parseAreaStringToSqYd(rawArea);
  const phase = getShedPhase(id);

  return {
    id,
    title: `Shed #${id}`,
    status,
    statusColor,
    statusLabel,
    rawArea,
    sqYd,
    sqYdText: sqYd ? fmtNum(sqYd) : null,
    sqFtText: sqYd ? fmtNum(sqYdToSqFt(sqYd)) : null,
    phaseLabel: phase ? `Phase ${phase.label}` : coord.section ? `Section ${coord.section}` : null,
  };
};

/**
 * Builds canonical UnitDetailModal props for any Park 1 shed (#1-#63)
 * so both 2D and 3D maps present the exact same fields and sequence.
 */
export const buildPark1ModalProps = ({ shedId, plotData = {}, isDark = false }) => {
  const id = shedId ? String(shedId) : null;
  if (!id || !plotCoordinates[id]) return { isOpen: false };

  const coord = plotCoordinates[id];
  const live = plotData[id] || {};
  const status = normalizePark1Status(live.status);
  const statusColor = getPark1StatusColor(status, isDark);
  const phase = getShedPhase(id);

  const rawArea = live.area || coord.area;
  const sqYd = parseAreaStringToSqYd(rawArea);
  const sqMt = sqYd ? sqYdToSqMt(sqYd) : null;
  const sqFt = sqYd ? sqYdToSqFt(sqYd) : null;
  const vigha = sqYd ? sqYdToVigha(sqYd) : null;

  const carpetYd = sqYd ? sqYd * (1 - DEFAULT_SHED_LOADING) : null;
  const carpetMt = carpetYd ? sqYdToSqMt(carpetYd) : null;
  const carpetFt = carpetYd ? sqYdToSqFt(carpetYd) : null;

  const conversionRows = sqYd
    ? [
        { label: 'Super Built-Up', sqYd: fmtNum(sqYd), sqMt: fmtNum(sqMt), sqFt: fmtNum(sqFt), accent: 'text-brand-red' },
        { label: 'Carpet (75%)', sqYd: fmtNum(carpetYd), sqMt: fmtNum(carpetMt), sqFt: fmtNum(carpetFt) },
      ]
    : [];

  const extraMetadata = [
    coord.section ? { label: 'Section / Phase', value: phase ? `Sec ${coord.section} · Phase ${phase.label}` : `Section ${coord.section}` } : null,
    coord.area && /FT/i.test(coord.area) ? { label: 'Front / Depth', value: coord.area } : { label: 'Conversion Base', value: '1 Vaar = 1 SQ.YD = 9 SQ.FT' },
    live.monthlyRent ? { label: 'Monthly Rent', value: live.monthlyRent, accent: 'text-emerald-500' } : null,
    live.lessee ? { label: 'Lessee', value: live.lessee } : null,
    live.owner ? { label: 'Owner', value: live.owner } : null,
  ].filter(Boolean);

  const calculatorPrefill = sqYd
    ? buildCalculatorPrefill({
        parkCode: 'MIP 01',
        parkName: 'Industrial Park 1',
        unitTitle: `Shed #${id}`,
        superSqYd: sqYd,
        carpetSqYd: carpetYd,
        monthlyRent: live.monthlyRent,
        loadingNote: '25% standard loading factor',
      })
    : null;

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in Shed #${id} (${sqYd ? `${fmtNum(sqYd)} SQ.YD / ${fmtNum(sqFt)} SQ.FT` : rawArea}) in Industrial Park 1, Moraiya. Please share pricing and possession details.`
  );

  return {
    isOpen: true,
    unitNumber: id,
    title: `Industrial Shed #${id}`,
    locationText: 'MIP 01 · Moraiya, Changodar',
    statusLabel: getPark1StatusLabel(status),
    statusColor,
    badges: phase ? [{ text: `Phase ${phase.label}`, cls: `${phase.theme?.tagClass || 'bg-slate-700'} text-white` }] : [],
    primaryTotal: {
      heading: 'Super Built-Up & Conversions',
      sqYd: fmtNum(sqYd),
      sqMt: fmtNum(sqMt),
      sqFt: fmtNum(sqFt),
      vigha: vigha ? fmtNum(vigha) : null,
    },
    conversionRows,
    extraMetadata,
    calculatorPrefill,
    whatsappMessage,
  };
};
