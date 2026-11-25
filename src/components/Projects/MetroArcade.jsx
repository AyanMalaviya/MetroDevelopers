// MetroArcade.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X, Phone, Maximize2,
  Building2, Home, MapPin, TrendingUp, Users, Car, Check, ArrowRight, ArrowUpRight,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO/SEO';

const EASE = [0.16, 1, 0.3, 1];

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  border:    isDark ? 'border-white/[0.12]' : 'border-gray-200',
  divide:    isDark ? 'divide-white/[0.12]' : 'divide-gray-200',
  textMain:  isDark ? 'text-white' : 'text-gray-900',
  textBody:  isDark ? 'text-gray-200' : 'text-gray-700',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
});

const SectionHeading = ({ index, kicker, title, isDark }) => {
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

const MetroArcade = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  const [currentSlide, setCurrentSlide]   = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    { url: '/images/arcade-top.jpeg',   alt: 'Metro Arcade Front View', title: 'Metro Arcade',     description: 'Modern commercial arcade on main road, Moraiya' },
    { url: '/images/arcade-shops.jpeg', alt: 'Shop Units',              title: 'Commercial Units', description: 'Prime retail and office spaces with personal parking' },
    { url: '/images/arcade-3.jpg',      alt: 'Metro Arcade Interior',   title: 'Interior View',    description: 'Well-designed G+1 RCC commercial units with main road visibility' },
  ];

  const specifications = [
    { label: 'Location',      value: 'Main Road, Moraiya' },
    { label: 'Total Area',    value: '15,000 sq.ft' },
    { label: 'Total Units',   value: '20 Commercial Shops' },
    { label: 'Unit Size',     value: '15 × 45 ft' },
    { label: 'Building Type', value: 'G+1 Floors' },
    { label: 'Construction',  value: 'RCC Structure' },
    { label: 'Parking',       value: 'Personal Parking' },
    { label: 'Status',        value: 'Taking Investor Bookings' },
  ];

  const amenities = [
    'RCC Construction',
    'G+1 Building',
    'Main Road Location',
    'Personal Parking',
    'Modern Design',
    'Prime Visibility',
    'High Rental Yield',
    'Investment Opportunity',
  ];

  const features = [
    { code: '01', icon: <Building2 size={18} aria-hidden="true" />, title: 'RCC Construction', description: 'Durable reinforced concrete structure for retail and commercial use' },
    { code: '02', icon: <Home size={18} aria-hidden="true" />,      title: 'G+1 Building',     description: 'Ground + 1st floor commercial shop and office layout' },
    { code: '03', icon: <MapPin size={18} aria-hidden="true" />,    title: 'Prime Location',   description: 'Direct main road frontage with high business visibility' },
    { code: '04', icon: <Car size={18} aria-hidden="true" />,       title: 'Personal Parking', description: 'Dedicated personal parking spaces allotted per unit' },
    { code: '05', icon: <TrendingUp size={18} aria-hidden="true" />,title: 'Investment Ready', description: 'High rental yield driven by surrounding industrial activity' },
    { code: '06', icon: <Users size={18} aria-hidden="true" />,     title: 'Commercial Hub',   description: 'Ideal layout for retail shops, showrooms, and offices' },
  ];

  const benefits = [
    { title: 'High Rental Yield',       desc: 'Main-road location supports strong recurring rental demand.' },
    { title: 'Capital Appreciation',    desc: 'Commercial highway-corridor property values appreciate steadily.' },
    { title: 'Easy Tenant Availability',desc: 'Consistent commercial demand from Moraiya & Changodar businesses.' },
    { title: 'Flexible Usage',          desc: 'Suitable for retail shops, showrooms, branch offices, or clinics.' },
  ];

  const metroArcadePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Commercial Shops in Moraiya, Changodar, Ahmedabad',
    description: 'Commercial shops and investment spaces in Moraiya, Changodar, Ahmedabad at Metro Arcade.',
    url: 'https://www.metrodevelopers.co.in/metro-arcade',
    about: {
      '@type': 'Place',
      name: 'Moraiya, Changodar, Ahmedabad',
    },
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || isGalleryOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isGalleryOpen, images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isGalleryOpen) setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft')  prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGalleryOpen, nextSlide, prevSlide]);

  return (
    <>
      <SEO
        title="Commercial Shops and warehouses in Moraiya, Changodar, Ahmedabad | Metro Arcade"
        description="Book commercial shops and warehouses in Moraiya, Changodar, Ahmedabad. Metro Arcade offers G+1 RCC construction, main-road visibility, and personal parking for retail and office use."
        keywords="commercial shops moraiya, shops changodar, commercial property ahmedabad, retail shops in moraiya, main road commercial shops changodar"
        canonical="/metro-arcade"
        ogImage="/images/arcade-top.jpeg"
        ogImageAlt="Commercial shops and warehouses in Moraiya Changodar Ahmedabad"
        structuredData={metroArcadePageSchema}
      />

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ════════ ARCHITECTURAL HERO SLIDESHOW ════════ */}
        <section className="relative pt-16">
          <div className="relative h-[52svh] sm:h-[64svh] lg:h-[72svh] overflow-hidden bg-black">
            {images.map((image, index) => (
              <div
                key={image.url}
                aria-hidden={index !== currentSlide}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/25'
                      : 'bg-gradient-to-t from-black/55 via-black/10 to-black/10'
                  }`}
                  aria-hidden="true"
                />
              </div>
            ))}

            {/* Top Coordinate & Status Bar */}
            <div className="absolute top-0 inset-x-0 z-10 border-b border-white/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/85">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                  <span>Commercial Complex · Taking Investor Bookings</span>
                </span>
                <span className="tabular-nums text-white/70">
                  0{currentSlide + 1} / 0{images.length}
                </span>
              </div>
            </div>

            {/* Crisp Architectural Slide Controls */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/65 hover:bg-brand-red border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/65 hover:bg-brand-red border border-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            {/* Bottom-Left Editorial Title */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/75 mb-2">
                      Main Road · Moraiya, Changodar
                    </p>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-3">
                      Metro{' '}
                      <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-brand-red inline-block">
                        Arcade
                      </span>
                      <span className="text-brand-red">.</span>
                    </h1>
                    <p className="text-sm sm:text-base text-white/85 max-w-xl">
                      {images[currentSlide].description}
                    </p>
                  </div>

                  {/* Right Gallery & Slide Bars */}
                  <div className="flex flex-col sm:items-end gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsGalleryOpen(true); setIsAutoPlaying(false); }}
                      className="py-2.5 px-4 bg-black/70 hover:bg-brand-red border border-white/25 text-white font-mono text-[11px] uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors w-fit"
                    >
                      <Maximize2 size={13} aria-hidden="true" />
                      <span>Full Gallery</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-[3px] transition-all duration-300 ${
                            index === currentSlide ? 'w-10 bg-brand-red' : 'w-4 bg-white/40 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Title Block Strip: Quick Specs + Actions ── */}
          <div className={`border-y ${t.border} ${t.bgSurface}`}>
            <div className="max-w-7xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}>
                <div className={`lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 divide-x ${t.divide}`}>
                  {[
                    { value: '15,000', label: 'Sq.ft Total Area', accent: false },
                    { value: '20',     label: 'Commercial Units', accent: false },
                    { value: 'G+1',    label: 'RCC Structure',    accent: false },
                    { value: '15×45',  label: 'Unit Size (ft)',   accent: true  },
                  ].map((s) => (
                    <div key={s.label} className="px-5 py-5">
                      <div className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${s.accent ? 'text-brand-red' : t.textMain}`}>
                        {s.value}
                      </div>
                      <div className={`font-mono text-[10px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`lg:col-span-4 grid grid-cols-2 divide-x ${t.divide}`}>
                  <a
                    href="https://wa.me/919624965017"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 lg:py-0 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaWhatsapp size={15} aria-hidden="true" />
                    <span>Book Now</span>
                  </a>
                  <a
                    href="tel:+919624965017"
                    className={`py-4 lg:py-0 px-5 ${t.bgSurface} ${t.textMain} hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-colors`}
                  >
                    <Phone size={14} className="text-brand-red" aria-hidden="true" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ MAIN 12-COL ARCHITECTURAL SPLIT ════════ */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

              {/* Left 8 Cols */}
              <div className="lg:col-span-8 space-y-14">

                {/* Investor Booking Notice */}
                <div className={`relative border ${t.border} ${t.bgSurface} p-6 sm:p-8`}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" aria-hidden="true" />
                  <div className="pl-2">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500 mb-2">
                      Pre-Launch Investor Phase
                    </div>
                    <h2 className={`text-lg sm:text-xl font-bold tracking-tight mb-2 ${t.textMain}`}>
                      Now Taking Investor Bookings
                    </h2>
                    <p className={`text-sm leading-relaxed mb-2 ${t.textBody}`}>
                      Metro Arcade is currently open for early-stage investor bookings — securing main-road commercial units in Moraiya before completion.
                    </p>
                    <p className={`text-sm leading-relaxed ${t.textBody}`}>
                      Contact our desk directly for pre-launch pricing, floor plans, and investment projections.
                    </p>
                  </div>
                </div>

                {/* 01. Project Overview */}
                <div>
                  <SectionHeading
                    index="01"
                    kicker="Commercial Brief"
                    title={
                      <>
                        Project{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                          Overview
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`border ${t.border} ${t.bgSurface} p-6 sm:p-8 space-y-4 text-sm sm:text-base leading-relaxed ${t.textBody}`}>
                    <p>
                      Metro Arcade is a modern commercial development strategically located on the main road in Moraiya.
                      This G+1 floor building offers <strong className={t.textMain}>20 commercial units</strong>, each measuring 15×45 feet, built for retail shops, showrooms, or offices.
                    </p>
                    <p>
                      Constructed with a full RCC (Reinforced Cement Concrete) structure for long-term durability, every unit includes personal parking space for owners and visiting customers.
                    </p>
                    <p>
                      Direct main-road frontage provides strong daily visibility and steady commercial footfall, supporting consistent rental demand and capital appreciation.
                    </p>
                  </div>
                </div>

                {/* 02. Key Features */}
                <div>
                  <SectionHeading
                    index="02"
                    kicker="Core Specifications"
                    title={
                      <>
                        Key{' '}
                        <span className="font-serif-editorial italic text-brand-red inline-block">
                          Features
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className="flex flex-col gap-5 sm:gap-6 w-full overflow-x-clip scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {features.map((feature, i) => {
                      const isEven = i % 2 === 0;
                      return (
                        <motion.article
                          key={feature.code}
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
                              FEAT {feature.code}
                            </span>
                            <span className={`w-8 h-8 border ${t.border} ${t.bgPage} flex items-center justify-center ${t.textMain}`}>
                              {feature.icon}
                            </span>
                          </div>
                          <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                            {feature.title}
                          </h3>
                          <p className={`text-xs sm:text-sm leading-relaxed ${t.textBody}`}>
                            {feature.description}
                          </p>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                {/* 03. Amenities & Facilities */}
                <div>
                  <SectionHeading
                    index="03"
                    kicker="Included Utilities"
                    title={
                      <>
                        Amenities &amp;{' '}
                        <span className="font-calligraphy font-normal text-[1.18em] tracking-normal text-emerald-500 inline-block">
                          Facilities
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`grid grid-cols-1 sm:grid-cols-2 border-t border-l ${t.border}`}>
                    {amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className={`px-5 py-4 border-r border-b ${t.border} ${t.bgSurface} flex items-center gap-3`}
                      >
                        <Check size={14} className="text-brand-red shrink-0" aria-hidden="true" />
                        <span className={`text-sm font-medium ${t.textMain}`}>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 04. Investment Benefits */}
                <div>
                  <SectionHeading
                    index="04"
                    kicker="Commercial Thesis"
                    title={
                      <>
                        Investment{' '}
                        <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-amber-500 inline-block">
                          Benefits
                        </span>
                      </>
                    }
                    isDark={isDark}
                  />
                  <div className={`grid grid-cols-1 sm:grid-cols-2 border-t border-l ${t.border}`}>
                    {benefits.map((b, i) => (
                      <div key={b.title} className={`p-6 border-r border-b ${t.border} ${t.bgSurface}`}>
                        <span className="font-mono text-[10px] font-bold text-brand-red block mb-2">
                          0{i + 1}
                        </span>
                        <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                          {b.title}
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed ${t.textBody}`}>{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols Sticky Sidebar */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  {/* Specifications Ledger */}
                  <div className={`border ${t.border} ${t.bgSurface}`}>
                    <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
                      <h3 className={`font-mono text-xs font-bold uppercase tracking-[0.16em] ${t.textMain}`}>
                        Specifications
                      </h3>
                      <span className="font-mono text-[10px] text-brand-red font-semibold">ARCADE</span>
                    </div>
                    <dl className={`divide-y ${t.divide} px-6`}>
                      {specifications.map((spec) => (
                        <div key={spec.label} className="flex justify-between items-start gap-4 py-3 text-xs">
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

                  {/* Booking Status */}
                  <div className={`relative border ${t.border} ${t.bgSurface} p-6`}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" aria-hidden="true" />
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-2 ${t.textMuted}`}>
                      Booking Status
                    </div>
                    <div className={`text-xl font-bold tracking-tight mb-1 ${t.textMain}`}>
                      Open for Investors
                    </div>
                    <p className={`text-xs leading-relaxed ${t.textBody}`}>
                      Limited main-road units available — book early to secure corner and front-facing shops.
                    </p>
                  </div>

                  {/* Direct Contact */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <h3 className={`text-base font-bold tracking-tight mb-1.5 ${t.textMain}`}>
                      Interested in Metro Arcade?
                    </h3>
                    <p className={`text-xs leading-relaxed mb-5 ${t.textBody}`}>
                      Contact us for booking terms, commercial pricing, and site visits.
                    </p>
                    <div className="space-y-2.5">
                      <a
                        href="https://wa.me/919624965017"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaWhatsapp size={15} aria-hidden="true" />
                          <span>WhatsApp Desk</span>
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                      <a
                        href="tel:+919624965017"
                        className={`w-full py-3.5 px-4 border ${t.border} ${t.bgPage} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Phone size={14} className="text-brand-red" aria-hidden="true" />
                          <span className="tabular-nums">+91 96249 65017</span>
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* Investment Highlights */}
                  <div className={`border ${t.border} ${t.bgSurface} p-6`}>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-4 ${t.textMuted}`}>
                      Investment Highlights
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      {[
                        'Prime main road location',
                        'High commercial footfall area',
                        'Personal parking included per shop',
                        'Strong local rental demand',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check size={13} className="text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                          <span className={t.textMain}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ════════ FULL-SCREEN GALLERY MODAL ════════ */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black border border-white/25 hover:border-brand-red hover:text-brand-red text-white flex items-center justify-center transition-colors"
              aria-label="Close gallery"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 w-10 h-10 bg-black border border-white/25 hover:bg-brand-red text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="max-w-5xl mx-auto px-6 text-center">
              <img
                src={images[currentSlide].url}
                alt={images[currentSlide].alt}
                className="w-full h-auto max-h-[78vh] object-contain border border-white/15"
              />
              <div className="mt-4">
                <h3 className="text-white text-base font-bold">{images[currentSlide].title}</h3>
                <p className="text-neutral-400 text-xs mt-1">{images[currentSlide].description}</p>
                <p className="font-mono text-neutral-500 text-[11px] mt-2 tabular-nums">
                  0{currentSlide + 1} / 0{images.length}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 w-10 h-10 bg-black border border-white/25 hover:bg-brand-red text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MetroArcade;