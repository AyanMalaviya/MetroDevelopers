// src/pages/LocalMarketPage.jsx
import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Building2, Check, ExternalLink, MapPin, Phone,
  Factory, LandPlot, Truck, Shield, Droplets, Clock, TrendingUp,
  Award, Ruler, Plus, Minus,
} from 'lucide-react';
import { FaWhatsapp, FaRoad } from 'react-icons/fa';
import SEO from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext';
import { GUIDE_PAGES, LOCAL_MARKET_PAGES } from '../data/seoRoutes';
import {
  createBreadcrumbSchema,
  createLocationPageSchema,
  propertySchema,
  realEstateListingSchema,
  metroLeaseLandingPageSchema,
  investmentComparisonSchema,
} from '../utils/schemas';
import TenantSpecTable from '../components/Projects/TenantSpecTable';
import DriveTimeMatrix from '../components/Projects/DriveTimeMatrix';
import InvestmentComparisonTable from '../components/Projects/InvestmentComparisonTable';

// ─── Constants & Tokens ──────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1];

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.97909554353!2d72.41748307531053!3d22.914141879249897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20industrial%20park%20moraiya!5e0!3m2!1sen!2sin!4v1767639082192!5m2!1sen!2sin';
const MAP_DIRECTIONS_URL = 'https://maps.app.goo.gl/6fBawQdYxcmUw3WE6';

const QUICK_STATS = [
  { code: '01', value: '54K',  label: 'Sq. Yards Area',   icon: LandPlot   },
  { code: '02', value: '63',   label: 'Industrial Units', icon: Factory    },
  { code: '03', value: '6–8%', label: 'Rental Yield',     icon: TrendingUp, accent: true },
  { code: '04', value: '90D',  label: 'Possession',       icon: Clock      },
];

const LEASE_STATS = [
  { code: '01', value: '30–35 Ft', label: 'Clear Height',       icon: Ruler  },
  { code: '02', value: '60 Ft',    label: 'RCC Internal Roads', icon: FaRoad },
  { code: '03', value: '30–90D',   label: 'Fast Possession',    icon: Clock  },
  { code: '04', value: '100%',     label: 'GST Tax Credit',     icon: Award, accent: true },
];

const FEATURES = [
  {
    code: 'SPEC 01',
    icon: Ruler,
    title: 'Flexible Unit Sizes',
    desc: '4,000–50,000 sq.ft to match any scale of operation — from boutique manufacturing to large-format warehousing.',
    img: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    imgAlt: 'Industrial shed units of various sizes at Metro Industrial Park Moraiya',
  },
  {
    code: 'SPEC 02',
    icon: FaRoad,
    title: '60 ft RCC Roads',
    desc: 'Wide internal roads engineered for heavy trucks and trailers — smooth logistics from gate to unit.',
    img: '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    imgAlt: '60 ft wide RCC road inside Metro Industrial Park Ahmedabad',
  },
  {
    code: 'SPEC 03',
    icon: Shield,
    title: '24/7 CCTV Security',
    desc: 'HD cameras throughout the park with trained security guards at the main gate and controlled entry.',
    img: '/images/metro-industrial-park-entrance-security-moraiya.jpg',
    imgAlt: 'CCTV security at Metro Industrial Park entrance Moraiya Ahmedabad',
  },
  {
    code: 'SPEC 04',
    icon: Truck,
    title: 'Highway Connectivity',
    desc: 'Direct access to NH 47 (Sarkhej–Bavla Highway), major logistics corridors, GIDC zones, and Ahmedabad airport.',
    img: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    imgAlt: 'Location map showing highway connectivity of Metro Industrial Park Moraiya',
  },
  {
    code: 'SPEC 05',
    icon: Droplets,
    title: '24/7 Water Supply',
    desc: 'Dedicated continuous water availability to every unit with emergency reserve system on-site.',
    img: null,
    imgAlt: null,
  },
  {
    code: 'SPEC 06',
    icon: Award,
    title: 'Quick 90-Day Possession',
    desc: "One of Ahmedabad's fastest industrial possession timelines — from agreement to key handover.",
    img: null,
    imgAlt: null,
  },
];

const getTokens = (isDark) => ({
  bgPage:    isDark ? 'bg-[#0B0B0D]' : 'bg-[#F5F3EE]',
  bgSurface: isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]',
  bgSubtle:  isDark ? 'bg-[#17171B]' : 'bg-[#ECEAE3]',
  border:    isDark ? 'border-white/[0.1]' : 'border-black/[0.11]',
  divide:    isDark ? 'divide-white/[0.1]' : 'divide-black/[0.11]',
  textMain:  isDark ? 'text-[#F5F4F0]' : 'text-[#121214]',
  textBody:  isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]',
  textMuted: isDark ? 'text-[#6E6E77]' : 'text-[#73726C]',
});

// ─── Editorial Section Header ────────────────────────────────────────────────

function SectionHeader({ index, kicker, title, description, isDark }) {
  const t = getTokens(isDark);
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8 sm:pb-10 border-b ${t.border}`}>
      <div className="lg:col-span-7">
        <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="text-brand-red font-semibold">{index}</span>
          <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
          <span className={t.textMuted}>{kicker}</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] ${t.textMain}`}>
          {title}
        </h2>
      </div>
      {description && (
        <div className="lg:col-span-5 flex items-end lg:justify-end lg:text-right">
          <p className={`text-sm leading-relaxed max-w-md ${t.textBody}`}>{description}</p>
        </div>
      )}
    </div>
  );
}

// ─── FAQ Row ─────────────────────────────────────────────────────────────────

function FaqItem({ faq, index, isDark }) {
  const [open, setOpen] = useState(index === 0);
  const t = getTokens(isDark);

  return (
    <div className={`${t.bgSurface} transition-colors`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors ${
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
            open ? 'border-brand-red text-brand-red' : t.textMuted
          }`}
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
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
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LocalMarketPage() {
  const { pathname } = useLocation();
  const { theme }    = useTheme();
  const isDark       = theme === 'dark';
  const t            = getTokens(isDark);

  const page               = LOCAL_MARKET_PAGES.find((e) => e.path === pathname);
  const visibleMarketPages = LOCAL_MARKET_PAGES.filter((e) => e.showInPrimaryNavigation !== false);
  const relatedMarkets     = visibleMarketPages.filter((e) => e.path !== pathname);

  const targetProjectUrl   = page?.targetProjectUrl || '/metro-industrial-park';
  const targetProjectName  = page?.targetProjectName || 'Metro Industrial Park';
  const dynamicWhatsappUrl = `https://wa.me/919824235642?text=${encodeURIComponent(
    `Hello, I want details regarding ${page?.focusKeyword || 'industrial space'} in ${page?.locationName || 'Ahmedabad'}.`
  )}`;

  const aboutRef    = useRef(null);
  const whyRef      = useRef(null);
  const featuresRef = useRef(null);
  const faqRef      = useRef(null);
  const mapRef      = useRef(null);
  const ctaRef      = useRef(null);

  const aboutInView    = useInView(aboutRef,    { once: true, margin: '-60px' });
  const whyInView      = useInView(whyRef,      { once: true, margin: '-60px' });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-60px' });
  const faqInView      = useInView(faqRef,      { once: true, margin: '-60px' });
  const mapInView      = useInView(mapRef,      { once: true, margin: '-60px' });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: '-60px' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!page) return null;

  /* Schemas */
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: page.breadcrumb, path: page.path },
  ]);
  const locationPageSchema = createLocationPageSchema({
    pageTitle:       page.title,
    pageDescription: page.description,
    path:            page.path,
    locationName:    page.locationName,
    focusKeyword:    page.focusKeyword,
  });
  const listingSchema = {
    ...realEstateListingSchema,
    name:        page.schemaName,
    description: page.description,
    url:         `https://www.metrodevelopers.co.in${page.path}`,
  };
  const faqSchema = page.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }
    : null;

  const structuredData = [propertySchema, listingSchema, locationPageSchema, breadcrumbSchema];
  if (page.isLeaseFocused && metroLeaseLandingPageSchema) structuredData.push(metroLeaseLandingPageSchema);
  if ((page.showInvestmentComparison || page.path === '/investment-in-real-estate-in-ahmedabad') && investmentComparisonSchema) {
    structuredData.push(investmentComparisonSchema);
  }
  if (faqSchema) structuredData.push(faqSchema);

  const activeQuickStats = page.isLeaseFocused ? LEASE_STATS : QUICK_STATS;
  const snapshotStats = page.isLeaseFocused
    ? [
        { code: '01', label: 'Floor Load',   value: '5–8 T/m²', sub: 'Heavy laser screed VDF',     accent: false },
        { code: '02', label: 'Clear Height', value: '30–35 Ft', sub: 'High-density pallet racking', accent: false },
        { code: '03', label: 'Road Width',   value: '60 Ft',    sub: '40ft trailer turnaround',    accent: true  },
        { code: '04', label: 'Lease Tenure', value: '5–10 Yrs', sub: '100% GST ITC eligible',      accent: false },
      ]
    : [
        { code: '01', label: 'Rental Yield',     value: '6–8%',   sub: 'Stable annual income',     accent: false },
        { code: '02', label: 'Appreciation',     value: '10–12%', sub: 'Yearly capital growth',    accent: false },
        { code: '03', label: 'Combined Returns', value: '16–20%', sub: 'Total return potential',   accent: true  },
        { code: '04', label: 'Lease Term',       value: '5–10Y',  sub: 'Stable long-term tenants', accent: false },
      ];

  return (
    <>
      <SEO
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        canonical={page.path}
        ogImage={page.image}
        ogImageAlt={page.ogImageAlt}
        structuredData={structuredData}
      />

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
        style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            HERO — ARCHITECTURAL BRIEF
        ════════════════════════════════════════════════════════════════ */}
        <section className={`pt-20 sm:pt-24 border-b ${t.border} ${t.bgSurface}`}>
          {/* Top Breadcrumb & Corridor Strip */}
          <div className={`border-y ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link to="/" className={`${t.textMuted} hover:text-brand-red transition-colors`}>
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className={t.textMuted}>/</li>
                  <li className="text-brand-red font-semibold truncate max-w-[210px] sm:max-w-none">
                    {page.breadcrumb}
                  </li>
                </ol>
              </nav>
              <span className={`hidden sm:inline-flex items-center gap-2 ${t.textMuted}`}>
                <span className="w-1.5 h-1.5 bg-brand-red" aria-hidden="true" />
                {page.locationName} · Near NH 47 (Sarkhej–Bavla)
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
                <div className="flex items-center gap-2.5 mb-4 font-mono text-[11px] uppercase tracking-[0.18em]">
                  <MapPin size={12} className="text-brand-red shrink-0" aria-hidden="true" />
                  <span className="text-brand-red font-semibold">{page.locationName}</span>
                  <span className={t.textMuted}>/</span>
                  <span className={t.textMuted}>Market Brief</span>
                </div>

                <h1 className={`text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.035em] leading-[1.05] mb-5 ${t.textMain}`}>
                  {page.heading}
                </h1>

                <p className={`text-base sm:text-lg max-w-3xl leading-relaxed ${t.textBody}`}>
                  {page.summary}
                </p>
              </div>

              {/* Stacked Action Column */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <Link
                  to={targetProjectUrl}
                  className="w-full py-3.5 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Factory size={15} aria-hidden="true" />
                    <span>Explore {targetProjectName}</span>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={dynamicWhatsappUrl}
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

            {/* Border-Collapsed Quick Metrics Strip */}
            <div className={`mt-10 grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {activeQuickStats.map(({ code, value, label, accent }) => (
                <div key={label} className={`p-5 sm:p-6 border-r border-b ${t.border} ${t.bgPage}`}>
                  <div className={`font-mono text-[10px] mb-3 ${t.textMuted}`}>{code}</div>
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${accent ? 'text-brand-red' : t.textMain}`}>
                    {value}
                  </div>
                  <div className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            01. ABOUT THE PARK
        ════════════════════════════════════════════════════════════════ */}
        <section ref={aboutRef} className={`py-16 sm:py-24 border-b ${t.border} ${t.bgPage}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`border ${t.border} ${t.bgSurface} grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}
            >
              {/* Park Photo */}
              <div className="lg:col-span-6 flex flex-col">
                <div className={`flex items-center justify-between px-5 py-3 border-b ${t.border} font-mono text-[10px] uppercase tracking-[0.16em] ${t.textMuted}`}>
                  <span>01 / SITE OVERVIEW</span>
                  <span className="inline-flex items-center gap-1.5 text-brand-red font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" aria-hidden="true" />
                    Available Now · Moraiya
                  </span>
                </div>
                <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] bg-neutral-950 overflow-hidden">
                  <img
                    src="/images/metro-industrial-park-entrance-security-moraiya.jpg"
                    alt={`Metro Industrial Park — industrial sheds near ${page.locationName}`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  />
                </div>
              </div>

              {/* Specification Copy */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-red font-semibold mb-3">
                    Metro Industrial Park · Near NH 47
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-[-0.025em] leading-tight mb-4 ${t.textMain}`}>
                    Premier Industrial Space on the Sarkhej–Bavla Corridor
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed mb-4 ${t.textBody}`}>
                    Metro Industrial Park is a fully-serviced industrial development spread across{' '}
                    <strong className={t.textMain}>54,000 sq. yards</strong> in Moraiya, Changodar — minutes from NH 47.
                    It hosts <strong className={t.textMain}>63 industrial units</strong> ranging from 4,000 to 50,000 sq.ft,
                    built for manufacturing, logistics, and warehousing at every scale.
                  </p>
                  <p className={`text-sm sm:text-base leading-relaxed mb-4 ${t.textBody}`}>
                    Investors target <strong className={t.textMain}>6–8% annual rental yield</strong> alongside{' '}
                    <strong className={t.textMain}>10–12% yearly land appreciation</strong> in Ahmedabad's highest-velocity industrial belt.
                  </p>

                  {page.localPitch && (
                    <blockquote className={`text-sm leading-relaxed border-l-2 border-brand-red pl-4 py-1 my-5 ${t.textMain}`}>
                      {page.localPitch}
                    </blockquote>
                  )}

                  <dl className={`border-t ${t.border} divide-y ${t.divide} mt-5`}>
                    {[
                      ['Unit Sizes',     '4,000 – 50,000 sq.ft'],
                      ['Ceiling Height', '30 – 35 ft clear height'],
                      ['Road Width',     '60 ft heavy RCC internally'],
                      ['Possession',     '90 days from agreement'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                        <dt className={`font-mono uppercase tracking-wider text-[11px] ${t.textMuted}`}>{label}</dt>
                        <dd className={`font-semibold tabular-nums ${t.textMain}`}>{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <Link
                  to={targetProjectUrl}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-red hover:underline"
                >
                  <span>Explore {targetProjectName} Details</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            02. WHY THIS LOCATION
        ════════════════════════════════════════════════════════════════ */}
        <section ref={whyRef} className={`py-16 sm:py-24 border-b ${t.border} ${t.bgSurface}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              index="02"
              kicker="Regional Fundamentals"
              title={
                <>
                  Why Businesses Choose <span className="text-brand-red">{page.locationName}</span>
                </>
              }
              description="Key commercial demand catalysts and operational sectors best suited to this micro-market."
              isDark={isDark}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`mt-10 border ${t.border} grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${t.divide}`}
            >
              {/* Demand Drivers */}
              <article className={`p-6 sm:p-9 ${t.bgPage}`}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/10">
                  <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${t.textMain}`}>
                    Demand Drivers in This Market
                  </h3>
                  <span className="font-mono text-xs text-brand-red font-semibold">01</span>
                </div>
                <ul className="space-y-3.5">
                  {page.demandDrivers?.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={15} className="mt-0.5 shrink-0 text-brand-red" aria-hidden="true" />
                      <span className={`text-sm leading-relaxed ${t.textBody}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Best Fit */}
              <article className={`p-6 sm:p-9 ${t.bgPage}`}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/10">
                  <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${t.textMain}`}>
                    Best Fit Sectors
                  </h3>
                  <span className="font-mono text-xs text-brand-red font-semibold">02</span>
                </div>
                <ul className="space-y-3.5">
                  {page.bestFor?.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Building2 size={15} className="mt-0.5 shrink-0 text-brand-red" aria-hidden="true" />
                      <span className={`text-sm leading-relaxed ${t.textBody}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            03. PARK INFRASTRUCTURE GRID
        ════════════════════════════════════════════════════════════════ */}
        <section ref={featuresRef} className={`py-16 sm:py-24 border-b ${t.border} ${t.bgPage}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              index="03"
              kicker="Master-Planned Infrastructure"
              title={
                <>
                  Everything Your Business <span className="text-brand-red">Needs</span>
                </>
              }
              description="Heavy-load civil infrastructure built into the park from day one so your team can focus on production."
              isDark={isDark}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`mt-10 grid grid-cols-1 md:grid-cols-2 border-t border-l ${t.border}`}
            >
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <article
                    key={feat.title}
                    className={`group border-r border-b ${t.border} ${t.bgSurface} flex flex-col`}
                  >
                    <div className={`flex items-center justify-between px-5 py-3 border-b ${t.border} font-mono text-[10px] tracking-[0.16em] uppercase`}>
                      <span className="text-brand-red font-semibold">{feat.code}</span>
                      <Icon size={14} className={t.textMuted} aria-hidden="true" />
                    </div>

                    {feat.img && (
                      <div className={`aspect-[16/9] overflow-hidden border-b ${t.border} bg-neutral-950`}>
                        <img
                          src={feat.img}
                          alt={feat.imgAlt}
                          width={800}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className={`text-lg font-extrabold tracking-tight mb-2 ${t.textMain}`}>
                        {feat.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${t.textBody}`}>{feat.desc}</p>
                    </div>
                  </article>
                );
              })}
            </motion.div>

            <div className="mt-8 flex justify-end">
              <Link
                to={targetProjectUrl}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] transition-colors"
              >
                <Factory size={15} aria-hidden="true" />
                <span>See {targetProjectName} Details &amp; Gallery</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CONDITIONAL DATA MODULES (INVESTMENT / TENANT SPECS / DRIVE TIMES)
        ════════════════════════════════════════════════════════════════ */}
        {(page.showInvestmentComparison || page.path === '/investment-in-real-estate-in-ahmedabad') && (
          <section className={`py-14 sm:py-20 border-b ${t.border} ${t.bgSurface}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <InvestmentComparisonTable />
            </div>
          </section>
        )}

        {(page.showTenantSpecs || page.isLeaseFocused) && (
          <section className={`py-14 sm:py-20 border-b ${t.border} ${t.bgSurface}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <TenantSpecTable />
            </div>
          </section>
        )}

        {(page.showDriveTimes || page.isLeaseFocused) && (
          <section className={`py-14 sm:py-20 border-b ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <DriveTimeMatrix locationName={page.locationName} />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            OPERATIONAL / INVESTMENT SNAPSHOT BAND
        ════════════════════════════════════════════════════════════════ */}
        <section className={`py-12 sm:py-16 border-b ${t.border} ${t.bgSurface}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {snapshotStats.map(({ code, label, value, sub, accent }) => (
                <div key={label} className={`p-6 sm:p-8 border-r border-b ${t.border} ${t.bgPage}`}>
                  <div className={`font-mono text-[10px] mb-4 ${t.textMuted}`}>{code}</div>
                  <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums mb-1 ${accent ? 'text-brand-red' : t.textMain}`}>
                    {value}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${t.textMain}`}>{label}</div>
                  <div className={`text-xs mt-1 ${t.textMuted}`}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            04. FAQ ACCORDION
        ════════════════════════════════════════════════════════════════ */}
        {page.faqs?.length > 0 && (
          <section ref={faqRef} className={`py-16 sm:py-24 border-b ${t.border} ${t.bgPage}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <SectionHeader
                index="04"
                kicker="Investor & Tenant Desk"
                title="Frequently Asked Questions"
                description="Direct answers on titles, lease structures, sizing, and possession timelines."
                isDark={isDark}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                className={`mt-10 border ${t.border} divide-y ${t.divide}`}
              >
                {page.faqs.map((faq, i) => (
                  <FaqItem key={i} faq={faq} index={i} isDark={isDark} />
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            05. LOCATION MAP & RELATED INDEX
        ════════════════════════════════════════════════════════════════ */}
        <section ref={mapRef} className={`py-16 sm:py-24 border-b ${t.border} ${t.bgSurface}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 7 Cols: Embedded Map */}
              <article className={`lg:col-span-7 border ${t.border} ${t.bgPage}`}>
                <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-red font-semibold mb-1">
                      05 / Location &amp; Directions
                    </div>
                    <h2 className={`text-lg font-extrabold tracking-tight ${t.textMain}`}>
                      Moraiya, Changodar · Near NH 47 · Ahmedabad
                    </h2>
                  </div>
                </div>
                <div className="h-80 sm:h-96">
                  <iframe
                    src={MAP_EMBED_SRC}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Metro Industrial Park location map — Moraiya Ahmedabad"
                    allowFullScreen
                  />
                </div>
                <div className={`grid grid-cols-2 border-t ${t.border} divide-x ${t.divide}`}>
                  <a
                    href={MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MapPin size={14} aria-hidden="true" />
                    <span>Google Maps</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  <Link
                    to="/site-map"
                    className={`py-4 px-5 ${t.bgSurface} ${t.textMain} hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-colors`}
                  >
                    <span>Check Availability</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>

              {/* Right 5 Cols: Project Card + Related Directory */}
              <div className="lg:col-span-5 space-y-6">
                <div className={`border ${t.border} ${t.bgPage} relative`}>
                  <div className="h-1 bg-brand-red w-full" aria-hidden="true" />
                  <div className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-red font-semibold mb-2">
                      Featured Development
                    </div>
                    <h3 className={`text-xl font-extrabold tracking-tight mb-2 ${t.textMain}`}>
                      {targetProjectName}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-5 ${t.textBody}`}>
                      Review full unit schedules, site photography, interactive plot availability, and the ROI calculator.
                    </p>

                    <Link
                      to={targetProjectUrl}
                      className="w-full py-3.5 px-5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors mb-2.5"
                    >
                      <span>Explore {targetProjectName}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>

                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={dynamicWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2.5 px-3 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-emerald-600 hover:text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors`}
                      >
                        <FaWhatsapp size={13} className="text-emerald-600" aria-hidden="true" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href="tel:+919824235642"
                        className={`py-2.5 px-3 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors`}
                      >
                        <Phone size={13} className="text-brand-red" aria-hidden="true" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Related Markets & Guides Directory */}
                <article className={`border ${t.border} ${t.bgPage}`}>
                  <div className={`px-5 py-3.5 border-b ${t.border} font-mono text-[10px] uppercase tracking-[0.16em] ${t.textMuted}`}>
                    Related Markets
                  </div>
                  <div className={`divide-y ${t.divide}`}>
                    {relatedMarkets.map((entry) => (
                      <Link
                        key={entry.path}
                        to={entry.path}
                        className={`group flex items-center justify-between px-5 py-3 text-sm font-semibold ${t.bgSurface} ${t.textMain} hover:text-brand-red transition-colors`}
                      >
                        <span>{entry.breadcrumb}</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>

                  <div className={`px-5 py-3.5 border-y ${t.border} font-mono text-[10px] uppercase tracking-[0.16em] ${t.textMuted}`}>
                    Investor Guides
                  </div>
                  <div className={`divide-y ${t.divide}`}>
                    {GUIDE_PAGES.map((guide) => (
                      <Link
                        key={guide.path}
                        to={guide.path}
                        className={`group flex items-center justify-between px-5 py-3 text-sm font-semibold ${t.bgSurface} ${t.textMain} hover:text-brand-red transition-colors`}
                      >
                        <span>{guide.breadcrumb}</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM SITE VISIT CTA
        ════════════════════════════════════════════════════════════════ */}
        <section ref={ctaRef} className={`py-16 sm:py-24 ${t.bgPage}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE }}
              className={`border ${t.border} ${t.bgSurface} grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}
            >
              <div className="lg:col-span-7 p-7 sm:p-12">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-red font-semibold mb-4">
                  Direct Site Inspection
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] mb-4 ${t.textMain}`}>
                  Find your industrial space on the NH 47 corridor<span className="text-brand-red">.</span>
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${t.textBody}`}>
                  Browse available units, inspect the interactive plot layout, and schedule a guided site visit at {targetProjectName}.
                </p>
              </div>

              <div className={`lg:col-span-5 p-7 sm:p-12 flex flex-col justify-center gap-3 ${t.bgPage}`}>
                <Link
                  to={targetProjectUrl}
                  className="w-full py-4 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Factory size={16} aria-hidden="true" />
                    <span>Explore {targetProjectName}</span>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <a
                  href={dynamicWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-5 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-emerald-600 hover:text-emerald-600 text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <FaWhatsapp size={16} className="text-emerald-600" aria-hidden="true" />
                    <span>WhatsApp Site Office</span>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <a
                  href="tel:+919824235642"
                  className={`w-full py-4 px-5 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs font-bold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Phone size={15} className="text-brand-red" aria-hidden="true" />
                    <span className="tabular-nums">+91 98242 35642</span>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}