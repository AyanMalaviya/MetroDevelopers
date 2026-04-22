// src/components/Footer/Footer.jsx
import { useState } from 'react';
import { MapPin, Phone, Mail, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';


// ── FAQ sub-component ──────────────────────────────────────────────────────────
const FaqRow = ({ item, isDark }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
        isDark
          ? open ? 'border-brand-red/30 bg-gray-900' : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
          : open ? 'border-brand-red/20 bg-white'   : 'border-gray-100 bg-gray-50 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-semibold leading-snug ${
          open ? 'text-brand-red' : isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={13} className={open ? 'text-brand-red' : isDark ? 'text-gray-500' : 'text-gray-400'} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-xs mt-2 leading-relaxed overflow-hidden ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {item.a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};


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
    q: 'Where is the park located?',
    a: 'Moraiya, Changodar — near Sarkhej Bavla Highway, opposite Suvas Industrial Estate, behind Siya Logistics Park.',
  },
  {
    q: 'What is the pricing?',
    a: 'Contact us at +91 98242 35642 or WhatsApp for current sale and lease pricing.',
  },
];


// ── Quick links ────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { to: '/',                                                           label: 'Home'                           },
  { to: '/metro-industrial-park',                                      label: 'Metro Industrial Park'          },
  { to: '/metro-arcade',                                               label: 'Metro Arcade'                   },
  { to: '/warehouses-in-changodar',                                    label: 'Warehouses in Changodar'        },
  { to: '/industrial-sheds-near-sarkhej-bavla-highway',               label: 'Sheds Near Bavla Highway'       },
  { to: '/industrial-sheds-in-ahmedabad',                              label: 'Industrial Sheds in Ahmedabad'  },
  { to: '/guides/gst-input-credit-industrial-tenants-gujarat',         label: 'GST Input Credit Guide'         },
  { to: '/guides/warehousing-yield-cagr-gujarat',                      label: 'Warehousing Yield Guide'        },
  { to: '/site-map',                                                   label: 'Site Map'                       },
  { to: '/calculator',                                                 label: 'ROI Calculator'                 },
  { to: '/contact',                                                    label: 'Contact Us'                     },
  {
    href: 'https://g.page/r/CfbFhZSjMaH1EBI/review',
    label: 'Write a Review',
    external: true,
  },
];


// ── Main Footer ────────────────────────────────────────────────────────────────
const Footer = () => {
  const { theme } = useTheme();
  const isDark     = theme === 'dark';
  const currentYear = new Date().getFullYear();
  const [faqOpen, setFaqOpen] = useState(false);

  const mapsUrl   = 'https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad';
  const mapsQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mapsUrl)}`;

  const pill = isDark
    ? 'bg-gray-800/70 hover:bg-brand-red text-gray-300'
    : 'bg-gray-100 hover:bg-brand-red text-gray-600';

  return (
    <footer className={`border-t ${
      isDark
        ? 'bg-gradient-to-b from-black to-gray-950 border-gray-800'
        : 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200'
    }`}>

      {/* ── Collapsible FAQ bar ── */}
      <div className={`mt-6 border-y ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Toggle header */}
          <button
            type="button"
            onClick={() => setFaqOpen(!faqOpen)}
            aria-expanded={faqOpen}
            aria-controls="footer-faq-panel"
            className={`w-full flex items-center justify-between py-4 text-left transition-colors ${
              isDark ? 'hover:bg-gray-900/40' : 'hover:bg-gray-50/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle size={14} className="text-brand-red flex-shrink-0" />
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Frequently Asked Questions
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20">
                {FAQ_ITEMS.length} Questions
              </span>
            </div>
            <motion.div animate={{ rotate: faqOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </motion.div>
          </button>

          {/* Dropdown panel */}
          <AnimatePresence initial={false}>
            {faqOpen && (
              <motion.div
                id="footer-faq-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <FaqRow key={i} item={item} isDark={isDark} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid sm:grid-cols-3 gap-8">

          {/* Col 1 — Brand + socials */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden flex-shrink-0 ${
                isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
              }`}>
                <img
                  src="/MDLogo.png"
                  alt="Metro Developers logo"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="block text-base font-bold theme-text-primary font-display">Metro Enterprise</span>
                <span className="block text-[11px] theme-text-secondary">Metro Industrial Park · Ahmedabad</span>
              </div>
            </div>
            <p className="theme-text-secondary text-xs leading-relaxed mb-4">
              Premium industrial &amp; warehousing infrastructure in Ahmedabad. Building spaces for growing businesses.
            </p>
            <div className="flex gap-2">
              {[
                { href: 'https://wa.me/919824235642',                       icon: <FaWhatsapp size={17} />,  label: 'WhatsApp'  },
                { href: 'https://www.instagram.com/metro.industrialpark/',   icon: <FaInstagram size={17} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/metroindustrialpark1',     icon: <FaFacebook size={17} />,  label: 'Facebook'  },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`w-9 h-9 ${pill} rounded-full flex items-center justify-center transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="theme-text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, href, label, external }) =>
                external ? (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-text-secondary hover:text-brand-red transition-colors text-xs"
                    >
                      {label}
                    </a>
                  </li>
                ) : (
                  <li key={label}>
                    <Link
                      to={to}
                      className="theme-text-secondary hover:text-brand-red transition-colors text-xs"
                    >
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Col 3 — Contact */}
          <div>
            <h3 className="theme-text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="text-brand-red flex-shrink-0 mt-0.5" size={14} aria-hidden="true" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-xs leading-relaxed"
                >
                  Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad — 382213
                </a>
              </li>
              {[
                { href: 'tel:+919824235642', label: '+91 98242 35642' },
                { href: 'tel:+916356776767', label: '+91 63567 76767' },
                { href: 'tel:+916356766767', label: '+91 63567 66767' },
              ].map(({ href, label }) => (
                <li key={href} className="flex items-center gap-2.5">
                  <Phone className="text-brand-red flex-shrink-0" size={14} aria-hidden="true" />
                  <a href={href} className="theme-text-secondary hover:text-brand-red transition-colors text-xs">
                    {label}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Mail className="text-brand-red flex-shrink-0" size={14} aria-hidden="true" />
                <a
                  href="mailto:metrodevelopers26@gmail.com"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-xs break-all"
                >
                  metrodevelopers26@gmail.com
                </a>
              </li>
            </ul>

            {/* QR card — desktop only */}
            <div className={`hidden lg:flex mt-5 items-center gap-3 rounded-xl border p-3 ${
              isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
            }`}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-shrink-0"
                aria-label="Open Metro Industrial Park in Google Maps"
              >
                <img
                  src={mapsQrUrl}
                  alt="Scan QR code to open Metro Industrial Park in Google Maps"
                  width={92}
                  height={92}
                  loading="lazy"
                  className={`w-[92px] h-[92px] rounded-md border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                />
              </a>
              <div>
                <p className="theme-text-primary text-xs font-semibold mb-1">Scan For Directions</p>
                <p className="theme-text-secondary text-[11px] leading-relaxed">
                  Open Google Maps on your phone by scanning this QR code.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className={`text-xs text-center sm:text-left ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            © {currentYear} Metro Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#top"
              className={`text-xs transition-colors hover:text-brand-red ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            >
              ↑ Back to top
            </a>
            <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Developed by{' '}
              <a
                href="https://www.instagram.com/ayanmalaviya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red font-semibold hover:underline underline-offset-2 transition-opacity hover:opacity-80"
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