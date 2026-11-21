// src/pages/MetroIndustrialPark3.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin, Phone, ShieldCheck, ArrowRight, ArrowUpRight,
  Building2, Maximize2, Layers, ExternalLink, Lightbulb,
  Plus, Minus,
} from 'lucide-react';
import { FaRoad, FaWhatsapp } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import SEO from '../components/SEO/SEO';
import {
  metroPark3Schema,
  metroPark3ListingSchema,
  metroPark3FaqSchema,
  metroPark3IndividualUnitsSchema,
} from '../utils/schemas';

const EASE = [0.16, 1, 0.3, 1];

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

/* ── Editorial Section Heading ── */
const SectionHeader = ({ index, kicker, title, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`pb-5 mb-6 border-b ${t.border}`}>
      <div className="flex items-center gap-3 mb-2 font-mono text-[11px] tracking-[0.18em] uppercase">
        <span className="text-brand-red font-semibold">{index}</span>
        <span className={`w-5 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
        <span className={t.textMuted}>{kicker}</span>
      </div>
      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.textMain}`}>
        {title}
      </h2>
    </div>
  );
};

/* ── Technical Blueprint / Schedule Frame ── */
const ImageCard = ({ src, alt, title, onOpen, isDark, tall = false }) => {
  const t = getTokens(isDark);
  return (
    <div className={`border ${t.border} ${t.bgSurface}`}>
      <div className={`flex items-center justify-between px-4 sm:px-5 py-3 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]`}>
        <span className={t.textMuted}>{title}</span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline"
        >
          <Maximize2 size={12} aria-hidden="true" />
          <span>Expand</span>
        </button>
      </div>
      <div
        className={`${tall ? 'min-h-[420px]' : 'min-h-[320px]'} w-full ${
          isDark ? 'bg-[#09090B]' : 'bg-[#EFECE6]'
        } flex flex-col items-center justify-center p-4 sm:p-6`}
      >
        <img
          src={src}
          alt={alt}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className={`max-w-full h-auto cursor-zoom-in border ${t.border}`}
          onClick={onOpen}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<div class="text-gray-500 text-center p-8"><p class="text-base font-semibold mb-1">${title}</p><p class="text-xs font-mono uppercase">Drawing coming soon</p></div>`;
          }}
        />
      </div>
    </div>
  );
};

const MetroIndustrialPark3 = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  const [activeTab, setActiveTab] = useState('areaTables');
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

  const layoutImages = {
    areaTable1: {
      src: '/images/metro-industrial-park-3-area-table-1.png',
      alt: 'Metro Industrial Park 3 Plot Area Schedule Table 1 (Plots 1 to 39)',
      title: 'Area Schedule Table 1 — Plots 1 to 39',
    },
    areaTable2: {
      src: '/images/metro-industrial-park-3-area-table-2.png',
      alt: 'Metro Industrial Park 3 Plot Area Schedule Table 2 (Plots 40 to 77)',
      title: 'Area Schedule Table 2 — Plots 40 to 77',
    },
    siteMap: {
      src: '/images/metro-industrial-park-3-site-plan.jpg',
      alt: 'Metro Industrial Park 3 Master Layout Site Plan — 77 Plots on Bavla Rajoda Road',
      title: 'Master Site Plan Layout — 77 Plots',
    },
  };

  const openViewer = useCallback(
    (src, title) => {
      setViewerSlides(
        [
          { src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' },
          { src: layoutImages.areaTable1.src, title: layoutImages.areaTable1.title },
          { src: layoutImages.areaTable2.src, title: layoutImages.areaTable2.title },
          { src: layoutImages.siteMap.src, title: layoutImages.siteMap.title },
        ].filter((s, idx, arr) => arr.findIndex((item) => item.src === s.src) === idx)
      );
      setViewerOpen(true);
    },
    [
      layoutImages.areaTable1.src,
      layoutImages.areaTable1.title,
      layoutImages.areaTable2.src,
      layoutImages.areaTable2.title,
      layoutImages.siteMap.src,
      layoutImages.siteMap.title,
    ]
  );

  const features = [
    {
      code: 'INFRA 01',
      icon: <FaRoad size={18} aria-hidden="true" />,
      title: 'Wide Heavy RCC Road',
      description: '18m & 12m wide heavy RCC roads built for multi-axle freight trailers.',
    },
    {
      code: 'INFRA 02',
      icon: <Lightbulb size={18} aria-hidden="true" />,
      title: 'Street Lights',
      description: 'Internal street lighting for 24/7 visibility and night operations.',
    },
    {
      code: 'INFRA 03',
      icon: <Layers size={18} aria-hidden="true" />,
      title: 'Puran (Soil Filling & Leveling)',
      description: 'High-grade soil filling and mechanical leveling ready for foundations.',
    },
    {
      code: 'INFRA 04',
      icon: <Building2 size={18} aria-hidden="true" />,
      title: 'Compound Wall',
      description: 'Full perimeter boundary compound wall securing the ~60,000 sq.yd park.',
    },
    {
      code: 'INFRA 05',
      icon: <ShieldCheck size={18} aria-hidden="true" />,
      title: '24/7 Gated Security',
      description: 'Dedicated security entrance cabin and round-the-clock guards.',
    },
  ];

  const specifications = [
    { label: 'Project',             value: 'Industrial Park 3 (MIP 3)' },
    { label: 'Location',            value: 'Bavla – Rajoda Road, Ahmedabad' },
    { label: 'Campus Area',         value: '59,508 sq.yd (~12.3 Acres)' },
    { label: 'Total Plots',         value: '77 Industrial Plots' },
    { label: 'Plot Sizing',         value: '300 – 2,876 sq.yd' },
    { label: 'Metric Sizing',       value: '251 – 2,404 sq.m' },
    { label: 'Yearly Appreciation', value: '12–15%' },
    { label: 'Super Loading',       value: '23.39%' },
    { label: 'Road Network',        value: '18m & 12m Wide RCC Roads' },
    { label: 'Street Lighting',     value: 'Street Lights Installed' },
    { label: 'Ground Status',       value: 'Puran (Soil Filling Ongoing)' },
    { label: 'Boundary',            value: 'Compound Wall' },
    { label: 'Security',            value: '24/7 Gated Security (No CCTV)' },
    { label: 'Title Status',        value: '100% Clear Title, NA Industrial' },
    { label: 'Possession',          value: 'Possession Soon' },
    { label: 'Status',              value: 'Bookings Open' },
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
        title="Industrial Plots for Sale in Bavla, Ahmedabad | Metro Industrial Park 3"
        description="77 prime NA industrial plots (300 to 2,876 sq.yds) for sale on Bavla–Rajoda Road, Bavla, Ahmedabad. Bookings open! Wide Heavy RCC roads, Street lights, Puran (ground leveling), compound wall, 24/7 gated security."
        canonical="/metro-industrial-park-3"
        keywords="industrial plots in bavla, industrial plots bavla ahmedabad, industrial land for sale in bavla, industrial land bavla rajoda road, plots in bavla gidc, build your own shed bavla, metro industrial park 3, MIP 3, industrial property bavla ahmedabad, NA industrial plots bavla, industrial plots near nh 47"
        ogImage="/images/metro-industrial-park-3-site-plan.jpg"
        ogImageAlt="Metro Industrial Park 3 Master Layout Site Plan Bavla Rajoda Road Ahmedabad"
        structuredData={[metroPark3Schema, metroPark3ListingSchema, metroPark3IndividualUnitsSchema, metroPark3FaqSchema]}
      />

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ════════ HERO — ARCHITECTURAL DOSSIER HEADER ════════ */}
        <section className={`pt-20 sm:pt-24 border-b ${t.border} ${t.bgSurface}`}>
          {/* Top Coordinate & Status Bar */}
          <div className={`border-y ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-red" aria-hidden="true" />
                <span className={`font-semibold ${t.textMain}`}>MIP — 03</span>
                <span className={t.textMuted}>/</span>
                <span className={t.textMuted}>New Launch · 77 Industrial Plots · Bookings Open</span>
              </span>
              <span className={`inline-flex items-center gap-2 ${t.textMuted}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                Leveling Ongoing · Possession Soon
              </span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
            >
              <div className="lg:col-span-8">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] mb-4 ${t.textMuted} hover:text-brand-red transition-colors`}
                >
                  <MapPin size={13} className="text-brand-red shrink-0" aria-hidden="true" />
                  <span>Bavla – Rajoda Road, Ahmedabad (Near Bavla GIDC &amp; NH 47)</span>
                  <ExternalLink size={11} aria-hidden="true" />
                </a>

                <h1 className={`text-3xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.15] mb-5 ${t.textMain}`}>
                  Metro{' '}
                  <span className="font-serif-editorial italic font-normal text-[1.18em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-brand-red inline-block">
                    Industrial
                  </span>{' '}
                  Park 3<span className="text-brand-red">.</span>
                </h1>

                <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${t.textBody}`}>
                  Following our proven <strong className={t.textMain}>“Build Your Own Shed”</strong> model,
                  Industrial Park 3 delivers 77 industrial plots across an expansive ~60,000 sq.yard campus.
                  Includes Wide Heavy RCC Roads (18m &amp; 12m), Street Lights, Puran (Soil Filling &amp;
                  Leveling — ongoing), Compound Wall, and 24/7 Gated Security.
                </p>
              </div>

              {/* Action Stack */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <Link
                  to="/site-map"
                  state={{ activeTab: 'park3' }}
                  className="w-full py-3.5 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} aria-hidden="true" />
                    <span>Open Interactive Plot Map</span>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-3 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-emerald-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors`}
                  >
                    <FaWhatsapp size={14} className="text-emerald-600" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="tel:+919824235642"
                    className={`py-3 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red font-bold text-xs uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors`}
                  >
                    <Phone size={13} className="text-brand-red" aria-hidden="true" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 4-Column Architectural Metrics Band */}
            <div className={`mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {[
                { code: '01', value: '59,508', unit: 'SQ.YD',    label: 'Total Campus (~12.3 Acres)', accent: false },
                { code: '02', value: '77',     unit: 'PLOTS',    label: '300 – 2,876 sq.yd Parcels',  accent: false },
                { code: '03', value: '18m',    unit: '/ 60 FT',  label: 'Heavy RCC Road Network',     accent: false },
                { code: '04', value: 'Open',   unit: 'BOOKINGS', label: 'Leveling Ongoing',           accent: true  },
              ].map((m) => (
                <div key={m.code} className={`p-5 sm:p-6 border-r border-b ${t.border} ${t.bgPage}`}>
                  <div className={`font-mono text-[10px] mb-3 ${t.textMuted}`}>{m.code}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${m.accent ? 'text-brand-red' : t.textMain}`}>
                      {m.value}
                    </span>
                    <span className={`font-mono text-[10px] font-semibold ${t.textMuted}`}>{m.unit}</span>
                  </div>
                  <div className={`text-xs mt-1 ${t.textBody}`}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ MAIN CONTENT: 12-COL ARCHITECTURAL SPLIT ════════ */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

              {/* ── LEFT 8 COLS: Infrastructure, Drawings, Live Map, FAQ ── */}
              <div className="lg:col-span-8 space-y-16">

                {/* 01. Developer Infrastructure */}
                <div>
                  <SectionHeader
                    index="01"
                    kicker="Master-Planned Campus"
                    title={
                      <>
                        Developer{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                          Infrastructure
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className="flex flex-col gap-5 sm:gap-6 w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {features.map((feat, i) => {
                      const isEven = i % 2 === 0;
                      return (
                        <motion.article
                          key={feat.code}
                          initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.65, ease: EASE }}
                          className={`w-[82%] sm:w-[70%] lg:w-[58%] max-w-lg p-5 sm:p-6 border ${t.border} ${t.bgSurface} ${
                            isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'
                          } transition-colors ${
                            isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-red">
                              {feat.code}
                            </span>
                            <span className={`w-8 h-8 border ${t.border} ${t.bgPage} flex items-center justify-center ${t.textMain}`}>
                              {feat.icon}
                            </span>
                          </div>
                          <h3 className={`text-base sm:text-lg font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                            {feat.title}
                          </h3>
                          <p className={`text-xs sm:text-sm leading-relaxed ${t.textBody}`}>
                            {feat.description}
                          </p>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                {/* 02. Layout & Area Details */}
                <div>
                  <SectionHeader
                    index="02"
                    kicker="Technical Drawings"
                    title={
                      <>
                        Layout &amp;{' '}
                        <span className="font-serif-editorial italic text-brand-red inline-block">
                          Area Details
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />

                  {/* Sharp Segmented Tab Bar */}
                  <div className={`inline-grid grid-cols-2 border ${t.border} divide-x ${t.divide} mb-6`}>
                    {[
                      { key: 'areaTables', label: 'Area Details' },
                      { key: 'siteMap',    label: 'Site Map' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                          activeTab === tab.key
                            ? 'bg-brand-red text-white'
                            : `${t.bgSurface} ${t.textBody} hover:text-brand-red`
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="space-y-6"
                    >
                      {activeTab === 'areaTables' ? (
                        <>
                          <ImageCard
                            src={layoutImages.areaTable1.src}
                            alt={layoutImages.areaTable1.alt}
                            title={layoutImages.areaTable1.title}
                            onOpen={() => openViewer(layoutImages.areaTable1.src, layoutImages.areaTable1.title)}
                            isDark={isDark}
                          />
                          <ImageCard
                            src={layoutImages.areaTable2.src}
                            alt={layoutImages.areaTable2.alt}
                            title={layoutImages.areaTable2.title}
                            onOpen={() => openViewer(layoutImages.areaTable2.src, layoutImages.areaTable2.title)}
                            isDark={isDark}
                          />
                        </>
                      ) : (
                        <div className={`border ${t.border} ${t.bgSurface}`}>
                          <div className={`flex flex-wrap items-center justify-between px-4 sm:px-5 py-3 border-b ${t.border} font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] gap-2`}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className={t.textMain}>Google Maps Satellite · Metro Industrial Park 3</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => openViewer(layoutImages.siteMap.src, layoutImages.siteMap.title)}
                                className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline"
                              >
                                <Maximize2 size={12} aria-hidden="true" />
                                <span>Inspect Blueprint</span>
                              </button>
                              <a
                                href="https://maps.app.goo.gl/5SaRAjuzrQzLjoZh9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-brand-red font-semibold hover:underline"
                              >
                                <ExternalLink size={12} aria-hidden="true" />
                                <span>Google Maps</span>
                              </a>
                            </div>
                          </div>
                          <div className="w-full h-[450px] sm:h-[540px] relative bg-black">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1839.2!2d72.3762037!3d22.8443566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e957aa2ecae27%3A0xd48c58cbda2742b!2sMetro%20Industrial%20Park%203!5e1!3m2!1sen!2sin!4v1782834808336!5m2!1sen!2sin"
                              title="Metro Industrial Park 3 Google Maps Satellite"
                              className="w-full h-full border-0 absolute inset-0"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      )}
                      <p className={`font-mono text-[11px] uppercase tracking-wider text-center ${t.textMuted}`}>
                        Click drawing to inspect full resolution · Pinch to zoom on mobile
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Live Plot Selector Strip */}
                <div className={`relative border ${t.border} ${t.bgSurface} p-6 sm:p-8`}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red block mb-2">
                        Live Availability · Google Sheets Connected
                      </span>
                      <h3 className={`text-xl font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                        Check Live Plot Availability for Industrial Park 3
                      </h3>
                      <p className={`text-sm leading-relaxed ${t.textBody}`}>
                        Hover or tap any plot on the digital master plan to view exact carpet SQMT, total SQYD, and live booking status.
                      </p>
                    </div>

                    <Link
                      to="/site-map"
                      state={{ activeTab: 'park3' }}
                      className="py-3.5 px-6 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
                    >
                      <MapPin size={14} aria-hidden="true" />
                      <span>Open Map</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* 03. FAQ Accordion */}
                <div>
                  <SectionHeader
                    index="03"
                    kicker="Buyer Clarifications"
                    title={
                      <>
                        Frequently Asked{' '}
                        <span className="font-calligraphy font-normal text-[1.18em] tracking-normal text-amber-500 inline-block">
                          Questions
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`border ${t.border} divide-y ${t.divide}`}>
                    {faqs.map((faq, index) => {
                      const isOpen = openFaq === index;
                      return (
                        <div key={index} className={t.bgSurface}>
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? -1 : index)}
                            aria-expanded={isOpen}
                            className={`w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between gap-4 transition-colors ${
                              isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <span className="font-mono text-xs text-brand-red font-semibold pt-0.5 tabular-nums">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className={`font-bold text-sm sm:text-base tracking-tight ${t.textMain}`}>
                                {faq.q}
                              </span>
                            </div>
                            <span
                              aria-hidden="true"
                              className={`w-7 h-7 border ${t.border} flex items-center justify-center shrink-0 transition-colors ${
                                isOpen ? 'border-brand-red text-brand-red' : t.textMuted
                              }`}
                            >
                              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <div className={`px-5 sm:px-6 pb-5 pl-12 sm:pl-14 text-sm leading-relaxed ${t.textBody}`}>
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── RIGHT 4 COLS: STICKY SPECIFICATION LEDGER ── */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">

                  {/* 1. Specifications Ledger */}
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
                      <h3 className={`font-mono text-xs font-bold uppercase tracking-[0.16em] ${t.textMain}`}>
                        Specifications
                      </h3>
                      <span className="font-mono text-[10px] text-brand-red font-semibold">MIP 03</span>
                    </div>
                    <dl className={`divide-y ${t.divide} px-6`}>
                      {specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 py-3 text-xs">
                          <dt className={`font-mono uppercase tracking-wider shrink-0 ${t.textMuted}`}>
                            {spec.label}
                          </dt>
                          <dd className={`font-semibold text-right tabular-nums ${
                            spec.label === 'Status' ? 'text-amber-500' : t.textMain
                          }`}>
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* 2. Land Appreciation Card */}
                  <div className={`relative border ${t.border} ${t.bgSurface} p-6`}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Capital Trajectory
                    </div>
                    <div className="text-4xl font-bold tracking-tight tabular-nums text-brand-red mb-1">
                      12–15%
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.textMain}`}>
                      Expected Yearly Land Appreciation
                    </div>
                    <p className={`text-xs leading-relaxed ${t.textBody}`}>
                      Projected annual land appreciation along the expanding Bavla–Rajoda NH 47 industrial corridor.
                    </p>
                  </div>

                  {/* 3. Direct Directors Desk */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                      Interested in Plots?
                    </h3>
                    <p className={`text-xs leading-relaxed mb-5 ${t.textBody}`}>
                      Contact us for the availability schedule, custom plot configurations, and guided site inspection.
                    </p>
                    <div className="space-y-2.5">
                      <a
                        href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} aria-hidden="true" />
                          <span>WhatsApp Directors</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`w-full py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Phone size={14} className="text-brand-red" aria-hidden="true" />
                          <span className="tabular-nums">+91 98242 35642</span>
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* 4. Possession Timeline */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Possession Timeline
                    </div>
                    <div className={`text-xl font-bold tracking-tight mb-1 ${t.textMain}`}>
                      Possession Soon
                    </div>
                    <p className={`text-xs ${t.textBody}`}>
                      Ground filling &amp; leveling ongoing · Bookings actively open across 77 plots
                    </p>
                  </div>

                </div>
              </aside>
            </div>
          </div>
        </section>

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

export default MetroIndustrialPark3;