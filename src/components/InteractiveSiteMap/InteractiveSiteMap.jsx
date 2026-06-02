// src/components/InteractiveSiteMap/InteractiveSiteMap.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { X, RefreshCw, ExternalLink, RotateCcw, Maximize2, User, MapPin, TrendingUp, Building2 } from 'lucide-react';
import { plotCoordinates, getPlotCenter } from '../../data/plotcoordinates';
import { getPlotData } from '../../services/dataService';

const ADMIN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/100fiyz86pBVkMlU_Em8Veedqdhr-hV9yb1GrwD95n5w/edit';

/* ── Helpers ── */
const parseArea  = (str = '') => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
const areaUnit   = (str = '') => String(str).replace(/[0-9.,\s]/g, '').trim() || 'sq yd';

/* ── Area with superscript yd² ── */
function AreaDisplay({ value, className = '', numClass = '', unitClass = '' }) {
  const raw = String(value || 'N/A');
  // extract number and unit portions
  const num = raw.replace(/[^0-9.,]/g, '').trim();
  const unit = raw.replace(/[0-9.,\s]/g, '').trim();
  if (!num || raw === 'N/A') return <span className={className}>N/A</span>;
  const isYd = /yd|yard/i.test(unit) || unit === '';
  return (
    <span className={className}>
      <span className={numClass}>{num}</span>
      {' '}
      {isYd
        ? <span className={unitClass}>yd<sup style={{ fontSize: '0.6em', verticalAlign: 'super', lineHeight: 0 }}>2</sup></span>
        : <span className={unitClass}>{unit}</span>
      }
    </span>
  );
}

const LesseeIcon = ({ size = 13, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

/* ── Clickable shed chips ── */
function ShedChips({ sheds, selected, plotData, getStatusColor, onSelect, dark }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sheds.map(id => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            id === selected
              ? 'text-white shadow-md'
              : dark
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-500'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-400'
          }`}
          style={id === selected ? { backgroundColor: getStatusColor(plotData[id]?.status) } : {}}
        >
          #{id}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */

export default function InteractiveSiteMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [plotData,      setPlotData]     = useState({});
  const [selectedPlot,  setSelectedPlot] = useState(null);
  const [hoveredPlot,   setHoveredPlot]  = useState(null);
  const [loading,       setLoading]      = useState(true);
  const [lastUpdated,   setLastUpdated]  = useState(null);
  const [isFullscreen,  setIsFullscreen] = useState(false);

  const [tfm,    setTfm]    = useState({ x: 0, y: 0, scale: 1 });
  const [cursor, setCursor] = useState('grab');

  const containerRef = useRef(null);
  const dragging     = useRef(false);
  const moved        = useRef(false);
  const lastPos      = useRef({ x: 0, y: 0 });
  const pinchDist    = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

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

  const getOwnerSheds = useCallback((ownerName) => {
    if (!ownerName) return [];
    return Object.entries(plotData)
      .filter(([, d]) => d?.owner &&
        d.owner.trim().toLowerCase() === ownerName.trim().toLowerCase())
      .map(([id]) => id)
      .sort((a, b) => Number(a) - Number(b));
  }, [plotData]);

  const getLesseeSheds = useCallback((lesseeName) => {
    if (!lesseeName) return [];
    return Object.entries(plotData)
      .filter(([, d]) => d?.lessee &&
        d.lessee.trim().toLowerCase() === lesseeName.trim().toLowerCase())
      .map(([id]) => id)
      .sort((a, b) => Number(a) - Number(b));
  }, [plotData]);

  const getTotalArea = useCallback((shedIds) => {
    if (!shedIds.length) return null;
    const entries = shedIds.map(id => ({
      val: parseArea(plotData[id]?.area || plotCoordinates[id]?.area || ''),
      raw: plotData[id]?.area || plotCoordinates[id]?.area || '',
    }));
    const total = entries.reduce((a, b) => a + b.val, 0);
    if (!total) return null;
    const firstRaw = entries.find(e => e.raw && e.raw !== 'N/A')?.raw || '';
    return `${total.toLocaleString('en-IN')} ${areaUnit(firstRaw)}`.trim();
  }, [plotData]);

  const selectedPlotData = selectedPlot ? plotData[selectedPlot] : null;

  const rawOwnerSheds  = getOwnerSheds(selectedPlotData?.owner);
  const ownerSheds     = rawOwnerSheds.length > 0
    ? rawOwnerSheds
    : (selectedPlot && selectedPlotData?.owner ? [selectedPlot] : []);
  const ownerTotalArea = getTotalArea(ownerSheds);

  const rawLesseeSheds  = getLesseeSheds(selectedPlotData?.lessee);
  const lesseeSheds     = rawLesseeSheds.length > 0
    ? rawLesseeSheds
    : (selectedPlot && selectedPlotData?.lessee ? [selectedPlot] : []);
  const lesseeTotalArea = getTotalArea(lesseeSheds);

  const hasOwner  = !!(selectedPlotData?.owner);
  const hasLessee = !!(selectedPlotData?.lessee);
  const monthlyRentRaw = selectedPlotData?.monthlyRent?.trim() || null;

  const fitToContainer = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const scale = Math.min(width / 910, height / 980) * 1;
        const x = (width  - 910 * scale) / 2;
        const y = (height - 980 * scale) / 2;
        setTfm({ x, y, scale });
      }
    }, 60);
  }, []);

  useEffect(() => { if (isFullscreen) fitToContainer(); }, [isFullscreen, fitToContainer]);

  const zoomAt = useCallback((cx, cy, factor) => {
    setTfm(t => {
      const s = Math.min(Math.max(t.scale * factor, 0.6), 4);
      const r = s / t.scale;
      return { scale: s, x: cx - r * (cx - t.x), y: cy - r * (cy - t.y) };
    });
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 0.89);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt, isFullscreen]);

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
    if (!isFullscreen) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove, isFullscreen]);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    dragging.current = true; moved.current = false;
    lastPos.current  = { x: e.clientX, y: e.clientY };
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

  const onMouseUp    = useCallback(() => { dragging.current = false; setCursor('grab'); }, []);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragging.current = true; moved.current = false;
      lastPos.current  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      dragging.current  = false;
      pinchDist.current = null;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragging.current  = false;
    pinchDist.current = null;
  }, []);

  const handlePlotClick = useCallback((plotNumber) => {
    if (moved.current) return;
    setSelectedPlot(plotNumber);
  }, []);

  const toScreen = (svgX, svgY) => ({
    x: svgX * tfm.scale + tfm.x,
    y: svgY * tfm.scale + tfm.y,
  });

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
      case 'for-lease':  return 'Sold — Available for Lease';
      case 'pre-leased': return 'Pre-Leased — Available';
      default:           return 'Available';
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'sold':       return 'text-gray-500';
      case 'for-lease':  return 'text-red-500';
      case 'pre-leased': return 'text-blue-500';
      default:           return 'text-emerald-500';
    }
  };

  /* Gradient per status */
  const getStatusGradient = (status) => {
    switch (status) {
      case 'sold':       return isDark ? 'from-gray-700 to-gray-800'     : 'from-gray-100 to-gray-200';
      case 'for-lease':  return isDark ? 'from-red-900/60 to-red-950/80' : 'from-red-50 to-red-100';
      case 'pre-leased': return isDark ? 'from-blue-900/60 to-blue-950/80' : 'from-blue-50 to-blue-100';
      default:           return isDark ? 'from-emerald-900/50 to-emerald-950/80' : 'from-emerald-50 to-emerald-100';
    }
  };

  const getCircleRadius      = (p) => selectedPlot === p ? 14 : hoveredPlot === p ? 12 : 10;
  const getCircleStroke      = (p) => (selectedPlot === p || hoveredPlot === p)
    ? '#FFFFFF' : (isDark ? '#374151' : '#E5E7EB');
  const getCircleStrokeWidth = (p) => selectedPlot === p ? 3 : hoveredPlot === p ? 2.5 : 2;

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const diff = Math.floor((Date.now() - lastUpdated) / 1000);
    if (diff < 60)   return 'Just now';
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

  const renderDots = () =>
    Object.entries(plotCoordinates).map(([plotNumber]) => {
      const center    = getPlotCenter(plotNumber);
      const status    = plotData[plotNumber]?.status || 'available';
      const radius    = getCircleRadius(plotNumber);
      const isHov     = hoveredPlot  === plotNumber;
      const isSel     = selectedPlot === plotNumber;

      const thisOwner = plotData[plotNumber]?.owner;
      const selOwner  = selectedPlotData?.owner;
      const isOwnerSibling = !!(thisOwner && selOwner &&
        thisOwner.trim().toLowerCase() === selOwner.trim().toLowerCase() &&
        plotNumber !== selectedPlot);

      const thisLessee = plotData[plotNumber]?.lessee;
      const selLessee  = selectedPlotData?.lessee;
      const isLesseeSibling = !!(thisLessee && selLessee &&
        thisLessee.trim().toLowerCase() === selLessee.trim().toLowerCase() &&
        plotNumber !== selectedPlot);

      const isSibling = isOwnerSibling || isLesseeSibling;

      return (
        <g key={plotNumber}>
          {(isHov || isSel) && (
            <circle cx={center.x} cy={center.y} r={radius + 6}
              fill={getStatusColor(status)} opacity="0.35" className="animate-pulse" />
          )}
          {isSibling && (
            <circle cx={center.x} cy={center.y} r={radius + 4}
              fill={getStatusColor(status)} opacity="0.25" />
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
              fill: '#FFFFFF', fontWeight: 'bold',
              pointerEvents: 'none', userSelect: 'none',
            }}
          >
            {plotNumber}
          </text>
        </g>
      );
    });

  /* ════════════════════════════════════════
     OWNER / LESSEE CARDS (redesigned)
  ════════════════════════════════════════ */
  const renderOwnerLesseeBlock = () => {
    if (!hasOwner && !hasLessee) return null;

    return (
      <div className="space-y-2.5 mb-4">
        {hasOwner && (
          <div className={`rounded-xl overflow-hidden border ${
            isDark ? 'border-blue-800/60' : 'border-blue-200'
          }`}>
            <div className={`px-3.5 py-2.5 flex items-center gap-2 ${
              isDark ? 'bg-blue-900/40' : 'bg-blue-600'
            }`}>
              <User size={11} className="text-white opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Owner Portfolio</span>
            </div>
            <div className={`px-3.5 py-3 ${ isDark ? 'bg-blue-950/30' : 'bg-blue-50' }`}>
              <p className={`font-bold text-sm mb-2.5 ${ isDark ? 'text-white' : 'text-gray-900' }`}>
                {selectedPlotData.owner}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {ownerSheds.length > 0 && (
                  <div className={`px-2.5 py-1.5 rounded-lg ${
                    isDark ? 'bg-blue-900/60 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <span className="font-black">{ownerSheds.length}</span>
                    <span className="opacity-70 ml-1">shed{ownerSheds.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {ownerTotalArea && (
                  <div className={`px-2.5 py-1.5 rounded-lg ${
                    isDark ? 'bg-blue-900/60 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <AreaDisplay value={ownerTotalArea}
                      numClass="font-black"
                      unitClass="opacity-70"
                    />
                  </div>
                )}
                {monthlyRentRaw && (
                  <div className={`px-2.5 py-1.5 rounded-lg font-black ${
                    isDark ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ₹{monthlyRentRaw}<span className="font-normal opacity-70">/mo</span>
                  </div>
                )}
              </div>
              {ownerSheds.length > 1 && (
                <div className="mt-2.5">
                  <ShedChips
                    sheds={ownerSheds} selected={selectedPlot}
                    plotData={plotData} getStatusColor={getStatusColor}
                    onSelect={setSelectedPlot} dark={isDark}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {hasLessee && (
          <div className={`rounded-xl overflow-hidden border ${
            isDark ? 'border-amber-800/60' : 'border-amber-200'
          }`}>
            <div className={`px-3.5 py-2.5 flex items-center gap-2 ${
              isDark ? 'bg-amber-900/50' : 'bg-amber-500'
            }`}>
              <LesseeIcon size={11} className="text-white opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Lessee</span>
            </div>
            <div className={`px-3.5 py-3 ${ isDark ? 'bg-amber-950/30' : 'bg-amber-50' }`}>
              <p className={`font-bold text-sm mb-2.5 ${ isDark ? 'text-white' : 'text-gray-900' }`}>
                {selectedPlotData.lessee}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {lesseeSheds.length > 0 && (
                  <div className={`px-2.5 py-1.5 rounded-lg ${
                    isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className="font-black">{lesseeSheds.length}</span>
                    <span className="opacity-70 ml-1">shed{lesseeSheds.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {lesseeTotalArea && (
                  <div className={`px-2.5 py-1.5 rounded-lg ${
                    isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <AreaDisplay value={lesseeTotalArea}
                      numClass="font-black"
                      unitClass="opacity-70"
                    />
                  </div>
                )}
                {!hasOwner && monthlyRentRaw && (
                  <div className={`px-2.5 py-1.5 rounded-lg font-black ${
                    isDark ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ₹{monthlyRentRaw}<span className="font-normal opacity-70">/mo</span>
                  </div>
                )}
              </div>
              {lesseeSheds.length > 1 && (
                <div className="mt-2.5">
                  <ShedChips
                    sheds={lesseeSheds} selected={selectedPlot}
                    plotData={plotData} getStatusColor={getStatusColor}
                    onSelect={setSelectedPlot} dark={isDark}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ════════════════════════════════════════
     FULLSCREEN PORTAL
  ════════════════════════════════════════ */
  const fullscreenPortal = createPortal(
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex flex-col bg-black"
          style={{ zIndex: 99999 }}
        >
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm hidden sm:block">
                Metro Industrial Park — Site Map
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { val: stats.available,             label: 'Available',  cls: 'text-green-400 bg-green-900/40 border-green-800' },
                  { val: stats.preLeased,             label: 'Pre Leased', cls: 'text-blue-400 bg-blue-900/40 border-blue-800'   },
                  { val: stats.forLease,              label: 'For Lease',  cls: 'text-red-400 bg-red-900/40 border-red-800'      },
                  { val: stats.sold + stats.forLease, label: 'Sold',       cls: 'text-gray-400 bg-white/5 border-white/10'       },
                ].map(({ val, label, cls }) => (
                  <span key={label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>
                    {val} {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tabular-nums px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hidden sm:inline">
                {Math.round(tfm.scale * 100)}%
              </span>
              <button onClick={fitToContainer} title="Reset view"
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                <RotateCcw size={14} />
              </button>
              <button onClick={() => loadData()} disabled={loading}
                className={`p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 active:scale-95 transition-all">
                <X size={14} /> Close
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden bg-black"
            style={{ cursor, userSelect: 'none', touchAction: 'none' }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}    onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0,
              transform: `translate(${tfm.x}px, ${tfm.y}px) scale(${tfm.scale})`,
              transformOrigin: '0 0', willChange: 'transform',
            }}>
              <div className="relative" style={{ width: '910px', height: '980px' }}>
                <img
                  src="/images/metro-industrial-park-site-plan-moraiya.jpg"
                  alt="Metro Industrial Park Site Plan"
                  className="select-none"
                  style={{ width: '910px', height: 'auto', display: 'block' }}
                  draggable={false}
                />
                <svg className="absolute top-0 left-0"
                  width="910" height="980" viewBox="20 140 860 930"
                  style={{ pointerEvents: 'none' }}>
                  {renderDots()}
                </svg>
              </div>
            </div>

            {hoveredPlot && (() => {
              const center = getPlotCenter(hoveredPlot);
              const pos    = toScreen(center.x, center.y);
              const owner  = plotData[hoveredPlot]?.owner;
              const lessee = plotData[hoveredPlot]?.lessee;
              const area   = plotData[hoveredPlot]?.area || plotCoordinates[hoveredPlot]?.area;
              return (
                <div
                  className="absolute pointer-events-none px-3 py-2.5 rounded-xl shadow-2xl bg-gray-900 border border-white/10 text-white"
                  style={{ top: pos.y - 90, left: pos.x + 16, zIndex: 100000, maxWidth: '220px', minWidth: '150px' }}
                >
                  <p className="font-bold text-sm mb-0.5">Shed {hoveredPlot}</p>
                  {area && (
                    <p className="text-xs opacity-70 mb-1.5">
                      <AreaDisplay value={area} />
                    </p>
                  )}
                  {owner && (
                    <p className="text-[11px] text-blue-300 mb-0.5 flex items-center gap-1">
                      <User size={9} className="flex-shrink-0" /> {owner}
                    </p>
                  )}
                  {lessee && (
                    <p className="text-[11px] text-amber-300 mb-1 flex items-center gap-1">
                      <LesseeIcon size={9} className="flex-shrink-0" /> {lessee}
                    </p>
                  )}
                  <p className={`text-xs font-semibold ${getStatusColorClass(plotData[hoveredPlot]?.status)}`}>
                    {getStatusLabel(plotData[hoveredPlot]?.status)}
                  </p>
                  <p className="text-[10px] opacity-40 mt-1">Click for details</p>
                </div>
              );
            })()}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300 whitespace-nowrap border border-white/10">
              🖱 Scroll / Pinch to zoom · Drag to pan · Tap shed for details
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  /* ════════════════════════════════════════
     MODAL — fully redesigned
  ════════════════════════════════════════ */
  const statusColor   = getStatusColor(selectedPlotData?.status || 'available');
  const statusGrad    = getStatusGradient(selectedPlotData?.status || 'available');
  const areaValue     = selectedPlotData?.area || plotCoordinates[selectedPlot]?.area;
  const areaNum       = parseArea(areaValue);

  const modalPortal = createPortal(
    <AnimatePresence>
      {selectedPlot && plotCoordinates[selectedPlot] && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 100001, backdropFilter: 'blur(8px)', background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.55)' }}
          onClick={() => setSelectedPlot(null)}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.88, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? 'bg-gray-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-black/8'
            }`}
          >
            {/* ── Hero header with gradient ── */}
            <div className={`relative bg-gradient-to-br ${statusGrad} px-5 pt-6 pb-5`}>
              {/* Close button */}
              <button
                onClick={() => setSelectedPlot(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                          : 'bg-black/8 hover:bg-black/15 text-black/50 hover:text-black'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status pill */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                  style={{ background: statusColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                  {getStatusLabel(selectedPlotData?.status)}
                </span>
              </div>

              {/* Shed number hero */}
              <div className="flex items-end gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0"
                  style={{ background: statusColor, boxShadow: `0 8px 24px ${statusColor}55` }}
                >
                  {selectedPlot}
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${
                    isDark ? 'text-white/50' : 'text-black/40'
                  }`}>Metro Industrial Park</p>
                  <h3 className={`text-xl font-black leading-tight ${ isDark ? 'text-white' : 'text-gray-900' }`}>
                    Shed {selectedPlot}
                  </h3>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="px-5 py-4">

              {/* Area card — hero stat */}
              <div className={`rounded-xl p-4 mb-4 flex items-center gap-4 ${
                isDark ? 'bg-white/5 ring-1 ring-white/8' : 'bg-gray-50 ring-1 ring-black/5'
              }`}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${statusColor}22` }}
                >
                  <Building2 size={18} style={{ color: statusColor }} />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                    isDark ? 'text-white/40' : 'text-gray-400'
                  }`}>Shed Area</p>
                  {areaValue && areaValue !== 'N/A' ? (
                    <p className={`text-2xl font-black leading-none ${ isDark ? 'text-white' : 'text-gray-900' }`}>
                      <AreaDisplay
                        value={areaValue}
                        numClass=""
                        unitClass={`text-sm font-bold ${ isDark ? 'text-white/50' : 'text-gray-400' }`}
                      />
                    </p>
                  ) : (
                    <p className={`text-lg font-bold ${ isDark ? 'text-white/50' : 'text-gray-400' }`}>N/A</p>
                  )}
                  {areaNum > 0 && (
                    <p className={`text-[10px] mt-0.5 ${ isDark ? 'text-white/30' : 'text-gray-400' }`}>
                      ≈ {(areaNum * 9).toLocaleString('en-IN')} sq ft
                    </p>
                  )}
                </div>
              </div>

              {/* Location pill */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
                isDark ? 'bg-white/4' : 'bg-gray-50'
              }`}>
                <MapPin size={12} className={isDark ? 'text-white/40' : 'text-gray-400'} />
                <span className={`text-xs ${ isDark ? 'text-white/50' : 'text-gray-500' }`}>
                  Changodar, Ahmedabad, Gujarat
                </span>
              </div>

              {/* Owner + Lessee */}
              {renderOwnerLesseeBlock()}

              {/* CTA */}
              <button
                onClick={() => setSelectedPlot(null)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  isDark
                    ? 'bg-white/8 hover:bg-white/12 text-white ring-1 ring-white/10'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 ring-1 ring-black/5'
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <>
      <div className={`rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {lastUpdated ? `Updated ${formatLastUpdated()}` : ''}
            </span>
            <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <RefreshCw className="w-3 h-3" /> Auto-updates every 30s
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-3">
            {[
              { val: stats.total,                 label: 'Total', cls: isDark ? 'text-white' : 'text-gray-900', bg: '' },
              { val: stats.available,             label: 'Avl',   cls: 'text-green-500', bg: isDark ? 'bg-green-900/30' : 'bg-green-50'  },
              { val: stats.preLeased,             label: 'Pre L', cls: 'text-blue-500',  bg: isDark ? 'bg-blue-900/30'  : 'bg-blue-50'   },
              { val: stats.forLease,              label: 'For L', cls: 'text-red-500',   bg: isDark ? 'bg-red-900/30'   : 'bg-red-50'    },
              { val: stats.sold + stats.forLease, label: 'Sold',  cls: 'text-gray-500', bg: isDark ? 'bg-gray-700'     : 'bg-gray-100'  },
            ].map(({ val, label, cls, bg }) => (
              <div key={label} className={`p-2 rounded-xl text-center ${bg}`}>
                <p className={`text-xl font-bold ${cls}`}>{val}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-[0.7rem] items-center">
            {[
              { color: 'bg-green-500', label: 'Available'  },
              { color: 'bg-blue-500',  label: 'Pre Leased' },
              { color: 'bg-red-500',   label: 'For Lease'  },
              { color: 'bg-gray-500',  label: 'Sold'       },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow ${color}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
              </div>
            ))}
            <div className="flex gap-1.5 ml-auto">
              <a
                href={ADMIN_SHEET_URL} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1 px-2 py-1.5 text-[0.62rem] font-semibold rounded-lg transition-all ${
                  isDark ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <ExternalLink className="w-3 h-3" /> Edit
              </a>
              <button onClick={() => loadData()} disabled={loading}
                className={`p-1.5 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${
                  isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}>
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className={`relative flex justify-center items-center py-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="relative" style={{ display: 'inline-block' }}>
            <img
              src="/images/metro-industrial-park-site-plan-moraiya.jpg"
              alt="Metro Industrial Park Site Map"
              className="block select-none"
              style={{ maxHeight: '68vh', width: 'auto' }}
              draggable={false}
            />
            <svg viewBox="20 150 860 930" className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}>
              {renderDots()}
            </svg>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-red text-white font-bold text-xs hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-500/25"
          >
            <Maximize2 size={14} /> View Fullscreen
          </button>
          <div className={`absolute bottom-4 left-4 pointer-events-none px-3 py-1.5 rounded-full text-[10px] font-medium ${
            isDark ? 'bg-black/60 text-gray-300' : 'bg-black/50 text-white'
          }`}>
            Tap shed for details
          </div>
        </div>
      </div>

      {fullscreenPortal}
      {modalPortal}
    </>
  );
}
