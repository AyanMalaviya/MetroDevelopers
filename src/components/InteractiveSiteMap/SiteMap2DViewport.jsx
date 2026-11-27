// src/components/InteractiveSiteMap/SiteMap2DViewport.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, RefreshCw, RotateCcw, Maximize2, ExternalLink,
  Plus, Minus, Search, Layers, Ruler,
} from 'lucide-react';

/**
 * Shared mobile-first interactive 2D site map viewport with inline + fullscreen pan/pinch-zoom,
 * clickable live availability filter strip, plot quick-search, and ResizeObserver auto-fit.
 */
export default function SiteMap2DViewport({
  isDark,
  imageSrc,
  imageAlt,
  nativeWidth,
  nativeHeight,
  svgViewBox = [0, 0, nativeWidth, nativeHeight],
  renderSvg,
  statItems,
  activeStatusFilter,
  onStatusFilterChange,
  showPhases,
  onTogglePhases,
  dimensionUnit,
  onDimensionUnitChange,
  adminSheetUrl,
  loading,
  onSync,
  fullscreenTitle,
  hoveredPlot,
  renderHoverTooltip,
  plotIds = [],
  onSelectPlot,
  getPlotCenter,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const toCanvasPx = useCallback(
    (center) => {
      if (!center) return { px: 0, py: 0 };
      const [vx, vy, vw, vh] = svgViewBox;
      return {
        px: ((center.x - vx) / vw) * nativeWidth,
        py: ((center.y - vy) / vh) * nativeHeight,
      };
    },
    [svgViewBox, nativeWidth, nativeHeight]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchTerm.trim().toLowerCase();
      if (!q) return;
      const exact = plotIds.find((id) => id.toLowerCase() === q);
      const partial = exact || plotIds.find((id) => id.toLowerCase().includes(q));
      if (partial) {
        onSelectPlot(partial);
        setSearchTerm('');
      }
    },
    [searchTerm, plotIds, onSelectPlot]
  );

  const border = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const bgBar  = isDark ? 'bg-[#121215]' : 'bg-white';
  const bgSub  = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <>
      <div className="w-full flex flex-col">
        {/* ── Single-Line Map Utility Bar (Search + Filters + Edit/Sync/Expand) ── */}
        <div
          className={`px-2.5 sm:px-3.5 py-2 border-b ${border} ${bgBar} flex items-center justify-between gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
        >
          {/* Left: Quick Plot/Shed Jump + Optional Phases Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                size={11}
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`}
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="numeric"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Go #..."
                aria-label="Jump to shed or plot number"
                className={`h-7 w-20 sm:w-28 pl-7 pr-2 border ${border} ${bgSub} ${textMain} font-mono text-[11px] focus:outline-none focus:border-brand-red`}
              />
            </form>

            {onTogglePhases && (
              <button
                type="button"
                onClick={onTogglePhases}
                aria-pressed={showPhases}
                title="Toggle Phase A-D overlay"
                className={`h-7 px-2 border ${border} inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  showPhases
                    ? isDark
                      ? 'bg-white/[0.08] text-white border-white/25'
                      : 'bg-gray-900 text-white border-gray-900'
                    : `${bgSub} ${textMuted}`
                }`}
              >
                <Layers size={11} aria-hidden="true" />
                <span>Phases</span>
              </button>
            )}

            {onDimensionUnitChange && (
              <div
                role="group"
                aria-label="Dimension lines units"
                className={`inline-flex items-center border ${border} divide-x ${divide} ${bgSub} shrink-0`}
              >
                <span className={`px-1.5 h-7 inline-flex items-center ${textMuted}`} title="Length & Width Lines">
                  <Ruler size={11} className={dimensionUnit !== 'off' ? 'text-brand-red' : ''} aria-hidden="true" />
                </span>
                {[
                  { id: 'ft', label: 'FT' },
                  { id: 'm',  label: 'M'  },
                  { id: 'off', label: 'OFF' },
                ].map((opt) => {
                  const active = dimensionUnit === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onDimensionUnitChange(opt.id)}
                      className={`h-7 px-1.5 font-mono text-[9.5px] font-bold uppercase transition-colors ${
                        active ? 'bg-brand-red text-white' : `${textMuted} hover:text-brand-red`
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Edit / Sync / Expand (single compact horizontal line) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={adminSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Edit Google Sheet"
              className={`h-7 px-2 border inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isDark
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <ExternalLink size={11} aria-hidden="true" />
              <span>Edit</span>
            </a>

            <button
              type="button"
              onClick={() => onSync()}
              disabled={loading}
              title="Sync live sheet availability"
              className={`h-7 px-2 border ${border} ${bgSub} ${textMain} hover:border-brand-red inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw size={11} className={loading ? 'animate-spin text-brand-red' : ''} aria-hidden="true" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="h-7 px-2.5 bg-brand-red hover:bg-red-700 text-white inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors"
              title="Fullscreen interactive pan and zoom"
            >
              <Maximize2 size={11} aria-hidden="true" />
              <span>Expand</span>
            </button>
          </div>
        </div>

        {/* ── Single-Row Filterable Live Availability Data Strip ── */}
        <div
          className={`grid border-b ${border} divide-x ${divide} ${bgSub}`}
          style={{ gridTemplateColumns: `repeat(${statItems.length}, minmax(0, 1fr))` }}
        >
          {statItems.map((item) => {
            const isFilterable = !!item.filterKey && onStatusFilterChange;
            const isSelected = activeStatusFilter === item.filterKey;
            return (
              <button
                key={item.key}
                type="button"
                disabled={!isFilterable}
                onClick={() => isFilterable && onStatusFilterChange(item.filterKey)}
                className={`py-1.5 px-1 text-center transition-colors flex flex-col items-center justify-center min-w-0 ${
                  isFilterable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isSelected
                    ? isDark
                      ? 'bg-white/[0.08]'
                      : 'bg-white shadow-inner'
                    : isDark
                      ? 'hover:bg-white/[0.03]'
                      : 'hover:bg-white/70'
                }`}
                style={isSelected ? { boxShadow: `inset 0 -2px 0 0 ${item.accentHex || '#E11D48'}` } : undefined}
              >
                <span className={`text-xs sm:text-sm font-bold tabular-nums leading-none ${item.numClass}`}>
                  {item.value}
                </span>
                <span className={`font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-wider mt-0.5 truncate max-w-full ${item.lblClass}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Responsive Inline Pan & Pinch-Zoom Canvas ── */}
        <PanZoomSurface
          isDark={isDark}
          isFullscreen={false}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          nativeWidth={nativeWidth}
          nativeHeight={nativeHeight}
          renderSvg={renderSvg}
          hoveredPlot={hoveredPlot}
          renderHoverTooltip={renderHoverTooltip}
          getPlotCenter={getPlotCenter}
          toCanvasPx={toCanvasPx}
          onOpenFullscreen={() => setIsFullscreen(true)}
        />
      </div>

      {/* ── Fullscreen Portal ── */}
      {isFullscreen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className={`fixed inset-0 flex flex-col ${isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]'}`}
              style={{ zIndex: 99999 }}
            >
              {/* Compact Fullscreen Single-Line Header */}
              <div className={`shrink-0 px-3 sm:px-4 py-2 border-b ${border} ${bgBar} flex items-center justify-between gap-2`}>
                <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-none">
                  <span className={`font-bold text-xs sm:text-sm truncate ${textMain}`}>
                    {fullscreenTitle}
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    {statItems.slice(1).map((item) => (
                      <span
                        key={item.key}
                        className={`px-2 py-0.5 border ${border} ${bgSub} font-mono text-[10px] font-bold ${item.numClass}`}
                      >
                        {item.value} {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onDimensionUnitChange && (
                    <div
                      role="group"
                      aria-label="Fullscreen dimension lines units"
                      className={`inline-flex items-center border ${border} divide-x ${divide} ${bgSub} shrink-0`}
                    >
                      {[
                        { id: 'ft', label: 'FT' },
                        { id: 'm',  label: 'M'  },
                        { id: 'off', label: 'OFF' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onDimensionUnitChange(opt.id)}
                          className={`h-7 px-1.5 font-mono text-[9.5px] font-bold uppercase transition-colors ${
                            dimensionUnit === opt.id ? 'bg-brand-red text-white' : `${textMuted} hover:text-brand-red`
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {onTogglePhases && (
                    <button
                      type="button"
                      onClick={onTogglePhases}
                      className={`h-7 px-2 border ${border} font-mono text-[10px] font-bold uppercase whitespace-nowrap ${
                        showPhases ? 'bg-gray-800 text-white' : `${bgSub} ${textMuted}`
                      }`}
                    >
                      Phases
                    </button>
                  )}
                  <a
                    href={adminSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-7 px-2 border font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1 whitespace-nowrap ${
                      isDark
                        ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <ExternalLink size={11} />
                    <span>Edit</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onSync()}
                    disabled={loading}
                    className={`h-7 w-7 border ${border} ${bgSub} ${textMain} inline-flex items-center justify-center`}
                    title="Sync"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin text-brand-red' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
                    className="h-7 w-7 bg-brand-red hover:bg-red-700 text-white inline-flex items-center justify-center"
                    title="Close Fullscreen"
                    aria-label="Close Fullscreen"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <PanZoomSurface
                isDark={isDark}
                isFullscreen
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                nativeWidth={nativeWidth}
                nativeHeight={nativeHeight}
                renderSvg={renderSvg}
                hoveredPlot={hoveredPlot}
                renderHoverTooltip={renderHoverTooltip}
                getPlotCenter={getPlotCenter}
                toCanvasPx={toCanvasPx}
              />
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

/* ─── GPU-Accelerated Responsive Pan & Pinch-Zoom Canvas ─── */
function PanZoomSurface({
  isDark,
  isFullscreen,
  imageSrc,
  imageAlt,
  nativeWidth,
  nativeHeight,
  renderSvg,
  hoveredPlot,
  renderHoverTooltip,
  getPlotCenter,
  toCanvasPx,
  onOpenFullscreen,
}) {
  const containerRef = useRef(null);
  const [tfm, setTfm] = useState({ x: 0, y: 0, scale: 1 });
  const [fitScale, setFitScale] = useState(1);
  const [cursor, setCursor] = useState('grab');

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
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;
    const nextFit = Math.min(width / nativeWidth, height / nativeHeight) * (isFullscreen ? 0.96 : 0.98);
    const x = (width - nativeWidth * nextFit) / 2;
    const y = (height - nativeHeight * nextFit) / 2;
    setFitScale(nextFit);
    applyTfm(() => ({ x, y, scale: nextFit }));
  }, [nativeWidth, nativeHeight, isFullscreen, applyTfm]);

  useEffect(() => {
    fitToContainer();
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => fitToContainer());
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitToContainer]);

  const zoomAt = useCallback(
    (cx, cy, factor) => {
      applyTfm((t) => {
        const minS = Math.max(0.25, fitScale * 0.9);
        const maxS = Math.max(3.5, fitScale * 5);
        const s = Math.min(Math.max(t.scale * factor, minS), maxS);
        const r = s / t.scale;
        return { scale: s, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) };
      });
    },
    [fitScale, applyTfm]
  );

  const zoomCenter = useCallback(
    (factor) => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      zoomAt(width / 2, height / 2, factor);
    },
    [zoomAt]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      // In inline desktop mode, allow regular page scroll unless user holds Ctrl OR is fullscreen OR already zoomed in
      if (!isFullscreen && !e.ctrlKey && tfm.scale <= fitScale * 1.04) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.14 : 0.88);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt, isFullscreen, tfm.scale, fitScale]);

  const isZoomed = isFullscreen || tfm.scale > fitScale * 1.05;

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
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
      } else if (e.touches.length === 1 && dragging.current && isZoomed) {
        e.preventDefault();
        const dx = e.touches[0].clientX - lastPos.current.x;
        const dy = e.touches[0].clientY - lastPos.current.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        applyTfm((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
      }
    },
    [zoomAt, isZoomed, applyTfm]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    moved.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setCursor('grabbing');
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    applyTfm((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const onMouseUp = () => {
    dragging.current = false;
    setCursor('grab');
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      moved.current = false;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      dragging.current = false;
      pinchDist.current = null;
    }
  };

  const onTouchEnd = () => {
    dragging.current = false;
    pinchDist.current = null;
  };

  // Dynamic responsive inline height computed directly from image orientation (eliminates empty voids on mobile)
  const isPortrait = nativeHeight > nativeWidth;
  const inlineHeightClass = isPortrait
    ? 'h-[58svh] min-h-[340px] sm:h-[64svh] max-h-[680px]'
    : 'h-[44svh] min-h-[290px] sm:h-[58svh] max-h-[660px]';

  const zoomPct = fitScale > 0 ? Math.round((tfm.scale / fitScale) * 100) : 100;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none w-full ${
        isFullscreen ? 'flex-1' : inlineHeightClass
      } ${isDark ? 'bg-[#08090D]' : 'bg-[#EEF0F3]'}`}
      style={{
        cursor,
        touchAction: isZoomed ? 'none' : 'pan-y',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: nativeWidth,
          height: nativeHeight,
          transform: `translate3d(${tfm.x}px, ${tfm.y}px, 0) scale(${tfm.scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          width={nativeWidth}
          height={nativeHeight}
          onLoad={fitToContainer}
          className="block w-full h-full select-none pointer-events-none"
          draggable={false}
        />
        {renderSvg({ movedRef: moved })}
      </div>

      {/* Hover Tooltip (Desktop / Fullscreen) */}
      {hoveredPlot && renderHoverTooltip && (() => {
        const center = getPlotCenter(hoveredPlot);
        if (!center) return null;
        const { px, py } = toCanvasPx(center);
        const posX = px * tfm.scale + tfm.x;
        const posY = py * tfm.scale + tfm.y;
        return renderHoverTooltip(hoveredPlot, posX, posY);
      })()}

      {/* Minimalist Compact Zoom Controls (Bottom Left inline so bottom-right ChatBot FAB never overlaps) */}
      <div
        className={`absolute bottom-2.5 z-20 inline-flex items-center border backdrop-blur-md ${
          isFullscreen ? 'right-2.5' : 'left-2.5'
        } ${
          isDark
            ? 'bg-[#121215]/90 border-white/15 text-gray-200 divide-x divide-white/15'
            : 'bg-white/95 border-gray-300 text-gray-800 divide-x divide-gray-200 shadow-sm'
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => zoomCenter(0.8)}
          aria-label="Zoom out"
          className="w-7 h-7 inline-flex items-center justify-center hover:text-brand-red transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="px-2 font-mono text-[10px] font-bold tabular-nums select-none">
          {zoomPct}%
        </span>
        <button
          type="button"
          onClick={() => zoomCenter(1.25)}
          aria-label="Zoom in"
          className="w-7 h-7 inline-flex items-center justify-center hover:text-brand-red transition-colors"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={fitToContainer}
          aria-label="Fit map to view"
          title="Fit to View"
          className="w-7 h-7 inline-flex items-center justify-center hover:text-brand-red transition-colors"
        >
          <RotateCcw size={11} />
        </button>
        {!isFullscreen && onOpenFullscreen && (
          <button
            type="button"
            onClick={onOpenFullscreen}
            aria-label="Open Fullscreen Map"
            title="Fullscreen"
            className="w-7 h-7 bg-brand-red text-white inline-flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <Maximize2 size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
