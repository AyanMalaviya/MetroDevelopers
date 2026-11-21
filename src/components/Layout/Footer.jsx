// src/components/Footer/Footer.jsx
import { useState } from 'react';
import { MapPin, Phone, Mail, Plus, Minus, ArrowUp, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const EASE = [0.16, 1, 0.3, 1];

// ── FAQ data — numbers aligned with schemas.js ─────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'What sizes are available?',
    a: 'Units range from 4,000 to 50,000 sq.ft across 63 sheds in a 54,000 sq.yard park.',
  },
  {
    q: 'What is the expected ROI?',
    a: 'Rental yield is 6–8%, yearly appreciation can add up to 10–12%, and the combined potential is 16–20% for industrial sheds at Metro Industrial Park.',
  },
  {
    q: 'Why is industrial property a better investment than residential?',
    a: 'Industrial properties deliver 6–8% net rental yields (nearly 3x higher than 2–3% residential yields) and 10–15% annual capital appreciation along the NH 47 corridor, totaling 16–23% annualized returns. Corporate leases run for 5–10 years under triple-net terms where tenants bear maintenance, eliminating the recurring repairs and vacancies typical in residential flats.',
  },
  {
    q: 'How long does possession take?',
    a: 'Possession is available within 90 days of booking.',
  },
  {
    q: 'Is RCC construction available?',
    a: 'Available on request with additional charges.',
  },
  {
    q: 'What amenities are included?',
    a: '24×7 water, CCTV, security guards, weigh bridge, 60 ft RCC roads, 30–35 ft ceiling clearance.',
  },
  {
    q: 'Can I buy land to build my own shed?',
    a: 'Yes. At Industrial Park 2 (opp. Industrial Park 1), we offer clear-title industrial plots to "Build Your Own Shed" with developer infrastructure: Wide Heavy RCC roads, Street lights, Puran (Soil filling), Compound wall, and 24/7 Gated security.',
  },
  {
    q: 'Where is Metro Industrial Park 3 and what are its features?',
    a: 'Industrial Park 3 is located on Bavla – Rajoda Road, Ahmedabad. It features 77 industrial plots to "Build Your Own Shed" with bookings open, land possession soon, Wide Heavy RCC roads, Street lights, Puran (Soil filling), Compound wall, and 24/7 Gated security.',
  },
  {
    q: 'Where is the park located?',
    a: 'Moraiya, Changodar — near NH 47 (Sarkhej Bavla Highway), opposite Suvas Industrial Estate, behind Siya Logistics Park.',
  },
  {
    q: 'What is the pricing?',
    a: 'Contact us at +91 98242 35642 or WhatsApp for current sale and lease pricing.',
  },
];

// ── Quick links ────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { to: '/',                                                   label: 'Home'                                   },
  { to: '/industrial-shed-for-lease-ahmedabad',                label: 'Industrial Shed for Lease'              },
  { to: '/metro-industrial-park',                              label: 'Industrial Park 1 (Sheds)'              },
  { to: '/metro-industrial-estate',                            label: 'Industrial Park 2 (Plots)'              },
  { to: '/metro-industrial-park-3',                            label: 'Industrial Park 3 (Bavla)'              },
  { to: '/metro-arcade',                                       label: 'Metro Arcade'                           },
  { to: '/warehouses-in-changodar',                            label: 'Warehouses in Changodar'                },
  { to: '/industrial-sheds-in-changodar',                      label: 'Industrial Sheds in Changodar'          },
  { to: '/industrial-sheds-near-sarkhej-bavla-highway',        label: 'Sheds Near NH 47'                       },
  { to: '/industrial-sheds-in-ahmedabad',                      label: 'Industrial Sheds in Ahmedabad'          },
  { to: '/investment-in-real-estate-in-ahmedabad',             label: 'Investment in Real Estate in Ahmedabad' },
  { to: '/guides/gst-input-credit-industrial-tenants-gujarat', label: 'GST Input Credit Guide'                 },
  { to: '/guides/warehousing-yield-cagr-gujarat',              label: 'Warehousing Yield Guide'                },
  { to: '/site-map',                                           label: 'Site Map'                               },
  { to: '/calculator',                                         label: 'ROI Calculator'                         },
  { to: '/contact',                                            label: 'Contact Us'                             },
  {
    href: 'https://g.page/r/CfbFhZSjMaH1EBI/review',
    label: 'Write a Review',
    external: true,
  },
];

// ── Accessible FAQ Row ─────────────────────────────────────────────────────────
const FaqRow = ({ item, index, isDark }) => {
  const [open, setOpen] = useState(false);

  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.1]' : 'border-black/[0.11]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textBody  = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';
  const textMuted = isDark ? 'text-[#6E6E77]' : 'text-[#73726C]';

  return (
    <div className={`border-r border-b ${border} ${bgSurface}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors ${
          isDark ? 'hover:bg-[#17171B]' : 'hover:bg-[#FAF9F6]'
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="font-mono text-[10px] font-semibold text-brand-red pt-0.5 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-xs sm:text-[13px] font-bold leading-snug ${open ? 'text-brand-red' : textMain}`}>
            {item.q}
          </span>
        </div>
        <span
          aria-hidden="true"
          className={`w-6 h-6 border ${border} flex items-center justify-center shrink-0 transition-colors ${
            open ? 'border-brand-red text-brand-red' : textMuted
          }`}
        >
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <p className={`px-5 pb-4 pl-11 text-xs leading-relaxed ${textBody}`}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Footer ────────────────────────────────────────────────────────────────
const Footer = () => {
  const { theme } = useTheme();
  const isDark      = theme === 'dark';
  const currentYear = new Date().getFullYear();
  const [faqOpen, setFaqOpen] = useState(false);

  const mapsUrl   = 'https://maps.app.goo.gl/6fBawQdYxcmUw3WE6';
  const mapsQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mapsUrl)}`;

  const bgPage    = isDark ? 'bg-[#0B0B0D]' : 'bg-[#F8F9FA]';
  const bgSurface = isDark ? 'bg-[#121215]' : 'bg-[#FFFFFF]';
  const border    = isDark ? 'border-white/[0.12]' : 'border-gray-200';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-gray-200';
  const textMain  = isDark ? 'text-white' : 'text-gray-900';
  const textBody  = isDark ? 'text-gray-200' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t ${border} ${bgPage} ${textMain}`}
    >
      {/* ── Collapsible FAQ Index Bar ── */}
      <div className={`border-b ${border} ${bgSurface}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setFaqOpen((v) => !v)}
            aria-expanded={faqOpen}
            aria-controls="footer-faq-panel"
            className="w-full flex items-center justify-between py-4 sm:py-5 text-left group"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-red">
                FAQ
              </span>
              <span className={`w-5 h-px ${isDark ? 'bg-white/25' : 'bg-black/25'}`} aria-hidden="true" />
              <span className={`text-sm sm:text-base font-bold tracking-tight group-hover:text-brand-red transition-colors ${textMain}`}>
                Frequently Asked Questions
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${border} ${bgPage} ${textMuted}`}>
                {FAQ_ITEMS.length} Topics
              </span>
            </div>

            <span
              aria-hidden="true"
              className={`w-8 h-8 border ${border} flex items-center justify-center shrink-0 transition-colors ${
                faqOpen ? 'bg-brand-red border-brand-red text-white' : `${bgPage} ${textMain} group-hover:border-brand-red group-hover:text-brand-red`
              }`}
            >
              {faqOpen ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {faqOpen && (
              <motion.div
                id="footer-faq-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div className={`pb-8 grid grid-cols-1 md:grid-cols-2 border-t border-l ${border}`}>
                  {FAQ_ITEMS.map((item, i) => (
                    <FaqRow key={i} item={item} index={i} isDark={isDark} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main 12-Col Border-Collapsed Footer Ledger ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x ${divide}`}>

          {/* Col 1 (3 cols) — Brand, Socials & Google Rating */}
          <div className="lg:col-span-3 py-10 lg:pr-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 border ${isDark ? 'border-white/20' : border} ${bgSurface} flex items-center justify-center p-1.5 flex-shrink-0`}>
                  <img
                    src="/MDLogo.png"
                    alt="Metro Developers logo"
                    width={36}
                    height={36}
                    loading="lazy"
                    className="w-full h-full object-contain brand-logo-dark-outline"
                  />
                </div>
                <div className="leading-tight">
                  <span className={`block text-base font-bold tracking-tight ${textMain}`}>
                    Metro Developers
                  </span>
                  <span className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${textMuted}`}>
                    Ahmedabad · Gujarat
                  </span>
                </div>
              </div>

              <p className={`text-xs sm:text-[13px] leading-relaxed mb-6 ${textBody}`}>
                Industrial &amp; warehousing parks across Moraiya, Changodar, and Bavla. Ready sheds and clear-title NA plots built for manufacturing scale.
              </p>

              {/* Sharp Square Social Buttons */}
              <div className="flex items-center gap-2">
                {[
                  { href: 'https://wa.me/919824235642',                     icon: <FaWhatsapp size={15} />,  label: 'WhatsApp'  },
                  { href: 'https://www.instagram.com/metro.industrialpark/',icon: <FaInstagram size={15} />, label: 'Instagram' },
                  { href: 'https://www.facebook.com/metroindustrialpark1',  icon: <FaFacebook size={15} />,  label: 'Facebook'  },
                ].map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`w-9 h-9 border ${border} ${bgSurface} ${textMain} hover:bg-brand-red hover:border-brand-red hover:text-white flex items-center justify-center transition-colors`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Google Business Authority Block */}
            <a
              href="https://g.page/r/CfbFhZSjMaH1EBI/review"
              target="_blank"
              rel="noopener noreferrer"
              title="Google Business Profile Reviews for Metro Industrial Park"
              className={`block border ${border} ${bgSurface} hover:border-brand-red p-3.5 transition-colors group`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-500 text-xs tracking-widest" aria-hidden="true">★★★★★</span>
                <ArrowUpRight size={13} className={`${textMuted} group-hover:text-brand-red transition-colors`} aria-hidden="true" />
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-xs font-bold ${textMain}`}>5.0 on Google</span>
                <span className={`font-mono text-[10px] uppercase tracking-wider ${textMuted}`}>Write Review</span>
              </div>
            </a>
          </div>

          {/* Col 2 (5 cols) — Directory / Quick Links in 2 Sub-Columns */}
          <nav aria-label="Footer quick links" className="lg:col-span-5 py-10 lg:px-8">
            <div className="flex items-center gap-2.5 mb-5 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span className="text-brand-red font-semibold">01</span>
              <span className={textMuted}>Directory</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {QUICK_LINKS.map(({ to, href, label, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs font-medium ${textBody} hover:text-brand-red transition-colors`}
                    >
                      <span>{label}</span>
                      <ArrowUpRight size={11} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to={to}
                      className={`text-xs font-medium ${textBody} hover:text-brand-red transition-colors`}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 (4 cols) — Site Office Contact & QR */}
          <div className="lg:col-span-4 py-10 lg:pl-8">
            <div className="flex items-center gap-2.5 mb-5 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span className="text-brand-red font-semibold">02</span>
              <span className={textMuted}>Site Office</span>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="text-brand-red flex-shrink-0 mt-0.5" size={14} aria-hidden="true" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs leading-relaxed ${textBody} hover:text-brand-red transition-colors`}
                >
                  Opp. Suvas Industrial Estate, Behind Siya Industrial Park, Moraiya, Changodar, Ahmedabad – 382213, Gujarat
                </a>
              </li>

              {[
                { href: 'tel:+919824235642', label: '+91 98242 35642' },
                { href: 'tel:+916356776767', label: '+91 63567 76767' },
                { href: 'tel:+916356766767', label: '+91 63567 66767' },
              ].map(({ href, label }) => (
                <li key={href} className="flex items-center gap-2.5">
                  <Phone className="text-brand-red flex-shrink-0" size={13} aria-hidden="true" />
                  <a href={href} className={`font-mono text-xs tabular-nums ${textMain} hover:text-brand-red transition-colors`}>
                    {label}
                  </a>
                </li>
              ))}

              <li className="flex items-center gap-2.5">
                <Mail className="text-brand-red flex-shrink-0" size={13} aria-hidden="true" />
                <a
                  href="mailto:metrodevelopers26@gmail.com"
                  className={`text-xs break-all ${textBody} hover:text-brand-red transition-colors`}
                >
                  metrodevelopers26@gmail.com
                </a>
              </li>
            </ul>

            {/* Desktop Maps QR Block */}
            <div className={`hidden lg:flex mt-6 items-center gap-3.5 border ${border} ${bgSurface} p-3`}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-shrink-0 bg-white p-1 border border-black/10"
                aria-label="Open Metro Industrial Park in Google Maps"
              >
                <img
                  src={mapsQrUrl}
                  alt="Scan QR code to open Metro Industrial Park in Google Maps"
                  width={84}
                  height={84}
                  loading="lazy"
                  className="w-[84px] h-[84px] block"
                />
              </a>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-red mb-1">
                  Scan for Directions
                </p>
                <p className={`text-[11px] leading-relaxed ${textBody}`}>
                  Open Metro Industrial Park directly in Google Maps on your phone.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Copyright Bar ── */}
      <div className={`border-t ${border} ${bgSurface}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <p className={textMuted}>
            © {currentYear} Metro Developers. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={scrollToTop}
              className={`inline-flex items-center gap-1.5 uppercase tracking-wider ${textMuted} hover:text-brand-red transition-colors`}
            >
              <ArrowUp size={12} aria-hidden="true" />
              <span>Top</span>
            </button>

            <span className={textMuted}>
              Developed by{' '}
              <a
                href="https://www.instagram.com/ayanmalaviya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red font-semibold hover:underline underline-offset-2"
              >
                Ayan Malaviya
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;