// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, ZoomIn, ZoomOut, RefreshCw, ExternalLink, RotateCcw } from 'lucide-react';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { getPlotData } from '../../services/dataService';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ── Data state ── */
  const [plotData, setPlotData]       = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [hoveredPlot, setHoveredPlot]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ── Transform state ── */
  const [tfm, setTfm]       = useState({ x: 0, y: 0, scale: 1 });
  const [cursor, setCursor] = useState('grab');

  /* ── Drag / pinch refs (no re-render needed) ── */
  const containerRef = useRef(null);
  const dragging     = useRef(false);
  const moved        = useRef(false);      // true if pointer moved during drag
  const lastPos      = useRef({ x: 0, y: 0 });
  const pinchDist    = useRef(null);

  /* ══════════════════ DATA ══════════════════ */
  useEffect(() => {
    loadData();
    const id = setInterval(() => loadData(true), 30000);
    return () => clearInterval(id);
  }, []);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getPlotData();
      if (Object.keys(data).length === 0) {
        const init = {};
        Object.entries(plotCoordinates).forEach(([id, p]) => {
          init[id] = { status: 'available', area: p.area || 'N/A' };
        });
        setPlotData(init);
      } else {
        setPlotData(data);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  /* ══════════════════ FULLSCREEN ══════════════════ */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /* ══════════════════ ZOOM HELPER ══════════════════ */
  /*
    Zooms toward container-space point (cx, cy).
    All zoom sources (wheel, pinch, buttons) call this.
  */
  const zoomAt = useCallback((cx, cy, factor) => {
    setTfm(t => {
      const s = Math.min(Math.max(t.scale * factor, 0.8), 2);
      const r = s / t.scale;
      return { scale: s, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) };
    });
  }, []);

  /* ══════════════════ WHEEL (passive:false required) ══════════════════ */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 0.89);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt]);

  /* ══════════════════ TOUCH MOVE (passive:false required) ══════════════════ */
  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTfm(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
    } else if (e.touches.length === 2) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX;
      const dy   = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const mx   = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const my   = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      if (pinchDist.current) {
        const r = containerRef.current?.getBoundingClientRect();
        if (r) zoomAt(mx - r.left, my - r.top, dist / pinchDist.current);
      }
      pinchDist.current = dist;
    }
  }, [zoomAt]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove]);

  /* ══════════════════ MOUSE EVENTS ══════════════════ */
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragging.current  = true;
    moved.current     = false;
    lastPos.current   = { x: e.clientX, y: e.clientY };
    setCursor('grabbing');
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTfm(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    setCursor('grab');
  }, []);

  /* ══════════════════ TOUCH START / END ══════════════════ */
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragging.current  = true;
      moved.current     = false;
      lastPos.current   = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      dragging.current  = false;
      pinchDist.current = null;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragging.current  = false;
    pinchDist.current = null;
  }, []);

  /* ══════════════════ PLOT CLICK (only if not dragged) ══════════════════ */
  const handlePlotClick = useCallback((plotNumber) => {
    if (moved.current) return;   // was a drag, not a tap
    setSelectedPlot(plotNumber);
  }, []);

  /* ══════════════════ ZOOM BUTTONS ══════════════════ */
const btnZoomIn = useCallback(() => {
  const r = containerRef.current?.getBoundingClientRect();
  if (r && tfm.scale < 3) zoomAt(r.width / 2, r.height / 2, 1.3);  // ← add guard
}, [zoomAt, tfm.scale]);

const btnZoomOut = useCallback(() => {
  const r = containerRef.current?.getBoundingClientRect();
  if (r && tfm.scale > 0.5) zoomAt(r.width / 2, r.height / 2, 0.77); // ← add guard
}, [zoomAt, tfm.scale]);


  const resetView = useCallback(() => {
    setTfm({ x: 0, y: 0, scale: 1 });
  }, []);

  /* ══════════════════ TOOLTIP POSITION (screen space) ══════════════════ */
  /*
    SVG coords → container-space coords so tooltip follows the zoomed map.
  */
  const toScreen = (svgX, svgY) => ({
    x: svgX * tfm.scale + tfm.x,
    y: svgY * tfm.scale + tfm.y,
  });

  /* ══════════════════ STATUS HELPERS (unchanged) ══════════════════ */
  const getStatusColor = (status) => {
    switch (status) {
      case 'sold':       return isDark ? '#9CA3AF' : '#6B7280';
      case 'for-lease':  return isDark ? '#EF4444' : '#DC2626';
      case 'pre-leased': return isDark ? '#60A5FA' : '#3B82F6';
      default:           return isDark ? '#34D399' : '#10B981';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'sold':       return 'Sold';
      case 'for-lease':  return 'Sold - Available for Lease';
      case 'pre-leased': return 'Pre Leased - Available';
      default:           return 'Available';
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'sold':       return 'text-gray-500';
      case 'for-lease':  return 'text-red-500';
      case 'pre-leased': return 'text-blue-500';
      default:           return 'text-green-500';
    }
  };

  const getCircleRadius    = (p) => selectedPlot === p ? 14 : hoveredPlot === p ? 12 : 10;
  const getCircleStroke    = (p) => (selectedPlot === p || hoveredPlot === p)
    ? (isDark ? '#FFFFFF' : '#000000') : (isDark ? '#374151' : '#E5E7EB');
  const getCircleStrokeWidth = (p) => selectedPlot === p ? 3 : hoveredPlot === p ? 2.5 : 2;

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const diff = Math.floor((Date.now() - lastUpdated) / 1000);
    if (diff < 60)  return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const stats = {
    total:     Object.keys(plotCoordinates).length,
    available: Object.keys(plotCoordinates).filter(p => !plotData[p] || plotData[p].status === 'available').length,
    preLeased: Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'pre-leased').length,
    forLease:  Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'for-lease').length,
    sold:      Object.keys(plotCoordinates).filter(p => plotData[p]?.status === 'sold').length,
  };

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>

      {/* ── Header (stats + controls) ── */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>

        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {lastUpdated ? `Updated ${formatLastUpdated()}` : ''}
          </span>
          <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <RefreshCw className="w-3 h-3" />
            Auto-updates every 30s
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {[
            { val: stats.total,     label: 'Total',  cls: isDark ? 'text-white'      : 'text-gray-900', bg: '' },
            { val: stats.available, label: 'Avl',    cls: 'text-green-500',           bg: isDark ? 'bg-green-900/30' : 'bg-green-50' },
            { val: stats.preLeased, label: 'Pre L',  cls: 'text-blue-500',            bg: isDark ? 'bg-blue-900/30'  : 'bg-blue-50'  },
            { val: stats.forLease,  label: 'For L',  cls: 'text-red-500',             bg: isDark ? 'bg-red-900/30'   : 'bg-red-50'   },
            { val: stats.sold + stats.forLease, label: 'Sold', cls: 'text-gray-500', bg: isDark ? 'bg-gray-700'     : 'bg-gray-100' },
          ].map(({ val, label, cls, bg }) => (
            <div key={label} className={`p-2 rounded-xl text-center ${bg}`}>
              <p className={`text-xl font-bold ${cls}`}>{val}</p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Legend + controls */}
        <div className="flex flex-wrap gap-2 text-[0.7rem] items-center">
          {[
            { color: 'bg-green-500', label: 'Available'   },
            { color: 'bg-blue-500',  label: 'Pre Leased'  },
            { color: 'bg-red-500',   label: 'For Lease'   },
            { color: 'bg-gray-500',  label: 'Sold'        },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow ${color}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
            </div>
          ))}

          {/* Controls */}
          <div className="flex gap-1.5 ml-auto items-center">

            {/* Zoom % */}
            <span className={`text-[10px] font-bold tabular-nums px-2 py-1 rounded-lg border ${
              isDark ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}>
              {Math.round(tfm.scale * 100)}%
            </span>

            <a href={ADMIN_SHEET_URL} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-1 px-2 py-1.5 text-[0.62rem] font-semibold rounded-lg transition-all ${
                isDark ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}>
              <ExternalLink className="w-3 h-3" /> Edit
            </a>

            <button onClick={() => loadData()} disabled={loading}
              className={`p-1.5 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button onClick={btnZoomOut}
              className={`p-1.5 rounded-lg transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
              <ZoomOut className="w-4 h-4" />
            </button>

            <button onClick={btnZoomIn}
              className={`p-1.5 rounded-lg transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
              <ZoomIn className="w-4 h-4" />
            </button>

            <button onClick={resetView}
              className={`p-1.5 rounded-lg transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAP CANVAS
          KEY FIX:
          - overflow: hidden  → clips transformed content, NO scroll bleed
          - touchAction: none → hands all touch events to our handlers
          - events on THIS div (not on SVG or inner div)
          - transform on inner div via translate+scale at origin 0,0
          ════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        className={`relative ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
        style={{
          height: isFullscreen ? '100vh' : '65vh',
          overflow: 'hidden',         // ← no scroll, clips zoom
          cursor,
          userSelect: 'none',
          touchAction: 'none',        // ← hands ALL touch to JS
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >

        {/* Transformed layer — image + circles */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            transform: `translate(${tfm.x}px, ${tfm.y}px) scale(${tfm.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          <div className="relative" style={{ width: '910px', height: '980px' }}>

            <img
              src="/images/metro-industrial-map.jpg"
              alt="Metro Industrial Park Site Map"
              className="select-none"
              style={{ width: '910px', height: 'auto', display: 'block' }}
              draggable={false}
            />

            {/* SVG overlay — pointerEvents:none on SVG, auto on circles */}
            <svg
              className="absolute top-0 left-0"
              width="910" height="980"
              viewBox="0 0 910 980"
              style={{ pointerEvents: 'none' }}
            >
              {Object.entries(plotCoordinates).map(([plotNumber]) => {
                const center   = getPlotCenter(plotNumber);
                const status   = plotData[plotNumber]?.status || 'available';
                const radius   = getCircleRadius(plotNumber);
                const isHov    = hoveredPlot  === plotNumber;
                const isSel    = selectedPlot === plotNumber;
                return (
                  <g key={plotNumber}>
                    {(isHov || isSel) && (
                      <circle
                        cx={center.x} cy={center.y}
                        r={radius + 6}
                        fill={getStatusColor(status)}
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={center.x} cy={center.y} r={radius}
                      fill={getStatusColor(status)}
                      stroke={getCircleStroke(plotNumber)}
                      strokeWidth={getCircleStrokeWidth(plotNumber)}
                      className="transition-all duration-200 drop-shadow-lg"
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPlot(plotNumber)}
                      onMouseLeave={() => setHoveredPlot(null)}
                      onClick={() => handlePlotClick(plotNumber)}
                    />
                    <text
                      x={center.x} y={center.y}
                      textAnchor="middle" dominantBaseline="middle"
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
              })}
            </svg>
          </div>
        </div>

        {/* Tooltip — positioned in screen space, outside the transform */}
        {hoveredPlot && (() => {
          const center = getPlotCenter(hoveredPlot);
          const pos    = toScreen(center.x, center.y);
          return (
            <div
              className={`absolute pointer-events-none px-3 py-2.5 rounded-xl shadow-2xl text-sm z-50 ${
                isDark
                  ? 'bg-gray-900 border border-gray-700 text-white'
                  : 'bg-white border border-gray-300 text-gray-900'
              }`}
              style={{ top: pos.y - 70, left: pos.x + 16, maxWidth: '200px', minWidth: '140px' }}
            >
              <p className="font-bold text-sm mb-0.5">Plot {hoveredPlot}</p>
              <p className={`text-xs opacity-70 mb-1`}>
                Area: {plotData[hoveredPlot]?.area || plotCoordinates[hoveredPlot]?.area || 'N/A'}
              </p>
              <p className={`text-xs font-semibold ${getStatusColorClass(plotData[hoveredPlot]?.status)}`}>
                {getStatusLabel(plotData[hoveredPlot]?.status)}
              </p>
              <p className="text-[10px] opacity-40 mt-1">Click for details</p>
            </div>
          );
        })()}

        {/* Hint pill */}
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1.5 ${
          isDark ? 'bg-black/60 text-gray-300' : 'bg-black/50 text-white'
        }`}>
          🖱 Scroll/Pinch zoom · Drag to pan · Tap shed for details
        </div>
      </div>

      {/* ── Selected plot modal (unchanged from your original) ── */}
      <AnimatePresence>
        {selectedPlot && plotCoordinates[selectedPlot] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedPlot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-md w-full rounded-2xl shadow-2xl p-8 ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
            >
              <button
                onClick={() => setSelectedPlot(null)}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl mx-auto mb-4"
                  style={{ backgroundColor: getStatusColor(plotData[selectedPlot]?.status || 'available') }}
                >
                  {selectedPlot}
                </div>
                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Shed {selectedPlot}
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Shed Area', value: plotData[selectedPlot]?.area || plotCoordinates[selectedPlot]?.area || 'N/A' },
                  { label: 'Status',    value: null },
                ].map(({ label, value }) => (
                  <div key={label} className={`p-6 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <p className={`text-sm font-semibold mb-2 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {label}
                    </p>
                    {value ? (
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                    ) : (
                      <p className={`text-lg font-bold ${getStatusColorClass(plotData[selectedPlot]?.status)}`}>
                        {getStatusLabel(plotData[selectedPlot]?.status)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPlot(null)}
                className="mt-8 w-full px-6 py-4 rounded-xl font-bold text-md bg-brand-red text-white hover:bg-red-700 transition-all shadow-xl"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
