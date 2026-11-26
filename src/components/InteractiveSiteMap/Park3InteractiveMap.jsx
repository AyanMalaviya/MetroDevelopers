// src/components/InteractiveSiteMap/Park3InteractiveMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { park3PlotCoordinates, getPark3PlotCenter } from '../../data/park3PlotCoordinates';
import { getPark3PlotData } from '../../services/park3DataService';
import SiteMap2DViewport from './SiteMap2DViewport';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1om2y2hG15CsH39lIIPtdiLrsAncSOSe0tYx6H3ih-1A/edit';
const PARK3_PLOT_ENTRIES = Object.entries(park3PlotCoordinates);
const PARK3_PLOT_IDS = PARK3_PLOT_ENTRIES.map(([id]) => id);

const parseArea = (str = '') => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
const getStatusColor = (status, isDark) => (status === 'sold' ? '#808080' : isDark ? '#34D399' : '#10B981');
const getStatusLabel = (status) => (status === 'sold' ? 'Sold' : 'Available');

const Park3PlotDot = React.memo(function Park3PlotDot({
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
  const statusColor = getStatusColor(status, isDark);
  const radius = isSel ? 13 : isHov ? 12 : 10;
  const stroke = isSel || isHov ? '#FFFFFF' : isDark ? '#1F2937' : '#FFFFFF';
  const strokeWidth = isSel ? 3 : isHov ? 2.5 : 1.5;

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
        y={center.y + 3.5}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={plotNumber.length > 2 ? '8' : '9'}
        fontWeight="bold"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {plotNumber}
      </text>
    </g>
  );
});

const PlotDetailModal = React.memo(function PlotDetailModal({
  selectedPlot,
  selectedPlotInfo,
  plotData,
  isDark,
  onClose,
}) {
  if (!selectedPlot || !selectedPlotInfo) return null;

  const status = plotData[selectedPlot]?.status || selectedPlotInfo.status || 'available';
  const statusColor = getStatusColor(status, isDark);
  const areaSqYd = selectedPlotInfo.area || 'N/A';
  const totalSqMt = typeof selectedPlotInfo.totalSqmt === 'number'
    ? selectedPlotInfo.totalSqmt.toFixed(2)
    : (selectedPlotInfo.totalSqmt || selectedPlotInfo.total_sqmt || 'N/A');
  const carpetSqMt = typeof selectedPlotInfo.carpetSqmt === 'number'
    ? selectedPlotInfo.carpetSqmt.toFixed(2)
    : (selectedPlotInfo.carpetSqmt || selectedPlotInfo.carpet_sqmt || 'N/A');
  const superPct = selectedPlotInfo.superPct || selectedPlotInfo.super_pct || '23.39%';

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to inquire about Plot #${selectedPlot} (${areaSqYd} / ${totalSqMt} sq.mtr) in Industrial Park 3 on Bavla-Rajoda Road. Please share pricing and possession details.`
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
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white" style={{ background: statusColor }}>
                  {getStatusLabel(status)}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  100% NA Industrial
                </span>
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
                  Industrial Plot #{selectedPlot}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-brand-red shrink-0" />
                  <span>MIP 03 · Bavla – Rajoda Road</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className={`p-3 border flex items-center justify-between gap-3 ${isDark ? 'bg-[#0B0B0D] border-white/10' : 'bg-[#F8F9FA] border-gray-200'}`}>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 block">Total Plot Area</span>
                <span className={`text-lg sm:text-xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {areaSqYd} <span className="text-xs font-bold text-brand-red">SQ.YD</span>
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 block">Metric</span>
                <span className="text-sm font-bold text-brand-red tabular-nums">{totalSqMt} SQ.MT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { k: 'Carpet Area', v: `${carpetSqMt} SQ.MT` },
                { k: 'Super Loading', v: superPct },
                { k: 'Road Network', v: '18m & 12m RCC' },
                { k: 'Approx Sq.Ft', v: `${(parseArea(areaSqYd) * 9).toLocaleString('en-IN')} SQ.FT`, accent: 'text-emerald-500' },
              ].map((cell) => (
                <div key={cell.k} className={`p-2.5 border ${isDark ? 'bg-[#0B0B0D]/60 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className="font-mono text-[9px] uppercase text-gray-400 block">{cell.k}</span>
                  <span className={`font-semibold text-[11px] block mt-0.5 tabular-nums ${cell.accent || (isDark ? 'text-gray-200' : 'text-gray-800')}`}>
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

export default function Park3InteractiveMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPark3PlotData();
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        PARK3_PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: p.status || 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading Park 3 data:', err);
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
    const total = PARK3_PLOT_ENTRIES.length;
    let available = 0;
    let sold = 0;
    for (let i = 0; i < total; i++) {
      const id = PARK3_PLOT_ENTRIES[i][0];
      const st = plotData[id]?.status || 'available';
      if (st === 'sold') sold++;
      else available++;
    }
    return { total, available, sold };
  }, [plotData]);

  const statItems = useMemo(
    () => [
      { key: 'ALL', filterKey: 'ALL', value: stats.total, label: 'Total Plots', numClass: isDark ? 'text-white' : 'text-gray-900', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#E11D48' },
      { key: 'available', filterKey: 'available', value: stats.available, label: 'Available', numClass: 'text-emerald-500', lblClass: 'text-emerald-500', accentHex: '#10B981' },
      { key: 'sold', filterKey: 'sold', value: stats.sold, label: 'Sold', numClass: isDark ? 'text-gray-400' : 'text-gray-600', lblClass: isDark ? 'text-gray-400' : 'text-gray-500', accentHex: '#6B7280' },
      { key: 'title', filterKey: null, value: '100% NA', label: 'Clear Title', numClass: 'text-blue-500', lblClass: 'text-blue-500' },
    ],
    [stats, isDark]
  );

  const selectedPlotInfo = useMemo(
    () => (selectedPlot ? park3PlotCoordinates[selectedPlot] || null : null),
    [selectedPlot]
  );

  return (
    <>
      <SiteMap2DViewport
        isDark={isDark}
        imageSrc="/images/metro-industrial-park-3-site-plan.jpg"
        imageAlt="Industrial Park 3 Master Site Plan"
        nativeWidth={1200}
        nativeHeight={893}
        svgViewBox={[0, 0, 1200, 893]}
        statItems={statItems}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        adminSheetUrl={ADMIN_SHEET_URL}
        loading={loading}
        onSync={loadData}
        fullscreenTitle="MIP 03 · Industrial Park 3"
        hoveredPlot={hoveredPlot}
        plotIds={PARK3_PLOT_IDS}
        onSelectPlot={setSelectedPlot}
        getPlotCenter={getPark3PlotCenter}
        renderSvg={({ movedRef }) => (
          <svg viewBox="0 0 1200 893" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            {PARK3_PLOT_ENTRIES.map(([plotNumber, plot]) => {
              const center = plot.center || getPark3PlotCenter(plotNumber);
              const status = plotData[plotNumber]?.status || 'available';
              const dimmed = statusFilter !== 'ALL' && status !== statusFilter;
              return (
                <Park3PlotDot
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
          </svg>
        )}
        renderHoverTooltip={(plotId, posX, posY) => {
          const plotInfo = park3PlotCoordinates[plotId];
          const status = plotData[plotId]?.status || 'available';
          const statusColor = getStatusColor(status, isDark);

          return (
            <div
              className={`absolute pointer-events-none p-2.5 border shadow-xl z-30 ${
                isDark ? 'border-white/15 bg-[#121215]/95 text-white' : 'border-gray-200 bg-white/95 text-gray-900'
              }`}
              style={{ top: Math.max(8, posY - 70), left: posX + 14, minWidth: '148px', backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-bold text-xs">Plot #{plotId}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase" style={{ background: statusColor }}>
                  {getStatusLabel(status)}
                </span>
              </div>
              {plotInfo && (
                <p className="text-xs font-bold text-brand-red tabular-nums">
                  {plotInfo.area}
                  {(plotInfo.totalSqmt || plotInfo.total_sqmt) && (
                    <span className="text-[10px] text-gray-400 font-normal ml-1">
                      ({typeof (plotInfo.totalSqmt || plotInfo.total_sqmt) === 'number'
                        ? (plotInfo.totalSqmt || plotInfo.total_sqmt).toFixed(2)
                        : (plotInfo.totalSqmt || plotInfo.total_sqmt)} m²)
                    </span>
                  )}
                </p>
              )}
              <p className="font-mono text-[10px] text-gray-400 mt-0.5">Bavla – Rajoda Rd</p>
            </div>
          );
        }}
      />

      <PlotDetailModal
        selectedPlot={selectedPlot}
        selectedPlotInfo={selectedPlotInfo}
        plotData={plotData}
        isDark={isDark}
        onClose={() => setSelectedPlot(null)}
      />
    </>
  );
}
