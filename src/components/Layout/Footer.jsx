// src/components/Footer/Footer.jsx
import React from 'react';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();

  const pill = isDark
    ? 'bg-gray-800/70 hover:bg-brand-red text-gray-300'
    : 'bg-gray-100 hover:bg-brand-red text-gray-600';

  return (
    <footer className={`border-t ${
      isDark
        ? 'bg-gradient-to-b from-black to-gray-950 border-gray-800'
        : 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200'
    }`}>

      {/* ── Top CTA strip ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white/60'
        }`}>
          <div>
            <p className="theme-text-primary font-semibold text-sm">
              Need industrial space in Ahmedabad?
            </p>
            <p className="theme-text-secondary text-xs mt-0.5">
              Call us for availability, pricing &amp; site visits.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:+919824235642"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-red text-white font-semibold text-xs hover:bg-red-700 transition-all"
            >
              Call Now <ArrowUpRight size={13} />
            </a>
            <a
              href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Get Directions <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid sm:grid-cols-3 gap-8">

          {/* Col 1: Brand + socials */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden flex-shrink-0 ${
                isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white'
              }`}>
                <img
                  src="/MDLogo.png"
                  alt="Metro Developers logo"
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="leading-tight">
                <span className="block text-base font-bold theme-text-primary">Metro Enterprise</span>
                <span className="block text-[11px] theme-text-secondary">
                  Metro Industrial Park · Ahmedabad
                </span>
              </div>
            </div>

            <p className="theme-text-secondary text-xs leading-relaxed mb-4">
              Premium industrial &amp; warehousing infrastructure in Ahmedabad. Building spaces for growing businesses.
            </p>

            <div className="flex gap-2">
              {[
                { href: 'https://wa.me/919824235642', icon: <FaWhatsapp size={17} />, label: 'WhatsApp' },
                { href: 'https://www.instagram.com/metro.industrialpark/', icon: <FaInstagram size={17} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/metroindustrialpark1', icon: <FaFacebook size={17} />, label: 'Facebook' },
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

          {/* Col 2: Quick links */}
          <nav aria-label="Quick links">
            <h3 className="theme-text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/',                         label: 'Home'                   },
                { to: '/metro-industrial-park',    label: 'Metro Industrial Park'  },
                { to: '/metro-arcade',             label: 'Metro Arcade'           },
                { to: '/site-map',                 label: 'Site Map'               },
                { to: '/calculator',               label: 'ROI Calculator'         },
                { to: '/contact',                  label: 'Contact Us'             },
                {
                  href: 'https://g.page/r/CfbFhZSjMaH1EBI/review',
                  label: 'Write a Review',
                  external: true,
                },
              ].map(({ to, href, label, external }) =>
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

          {/* Col 3: Contact */}
          <div>
            <h3 className="theme-text-primary font-bold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="text-brand-red flex-shrink-0 mt-0.5" size={14} />
                <a
                  href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-xs leading-relaxed"
                >
                  Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad — 382213
                </a>
              </li>

              {[
                { href: 'tel:+919824235642',   label: '+91 98242 35642' },
                { href: 'tel:+916356776767',   label: '+91 63567 76767' },
                { href: 'tel:+916356766767',   label: '+91 63567 66767' },
              ].map(({ href, label }) => (
                <li key={href} className="flex items-center gap-2.5">
                  <Phone className="text-brand-red flex-shrink-0" size={14} />
                  <a href={href} className="theme-text-secondary hover:text-brand-red transition-colors text-xs">
                    {label}
                  </a>
                </li>
              ))}

              <li className="flex items-center gap-2.5">
                <Mail className="text-brand-red flex-shrink-0" size={14} />
                <a
                  href="mailto:metrodevelopers26@gmail.com"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-xs break-all"
                >
                  metrodevelopers26@gmail.com
                </a>
              </li>
            </ul>
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
              Developed by <span className="text-brand-red font-semibold">Ayan Malaviya</span>
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
