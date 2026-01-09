import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Shield, ArrowRight, ChevronDown, Star, Award, Clock, Camera, Droplets, Route, Truck, Sparkles } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';
import PWAInstallPrompt from '../components/PWAInstallPrompt.jsx';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const [featuresInView, setFeaturesInView] = useState(false);
  const [statsInView, setStatsInView] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Features section
      if (featuresRef.current && !featuresInView) {
        const rect = featuresRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setFeaturesInView(true);
        }
      }

      // Stats section
      if (statsRef.current && !statsInView) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setStatsInView(true);
        }
      }

      // CTA section
      if (ctaRef.current && !ctaInView) {
        const rect = ctaRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setCtaInView(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [featuresInView, statsInView, ctaInView]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Metro Enterprise - Industrial Sheds & Warehouses",
    "description": "Premium industrial sheds and warehouses in Moraiya, Ahmedabad",
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
      description: '60ft RCC roads for heavy vehicles'
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

      <PWAInstallPrompt />

      <div className="min-h-screen bg-black overflow-hidden">
        {/* Hero Section with Parallax Effect */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Subtle Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-black">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_70%)] animate-pulse"></div>
            </div>
            {/* Subtle Floating Orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Background Image with Parallax */}
          <div 
            className="opacity-60 absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{ 
              backgroundImage: "url('/images/map.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              transform: `translateY(${scrollY * 0.5}px)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center pt-40 sm:pt-20 pb-24">
            {/* Badge - Fade In */}
            <div 
              className={`inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 py-2 bg-gray-900/90 backdrop-blur-md border border-gray-800 hover:border-brand-red/40 rounded-full shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Sparkles className="text-brand-red animate-pulse" size={16} />
              <span className="text-xs sm:text-sm text-white font-semibold">World-Class Industrial Infrastructure</span>
            </div>
            
            {/* Main Heading - Fade In with Delay */}
            <h1 
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 sm:mb-6 drop-shadow-2xl leading-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                METRO INDUSTRIAL PARK
              </span>
            </h1>
            
            {/* Subheading - Fade In with Delay */}
            <h2 
              className={`text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-xl transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              A Future-Ready Destination for <br className="hidden sm:block" />
              <span className="text-brand-red">Manufacturing & Warehousing</span>
            </h2>
            
            {/* Description - Fade In with Delay */}
            <p 
              className={`text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-10 drop-shadow-lg px-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Strategically developed to support Small and Large Scale industries with modern infrastructure and logistics solutions
            </p>

            {/* CTA Buttons - Fade In with Delay */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Link 
                to="/projects"
                className="group relative inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-brand-red/50 text-sm sm:text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Explore Project</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="https://wa.me/919824235642"
                className="group inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-xl border-2 border-gray-800 hover:border-brand-red/50 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base shadow-xl"
              >
                <FaWhatsapp size={18} className="group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Trust Indicators - Fade In with Stagger */}
            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-3xl mx-auto mt-10 sm:mt-20">
              {[
                { value: '54K+', label: 'Sq.yards', delay: 500 },
                { value: '63', label: 'Industrial Units', delay: 600 },
                { value: '100%', label: 'Satisfaction', delay: 700 }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className={`group bg-gray-900/30 backdrop-blur-md p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-800 hover:border-brand-red/40 transition-all duration-1000 hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${stat.delay}ms` }}
                >
                  <div className="text-2xl sm:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-brand-red transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Scroll Indicator - Fade In */}
          <div 
            className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-2/5 z-20 animate-bounce transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col items-center gap-2">
              <ChevronDown className="text-white/60 drop-shadow-lg" size={32} />
              <div className="w-0.5 h-12 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Features Section - Fade In on Scroll */}
        <section ref={featuresRef} className="py-16 sm:py-28 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header - Fade In */}
            <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Why Choose <span className="text-brand-red">METRO Industrial Park?</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto mb-6"></div>
              <p className="text-gray-400 text-base sm:text-xl max-w-3xl mx-auto">
                Designed for efficiency, built for success
              </p>
            </div>

            {/* Feature Cards - Fade In with Stagger */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm p-6 sm:p-10 rounded-2xl border border-gray-800 hover:border-brand-red/50 transition-all duration-1000 hover:scale-105 hover:shadow-2xl hover:shadow-brand-red/20 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Subtle Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-red/0 via-brand-red/5 to-brand-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-800 group-hover:bg-brand-red/20 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:text-brand-red transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-lg">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="relative text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors text-center leading-tight">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="relative text-gray-400 group-hover:text-gray-300 text-xs sm:text-sm leading-relaxed text-center transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button - Fade In */}
            <div className={`text-center mt-16 sm:mt-20 transition-all duration-1000 delay-600 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link 
                to="/projects"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 hover:bg-gray-800 border-2 border-gray-800 hover:border-brand-red/50 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-brand-red/20"
              >
                <span>View Complete Details</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section - Fade In on Scroll */}
        <section ref={statsRef} className="py-16 sm:py-28 bg-black relative overflow-hidden">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black opacity-50"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header - Fade In */}
            <div className={`text-center mb-16 transition-all duration-1000 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                By The <span className="text-brand-red">Numbers</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto"></div>
            </div>

            {/* Stats Cards - Fade In with Stagger */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`group relative text-center bg-gray-900/30 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-gray-800 hover:border-brand-red/50 transition-all duration-1000 hover:scale-105 hover:shadow-2xl hover:shadow-brand-red/30 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-6 bg-gray-800 group-hover:bg-brand-red/20 rounded-full flex items-center justify-center text-gray-400 group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    {stat.icon}
                  </div>
                  
                  {/* Value */}
                  <div className="text-4xl sm:text-6xl font-bold text-white group-hover:text-brand-red mb-3 transition-colors duration-500">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-400 group-hover:text-gray-300 text-sm sm:text-base transition-colors font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Fade In on Scroll */}
        <section ref={ctaRef} className="py-20 sm:py-32 relative overflow-hidden">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_70%)] animate-pulse"></div>
          </div>
          
          {/* Floating Subtle Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
            {/* CTA Card - Fade In */}
            <div className={`bg-gray-900/50 backdrop-blur-xl p-10 sm:p-16 rounded-3xl border border-gray-800 hover:border-brand-red/30 transition-all duration-1000 shadow-2xl ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Badge - Fade In with Delay */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8 transition-all duration-1000 delay-200 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Sparkles className="text-brand-red" size={16} />
                <span className="text-sm font-semibold text-brand-red">Get Started Today</span>
              </div>
              
              {/* Heading - Fade In with Delay */}
              <h2 
                className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 delay-300 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Ready to Find Your <br className="hidden sm:block" />
                <span className="text-brand-red">Perfect Industrial Space?</span>
              </h2>
              
              {/* Description - Fade In with Delay */}
              <p 
                className={`text-gray-400 text-lg sm:text-xl mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Contact us today to discuss your requirements and schedule a site visit
              </p>
              
              {/* Buttons - Fade In with Delay */}
              <div 
                className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <a 
                  href="https://wa.me/919824235642"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-brand-red/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <FaWhatsapp size={22} className="relative z-10" />
                  <span className="relative z-10">WhatsApp Us</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="tel:+919824235642"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-gray-800 hover:border-brand-red/50 bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-md text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <Phone size={20} className="group-hover:scale-110 transition-transform" />
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
