// src/pages/NotFound.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, Calculator, Factory, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO/SEO';

const WHATSAPP_URL =
  'https://wa.me/919824235642?text=Hello%2C%20I%20want%20details%20for%20industrial%20space%20availability.';

const QUICK_LINKS = [
  { to: '/',                                    label: 'Home',                     icon: Home       },
  { to: '/metro-industrial-park',               label: 'Industrial Park',           icon: Factory    },
  { to: '/industrial-sheds-in-changodar',       label: 'Sheds in Changodar',        icon: MapPin     },
  { to: '/industrial-shed-for-sale-changodar',  label: 'Sheds for Sale',            icon: MapPin     },
  { to: '/industrial-shed-for-rent-changodar',  label: 'Sheds for Rent',            icon: MapPin     },
  { to: '/calculator',                          label: 'ROI Calculator',            icon: Calculator },
];

export default function NotFound() {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const isDark = theme === 'dark';

  return (
    <>
      <SEO
        title="Page Not Found (404) – Metro Enterprise"
        description="The page you're looking for doesn't exist. Browse Metro Industrial Park's available industrial sheds in Changodar, Moraiya, and near Sarkhej–Bavla Highway (NH 947), Ahmedabad."
        canonical="/404"
        noindex={true}
      />

      <div className={`relative overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-20 px-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

        {/* Ambient glow */}
        <div aria-hidden="true" className={`absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-red-600/8' : 'bg-red-400/6'
        }`} />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center relative z-10"
        >
          {/* 404 number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 select-none"
          >
            <span className="text-[96px] font-extrabold leading-none bg-gradient-to-br from-brand-red to-red-900 bg-clip-text text-transparent">
              404
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Page Not Found
          </motion.h1>

          {/* Subtext with attempted path */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            The page{' '}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
              isDark ? 'bg-gray-800 text-brand-red' : 'bg-gray-100 text-brand-red'
            }`}>
              {pathname}
            </code>{' '}
            doesn&apos;t exist or has been moved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className={`text-xs mb-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            Try navigating to one of these pages instead:
          </motion.p>

          {/* Quick links grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-8"
          >
            {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02] hover:border-brand-red hover:text-brand-red ${
                  isDark
                    ? 'bg-gray-900 border-gray-800 text-gray-300'
                    : 'bg-white border-gray-200 text-gray-700'
                } shadow-sm`}
              >
                <Icon className="w-4 h-4 text-brand-red flex-shrink-0" />
                {label}
              </Link>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-red/25 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 text-sm transition-all hover:scale-105 ${
                isDark
                  ? 'border-green-500/40 bg-green-500/10 text-green-400 hover:border-green-400'
                  : 'border-green-300 bg-green-50 text-green-700 hover:border-green-500'
              }`}
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp Inquiry
            </a>
            <a
              href="tel:919824235642"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 text-sm transition-all hover:scale-105 ${
                isDark
                  ? 'border-gray-700 text-gray-200 hover:border-brand-red'
                  : 'border-gray-200 text-gray-700 hover:border-brand-red'
              }`}
            >
              <Phone className="w-4 h-4" />
              Call Sales Team
            </a>
          </motion.div>

          {/* SEO micro-copy — adds keyword context even on 404 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className={`mt-10 text-xs leading-relaxed max-w-sm mx-auto ${
              isDark ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            Looking for industrial sheds in Changodar or Moraiya near the
            Sarkhej–Bavla Highway (NH&nbsp;947), Ahmedabad?{' '}
            <Link to="/metro-industrial-park" className="underline hover:text-brand-red transition-colors">
              Explore Metro Industrial Park
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
