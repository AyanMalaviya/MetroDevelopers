import React from 'react';
import { Building2, MapPin, Phone, Mail, Webhook} from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';


const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();


  return (
    <footer className={`${theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-950 border-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200'} border-t`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-brand-red" size={28} />
              <span className="text-xl font-bold theme-text-primary">Metro Enterprise</span>
            </div>
            <p className="theme-text-secondary text-sm leading-relaxed mb-4">
              Premium industrial and warehousing infrastructure in Ahmedabad. Building spaces for growing businesses.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919824235642"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-brand-red rounded-full flex items-center justify-center theme-text-primary transition-all`}
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="https://www.instagram.com/metro.industrialpark/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-brand-red rounded-full flex items-center justify-center theme-text-primary transition-all`}
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/metroindustrialpark1"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} hover:bg-brand-red rounded-full flex items-center justify-center theme-text-primary transition-all`}
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="theme-text-primary font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/metro-industrial-park" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
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
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="theme-text-primary font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-red flex-shrink-0 mt-1" size={18} />
                <a href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad" target="_blank" rel="noopener noreferrer" className="theme-text-secondary hover:text-brand-red transition-colors text-sm">
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
                <a href="mailto:metrodevelopers26@gmail.com" className="theme-text-secondary hover:text-brand-red transition-colors text-sm break-all">
                  metrodevelopers26@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Webhook className="text-brand-red flex-shrink-0" size={18} />
                <a href="https://metrodevelopers.co.in" className="theme-text-secondary hover:text-brand-red transition-colors text-sm break-all">
                  metrodevelopers.co.in
                </a>
              </li>
            </ul>
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
              Developed by{' '}
              <span className="text-brand-red font-semibold">Ayan Malaviya</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
