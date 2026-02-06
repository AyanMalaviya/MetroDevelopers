import React from 'react';
import { MapPin, Phone, Mail, Webhook, ArrowUpRight } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const surface = theme === 'dark'
    ? 'bg-gradient-to-b from-black to-gray-950 border-gray-800'
    : 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200';

  const pill = theme === 'dark'
    ? 'bg-gray-800/70 hover:bg-brand-red'
    : 'bg-gray-200 hover:bg-brand-red';

  return (
    <footer className={`${surface} border-t`}>
      {/* Top CTA strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div
          className={`rounded-2xl border ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900/20' : 'border-gray-200 bg-white/60'
          } p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
        >
          <div>
            <p className="theme-text-primary font-semibold text-base">
              Need industrial space in Ahmedabad?
            </p>
            <p className="theme-text-secondary text-sm">
              Call us for availability, pricing, and site visits.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+919824235642"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red text-white font-semibold text-sm hover:opacity-95 transition"
            >
              Call now <ArrowUpRight size={16} />
            </a>
            <a
              href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                theme === 'dark'
                  ? 'border-gray-800 text-gray-100 hover:bg-gray-900/40'
                  : 'border-gray-200 text-gray-800 hover:bg-gray-50'
              } text-sm font-semibold transition`}
            >
              Get directions <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden ${
                  theme === 'dark' ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white'
                }`}
              >
                <img
                  src='/MDLogo.png'
                  alt="Metro Developers logo"
                  className="w-14 h-14 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="leading-tight">
                <span className="block text-xl font-bold theme-text-primary">Metro Enterprise</span>
                <span className="block text-xs theme-text-secondary">
                  Metro Industrial Park • Ahmedabad
                </span>
              </div>
            </div>

            <p className="theme-text-secondary text-sm leading-relaxed mb-5">
              Premium industrial and warehousing infrastructure in Ahmedabad. Building spaces for
              growing businesses.
            </p>

            <div className="flex gap-3">
              <a
                href="https://wa.me/919824235642"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${pill} rounded-full flex items-center justify-center theme-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-red/60`}
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="https://www.instagram.com/metro.industrialpark/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${pill} rounded-full flex items-center justify-center theme-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-red/60`}
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/metroindustrialpark1"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${pill} rounded-full flex items-center justify-center theme-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-red/60`}
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="theme-text-primary font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/metro-industrial-park"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-sm"
                >
                  Metro Industrial Park
                </Link>
              </li>
              <li>
                <Link to="/contact" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-sm"
                >
                  Write a Review
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="theme-text-primary font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-red flex-shrink-0 mt-1" size={18} />
                <a
                  href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-sm"
                >
                  Opp. Suvas Ind Estate, b/h Siya Logistics Park, Moraiya, Ahmedabad - 382213
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="text-brand-red flex-shrink-0" size={18} />
                <a href="tel:+919824235642" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  +91 98242 35642
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-red flex-shrink-0" size={18} />
                <a href="tel:+916356776767" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  +91 63567 76767
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-red flex-shrink-0" size={18} />
                <a href="tel:+916356766767" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  +91 63567 66767
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="text-brand-red flex-shrink-0" size={18} />
                <a
                  href="mailto:metrodevelopers26@gmail.com"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-sm break-all"
                >
                  metrodevelopers26@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Webhook className="text-brand-red flex-shrink-0" size={18} />
                <a
                  href="https://metrodevelopers.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-text-secondary hover:text-brand-red transition-colors text-sm break-all"
                >
                  metrodevelopers.co.in
                </a>
              </li>
            </ul>
          </div>

          {/* Optional: small “Legal”/extra column */}
          <div className="sm:col-span-2 lg:col-span-4 mx-auto">
            <div className={`mt-2 pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src='/MDLogo.png'
                    alt="Metro Developers"
                    className="w-8 h-8 object-contain opacity-90"
                    loading="lazy"
                  />
                  <span className="theme-text-secondary text-sm">
                    Trusted industrial infrastructure partner in Ahmedabad.
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mx-auto">
                  <Link to="/privacy" className="theme-text-secondary hover:text-brand-red transition-colors">
                    Privacy
                  </Link>
                  <Link to="/terms" className="theme-text-secondary hover:text-brand-red transition-colors">
                    Terms
                  </Link>
                  <a href="#top" className="theme-text-secondary hover:text-brand-red transition-colors">
                    Back to top
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm text-center sm:text-left`}>
              © {currentYear} Metro Developers. All rights reserved.
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm text-center sm:text-right`}>
              Developed by <span className="text-brand-red font-semibold">Ayan Malaviya</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
