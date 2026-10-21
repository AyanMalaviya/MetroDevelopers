// src/pages/MetroIndustrialEstate.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin, Phone, ShieldCheck, Truck, Factory, Droplets, Cctv,
  ArrowRight, Ruler, Hammer, Building2, Zap, HelpCircle,
  ChevronDown, Maximize2, Layers, Compass, Check
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

const MetroIndustrialEstate = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial plots at Metro Industrial Estate, Moraiya, Changodar to Build My Own Shed. Please share layout details, available plot sizes, and pricing.'
  );

  const keyMetrics = [
    { value: '23', label: 'Industrial Plots', desc: 'Block A, B & C layouts' },
    { value: '300+', label: 'Sq.Yards Min Size', desc: 'Up to 1,930+ sq.yd parcels' },
    { value: '100%', label: 'Clear Legal Titles', desc: 'Approved NA Industrial status' },
    { value: '24/7', label: 'Security & CCTV', desc: 'Gated estate with guards' },
  ];

  const buildYourOwnShedBenefits = [
    {
      icon: <Ruler className="text-rose-500" size={26} />,
      title: 'Custom Clear Ceiling Heights',
      desc: 'Design shed heights of 30 ft, 35 ft, or 40+ ft tailored to your heavy machinery, overhead cranes, or high-density vertical racking systems.',
    },
    {
      icon: <ShieldCheck className="text-blue-500" size={26} />,
      title: 'Dual Asset Capital Appreciation',
      desc: 'Own both the valuable industrial land parcel and the custom structure, creating strong balance-sheet equity and long-term capital compounding in Changodar.',
    },
    {
      icon: <Compass className="text-purple-500" size={26} />,
      title: 'Scalable Parcel Combinations',
      desc: 'Need a larger footprint? Multiple adjacent plots can be merged seamlessly to establish larger manufacturing, fabrication, or warehousing complexes.',
    },
  ];

  const facilities = [
    {
      icon: <Cctv className="text-rose-500" size={28} />,
      title: '24/7 Gated Security & CCTV',
      desc: 'Round-the-clock trained security personnel at the main entry gate, monitored vehicle access, and comprehensive HD CCTV coverage across all internal roads.',
      highlight: 'Continuous Protection',
    },
    {
      icon: <FaRoad className="text-orange-500" size={26} />,
      title: 'Wide Heavy-Duty RCC Roads',
      desc: 'Reinforced concrete internal roads built to accommodate multi-axle 40-foot freight trailers, heavy container logistics, and high axle weights year-round.',
      highlight: 'Zero Potholes & Low Maintenance',
    },
    {
      icon: <Droplets className="text-cyan-500" size={28} />,
      title: '24/7 Industrial Water Supply',
      desc: 'Dedicated high-capacity borewell network with pipeline connections to each plot boundary, supporting uninterrupted production and daily facility needs.',
      highlight: 'Direct Supply to Boundary',
    },
    {
      icon: <ShieldCheck className="text-indigo-500" size={28} />,
      title: '100% Clear Title & NA Status',
      desc: 'Legally vetted Non-Agricultural (NA) industrial zoning approval with complete title documentation, enabling immediate sale deed registration and fast bank loan sanctions.',
      highlight: 'Immediate Registration',
    },
  ];

  const faqs = [
    {
      q: 'What is Metro Industrial Estate and how does "Build Your Own Shed" work?',
      a: 'Metro Industrial Estate is our specialized industrial plotted development situated directly opposite Metro Industrial Park in Moraiya, Changodar. Instead of buying a pre-built shed with fixed specifications, "Build Your Own Shed" allows you to purchase a clear-title industrial plot and construct a custom-designed factory or warehouse perfectly matched to your specific machinery height, floor load, crane requirements, and administrative offices.',
    },
    {
      q: 'What facilities are provided by the developer at Metro Industrial Estate?',
      a: 'Metro Developers delivers complete on-ground infrastructure so you only need to focus on your shed construction. Key facilities include: 24/7 gated security with trained guards, comprehensive CCTV surveillance, wide heavy-duty RCC internal roads engineered for 40-ft trailers and street lighting.',
    },
    {
      q: 'What plot sizes are available at Metro Industrial Estate?',
      a: 'The estate features 23 plots across three designated blocks (Block A, Block B, and Block C). Plot sizes range from approximately 312 sq.yards up to 1,930 sq.yards. Multiple contiguous plots can also be merged together for businesses needing 2,500 to 5,000+ sq.yards of continuous industrial land.',
    },
    {
      q: 'Are the plots legally approved with clear titles?',
      a: 'Yes, 100%. All plots have approved Non-Agricultural (NA) Industrial status with clean, marketable titles free of legal encumbrances. Immediate sale deed registration is available, and plots are readily approved for commercial property loans by leading financial institutions.',
    },
    {
      q: 'Where is Metro Industrial Estate located?',
      a: 'Metro Industrial Estate is located directly opposite Metro Industrial Park in Moraiya, Changodar, Ahmedabad (382213). It is positioned minutes from the Sarkhej–Bavla National Highway (NH 47), offering quick transit to Sanand GIDC, Ahmedabad city, and the western port corridors (Mundra/Kandla).',
    },
    {
      q: 'Can I visit the site and check plot availability today?',
      a: 'Yes! You can explore our live plot availability map on this website under the Site Map section, or book a physical guided site inspection with our directors by calling +91 98242 35642 or +91 63567 66767.',
    },
  ];

  return (
    <>
      <SEO
        title="Build Your Own Shed — Industrial Plots in Changodar | Metro Industrial Estate"
        description="Clear-title industrial plots for sale at Metro Industrial Estate, Moraiya, Changodar. Build your customized shed with 24/7 security, wide heavy RCC roads, water, drainage & power. Check live plot availability!"
        canonical="/metro-industrial-estate"
        keywords="industrial plots changodar, build your own shed ahmedabad, industrial land for sale moraiya, industrial plots moraiya, industrial sheds changodar, metro industrial estate, plots with security and roads ahmedabad"
        ogImage="/images/metro-industrial-estate-site-plan.jpg"
        ogImageAlt="Metro Industrial Estate Plots Layout Moraiya Changodar Ahmedabad"
        structuredData={[metroEstateSchema, metroEstateListingSchema, metroEstateFaqSchema]}
      />

      <div className={`relative min-h-screen pt-20 pb-20 overflow-hidden ${
        isDark ? 'bg-[#07070f] text-gray-100' : 'bg-[#faf9f6] text-gray-900'
      }`}>
        {/* Background Ambient Glows */}
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-red-600/10' : 'bg-red-400/10'
        }`} aria-hidden="true" />
        <div className={`absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-orange-500/10' : 'bg-orange-300/15'
        }`} aria-hidden="true" />

        {/* ════════════════════════════════════════════════
            1. HERO SECTION
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-4xl mx-auto"
          >
            {/* Launch Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase border mb-6 shadow-sm ${
              isDark ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-green-50 border-green-300 text-green-700'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span>New Launch • Industrial Plots • Bookings Open</span>
            </div>

            {/* Tagline Badge */}
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-3">
              Build Your Own Shed — Total Custom Freedom
            </span>

            {/* Main Title */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 font-display leading-[1.08] ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Metro <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Industrial Estate
              </span>
            </h1>

            {/* Location Pill */}
            <div className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl mb-6 border text-xs sm:text-sm font-semibold shadow-sm ${
              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
            }`}>
              <MapPin size={16} className="text-brand-red shrink-0" />
              <span>Opp. Metro Industrial Park, Moraiya, Changodar (Near NH 47)</span>
            </div>

            {/* Subtitle / Lead Paragraph */}
            <p className={`text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We provide clear-title industrial plots for you to <strong className={isDark ? 'text-white' : 'text-gray-900'}>Build Your Own Shed</strong> with complete developer-provided infrastructure including <strong className="text-red-500">24/7 Gated Security & CCTV</strong> and <strong className="text-orange-500">Wide Heavy-Duty RCC Roads</strong>.
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-2xl">
              {[
                '24/7 Gated Security & CCTV',
                'Wide Heavy-Duty RCC Roads',
                '100% Clear Title & NA Land',
                'Immediate Registration',
                'Street Lighting',
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    isDark ? 'bg-gray-900/60 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700 shadow-xs'
                  }`}
                >
                  <Check size={13} className="text-green-500 shrink-0" />
                  {pill}
                </span>
              ))}
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
              <Link
                to="/site-map"
                state={{ activeTab: 'estate' }}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 via-brand-red to-orange-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-red-500/25 hover:scale-[1.02] transition-transform"
              >
                <MapPin size={17} />
                <span>View Live Plot Map</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  isDark
                    ? 'border-gray-700 text-white hover:border-green-500/70 bg-black/60'
                    : 'border-gray-300 text-gray-800 hover:border-green-500/70 bg-white shadow-sm'
                }`}
              >
                <FaWhatsapp size={18} className="text-green-500" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>

            {/* Phone link */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium">
              <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Need immediate guidance?</span>
              <a
                href="tel:+919824235642"
                className={`flex items-center gap-1 font-bold transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-black'
                }`}
              >
                <Phone size={12} className="text-brand-red" />
                +91 98242 35642
              </a>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════
            2. KEY METRICS BAR
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-20">
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl border ${
            isDark ? 'bg-gray-900/40 border-gray-800/80' : 'bg-white border-gray-200/80 shadow-md'
          }`}>
            {keyMetrics.map((metric, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isDark ? 'bg-black/40 border-gray-800' : 'bg-gray-50/80 border-gray-200/60'
                }`}
              >
                <div
                  className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-1"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  {metric.value}
                </div>
                <div className={`text-xs sm:text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {metric.label}
                </div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            3. "BUILD YOUR OWN SHED" CONCEPT SECTION
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
              isDark ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              <Hammer size={12} /> Custom Industrial Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 font-display">
              Why <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">"Build Your Own Shed"?</span>
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Standard pre-built sheds often force compromises on column heights, crane spans, and floor load capacities. At Metro Industrial Estate, you secure prime industrial land and construct exactly what your production line requires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildYourOwnShedBenefits.map((benefit, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isDark
                    ? 'bg-gray-900/30 border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${
                    isDark ? 'bg-black/50 border-gray-800' : 'bg-gray-100/80 border-gray-200'
                  }`}>
                    {benefit.icon}
                  </div>
                  <h3 className={`text-lg font-black mb-2.5 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            4. DEVELOPER-PROVIDED FACILITIES (SECURITY & ROADS)
        ════════════════════════════════════════════════ */}
        <section className={`relative z-10 py-16 sm:py-24 border-y ${
          isDark ? 'bg-[#0a0a14] border-gray-800/80' : 'bg-[#f4f2ed] border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
                isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                <ShieldCheck size={12} /> Ready Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 font-display">
                World-Class <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">Facilities Provided</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Focus 100% on your business and machinery. Metro Developers has already executed robust on-site infrastructure, led by continuous security and heavy-duty RCC roads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {facility.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {facility.highlight}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black mb-2 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {facility.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {facility.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            5. INTERACTIVE SITE MAP PREVIEW / LAYOUT
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 my-20 sm:my-28">
          <div className={`p-6 sm:p-10 rounded-3xl border overflow-hidden relative ${
            isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200 shadow-xl'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Info & Action */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border w-fit mb-3 ${
                  isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  <Compass size={12} /> Master Layout Plan
                </span>

                <h3 className={`text-2xl sm:text-3xl font-black mb-3 font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Explore All 23 Plots in Our Interactive Map
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Browse individual plot dimensions, exact yardage, and real-time availability across Block A (Plots 1–8), Block B (Plots 9–16), and Block C (Plots 17–23).
                </p>

                <div className="space-y-2.5 mb-8 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Block A (Plots 1–8):</strong> 609 to 1,930 sq.yd
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Block B (Plots 9–16):</strong> 495 to 1,425 sq.yd
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      <strong>Block C (Plots 17–23):</strong> 312 to 1,155 sq.yd
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/site-map"
                    state={{ activeTab: 'estate' }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-500/25 hover:scale-[1.02] transition-transform"
                  >
                    <MapPin size={15} />
                    Open Live Interactive Map
                  </Link>

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border font-bold text-xs sm:text-sm transition-colors ${
                      isDark
                        ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Maximize2 size={15} />
                    Zoom Site Plan
                  </button>
                </div>
              </div>

              {/* Right Column: Site Plan Image Preview */}
              <div className="lg:col-span-7">
                <div
                  onClick={() => setLightboxOpen(true)}
                  className={`group relative rounded-2xl overflow-hidden border cursor-zoom-in shadow-lg ${
                    isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-100'
                  }`}
                >
                  <img
                    src="/images/metro-industrial-estate-site-plan.jpg"
                    alt="Metro Industrial Estate Master Layout Site Plan Moraiya Changodar"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                      <Maximize2 size={14} /> Click to view full high-resolution site plan
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            6. STRATEGIC LOCATION & CONNECTIVITY
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
              isDark ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-green-50 text-green-600 border-green-200'
            }`}>
              <Truck size={12} /> Strategic Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mb-3 font-display">
              Unrivalled <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Logistics Connectivity</span>
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Located at the intersection of Moraiya and Changodar along the high-traffic Sarkhej–Bavla National Highway corridor (NH 47).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'NH 47 Highway', time: '2 Mins', desc: 'Direct wide approach from Sarkhej–Bavla Expressway' },
              { title: 'Sanand GIDC', time: '15 Mins', desc: 'Direct access to automobile & electronics manufacturing hubs' },
              { title: 'Ahmedabad Ring Road', time: '12 Mins', desc: 'Smooth distribution into SG Highway & Ahmedabad City' },
              { title: 'Ports & Freight Corridor', time: 'Direct', desc: 'NH corridor linking Mundra, Kandla, and Pipavav ports' },
            ].map((loc, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-center ${
                  isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-200 shadow-xs'
                }`}
              >
                <div className="text-2xl font-black text-brand-red mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  {loc.time}
                </div>
                <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {loc.title}
                </h4>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {loc.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            7. FAQS ACCORDION
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center mb-12">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border mb-3 ${
              isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200'
            }`}>
              <HelpCircle size={12} /> Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display">
              Have Questions About <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Metro Industrial Estate?</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-colors ${
                    isDark
                      ? isOpen ? 'bg-gray-900/80 border-gray-700' : 'bg-gray-900/30 border-gray-800'
                      : isOpen ? 'bg-white border-gray-300 shadow-sm' : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className={`text-sm sm:text-base font-bold ${
                      isOpen ? 'text-brand-red' : isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-red' : isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                          isDark ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-600'
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            8. FINAL CTA BANNER
        ════════════════════════════════════════════════ */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className={`p-8 sm:p-14 rounded-3xl border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-gray-900 via-gray-950 to-black border-red-500/20'
              : 'bg-gradient-to-b from-white via-orange-50/30 to-amber-50/40 border-gray-200 shadow-xl'
          }`}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 font-display">
              Ready to <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">Build Your Own Shed?</span>
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Secure your prime industrial plot with ready 24/7 security, heavy-duty RCC roads, water, and power infrastructure today. Contact our directors directly or schedule a guided on-ground site visit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link
                to="/site-map"
                state={{ activeTab: 'estate' }}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 via-brand-red to-orange-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-red-500/25 hover:scale-[1.02] transition-transform"
              >
                <MapPin size={16} />
                <span>Live Availability Map</span>
              </Link>

              <a
                href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm shadow-xl shadow-green-600/25 hover:scale-[1.02] transition-transform"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp Directors</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
              <a
                href="tel:+919824235642"
                className={`inline-flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                <Phone size={13} className="text-brand-red" />
                Amir Malaviya: +91 98242 35642
              </a>
              <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
              <a
                href="tel:+916356766767"
                className={`inline-flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                <Phone size={13} className="text-brand-red" />
                Nazim Kazani: +91 63567 66767
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* Lightbox Modal for Master Site Plan */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[
          {
            src: '/images/metro-industrial-estate-site-plan.jpg',
            title: 'Metro Industrial Estate — 23 Industrial Plots Master Site Plan',
            description: 'Moraiya, Changodar, Ahmedabad (Opp. Metro Industrial Park)',
          },
        ]}
        plugins={[Zoom]}
      />
    </>
  );
};

export default MetroIndustrialEstate;
