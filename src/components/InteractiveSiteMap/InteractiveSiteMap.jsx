// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { phaseCoordinates, getShedPhase } from '../../data/phaseCoordinates';
import { getPlotData } from '../../services/dataService';
import SiteMap2DViewport from './SiteMap2DViewport';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';
const PLOT_ENTRIES = Object.entries(plotCoordinates);
const PLOT_IDS = PLOT_ENTRIES.map(([id]) => id);

const parseArea = (str = '') => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;

const getStatusColor = (status, isDark) => {
  switch (status) {
    case 'sold':       return '#808080';
    case 'for-lease':  return isDark ? '#EF4444' : '#DC2626';
    case 'pre-leased': return isDark ? '#60A5FA' : '#3B82F6';
    default:           return isDark ? '#34D399' : '#10B981';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'sold':       return 'Sold';
    case 'for-lease':  return 'For Lease';
    case 'pre-leased': return 'Pre-Leased';
    default:           return 'Available';
  }
};

const AreaDisplay = React.memo(function AreaDisplay({ value, className = '' }) {
  const raw = String(value || 'N/A');
  const num = raw.replace(/[^0-9.,]/g, '').trim();
  const unit = raw.replace(/[0-9.,\s]/g, '').trim();
  if (!num || raw === 'N/A') return <span className={className}>N/A</span>;
  const isYd = /yd|yard/i.test(unit) || unit === '';
  return (
    <span className={className}>
      {num} {isYd ? 'SQ.YD' : unit}
    </span>
  );
});

const PhaseOverlays = React.memo(function PhaseOverlays({ showPhases, isDark }) {
  if (!showPhases) return null;
  return (
    <g className="phase-overlays" pointerEvents="none">
      {Object.values(phaseCoordinates).map((phase) => {
        const pts = phase.points || phase.polygonCoordinates || phase.rectCoordinates;
        const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
        const { labelCenter, label, id, theme } = phase;
        return (
          <g key={id}>
            <polygon
              points={pointsStr}
              fill={theme?.fill || 'rgba(100, 116, 139, 0.28)'}
              stroke={theme?.stroke || 'rgba(71, 85, 105, 0.75)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />
            <text
              x={labelCenter.x}
              y={labelCenter.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: '56px',
                fontWeight: '900',
                fill: theme?.watermarkColor || (isDark ? '#94A3B8' : '#334155'),
                opacity: isDark ? 0.35 : 0.25,
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-2px',
                userSelect: 'none',
              }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
});

const PlotDot = React.memo(function PlotDot({
  plotNumber,
  center,
  status,
  dimmed,
  isHov,
  isSel,
  isDark,
  onSelect,
  onHover,
  onLeave,
}) {
  if (!center) return null;
  const statusColor = getStatusColor(status, isDark);
  const radius = isSel ? 14 : isHov ? 12 : 10;
  const stroke = isSel || isHov ? '#FFFFFF' : isDark ? '#374151' : '#E5E7EB';
  const strokeWidth = isSel ? 3 : isHov ? 2.5 : 2;

  return (
    <g style={{ opacity: dimmed ? 0.2 : 1, transition: 'opacity 150ms ease' }}>
      {(isHov || isSel) && (
        <circle cx={center.x} cy={center.y} r={radius + 6} fill={statusColor} opacity="0.35" className="animate-pulse" />
      )}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill={statusColor}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        onMouseEnter={() => onHover(plotNumber)}
        onMouseLeave={onLeave}
        onClick={() => onSelect(plotNumber)}
      />
      <text
        x={center.x}
        y={center.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: isSel ? '11px' : isHov ? '10px' : '9px',
          fill: '#FFFFFF',
          fontWeight: 'bold',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {plotNumber}
      </text>
    </g>
  );
});

const ShedDetailModal = React.memo(function ShedDetailModal({ selectedPlot, selectedPlotData, isDark, onClose }) {
  if (!selectedPlot || !plotCoordinates[selectedPlot]) return null;

  const status = selectedPlotData?.status || 'available';
  const statusColor = getStatusColor(status, isDark);
  const areaValue = selectedPlotData?.area || plotCoordinates[selectedPlot]?.area;
  const areaNum = parseArea(areaValue);
  const phase = getShedPhase(selectedPlot);

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in Shed #${selectedPlot} (${areaValue && areaValue !== 'N/A' ? `${areaValue} / ` : ''}${areaNum > 0 ? `${(areaNum * 9).toLocaleString('en-IN')} sq.ft` : ''}) in Industrial Park 1, Moraiya. Please share pricing and possession details.`
  );

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
          background: isDark ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.5)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full sm:max-w-[390px] sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl border ${
            isDark ? 'bg-[#121215] border-white/15' : 'bg-white border-gray-200'
          }`}
        >
          <div className={`p-4 border-b ${isDark ? 'bg-[#0B0B0D] border-white/10' : 'bg-[#F8F9FA] border-gray-200'}`}>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white" style={{ background: statusColor }}>
                  {getStatusLabel(status)}
                </span>
                {phase && (
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white ${phase.theme?.tagClass || 'bg-slate-700'}`}>
                    Phase {phase.label}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: statusColor }}>
                #{selectedPlot}
              </div>
              <div>
                <h3 className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Industrial Shed #{selectedPlot}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-brand-red shrink-0" />
                  <span>MIP 01 · Moraiya, Changodar</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className={`p-3 border flex items-center justify-between gap-3 ${isDark ? 'bg-[#0B0B0D] border-white/10' : 'bg-[#F8F9FA] border-gray-200'}`}>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 block">Total Area</span>
                <span className={`text-lg sm:text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <AreaDisplay value={areaValue} />
                </span>
              </div>
              {areaNum > 0 && (
                <div className="text-right">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 block">Built-up</span>
                  <span className="text-sm font-bold text-brand-red tabular-nums">
                    ≈ {(areaNum * 9).toLocaleString('en-IN')} SQ.FT
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { k: 'Road Width', v: '60 Ft Heavy RCC' },
                { k: 'Clear Height', v: '30 – 35 Ft' },
                { k: 'Possession', v: 'Ready to Move', accent: 'text-emerald-500' },
                { k: 'Facilities', v: 'CCTV · Weigh Bridge' },
              ].map((cell) => (
                <div key={cell.k} className={`p-2.5 border ${isDark ? 'bg-[#0B0B0D]/60 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className="font-mono text-[9px] uppercase text-gray-400 block">{cell.k}</span>
                  <span className={`font-semibold text-[11px] block mt-0.5 ${cell.accent || (isDark ? 'text-gray-200' : 'text-gray-800')}`}>
                    {cell.v}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 pb-[env(safe-area-inset-bottom)]">
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <FaWhatsapp size={14} />
                <span>WhatsApp Enquiry</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className={`py-2.5 px-4 border font-mono text-xs font-bold uppercase ${
                  isDark ? 'border-white/15 bg-white/5 text-gray-300' : 'border-gray-200 bg-gray-100 text-gray-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showPhases, setShowPhases] = useState(true);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPlotData();
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(() => loadData(true), 30000);
    return () => clearInterval(id);
  }, [loadData]);

  const stats = useMemo(() => {
    const total = PLOT_ENTRIES.length;
    let available = 0;
    let preLeased = 0;
    let forLease = 0;
    let sold = 0;

    for (let i = 0; i < total; i++) {
      const id = PLOT_ENTRIES[i][0];
      const st = plotData[id]?.status || 'available';
      if (st === 'available') available++;
      else if (st === 'pre-leased') preLeased++;
      else if (st === 'for-lease') forLease++;
      else if (st === 'sold') sold++;
    }

    return { total, available, preLeased, forLease, sold };
  }, [plotData]);

  const statItems = useMemo(
    () => [
      { key: 'ALL', filterKey: 'ALL', value: stats.total, label: 'All Units', numClass: isDark ? 'text-white' : 'text-gray-900', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#E11D48' },
      { key: 'available', filterKey: 'available', value: stats.available, label: 'Available', numClass: 'text-emerald-500', lblClass: 'text-emerald-500', accentHex: '#10B981' },
      { key: 'pre-leased', filterKey: 'pre-leased', value: stats.preLeased, label: 'Pre-Leased', numClass: 'text-blue-500', lblClass: 'text-blue-500', accentHex: '#3B82F6' },
      { key: 'for-lease', filterKey: 'for-lease', value: stats.forLease, label: 'For Lease', numClass: 'text-red-500', lblClass: 'text-red-500', accentHex: '#EF4444' },
      { key: 'sold', filterKey: 'sold', value: stats.sold, label: 'Sold', numClass: isDark ? 'text-gray-400' : 'text-gray-600', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#6B7280' },
    ],
    [stats, isDark]
  );

  const selectedPlotData = useMemo(() => (selectedPlot ? plotData[selectedPlot] : null), [selectedPlot, plotData]);

  return (
    <>
      <SiteMap2DViewport
        isDark={isDark}
        imageSrc="/images/metro-industrial-park-site-plan-moraiya.jpg"
        imageAlt="Industrial Park 1 Master Site Plan"
        nativeWidth={910}
        nativeHeight={991}
        svgViewBox={[20, 150, 860, 930]}
        statItems={statItems}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        showPhases={showPhases}
        onTogglePhases={() => setShowPhases((v) => !v)}
        adminSheetUrl={ADMIN_SHEET_URL}
        loading={loading}
        onSync={loadData}
        fullscreenTitle="MIP 01 · Industrial Park 1"
        hoveredPlot={hoveredPlot}
        plotIds={PLOT_IDS}
        onSelectPlot={setSelectedPlot}
        getPlotCenter={getPlotCenter}
        renderSvg={({ movedRef }) => (
          <svg viewBox="20 150 860 930" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <PhaseOverlays showPhases={showPhases} isDark={isDark} />
            <g className="plots-layer">
              {PLOT_ENTRIES.map(([plotNumber, plot]) => {
                const center = plot.center || getPlotCenter(plotNumber);
                const status = plotData[plotNumber]?.status || 'available';
                const dimmed = statusFilter !== 'ALL' && status !== statusFilter;
                return (
                  <PlotDot
                    key={plotNumber}
                    plotNumber={plotNumber}
                    center={center}
                    status={status}
                    dimmed={dimmed}
                    isHov={hoveredPlot === plotNumber}
                    isSel={selectedPlot === plotNumber}
                    isDark={isDark}
                    onSelect={(id) => {
                      if (!movedRef?.current) setSelectedPlot(id);
                    }}
                    onHover={setHoveredPlot}
                    onLeave={() => setHoveredPlot(null)}
                  />
                );
              })}
            </g>
          </svg>
        )}
        renderHoverTooltip={(plotId, posX, posY) => {
          const status = plotData[plotId]?.status || 'available';
          const statusColor = getStatusColor(status, isDark);
          const area = plotData[plotId]?.area || plotCoordinates[plotId]?.area;
          const areaNum = parseArea(area);
          const phase = getShedPhase(plotId);

          return (
            <div
              className={`absolute pointer-events-none p-2.5 border shadow-xl z-30 ${
                isDark ? 'border-white/15 bg-[#121215]/95 text-white' : 'border-gray-200 bg-white/95 text-gray-900'
              }`}
              style={{ top: Math.max(8, posY - 70), left: posX + 14, minWidth: '148px', backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-xs">Shed #{plotId}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase" style={{ background: statusColor }}>
                  {getStatusLabel(status)}
                </span>
              </div>
              {area && (
                <p className="text-xs font-bold text-brand-red tabular-nums">
                  <AreaDisplay value={area} />
                  {areaNum > 0 && <span className="font-normal text-gray-400 ml-1 text-[10px]">({(areaNum * 9).toLocaleString('en-IN')} ft²)</span>}
                </p>
              )}
              {phase && <p className="font-mono text-[10px] text-gray-400 mt-0.5">Phase {phase.label}</p>}
            </div>
          );
        }}
      />

      <ShedDetailModal
        selectedPlot={selectedPlot}
        selectedPlotData={selectedPlotData}
        isDark={isDark}
        onClose={() => setSelectedPlot(null)}
      />
    </>
  );
}
