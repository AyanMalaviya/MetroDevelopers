// src/pages/SiteMapPage.jsx
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft, Map, Table, Layers, Search, Maximize2,
  ExternalLink, Factory, Phone, CheckCircle, ShieldCheck
} from 'lucide-react';
import { FaWhatsapp, FaRoad } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import InteractiveSiteMap from '../components/InteractiveSiteMap/InteractiveSiteMap';
import MetroEstateInteractiveMap from '../components/InteractiveSiteMap/MetroEstateInteractiveMap';
import Park3InteractiveMap from '../components/InteractiveSiteMap/Park3InteractiveMap';
import SEO from '../components/SEO/SEO';
import { estatePlotsSchedule, estateTotalStats } from '../data/estatePlotCoordinates';
import { park3Plots } from '../data/park3PlotsData';

const SiteMapPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const location = useLocation();

  // Active park tab ('park' = Park 1, 'estate' = Park 2, 'park3' = Park 3)
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'park');
  // View mode ('map' = Interactive Map, 'table' = Area Details Table)
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'map');

  // Table filters & controls
  const [park2Filter, setPark2Filter] = useState('ALL');
  const [park3Filter, setPark3Filter] = useState('ALL');
  const [unitMode, setUnitMode] = useState('both'); // 'both' | 'yd' | 'mt'
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSlides, setViewerSlides] = useState([]);

  const openViewer = useCallback((src, title) => {
    setViewerSlides([{ src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  // Park 1 images
  const park1Images = {
    table1: { src: '/images/metro-industrial-park-area-details-table-1.jpg', title: 'Industrial Park 1 — Area Details Table 1' },
    table2: { src: '/images/metro-industrial-park-area-details-table-2.jpg', title: 'Industrial Park 1 — Area Details Table 2' },
  };

  // Park 2 images
  const park2Images = {
    table: { src: '/images/metro-industrial-park-2-area-table.png', title: 'Industrial Park 2 — 23 Plots Engineering Schedule' },
  };

  // Park 3 images
  const park3Images = {
    table1: { src: '/images/metro-industrial-park-3-area-table-1.png', title: 'Industrial Park 3 — Plot Area Schedule (Plots 1 to 39)' },
    table2: { src: '/images/metro-industrial-park-3-area-table-2.png', title: 'Industrial Park 3 — Plot Area Schedule (Plots 40 to 77)' },
  };

  // Tab configurations: cleanly labeled 1, 2 & 3
  const tabs = [
    { id: 'park', label: 'Park 1 (MIP 1)', short: 'Park 1', subtitle: '63 Industrial Sheds' },
    { id: 'estate', label: 'Park 2 (MIP 2)', short: 'Park 2', subtitle: '23 Plotted Parcels' },
    { id: 'park3', label: 'Park 3 (MIP 3)', short: 'Park 3', subtitle: '77 Plotted Parcels' },
  ];

  // Filtered Park 2 plots
  const filteredPark2Plots = useMemo(() => {
    return estatePlotsSchedule.filter((p) => {
      if (park2Filter !== 'ALL' && p.section !== park2Filter) return false;
      if (searchQuery && !String(p.plotNo).includes(searchQuery.trim())) return false;
      return true;
    });
  }, [park2Filter, searchQuery]);

  // Filtered Park 3 plots
  const filteredPark3Plots = useMemo(() => {
    return park3Plots.filter((p) => {
      if (searchQuery && !p.id.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
      const ydNum = parseFloat(p.area.replace(/[^0-9.]/g, '')) || 0;
      if (park3Filter === 'SMALL') return ydNum < 500;
      if (park3Filter === 'MID') return ydNum >= 500 && ydNum <= 1000;
      if (park3Filter === 'LARGE') return ydNum > 1000;
      return true;
    });
  }, [park3Filter, searchQuery]);

  // Structured dataset and item lists for AI crawlers & search engines
  const tableDatasetSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dataset',
          '@id': 'https://metroindustrialpark.com/site-map#schedule-dataset',
          'name': 'Metro Industrial Park 1, 2 & 3 Official Area Details & Plot Schedule',
          'alternateName': ['MIP Plot Schedule', 'Metro Developers Plot Area Table', 'MIP 1 2 3 Dimensions'],
          'description': 'Comprehensive engineering area schedules for Metro Industrial Park 1 (63 sheds in Moraiya), Metro Industrial Park 2 (23 plotted parcels in Moraiya), and Metro Industrial Park 3 (77 plotted parcels on Bavla-Rajoda Road), Ahmedabad, Gujarat.',
          'creator': {
            '@type': 'RealEstateAgent',
            'name': 'Metro Developers',
            'url': 'https://metroindustrialpark.com'
          },
          'spatialCoverage': {
            '@type': 'Place',
            'name': 'Ahmedabad Industrial Belt (Moraiya, Changodar, Bavla), Gujarat, India',
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': 22.9039,
              'longitude': 72.4419
            }
          }
        },
        {
          '@type': 'ItemList',
          '@id': 'https://metroindustrialpark.com/site-map#park2-plots-list',
          'name': 'Metro Industrial Park 2 (MIP 2) - 23 Clear Title Plotted Parcels',
          'numberOfItems': estatePlotsSchedule.length,
          'itemListElement': estatePlotsSchedule.map((p, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': `Plot #${p.plotNo} (Block ${p.section}) - Metro Industrial Park 2`,
            'description': `Sub Plot Area: ${p.subPlotAreaSqYd.toFixed(2)} SQ.YD (${p.subPlotAreaSqMt.toFixed(2)} SQ.MT), Net Plot Area: ${p.netPlotAreaSqYd.toFixed(2)} SQ.YD (${p.netPlotAreaSqMt.toFixed(2)} SQ.MT), Total Plot Area: ${p.totalPlotAreaSqYd.toFixed(2)} SQ.YD (${p.totalPlotAreaSqMt.toFixed(2)} SQ.MT). Clear title industrial land in Moraiya, Ahmedabad by Metro Developers.`
          }))
        },
        {
          '@type': 'ItemList',
          '@id': 'https://metroindustrialpark.com/site-map#park3-plots-list',
          'name': 'Metro Industrial Park 3 (MIP 3) - 77 Clear Title Plotted Parcels',
          'numberOfItems': park3Plots.length,
          'itemListElement': park3Plots.map((p, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': `Plot #${p.id} - Metro Industrial Park 3`,
            'description': `Carpet Area: ${p.carpetSqmt?.toFixed(2) || 'N/A'} SQ.MT, Total Area: ${p.totalSqmt?.toFixed(2) || 'N/A'} SQ.MT (${p.area} SQ.YD), Super Loading: ${p.superPct || '23.39%'}. Clear title industrial land on Bavla-Rajoda Road, Ahmedabad by Metro Developers.`
          }))
        }
      ]
    };
  }, []);

  return (
    <>
      <SEO
        title="Interactive Site Map | Metro Industrial Parks (MIP 1, 2 & 3)"
        description="Check live industrial shed and plot availability across Metro Industrial Park 1 (MIP 1), Metro Industrial Park 2 (MIP 2), and Metro Industrial Park 3 (MIP 3) with our interactive site map and official area details schedule."
        canonical="/site-map"
        ogImage="/images/metro-industrial-map.jpg"
        ogImageAlt="Industrial shed and plot availability map in Moraiya Changodar Bavla Ahmedabad"
      />
      
      {/* External AI Knowledge Graph & Search Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tableDatasetSchema) }}
      />

      <h1 className="sr-only">Metro Developers — Industrial Park 1, 2 &amp; 3 (MIP 1, 2, 3) Interactive Site Maps &amp; Area Schedules</h1>

      <div className={`relative overflow-hidden min-h-screen pt-16 sm:pt-24 pb-12 sm:pb-16 ${
        isDark
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black'
          : 'bg-gradient-to-br from-slate-50 via-white to-gray-100'
      }`}>

        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          
          {/* ── Top Navigation & View Mode Pill ── */}
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-6"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 whitespace-nowrap ${
                isDark
                  ? 'text-gray-300 bg-gray-800/80 hover:text-white hover:bg-gray-700 ring-1 ring-white/10'
                  : 'text-gray-700 bg-white hover:text-gray-900 hover:bg-gray-50 ring-1 ring-black/5 shadow-sm'
              }`}
            >
              <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
              <span>Back</span>
            </button>

            {/* View Mode Toggle: Map View vs Area Table */}
            <div className={`flex items-center p-1 rounded-2xl border shadow-sm ${
              isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  viewMode === 'map'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map size={13} />
                <span>Interactive Map</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table size={13} />
                <span>Area Table</span>
              </button>
            </div>
          </motion.div>

          {/* ── Title & Segmented Project Tabs (1, 2, 3) ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {viewMode === 'table' ? 'Area Details' : 'Shed & Plot'}{' '}
                <span className="text-brand-red">
                  {viewMode === 'table' ? 'Schedule' : 'Availability'}
                </span>
              </h2>
              <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Industrial Park 1, 2 &amp; 3 · Moraiya, Changodar &amp; Bavla, Ahmedabad
              </p>
            </motion.div>

            {/* High-Visibility Responsive Tab Bar for 1, 2 & 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`flex items-center justify-center p-1 sm:p-1.5 rounded-2xl w-full md:w-auto shrink-0 shadow-sm overflow-x-auto ${
                isDark ? 'bg-gray-800/90 ring-1 ring-white/10' : 'bg-gray-200/90 ring-1 ring-black/5'
              }`}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 z-10 whitespace-nowrap ${
                      isActive
                        ? 'text-white' 
                        : isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-brand-red rounded-xl shadow-md shadow-red-500/40"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    
                    <span className="relative z-20 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      {viewMode === 'table' ? (
                        <Table size={13} className={isActive ? 'text-white' : 'opacity-70'} />
                      ) : (
                        <Map size={13} className={isActive ? 'text-white' : 'opacity-70'} />
                      )}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.short}</span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* ════════ MAIN VIEW CONTAINER (MAP OR AREA TABLE) ════════ */}
          {viewMode === 'map' ? (
            <>
              {/* ── Interactive Map View ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-300 min-h-[600px] ${
                  isDark
                    ? 'border-gray-800 shadow-black/60 bg-gray-800'
                    : 'border-gray-200 shadow-gray-300/50 bg-white'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    {activeTab === 'park' ? (
                      <InteractiveSiteMap />
                    ) : activeTab === 'estate' ? (
                      <MetroEstateInteractiveMap />
                    ) : (
                      <Park3InteractiveMap />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* ── Quick Priority Banner: Switch directly to Area Table ── */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border theme-bg-card theme-border shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                    <Table size={15} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold theme-text-primary">
                      Looking for precise plot area, SQ.YD measurements, or engineering tables?
                    </p>
                    <p className="text-[11px] theme-text-tertiary">
                      Official dimensions schedule available for {tabs.find(t => t.id === activeTab)?.label}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('table')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-red/25 whitespace-nowrap hover:scale-105 shrink-0"
                >
                  <Table size={13} />
                  <span>View Area Table</span>
                </button>
              </div>
            </>
          ) : (
            /* ════════ AREA TABLE VIEW (PRIORITY DISPLAY) ════════ */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* ── PARK 1: Sheds Area Details ── */}
              {activeTab === 'park' && (
                <div className="space-y-6">
                  {/* Summary Bar */}
                  <div className="theme-bg-card rounded-2xl p-4 sm:p-6 border theme-border shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b theme-border">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-red block mb-1">
                          Ready-to-Move Shed Inventory
                        </span>
                        <h3 className="text-base sm:text-xl font-black font-display theme-text-primary">
                          Industrial Park 1 — Unit Area Schedule
                        </h3>
                        <p className="theme-text-secondary text-xs sm:text-sm mt-0.5">
                          63 industrial sheds &amp; warehouse units across 54,000+ sq.yards in Moraiya, Changodar.
                        </p>
                      </div>

                      <Link
                        to="/metro-industrial-park"
                        className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-transform hover:scale-105 whitespace-nowrap self-start sm:self-auto shrink-0 shadow-md shadow-brand-red/25"
                      >
                        <Factory size={14} />
                        <span>Explore Park 1</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                      {[
                        { label: 'Campus Area', value: '54,000 SQ.YD', sub: 'Moraiya Hub' },
                        { label: 'Total Units', value: '63 Sheds', sub: 'Ready Possession' },
                        { label: 'Size Range', value: '4K – 50K Sq.ft', sub: 'Customizable' },
                        { label: 'Road Width', value: '60 Ft Heavy RCC', sub: 'Trailer Friendly' },
                      ].map((item, idx) => (
                        <div key={idx} className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block">{item.label}</span>
                          <span className="text-xs sm:text-sm font-black text-brand-red block">{item.value}</span>
                          <span className="text-[10px] text-gray-400">{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scanned Official Drawings with Zoom */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden p-3.5 sm:p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                          Area Details Table 1 (Units 1–32)
                        </h4>
                        <button
                          type="button"
                          className="text-[11px] sm:text-xs text-brand-red font-semibold hover:underline"
                          onClick={() => openViewer(park1Images.table1.src, park1Images.table1.title)}
                        >
                          Click to Zoom
                        </button>
                      </div>
                      <img
                        src={park1Images.table1.src}
                        alt="Industrial Park 1 Area Table 1"
                        className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                        onClick={() => openViewer(park1Images.table1.src, park1Images.table1.title)}
                        loading="lazy"
                      />
                    </div>

                    <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden p-3.5 sm:p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                          Area Details Table 2 (Units 33–63)
                        </h4>
                        <button
                          type="button"
                          className="text-[11px] sm:text-xs text-brand-red font-semibold hover:underline"
                          onClick={() => openViewer(park1Images.table2.src, park1Images.table2.title)}
                        >
                          Click to Zoom
                        </button>
                      </div>
                      <img
                        src={park1Images.table2.src}
                        alt="Industrial Park 1 Area Table 2"
                        className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                        onClick={() => openViewer(park1Images.table2.src, park1Images.table2.title)}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── PARK 2: 23 Industrial Plots Area Schedule ── */}
              {activeTab === 'estate' && (
                <div className="space-y-6">
                  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden shadow-sm">
                    <div className="p-3.5 sm:p-5 border-b theme-border flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-red/10 text-brand-red border border-brand-red/30">
                            Build Your Own Shed
                          </span>
                          <span className="text-[11px] text-gray-400 font-semibold">23 Clear-Title Plots</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black font-display theme-text-primary">
                          Industrial Park 2 — Engineering Area Schedule
                        </h3>
                        <p className="theme-text-secondary text-[11px] sm:text-xs mt-0.5">
                          Sub Plot Area, Extra Land CP, Net Plot Area, Road Area, and Total SQ.YD calculations.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
                        {/* Block Filter */}
                        <div className={`flex items-center gap-0.5 p-1 rounded-xl border ${
                          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
                        }`}>
                          {['ALL', 'A', 'B', 'C'].map((sec) => (
                            <button
                              key={sec}
                              onClick={() => setPark2Filter(sec)}
                              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                                park2Filter === sec
                                  ? 'bg-brand-red text-white shadow-sm'
                                  : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {sec === 'ALL' ? 'All' : `Block ${sec}`}
                            </button>
                          ))}
                        </div>

                        {/* Unit Switcher */}
                        <div className={`flex items-center gap-0.5 p-1 rounded-xl border ${
                          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
                        }`}>
                          {[
                            { id: 'both', label: 'Both' },
                            { id: 'yd', label: 'SQ.YD' },
                            { id: 'mt', label: 'SQ.MT' },
                          ].map((u) => (
                            <button
                              key={u.id}
                              onClick={() => setUnitMode(u.id)}
                              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                                unitMode === u.id
                                  ? 'bg-brand-red text-white shadow-sm'
                                  : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Plot #..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-7 pr-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-brand-red w-24 sm:w-28 ${
                              isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Responsive Data Table */}
                    <div className="overflow-x-auto max-h-[520px] scrollbar-thin">
                      <table
                        className="w-full text-left text-[11px] sm:text-xs tabular-nums"
                        aria-label="Official Industrial Park 2 (MIP 2) Engineering Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 2 (MIP 2) located in Moraiya, Changodar, Ahmedabad by Metro Developers. 23 clear-title industrial plotted parcels with Sub Plot Area, Extra Land Common Plot (CP), Net Plotted Area, Road Area, and Total Plot Area in Square Meters (SQ.MT) and Square Yards (SQ.YD / Gaj).
                        </caption>
                        <thead className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold border-b sticky top-0 z-10 backdrop-blur-md ${
                          isDark ? 'bg-gray-950/95 text-gray-400 border-gray-800' : 'bg-gray-50/95 text-gray-600 border-gray-200'
                        }`}>
                          <tr>
                            <th scope="col" className="py-2.5 px-3 whitespace-nowrap">Plot #</th>
                            <th scope="col" className="py-2.5 px-2.5 whitespace-nowrap">Block</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Sub Plot Area in Square Meters">Sub Plot (SQ.MT)</th>
                            )}
                            <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Extra Land Common Plot in Square Meters">Extra CP (SQ.MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Net Plotted Area in Square Meters">Net Plot (SQ.MT)</th>
                            )}
                            <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Road Area Loading in Square Meters">Road (SQ.MT)</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Total Plot Area in Square Meters">Total (SQ.MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Sub Plot Area in Square Yards">Sub Plot (SQ.YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Net Plotted Area in Square Yards">Net Plot (SQ.YD)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-3 text-right text-brand-red font-black whitespace-nowrap" title="Total Plot Area in Square Yards">Total (SQ.YD)</th>
                            )}
                            <th scope="col" className="py-2.5 px-2.5 text-center whitespace-nowrap">Enquire</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                          {filteredPark2Plots.map((plot) => (
                            <tr
                              key={plot.plotNo}
                              className={`transition-colors hover:bg-brand-red/5 ${
                                isDark ? 'odd:bg-gray-900/30' : 'odd:bg-gray-50/60'
                              }`}
                            >
                              <td className="py-2.5 px-3 font-black text-brand-red whitespace-nowrap" data-label="Plot Number">
                                Plot #{plot.plotNo}
                              </td>
                              <td className="py-2.5 px-2.5 whitespace-nowrap" data-label="Block">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  plot.section === 'A'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : plot.section === 'B'
                                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  Block {plot.section}
                                </span>
                              </td>
                              {(unitMode === 'both' || unitMode === 'mt') && (
                                <td className="py-2.5 px-2.5 text-right font-medium theme-text-primary whitespace-nowrap" data-label="Sub Plot SQ.MT">
                                  {plot.subPlotAreaSqMt.toFixed(2)}
                                </td>
                              )}
                              <td className="py-2.5 px-2.5 text-right whitespace-nowrap" data-label="Extra CP SQ.MT">
                                {plot.extraLandCpSqMt ? (
                                  <span className="font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                    {plot.extraLandCpSqMt.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                              {(unitMode === 'both' || unitMode === 'mt') && (
                                <td className="py-2.5 px-2.5 text-right font-medium theme-text-primary whitespace-nowrap" data-label="Net Plot SQ.MT">
                                  {plot.netPlotAreaSqMt.toFixed(2)}
                                </td>
                              )}
                              <td className="py-2.5 px-2.5 text-right font-medium theme-text-secondary whitespace-nowrap" data-label="Road Area SQ.MT">
                                {plot.roadAreaSqMt.toFixed(2)}
                              </td>
                              {(unitMode === 'both' || unitMode === 'mt') && (
                                <td className="py-2.5 px-2.5 text-right font-bold theme-text-primary whitespace-nowrap" data-label="Total SQ.MT">
                                  {plot.totalPlotAreaSqMt.toFixed(2)}
                                </td>
                              )}
                              {(unitMode === 'both' || unitMode === 'yd') && (
                                <td className="py-2.5 px-2.5 text-right font-medium theme-text-primary whitespace-nowrap" data-label="Sub Plot SQ.YD">
                                  {plot.subPlotAreaSqYd.toFixed(2)}
                                </td>
                              )}
                              {(unitMode === 'both' || unitMode === 'yd') && (
                                <td className="py-2.5 px-2.5 text-right font-medium theme-text-primary whitespace-nowrap" data-label="Net Plot SQ.YD">
                                  {plot.netPlotAreaSqYd.toFixed(2)}
                                </td>
                              )}
                              {(unitMode === 'both' || unitMode === 'yd') && (
                                <td className="py-2.5 px-3 text-right font-black text-brand-red whitespace-nowrap" data-label="Total SQ.YD">
                                  {plot.totalPlotAreaSqYd.toFixed(2)}
                                </td>
                              )}
                              <td className="py-2.5 px-2.5 text-center whitespace-nowrap" data-label="Enquire">
                                <a
                                  href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.plotNo} (${plot.totalPlotAreaSqYd.toFixed(2)} sq.yds / ${plot.totalPlotAreaSqMt.toFixed(2)} sq.mtr) in Industrial Park 2.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Inquire about Plot #${plot.plotNo}`}
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                >
                                  <FaWhatsapp size={15} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className={`border-t-2 font-black text-[11px] sm:text-xs ${
                          isDark ? 'bg-gray-950/95 border-brand-red/40 theme-text-primary' : 'bg-red-50/60 border-brand-red/40 text-gray-900'
                        }`}>
                          <tr>
                            <td className="py-3 px-3 text-brand-red font-black whitespace-nowrap" colSpan={2}>
                              TOTAL (23 Plots)
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className="py-3 px-2.5 text-right whitespace-nowrap">
                                {estateTotalStats.subPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className="py-3 px-2.5 text-right text-amber-500 whitespace-nowrap">
                              {estateTotalStats.extraLandCpSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className="py-3 px-2.5 text-right whitespace-nowrap">
                                {estateTotalStats.netPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className="py-3 px-2.5 text-right whitespace-nowrap">
                              {estateTotalStats.roadAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <td className="py-3 px-2.5 text-right text-brand-red whitespace-nowrap">
                                {estateTotalStats.totalPlotAreaSqMt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className="py-3 px-2.5 text-right whitespace-nowrap">
                                {estateTotalStats.subPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className="py-3 px-2.5 text-right whitespace-nowrap">
                                {estateTotalStats.netPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <td className="py-3 px-3 text-right text-brand-red font-black text-xs sm:text-sm whitespace-nowrap">
                                {estateTotalStats.totalPlotAreaSqYd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            )}
                            <td className="py-3 px-2.5 text-center text-gray-400 text-[10px] whitespace-nowrap">
                              23 Units
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Campus Area Summary Strip */}
                    <div className={`p-3.5 sm:p-4 border-t grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 ${
                      isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Campus Area</span>
                        <span className="text-xs sm:text-sm font-black text-brand-red">17,545.33 SQ.YD</span>
                        <span className="text-[10px] text-gray-400 block">(14,670.01 SQ.MT)</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Net Plotted Area</span>
                        <span className="text-xs sm:text-sm font-black theme-text-primary">13,319.64 SQ.YD</span>
                        <span className="text-[10px] text-gray-400 block">(11,136.82 SQ.MT)</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Dedicated Road Area</span>
                        <span className="text-xs sm:text-sm font-black theme-text-primary">3,533.19 SQ.MT</span>
                        <span className="text-[10px] text-gray-400 block">Wide Heavy RCC</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Extra Land CP Area</span>
                        <span className="text-xs sm:text-sm font-black text-amber-500">1,281.32 SQ.MT</span>
                        <span className="text-[10px] text-gray-400 block">Plots 1, 2, 9, 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Scanned Official Engineering Schedule Drawing with Zoom */}
                  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden p-3.5 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                        Official Approved Architectural Plot Schedule
                      </h4>
                      <button
                        type="button"
                        className="text-[11px] sm:text-xs text-brand-red font-semibold hover:underline"
                        onClick={() => openViewer(park2Images.table.src, park2Images.table.title)}
                      >
                        Click to Zoom
                      </button>
                    </div>
                    <img
                      src={park2Images.table.src}
                      alt="Industrial Park 2 Area Table"
                      className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                      onClick={() => openViewer(park2Images.table.src, park2Images.table.title)}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* ── PARK 3: 77 Industrial Plots Area Schedule ── */}
              {activeTab === 'park3' && (
                <div className="space-y-6">
                  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden shadow-sm">
                    <div className="p-3.5 sm:p-5 border-b theme-border flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                            Bavla – Rajoda Road
                          </span>
                          <span className="text-[11px] text-gray-400 font-semibold">77 Plotted Parcels • Bookings Open</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black font-display theme-text-primary">
                          Industrial Park 3 — Official 77 Plot Area Schedule
                        </h3>
                        <p className="theme-text-secondary text-[11px] sm:text-xs mt-0.5">
                          Carpet SQ.MT, 23.39% super area loading, and total plot area schedule.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
                        {/* Size Filter */}
                        <div className={`flex items-center gap-0.5 p-1 rounded-xl border ${
                          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
                        }`}>
                          {[
                            { id: 'ALL', label: 'All 77' },
                            { id: 'SMALL', label: '< 500 YD' },
                            { id: 'MID', label: '500–1000' },
                            { id: 'LARGE', label: '1000+ YD' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setPark3Filter(f.id)}
                              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                                park3Filter === f.id
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>

                        {/* Unit Switcher */}
                        <div className={`flex items-center gap-0.5 p-1 rounded-xl border ${
                          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
                        }`}>
                          {[
                            { id: 'both', label: 'Both' },
                            { id: 'yd', label: 'SQ.YD' },
                            { id: 'mt', label: 'SQ.MT' },
                          ].map((u) => (
                            <button
                              key={u.id}
                              onClick={() => setUnitMode(u.id)}
                              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                                unitMode === u.id
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                                  : isDark
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Plot #..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-7 pr-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-amber-500 w-24 sm:w-28 ${
                              isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Responsive Data Table */}
                    <div className="overflow-x-auto max-h-[520px] scrollbar-thin">
                      <table
                        className="w-full text-left text-[11px] sm:text-xs tabular-nums"
                        aria-label="Official Industrial Park 3 (MIP 3) Engineering Plot Area Schedule"
                      >
                        <caption className="sr-only">
                          Official engineering plot schedule for Metro Industrial Park 3 (MIP 3) located on Bavla-Rajoda Road, Ahmedabad by Metro Developers. 77 clear-title plotted industrial parcels with Carpet Area in SQ.MT, 23.39% super loading, and Total Plot Area in Square Meters and Square Yards.
                        </caption>
                        <thead className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold border-b sticky top-0 z-10 backdrop-blur-md ${
                          isDark ? 'bg-gray-950/95 text-gray-400 border-gray-800' : 'bg-gray-50/95 text-gray-600 border-gray-200'
                        }`}>
                          <tr>
                            <th scope="col" className="py-2.5 px-3 whitespace-nowrap">Plot #</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Carpet Area in Square Meters">Carpet (SQ.MT)</th>
                            )}
                            <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Super Area Loading Percentage">Super Loading</th>
                            {(unitMode === 'both' || unitMode === 'mt') && (
                              <th scope="col" className="py-2.5 px-2.5 text-right whitespace-nowrap" title="Total Plot Area in Square Meters">Total (SQ.MT)</th>
                            )}
                            {(unitMode === 'both' || unitMode === 'yd') && (
                              <th scope="col" className="py-2.5 px-3 text-right text-amber-500 font-black whitespace-nowrap" title="Total Plot Area in Square Yards">Total (SQ.YD)</th>
                            )}
                            <th scope="col" className="py-2.5 px-2.5 text-center whitespace-nowrap">Status</th>
                            <th scope="col" className="py-2.5 px-2.5 text-center whitespace-nowrap">Enquire</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                          {filteredPark3Plots.map((plot) => (
                            <tr
                              key={plot.id}
                              className={`transition-colors hover:bg-amber-500/5 ${
                                isDark ? 'odd:bg-gray-900/30' : 'odd:bg-gray-50/60'
                              }`}
                            >
                              <td className="py-2.5 px-3 font-black text-amber-500 whitespace-nowrap" data-label="Plot Number">
                                Plot #{plot.id}
                              </td>
                              {(unitMode === 'both' || unitMode === 'mt') && (
                                <td className="py-2.5 px-2.5 text-right font-medium theme-text-primary whitespace-nowrap" data-label="Carpet SQ.MT">
                                  {plot.carpetSqmt?.toFixed(2)}
                                </td>
                              )}
                              <td className="py-2.5 px-2.5 text-right font-medium theme-text-secondary whitespace-nowrap" data-label="Super Loading">
                                {plot.superPct || '23.39%'}
                              </td>
                              {(unitMode === 'both' || unitMode === 'mt') && (
                                <td className="py-2.5 px-2.5 text-right font-bold theme-text-primary whitespace-nowrap" data-label="Total SQ.MT">
                                  {plot.totalSqmt?.toFixed(2)}
                                </td>
                              )}
                              {(unitMode === 'both' || unitMode === 'yd') && (
                                <td className="py-2.5 px-3 text-right font-black text-amber-500 whitespace-nowrap" data-label="Total SQ.YD">
                                  {plot.area}
                                </td>
                              )}
                              <td className="py-2.5 px-2.5 text-center whitespace-nowrap" data-label="Status">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/30">
                                  Bookings Open
                                </span>
                              </td>
                              <td className="py-2.5 px-2.5 text-center whitespace-nowrap" data-label="Enquire">
                                <a
                                  href={`https://wa.me/919824235642?text=${encodeURIComponent(`Hello, I would like to inquire about Plot #${plot.id} (${plot.area} / ${plot.totalSqmt?.toFixed(2)} sq.mtr) in Industrial Park 3.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Inquire about Plot #${plot.id}`}
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                                >
                                  <FaWhatsapp size={15} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Campus Area Summary Strip */}
                    <div className={`p-3.5 sm:p-4 border-t grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 ${
                      isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Campus Area</span>
                        <span className="text-xs sm:text-sm font-black text-amber-500">59,508 SQ.YD</span>
                        <span className="text-[10px] text-gray-400 block">(~12.3 Acres)</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Parcels</span>
                        <span className="text-xs sm:text-sm font-black theme-text-primary">77 Plots</span>
                        <span className="text-[10px] text-gray-400 block">300 to 2,876 YD</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Road Network</span>
                        <span className="text-xs sm:text-sm font-black theme-text-primary">18m &amp; 12m Wide</span>
                        <span className="text-[10px] text-gray-400 block">Heavy RCC Spine</span>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Common Plot</span>
                        <span className="text-xs sm:text-sm font-black text-amber-500">851.31 SQ.MT</span>
                        <span className="text-[10px] text-gray-400 block">(1,018 SQ.YD)</span>
                      </div>
                    </div>
                  </div>

                  {/* Scanned Official Architectural Plot Schedule Drawings with Zoom */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden p-3.5 sm:p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                          Schedule Table 1 (Plots 1–39)
                        </h4>
                        <button
                          type="button"
                          className="text-[11px] sm:text-xs text-amber-500 font-semibold hover:underline"
                          onClick={() => openViewer(park3Images.table1.src, park3Images.table1.title)}
                        >
                          Click to Zoom
                        </button>
                      </div>
                      <img
                        src={park3Images.table1.src}
                        alt="Industrial Park 3 Area Table 1"
                        className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                        onClick={() => openViewer(park3Images.table1.src, park3Images.table1.title)}
                        loading="lazy"
                      />
                    </div>

                    <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden p-3.5 sm:p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                          Schedule Table 2 (Plots 40–77)
                        </h4>
                        <button
                          type="button"
                          className="text-[11px] sm:text-xs text-amber-500 font-semibold hover:underline"
                          onClick={() => openViewer(park3Images.table2.src, park3Images.table2.title)}
                        >
                          Click to Zoom
                        </button>
                      </div>
                      <img
                        src={park3Images.table2.src}
                        alt="Industrial Park 3 Area Table 2"
                        className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                        onClick={() => openViewer(park3Images.table2.src, park3Images.table2.title)}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <p className={`text-center text-xs mt-6 transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <span className="opacity-80">
              {viewMode === 'map'
                ? 'Use zoom buttons inside the map · Scroll to navigate when zoomed · Click any plot for details'
                : 'Click any drawing image to zoom into full resolution · Use search or filters above to find specific plots'}
            </span>
          </p>

        </div>

        {/* ════════ LIGHTBOX VIEWER ════════ */}
        <Lightbox
          open={viewerOpen}
          close={() => setViewerOpen(false)}
          slides={viewerSlides}
          plugins={[Zoom]}
        />
      </div>
    </>
  );
};

export default SiteMapPage;
