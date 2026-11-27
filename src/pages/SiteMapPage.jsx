// src/pages/SiteMapPage.jsx
import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useNavbar } from '../context/useNavbar';
import {
  ArrowLeft, Map, Table, Search, Maximize2,
  ExternalLink, Factory, Box,
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
import ParkDirectionsDropdown from '../components/Layout/ParkDirectionsDropdown';
import SEO from '../components/SEO/SEO';
import { estatePlotsSchedule, estateTotalStats } from '../data/estatePlotCoordinates';
import { park3Plots } from '../data/park3PlotsData';

const EASE = [0.16, 1, 0.3, 1];

const PARK1_IMAGES = {
  table1: { src: '/images/metro-industrial-park-area-details-table-1.jpg', title: 'Park 1 — Units 1–32' },
  table2: { src: '/images/metro-industrial-park-area-details-table-2.jpg', title: 'Park 1 — Units 33–63' },
};

const PARK2_IMAGES = {
  table: { src: '/images/metro-industrial-park-2-area-table.png', title: 'Park 2 — 23 Plots Drawing' },
};

const PARK3_IMAGES = {
  table1: { src: '/images/metro-industrial-park-3-area-table-1.png', title: 'Park 3 — Plots 1–39' },
  table2: { src: '/images/metro-industrial-park-3-area-table-2.png', title: 'Park 3 — Plots 40–77' },
};

const TABS = [
  { id: 'park',   code: 'MIP 01', short: 'Park 1', count: '63', loc: 'Moraiya', area: '54K SQ.YD'   },
  { id: 'estate', code: 'MIP 02', short: 'Park 2', count: '23', loc: 'Moraiya', area: '17.5K SQ.YD' },
  { id: 'park3',  code: 'MIP 03', short: 'Park 3', count: '77', loc: 'Bavla',   area: '59.5K SQ.YD' },
];

const TABLE_DATASET_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dataset',
      '@id': 'https://www.metrodevelopers.co.in/site-map#schedule-dataset',
      name: 'Metro Industrial Park 1, 2 & 3 Official Area Details & Plot Schedule',
      alternateName: ['MIP Plot Schedule', 'Metro Developers Plot Area Table', 'MIP 1 2 3 Dimensions'],
      description:
        'Engineering area schedules for Metro Industrial Park 1 (63 sheds, Moraiya), Metro Industrial Park 2 (23 plots, Moraiya), and Metro Industrial Park 3 (77 plots, Bavla), Ahmedabad.',
      creator: {
        '@type': 'RealEstateAgent',
        name: 'Metro Developers',
        url: 'https://www.metrodevelopers.co.in',
      },
      spatialCoverage: {
        '@type': 'Place',
        name: 'Ahmedabad Industrial Belt (Moraiya, Changodar, Bavla), Gujarat, India',
        geo: { '@type': 'GeoCoordinates', latitude: 22.9039, longitude: 72.4419 },
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.metrodevelopers.co.in/site-map#park2-plots-list',
      name: 'Metro Industrial Park 2 (MIP 2) - 23 Plotted Parcels',
      numberOfItems: estatePlotsSchedule.length,
      itemListElement: estatePlotsSchedule.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `Plot #${p.plotNo} (Block ${p.section}) - Metro Industrial Park 2`,
        description: `Sub Plot Area: ${p.subPlotAreaSqYd.toFixed(2)} SQ.YD (${p.subPlotAreaSqMt.toFixed(2)} SQ.MT), Net Plot Area: ${p.netPlotAreaSqYd.toFixed(2)} SQ.YD (${p.netPlotAreaSqMt.toFixed(2)} SQ.MT), Total Plot Area: ${p.totalPlotAreaSqYd.toFixed(2)} SQ.YD (${p.totalPlotAreaSqMt.toFixed(2)} SQ.MT).`,
      })),
    },
    {
      '@type': 'ItemList',
      '@id': 'https://www.metrodevelopers.co.in/site-map#park3-plots-list',
      name: 'Metro Industrial Park 3 (MIP 3) - 77 Plotted Parcels',
      numberOfItems: park3Plots.length,
      itemListElement: park3Plots.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `Plot #${p.id} - Metro Industrial Park 3`,
        description: `Carpet Area: ${p.carpetSqmt?.toFixed(2) || 'N/A'} SQ.MT, Total Area: ${p.totalSqmt?.toFixed(2) || 'N/A'} SQ.MT (${p.area} SQ.YD), Super Loading: ${p.superPct || '23.39%'}.`,
      })),
    },
  ],
};

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  bgSubtle:  isDark ? 'bg-[#18181C]' : 'bg-[#F1F3F5]',
  border:    isDark ? 'border-white/[0.12]' : 'border-gray-200',
  divide:    isDark ? 'divide-white/[0.12]' : 'divide-gray-200',
  textMain:  isDark ? 'text-white' : 'text-gray-900',
  textBody:  isDark ? 'text-gray-200' : 'text-gray-700',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
});

const DrawingCard = ({ src, alt, title, onOpen, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`border ${t.border} ${t.bgSurface}`}>
      <div className={`flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em]`}>
        <span className={`truncate ${t.textMuted}`}>{title}</span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1 text-brand-red font-bold hover:underline shrink-0"
        >
          <Maximize2 size={11} aria-hidden="true" />
          <span>Expand</span>
        </button>
      </div>
      <div className={`p-2 sm:p-3 ${t.bgSubtle}`}>
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
  const { isNavbarVisible } = useNavbar();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDark    = theme === 'dark';
  const t         = getTokens(isDark);

  const [activeTab, setActiveTab]       = useState(location.state?.activeTab || 'park');
  const [viewMode, setViewMode]         = useState(location.state?.viewMode || 'map');
  const [mapDimension, setMapDimension] = useState(location.state?.mapDimension || '3d');

  const [park2Filter, setPark2Filter] = useState('ALL');
  const [park3Filter, setPark3Filter] = useState('ALL');
  const [unitMode, setUnitMode]       = useState('both');
  const [searchQuery, setSearchQuery] = useState('');

  const [viewerOpen, setViewerOpen]         = useState(false);
  const [viewerSlides, setViewerSlides]     = useState([]);
  const [directionsOpen, setDirectionsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabSwitch = (id) => {
    setActiveTab(id);
    setSearchQuery('');
    setDirectionsOpen(false);
  };

  const openViewer = useCallback((src, title) => {
    setViewerSlides([{ src, title }]);
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

  // Unified compact mode switcher: [3D | 2D | Table] on Park 1, [2D Map | Table] on Park 2 & 3
  const modePills = activeTab === 'park'
    ? [
        { id: '3d',    label: '3D',    icon: Box,   active: viewMode === 'map' && mapDimension === '3d', onClick: () => { setViewMode('map'); setMapDimension('3d'); } },
        { id: '2d',    label: '2D',    icon: Map,   active: viewMode === 'map' && mapDimension === '2d', onClick: () => { setViewMode('map'); setMapDimension('2d'); } },
        { id: 'table', label: 'Table', icon: Table, active: viewMode === 'table',                        onClick: () => setViewMode('table') },
      ]
    : [
        { id: 'map',   label: '2D Map', icon: Map,   active: viewMode === 'map',   onClick: () => setViewMode('map') },
        { id: 'table', label: 'Table',  icon: Table, active: viewMode === 'table', onClick: () => setViewMode('table') },
      ];

  return (
    <>
      <SEO
        title="Interactive Site Map | Metro Industrial Parks (MIP 1, 2 & 3)"
        description="Live shed and plot availability across Metro Industrial Park 1 (63 sheds), Park 2 (23 plots), and Park 3 (77 plots) with official SQ.YD and SQ.MT schedules."
        canonical="/site-map"
        ogImage="/images/metro-industrial-map.jpg"
        ogImageAlt="Industrial shed and plot availability map in Moraiya Changodar Bavla Ahmedabad"
        structuredData={TABLE_DATASET_SCHEMA}
      />

      <h1 className="sr-only">
        Metro Developers — Industrial Park 1, 2 &amp; 3 Interactive Site Maps &amp; Area Schedules
      </h1>

      <div
        style={{ paddingTop: 'var(--navbar-height, 79px)' }}
        className={`min-h-screen pb-24 lg:pb-10 ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ════════ COMPACT SINGLE-LINE WORKSPACE TAB & MODE BAR ════════ */}
        <div
          id="sitemap-workspace-tabs"
          style={{
            top: 'var(--navbar-height, 79px)',
            transform: isNavbarVisible
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(0, calc(var(--navbar-height, 79px) * -1), 0)',
          }}
          className={`sticky z-30 border-b ${t.border} ${
            isDark ? 'bg-[#121215]/95' : 'bg-white/95'
          } backdrop-blur-md transition-transform duration-300 ease-out will-change-transform`}
        >
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4">
            {/* Row 1 (Single Line): Back + Compact Single-Line Park Selector */}
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className={`h-8 w-8 sm:w-auto sm:px-2.5 border ${t.border} ${t.bgPage} ${t.textMuted} hover:text-brand-red inline-flex items-center justify-center gap-1 font-mono text-[10.5px] font-bold uppercase shrink-0 transition-colors`}
              >
                <ArrowLeft size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div
                role="tablist"
                aria-label="Industrial Parks"
                className={`flex-1 md:flex-none grid grid-cols-3 border ${t.border} divide-x ${t.divide} ${t.bgPage}`}
              >
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => handleTabSwitch(tab.id)}
                      className={`h-8 px-1.5 sm:px-3 inline-flex items-center justify-center gap-1 font-mono text-[11px] font-bold whitespace-nowrap transition-colors min-w-0 ${
                        isActive
                          ? 'bg-brand-red text-white'
                          : `${t.textMain} ${isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100'}`
                      }`}
                    >
                      <span className="truncate">{tab.short}</span>
                      <span className={`text-[9.5px] tabular-nums ${isActive ? 'text-white/80' : t.textMuted}`}>
                        ({tab.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2 on Mobile / Right Side on Desktop (Single Line): Datum + Directions + Mode Segmented Pills */}
            <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider min-w-0">
                  <span className="text-brand-red font-bold shrink-0">{activeTabMeta?.code}</span>
                  <span className={`hidden sm:inline ${t.textMuted} whitespace-nowrap`}>
                    · {activeTabMeta?.loc} · {activeTabMeta?.area}
                  </span>
                </div>

                <ParkDirectionsDropdown
                  isDark={isDark}
                  compact
                  align="left-sm-right-md"
                  activeParkId={activeTab}
                  open={directionsOpen}
                  onOpenChange={setDirectionsOpen}
                />
              </div>

              <div className={`inline-flex border ${t.border} divide-x ${t.divide} ${t.bgPage} shrink-0`}>
                {modePills.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={pill.onClick}
                      className={`h-7 sm:h-8 px-2.5 sm:px-3 inline-flex items-center justify-center gap-1 font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                        pill.active
                          ? 'bg-brand-red text-white'
                          : `${t.textBody} hover:text-brand-red`
                      }`}
                    >
                      <Icon size={11} aria-hidden="true" />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ════════ PRIMARY DATA CONTENT (MAP OR SCHEDULE) ════════ */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 sm:pt-5">
          {viewMode === 'map' ? (
            <div className={`relative border ${t.border} ${t.bgSurface} overflow-hidden`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${mapDimension}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="w-full"
                >
                  {activeTab === 'park' ? (
                    mapDimension === '3d' ? (
                      <Suspense
                        fallback={
                          <div className="flex items-center justify-center h-[56svh] min-h-[380px] gap-2.5">
                            <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
                            <span className={`font-mono text-[11px] uppercase tracking-wider ${t.textMuted}`}>
                              Loading 3D Model...
                            </span>
                          </div>
                        }
                      >
                        <Park1Model3D />
                      </Suspense>
                    ) : (
                      <InteractiveSiteMap />
                    )
                  ) : activeTab === 'estate' ? (
                    <MetroEstateInteractiveMap />
                  ) : (
                    <Park3InteractiveMap />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* ════════ DATA-FIRST AREA TABLE VIEW ════════ */
            <motion.div
              key={`table-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="space-y-4 sm:space-y-6"
            >
              {/* ── PARK 1: 63 Sheds Summary + Engineering Drawings ── */}
              {activeTab === 'park' && (
                <div className="space-y-4">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`px-3.5 sm:px-5 py-3 border-b ${t.border} flex items-center justify-between gap-2`}>
                      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-brand-red">MIP 01</span>
                        <span className={t.textMain}>· 63 Sheds Schedule</span>
                      </div>
                      <Link
                        to="/metro-industrial-park"
                        className="h-7 px-2.5 bg-brand-red hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <Factory size={11} aria-hidden="true" />
                        <span>Park 1</span>
                        <ExternalLink size={10} aria-hidden="true" />
                      </Link>
                    </div>

                    <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Campus Area', value: '54,000 SQ.YD', sub: 'Moraiya'          },
                        { label: 'Inventory',   value: '63 Sheds',     sub: 'Ready Possession' },
                        { label: 'Unit Sizing', value: '4K–50K SQ.FT', sub: 'Modular PEB/RCC'  },
                        { label: 'Road Width',  value: '60 FT RCC',    sub: 'Multi-Axle'       },
                      ].map((item) => (
                        <div key={item.label} className="p-3 sm:p-4">
                          <span className={`font-mono text-[9.5px] uppercase tracking-wider block ${t.textMuted}`}>{item.label}</span>
                          <span className={`text-sm sm:text-base font-bold tabular-nums block mt-0.5 ${t.textMain}`}>{item.value}</span>
                          <span className={`text-[10.5px] block ${t.textMuted}`}>{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <DrawingCard
                      src={PARK1_IMAGES.table1.src}
                      alt="Industrial Park 1 Area Table 1"
                      title="Table 1 · Units 1–32"
                      onOpen={() => openViewer(PARK1_IMAGES.table1.src, PARK1_IMAGES.table1.title)}
                      isDark={isDark}
                    />
                    <DrawingCard
                      src={PARK1_IMAGES.table2.src}
                      alt="Industrial Park 1 Area Table 2"
                      title="Table 2 · Units 33–63"
                      onOpen={() => openViewer(PARK1_IMAGES.table2.src, PARK1_IMAGES.table2.title)}
                      isDark={isDark}
                    />
                  </div>
                </div>
              )}

              {/* ── PARK 2: 23 Plots Engineering Schedule ── */}
              {activeTab === 'estate' && (
                <div className="space-y-4">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    {/* Single-Row Scrollable Controls Header */}
                    <div className={`px-3 sm:px-4 py-2.5 border-b ${t.border} flex flex-wrap items-center justify-between gap-2`}>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-brand-red">MIP 02</span>
                        <span className={t.textMain}>· 23 Plots Data</span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none">
                        <div className={`inline-flex border ${t.border} divide-x ${t.divide} shrink-0`}>
                          {['ALL', 'A', 'B', 'C'].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setPark2Filter(sec)}
                              className={`h-7 px-2 font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
                                park2Filter === sec ? 'bg-brand-red text-white' : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {sec === 'ALL' ? 'All' : `Blk ${sec}`}
                            </button>
                          ))}
                        </div>

                        <div className={`inline-flex border ${t.border} divide-x ${t.divide} shrink-0`}>
                          {[
                            { id: 'both', label: 'All' },
                            { id: 'yd',   label: 'YD'  },
                            { id: 'mt',   label: 'MT'  },
                          ].map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setUnitMode(u.id)}
                              className={`h-7 px-2 font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
                                unitMode === u.id ? 'bg-brand-red text-white' : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative shrink-0">
                          <Search size={11} className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} aria-hidden="true" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="#..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filter Park 2 by plot number"
                            className={`h-7 pl-6 pr-2 border ${t.border} ${t.bgPage} ${t.textMain} font-mono text-[11px] focus:outline-none focus:border-brand-red w-16 sm:w-24`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dense Data Table with Sticky First Column */}
                    <div className="overflow-x-auto max-h-[58vh]">
                      <table
                        className="w-full text-left text-[11px] sm:text-xs tabular-nums border-collapse"
                        aria-label="Official Industrial Park 2 (MIP 2) Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 2 (23 plots in Square Meters and Square Yards).
                        </caption>
                        <thead className={`font-mono text-[10px] uppercase tracking-[0.1em] border-b ${t.border} sticky top-0 z-20 ${t.bgPage}`}>
                          <tr>
                            <th scope="col" className={`sticky left-0 z-30 py-2.5 px-3 whitespace-nowrap border-r ${t.border} ${t.bgPage} ${t.textMuted}`}>Plot</th>
                            <th scope="col" className={`py-2.5 px-2.5 whitespace-nowrap ${t.textMuted}`}>Blk</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Sub (MT)</th>
                            )}
                            <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>CP (MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Net (MT)</th>
                            )}
                            <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Road (MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Total (MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Sub (YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Net (YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-3 text-right text-brand-red font-bold whitespace-nowrap">Total (YD)</th>
                            )}
                            <th scope="col" className={`py-2.5 px-2.5 text-center whitespace-nowrap ${t.textMuted}`}>WA</th>
                          </tr>
                        </thead>

                        <tbody className={`divide-y ${t.divide}`}>
                          {filteredPark2Plots.length === 0 ? (
                            <tr>
                              <td colSpan={11} className={`py-8 text-center font-mono text-xs ${t.textMuted}`}>
                                No match for “{searchQuery}”
                              </td>
                            </tr>
                          ) : (
                            filteredPark2Plots.map((plot) => (
                              <tr key={plot.plotNo} className={isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}>
                                <td className={`sticky left-0 z-10 py-2.5 px-3 font-mono font-bold text-brand-red whitespace-nowrap border-r ${t.border} ${t.bgSurface}`}>
                                  #{plot.plotNo}
                                </td>
                                <td className={`py-2.5 px-2.5 font-mono font-bold whitespace-nowrap ${t.textMain}`}>{plot.section}</td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono ${t.textMain} whitespace-nowrap`}>{plot.subPlotAreaSqMt.toFixed(2)}</td>
                                )}
                                <td className="py-2.5 px-2.5 text-right font-mono whitespace-nowrap">
                                  {plot.extraLandCpSqMt ? (
                                    <span className="font-semibold text-amber-500">{plot.extraLandCpSqMt.toFixed(2)}</span>
                                  ) : (
                                    <span className={t.textMuted}>—</span>
                                  )}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono ${t.textMain} whitespace-nowrap`}>{plot.netPlotAreaSqMt.toFixed(2)}</td>
                                )}
                                <td className={`py-2.5 px-2.5 text-right font-mono ${t.textBody} whitespace-nowrap`}>{plot.roadAreaSqMt.toFixed(2)}</td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono font-bold ${t.textMain} whitespace-nowrap`}>{plot.totalPlotAreaSqMt.toFixed(2)}</td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono ${t.textMain} whitespace-nowrap`}>{plot.subPlotAreaSqYd.toFixed(2)}</td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono ${t.textMain} whitespace-nowrap`}>{plot.netPlotAreaSqYd.toFixed(2)}</td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-red whitespace-nowrap">{plot.totalPlotAreaSqYd.toFixed(2)}</td>
                                )}
                                <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                                  <a
                                    href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.plotNo} (${plot.totalPlotAreaSqYd.toFixed(2)} sq.yds / ${plot.totalPlotAreaSqMt.toFixed(2)} sq.mtr) in Industrial Park 2.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`WhatsApp inquiry for Plot ${plot.plotNo}`}
                                    className={`inline-flex items-center justify-center w-6 h-6 border ${t.border} text-emerald-600 hover:border-emerald-600 transition-colors`}
                                  >
                                    <FaWhatsapp size={12} aria-hidden="true" />
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>

                        <tfoot className={`border-t-2 border-brand-red/60 font-mono text-[11px] font-bold ${t.bgPage}`}>
                          <tr>
                            <td className={`sticky left-0 z-10 py-2.5 px-3 text-brand-red whitespace-nowrap border-r ${t.border} ${t.bgPage}`} colSpan={2}>
                              TOTAL (23)
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMain}`}>{estateTotalStats.subPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            <td className="py-2.5 px-2.5 text-right text-amber-500 whitespace-nowrap">{estateTotalStats.extraLandCpSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMain}`}>{estateTotalStats.netPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            <td className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textBody}`}>{estateTotalStats.roadAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className="py-2.5 px-2.5 text-right text-brand-red whitespace-nowrap">{estateTotalStats.totalPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMain}`}>{estateTotalStats.subPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMain}`}>{estateTotalStats.netPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className="py-2.5 px-3 text-right text-brand-red whitespace-nowrap">{estateTotalStats.totalPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            )}
                            <td className={`py-2.5 px-2.5 text-center text-[10px] whitespace-nowrap ${t.textMuted}`}>23</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className={`border-t ${t.border} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Campus Area',  value: '17,545.33 SQ.YD', sub: '14,670.01 SQ.MT', accent: true  },
                        { label: 'Net Plotted',  value: '13,319.64 SQ.YD', sub: '11,136.82 SQ.MT', accent: false },
                        { label: 'Road Area',    value: '3,533.19 SQ.MT',  sub: 'Heavy RCC',       accent: false },
                        { label: 'Extra Land CP',value: '1,281.32 SQ.MT',  sub: 'Plots 1,2,9,10',  accent: false },
                      ].map((s) => (
                        <div key={s.label} className="p-3 sm:p-4">
                          <span className={`font-mono text-[9.5px] uppercase tracking-wider block ${t.textMuted}`}>{s.label}</span>
                          <span className={`text-xs sm:text-base font-bold tabular-nums block mt-0.5 ${s.accent ? 'text-brand-red' : t.textMain}`}>{s.value}</span>
                          <span className={`text-[10.5px] block ${t.textMuted}`}>{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DrawingCard
                    src={PARK2_IMAGES.table.src}
                    alt="Industrial Park 2 Area Table"
                    title="MIP 2 Official Area Table"
                    onOpen={() => openViewer(PARK2_IMAGES.table.src, PARK2_IMAGES.table.title)}
                    isDark={isDark}
                  />
                </div>
              )}

              {/* ── PARK 3: 77 Plots Engineering Schedule ── */}
              {activeTab === 'park3' && (
                <div className="space-y-4">
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`px-3 sm:px-4 py-2.5 border-b ${t.border} flex flex-wrap items-center justify-between gap-2`}>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-brand-red">MIP 03</span>
                        <span className={t.textMain}>· 77 Plots Data</span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none">
                        <div className={`inline-flex border ${t.border} divide-x ${t.divide} shrink-0`}>
                          {[
                            { id: 'ALL',   label: 'All'    },
                            { id: 'SMALL', label: '<500'   },
                            { id: 'MID',   label: '500–1K' },
                            { id: 'LARGE', label: '1K+'    },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setPark3Filter(f.id)}
                              className={`h-7 px-2 font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
                                park3Filter === f.id ? 'bg-brand-red text-white' : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        <div className={`inline-flex border ${t.border} divide-x ${t.divide} shrink-0`}>
                          {[
                            { id: 'both', label: 'All' },
                            { id: 'yd',   label: 'YD'  },
                            { id: 'mt',   label: 'MT'  },
                          ].map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setUnitMode(u.id)}
                              className={`h-7 px-2 font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${
                                unitMode === u.id ? 'bg-brand-red text-white' : `${t.bgPage} ${t.textBody} hover:text-brand-red`
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative shrink-0">
                          <Search size={11} className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} aria-hidden="true" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="#..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Filter Park 3 by plot number"
                            className={`h-7 pl-6 pr-2 border ${t.border} ${t.bgPage} ${t.textMain} font-mono text-[11px] focus:outline-none focus:border-brand-red w-16 sm:w-24`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-[58vh]">
                      <table
                        className="w-full text-left text-[11px] sm:text-xs tabular-nums border-collapse"
                        aria-label="Official Industrial Park 3 (MIP 3) Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 3 (77 plots with Carpet Area, Super Loading, and Total Area).
                        </caption>
                        <thead className={`font-mono text-[10px] uppercase tracking-[0.1em] border-b ${t.border} sticky top-0 z-20 ${t.bgPage}`}>
                          <tr>
                            <th scope="col" className={`sticky left-0 z-30 py-2.5 px-3 whitespace-nowrap border-r ${t.border} ${t.bgPage} ${t.textMuted}`}>Plot</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Carpet (MT)</th>
                            )}
                            <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Load</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className={`py-2.5 px-2.5 text-right whitespace-nowrap ${t.textMuted}`}>Total (MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-3 text-right text-brand-red font-bold whitespace-nowrap">Total (YD)</th>
                            )}
                            <th scope="col" className={`py-2.5 px-2.5 text-center whitespace-nowrap ${t.textMuted}`}>Status</th>
                            <th scope="col" className={`py-2.5 px-2.5 text-center whitespace-nowrap ${t.textMuted}`}>WA</th>
                          </tr>
                        </thead>

                        <tbody className={`divide-y ${t.divide}`}>
                          {filteredPark3Plots.length === 0 ? (
                            <tr>
                              <td colSpan={7} className={`py-8 text-center font-mono text-xs ${t.textMuted}`}>
                                No match for “{searchQuery}”
                              </td>
                            </tr>
                          ) : (
                            filteredPark3Plots.map((plot) => (
                              <tr key={plot.id} className={isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'}>
                                <td className={`sticky left-0 z-10 py-2.5 px-3 font-mono font-bold text-brand-red whitespace-nowrap border-r ${t.border} ${t.bgSurface}`}>
                                  #{plot.id}
                                </td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono ${t.textMain} whitespace-nowrap`}>{plot.carpetSqmt?.toFixed(2)}</td>
                                )}
                                <td className={`py-2.5 px-2.5 text-right font-mono ${t.textBody} whitespace-nowrap`}>{plot.superPct || '23.39%'}</td>
                                {(unitMode === 'both' || unitMode === 'mt') && (
                                  <td className={`py-2.5 px-2.5 text-right font-mono font-bold ${t.textMain} whitespace-nowrap`}>{plot.totalSqmt?.toFixed(2)}</td>
                                )}
                                {(unitMode === 'both' || unitMode === 'yd') && (
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-red whitespace-nowrap">{plot.area}</td>
                                )}
                                <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase text-emerald-500 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                    Open
                                  </span>
                                </td>
                                <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                                  <a
                                    href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.id} (${plot.area} / ${plot.totalSqmt?.toFixed(2)} sq.mtr) in Industrial Park 3.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`WhatsApp inquiry for Plot ${plot.id}`}
                                    className={`inline-flex items-center justify-center w-6 h-6 border ${t.border} text-emerald-600 hover:border-emerald-600 transition-colors`}
                                  >
                                    <FaWhatsapp size={12} aria-hidden="true" />
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className={`border-t ${t.border} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 ${t.divide} ${t.bgPage}`}>
                      {[
                        { label: 'Campus Area',  value: '59,508 SQ.YD',  sub: '~12.3 Acres',     accent: true  },
                        { label: 'Total Plots',  value: '77 Parcels',    sub: '300–2,876 YD',    accent: false },
                        { label: 'Road Network', value: '18m & 12m RCC', sub: 'Heavy Spine',     accent: false },
                        { label: 'Common Plot',  value: '851.31 SQ.MT',  sub: '1,018 SQ.YD',     accent: false },
                      ].map((s) => (
                        <div key={s.label} className="p-3 sm:p-4">
                          <span className={`font-mono text-[9.5px] uppercase tracking-wider block ${t.textMuted}`}>{s.label}</span>
                          <span className={`text-xs sm:text-base font-bold tabular-nums block mt-0.5 ${s.accent ? 'text-brand-red' : t.textMain}`}>{s.value}</span>
                          <span className={`text-[10.5px] block ${t.textMuted}`}>{s.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <DrawingCard
                      src={PARK3_IMAGES.table1.src}
                      alt="Industrial Park 3 Area Table 1"
                      title="Table 1 · Plots 1–39"
                      onOpen={() => openViewer(PARK3_IMAGES.table1.src, PARK3_IMAGES.table1.title)}
                      isDark={isDark}
                    />
                    <DrawingCard
                      src={PARK3_IMAGES.table2.src}
                      alt="Industrial Park 3 Area Table 2"
                      title="Table 2 · Plots 40–77"
                      onOpen={() => openViewer(PARK3_IMAGES.table2.src, PARK3_IMAGES.table2.title)}
                      isDark={isDark}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

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
