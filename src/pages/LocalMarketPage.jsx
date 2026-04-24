import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Building2, CheckCircle2, ExternalLink, MapPin, Phone,
  Factory, LandPlot, Truck, Shield, Droplets, Clock, TrendingUp,
  Sparkles, Award, Users, Ruler, ChevronRight,
} from 'lucide-react'
import { FaWhatsapp, FaRoad } from 'react-icons/fa'
import SEO from '../components/SEO/SEO'
import { useTheme } from '../context/ThemeContext'
import { GUIDE_PAGES, LOCAL_MARKET_PAGES } from '../data/seoRoutes'
import {
  createBreadcrumbSchema,
  createLocationPageSchema,
  propertySchema,
  realEstateListingSchema,
} from '../utils/schemas'

// ─── Constants ───────────────────────────────────────────────────────────────

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.97909554353!2d72.41748307531053!3d22.914141879249897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20industrial%20park%20moraiya!5e0!3m2!1sen!2sin!4v1767639082192!5m2!1sen!2sin'
const MAP_DIRECTIONS_URL = 'https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad'
const WHATSAPP_URL =
  'https://wa.me/919824235642?text=Hello%2C%20I%20want%20details%20for%20industrial%20space%20availability.'

const QUICK_STATS = [
  { value: '54K',  label: 'Sq.yards Area',    icon: LandPlot   },
  { value: '63',   label: 'Industrial Units',  icon: Factory    },
  { value: '6–8%', label: 'Rental Yield',      icon: TrendingUp },
  { value: '90D',  label: 'Possession',        icon: Clock      },
]

const FEATURES = [
  {
    icon: Ruler,
    title: 'Flexible Unit Sizes',
    desc:  '4,000–50,000 sq.ft to match any scale of operation — from boutique manufacturing to large-format warehousing.',
    img:   '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
    imgAlt:'Industrial shed units of various sizes at Metro Industrial Park Moraiya',
  },
  {
    icon: FaRoad,
    title: '60 ft RCC Roads',
    desc:  'Wide internal roads engineered for heavy trucks and trailers — smooth logistics from gate to unit.',
    img:   '/images/60ft-road-metro-industrial-park-ahmedabad.jpg',
    imgAlt:'60 ft wide RCC road inside Metro Industrial Park Ahmedabad',
  },
  {
    icon: Shield,
    title: '24/7 CCTV Security',
    desc:  'HD cameras throughout the park with trained security guards at the main gate and controlled entry.',
    img:   '/images/metro-industrial-park-entrance-security-moraiya.jpg',
    imgAlt:'CCTV security at Metro Industrial Park entrance Moraiya Ahmedabad',
  },
  {
    icon: Truck,
    title: 'Highway Connectivity',
    desc:  'Direct access to Sarkhej–Bavla NH, major logistics corridors, GIDC zones, and Ahmedabad airport.',
    img:   '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
    imgAlt:'Location map showing highway connectivity of Metro Industrial Park Moraiya',
  },
  {
    icon: Droplets,
    title: '24/7 Water Supply',
    desc:  'Dedicated continuous water availability to every unit with emergency reserve system on-site.',
    img:   null,
    imgAlt: null,
  },
  {
    icon: Award,
    title: 'Quick 90-Day Possession',
    desc:  "One of Ahmedabad's fastest industrial possession timelines — from agreement to key handover.",
    img:   null,
    imgAlt: null,
  },
]

// ─── Motion helpers ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ faq, isDark, text, textMd }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
        isDark
          ? open ? 'border-brand-red/40 bg-gray-900' : 'border-gray-800 bg-black hover:border-gray-700'
          : open ? 'border-brand-red/30 bg-white shadow-md' : 'border-gray-200 bg-white shadow-sm hover:border-gray-300'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-sm sm:text-base ${text}`}
      >
        <span>{faq.q}</span>
        <ChevronRight
          size={16}
          className={`flex-shrink-0 text-brand-red transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className={`px-5 pb-5 text-sm leading-relaxed ${textMd}`}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LocalMarketPage() {
  const { pathname }       = useLocation()
  const { theme }          = useTheme()
  const isDark             = theme === 'dark'

  const page               = LOCAL_MARKET_PAGES.find(e => e.path === pathname)
  const visibleMarketPages = LOCAL_MARKET_PAGES.filter(e => e.showInPrimaryNavigation !== false)
  const relatedMarkets     = visibleMarketPages.filter(e => e.path !== pathname)

  /* section refs */
  const aboutRef    = useRef(null)
  const whyRef      = useRef(null)
  const featuresRef = useRef(null)
  const faqRef      = useRef(null)
  const mapRef      = useRef(null)
  const ctaRef      = useRef(null)

  const aboutInView    = useInView(aboutRef,    { once: true, margin: '-60px' })
  const whyInView      = useInView(whyRef,      { once: true, margin: '-60px' })
  const featuresInView = useInView(featuresRef, { once: true, margin: '-60px' })
  const faqInView      = useInView(faqRef,      { once: true, margin: '-60px' })
  const mapInView      = useInView(mapRef,      { once: true, margin: '-60px' })
  const ctaInView      = useInView(ctaRef,      { once: true, margin: '-60px' })

  if (!page) return null

  /* Schemas */
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: page.breadcrumb, path: page.path },
  ])
  const locationPageSchema = createLocationPageSchema({
    pageTitle:       page.title,
    pageDescription: page.description,
    path:            page.path,
    locationName:    page.locationName,
    focusKeyword:    page.focusKeyword,
  })
  const listingSchema = {
    ...realEstateListingSchema,
    name:        page.schemaName,
    description: page.description,
    url:         `https://www.metrodevelopers.co.in${page.path}`,
  }

  /* FAQ structured data (FAQPage schema) */
  const faqSchema = page.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }
    : null

  /* Shared style tokens */
  const bg     = isDark ? 'bg-black'      : 'bg-white'
  const bgAlt  = isDark ? 'bg-gray-950'   : 'bg-gray-50'
  const text   = isDark ? 'text-white'    : 'text-gray-900'
  const textMd = isDark ? 'text-gray-300' : 'text-gray-600'
  const textSm = isDark ? 'text-gray-400' : 'text-gray-500'
  const card   = isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white shadow-sm'
  const pill   = isDark ? 'bg-red-500/10 border-red-400/30 text-red-400' : 'bg-red-50 border-red-200 text-brand-red'

  const structuredData = [propertySchema, listingSchema, locationPageSchema, breadcrumbSchema]
  if (faqSchema) structuredData.push(faqSchema)

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

      <div className={`min-h-screen ${bg}`}>

        {/* ═══════════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════════════ */}
        <section
          className={`relative pt-16 overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-black to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
          }`}
        >
          {/* grid texture */}
          <div aria-hidden="true" className={`absolute -top-10 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-red-600/10' : 'bg-red-400/8'}`} />
          <div aria-hidden="true" className={`absolute top-10 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-orange-500/8' : 'bg-orange-300/8'}`} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 relative z-10">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-xs">
                <li><Link to="/" className={`${textSm} hover:text-brand-red transition-colors`}>Home</Link></li>
                <li aria-hidden="true" className={textSm}>/</li>
                <li className="text-brand-red font-semibold truncate max-w-[200px] sm:max-w-none">{page.breadcrumb}</li>
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Location badge */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border ${pill}`}>
                  <MapPin size={10} className="animate-pulse" />
                  {page.locationName}
                </span>
                <span className={`text-xs font-semibold ${textSm}`}>Near Sarkhej–Bavla National Highway</span>
              </div>

              {/* H1 */}
              <h1
                className={`text-3xl sm:text-5xl font-extrabold leading-tight mb-5 max-w-4xl ${text}`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {page.heading}
              </h1>

              <p className={`text-base sm:text-lg max-w-3xl leading-relaxed mb-8 ${textMd}`}>
                {page.summary}
              </p>
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                to="/metro-industrial-park"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-red-600 via-brand-red to-rose-600 text-white font-bold rounded-xl text-sm shadow-xl shadow-brand-red/30 hover:scale-105 active:scale-95 transition-transform"
              >
                <Factory size={15} />
                View Metro Industrial Park
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-400'
                    : 'border-green-300/70 bg-green-50 text-green-700 hover:border-green-500'
                }`}
              >
                <FaWhatsapp size={15} />
                WhatsApp Inquiry
              </a>
              <a
                href="tel:919824235642"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'border-gray-700 text-gray-200 hover:border-brand-red'
                    : 'border-gray-200 text-gray-700 hover:border-brand-red'
                }`}
              >
                <Phone size={14} />
                Call Now
              </a>
            </motion.div>

            {/* Quick-stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {QUICK_STATS.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className={`rounded-xl border px-4 py-3 text-center ${
                    isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="text-brand-red flex justify-center mb-1"><Icon size={17} /></div>
                  <div className={`text-xl font-extrabold ${text}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{value}</div>
                  <div className={`text-xs font-medium ${textSm}`}>{label}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            ABOUT THE PARK
        ════════════════════════════════════════════════════════════════ */}
        <section ref={aboutRef} className={`py-16 sm:py-20 ${bg}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={aboutInView ? 'visible' : 'hidden'}
              className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
            >
              {/* Park image */}
              <motion.div variants={fadeUp} className="relative order-last lg:order-first">
                <div className="p-[3px] rounded-2xl bg-gradient-to-br from-red-500 via-orange-400 to-amber-400 shadow-2xl shadow-red-500/20">
                  <div className="rounded-[calc(1rem-3px)] overflow-hidden aspect-[4/3]">
                    <img
                      src="/images/metro-industrial-park-entrance-security-moraiya.jpg"
                      alt={`Metro Industrial Park — industrial sheds near ${page.locationName}`}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.opacity = '0' }}
                    />
                  </div>
                </div>
                <div className={`absolute -bottom-4 left-5 px-4 py-2 rounded-xl text-sm font-bold shadow-xl ${
                  isDark
                    ? 'bg-gray-900 border border-gray-700 text-white shadow-black/40'
                    : 'bg-white border border-gray-200 text-gray-900 shadow-gray-200/80'
                }`}>
                  <span className="text-brand-red">✦</span> Available Now · Moraiya, Ahmedabad
                </div>
              </motion.div>

              {/* Copy */}
              <motion.div variants={fadeUp}>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase border mb-4 ${pill}`}>
                  <Sparkles size={9} />
                  Metro Industrial Park
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold mb-4 leading-tight ${text}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Premier Industrial Space{' '}
                  <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Near Bavla Highway
                  </span>
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed mb-4 ${textMd}`}>
                  Metro Industrial Park is a modern, fully-serviced industrial development spread across{' '}
                  <strong className={text}>54,000 sq.yards</strong> in Moraiya, Changodar — just minutes from the
                  Sarkhej–Bavla National Highway. It hosts <strong className={text}>63 industrial units</strong> ranging
                  from 4,000 to 50,000 sq.ft, designed for manufacturing, logistics, and warehousing at every scale.
                </p>
                <p className={`text-sm sm:text-base leading-relaxed mb-4 ${textMd}`}>
                  Investors benefit from{' '}
                  <strong className="text-green-500">6–8% rental yield</strong> with up to{' '}
                  <strong className="text-green-500">10–12% yearly appreciation</strong> — making this one of
                  Ahmedabad's most compelling industrial real-estate opportunities.
                </p>
                {/* Location-specific pitch — unique per page */}
                {page.localPitch && (
                  <p className={`text-sm sm:text-base leading-relaxed mb-6 border-l-2 border-brand-red/40 pl-4 italic ${textMd}`}>
                    {page.localPitch}
                  </p>
                )}

                {/* Key specs */}
                <ul className="space-y-2.5 mb-6">
                  {[
                    ['Unit Sizes',     '4,000 – 50,000 sq.ft'],
                    ['Ceiling Height', '30–35 ft clearance'],
                    ['Road Width',     '60 ft RCC internally'],
                    ['Possession',     '90 days from agreement'],
                  ].map(([label, val]) => (
                    <li key={label} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                      <span className={`text-sm ${textSm}`}>
                        <span className={`font-semibold ${text}`}>{label}:</span> {val}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/metro-industrial-park"
                  className="inline-flex items-center gap-2 text-brand-red font-bold text-sm hover:gap-3 transition-all"
                >
                  Explore full park details <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            WHY THIS LOCATION
        ════════════════════════════════════════════════════════════════ */}
        <section ref={whyRef} className={`py-16 sm:py-20 ${bgAlt}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div variants={stagger} initial="hidden" animate={whyInView ? 'visible' : 'hidden'}>

              <motion.div variants={fadeUp} className="mb-10">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border mb-4 ${
                  isDark ? 'bg-gray-900 border-gray-700 text-red-300' : 'bg-red-50 border-red-200 text-brand-red'
                }`}>
                  <MapPin size={10} />
                  Why This Location
                </span>
                <h2
                  className={`text-2xl sm:text-4xl font-extrabold ${text}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Why Businesses Choose{' '}
                  <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    {page.locationName}
                  </span>
                </h2>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Demand drivers */}
                <motion.article variants={fadeUp} className={`rounded-2xl border p-6 sm:p-7 ${card}`}>
                  <h3 className={`text-lg font-extrabold mb-5 flex items-center gap-2.5 ${text}`}>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                      <TrendingUp size={14} />
                    </span>
                    Demand drivers in this market
                  </h3>
                  <ul className="space-y-3">
                    {page.demandDrivers?.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-brand-red" />
                        <span className={`text-sm leading-relaxed ${textMd}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>

                {/* Best fit */}
                <motion.article variants={fadeUp} className={`rounded-2xl border p-6 sm:p-7 ${card}`}>
                  <h3 className={`text-lg font-extrabold mb-5 flex items-center gap-2.5 ${text}`}>
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white flex-shrink-0">
                      <Users size={14} />
                    </span>
                    Best fit for
                  </h3>
                  <ul className="space-y-3">
                    {page.bestFor?.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Building2 size={15} className="mt-0.5 flex-shrink-0 text-brand-red" />
                        <span className={`text-sm leading-relaxed ${textMd}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </div>

            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURES GRID
        ════════════════════════════════════════════════════════════════ */}
        <section ref={featuresRef} className={`py-16 sm:py-20 ${bg}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div variants={stagger} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'}>

              <motion.div variants={fadeUp} className="mb-10">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border mb-4 ${
                  isDark ? 'bg-white/10 text-red-300 border-red-400/40' : 'bg-brand-red/10 text-brand-red border-brand-red/30'
                }`}>
                  <Sparkles size={9} className="animate-pulse" />
                  Infrastructure
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold ${text}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Everything Your Business{' '}
                  <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Needs
                  </span>
                </h2>
              </motion.div>

              {/* Image feature cards — rows of 2 */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {FEATURES.slice(0, 2).map(feat => {
                  const Icon = feat.icon
                  return (
                    <motion.div
                      key={feat.title}
                      variants={fadeUp}
                      whileHover={{ y: -5 }}
                      className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50'
                          : 'bg-white border-gray-200 hover:border-brand-red/40 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {feat.img && (
                        <div className="h-44 overflow-hidden">
                          <img
                            src={feat.img} alt={feat.imgAlt}
                            width={800} height={450}
                            loading="lazy" decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                          <Icon size={17} />
                        </div>
                        <h3 className={`text-base font-bold mb-1.5 group-hover:text-brand-red transition-colors ${text}`}>{feat.title}</h3>
                        <p className={`text-sm leading-relaxed ${textSm}`}>{feat.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {FEATURES.slice(2, 4).map(feat => {
                  const Icon = feat.icon
                  return (
                    <motion.div
                      key={feat.title}
                      variants={fadeUp}
                      whileHover={{ y: -5 }}
                      className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50'
                          : 'bg-white border-gray-200 hover:border-brand-red/40 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {feat.img && (
                        <div className="h-44 overflow-hidden">
                          <img
                            src={feat.img} alt={feat.imgAlt}
                            width={800} height={450}
                            loading="lazy" decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                          <Icon size={17} />
                        </div>
                        <h3 className={`text-base font-bold mb-1.5 group-hover:text-brand-red transition-colors ${text}`}>{feat.title}</h3>
                        <p className={`text-sm leading-relaxed ${textSm}`}>{feat.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Compact icon cards */}
              <div className="grid sm:grid-cols-2 gap-5">
                {FEATURES.slice(4, 6).map(feat => {
                  const Icon = feat.icon
                  return (
                    <motion.div
                      key={feat.title}
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      className={`group relative rounded-xl border p-5 overflow-hidden transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-900 border-gray-800 hover:border-brand-red/50'
                          : 'bg-gray-50 border-gray-200 hover:border-brand-red/40 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-orange-400 transition-all duration-500 pointer-events-none" />
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-brand-red bg-brand-red/10 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className={`text-base font-bold mb-1.5 group-hover:text-brand-red transition-colors ${text}`}>{feat.title}</h3>
                          <p className={`text-sm leading-relaxed ${textSm}`}>{feat.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div variants={fadeUp} className="mt-8 text-center">
                <Link
                  to="/metro-industrial-park"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 via-brand-red to-rose-600 text-white font-bold rounded-xl text-sm shadow-xl shadow-brand-red/30 hover:scale-105 transition-transform"
                >
                  <Factory size={15} />
                  See Full Park Details & Gallery
                  <ArrowRight size={14} />
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            INVESTMENT SNAPSHOT
        ════════════════════════════════════════════════════════════════ */}
        <section className={`py-10 border-y ${
          isDark ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800' : 'bg-gradient-to-r from-gray-100 to-white border-gray-200'
        }`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-dashed divide-gray-500/20">
              {[
                { label: 'Rental Yield',      value: '6–8%',   sub: 'Stable annual income',     color: 'text-green-500'  },
                { label: 'Appreciation',      value: '10–12%', sub: 'Yearly capital growth',    color: 'text-orange-500' },
                { label: 'Combined Returns',  value: '16–20%', sub: 'Total return potential',   color: 'text-brand-red'  },
                { label: 'Lease Term',        value: '5–10Y',  sub: 'Stable long-term tenants', color: text              },
              ].map(({ label, value, sub, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center px-2"
                >
                  <div className={`text-2xl sm:text-3xl font-extrabold mb-0.5 ${color}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {value}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${text}`}>{label}</div>
                  <div className={`text-[11px] ${textSm}`}>{sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FAQ — unique per page, drives FAQPage rich result
        ════════════════════════════════════════════════════════════════ */}
        {page.faqs?.length > 0 && (
          <section ref={faqRef} className={`py-14 sm:py-20 ${bgAlt}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <motion.div
                variants={stagger}
                initial="hidden"
                animate={faqInView ? 'visible' : 'hidden'}
              >
                <motion.div variants={fadeUp} className="mb-8">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase border mb-4 ${
                    isDark ? 'bg-gray-900 border-gray-700 text-red-300' : 'bg-red-50 border-red-200 text-brand-red'
                  }`}>
                    Common Questions
                  </span>
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold ${text}`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Frequently Asked Questions
                  </h2>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-3">
                  {page.faqs.map((faq, i) => (
                    <FaqItem
                      key={i}
                      faq={faq}
                      isDark={isDark}
                      text={text}
                      textMd={textMd}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            MAP + SIDEBAR
        ════════════════════════════════════════════════════════════════ */}
        <section ref={mapRef} className={`py-14 sm:py-20 ${bg}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={mapInView ? 'visible' : 'hidden'}
              className="grid gap-6 lg:grid-cols-[1.35fr_1fr]"
            >

              {/* Map */}
              <motion.article variants={fadeUp} className={`overflow-hidden rounded-2xl border ${card}`}>
                <div className={`border-b px-5 py-4 ${isDark ? 'border-gray-800/50' : 'border-gray-100'}`}>
                  <h2 className={`text-lg font-extrabold ${text}`}>Location & Directions</h2>
                  <p className={`mt-1 text-sm ${textSm}`}>Moraiya, Changodar · Near Sarkhej–Bavla NH · Ahmedabad</p>
                </div>
                <div className="h-72 sm:h-80">
                  <iframe
                    src={MAP_EMBED_SRC}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Metro Industrial Park location map — Moraiya Ahmedabad"
                    allowFullScreen
                  />
                </div>
                <div className={`p-4 flex flex-wrap gap-2.5 ${isDark ? 'border-t border-gray-800' : 'border-t border-gray-100'}`}>
                  <a
                    href={MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
                  >
                    <MapPin size={14} />
                    Open in Google Maps
                    <ExternalLink size={12} />
                  </a>
                  <Link
                    to="/site-map"
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border transition-colors ${
                      isDark
                        ? 'border-gray-700 text-gray-200 hover:border-brand-red hover:text-brand-red'
                        : 'border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red'
                    }`}
                  >
                    Check Unit Availability
                  </Link>
                </div>
              </motion.article>

              {/* Sidebar */}
              <div className="space-y-5">

                {/* Primary CTA card */}
                <motion.div
                  variants={fadeUp}
                  className={`rounded-2xl border p-5 ${
                    isDark
                      ? 'border-red-500/30 bg-gradient-to-b from-red-950/50 to-gray-900 shadow-lg shadow-red-500/10'
                      : 'border-red-200 bg-gradient-to-b from-red-50 to-white shadow-md shadow-red-100'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-red-400' : 'text-brand-red'}`}>
                    <Factory size={14} />
                    Metro Industrial Park
                  </div>
                  <p className={`text-sm leading-relaxed mb-4 ${textMd}`}>
                    Get full unit listings, image gallery, interactive site map, ROI calculator, and live availability on the main park page.
                  </p>
                  <Link
                    to="/metro-industrial-park"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 text-sm shadow-lg shadow-brand-red/30"
                  >
                    Explore Metro Industrial Park
                    <ArrowRight size={14} />
                  </Link>
                  <div className="mt-3 flex gap-2.5">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all hover:scale-105 ${
                        isDark
                          ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:border-green-400'
                          : 'border-green-200 bg-green-50 text-green-700 hover:border-green-400'
                      }`}
                    >
                      <FaWhatsapp size={13} /> WhatsApp
                    </a>
                    <a
                      href="tel:919824235642"
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all hover:scale-105 ${
                        isDark
                          ? 'border-gray-700 text-gray-200 hover:border-brand-red'
                          : 'border-gray-200 text-gray-700 hover:border-brand-red'
                      }`}
                    >
                      <Phone size={13} /> Call Now
                    </a>
                  </div>
                </motion.div>

                {/* Related pages */}
                <motion.article variants={fadeUp} className={`rounded-2xl border p-5 ${card}`}>
                  <h2 className={`text-base font-extrabold mb-3 ${text}`}>Explore related pages</h2>
                  <div className="space-y-2">
                    {relatedMarkets.map(entry => (
                      <Link
                        key={entry.path}
                        to={entry.path}
                        className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                          isDark
                            ? 'border-gray-700 bg-gray-800/70 text-gray-100 hover:border-brand-red'
                            : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-brand-red'
                        }`}
                      >
                        {entry.breadcrumb}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>

                  <h3 className={`mt-4 text-sm font-extrabold mb-3 ${text}`}>Investor guides</h3>
                  <div className="space-y-2">
                    {GUIDE_PAGES.map(guide => (
                      <Link
                        key={guide.path}
                        to={guide.path}
                        className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                          isDark
                            ? 'border-gray-700 bg-gray-800/70 text-gray-100 hover:border-brand-red'
                            : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-brand-red'
                        }`}
                      >
                        {guide.breadcrumb}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </motion.article>

              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM CTA
        ════════════════════════════════════════════════════════════════ */}
        <section ref={ctaRef} className={`py-16 sm:py-28 relative overflow-hidden ${bgAlt}`}>
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none ${
              isDark
                ? 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.07),transparent_70%)]'
                : 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_70%)]'
            }`}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={ctaInView ? 'visible' : 'hidden'}
              className={`p-8 sm:p-14 rounded-3xl border shadow-2xl transition-colors duration-500 ${
                isDark
                  ? 'bg-black border-gray-800 hover:border-brand-red/30'
                  : 'bg-white/90 border-gray-200 hover:border-brand-red/30'
              }`}
            >
              <motion.div
                variants={fadeUp}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 ${
                  isDark ? 'bg-red-500/10 border-red-400/30 text-red-400' : 'bg-brand-red/10 border-brand-red/30 text-brand-red'
                }`}
              >
                <Sparkles size={11} />
                <span className="text-xs font-bold tracking-wide">Ready to visit?</span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className={`text-3xl sm:text-4xl font-extrabold mb-4 leading-tight ${text}`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Find Your Perfect{' '}
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Industrial Space
                </span>
              </motion.h2>

              <motion.p variants={fadeUp} className={`text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed ${textMd}`}>
                Browse unit listings, check the interactive site map, and schedule a free site visit at
                Metro Industrial Park — Moraiya's premier industrial address on the Sarkhej–Bavla Highway.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/metro-industrial-park"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-red/40 overflow-hidden text-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Factory size={16} className="relative z-10" />
                  <span className="relative z-10">View Metro Industrial Park</span>
                  <ArrowRight size={15} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105 active:scale-95 text-sm ${
                    isDark
                      ? 'border-gray-700 text-gray-200 hover:border-brand-red/50 bg-black'
                      : 'border-gray-200 text-gray-700 hover:border-brand-red/50 bg-white'
                  }`}
                >
                  <FaWhatsapp size={18} className="text-green-500" />
                  WhatsApp Us
                </a>
                <a
                  href="tel:919824235642"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105 active:scale-95 text-sm ${
                    isDark
                      ? 'border-gray-700 text-gray-200 hover:border-gray-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Phone size={16} />
                  Call Sales Team
                </a>
              </motion.div>

            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}
