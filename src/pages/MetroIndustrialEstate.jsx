// src/pages/MetroIndustrialEstate.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin, Phone, ShieldCheck, Truck, Factory, Droplets,
  ArrowRight, Ruler, Hammer, Building2, Zap, HelpCircle,
  ChevronDown, Maximize2, Layers, CheckCircle, ExternalLink,
  Clock, TrendingUp, Compass, Check, Filter, Lightbulb
} from 'lucide-react';
import { FaRoad, FaWhatsapp } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import SEO from '../components/SEO/SEO';
import {
  metroEstateSchema,
  metroEstateListingSchema,
  metroEstateFaqSchema
} from '../utils/schemas';

/* ── Section Header matching Park 1 ── */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className="text-brand-red">{icon}</div>
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold theme-text-primary tracking-tight font-display">
      {title}
    </h2>
  </div>
);

/* ── ImageCard matching Park 1 with zoom and Lightbox trigger ── */
const ImageCard = ({ src, alt, title, onOpen, theme, tall = false }) => (
  <div className="theme-bg-card rounded-2xl border theme-border overflow-hidden shadow-sm">
    <div className={`${tall ? 'min-h-[480px]' : 'min-h-[360px]'} w-full ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
    } flex flex-col items-center justify-center p-4`}>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="max-w-full h-auto cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 rounded-lg shadow"
        onClick={onOpen}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">${title}</p><p class="text-sm">Image coming soon</p></div>`;
        }}
      />
      <button
        onClick={onOpen}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-red-700 text-white rounded-xl transition-all text-xs sm:text-sm font-semibold hover:scale-105 shadow-md shadow-brand-red/25 whitespace-nowrap"
      >
        <Maximize2 size={14} /> View Full Size
      </button>
    </div>
  </div>
);

const MetroIndustrialEstate = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('areaTables'); // 'areaTables' | 'siteMap'
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSlides, setViewerSlides] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  const mapsUrl = 'https://maps.app.goo.gl/oBMDfb38sNuo4pjD9';

  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial plots at Industrial Park 2 (Moraiya, Changodar) to Build My Own Shed. Please share layout details, available plot sizes, and pricing.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ── Layout images matching Park 1 ── */
  const layoutImages = {
    areaTable: {
      src: '/images/metro-industrial-park-2-area-table.png',
      alt: 'Industrial Park 2 Official Area Details Table — 23 Sub Plots Area Breakdown Moraiya Changodar',
      title: 'Area Details Table (23 Plots Schedule)',
    },
    siteMap: {
      src: '/images/metro-industrial-park-2-site-plan.jpg',
      alt: 'Industrial Park 2 Master Site Plan Layout Map — Moraiya Changodar Ahmedabad',
      title: 'Master Site Plan — 23 Plots',
    },
  };

  const openViewer = useCallback((src, title) => {
    setViewerSlides([
      { src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' },
      { src: layoutImages.areaTable.src, title: layoutImages.areaTable.title },
      { src: layoutImages.siteMap.src, title: layoutImages.siteMap.title },
    ].filter((s, idx, arr) => arr.findIndex(t => t.src === s.src) === idx));
    setViewerOpen(true);
  }, [layoutImages.areaTable.src, layoutImages.areaTable.title, layoutImages.siteMap.src, layoutImages.siteMap.title]);

  const features = [
    {
      icon: <FaRoad size={22} />,
      title: 'Wide Heavy RCC Road',
      description: 'Reinforced cement concrete internal roads built for multi-axle freight trailers and container movement.',
    },
    {
      icon: <Lightbulb size={22} />,
      title: 'Street Lights',
      description: 'Systematically installed street lighting along all internal roads for round-the-clock visibility and security.',
    },
    {
      icon: <Layers size={22} />,
      title: 'Puran (Soil Filling & Leveling)',
      description: 'Completed high-grade soil filling (puran) and precision mechanical leveling for immediate foundation casting.',
    },
    {
      icon: <Building2 size={22} />,
      title: 'Compound Wall',
      description: 'Robust perimeter boundary compound wall securing the entire 17,545 sq.yard industrial campus.',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: '24/7 Gated Security',
      description: 'Dedicated security entrance cabin and round-the-clock trained security personnel on duty (no CCTV).',
    },
  ];

  const specifications = [
    { label: 'Project', value: 'Industrial Park 2' },
    { label: 'Location', value: 'Moraiya, Changodar (Opp. Park 1)' },
    { label: 'Campus Area', value: '17,545.33 sq.yards (14,670.01 SQ.MT)' },
    { label: 'Total Plots', value: '23 Industrial Plots' },
    { label: 'Plot Sizing', value: '312.16 to 1,930.90 sq.yards' },
    { label: 'Concept', value: 'Build Your Own Shed' },
    { label: 'Road Network', value: 'Wide Heavy RCC Road' },
    { label: 'Street Lighting', value: 'Street Lights Installed' },
    { label: 'Ground Status', value: 'Puran (Soil Filling Done)' },
    { label: 'Boundary', value: 'Compound Wall' },
    { label: 'Security', value: '24/7 Gated Security (No CCTV)' },
    { label: 'Title Status', value: '100% Clear Title, NA Industrial' },
    { label: 'Possession', value: 'Immediate' },
    { label: 'Status', value: 'Plots Available' },
  ];


  const faqs = [
    {
      q: 'What is Industrial Park 2 and how does "Build Your Own Shed" work?',
      a: 'Industrial Park 2 is our specialized industrial plotted development situated directly opposite Industrial Park 1 in Moraiya, Changodar. Instead of buying a pre-built shed with fixed specifications, "Build Your Own Shed" allows you to purchase a clear-title industrial plot and construct a custom-designed factory or warehouse perfectly matched to your specific machinery height, floor load, crane requirements, and administrative offices.',
    },
    {
      q: 'What facilities are provided by the developer at Industrial Park 2?',
      a: 'Metro Developers delivers complete on-ground infrastructure: Wide Heavy RCC internal roads, Street lights, Puran (Soil filling & precision ground leveling), Compound wall, and 24/7 Gated security (no CCTV).',
    },
    {
      q: 'What plot sizes are available at Industrial Park 2?',
      a: 'The estate features 23 plots across three designated blocks (Block A, Block B, and Block C). Plot sizes range from approximately 312 sq.yards up to 1,930 sq.yards (261 to 1,614 sq.meters). Multiple contiguous plots can also be merged together for businesses needing 2,500 to 5,000+ sq.yards of continuous industrial land.',
    },
    {
      q: 'Are the plots legally approved with clear titles?',
      a: 'Yes, 100%. All plots have approved Non-Agricultural (NA) Industrial status with clean, marketable titles free of legal encumbrances. Immediate sale deed registration is available, and plots are readily approved for commercial property loans by leading financial institutions.',
    },
    {
      q: 'Where is Industrial Park 2 located?',
      a: 'Industrial Park 2 is located directly opposite Industrial Park 1 in Moraiya, Changodar, Ahmedabad (382213). It is positioned minutes from the Sarkhej–Bavla National Highway (NH 47), offering quick transit to Sanand GIDC, Ahmedabad city, and the western port corridors (Mundra/Kandla).',
    },
    {
      q: 'Can I visit the site and check plot availability today?',
      a: 'Yes! You can explore our live plot availability map on this website under the Site Map section, or book a physical guided site inspection with our directors by calling +91 98242 35642 or +91 63567 66767.',
    },
  ];

  return (
    <>
      <SEO
        title="Metro Industrial Park 2 (MIP 2) | Industrial Plots in Moraiya, Changodar"
        description="Metro Industrial Park 2 (MIP 2) by Metro Developers — clear-title NA industrial plots (312 to 1,930 sq.yds) opposite Park 1 in Moraiya, Changodar. Build Your Own Shed with Wide Heavy RCC roads, Street lights, Puran (Soil filling), Compound wall, and 24/7 Gated security."
        canonical="/metro-industrial-estate"
        keywords="metro industrial park 2, industrial park 2, MIP 2, MIP-2, MIP2, metro industrial estate, MIP, MIP moraiya, build your own shed ahmedabad, industrial plots changodar, industrial land for sale moraiya, industrial plots moraiya, NA industrial land ahmedabad"
        ogImage="/images/metro-industrial-park-2-site-plan.jpg"
        ogImageAlt="Industrial Park 2 Site Plan Moraiya Changodar Ahmedabad"
        structuredData={[metroEstateSchema, metroEstateListingSchema, metroEstateFaqSchema]}
      />

      <h1 className="sr-only">
        Metro Industrial Park 2 (MIP 2) — Industrial Plots for Sale in Moraiya, Changodar, Ahmedabad
      </h1>

      <div className="min-h-screen theme-bg-primary">
        {/* ════════ HERO ════════ */}
        <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 border-b theme-border overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Top Pill */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-brand-red/30 bg-brand-red/10 text-brand-red">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
                </span>
                <span>Industrial Park 2 • 23 Industrial Plots</span>
              </span>

              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDark ? 'bg-gray-800/60 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}>
                <CheckCircle size={12} className="text-green-500" />
                <span>100% NA Land • Immediate Possession</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight theme-text-primary mb-2 leading-[1.15]">
              Metro{' '}
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Industrial Park 2
              </span>
            </h1>

            {/* Location Pill */}
            <div className="mb-4 sm:mb-5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                  isDark
                    ? 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-red-500/50 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-500/50 hover:text-gray-900 shadow-sm'
                }`}
              >
                <MapPin size={15} className="text-brand-red shrink-0" />
                <span>Directly Opposite Industrial Park 1, Moraiya, Changodar (Near NH 47)</span>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-brand-red transition-colors" />
              </a>
            </div>

            {/* Subtitle / Lead Paragraph */}
            <p className="theme-text-secondary text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed mb-6">
              We provide clear-title industrial plots for you to <strong className="theme-text-primary">"Build Your Own Shed"</strong> with developer-provided infrastructure: <strong className="text-red-500">Wide Heavy RCC Roads</strong>, <strong className="text-orange-500">Street Lights</strong>, <strong className="text-amber-500">Puran (Soil Filling &amp; Leveling)</strong>, <strong className="text-emerald-500">Compound Wall</strong>, and <strong className="text-blue-500">24/7 Gated Security</strong>. Own the valuable land and custom-build your factory or warehouse without architectural compromises.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-green-600/20 transition-transform hover:scale-105 whitespace-nowrap"
              >
                <FaWhatsapp size={16} />
                <span>Enquire on WhatsApp</span>
              </a>

              <Link
                to="/site-map"
                state={{ activeTab: 'estate' }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 via-brand-red to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 transition-transform hover:scale-105 whitespace-nowrap"
              >
                <MapPin size={15} />
                <span>Interactive Map</span>
                <ArrowRight size={13} />
              </Link>

              <a
                href="tel:+919824235642"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all hover:scale-105 whitespace-nowrap ${
                  isDark
                    ? 'border-gray-700 hover:border-brand-red text-white'
                    : 'border-gray-300 hover:border-brand-red text-gray-900 bg-white'
                }`}
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t theme-border">
              {[
                { value: '23', unit: 'Plots', label: 'Blocks A, B & C' },
                { value: '17,545', unit: 'SQYD', label: '14,670 SQ.MTR Total' },
                { value: '100%', unit: 'NA', label: 'Clear Marketable Title' },
                { value: '24/7', unit: 'Security', label: 'Gated Security (No CCTV)' },
              ].map((m, i) => (
                <div key={i} className="theme-bg-card p-4 rounded-xl border theme-border">
                  <span className="text-xl sm:text-2xl font-black font-display text-brand-red block leading-tight">
                    {m.value} <span className="text-xs font-bold text-gray-400">{m.unit}</span>
                  </span>
                  <span className="text-xs theme-text-secondary font-medium">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ MAIN CONTENT: 2-COLUMN GRID MATCHING PARK 1 ════════ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── LEFT COLUMN (2 COLS): Features, Facilities, Layout & FAQ ── */}
              <div className="lg:col-span-2 space-y-12">

                {/* 1. Key Features Grid */}
                <div>
                  <SectionHeader icon={<ShieldCheck size={26} />} title="Developer Infrastructure" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((feat, i) => (
                      <div
                        key={i}
                        className="group relative theme-bg-card p-5 rounded-2xl border theme-border hover:border-brand-red/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500 pointer-events-none" />
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                          {feat.icon}
                        </div>
                        <h3 className="text-base font-bold theme-text-primary mb-1.5 group-hover:text-brand-red transition-colors">
                          {feat.title}
                        </h3>
                        <p className="theme-text-secondary text-xs sm:text-sm leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>



                {/* 3. Layout & Site Plan Section matching Park 1 with Area Details */}
                <div>
                  <SectionHeader icon={<MapPin size={26} />} title="Layout & Area Details" />

                  {/* Tabs matching Park 1 */}
                  <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
                    {[
                      { key: 'areaTables', label: 'Area Details' },
                      { key: 'siteMap', label: 'Site Map' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                          activeTab === tab.key
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                            : isDark
                              ? 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28 }}
                      className="space-y-6"
                    >
                      {activeTab === 'areaTables' ? (
                        <ImageCard
                          src={layoutImages.areaTable.src}
                          alt={layoutImages.areaTable.alt}
                          title={layoutImages.areaTable.title}
                          onOpen={() => openViewer(layoutImages.areaTable.src, layoutImages.areaTable.title)}
                          theme={theme}
                        />
                      ) : (
                        <ImageCard
                          src={layoutImages.siteMap.src}
                          alt={layoutImages.siteMap.alt}
                          title={layoutImages.siteMap.title}
                          onOpen={() => openViewer(layoutImages.siteMap.src, layoutImages.siteMap.title)}
                          theme={theme}
                          tall
                        />
                      )}
                      <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Click image or button to zoom · Pinch on mobile
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 4. Interactive Live Site Map Banner */}
                <div className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-r from-red-950/40 via-gray-900 to-black border-brand-red/30'
                    : 'bg-gradient-to-r from-red-50 via-orange-50 to-white border-red-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block mb-1">
                        Live Plot Selector • Moraiya Campus
                      </span>
                      <h3 className="text-xl font-black font-display theme-text-primary mb-1">
                        Check Live Plot Availability for Industrial Park 2
                      </h3>
                      <p className="theme-text-secondary text-xs sm:text-sm">
                        Explore available plots across Block A, B, and C with live status and direct enquiry on our interactive map.
                      </p>
                    </div>

                    <Link
                      to="/site-map"
                      state={{ activeTab: 'estate' }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-red-500/25 transition-transform hover:scale-105"
                    >
                      <MapPin size={15} />
                      <span>Open Interactive Map</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* 5. FAQ Accordion */}
                <div>
                  <SectionHeader icon={<HelpCircle size={26} />} title="Frequently Asked Questions" />
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className={`rounded-2xl border transition-colors ${
                          isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                        >
                          <span className={`font-bold text-sm sm:text-base font-display ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {faq.q}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`shrink-0 transition-transform duration-300 text-brand-red ${
                              openFaq === index ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {openFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className={`px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                                isDark ? 'text-gray-400 border-gray-800' : 'text-gray-600 border-gray-100'
                              }`}>
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN (1 COL): STICKY SIDEBAR SPECIFICATIONS MATCHING PARK 1 ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">

                  {/* 1. Specifications Card on the Side */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border shadow-sm">
                    <h3 className="text-lg font-bold theme-text-primary mb-5 pb-3 border-b theme-border font-display">
                      Specifications
                    </h3>
                    <div className="space-y-3">
                      {specifications.map((spec, i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-start gap-3 pb-3 border-b last:border-0 last:pb-0 ${
                            isDark ? 'border-gray-800' : 'border-gray-100'
                          }`}
                        >
                          <span className="theme-text-tertiary text-xs sm:text-sm shrink-0">
                            {spec.label}
                          </span>
                          <span className={`font-semibold text-xs sm:text-sm text-right ${
                            spec.label === 'Status' ? 'text-green-500' : 'theme-text-primary'
                          }`}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. ROI & Appreciation Potential Card */}
                  <div className={`rounded-2xl p-6 border ${
                    isDark
                      ? 'bg-gradient-to-br from-emerald-950/40 via-gray-900 to-transparent border-emerald-500/30'
                      : 'bg-gradient-to-br from-emerald-50 via-lime-50 to-white border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-emerald-500" size={22} />
                      <h3 className="text-base font-bold theme-text-primary">
                        Dual Asset Appreciation
                      </h3>
                    </div>
                    <p
                      className="text-3xl font-extrabold text-emerald-500 mb-1"
                      style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}
                    >
                      16–22%
                    </p>
                    <p className="theme-text-tertiary text-xs leading-relaxed">
                      Land equity appreciation + rental yield potential upon custom shed construction in Changodar.
                    </p>
                  </div>

                  {/* 3. Interested? Contact Card */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border shadow-sm">
                    <h3 className="text-base font-bold theme-text-primary mb-1 font-display">
                      Interested in Plots?
                    </h3>
                    <p className="theme-text-tertiary text-xs mb-5 leading-relaxed">
                      Contact us for plot rates, contiguous land parcel merging, and guided site visits.
                    </p>
                    <div className="space-y-2.5">
                      <a
                        href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-brand-red/30 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <FaWhatsapp size={16} /> WhatsApp Directors
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 font-bold rounded-xl transition-all hover:scale-105 text-xs sm:text-sm whitespace-nowrap ${
                          isDark
                            ? 'border-gray-700 hover:border-brand-red text-white'
                            : 'border-gray-300 hover:border-brand-red text-gray-900'
                        }`}
                      >
                        <Phone size={16} /> Call Now
                      </a>
                    </div>
                  </div>

                  {/* 4. Possession Status Card */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-brand-red" size={22} />
                      <h3 className="text-base font-bold theme-text-primary font-display">
                        Quick Possession
                      </h3>
                    </div>
                    <p
                      className="text-2xl font-extrabold theme-text-primary mb-1"
                      style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}
                    >
                      Immediate Handover
                    </p>
                    <p className="theme-text-tertiary text-xs">
                      Ready for immediate custom construction · Clear title
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

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

export default MetroIndustrialEstate;
