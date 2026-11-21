// src/pages/HomePage.jsx
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import {
  Phone, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  MapPin, Play, Calculator, Check, Minus,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import CountUp from 'react-countup';
import SEO from '../components/SEO/SEO';
import { useTheme } from '../context/ThemeContext.jsx';
import FeaturesSection from '../components/Home/FeaturesSection.jsx';
import {
  propertySchema,
  faqSchema,
  imageObjectSchema,
  websiteSchema,
  realEstateListingSchema,
  socialProfileSchema,
  metroPark1IndividualUnitsSchema,
  metroEstateIndividualUnitsSchema,
  metroPark3IndividualUnitsSchema,
} from '../utils/schemas.js';

/* ─── Assets ─── */
const heroImageLight = '/images/metro-industrial-park-entrance-security-moraiya.jpg';
const heroImageDark  = '/images/metro-industrial-park-entrance-dawn.jpg';

/* ─── Motion Curve (Architectural, zero bounce) ─── */
const EASE = [0.16, 1, 0.3, 1];

/* ─── Track Record Metrics ─── */
const stats = [
  { index: '01', countEnd: 30,  suffix: 'k+', label: 'Sq. Yards Developed',    note: 'Moraiya & Changodar belt' },
  { index: '02', countEnd: 43,  suffix: '+',  label: 'Industrial Units Built', note: 'Manufacturing & warehousing' },
  { index: '03', countEnd: 100, suffix: '%',  label: 'Client Satisfaction',    note: 'Clear title & timely handover' },
  { index: '04', countEnd: 6,   suffix: '+',  label: 'Years in Industrial RE', note: 'Operating since 2020' },
];

/* ─── Developments Portfolio ─── */
const developments = [
  {
    code: 'MIP — 01',
    name: 'Industrial Park 1',
    tag: 'Ready Possession',
    statusDot: 'bg-emerald-500',
    location: 'Moraiya, Changodar · NH 47',
    image: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    alt: 'Ready industrial sheds at Metro Industrial Park Moraiya Changodar',
    summary:
      '63 move-in ready industrial sheds & warehouses across 54,000+ sq. yards with 30–35 ft clear ceiling height and 60 ft heavy RCC internal roads.',
    specs: [
      { k: 'Unit Sizes', v: '4,000 – 50,000 sq.ft' },
      { k: 'Inventory',  v: '63 Ready Sheds' },
      { k: 'Est. Yield', v: '6 – 8% Rental' },
    ],
    primaryLink: { to: '/metro-industrial-park', label: 'Explore Sheds' },
    mapLink: { to: '/site-map', state: undefined },
  },
  {
    code: 'MIP — 02',
    name: 'Industrial Park 2',
    tag: 'New Launch · Build Your Own',
    statusDot: 'bg-brand-red',
    location: 'Opp. Metro Industrial Park, Moraiya',
    image: '/images/metro-industrial-park-2-site-plan.jpg',
    alt: 'Industrial plots for sale to build your own shed at Industrial Park 2 Moraiya',
    summary:
      '23 clear-title industrial plots designed for custom-built sheds. Delivered with wide RCC roads, street lights, puran (soil filling), compound wall, and 24/7 security.',
    specs: [
      { k: 'Plot Sizes', v: '300 – 1,930+ sq.yd' },
      { k: 'Inventory',  v: '23 Clear-Title Plots' },
      { k: 'Infra',      v: 'RCC Roads & Gated' },
    ],
    primaryLink: { to: '/metro-industrial-estate', label: 'Explore Plots' },
    mapLink: { to: '/site-map', state: { activeTab: 'estate' } },
  },
  {
    code: 'MIP — 03',
    name: 'Industrial Park 3',
    tag: 'New Launch · Leveling Ongoing',
    statusDot: 'bg-amber-500',
    location: 'Bavla – Rajoda Road, Ahmedabad',
    image: '/images/metro-industrial-park-3-site-plan.jpg',
    alt: 'Industrial plots for sale at Metro Industrial Park 3 Bavla Ahmedabad',
    summary:
      '77 industrial plots spread across ~60,000 sq. yards on the Bavla corridor. Complete developer infrastructure including heavy RCC roads, puran, lighting, and gated access.',
    specs: [
      { k: 'Plot Sizes', v: '334 – 1,643 sq.yd' },
      { k: 'Inventory',  v: '77 Industrial Plots' },
      { k: 'Status',     v: 'Leveling Ongoing' },
    ],
    primaryLink: { to: '/metro-industrial-park-3', label: 'Explore Plots' },
    mapLink: { to: '/site-map', state: { activeTab: 'park3' } },
  },
];

/* ─── Investment Comparison Ledger ─── */
const investments = [
  {
    name: 'Residential Real Estate',
    yieldLabel: '2 – 4%',
    barWidth: 22,
    incomeType: 'Low rental yield',
    taxBenefit: 'No GST input credit',
    notes: [
      'Only 2–4% rental yield in Tier-1 cities',
      'Frequent tenant turnover & high maintenance',
      'No GST input credit available',
    ],
    isUs: false,
  },
  {
    name: 'Gold',
    yieldLabel: '6 – 7%',
    barWidth: 36,
    incomeType: 'CAGR only, zero cashflow',
    taxBenefit: 'Capital gains tax',
    notes: [
      'Zero passive income — appreciation only',
      'Storage, insurance & custody risk',
      'Sentiment-driven, cyclical pricing',
    ],
    isUs: false,
  },
  {
    name: 'Fixed Deposit',
    yieldLabel: '6.5 – 7%',
    barWidth: 38,
    incomeType: 'Pre-tax fixed interest',
    taxBenefit: '100% taxed at slab rate',
    notes: [
      '100% taxable at your income slab',
      'Zero capital appreciation over time',
      'Real return erodes post-inflation',
    ],
    isUs: false,
  },
  {
    name: 'Industrial Shed (MIP)',
    yieldLabel: '16 – 20%',
    barWidth: 96,
    incomeType: '6–8% yield + 10–12% appreciation',
    taxBenefit: 'Full GST input credit',
    notes: [
      'Stable 5–10 year corporate lease agreements',
      '5–10% built-in annual rent escalation',
      'GST input credit benefit for industrial tenants',
      'Strong land appreciation in industrial corridors',
      'Directly supports local employment & production',
    ],
    isUs: true,
  },
];

/* ─── Structural Investment Reasons ─── */
const investReasons = [
  {
    num: '01',
    title: 'Job Creation',
    desc: 'Each leased industrial shed supports 10–50 local jobs. Your capital funds real production, not idle paper wealth.',
  },
  {
    num: '02',
    title: 'Make in India Momentum',
    desc: "Industrial leasing hit a record 37M sq.ft in 2025 — a 28% year-on-year surge across India's top 8 cities.",
  },
  {
    num: '03',
    title: 'Inflation-Indexed Income',
    desc: 'Built-in 5–10% annual rent escalation clauses make industrial leases one of the few assets that compound ahead of inflation.',
  },
  {
    num: '04',
    title: 'Tangible Land & Structure',
    desc: 'Unlike FDs or paper gold, you hold a physical, insurable, income-producing structure backed by appreciating industrial land.',
  },
  {
    num: '05',
    title: 'GST Input Credit',
    desc: 'Industrial lessees can claim full GST input credit on rent — a fiscal advantage unavailable in residential leasing.',
  },
  {
    num: '06',
    title: 'Multi-Year Lease Stability',
    desc: 'Industrial tenants typically commit to 5–10 year leases versus 11-month residential cycles, reducing vacancy friction.',
  },
];

/* ─── Editorial Quotes ─── */
const bigQuotes = [
  {
    text: 'In a free country, freedom has to be defended; and for that, a nation must build modern industries — steel, power, and engineering.',
    author: 'Jamsetji Tata',
    role: 'Founder, Tata Group',
  },
  {
    text: 'Industrialization, driven by infrastructure and self-reliance, is the indispensable engine that transforms a developing country into an economic superpower.',
    author: 'Dr. A.P.J. Abdul Kalam',
    role: '11th President of India & Scientist',
  },
  {
    text: 'Between our ambition and our destiny lies one imperative: building world-class manufacturing infrastructure on the ground.',
    author: 'Dhirubhai Ambani',
    role: 'Founder, Reliance Industries',
  },
  {
    text: "When factories open their gates, they don't just produce goods — they build regional supply networks, elevate local communities, and create generational wealth.",
    author: 'Henry Ford',
    role: 'Founder, Ford Motor Company',
  },
  {
    text: 'No country is ever successful in the long term without a really strong and vibrant manufacturing base.',
    author: 'Alan Mulally',
    role: 'Former CEO, Ford Motor Company',
  },
  {
    text: 'The factory is the machine that builds the machine.',
    author: 'Elon Musk',
    role: 'CEO, Tesla & SpaceX',
  },
  {
    text: "Manufacturing is more than just putting parts together. It's coming up with ideas, testing principles and perfecting the engineering.",
    author: 'James Dyson',
    role: 'Founder, Dyson',
  },
];

/* ─── Cloud-Hosted On-Ground Media ─── */
const cloudUpdates = [
  {
    id: '1',
    log: 'LOG 01',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560096/METRO_INDUSTRIAL_PARK_04.mp4',
    thumbnail: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    title: 'Complete Guide to Metro Industrial Park',
    description:
      'Full walkthrough of Metro Industrial Park showcasing internal RCC roads, shed architecture, and Moraiya highway access.',
    altText: 'Full video walkthrough of Metro Industrial Park in Moraiya Ahmedabad',
    uploadDate: '2026-08-22',
  },
  {
    id: '2',
    log: 'LOG 02',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560385/Metro_industrial_park_reel_1.mov',
    thumbnail: '/images/post2.png',
    title: 'Phase 1 Reaching Completion',
    description:
      'On-ground structural progress across Phase 1 industrial sheds and utility infrastructure.',
    altText: 'Construction progress of Phase 1 industrial sheds at Metro Industrial Park',
    uploadDate: '2026-08-20',
  },
  {
    id: '3',
    log: 'LOG 03',
    type: 'video',
    url: 'https://res.cloudinary.com/iz6nhmsy/video/upload/q_auto,f_auto/v1787560339/metro_industrial_park_pixel_art_video.mp4',
    thumbnail: '/images/post1.png',
    title: 'Warehouses, Sheds & Plots Overview',
    description:
      'Visual breakdown of plot configurations, warehouse bays, and arterial road layout.',
    altText: 'Digital layout visualization of Industrial Park warehouses, sheds and plots',
    uploadDate: '2026-08-24',
  },
];

/* ─── Shared Theme Tokens Helper ─── */
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

/* ════════════════════════════════════════════════
   SECTION HEADER (Asymmetric Editorial Pattern)
════════════════════════════════════════════════ */
const EditorialHeader = memo(({ index, kicker, title, description, rightSlot, isDark }) => {
  const t = getTokens(isDark);
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-10 sm:pb-12 border-b ${t.border}`}>
      <div className="lg:col-span-7">
        <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="text-brand-red font-medium sm:font-semibold">{index}</span>
          <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
          <span className={t.textMuted}>{kicker}</span>
        </div>
        <h2 className={`text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] ${t.textMain}`}>
          {title}
        </h2>
      </div>
      <div className="lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right gap-4">
        {description && (
          <p className={`text-sm sm:text-base leading-relaxed max-w-md ${t.textBody}`}>
            {description}
          </p>
        )}
        {rightSlot}
      </div>
    </div>
  );
});
EditorialHeader.displayName = 'EditorialHeader';

/* ════════════════════════════════════════════════
   01. FIELD LOG / ON-GROUND UPDATES
════════════════════════════════════════════════ */
const FieldLogSection = ({ isDark }) => {
  const t = getTokens(isDark);
  const sectionRef = useRef(null);
  const railRef    = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteUrl    = 'https://www.metrodevelopers.co.in';

  const scrollRail = useCallback((dir) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Latest Updates and On-Ground Progress"
      className={`py-16 sm:py-24 border-b ${t.bgPage} ${t.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <EditorialHeader
          index="01"
          kicker="Site Progress · @metro.industrialpark"
          title={
            <>
              On-Ground{' '}
              <span className="font-serif-editorial italic font-normal text-[1.22em] text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-brand-red inline-block">
                Updates
              </span>
            </>
          }
          description="Unfiltered walkthroughs, road work, and phase-wise construction reels directly from Moraiya and Bavla."
          isDark={isDark}
          rightSlot={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                aria-label="Scroll updates left"
                className={`w-10 h-10 border ${t.border} ${t.bgSurface} ${t.textMain} inline-flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                aria-label="Scroll updates right"
                className={`w-10 h-10 border ${t.border} ${t.bgSurface} ${t.textMain} inline-flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors`}
              >
                <ChevronRight size={16} />
              </button>
              <a
                href="https://www.instagram.com/metro.industrialpark/"
                target="_blank"
                rel="noopener noreferrer"
                className={`h-10 px-4 border ${t.border} ${t.bgSurface} ${t.textMain} inline-flex items-center gap-2 text-xs font-medium sm:font-semibold tracking-wide uppercase hover:border-brand-red hover:text-brand-red transition-colors`}
              >
                <FaInstagram size={13} aria-hidden="true" />
                <span>Instagram</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
          }
        />

        {/* Horizontal Editorial Filmstrip */}
        <div
          ref={railRef}
          className="mt-10 grid grid-flow-col auto-cols-[82%] sm:auto-cols-[46%] lg:auto-cols-[31.5%] gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cloudUpdates.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: idx * 0.08, ease: EASE }}
              className="snap-start flex flex-col group"
              itemScope
              itemType={post.type === 'video' ? 'https://schema.org/VideoObject' : 'https://schema.org/ImageObject'}
            >
              <meta itemProp="name" content={post.title} />
              <meta itemProp="description" content={post.description} />
              <meta itemProp="contentUrl" content={post.url} />
              {post.thumbnail && <meta itemProp="thumbnailUrl" content={`${siteUrl}${post.thumbnail}`} />}
              {post.uploadDate && <meta itemProp="uploadDate" content={post.uploadDate} />}

              {/* Top Metadata Bar */}
              <div className={`flex items-center justify-between py-2.5 border-t border-x px-3.5 font-mono text-[10px] tracking-[0.16em] uppercase ${t.border} ${t.bgSurface} ${t.textMuted}`}>
                <span>{post.log}</span>
                <span>{post.uploadDate}</span>
              </div>

              {/* 4:5 Media Frame */}
              <div className={`relative aspect-[4/5] border ${t.border} bg-black overflow-hidden`}>
                {post.type === 'video' ? (
                  <>
                    <video
                      className="w-full h-full object-cover [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain"
                      controls
                      preload="none"
                      poster={post.thumbnail}
                      playsInline
                      aria-label={post.altText || post.title}
                      title={post.title}
                    >
                      <source src={post.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div
                      aria-hidden="true"
                      className="absolute top-3 right-3 w-8 h-8 bg-black/75 border border-white/20 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity"
                    >
                      <Play size={12} className="text-white fill-white ml-0.5" />
                    </div>
                  </>
                ) : (
                  <img
                    src={post.url}
                    alt={post.altText || post.title}
                    title={post.title}
                    loading="lazy"
                    itemProp="image"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </div>

              {/* Caption */}
              <div className="pt-4 pr-2">
                <h3 className={`text-base font-medium sm:font-semibold tracking-tight mb-1.5 font-sans ${t.textMain}`}>
                  {post.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${t.textBody}`}>
                  {post.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   02. DEVELOPMENTS PORTFOLIO (Swiss 3-Column Index)
════════════════════════════════════════════════ */
const DevelopmentsSection = ({ isDark }) => {
  const t = getTokens(isDark);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      aria-label="Flagship Industrial Developments by Metro Developers"
      className={`py-16 sm:py-28 border-b ${t.bgSurface} ${t.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <EditorialHeader
          index="02"
          kicker="Active Portfolio · Ahmedabad Corridor"
          title={
            <>
              Ready Sheds or{' '}
              <span className="font-calligraphy font-normal text-[1.22em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 inline-block">
                Build Your Own
              </span>
            </>
          }
          description="Three planned industrial parks across Moraiya, Changodar, and Bavla—engineered with heavy RCC internal roads, clear titles, and 24/7 gated infrastructure."
          isDark={isDark}
        />

        {/* Border-Collapsed Architectural 3-Column Ledger */}
        <div className={`mt-10 border ${t.border} grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}>
          {developments.map((dev, i) => (
            <motion.article
              key={dev.code}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={`group flex flex-col justify-between ${t.bgSurface}`}
            >
              <div>
                {/* Top Project Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${t.border}`}>
                  <span className={`font-mono text-xs font-medium sm:font-semibold tracking-[0.14em] ${t.textMain}`}>
                    {dev.code}
                  </span>
                  <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase ${t.textMuted}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dev.statusDot}`} aria-hidden="true" />
                    {dev.tag}
                  </span>
                </div>

                {/* Crisp Architectural Photo */}
                <div className={`relative aspect-[16/10] overflow-hidden border-b ${t.border} bg-neutral-950`}>
                  <img
                    src={dev.image}
                    alt={dev.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7">
                  <div className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider mb-2.5 ${t.textMuted}`}>
                    <MapPin size={12} className="text-brand-red shrink-0" aria-hidden="true" />
                    <span>{dev.location}</span>
                  </div>

                  <h3 className={`text-xl sm:text-2xl font-medium sm:font-semibold tracking-tight mb-3 font-sans ${t.textMain}`}>
                    {dev.name}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-6 ${t.textBody}`}>
                    {dev.summary}
                  </p>

                  {/* Key-Value Specification Rows */}
                  <dl className={`border-t ${t.border} divide-y ${t.divide}`}>
                    {dev.specs.map((row) => (
                      <div key={row.k} className="flex items-center justify-between py-2.5 text-xs">
                        <dt className={`font-mono uppercase tracking-wider ${t.textMuted}`}>{row.k}</dt>
                        <dd className={`font-medium sm:font-semibold tabular-nums ${t.textMain}`}>{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Action Footer */}
              <div className={`grid grid-cols-5 border-t ${t.border} divide-x ${t.divide}`}>
                <Link
                  to={dev.primaryLink.to}
                  className="col-span-3 py-4 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span>{dev.primaryLink.label}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  to={dev.mapLink.to}
                  state={dev.mapLink.state}
                  className={`col-span-2 py-4 px-4 ${t.bgPage} ${t.textMain} hover:text-brand-red text-xs font-medium sm:font-semibold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-1.5 transition-colors`}
                >
                  <MapPin size={13} aria-hidden="true" />
                  <span>Map</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   04. INVESTMENT THESIS & ASSET LEDGER
════════════════════════════════════════════════ */
const InvestmentSection = ({ isDark }) => {
  const t = getTokens(isDark);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveQ((p) => (p + 1) % bigQuotes.length), 6500);
    return () => clearInterval(id);
  }, []);

  const prevQ = useCallback(() => setActiveQ((p) => (p - 1 + bigQuotes.length) % bigQuotes.length), []);
  const nextQ = useCallback(() => setActiveQ((p) => (p + 1) % bigQuotes.length), []);

  return (
    <section
      ref={sectionRef}
      aria-label="Industrial investment comparison"
      className={`py-16 sm:py-28 border-b ${t.bgPage} ${t.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <EditorialHeader
          index="04"
          kicker="Capital Performance · Investor Memorandum"
          title={
            <>
              Industrial Sheds{' '}
              <span className="font-serif-editorial italic font-normal text-[1.2em] text-amber-500 inline-block">
                vs.
              </span>{' '}
              Traditional Assets
            </>
          }
          description="While fixed deposits lose real purchasing power to tax and inflation, industrial sheds in Ahmedabad combine 6–8% rental yields with 10–12% corridor land appreciation."
          isDark={isDark}
          rightSlot={
            <Link
              to="/calculator"
              className={`h-11 px-5 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-brand-red hover:text-brand-red inline-flex items-center gap-2.5 text-xs font-medium sm:font-semibold uppercase tracking-[0.12em] transition-colors`}
            >
              <Calculator size={14} className="text-brand-red" aria-hidden="true" />
              <span>Open ROI Calculator</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          }
        />

        {/* ── Institutional Comparison Ledger ── */}
        <div className={`mt-12 border ${t.border} ${t.bgSurface}`} role="list" aria-label="Investment comparison">
          {/* Desktop Column Headers */}
          <div className={`hidden lg:grid lg:grid-cols-12 gap-6 px-7 py-3.5 border-b ${t.border} font-mono text-[10px] tracking-[0.18em] uppercase ${t.textMuted}`}>
            <div className="col-span-3">Asset Class</div>
            <div className="col-span-3">Total Annual Return</div>
            <div className="col-span-2">Fiscal / Tax Profile</div>
            <div className="col-span-4">Structural Realities</div>
          </div>

          <div className={`divide-y ${t.divide}`}>
            {investments.map((inv, idx) => (
              <motion.div
                key={inv.name}
                role="listitem"
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE }}
                className={`relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 px-5 sm:px-7 py-6 sm:py-7 transition-colors ${
                  inv.isUs
                    ? isDark
                      ? 'bg-[#171213]'
                      : 'bg-[#FBF6F5]'
                    : ''
                }`}
              >
                {/* Left Red Indicator Bar on Industrial Shed */}
                {inv.isUs && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
                )}

                {/* Asset Name */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2.5">
                    <span className={`font-mono text-[10px] ${inv.isUs ? 'text-brand-red font-medium sm:font-semibold' : t.textMuted}`}>
                      0{idx + 1}
                    </span>
                    <h3 className={`text-base sm:text-lg font-medium sm:font-semibold tracking-tight font-sans ${t.textMain}`}>
                      {inv.name}
                    </h3>
                  </div>
                  {inv.isUs && (
                    <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-red font-medium sm:font-semibold">
                      Featured Asset Class
                    </span>
                  )}
                </div>

                {/* Yield + Proportional Bar */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <div
                    className={`text-2xl sm:text-3xl font-semibold sm:font-bold tracking-tight tabular-nums ${
                      inv.isUs ? 'text-brand-red' : t.textMain
                    }`}
                    aria-label={`${inv.name} returns: ${inv.yieldLabel}`}
                  >
                    {inv.yieldLabel}
                  </div>
                  <div className={`w-full h-1.5 mt-2.5 mb-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${inv.barWidth}%` } : { width: 0 }}
                      transition={{ duration: 0.9, delay: 0.2 + idx * 0.1, ease: EASE }}
                      className={`h-full ${inv.isUs ? 'bg-brand-red' : isDark ? 'bg-white/35' : 'bg-black/35'}`}
                    />
                  </div>
                  <span className={`font-mono text-[11px] ${t.textMuted}`}>{inv.incomeType}</span>
                </div>

                {/* Fiscal Profile */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <span className={`lg:hidden font-mono text-[10px] uppercase tracking-widest mb-1 ${t.textMuted}`}>
                    Fiscal Profile
                  </span>
                  <span className={`text-xs sm:text-sm font-medium sm:font-semibold ${inv.isUs ? t.textMain : t.textBody}`}>
                    {inv.taxBenefit}
                  </span>
                </div>

                {/* Key Notes */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <ul className="space-y-1.5">
                    {inv.notes.map((line, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-snug">
                        {inv.isUs ? (
                          <Check size={14} className="text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <Minus size={14} className={`${t.textMuted} shrink-0 mt-0.5`} aria-hidden="true" />
                        )}
                        <span className={inv.isUs ? t.textMain : t.textBody}>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Six Structural Advantages (Border-Collapsed 3x2 Architectural Grid) ── */}
        <div className="mt-16 sm:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.textMuted}`}>
                Beyond Financial Returns
              </span>
              <h3 className={`text-xl sm:text-2xl lg:text-3xl font-medium sm:font-semibold lg:font-bold tracking-tight mt-1 font-sans ${t.textMain}`}>
                Six{' '}
                <span className="font-serif-display italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500 inline-block">
                  Structural
                </span>{' '}
                Advantages
              </h3>
            </div>
            <p className={`font-mono text-xs ${t.textMuted}`}>
              37M SQ.FT LEASED IN INDIA (2025) · +28% YOY
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6 w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {investReasons.map((r, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={r.num}
                  initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className={`w-[82%] sm:w-[70%] lg:w-[58%] max-w-xl p-5 sm:p-6 border ${t.border} ${t.bgSurface} ${
                    isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'
                  } transition-colors ${
                    isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-brand-red tracking-widest">
                      {r.num}
                    </span>
                    <span className={`w-8 h-px ${isDark ? 'bg-white/15' : 'bg-black/15'}`} aria-hidden="true" />
                  </div>
                  <h4 className={`text-base sm:text-lg font-semibold tracking-tight mb-2 font-sans ${t.textMain}`}>
                    {r.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${t.textBody}`}>
                    {r.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Quiet Editorial Pull-Quote ── */}
        <div
          className={`mt-16 sm:mt-24 border-y ${t.border} py-12 sm:py-16`}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-9 min-h-[150px] sm:min-h-[130px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeQ}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p
                    className={`text-2xl sm:text-4xl lg:text-[2.5rem] italic leading-[1.22] mb-5 ${t.textMain}`}
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                  >
                    “{bigQuotes[activeQ].text}”
                  </p>
                  <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.14em]">
                    <span className={`font-medium sm:font-semibold ${t.textMain}`}>{bigQuotes[activeQ].author}</span>
                    <span className="text-brand-red" aria-hidden="true">/</span>
                    <span className={t.textMuted}>{bigQuotes[activeQ].role}</span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-3 flex items-center lg:justify-end gap-3">
              <span className={`font-mono text-xs tabular-nums mr-2 ${t.textMuted}`}>
                {String(activeQ + 1).padStart(2, '0')} / {String(bigQuotes.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={prevQ}
                aria-label="Previous quote"
                className={`w-10 h-10 border ${t.border} ${t.bgSurface} ${t.textMain} inline-flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextQ}
                aria-label="Next quote"
                className={`w-10 h-10 border ${t.border} ${t.bgSurface} ${t.textMain} inline-flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════ */
const HomePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = getTokens(isDark);

  const heroImage = isDark ? heroImageDark : heroImageLight;
  const heroAlt   = isDark
    ? 'Metro Industrial Park entrance at dawn — industrial sheds in Moraiya, Ahmedabad'
    : 'Metro Industrial Park entrance security gate — industrial sheds for sale in Moraiya, Ahmedabad';

  const heroRef  = useRef(null);
  const statsRef = useRef(null);
  const ctaRef   = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });
  const ctaInView   = useInView(ctaRef,   { once: true, margin: '-80px' });

  // Subtle architectural scroll parallax on hero image
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgY = useTransform(heroScroll, [0, 1], ['0%', '14%']);

  // Lenis inertial smooth scroll — desktop mousewheel only, touch devices use native 120Hz smooth scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    'Hello, I am interested in industrial sheds at Metro Industrial Park, Moraiya. Please share availability and pricing.'
  );

  const homeSchemas = useMemo(() => [
    websiteSchema,
    propertySchema,
    realEstateListingSchema,
    metroPark1IndividualUnitsSchema,
    metroEstateIndividualUnitsSchema,
    metroPark3IndividualUnitsSchema,
    faqSchema,
    imageObjectSchema,
    socialProfileSchema,
  ], []);

  return (
    <>
      <SEO
        title="Metro Developers | Industrial Parks in Ahmedabad & Gujarat (MIP 1, 2, 3)"
        description="Official website of Metro Developers — leading industrial developers of Metro Industrial Parks (MIP 1, MIP 2, MIP 3) across Moraiya, Changodar, and Bavla, Ahmedabad. Industrial sheds, warehouses, and plots for sale & lease."
        keywords="metro developers, metro industrial park, MIP, MIP ahmedabad, metro developers ahmedabad, MIP 1, MIP 2, MIP 3, metro industrial park 1, metro industrial park 2, metro industrial park 3, industrial sheds moraiya, industrial park changodar, industrial plots gujarat, industrial land bavla"
        canonical="/"
        ogImage="/images/metro-industrial-park-entrance-dawn.jpg"
        ogImageAlt="Metro Developers — Metro Industrial Parks (MIP 1, 2, 3) in Moraiya, Changodar, and Bavla, Ahmedabad"
        structuredData={homeSchemas}
      />

      <h1 className="sr-only">
        Metro Developers — Industrial Parks (MIP 1, 2, 3), Sheds, Warehouses &amp; Plots in Ahmedabad, Gujarat
      </h1>

      <div
        className={`min-h-screen ${t.bgPage} ${t.textMain} selection:bg-brand-red selection:text-white`}
      >
        {/* ════════ ARCHITECTURAL HERO ════════ */}
        <section
          ref={heroRef}
          aria-label="Hero — Metro Industrial Park, Moraiya, Ahmedabad"
          className="relative pt-16"
        >
          {/* Full-bleed Parallax Media Frame */}
          <div className="relative h-[52svh] sm:h-[66svh] lg:h-[76svh] overflow-hidden bg-black">
            <motion.img
              src={heroImage}
              alt={heroAlt}
              width={1600}
              height={900}
              style={{ y: heroImgY, scale: 1.06 }}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

            {/* Clean Directional Photographic Scrim */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0 left-0 w-full sm:w-3/5 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Coordinate Strip */}
            <div className="absolute top-0 inset-x-0 z-10 border-b border-white/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-white/80">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-red" aria-hidden="true" />
                  <span>Moraiya · Changodar · Bavla</span>
                </span>
                <span className="hidden sm:inline text-white/65">
                  22.9141° N, 72.4207° E · AHMEDABAD
                </span>
              </div>
            </div>

            {/* Bottom-Left Editorial Statement */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: EASE }}
                    className="lg:col-span-8"
                  >
                    <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/75 mb-3">
                      Metro Enterprise · Industrial Real Estate
                    </p>
                    <p
                      aria-hidden="true"
                      className="text-3xl sm:text-5xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.12]"
                    >
                      Built for{' '}
                      <span className="font-calligraphy font-normal text-[1.25em] tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 inline-block mr-1.5 drop-shadow-sm">
                        Manufacturing
                      </span>
                      <span className="block text-white/90">
                        <span className="font-serif-display italic font-semibold text-white">Scale</span>
                        <span className="text-brand-red">.</span>
                      </span>
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
                    className="hidden sm:block lg:col-span-4"
                  >
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed border-l-2 border-brand-red pl-4">
                      High-clearance industrial sheds and clear-title plots engineered for heavy manufacturing, logistics, and long-term capital growth across Ahmedabad.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Architect's Title Block (Metrics + Direct Actions) ── */}
          <div className={`border-y ${t.border} ${t.bgSurface}`}>
            <div className="max-w-7xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}>
                {/* Key Metrics (3 cells) */}
                <div
                  className={`lg:col-span-7 grid grid-cols-3 divide-x ${t.divide}`}
                  role="list"
                  aria-label="Key metrics"
                >
                  {[
                    { value: '6–8%', label: 'Rental Yield',     accent: true },
                    { value: '63',   label: 'Ready Units',      accent: false },
                    { value: '54K+', label: 'Sq. Yards Area',   accent: false },
                  ].map((m) => (
                    <div key={m.label} role="listitem" className="px-4 sm:px-7 py-5 sm:py-6">
                      <div className={`text-xl sm:text-3xl font-medium sm:font-semibold lg:font-bold tracking-tight tabular-nums ${m.accent ? 'text-brand-red' : t.textMain}`}>
                        {m.value}
                      </div>
                      <div className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] mt-1 ${t.textMuted}`}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Actions */}
                <div className={`lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 divide-x ${t.divide}`}>
                  <Link
                    to="/metro-industrial-park"
                    aria-label="Explore industrial shed units at Metro Industrial Park"
                    className="col-span-2 sm:col-span-1 py-4 sm:py-0 px-5 bg-brand-red hover:bg-red-700 text-white text-xs font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>

                  <Link
                    to="/site-map"
                    aria-label="Check industrial shed availability at Metro Industrial Park"
                    className={`py-4 sm:py-0 px-4 ${t.bgSurface} ${t.textMain} hover:text-brand-red text-xs font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5 transition-colors border-t sm:border-t-0 ${t.border}`}
                  >
                    <MapPin size={13} className="text-brand-red shrink-0" aria-hidden="true" />
                    <span>Availability</span>
                  </Link>

                  <a
                    href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Metro Industrial Park"
                    className={`py-4 sm:py-0 px-4 ${t.bgSurface} ${t.textMain} hover:text-emerald-600 text-xs font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5 transition-colors border-t sm:border-t-0 ${t.border}`}
                  >
                    <FaWhatsapp size={14} className="text-emerald-600 shrink-0" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ 01. FIELD LOG / ON-GROUND UPDATES ════════ */}
        <FieldLogSection isDark={isDark} />

        {/* ════════ 02. DEVELOPMENTS PORTFOLIO ════════ */}
        <DevelopmentsSection isDark={isDark} />

        {/* ════════ INFRASTRUCTURE FEATURES (EXISTING COMPONENT) ════════ */}
        <FeaturesSection isDark={isDark} />

        {/* ════════ 03. TRACK RECORD (MONUMENTAL SWISS BAND) ════════ */}
        <section
          ref={statsRef}
          aria-label="Metro Industrial Park by the numbers"
          className={`py-16 sm:py-24 border-y ${t.bgSurface} ${t.border}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span className="text-brand-red font-medium sm:font-semibold">03</span>
                  <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                  <span className={t.textMuted}>Track Record</span>
                </div>
                <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight ${t.textMain}`}>
                  Delivered on{' '}
                  <span className="font-serif-display italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 inline-block">
                    Ground
                  </span>
                </h2>
              </div>
              <p className={`font-mono text-xs uppercase tracking-[0.14em] ${t.textMuted}`}>
                Audited Execution · Since 2020
              </p>
            </div>

            <div className={`grid grid-cols-2 lg:grid-cols-4 border-t border-l ${t.border}`}>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className={`p-6 sm:p-9 border-r border-b ${t.border} ${t.bgPage}`}
                >
                  <div className={`font-mono text-[11px] mb-6 ${t.textMuted}`}>
                    {stat.index}
                  </div>
                  <div
                    className={`text-4xl sm:text-6xl font-bold tracking-tight tabular-nums mb-2 ${t.textMain}`}
                    aria-label={`${stat.countEnd}${stat.suffix} ${stat.label}`}
                  >
                    <CountUp
                      end={stat.countEnd}
                      suffix={stat.suffix}
                      duration={2.2}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold tracking-tight ${t.textMain}`}>
                    {stat.label}
                  </div>
                  <div className={`text-xs mt-1 ${t.textMuted}`}>
                    {stat.note}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ 04. INVESTMENT THESIS ════════ */}
        <InvestmentSection isDark={isDark} />

        {/* ════════ 05. SITE VISIT & DIRECT CONSULTATION ════════ */}
        <section
          ref={ctaRef}
          aria-label="Contact Metro Industrial Park — book a site visit"
          className={`py-16 sm:py-28 ${t.bgSurface}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              className={`border ${t.border} grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${t.divide}`}
            >
              {/* Left 7 Cols — Statement & Site Coordinates */}
              <div className="lg:col-span-7 p-7 sm:p-12 lg:p-14 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-5 font-mono text-[11px] tracking-[0.18em] uppercase">
                    <span className="text-brand-red font-medium sm:font-semibold">05</span>
                    <span className={`w-6 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
                    <span className={t.textMuted}>Direct Site Office</span>
                  </div>

                  <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-5 ${t.textMain}`}>
                    Schedule a site visit in{' '}
                    <span className="font-calligraphy font-normal text-[1.25em] text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-rose-500 to-amber-400 inline-block">
                      Moraiya
                    </span>
                    <span className="text-brand-red">.</span>
                  </h2>

                  <p className={`text-sm sm:text-base leading-relaxed max-w-lg ${t.textBody}`}>
                    Speak directly with the developers for current unit availability, plot dimensions, and customised RCC or lease terms.
                  </p>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t ${t.border} font-mono text-xs`}>
                  <div>
                    <div className={`uppercase tracking-[0.14em] mb-1 ${t.textMuted}`}>Site Office</div>
                    <div className={t.textMain}>
                      Opp. Suvas Ind. Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad 382213
                    </div>
                  </div>
                  <div>
                    <div className={`uppercase tracking-[0.14em] mb-1 ${t.textMuted}`}>Hours</div>
                    <div className={t.textMain}>Mon – Sun · 11:00 AM – 7:00 PM</div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols — Stacked Direct Actions */}
              <div className={`lg:col-span-5 p-7 sm:p-12 lg:p-14 flex flex-col justify-center gap-4 ${t.bgPage}`}>
                <a
                  href={`https://wa.me/919824235642?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Metro Industrial Park to enquire about industrial sheds"
                  className="w-full py-4 px-6 bg-brand-red hover:bg-red-700 text-white text-xs sm:text-sm font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors"
                >
                  <span className="inline-flex items-center gap-3">
                    <FaWhatsapp size={18} aria-hidden="true" />
                    <span>WhatsApp Site Office</span>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>

                <a
                  href="tel:+919824235642"
                  aria-label="Call Metro Industrial Park at +91 98242 35642"
                  className={`w-full py-4 px-6 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs sm:text-sm font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Phone size={16} className="text-brand-red" aria-hidden="true" />
                    <span className="tabular-nums">+91 98242 35642</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>

                <Link
                  to="/site-map"
                  className={`w-full py-4 px-6 border ${t.border} ${t.bgSurface} ${t.textMain} hover:border-brand-red hover:text-brand-red text-xs sm:text-sm font-medium sm:font-semibold uppercase tracking-[0.12em] inline-flex items-center justify-between transition-colors`}
                >
                  <span className="inline-flex items-center gap-3">
                    <MapPin size={16} className="text-brand-red" aria-hidden="true" />
                    <span>Interactive Plot Map</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;