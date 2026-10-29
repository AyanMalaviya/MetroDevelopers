// src/pages/MetroIndustrialPark3.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin, Phone, ShieldCheck, Truck, Factory, Droplets,
  ArrowRight, Ruler, Hammer, Building2, Zap, HelpCircle,
  ChevronDown, Maximize2, Layers, CheckCircle, ExternalLink,
  Lightbulb, Sparkles, Shield, Clock, TrendingUp, Check
} from 'lucide-react';
import { FaRoad, FaWhatsapp } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import SEO from '../components/SEO/SEO';
import {
  metroPark3Schema,
  metroPark3ListingSchema,
  metroPark3FaqSchema
} from '../utils/schemas';

/* ── Section Header matching Park 1 ── */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className="text-amber-500">{icon}</div>
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
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all text-xs sm:text-sm font-semibold hover:scale-105 shadow-md shadow-orange-500/20 whitespace-nowrap"
      >
        <Maximize2 size={14} /> View Full Size
      </button>
    </div>
  </div>
);

const MetroIndustrialPark3 = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('areaTables'); // 'areaTables' | 'siteMap'
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSlides, setViewerSlides] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  const mapsUrl = 'https://maps.app.goo.gl/5SaRAjuzrQzLjoZh9';

  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial plots at Industrial Park 3 on Bavla Rajoda Road to Build My Own Shed. Please share the layout, available plot sizes, and pricing details.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openViewer = useCallback((src, title) => {
    setViewerSlides([{ src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' }]);
    setViewerOpen(true);
  }, []);

  const layoutImages = {
    areaTable1: {
      src: '/images/metro-industrial-park-3-area-table-1.png',
      alt: 'Metro Industrial Park 3 Plot Area Schedule Table 1 (Plots 1 to 39)',
      title: 'Area Schedule Table 1 (Plots 1 to 39)',
    },
    areaTable2: {
      src: '/images/metro-industrial-park-3-area-table-2.png',
      alt: 'Metro Industrial Park 3 Plot Area Schedule Table 2 (Plots 40 to 77)',
      title: 'Area Schedule Table 2 (Plots 40 to 77)',
    },
    siteMap: {
      src: '/images/metro-industrial-park-3-site-plan.jpg',
      alt: 'Metro Industrial Park 3 Master Layout Site Plan — 77 Plots on Bavla Rajoda Road',
      title: 'Master Site Plan Layout (77 Plots)',
    },
  };

  const features = [
    {
      icon: <FaRoad size={22} />,
      title: 'Wide Heavy RCC Road',
      description: '18-meter (~60 Ft) main cross-over road and 12-meter spine roads engineered for heavy multi-axle freight trailers.',
    },
    {
      icon: <Lightbulb size={22} />,
      title: 'Street Lights',
      description: 'Systematically installed street lighting along all internal roads for round-the-clock visibility and night operations.',
    },
    {
      icon: <Layers size={22} />,
      title: 'Puran (Soil Filling & Leveling)',
      description: 'High-grade soil filling (puran) and mechanical leveling actively ongoing on-site for flood-safe foundations.',
    },
    {
      icon: <Building2 size={22} />,
      title: 'Compound Wall',
      description: 'Robust perimeter boundary compound wall securing the entire ~60,000 sq.yard industrial park.',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: '24/7 Gated Security',
      description: 'Dedicated security entrance cabin and round-the-clock trained security personnel on duty (no CCTV).',
    },
  ];

  const specifications = [
    { label: 'Project', value: 'Industrial Park 3' },
    { label: 'Location', value: 'Bavla – Rajoda Road, Ahmedabad' },
    { label: 'Campus Area', value: '59,508 sq.yards (~12.3 Acres)' },
    { label: 'Total Plots', value: '77 Industrial Plots' },
    { label: 'Plot Sizing', value: '300 to 2,876 sq.yards' },
    { label: 'Metric Sizing', value: '251 to 2,404 sq.meters' },
    { label: 'Super Loading', value: '23.39%' },
    { label: 'Road Network', value: '18m & 12m Wide RCC Roads' },
    { label: 'Street Lighting', value: 'Street Lights Installed' },
    { label: 'Ground Status', value: 'Puran (Soil Filling Ongoing)' },
    { label: 'Boundary', value: 'Compound Wall' },
    { label: 'Security', value: '24/7 Gated Security (No CCTV)' },
    { label: 'Title Status', value: '100% Clear Title, NA Industrial' },
    { label: 'Possession', value: 'Possession Soon' },
    { label: 'Status', value: 'Bookings Open' },
  ];


  const faqs = [
    {
      q: 'What is Industrial Park 3 and where is it located?',
      a: 'Industrial Park 3 is our newly launched ~60,000 sq.yard (approx. 12.3 Acres) industrial plotting project located on Bavla – Rajoda Road, Ahmedabad. It offers 77 industrial plots specifically developed under the "Build Your Own Shed" concept for clients who want to construct custom factories, workshops, or warehouses.',
    },
    {
      q: 'What is the current status of ground filling and land possession at Park 3?',
      a: 'Ground filling and precision leveling work is actively ongoing on-site with heavy machinery. Bookings are officially OPEN across all 77 plots, and land possession will be handed over soon. Buyers receive pre-filled, leveled land engineered for zero-waterlogging and immediate foundation casting.',
    },
    {
      q: 'What road widths and transport facilities are provided in Industrial Park 3?',
      a: 'Industrial Park 3 is engineered for heavy container and trailer logistics. It features an 18.00-meter (~60 Ft) wide main cross-over road, 12.00-meter (~40 Ft) wide cross-over roads, and 9.00-meter wide internal spine roads, fully lined with street lights and gated security checkpoints.',
    },
    {
      q: 'What plot sizes are available at Industrial Park 3?',
      a: 'The park comprises 77 plots with areas ranging from 300 sq.yards up to 2,876 sq.yards. This includes compact 300–461 sq.yd plots (ideal for engineering workshops and small fabrication units), mid-sized 800–1,390 sq.yd parcels, and large 1,587–2,876 sq.yd plots (suitable for large logistics warehouses and manufacturing plants). Adjoining plots can also be combined.',
    },
    {
      q: 'What amenities and infrastructure are included by the developer?',
      a: 'Metro Developers provides developer infrastructure: Wide Heavy RCC internal roads (18m & 12m), Street lights, Puran (Soil filling & precision ground leveling ongoing), Compound wall, and 24/7 Gated security (no CCTV).',
    },
    {
      q: 'Are the titles clear and can I get bank loan approval?',
      a: 'Yes, 100%. All plots have approved Non-Agricultural (NA) Industrial status with clear legal titles and zero title encumbrances. Immediate sale deed registration is available, and plots are readily approved for commercial property loans by leading financial institutions.',
    },
    {
      q: 'How does Industrial Park 3 differ from Industrial Park 1 and Industrial Park 2?',
      a: 'Industrial Park 1 (Moraiya) offers ready-to-move industrial sheds and warehouses (4,000–50,000 sq.ft). Industrial Park 2 (Moraiya) offers clear-title industrial plots opposite Park 1. Industrial Park 3 (Bavla Rajoda Road) is our expansive 60,000 sq.yd plotted estate featuring 77 plots with bookings open, ground leveling ongoing, and possession soon.',
    },
  ];

  return (
    <>
      <SEO
        title="Metro Industrial Park 3 (MIP 3) | Industrial Plots in Bavla, Ahmedabad"
        description="Metro Industrial Park 3 (MIP 3) by Metro Developers on Bavla–Rajoda Road, Ahmedabad. 77 prime NA industrial plots (166 to 2,056 sq.yds). Bookings open! Features Wide Heavy RCC roads, Street lights, Puran (Soil filling ongoing), Compound wall, and 24/7 Gated security."
        canonical="/metro-industrial-park-3"
        keywords="metro industrial park 3, industrial park 3, MIP 3, MIP-3, MIP3, MIP bavla, metro industrial park bavla, industrial plots bavla rajoda road, build your own shed ahmedabad, industrial land for sale bavla, MIP, MIP ahmedabad"
        ogImage="/images/metro-industrial-park-3-site-plan.jpg"
        ogImageAlt="Metro Industrial Park 3 Master Layout Site Plan Bavla Rajoda Road Ahmedabad"
        structuredData={[metroPark3Schema, metroPark3ListingSchema, metroPark3FaqSchema]}
      />

      <h1 className="sr-only">
        Metro Industrial Park 3 (MIP 3) — Industrial Plots for Sale on Bavla Rajoda Road, Ahmedabad
      </h1>

      <div className="min-h-screen theme-bg-primary">
        {/* ════════ HERO ════════ */}
        <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 border-b theme-border overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Top Pill */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-amber-500/30 bg-amber-500/10 text-amber-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>New Launch • 77 Plots • Bookings Open</span>
              </span>

              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDark ? 'bg-gray-800/60 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}>
                <Clock size={12} className="text-amber-500" />
                <span>Leveling Ongoing • Possession Soon</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight theme-text-primary mb-2 leading-[1.15]">
              Industrial{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Park 3
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
                    ? 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-amber-500/50 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-amber-500/50 hover:text-gray-900 shadow-sm'
                }`}
              >
                <MapPin size={15} className="text-amber-500 shrink-0" />
                <span>Bavla – Rajoda Road, Ahmedabad (near Bavla GIDC &amp; NH 47)</span>
                <ExternalLink size={12} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
              </a>
            </div>

            {/* Subtitle / Lead Paragraph */}
            <p className="theme-text-secondary text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed mb-6">
              Following our proven <strong className="theme-text-primary">"Build Your Own Shed"</strong> model, Industrial Park 3 provides premium industrial plots across an expansive ~60,000 sq.yard campus. We provide <strong className="text-red-500">Wide Heavy RCC Roads</strong>, <strong className="text-orange-500">Street Lights</strong>, <strong className="text-amber-500">Puran (Soil Filling &amp; Leveling — ongoing)</strong>, <strong className="text-emerald-500">Compound Wall</strong>, and <strong className="text-blue-500">24/7 Gated Security</strong> so you can construct your customized shed without site preparation headaches.
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
                state={{ activeTab: 'park3' }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-transform hover:scale-105 whitespace-nowrap"
              >
                <MapPin size={15} />
                <span>Interactive Map</span>
                <ArrowRight size={13} />
              </Link>

              <a
                href="tel:+919824235642"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all hover:scale-105 whitespace-nowrap ${
                  isDark
                    ? 'border-gray-700 hover:border-amber-500 text-white'
                    : 'border-gray-300 hover:border-amber-500 text-gray-900 bg-white'
                }`}
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t theme-border">
              {[
                { value: '59,508', unit: 'SQYD', label: 'Total Campus Area' },
                { value: '77', unit: 'Plots', label: 'Industrial Parcels' },
                { value: '18m / 60ft', unit: 'Wide', label: 'Heavy Road Network' },
                { value: 'Open', unit: 'Bookings', label: 'Possession Soon' },
              ].map((m, i) => (
                <div key={i} className="theme-bg-card p-4 rounded-xl border theme-border">
                  <span className="text-xl sm:text-2xl font-black font-display text-amber-500 block leading-tight">
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
                        className="group relative theme-bg-card p-5 rounded-2xl border theme-border hover:border-amber-500/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 pointer-events-none" />
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-amber-500 bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                          {feat.icon}
                        </div>
                        <h3 className="text-base font-bold theme-text-primary mb-1.5 group-hover:text-amber-500 transition-colors">
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
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
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
                        <div className="space-y-6">
                          <ImageCard
                            src={layoutImages.areaTable1.src}
                            alt={layoutImages.areaTable1.alt}
                            title={layoutImages.areaTable1.title}
                            onOpen={() => openViewer(layoutImages.areaTable1.src, layoutImages.areaTable1.title)}
                            theme={theme}
                          />
                          <ImageCard
                            src={layoutImages.areaTable2.src}
                            alt={layoutImages.areaTable2.alt}
                            title={layoutImages.areaTable2.title}
                            onOpen={() => openViewer(layoutImages.areaTable2.src, layoutImages.areaTable2.title)}
                            theme={theme}
                          />
                        </div>
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
                    ? 'bg-gradient-to-r from-amber-950/40 via-gray-900 to-black border-amber-500/30'
                    : 'bg-gradient-to-r from-amber-50 via-orange-50 to-white border-amber-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 block mb-1">
                        Live Availability • Google Sheets Connected
                      </span>
                      <h3 className="text-xl font-black font-display theme-text-primary mb-1">
                        Check Live Plot Availability for Industrial Park 3
                      </h3>
                      <p className="theme-text-secondary text-xs sm:text-sm">
                        Hover or tap any plot on the digital master plan to view exact carpet SQMT, total SQYD, and live status.
                      </p>
                    </div>

                    <Link
                      to="/site-map"
                      state={{ activeTab: 'park3' }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-orange-500/25 transition-transform hover:scale-105"
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
                            className={`shrink-0 transition-transform duration-300 text-amber-500 ${
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
                            spec.label === 'Status' ? 'text-amber-500' : 'theme-text-primary'
                          }`}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Appreciation & Investment Potential Card */}
                  <div className={`rounded-2xl p-6 border ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-950/40 via-orange-950/20 to-transparent border-amber-500/30'
                      : 'bg-gradient-to-br from-amber-50 via-orange-50 to-white border-amber-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-amber-500" size={22} />
                      <h3 className="text-base font-bold theme-text-primary">
                        Capital Growth Corridor
                      </h3>
                    </div>
                    <p
                      className="text-3xl font-extrabold text-amber-500 mb-1"
                      style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}
                    >
                      18–25%
                    </p>
                    <p className="theme-text-tertiary text-xs leading-relaxed">
                      Expected yearly appreciation on the fast-growing Bavla–Rajoda corridor near NH 47.
                    </p>
                  </div>

                  {/* 3. Interested? Contact Card */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border shadow-sm">
                    <h3 className="text-base font-bold theme-text-primary mb-1 font-display">
                      Interested in Plots?
                    </h3>
                    <p className="theme-text-tertiary text-xs mb-5 leading-relaxed">
                      Contact us for availability schedule, custom plot configurations, and site inspection.
                    </p>
                    <div className="space-y-2.5">
                      <a
                        href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-orange-500/25 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <FaWhatsapp size={16} /> WhatsApp Directors
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 font-bold rounded-xl transition-all hover:scale-105 text-xs sm:text-sm whitespace-nowrap ${
                          isDark
                            ? 'border-gray-700 hover:border-amber-500 text-white'
                            : 'border-gray-300 hover:border-amber-500 text-gray-900'
                        }`}
                      >
                        <Phone size={16} /> Call Now
                      </a>
                    </div>
                  </div>

                  {/* 4. Possession Status Card */}
                  <div className="theme-bg-card rounded-2xl p-6 border theme-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-amber-500" size={22} />
                      <h3 className="text-base font-bold theme-text-primary font-display">
                        Possession Timeline
                      </h3>
                    </div>
                    <p
                      className="text-2xl font-extrabold theme-text-primary mb-1"
                      style={{ fontFamily: "'Bebas Neue','Oswald',sans-serif" }}
                    >
                      Possession Soon
                    </p>
                    <p className="theme-text-tertiary text-xs">
                      Ground filling ongoing · Bookings actively open
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

export default MetroIndustrialPark3;
