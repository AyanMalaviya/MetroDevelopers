// src/pages/MetroIndustrialEstate.jsx
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
  metroEstateSchema,
  metroEstateListingSchema,
  metroEstateFaqSchema,
  metroEstateIndividualUnitsSchema,
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

const MetroIndustrialEstate = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  const [activeTab, setActiveTab] = useState('areaTables');
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

  const layoutImages = {
    areaTable: {
      src: '/images/metro-industrial-park-2-area-table.png',
      alt: 'Industrial Park 2 Official Area Details Table — 23 Sub Plots Area Breakdown Moraiya Changodar',
      title: 'Area Details Table — 23 Plots Schedule',
    },
    siteMap: {
      src: '/images/metro-industrial-park-2-site-plan.jpg',
      alt: 'Industrial Park 2 Master Site Plan Layout Map — Moraiya Changodar Ahmedabad',
      title: 'Master Site Plan — 23 Plots',
    },
  };

  const openViewer = useCallback(
    (src, title) => {
      setViewerSlides(
        [
          { src, title, description: 'Click zoom icon or scroll to zoom · Pinch on mobile' },
          { src: layoutImages.areaTable.src, title: layoutImages.areaTable.title },
          { src: layoutImages.siteMap.src, title: layoutImages.siteMap.title },
        ].filter((s, idx, arr) => arr.findIndex((item) => item.src === s.src) === idx)
      );
      setViewerOpen(true);
    },
    [layoutImages.areaTable.src, layoutImages.areaTable.title, layoutImages.siteMap.src, layoutImages.siteMap.title]
  );

  const features = [
    {
      code: 'INFRA 01',
      icon: <FaRoad size={18} aria-hidden="true" />,
      title: 'Wide Heavy RCC Road',
      description: 'Heavy RCC roads built for freight trailers.',
    },
    {
      code: 'INFRA 02',
      icon: <Lightbulb size={18} aria-hidden="true" />,
      title: 'Street Lights',
      description: 'Systematic lighting across all internal roads.',
    },
    {
      code: 'INFRA 03',
      icon: <Layers size={18} aria-hidden="true" />,
      title: 'Puran (Soil Filling & Leveling)',
      description: 'Soil filling and leveling done. Ready to build.',
    },
    {
      code: 'INFRA 04',
      icon: <Building2 size={18} aria-hidden="true" />,
      title: 'Compound Wall',
      description: 'Secure boundary wall around the campus.',
    },
    {
      code: 'INFRA 05',
      icon: <ShieldCheck size={18} aria-hidden="true" />,
      title: '24/7 Gated Security',
      description: '24/7 gated security cabin and guards.',
    },
  ];

  const specifications = [
    { label: 'Project',             value: 'Industrial Park 2 (MIP 2)' },
    { label: 'Location',            value: 'Moraiya, Changodar (Opp. Park 1)' },
    { label: 'Campus Area',         value: '17,545.33 sq.yd (14,670.01 sq.m)' },
    { label: 'Total Plots',         value: '23 Industrial Plots' },
    { label: 'Plot Sizing',         value: '312.16 – 1,930.90 sq.yd' },
    { label: 'Yearly Appreciation', value: '12–15%' },
    { label: 'Concept',             value: 'Build Your Own Shed' },
    { label: 'Road Network',        value: 'Wide Heavy RCC Road' },
    { label: 'Street Lighting',     value: 'Street Lights Installed' },
    { label: 'Ground Status',       value: 'Puran (Soil Filling Done)' },
    { label: 'Boundary',            value: 'Compound Wall' },
    { label: 'Security',            value: '24/7 Gated Security (No CCTV)' },
    { label: 'Title Status',        value: '100% Clear Title, NA Industrial' },
    { label: 'Possession',          value: 'Immediate' },
    { label: 'Status',              value: 'Plots Available' },
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
        title="Industrial Plots for Sale in Changodar, Ahmedabad | Metro Industrial Park 2"
        description="Clear-title NA industrial plots (312 to 1,930 sq.yds) for sale in Changodar (Moraiya), Ahmedabad to Build Your Own Shed. Wide Heavy RCC roads, Street lights, Puran (Soil filling), Compound wall, and 24/7 Gated security."
        canonical="/metro-industrial-estate"
        keywords="industrial plots in changodar, industrial land for sale changodar, industrial plots in moraiya, industrial plots ahmedabad, build your own shed ahmedabad, NA industrial plots changodar, metro industrial park 2, MIP 2, industrial land changodar ahmedabad, industrial plots near nh 47"
        ogImage="/images/metro-industrial-park-2-site-plan.jpg"
        ogImageAlt="Industrial Park 2 Site Plan Changodar Moraiya Ahmedabad"
        structuredData={[metroEstateSchema, metroEstateListingSchema, metroEstateIndividualUnitsSchema, metroEstateFaqSchema]}
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
                <span className={`font-semibold ${t.textMain}`}>MIP — 02</span>
                <span className={t.textMuted}>/</span>
                <span className={t.textMuted}>23 Industrial Plots · Build Your Own Shed</span>
              </span>
              <span className={`inline-flex items-center gap-2 ${t.textMuted}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                100% NA Industrial · Immediate Possession
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
                  <span>Opp. Industrial Park 1, Moraiya, Changodar (Near NH 47)</span>
                  <ExternalLink size={11} aria-hidden="true" />
                </a>

                <h1 className={`text-3xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.15] mb-5 ${t.textMain}`}>
                  Metro{' '}
                  <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                    Industrial
                  </span>{' '}
                  Park 2<span className="text-brand-red">.</span>
                </h1>

                <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${t.textBody}`}>
                  Clear-title industrial plots engineered for the{' '}
                  <strong className={t.textMain}>“Build Your Own Shed”</strong> model. Delivered with
                  Wide Heavy RCC Roads, Street Lights, Puran (Soil Filling &amp; Leveling), Compound Wall,
                  and 24/7 Gated Security — so you own the land and build to your exact operational specs.
                </p>
              </div>

              {/* Action Stack */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <Link
                  to="/site-map"
                  state={{ activeTab: 'estate' }}
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
                    kicker="Delivered on Site"
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
                  <div className="flex flex-col gap-5 sm:gap-6 w-full overflow-x-clip scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                      className="space-y-4"
                    >
                      {activeTab === 'areaTables' ? (
                        <ImageCard
                          src={layoutImages.areaTable.src}
                          alt={layoutImages.areaTable.alt}
                          title={layoutImages.areaTable.title}
                          onOpen={() => openViewer(layoutImages.areaTable.src, layoutImages.areaTable.title)}
                          isDark={isDark}
                        />
                      ) : (
                        <ImageCard
                          src={layoutImages.siteMap.src}
                          alt={layoutImages.siteMap.title}
                          title={layoutImages.siteMap.title}
                          onOpen={() => openViewer(layoutImages.siteMap.src, layoutImages.siteMap.title)}
                          isDark={isDark}
                        />
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
                        Live Plot Selector · Moraiya Campus
                      </span>
                      <h3 className={`text-xl font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                        Check Live Plot Availability for Industrial Park 2
                      </h3>
                      <p className={`text-sm leading-relaxed ${t.textBody}`}>
                        Inspect available plots across Block A, B, and C with real-time status and direct enquiry.
                      </p>
                    </div>

                    <Link
                      to="/site-map"
                      state={{ activeTab: 'estate' }}
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
                      <span className="font-mono text-[10px] text-brand-red font-semibold">MIP 02</span>
                    </div>
                    <dl className={`divide-y ${t.divide} px-6`}>
                      {specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 py-3 text-xs">
                          <dt className={`font-mono uppercase tracking-wider shrink-0 ${t.textMuted}`}>
                            {spec.label}
                          </dt>
                          <dd className={`font-semibold text-right tabular-nums ${
                            spec.label === 'Status' ? 'text-emerald-500' : t.textMain
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
                      Historical industrial land appreciation across the Changodar–Moraiya NH 47 corridor.
                    </p>
                  </div>

                  {/* 3. Direct Directors Desk */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                      Interested in Plots?
                    </h3>
                    <p className={`text-xs leading-relaxed mb-5 ${t.textBody}`}>
                      Contact us for current plot rates, contiguous parcel merging, and guided site visits.
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

                  {/* 4. Possession Status */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Possession Status
                    </div>
                    <div className={`text-xl font-bold tracking-tight mb-1 ${t.textMain}`}>
                      Immediate Handover
                    </div>
                    <p className={`text-xs ${t.textBody}`}>
                      Ready for immediate custom construction · 100% Clear NA Title
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

export default MetroIndustrialEstate;