import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Shield, ArrowRight, ChevronDown, Star, Award, Clock, Camera, Droplets, Route, Truck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Metro Enterprise - Industrial & Commercial Spaces",
    "description": "Premium industrial sheds and commercial spaces in Moraiya, Ahmedabad",
    "url": "https://www.metrodevelopers.co.in/",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.metrodevelopers.co.in/"
      }]
    }
  };
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Simplified to 6 key features only
  const features = [
    {
      icon: <Building2 size={28} />,
      title: 'Modern Infrastructure',
      description: 'World-class facilities for manufacturing'
    },
    {
      icon: <Truck size={28} />,
      title: 'Strategic Location',
      description: 'Excellent connectivity to highways'
    },
    {
      icon: <Camera size={28} />,
      title: '24/7 Security',
      description: 'CCTV surveillance & guards'
    },
    {
      icon: <Route size={28} />,
      title: 'Wide Roads',
      description: 'RCC roads for heavy vehicles'
    },
    {
      icon: <Droplets size={28} />,
      title: 'Water Supply',
      description: 'Adequate 24/7 water availability'
    },
    {
      icon: <Shield size={28} />,
      title: 'Hygienic Drainage',
      description: 'Well organised drainage systems'
    }
  ];

  const stats = [
    { value: '54,000+', label: 'Sq.yards', icon: <Building2 size={24} /> },
    { value: '63', label: 'Industrial Units', icon: <Award size={24} /> },
    { value: '100%', label: 'Client Satisfaction', icon: <Star size={24} /> },
    { value: '6+', label: 'Years Experience', icon: <Clock size={24} /> }
  ];

  return (
<>
      <SEO 
        title="Metro Enterprise - Industrial Sheds & Warehouses in Ahmedabad | Moraiya"
        description="Premium industrial park in Moraiya, Changodar, Ahmedabad. 54,000 sq.yard (4.86 lakh sq.ft) with 63 industrial sheds. Units: 4K-50K sq.ft ✓ 30-35ft Height ✓ 60ft Roads ✓ Weigh Bridge ✓ 24x7 Water ✓ CCTV Security ✓ 90 Days Possession ✓ 6-8% ROI. Perfect for manufacturing, warehousing, logistics."
        keywords="industrial shed Ahmedabad, warehouse Moraiya, factory space Changodar, industrial park 4000 sqft, shed 10000 sqft, warehouse 50000 sqft, 54000 sq yard industrial park, 63 industrial units, weigh bridge facility, 60ft road width, 6% ROI, 8% ROI, GIDC approved, possession in 90 days"
        canonical="/"
        ogImage="/images/2shed.jpg"
        structuredData={structuredData}
      />
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>
          </div>
        </div>

        {/* Background Image */}
        <div 
          className="opacity-70 absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ 
            backgroundImage: "url('/images/map.jpg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'top'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black"></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center pt-40 sm:pt-20 pb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/30 rounded-full animate-fade-in">
            <Building2 className="text-brand-red" size={16} />
            <span className="text-xs sm:text-sm text-white font-semibold">World-Class Infrastructure</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-6 drop-shadow-2xl leading-tight animate-slide-up">
            <span className="text-brand-red bg-clip-text">METRO INDUSTRIAL PARK</span>
          </h1>
          
          {/* Subheading */}
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-xl">
            A Future-Ready Destination for <br className="hidden sm:block" />
            Manufacturing & Warehousing
          </h2>
          
          {/* Description */}
          <p className="text-sm sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-8 drop-shadow-lg px-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Strategically developed to support Small and Large Scale industries with modern infrastructure and logistics solutions
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/projects"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-glow-red text-sm sm:text-base"
            >
              <span>Explore Project</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="https://wa.me/919824235642"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <FaWhatsapp size={18} />
              <span>Contact Us</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-3xl mx-auto mt-6 sm:mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-black/40 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-xl border border-white/20 hover:border-white/40 transition-all hover:scale-105">
              <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">54K+</div>
              <div className="text-[10px] sm:text-sm text-white/80 leading-tight">Sq.yards</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-xl border border-white/20 hover:border-white/40 transition-all hover:scale-105">
              <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">63</div>
              <div className="text-[10px] sm:text-sm text-white/80 leading-tight">Industrial Units</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-3 sm:p-6 rounded-lg sm:rounded-xl border border-white/20 hover:border-white/40 transition-all hover:scale-105">
              <div className="text-xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">100%</div>
              <div className="text-[10px] sm:text-sm text-white/80 leading-tight">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 sm:bottom-20 left-2/5 -translate-x-1/2 animate-bounce z-20">
          <ChevronDown className="text-white/80 drop-shadow-lg" size={28} />
        </div>
      </section>

      {/* Features Section - ONLY 6 KEY FEATURES */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-red rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-brand-red">METRO Industrial Park?</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              Designed for efficiency, built for success
            </p>
          </div>

          {/* MOBILE: 2 COLUMNS | TABLET+: 3 COLUMNS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-900 to-gray-950 p-5 sm:p-8 rounded-xl border border-gray-800 hover:border-brand-red/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-red/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gray-800 group-hover:bg-brand-red/20 rounded-xl flex items-center justify-center mb-4 text-white group-hover:text-brand-red transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors text-center leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA to Explore More */}
          <div className="text-center mt-12 sm:mt-16">
            <Link 
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-brand-red/50 text-white font-bold rounded-lg transition-all hover:scale-105"
            >
              <span>View Complete Details</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              By The <span className="text-brand-red">Numbers</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group text-center bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-brand-red/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-red/10"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-brand-red/20 rounded-full flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-5xl font-bold text-brand-red mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-brand-red/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 sm:p-12 rounded-2xl border border-gray-800">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Your <span className="text-brand-red">Perfect Space?</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10">
              Contact us today to discuss your requirements and schedule a site visit
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/919824235642"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-xl hover:shadow-glow-red"
              >
                <FaWhatsapp size={20} />
                <span>WhatsApp Us</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="tel:+919824235642"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-700 hover:border-brand-red text-white font-bold rounded-lg transition-all hover:scale-105"
              >
                <Phone size={20} />
                <span>Call: +91 98242 35642</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>  
  );
};

export default HomePage;
