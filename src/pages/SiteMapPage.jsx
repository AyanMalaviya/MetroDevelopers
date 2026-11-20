// src/pages/SiteMapPage.jsx
import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft, Map, Table, Search, Maximize2,
  ExternalLink, Factory, Box, ArrowRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';
const Park1Model3D = lazy(() => import('../components/InteractiveSiteMap/Park1Model3D'));
import MetroEstateInteractiveMap from '../components/InteractiveSiteMap/MetroEstateInteractiveMap';
import Park3InteractiveMap from '../components/InteractiveSiteMap/Park3InteractiveMap';
import SEO from '../components/SEO/SEO';
import { estatePlotsSchedule, estateTotalStats } from '../data/estatePlotCoordinates';
import { park3Plots } from '../data/park3PlotsData';

const EASE = [0.16, 1, 0.3, 1];

// Hoisted static image references
const PARK1_IMAGES = {
  table1: { src: '/images/metro-industrial-park-area-details-table-1.jpg', title: 'Industrial Park 1 — Area Details Table 1 (Units 1–32)' },
  table2: { src: '/images/metro-industrial-park-area-details-table-2.jpg', title: 'Industrial Park 1 — Area Details Table 2 (Units 33–63)' },
};

const PARK2_IMAGES = {
  table: { src: '/images/metro-industrial-park-2-area-table.png', title: 'Industrial Park 2 — Official 23 Plots Engineering Schedule' },
};

const PARK3_IMAGES = {
  table1: { src: '/images/metro-industrial-park-3-area-table-1.png', title: 'Industrial Park 3 — Plot Area Schedule (Plots 1–39)' },
  table2: { src: '/images/metro-industrial-park-3-area-table-2.png', title: 'Industrial Park 3 — Plot Area Schedule (Plots 40–77)' },
};

// Hoisted tab configurations
const TABS = [
  { id: 'park',   code: 'MIP 01', label: 'Park 1 (MIP 1)', short: 'Park 1', subtitle: '63 Industrial Sheds' },
  { id: 'estate', code: 'MIP 02', label: 'Park 2 (MIP 2)', short: 'Park 2', subtitle: '23 Plotted Parcels'  },
  { id: 'park3',  code: 'MIP 03', label: 'Park 3 (MIP 3)', short: 'Park 3', subtitle: '77 Plotted Parcels'  },
];

// Hoisted dataset schema (aligned to canonical domain www.metrodevelopers.co.in)
const TABLE_DATASET_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dataset',
      '@id': 'https://www.metrodevelopers.co.in/site-map#schedule-dataset',
      name: 'Metro Industrial Park 1, 2 & 3 Official Area Details & Plot Schedule',
      alternateName: ['MIP Plot Schedule', 'Metro Developers Plot Area Table', 'MIP 1 2 3 Dimensions'],
      description:
        'Comprehensive engineering area schedules for Metro Industrial Park 1 (63 sheds in Moraiya), Metro Industrial Park 2 (23 plotted parcels in Moraiya), and Metro Industrial Park 3 (77 plotted parcels on Bavla-Rajoda Road), Ahmedabad, Gujarat.',
      creator: {
        '@type': 'RealEstateAgent',
        name: 'Metro Developers',
        url: 'https://www.metrodevelopers.co.in',
      },
      spatialCoverage: {
        '@type': 'Place',
        name: 'Ahmedabad Industrial Belt (Moraiya, Changodar, Bavla), Gujarat, India',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 22.9039,
          longitude: 72.4419,
        },
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.metrodevelopers.co.in/site-map#park2-plots-list',
      name: 'Metro Industrial Park 2 (MIP 2) - 23 Clear Title Plotted Parcels',
      numberOfItems: estatePlotsSchedule.length,
      itemListElement: estatePlotsSchedule.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `Plot #${p.plotNo} (Block ${p.section}) - Metro Industrial Park 2`,
        description: `Sub Plot Area: ${p.subPlotAreaSqYd.toFixed(2)} SQ.YD (${p.subPlotAreaSqMt.toFixed(2)} SQ.MT), Net Plot Area: ${p.netPlotAreaSqYd.toFixed(2)} SQ.YD (${p.netPlotAreaSqMt.toFixed(2)} SQ.MT), Total Plot Area: ${p.totalPlotAreaSqYd.toFixed(2)} SQ.YD (${p.totalPlotAreaSqMt.toFixed(2)} SQ.MT). Clear title industrial land in Moraiya, Ahmedabad by Metro Developers.`,
      })),
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.metrodevelopers.co.in/site-map#park3-plots-list',
      name: 'Metro Industrial Park 3 (MIP 3) - 77 Clear Title Plotted Parcels',
      numberOfItems: park3Plots.length,
      itemListElement: park3Plots.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `Plot #${p.id} - Metro Industrial Park 3`,
        description: `Carpet Area: ${p.carpetSqmt?.toFixed(2) || 'N/A'} SQ.MT, Total Area: ${p.totalSqmt?.toFixed(2) || 'N/A'} SQ.MT (${p.area} SQ.YD), Super Loading: ${p.superPct || '23.39%'}. Clear title industrial land on Bavla-Rajoda Road, Ahmedabad by Metro Developers.`,
      })),
    },
  ],
};

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  bgSubtle:  isDark ? 'bg-[#17171B]' : 'bg-[#EFECE6]',
  border:    isDark ? 'border-white/[0.1]' : 'border-black/[0.11]',
  divide:    isDark ? 'divide-white/[0.1]' : 'divide-black/[0.11]',
  textMain:  isDark ? 'text-[#F5F4F0]' : 'text-[#121214]',
  textBody:  isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]',
  textMuted: isDark ? 'text-[#6E6E77]' : 'text-[#73726C]',
});

/* ─── Technical Drawing Card ─── */
const DrawingCard = ({ src, alt, title, onOpen, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`border ${t.border} ${t.bgSurface}`}>
      <div className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]`}>
        <span className={t.textMuted}>{title}</span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline shrink-0"
        >
          <Maximize2 size={12} aria-hidden="true" />
          <span>Expand</span>
        </button>
      </div>
      <div className={`p-4 ${t.bgSubtle}`}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto cursor-zoom-in border ${t.border}`}
          onClick={onOpen}
          loading="lazy"
        />
      </div>
    </div>
  );
};

const SiteMapPage = () => {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDark    = theme === 'dark';
  const t         = getTokens(isDark);

  const [activeTab, setActiveTab]       = useState(location.state?.activeTab || 'park');
  const [viewMode, setViewMode]         = useState(location.state?.viewMode || 'map');
  const [mapDimension, setMapDimension] = useState(location.state?.mapDimension || '2d');

  const [park2Filter, setPark2Filter] = useState('ALL');
  const [park3Filter, setPark3Filter] = useState('ALL');
  const [unitMode, setUnitMode]       = useState('both'); // 'both' | 'yd' | 'mt'
  const [searchQuery, setSearchQuery] = useState('');

  const [viewerOpen, setViewerOpen]     = useState(false);
  const [viewerSlides, setViewerSlides] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabSwitch = (id) => {
    setActiveTab(id);
    setSearchQuery('');
  };

  const openViewer = useCallback((src, title) => {
    setViewerSlides([{ src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  const filteredPark2Plots = useMemo(() => {
    return estatePlotsSchedule.filter((p) => {
      if (park2Filter !== 'ALL' && p.section !== park2Filter) return false;
      if (searchQuery && !String(p.plotNo).includes(searchQuery.trim())) return false;
      return true;
    });
  }, [park2Filter, searchQuery]);

  const filteredPark3Plots = useMemo(() => {
    return park3Plots.filter((p) => {
      if (searchQuery && !p.id.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
      const ydNum = parseFloat(p.area.replace(/[^0-9.]/g, '')) || 0;
      if (park3Filter === 'SMALL') return ydNum < 500;
      if (park3Filter === 'MID')   return ydNum >= 500 && ydNum <= 1000;
      if (park3Filter === 'LARGE') return ydNum > 1000;
      return true;
    });
  }, [park3Filter, searchQuery]);

  const activeTabMeta = TABS.find((tab) => tab.id === activeTab);

  return (
    <>
      <SEO
        title="Interactive Site Map | Metro Industrial Parks (MIP 1, 2 & 3)"
        description="Check live industrial shed and plot availability across Metro Industrial Park 1 (MIP 1), Metro Industrial Park 2 (MIP 2), and Metro Industrial Park 3 (MIP 3) with our interactive site map and official area details schedule."
        canonical="/site-map"
        ogImage="/images/metro-industrial-map.jpg"
        ogImageAlt="Industrial shed and plot availability map in Moraiya Changodar Bavla Ahmedabad"
        structuredData={TABLE_DATASET_SCHEMA}
      />

      <h1 className="sr-only">
        Metro Developers — Industrial Park 1, 2 &amp; 3 (MIP 1, 2, 3) Interactive Site Maps &amp; Area Schedules
      </h1>

      <div
        className={`min-h-screen pt-16 pb-16 ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
        style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
      >
        {/* ════════ TOP ARCHITECTURAL CONTROL BAR ════════ */}
        <div className={`border-b ${t.border} ${t.bgSurface}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${t.textMuted} hover:text-brand-red transition-colors`}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Back</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {/* Park 1 2D / 3D Switcher */}
              {viewMode === 'map' && activeTab === 'park' && (
                <div className={`inline-grid grid-cols-2 border ${t.border} divide-x ${t.divide}`}>
                  <button
                    type="button"
                    onClick={() => setMapDimension('2d')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                      mapDimension === '2d'
                        ? 'bg-brand-red text-white'
                        : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                    }`}
                  >
                    <span>2D Map</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapDimension('3d')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                      mapDimension === '3d'
                        ? 'bg-brand-red text-white'
                        : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                    }`}
                  >
                    <Box size={12} aria-hidden="true" />
                    <span>3D View</span>
                  </button>
                </div>
              )}

              {/* Map / Area Table Mode Switcher */}
              <div className={`inline-grid grid-cols-2 border ${t.border} divide-x ${t.divide}`}>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                    viewMode === 'map'
                      ? 'bg-brand-red text-white'
                      : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                  }`}
                >
                  <span>Interactive Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                    viewMode === 'table'
                      ? 'bg-brand-red text-white'
                      : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                  }`}
                >
                  <Table size={12} aria-hidden="true" />
                  <span>Area Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
          {/* ── Editorial Title & 3-Park Switcher ── */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 pb-7 mb-7 border-b ${t.border} items-end`}>
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
                <span className="text-brand-red font-semibold">{activeTabMeta?.code}</span>
                <span className={`w-5 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                <span className={t.textMuted}>{activeTabMeta?.subtitle}</span>
              </div>
              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.06] ${t.textMain}`}>
                {viewMode === 'table' ? 'Area Details ' : 'Shed & Plot '}
                <span className="text-brand-red">
                  {viewMode === 'table' ? 'Schedule' : 'Availability'}
                </span>
              </h2>
              <p className={`text-xs sm:text-sm mt-2 ${t.textBody}`}>
                Industrial Park 1, 2 &amp; 3 · Moraiya, Changodar &amp; Bavla, Ahmedabad
              </p>
            </div>

            {/* Sharp 3-Park Tab Bar */}
            <div className="lg:col-span-6">
              <div className={`grid grid-cols-3 border ${t.border} divide-x ${t.divide} ${t.bgSurface}`}>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabSwitch(tab.id)}
                      className={`px-3 sm:px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-brand-red text-white'
                          : `${t.bgSurface} ${t.textMain} ${isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}`
                      }`}
                    >
                      <span className={`block font-mono text-[9px] uppercase tracking-[0.16em] ${isActive ? 'text-white/80' : 'text-brand-red'}`}>
                        {tab.code}
                      </span>
                      <span className="block text-xs sm:text-sm font-extrabold tracking-tight mt-0.5 truncate">
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.short}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ════════ MAIN VIEW CONTAINER (MAP OR AREA TABLE) ════════ */}
          {viewMode === 'map' ? (
            <>
              {/* Interactive Map / 3D Canvas Container */}
              <div className={`relative border ${t.border} ${t.bgSurface} min-h-[600px] overflow-hidden`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${activeTab === 'park' ? mapDimension : '2d'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="h-full w-full"
                  >
                    {activeTab === 'park' ? (
                      mapDimension === '3d' ? (
                        <Suspense
                          fallback={
                            <div className="flex flex-col items-center justify-center min-h-[600px] w-full gap-3">
                              <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
                              <p className={`font-mono text-xs uppercase tracking-[0.16em] ${t.textMuted}`}>
                                Loading 3D Architectural Model...
                              </p>
                            </div>
                          }
                        >
                          <Park1Model3D onSwitchTo2D={() => setMapDimension('2d')} />
                        </Suspense>
                      ) : (
                        <InteractiveSiteMap onSwitchTo3D={() => setMapDimension('3d')} />
                      )
                    ) : activeTab === 'estate' ? (
                      <MetroEstateInteractiveMap />
                    ) : (
                      <Park3InteractiveMap />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick Switch Strip to Area Table */}
              <div className={`relative mt-5 border ${t.border} ${t.bgSurface} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                <div className="pl-2">
                  <p className={`text-sm font-extrabold tracking-tight ${t.textMain}`}>
                    Need exact SQ.YD, SQ.MT measurements, or official engineering schedules?
                  </p>
                  <p className={`text-xs mt-0.5 ${t.textBody}`}>
                    Full dimensions ledger available for {activeTabMeta?.label}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="py-3 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
                >
                  <Table size={13} aria-hidden="true" />
                  <span>View Area Table</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            /* ════════ AREA TABLE VIEW ════════ */
            <motion.div
              key={`table-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="space-y-8"
            >
              {/* ── PARK 1: Sheds Area Details ── */}
              {activeTab === 'park' && (
                <div className="space-y-6">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`p-5 sm:p-6 border-b ${t.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red block mb-1.5">
                          Ready-to-Move Shed Inventory · MIP 01
                        </span>
                        <h3 className={`text-xl font-extrabold tracking-tight ${t.textMain}`}>
                          Industrial Park 1 — Unit Area Schedule
                        </h3>
                        <p className={`text-xs sm:text-sm mt-1 ${t.textBody}`}>
                          63 industrial sheds &amp; warehouse units across 54,000+ sq.yards in Moraiya, Changodar.
                        </p>
                      </div>

                      <Link
                        to="/metro-industrial-park"
                        className="py-3 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center gap-2 shrink-0 transition-colors self-start sm:self-auto"
                      >
                        <Factory size={14} aria-hidden="true" />
                        <span>Explore Park 1</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className={`grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Campus Area', value: '54,000 SQ.YD', sub: 'Moraiya Hub'      },
                        { label: 'Total Units', value: '63 Sheds',     sub: 'Ready Possession' },
                        { label: 'Size Range',  value: '4K–50K Sq.ft', sub: 'Customizable'     },
                        { label: 'Road Width',  value: '60 Ft RCC',    sub: 'Trailer Friendly' },
                      ].map((item) => (
                        <div key={item.label} className="p-4 sm:p-5">
                          <span className={`font-mono text-[10px] uppercase tracking-wider block ${t.textMuted}`}>
                            {item.label}
                          </span>
                          <span className={`text-sm sm:text-base font-extrabold tabular-nums block mt-1 ${t.textMain}`}>
                            {item.value}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${t.textMuted}`}>{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <DrawingCard
                      src={PARK1_IMAGES.table1.src}
                      alt="Industrial Park 1 Area Table 1"
                      title="Area Details Table 1 (Units 1–32)"
                      onOpen={() => openViewer(PARK1_IMAGES.table1.src, PARK1_IMAGES.table1.title)}
                      isDark={isDark}
                    />
                    <DrawingCard
                      src={PARK1_IMAGES.table2.src}
                      alt="Industrial Park 1 Area Table 2"
                      title="Area Details Table 2 (Units 33–63)"
                      onOpen={() => openViewer(PARK1_IMAGES.table2.src, PARK1_IMAGES.table2.title)}
                      isDark={isDark}
                    />
                  </div>
                </div>
              )}

              {/* ── PARK 2: 23 Industrial Plots Area Schedule ── */}
              {activeTab === 'estate' && (
                <div className="space-y-6">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    {/* Toolbar Header */}
                    <div className={`p-5 sm:p-6 border-b ${t.border} flex flex-col lg:flex-row lg:items-end justify-between gap-4`}>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                          <span className="text-brand-red font-bold">MIP 02 · Build Your Own Shed</span>
                          <span className={t.textMuted}>/</span>
                          <span className={t.textMuted}>23 Clear-Title Plots</span>
                        </div>
                        <h3 className={`text-xl font-extrabold tracking-tight ${t.textMain}`}>
                          Industrial Park 2 — Engineering Area Schedule
                        </h3>
                        <p className={`text-xs mt-1 ${t.textBody}`}>
                          Sub Plot Area, Extra Land CP, Net Plot Area, Road Area, and Total SQ.YD / SQ.MT calculations.
                        </p>
                      </div>

                      {/* Controls: Block Filter + Unit Switcher + Search */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`inline-flex border ${t.border} divide-x ${t.divide}`}>
                          {['ALL', 'A', 'B', 'C'].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setPark2Filter(sec)}
                              className={`px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                                park2Filter === sec
                                  ? 'bg-brand-red text-white'
                                  : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {sec === 'ALL' ? 'All' : `Blk ${sec}`}
                            </button>
                          ))}
                        </div>

                        <div className={`inline-flex border ${t.border} divide-x ${t.divide}`}>
                          {[
                            { id: 'both', label: 'Both'  },
                            { id: 'yd',   label: 'SQ.YD' },
                            { id: 'mt',   label: 'SQ.MT' },
                          ].map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setUnitMode(u.id)}
                              className={`px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                                unitMode === u.id
                                  ? 'bg-brand-red text-white'
                                  : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <Search size={12} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} aria-hidden="true" />
                          <input
                            type="text"
                            placeholder="Plot #..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filter Park 2 by plot number"
                            className={`pl-8 pr-3 py-1.5 border ${t.border} ${t.bgPage} ${t.textMain} font-mono text-xs focus:outline-none focus:border-brand-red w-28`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto max-h-[540px]">
                      <table
                        className="w-full text-left text-xs tabular-nums border-collapse"
                        aria-label="Official Industrial Park 2 (MIP 2) Engineering Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 2 (MIP 2) located in Moraiya, Changodar, Ahmedabad by Metro Developers. 23 clear-title industrial plotted parcels with Sub Plot Area, Extra Land Common Plot (CP), Net Plotted Area, Road Area, and Total Plot Area in Square Meters (SQ.MT) and Square Yards (SQ.YD / Gaj).
                        </caption>
                        <thead className={`font-mono text-[10px] uppercase tracking-[0.12em] border-b ${t.border} sticky top-0 z-10 ${t.bgPage}`}>
                          <tr>
                            <th scope="col" className={`py-3 px-4 whitespace-nowrap ${t.textMuted}`}>Plot #</th>
                            <th scope="col" className={`py-3 px-3 whitespace-nowrap ${t.textMuted}`}>Block</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Sub Plot (SQ.MT)</th>
                            )}
                            <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Extra CP (SQ.MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Net Plot (SQ.MT)</th>
                            )}
                            <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Road (SQ.MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Total (SQ.MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Sub Plot (SQ.YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Net Plot (SQ.YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-3 px-4 text-right text-brand-red font-bold whitespace-nowrap">Total (SQ.YD)</th>
                            )}
                            <th scope="col" className={`py-3 px-3 text-center whitespace-nowrap ${t.textMuted}`}>Enquire</th>
                          </tr>
                        </thead>

                        <tbody className={`divide-y ${t.divide}`}>
                          {filteredPark2Plots.length === 0 ? (
                            <tr>
                              <td colSpan={11} className={`py-10 text-center font-mono text-xs uppercase tracking-wider ${t.textMuted}`}>
                                No matching plots found for “{searchQuery}”
                              </td>
                            </tr>
                          ) : (
                            filteredPark2Plots.map((plot) => (
                              <tr
                                key={plot.plotNo}
                                className={`transition-colors ${isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}`}
                              >
                                <td className="py-3 px-4 font-mono font-bold text-brand-red whitespace-nowrap">
                                  Plot #{plot.plotNo}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${t.border} ${t.bgPage} ${t.textMain}`}>
                                    Block {plot.section}
                                  </span>
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-3 px-3 text-right font-mono ${t.textMain} whitespace-nowrap`}>
                                    {plot.subPlotAreaSqMt.toFixed(2)}
                                  </td>
                                )}
                                <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                                  {plot.extraLandCpSqMt ? (
                                    <span className="font-semibold text-amber-500">
                                      {plot.extraLandCpSqMt.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className={t.textMuted}>—</span>
                                  )}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-3 px-3 text-right font-mono ${t.textMain} whitespace-nowrap`}>
                                    {plot.netPlotAreaSqMt.toFixed(2)}
                                  </td>
                                )}
                                <td className={`py-3 px-3 text-right font-mono ${t.textBody} whitespace-nowrap`}>
                                  {plot.roadAreaSqMt.toFixed(2)}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-3 px-3 text-right font-mono font-bold ${t.textMain} whitespace-nowrap`}>
                                    {plot.totalPlotAreaSqMt.toFixed(2)}
                                  </td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className={`py-3 px-3 text-right font-mono ${t.textMain} whitespace-nowrap`}>
                                    {plot.subPlotAreaSqYd.toFixed(2)}
                                  </td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className={`py-3 px-3 text-right font-mono ${t.textMain} whitespace-nowrap`}>
                                    {plot.netPlotAreaSqYd.toFixed(2)}
                                  </td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className="py-3 px-4 text-right font-mono font-bold text-brand-red whitespace-nowrap">
                                    {plot.totalPlotAreaSqYd.toFixed(2)}
                                  </td>
                                )}
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                  <a
                                    href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.plotNo} (${plot.totalPlotAreaSqYd.toFixed(2)} sq.yds / ${plot.totalPlotAreaSqMt.toFixed(2)} sq.mtr) in Industrial Park 2.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Inquire about Plot #${plot.plotNo}`}
                                    aria-label={`WhatsApp inquiry for Plot ${plot.plotNo}`}
                                    className={`inline-flex items-center justify-center w-7 h-7 border ${t.border} text-emerald-600 hover:border-emerald-600 transition-colors`}
                                  >
                                    <FaWhatsapp size={13} aria-hidden="true" />
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>

                        <tfoot className={`border-t-2 border-brand-red/60 font-mono text-xs font-bold ${t.bgPage}`}>
                          <tr>
                            <td className="py-3.5 px-4 text-brand-red whitespace-nowrap" colSpan={2}>
                              TOTAL (23 PLOTS)
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className={`py-3.5 px-3 text-right whitespace-nowrap ${t.textMain}`}>
                                {estateTotalStats.subPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className="py-3.5 px-3 text-right text-amber-500 whitespace-nowrap">
                              {estateTotalStats.extraLandCpSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className={`py-3.5 px-3 text-right whitespace-nowrap ${t.textMain}`}>
                                {estateTotalStats.netPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className={`py-3.5 px-3 text-right whitespace-nowrap ${t.textBody}`}>
                              {estateTotalStats.roadAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className="py-3.5 px-3 text-right text-brand-red whitespace-nowrap">
                                {estateTotalStats.totalPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className={`py-3.5 px-3 text-right whitespace-nowrap ${t.textMain}`}>
                                {estateTotalStats.subPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className={`py-3.5 px-3 text-right whitespace-nowrap ${t.textMain}`}>
                                {estateTotalStats.netPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className="py-3.5 px-4 text-right text-brand-red whitespace-nowrap">
                                {estateTotalStats.totalPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className={`py-3.5 px-3 text-center text-[10px] whitespace-nowrap ${t.textMuted}`}>
                              23 UNITS
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Campus Area Summary Strip */}
                    <div className={`border-t ${t.border} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Total Campus Area',   value: '17,545.33 SQ.YD', sub: '14,670.01 SQ.MT', accent: true  },
                        { label: 'Net Plotted Area',    value: '13,319.64 SQ.YD', sub: '11,136.82 SQ.MT', accent: false },
                        { label: 'Dedicated Road Area', value: '3,533.19 SQ.MT',  sub: 'Wide Heavy RCC',  accent: false },
                        { label: 'Extra Land CP Area',  value: '1,281.32 SQ.MT',  sub: 'Plots 1, 2, 9, 10', accent: false },
                      ].map((s) => (
                        <div key={s.label} className="p-4 sm:p-5">
                          <span className={`font-mono text-[10px] uppercase tracking-wider block ${t.textMuted}`}>{s.label}</span>
                          <span className={`text-sm sm:text-base font-extrabold tabular-nums block mt-1 ${s.accent ? 'text-brand-red' : t.textMain}`}>
                            {s.value}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${t.textMuted}`}>{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DrawingCard
                    src={PARK2_IMAGES.table.src}
                    alt="Industrial Park 2 Area Table"
                    title="Official Approved Architectural Plot Schedule (MIP 2)"
                    onOpen={() => openViewer(PARK2_IMAGES.table.src, PARK2_IMAGES.table.title)}
                    isDark={isDark}
                  />
                </div>
              )}

              {/* ── PARK 3: 77 Industrial Plots Area Schedule ── */}
              {activeTab === 'park3' && (
                <div className="space-y-6">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    {/* Toolbar Header */}
                    <div className={`p-5 sm:p-6 border-b ${t.border} flex flex-col lg:flex-row lg:items-end justify-between gap-4`}>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                          <span className="text-brand-red font-bold">MIP 03 · Bavla – Rajoda Road</span>
                          <span className={t.textMuted}>/</span>
                          <span className="inline-flex items-center gap-1.5 text-amber-500 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                            77 Parcels · Bookings Open
                          </span>
                        </div>
                        <h3 className={`text-xl font-extrabold tracking-tight ${t.textMain}`}>
                          Industrial Park 3 — Official 77 Plot Area Schedule
                        </h3>
                        <p className={`text-xs mt-1 ${t.textBody}`}>
                          Carpet SQ.MT, 23.39% super area loading, and total plot dimensions.
                        </p>
                      </div>

                      {/* Controls: Size Filter + Unit Switcher + Search */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`inline-flex border ${t.border} divide-x ${t.divide}`}>
                          {[
                            { id: 'ALL',   label: 'All 77'   },
                            { id: 'SMALL', label: '< 500'    },
                            { id: 'MID',   label: '500–1000' },
                            { id: 'LARGE', label: '1000+'    },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setPark3Filter(f.id)}
                              className={`px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                                park3Filter === f.id
                                  ? 'bg-brand-red text-white'
                                  : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        <div className={`inline-flex border ${t.border} divide-x ${t.divide}`}>
                          {[
                            { id: 'both', label: 'Both'  },
                            { id: 'yd',   label: 'SQ.YD' },
                            { id: 'mt',   label: 'SQ.MT' },
                          ].map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setUnitMode(u.id)}
                              className={`px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                                unitMode === u.id
                                  ? 'bg-brand-red text-white'
                                  : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <Search size={12} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} aria-hidden="true" />
                          <input
                            type="text"
                            placeholder="Plot #..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filter Park 3 by plot number"
                            className={`pl-8 pr-3 py-1.5 border ${t.border} ${t.bgPage} ${t.textMain} font-mono text-xs focus:outline-none focus:border-brand-red w-28`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto max-h-[540px]">
                      <table
                        className="w-full text-left text-xs tabular-nums border-collapse"
                        aria-label="Official Industrial Park 3 (MIP 3) Engineering Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 3 (MIP 3) located on Bavla-Rajoda Road, Ahmedabad by Metro Developers. 77 clear-title plotted industrial parcels with Carpet Area in SQ.MT, 23.39% super loading, and Total Plot Area in Square Meters and Square Yards.
                        </caption>
                        <thead className={`font-mono text-[10px] uppercase tracking-[0.12em] border-b ${t.border} sticky top-0 z-10 ${t.bgPage}`}>
                          <tr>
                            <th scope="col" className={`py-3 px-4 whitespace-nowrap ${t.textMuted}`}>Plot #</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Carpet (SQ.MT)</th>
                            )}
                            <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Super Loading</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-3 px-3 text-right whitespace-nowrap ${t.textMuted}`}>Total (SQ.MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-3 px-4 text-right text-brand-red font-bold whitespace-nowrap">Total (SQ.YD)</th>
                            )}
                            <th scope="col" className={`py-3 px-3 text-center whitespace-nowrap ${t.textMuted}`}>Status</th>
                            <th scope="col" className={`py-3 px-3 text-center whitespace-nowrap ${t.textMuted}`}>Enquire</th>
                          </tr>
                        </thead>

                        <tbody className={`divide-y ${t.divide}`}>
                          {filteredPark3Plots.length === 0 ? (
                            <tr>
                              <td colSpan={7} className={`py-10 text-center font-mono text-xs uppercase tracking-wider ${t.textMuted}`}>
                                No matching plots found for “{searchQuery}”
                              </td>
                            </tr>
                          ) : (
                            filteredPark3Plots.map((plot) => (
                              <tr
                                key={plot.id}
                                className={`transition-colors ${isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}`}
                              >
                                <td className="py-3 px-4 font-mono font-bold text-brand-red whitespace-nowrap">
                                  Plot #{plot.id}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-3 px-3 text-right font-mono ${t.textMain} whitespace-nowrap`}>
                                    {plot.carpetSqmt?.toFixed(2)}
                                  </td>
                                )}
                                <td className={`py-3 px-3 text-right font-mono ${t.textBody} whitespace-nowrap`}>
                                  {plot.superPct || '23.39%'}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-3 px-3 text-right font-mono font-bold ${t.textMain} whitespace-nowrap`}>
                                    {plot.totalSqmt?.toFixed(2)}
                                  </td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className="py-3 px-4 text-right font-mono font-bold text-brand-red whitespace-nowrap">
                                    {plot.area}
                                  </td>
                                )}
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${t.border} ${t.bgPage} ${t.textMain}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                    Open
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                  <a
                                    href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.id} (${plot.area} / ${plot.totalSqmt?.toFixed(2)} sq.mtr) in Industrial Park 3.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Inquire about Plot #${plot.id}`}
                                    aria-label={`WhatsApp inquiry for Plot ${plot.id}`}
                                    className={`inline-flex items-center justify-center w-7 h-7 border ${t.border} text-emerald-600 hover:border-emerald-600 transition-colors`}
                                  >
                                    <FaWhatsapp size={13} aria-hidden="true" />
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Campus Area Summary Strip */}
                    <div className={`border-t ${t.border} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Total Campus Area', value: '59,508 SQ.YD',  sub: '~12.3 Acres',      accent: true  },
                        { label: 'Total Parcels',     value: '77 Plots',      sub: '300 to 2,876 YD',  accent: false },
                        { label: 'Road Network',      value: '18m & 12m Wide',sub: 'Heavy RCC Spine',  accent: false },
                        { label: 'Common Plot',       value: '851.31 SQ.MT',  sub: '1,018 SQ.YD',      accent: false },
                      ].map((s) => (
                        <div key={s.label} className="p-4 sm:p-5">
                          <span className={`font-mono text-[10px] uppercase tracking-wider block ${t.textMuted}`}>{s.label}</span>
                          <span className={`text-sm sm:text-base font-extrabold tabular-nums block mt-1 ${s.accent ? 'text-brand-red' : t.textMain}`}>
                            {s.value}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${t.textMuted}`}>{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <DrawingCard
                      src={PARK3_IMAGES.table1.src}
                      alt="Industrial Park 3 Area Table 1"
                      title="Schedule Table 1 (Plots 1–39)"
                      onOpen={() => openViewer(PARK3_IMAGES.table1.src, PARK3_IMAGES.table1.title)}
                      isDark={isDark}
                    />
                    <DrawingCard
                      src={PARK3_IMAGES.table2.src}
                      alt="Industrial Park 3 Area Table 2"
                      title="Schedule Table 2 (Plots 40–77)"
                      onOpen={() => openViewer(PARK3_IMAGES.table2.src, PARK3_IMAGES.table2.title)}
                      isDark={isDark}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <p className={`font-mono text-[11px] uppercase tracking-[0.12em] text-center mt-8 ${t.textMuted}`}>
            {viewMode === 'map'
              ? 'Use zoom controls inside the map · Click any shed or plot for live status & dimensions'
              : 'Click any engineering drawing to inspect full resolution · Filter or search plots above'}
          </p>
        </div>

        {/* ════════ LIGHTBOX VIEWER ════════ */}
        <Lightbox
          open={viewerOpen}
          close={() => setViewerOpen(false)}
          slides={viewerSlides}
          plugins={[Zoom]}
          zoom={{ maxZoomPixelRatio: 5, scrollToZoom: true }}
        />
      </div>
    </>
  );
};

export default SiteMapPage;