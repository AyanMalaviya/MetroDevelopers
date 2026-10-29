// src/components/InteractiveSiteMap/MetroEstateInteractiveMap.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, RefreshCw, RotateCcw, Maximize2, MapPin, Factory, CheckCircle, Phone, ExternalLink } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { estatePlotCoordinates, getEstatePlotCenter } from '../../data/estatePlotCoordinates';
import { getEstatePlotData } from '../../services/estateDataService';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Xu3J7wNp5Q7BanTlbLNeOrpRNpSP1UQGYFWbfQ1Hs9c/edit';
const ESTATE_PLOT_ENTRIES = Object.entries(estatePlotCoordinates);

/* ── Pure Static Helpers ── */
const parseArea = (str = '') => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;

const getStatusColor = (status, isDark) => {
  return status === 'sold' ? '#808080' : isDark ? '#34D399' : '#10B981';
};

const getStatusLabel = (status) => {
  return status === 'sold' ? 'Sold' : 'Available';
};

const getStatusColorClass = (status) => {
  return status === 'sold' ? 'text-[#808080]' : 'text-emerald-500';
};

/* ── Area with superscript yd² ── */
const AreaDisplay = React.memo(function AreaDisplay({ value, className = '', numClass = '', unitClass = '' }) {
  const raw = String(value || 'N/A');
  const num = raw.replace(/[^0-9.,]/g, '').trim();
  const unit = raw.replace(/[0-9.,\s]/g, '').trim();
  if (!num || raw === 'N/A') return <span className={className}>N/A</span>;
  const isYd = /yd|yard/i.test(unit) || unit === '';
  return (
    <span className={className}>
      <span className={numClass}>{num}</span>{' '}
      {isYd ? (
        <span className={unitClass}>SQ.YD</span>
      ) : (
        <span className={unitClass}>{unit}</span>
      )}
    </span>
  );
});

/* ── Individual Estate Plot Dot ── */
const EstatePlotDot = React.memo(
  function EstatePlotDot({
    plotNumber,
    center,
    status,
    isHov,
    isSel,
    isDark,
    onSelect,
    onHover,
    onLeave,
  }) {
    const statusColor = getStatusColor(status, isDark);
    const radius = isSel ? 14 : isHov ? 13 : 12;
    const stroke = isSel || isHov ? '#FFFFFF' : isDark ? '#374151' : '#E5E7EB';
    const strokeWidth = isSel ? 3 : isHov ? 2.5 : 2;

    const handleMouseEnter = useCallback(() => onHover(plotNumber), [onHover, plotNumber]);
    const handleClick = useCallback(() => onSelect(plotNumber), [onSelect, plotNumber]);

    return (
      <g>
        {(isHov || isSel) && (
          <circle
            cx={center.x}
            cy={center.y}
            r={radius + 6}
            fill={statusColor}
            opacity="0.35"
            className="animate-pulse"
          />
        )}
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill={statusColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className="drop-shadow-lg"
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={onLeave}
          onClick={handleClick}
        />
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: isSel ? '11px' : isHov ? '10px' : '9px',
            fill: '#FFFFFF',
            fontWeight: '900',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {plotNumber}
        </text>
      </g>
    );
  },
  (prev, next) => {
    return (
      prev.status === next.status &&
      prev.isHov === next.isHov &&
      prev.isSel === next.isSel &&
      prev.isDark === next.isDark &&
      prev.center.x === next.center.x &&
      prev.center.y === next.center.y &&
      prev.onSelect === next.onSelect &&
      prev.onHover === next.onHover &&
      prev.onLeave === next.onLeave
    );
  }
);

/* ── Estate Site Map SVG (Plots Layer) ── */
const EstateSiteMapSvg = React.memo(function EstateSiteMapSvg({
  plotData,
  selectedPlot,
  hoveredPlot,
  isDark,
  onSelectPlot,
  onHoverPlot,
  onLeavePlot,
}) {
  return (
    <svg viewBox="0 0 910 800" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      {ESTATE_PLOT_ENTRIES.map(([plotNumber, plot]) => {
        const center = plot.center || getEstatePlotCenter(plotNumber);
        const status = plotData[plotNumber]?.status || 'available';
        const isHov = hoveredPlot === plotNumber;
        const isSel = selectedPlot === plotNumber;

        return (
          <EstatePlotDot
            key={plotNumber}
            plotNumber={plotNumber}
            center={center}
            status={status}
            isHov={isHov}
            isSel={isSel}
            isDark={isDark}
            onSelect={onSelectPlot}
            onHover={onHoverPlot}
            onLeave={onLeavePlot}
          />
        );
      })}
    </svg>
  );
});

/* ── Fullscreen Modal Component ── */
const FullscreenViewer = React.memo(function FullscreenViewer({
  isOpen,
  onClose,
  plotData,
  selectedPlot,
  onSelectPlot,
  stats,
  loading,
  loadData,
  isDark,
}) {
  const [tfm, setTfm] = useState({ x: 0, y: 0, scale: 1 });
  const [cursor, setCursor] = useState('grab');
  const [hoveredPlot, setHoveredPlot] = useState(null);

  const containerRef = useRef(null);
  const mapWrapperRef = useRef(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(null);
  const rafId = useRef(null);

  const applyTfm = useCallback((updater) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setTfm(updater);
      rafId.current = null;
    });
  }, []);

  const fitToContainer = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current && mapWrapperRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const mapWidth = mapWrapperRef.current.offsetWidth || 910;
        const mapHeight = mapWrapperRef.current.offsetHeight || 800;
        const scale = Math.min(width / mapWidth, height / mapHeight) * 1;
        const x = (width - mapWidth * scale) / 2;
        const y = (height - mapHeight * scale) / 2;
        applyTfm(() => ({ x, y, scale }));
      }
    }, 60);
  }, [applyTfm]);

  useEffect(() => {
    if (isOpen) {
      fitToContainer();
    }
  }, [isOpen, fitToContainer]);

  const zoomAt = useCallback(
    (cx, cy, factor) => {
      applyTfm((t) => {
        const s = Math.min(Math.max(t.scale * factor, 0.6), 4);
        const r = s / t.scale;
        return { scale: s, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) };
      });
    },
    [applyTfm]
  );

  useEffect(() => {
    if (!isOpen) return;
    const el = containerRef.current;
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 0.89);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt, isOpen]);

  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && dragging.current) {
        const dx = e.touches[0].clientX - lastPos.current.x;
        const dy = e.touches[0].clientY - lastPos.current.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        applyTfm((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        if (pinchDist.current) {
          const r = containerRef.current?.getBoundingClientRect();
          if (r) zoomAt(mx - r.left, my - r.top, dist / pinchDist.current);
        }
        pinchDist.current = dist;
      }
    },
    [zoomAt, applyTfm]
  );

  useEffect(() => {
    if (!isOpen) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove, isOpen]);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    moved.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setCursor('grabbing');
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      applyTfm((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    },
    [applyTfm]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    setCursor('grab');
  }, []);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      moved.current = false;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      dragging.current = false;
      pinchDist.current = null;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragging.current = false;
    pinchDist.current = null;
  }, []);

  const handlePlotSelect = useCallback(
    (plotNumber) => {
      if (moved.current) return;
      onSelectPlot(plotNumber);
    },
    [onSelectPlot]
  );

  const handlePlotHover = useCallback((plotNumber) => {
    setHoveredPlot(plotNumber);
  }, []);

  const handlePlotLeave = useCallback(() => {
    setHoveredPlot(null);
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex flex-col ${isDark ? 'bg-black' : 'bg-white'}`}
        style={{ zIndex: 99999 }}
      >
        {/* Fullscreen Header */}
        <div
          className={`flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b ${
            isDark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className={`font-black text-xs sm:text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Industrial Park 2 — Master Site Map
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {stats.available} Available
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">
                {stats.sold} Sold
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                100% NA Industrial
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={ADMIN_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 ${
                isDark
                  ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border-emerald-800/60'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
              }`}
              title="Edit Google Sheet"
            >
              <ExternalLink size={11} />
              <span>Edit</span>
            </a>
            <button
              onClick={fitToContainer}
              className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              title="Close Fullscreen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{ cursor }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={mapWrapperRef}
            style={{
              transform: `translate(${tfm.x}px, ${tfm.y}px) scale(${tfm.scale})`,
              transformOrigin: '0 0',
              willChange: 'transform',
              position: 'absolute',
              top: 0,
              left: 0,
              width: 910,
              height: 800,
            }}
          >
            <img
              src="/images/metro-industrial-park-2-site-plan.jpg"
              alt="Industrial Park 2 Site Plan"
              width={910}
              height={800}
              className="pointer-events-none select-none block"
              draggable={false}
            />
            <EstateSiteMapSvg
              plotData={plotData}
              selectedPlot={selectedPlot}
              hoveredPlot={hoveredPlot}
              isDark={isDark}
              onSelectPlot={handlePlotSelect}
              onHoverPlot={handlePlotHover}
              onLeavePlot={handlePlotLeave}
            />
          </div>

          {/* Hover Tooltip in Fullscreen (Clean & Scannable) */}
          {hoveredPlot && (() => {
            const plotInfo = estatePlotCoordinates[hoveredPlot];
            const center = plotInfo?.center || getEstatePlotCenter(hoveredPlot);
            const posX = center.x * tfm.scale + tfm.x;
            const posY = center.y * tfm.scale + tfm.y;
            const status = plotData[hoveredPlot]?.status || 'available';
            const statusColor = getStatusColor(status, isDark);

            return (
              <div
                className={`absolute pointer-events-none p-2.5 rounded-xl shadow-2xl border ${
                  isDark ? 'border-gray-700 bg-gray-950/95 text-white' : 'border-gray-200 bg-white/95 text-gray-900'
                }`}
                style={{
                  top: posY - 75,
                  left: posX + 16,
                  zIndex: 100000,
                  minWidth: '150px',
                  maxWidth: '220px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="font-black text-xs">Plot #{hoveredPlot}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white"
                    style={{ background: statusColor }}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>
                {plotInfo && (
                  <p className="text-xs font-bold text-brand-red mb-0.5">
                    {plotInfo.totalPlotAreaSqYd?.toFixed(2)} SQ.YD
                    <span className="text-[10px] text-gray-400 font-normal ml-1">({plotInfo.totalPlotAreaSqMt?.toFixed(2)} m²)</span>
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mb-0.5">Block {plotInfo?.section || 'A'} · Moraiya</p>
                <p className="text-[9px] text-gray-400">Tap to view full details</p>
              </div>
            );
          })()}

          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap border ${
              isDark
                ? 'bg-black/60 text-gray-300 border-white/10'
                : 'bg-white/90 text-gray-700 border-gray-200 shadow-lg'
            }`}
          >
            🖱 Scroll / Pinch to zoom · Drag to pan · Tap plot for details
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

/* ── Plot Detail Modal Component (Redesigned: Clean, Scannable & Professional) ── */
const PlotDetailModal = React.memo(function PlotDetailModal({
  selectedPlot,
  selectedPlotData,
  plotData,
  isDark,
  onClose,
}) {
  if (!selectedPlot || !estatePlotCoordinates[selectedPlot]) return null;

  const plotCoord = estatePlotCoordinates[selectedPlot];
  const status = selectedPlotData?.status || 'available';
  const statusColor = getStatusColor(status, isDark);

  const totalSqYd = plotCoord?.totalPlotAreaSqYd?.toFixed(2) || 'N/A';
  const totalSqMt = plotCoord?.totalPlotAreaSqMt?.toFixed(2) || 'N/A';
  const netSqYd = plotCoord?.netPlotAreaSqYd?.toFixed(2) || 'N/A';
  const netSqMt = plotCoord?.netPlotAreaSqMt?.toFixed(2) || 'N/A';
  const roadSqMt = plotCoord?.roadAreaSqMt?.toFixed(2) || 'N/A';
  const extraCpSqMt = plotCoord?.extraLandCpSqMt ? plotCoord.extraLandCpSqMt.toFixed(2) : null;
  const section = plotCoord?.section || 'A';

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to inquire about Plot #${selectedPlot} (Block ${section}, ${totalSqYd} sq.yds / ${totalSqMt} sq.mtr) in Industrial Park 2, Moraiya. Please share pricing and possession details.`
  );

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-4"
        style={{
          zIndex: 100001,
          backdropFilter: 'blur(10px)',
          background: isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.55)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-[390px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
          }`}
        >
          {/* Card Header */}
          <div className={`p-4 sm:p-5 border-b ${
            isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-slate-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs"
                  style={{ background: statusColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {getStatusLabel(status)}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Block {section}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-xl transition-colors ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            {/* Plot Title & Campus */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shrink-0"
                style={{ background: statusColor }}
              >
                #{selectedPlot}
              </div>
              <div>
                <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Industrial Plot #{selectedPlot}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-brand-red shrink-0" />
                  <span>Industrial Park 2 · Moraiya, Changodar</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-3.5">
            {/* Primary Area Box (Hero Metric) */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isDark ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
                  Total Plot Area
                </span>
                <span className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalSqYd} <span className="text-sm font-bold text-brand-red">SQ.YD</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Metric Dimension</span>
                <span className="text-sm font-black text-brand-red">
                  {totalSqMt} SQ.MT
                </span>
                <span className="block text-[10px] text-gray-400">
                  ≈ {(parseFloat(totalSqYd) * 9).toFixed(0)} sq.ft
                </span>
              </div>
            </div>

            {/* Quick 2x2 Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Net Plotted Area</span>
                <span className={`font-bold text-[11px] sm:text-xs ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {netSqMt} m² ({netSqYd} yd²)
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Dedicated Road</span>
                <span className={`font-bold text-[11px] sm:text-xs ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {roadSqMt} SQ.MT Loading
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Land Title &amp; Zone</span>
                <span className="font-bold text-[11px] sm:text-xs text-emerald-500">
                  100% NA Industrial Title
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Extra Common Plot</span>
                <span className={`font-bold text-[11px] sm:text-xs ${extraCpSqMt ? 'text-amber-500' : isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {extraCpSqMt ? `${extraCpSqMt} SQ.MT` : 'Direct Frontage'}
                </span>
              </div>
            </div>

            {/* Park Features Strip */}
            <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold ${
              isDark ? 'bg-gray-950/40 border-gray-800 text-gray-400' : 'bg-gray-100/70 border-gray-200 text-gray-600'
            }`}>
              <span>✓ Heavy RCC Road</span>
              <span>✓ Street Light</span>
              <span>✓ Soil Filling (Puran)</span>
              <span>✓ Compound Wall</span>
              <span>✓ 24/7 Security</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-green-600/25 active:scale-95 transition-all whitespace-nowrap"
              >
                <FaWhatsapp size={15} />
                <span>Enquire on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 whitespace-nowrap ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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

/* ── Top Dashboard Header (Clean, Executive & Scannable) ── */
const DashboardHeader = React.memo(function DashboardHeader({
  stats,
  loading,
  loadData,
  onOpenFullscreen,
  isDark,
}) {
  return (
    <div
      className={`p-3 sm:p-4 border-b transition-colors ${
        isDark ? 'border-gray-800 bg-gray-950/70' : 'border-gray-200 bg-slate-50/90'
      }`}
    >
      {/* Top Row: Title Badge & Action Controls (Edit, Sync, Pan & Zoom) */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-3 mb-3">
        {/* Left: Project Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black tracking-tight border ${
            isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-xs'
          }`}
        >
          <Factory size={13} className="text-brand-red shrink-0" />
          <span>Park 2</span>
          <span className="text-[10px] text-gray-400 font-semibold">• 23 Industrial Plots</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Edit Button */}
          <a
            href={ADMIN_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              isDark
                ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border-emerald-800/60'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-xs'
            }`}
            title="Edit Inventory on Google Sheet"
          >
            <ExternalLink size={12} />
            <span>Edit</span>
          </a>

          {/* Sync Button */}
          <button
            type="button"
            onClick={() => loadData()}
            disabled={loading}
            className={`inline-flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDark
                ? 'bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700/70'
                : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200 shadow-xs'
            }`}
            title="Sync Live Data"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-brand-red' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Pan & Zoom Button */}
          <button
            type="button"
            onClick={onOpenFullscreen}
            className="inline-flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap"
            title="Open Fullscreen Interactive Map"
          >
            <Maximize2 size={12} />
            <span>Pan &amp; Zoom</span>
          </button>
        </div>
      </div>

      {/* Row 2: Availability Colored Stat Boxes (Number on top, Title below) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
        {[
          {
            key: 'total',
            val: stats.total,
            label: 'Total Plots',
            box: isDark
              ? 'bg-gray-900/80 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-900 shadow-xs',
            num: isDark ? 'text-white' : 'text-gray-900',
            lbl: isDark ? 'text-gray-400' : 'text-gray-500',
          },
          {
            key: 'available',
            val: stats.available,
            label: 'Available',
            box: isDark
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs',
            num: isDark ? 'text-emerald-400' : 'text-emerald-700',
            lbl: isDark ? 'text-emerald-400/90' : 'text-emerald-700/90',
          },
          {
            key: 'sold',
            val: stats.sold,
            label: 'Sold',
            box: isDark
              ? 'bg-gray-800/50 border-gray-700/60 text-gray-300'
              : 'bg-gray-100/90 border-gray-200 text-gray-700 shadow-xs',
            num: isDark ? 'text-gray-300' : 'text-gray-700',
            lbl: isDark ? 'text-gray-400' : 'text-gray-500',
          },
          {
            key: 'title',
            val: '100% NA',
            label: 'Clear Title',
            box: isDark
              ? 'bg-blue-950/40 border-blue-800/60 text-blue-400'
              : 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs',
            num: isDark ? 'text-blue-400' : 'text-blue-700',
            lbl: isDark ? 'text-blue-400/90' : 'text-blue-700/90',
          },
        ].map(({ key, val, label, box, num, lbl }) => (
          <div
            key={key}
            className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl border text-center transition-all ${box}`}
          >
            <span className={`text-sm sm:text-lg font-black tabular-nums leading-none ${num}`}>
              {val}
            </span>
            <span className={`text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider mt-1 whitespace-nowrap leading-tight ${lbl}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function MetroEstateInteractiveMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData, setPlotData] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getEstatePlotData();
      if (!data || Object.keys(data).length === 0) {
        const init = {};
        ESTATE_PLOT_ENTRIES.forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
    } catch (err) {
      console.error('Error loading Estate data:', err);
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
    const total = ESTATE_PLOT_ENTRIES.length;
    let available = 0;
    let sold = 0;

    for (let i = 0; i < total; i++) {
      const id = ESTATE_PLOT_ENTRIES[i][0];
      const st = plotData[id]?.status || 'available';
      if (st === 'available') available++;
      else if (st === 'sold') sold++;
    }

    return { total, available, sold };
  }, [plotData]);

  const selectedPlotData = useMemo(() => {
    return selectedPlot ? plotData[selectedPlot] : null;
  }, [selectedPlot, plotData]);

  const handleSelectPlot = useCallback((plotNumber) => {
    setSelectedPlot(plotNumber);
  }, []);

  const handleHoverPlot = useCallback((plotNumber) => {
    setHoveredPlot(plotNumber);
  }, []);

  const handleLeavePlot = useCallback(() => {
    setHoveredPlot(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPlot(null);
  }, []);

  const handleOpenFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  return (
    <>
      <div
        className={`rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border transition-colors ${
          isDark ? 'bg-gray-900/90 border-gray-800 shadow-black/40' : 'bg-white border-gray-200/90 shadow-gray-200/60'
        }`}
      >
        <DashboardHeader
          stats={stats}
          loading={loading}
          loadData={loadData}
          onOpenFullscreen={handleOpenFullscreen}
          isDark={isDark}
        />

        {/* Embedded Map Canvas */}
        <div className={`relative flex justify-center items-center p-2 sm:p-4 min-h-[440px] sm:min-h-[580px] max-h-[70vh] overflow-hidden ${
          isDark ? 'bg-[#08090d]' : 'bg-slate-100/60'
        }`}>
          <div className="relative max-w-full max-h-[64vh] select-none" style={{ display: 'inline-block' }}>
            <img
              src="/images/metro-industrial-park-2-site-plan.jpg"
              alt="Industrial Park 2 Site Plan"
              className="block max-w-full max-h-[64vh] w-auto h-auto object-contain select-none pointer-events-none drop-shadow-md rounded-lg"
              draggable={false}
            />
            <EstateSiteMapSvg
              plotData={plotData}
              selectedPlot={selectedPlot}
              hoveredPlot={hoveredPlot}
              isDark={isDark}
              onSelectPlot={handleSelectPlot}
              onHoverPlot={handleHoverPlot}
              onLeavePlot={handleLeavePlot}
            />
          </div>

          {/* Bottom Floating Info Pill */}
          <div
            className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 pointer-events-none px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm border ${
              isDark
                ? 'bg-black/75 text-gray-300 border-white/10'
                : 'bg-white/90 text-gray-700 border-gray-200'
            }`}
          >
            <MapPin size={12} className="text-brand-red shrink-0" />
            <span>Tap plot for dimensions &amp; WhatsApp enquiry</span>
          </div>

          {/* Bottom Floating Fullscreen Button */}
          <button
            type="button"
            onClick={handleOpenFullscreen}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-brand-red/25 active:scale-95 transition-all whitespace-nowrap"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Pan &amp; Zoom</span>
            <span className="sm:hidden">Zoom</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Interactive Portal */}
      <FullscreenViewer
        isOpen={isFullscreen}
        onClose={handleCloseFullscreen}
        plotData={plotData}
        selectedPlot={selectedPlot}
        onSelectPlot={handleSelectPlot}
        stats={stats}
        loading={loading}
        loadData={loadData}
        isDark={isDark}
      />

      {/* Dedicated Plot Detail Modal */}
      <PlotDetailModal
        selectedPlot={selectedPlot}
        selectedPlotData={selectedPlotData}
        plotData={plotData}
        isDark={isDark}
        onClose={handleCloseModal}
      />
    </>
  );
}
