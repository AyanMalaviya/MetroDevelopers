import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Phone, Shield, ArrowRight, ChevronDown, Star, Award, Clock, Camera, Droplets, Route, Truck, Sparkles, TrendingUp, Users, X, MapPin, LucideFactory, LucideLandPlot } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';
import PWAInstallPrompt from '../components/PWAInstallPrompt.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const HomePage = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const [featuresInView, setFeaturesInView] = useState(false);
  const [statsInView, setStatsInView] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);

  const whatsappMessage = encodeURIComponent("Hello, I would like to inquire about the industrial sheds.");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Check scroll depth for review prompt (50% of page)
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 40 && !showReviewPrompt && !promptDismissed) {
        setShowReviewPrompt(true);
      }

      if (featuresRef.current && !featuresInView) {
        const rect = featuresRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setFeaturesInView(true);
        }
      }

      if (statsRef.current && !statsInView) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setStatsInView(true);
        }
      }

      if (ctaRef.current && !ctaInView) {
        const rect = ctaRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setCtaInView(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Timer-based trigger: Show after 15 seconds if not dismissed
    const timer = setTimeout(() => {
      if (!promptDismissed) {
        setShowReviewPrompt(true);
      }
    }, 15000); // 15 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [featuresInView, statsInView, ctaInView, showReviewPrompt, promptDismissed]);

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
    { value: '30k+', label: 'Sq.yards of area', icon: <LucideLandPlot size={24} /> },
    { value: '43+', label: 'Industrial Units Made', icon: <LucideFactory size={24} /> },
    { value: '100%', label: 'Client Satisfaction', icon: <Star size={24} /> },
    { value: '6+', label: 'Years Experience', icon: <Clock size={24} /> }
  ];

  const dismissPrompt = () => {
    setShowReviewPrompt(false);
    setPromptDismissed(true);
    // Save to localStorage to not show again
    localStorage.setItem('reviewPromptDismissed', 'true');
  };

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('reviewPromptDismissed');
    if (dismissed === 'true') {
      setPromptDismissed(true);
    }
  }, []);

  const outlineShadow = (c, w = 1) =>
  [
    `${-w}px ${-w}px 0 ${c}`,
    `${ w}px ${-w}px 0 ${c}`,
    `${-w}px ${ w}px 0 ${c}`,
    `${ w}px ${ w}px 0 ${c}`,
    `${-w}px 0 0 ${c}`,
    `${ w}px 0 0 ${c}`,
    `0 ${-w}px 0 ${c}`,
    `0 ${ w}px 0 ${c}`,
  ].join(", ");

const stroke = theme === "dark" ? "#ffffff" : "#0b0b0b";

  return (
    <>
      <SEO 
        title="Buy or Lease Industrial Sheds & Warehouses in Moraiya, Ahmedabad"
        description="Call 9624965017 OR 9824235642 to buy or lease indsutrial shed / Godown at affordable prices! 6-8% ROI & possession in 90 days customised industrial shed/warehouse for lease & sale in Moraiya near Ahmedabad in changodar."
        keywords="industrial shed for sale in Moraiya Ahmedabad, warehouse for rent in Changodar, industrial shed with waste management and water supply for lease Gujarat, 5000 sqft factory shed price, ready possession industrial shed Ahmedabad, GIDC approved warehouse Moraiya, affordable industrial shed manufacturer Gujarat, industrial plot near Sarkhej Bavla Highway, 6-8% ROI commercial property Ahmedabad, heavy industrial storage space rent, warehousing logistics park Ahmedabad, pharmaceutical industrial shed Moraiya, engineering unit space Changodar, 4000 to 50000 sqft industrial shed, buy industrial property, weigh bridge facility industrial park"
        canonical="/"
        ogImage="/images/map.jpg"
      />


      <PWAInstallPrompt />
      <ThemeToggle />

      <div className="min-h-screen theme-bg-primary overflow-hidden">
        {/* ===== Floating Review Prompt ===== */}
        {showReviewPrompt && !promptDismissed && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-xs sm:max-w-sm"
          >
            <div className={`rounded-xl shadow-2xl p-4 sm:p-6 relative border-2 ${
              theme === 'dark' 
                ? 'bg-gray-900 border-brand-red/30' 
                : 'bg-white border-brand-red/20'
            }`}>
              <button
                onClick={dismissPrompt}
                className={`absolute top-2 right-2 transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={20} className="text-white fill-white sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h4 className={`font-bold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Enjoying our service?
                  </h4>
                  <p className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Leave us a review!
                  </p>
                </div>
              </div>
              
              <a
                href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-sm"
                onClick={dismissPrompt}
              >
                Write a Review
              </a>
            </div>
          </motion.div>
        )}

        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.video
              autoPlay
              muted
              playsInline
              // 'loop' removed so it stops at the last frame
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                // Back and forth zoom (scale) and subtle movement
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 10, // Slower for a professional "industrial" feel
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <source src="/videos/intro.mp4" type="video/mp4" />
            </motion.video>
            
            {/* Existing Overlays */}
            <div className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-black/40 via-black/50 to-brand-red/20' 
                : 'bg-gradient-to-br from-white/30 via-white/40 to-brand-red/20'
            }`}></div>

            {/* Animated Background Orbs */}
            <motion.div
              className="absolute top-20 left-20 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Grid Pattern */}
            {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div> */}
          </div>


          {/* Content - Centered */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-red/50 bg-brand-red/10 backdrop-blur-xl mb-8"
            >
              <Sparkles className="text-brand-red w-4 h-4 animate-pulse" />
              <span 
                className={`text-xs font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: '"Montserrat", "Inter", sans-serif', letterSpacing: '0.01em' }}
              >
                #1 INDUSTRIAL PARK IN AHMEDABAD
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
<h1
  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-2 ${
    theme === 'dark' ? 'text-white' : 'text-black'
  }`}
  style={{ 
    fontFamily: '"Bebas Neue", "Oswald", "Arial Black", sans-serif',
    letterSpacing: '0.01em',
    fontWeight: '900',
  }}
>
  METRO
</h1>

<h1
  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-brand-red"
  style={{ 
    fontFamily: '"Bebas Neue", "Oswald", "Arial Black", sans-serif',
    letterSpacing: '0.01em',
    fontWeight: '900',
  }}
>
  INDUSTRIAL PARK
</h1>

            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-md sm:text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}
              style={{ 
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: '500'
              }}
            >
              Your Gateway to World-Class Manufacturing & Warehousing Solutions in Ahmedabad
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-2 justify-center items-center"
            >
              <Link to="/metro-industrial-park">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  /* Added overflow-visible so the glow isn't cut off */
                  className="group relative px-6 py-3 bg-brand-red text-white font-bold rounded-2xl shadow-2xl shadow-brand-red/50 w-full sm:w-auto overflow-hidden"
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '700' }}
                >
                  {/* 1. RUNNING EDGE LIGHT EFFECT */}
                  <div className="absolute inset-[-2px] z-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 2, // Faster for a "lightning" feel
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="w-full h-full"
                      style={{
                        background: "conic-gradient(from 0deg, transparent 60%, rgba(255,255,255,0.1) 80%, white 100%)",
                        width: "300%",
                        height: "300%",
                        position: "absolute",
                        top: "-100%",
                        left: "-100%",
                      }}
                    />
                  </div>

                  {/* 2. INNER MASK (To keep the light only on the edge) */}
                  <div className="absolute inset-[1px] bg-brand-red rounded-[calc(1rem-1px)] z-0 group-hover:bg-red-600 transition-colors duration-300" />

                  {/* 3. YOUR EXISTING GRADIENT HOVER */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-brand-red z-0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* 4. CONTENT */}
                  <span className="relative z-10 flex items-center justify-center gap-2 text-xs">
                    <Building2 size={16} />
                    Explore more
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              {/* Button 2: Site Map (Unchanged) */}
              <Link to="/site-map">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-6 py-3 bg-brand-red text-white font-bold rounded-2xl overflow-hidden shadow-2xl shadow-brand-red/50 w-full sm:w-auto"
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '700' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-brand-red"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-xs">
                    <MapPin size={16} />
                    Check Availability
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              {/* Button 3: WhatsApp (Unchanged) */}
              <a href={`https://wa.me/919824235642?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group px-6 py-3 font-bold rounded-2xl border-2 backdrop-blur-xl w-full sm:w-auto ${
                    theme === 'dark'
                      ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                      : 'border-gray-900/30 text-gray-900 hover:border-gray-900 hover:bg-gray-900/10'
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: '700' }}
                >
                  <span className="flex items-center justify-center gap-2 text-xs">
                    <FaWhatsapp size={16} className="text-green-500" />
                    Quick Contact
                  </span>
                </motion.button>
              </a>
            </motion.div>


            {/* Floating Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 mt-10 max-w-3xl mx-auto"
            >
              {/* Card 1 - ROI */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-4 sm:p-5 rounded-xl backdrop-blur-2xl border-2 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-green-900/30 border-green-600/50 hover:border-green-500'
                    : 'bg-green-50/80 border-green-400 hover:border-green-500'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-green-500" size={18} />
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-xl sm:text-2xl font-black text-green-500"
                      style={{ fontFamily: '"Bebas Neue", "Oswald", sans-serif' }}
                    >
                      6-8%
                    </div>
                    <div 
                      className={`text-[10px] sm:text-xs font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      Annual ROI
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Industrial Units */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-4 sm:p-5 rounded-xl backdrop-blur-2xl border-2 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-900/80 border-gray-700 hover:border-brand-red'
                    : 'bg-white/80 border-gray-300 hover:border-brand-red'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-brand-red/20' : 'bg-brand-red/10'
                  }`}>
                    <LucideFactory className="text-brand-red" size={18} />
                  </div>
                  <div className="text-center">
                    <div 
                      className={`text-xl sm:text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: '"Bebas Neue", "Oswald", sans-serif' }}
                    >
                      63
                    </div>
                    <div 
                      className={`text-[10px] sm:text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      Industrial Units
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 - Total Area */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-4 sm:p-5 rounded-xl backdrop-blur-2xl border-2 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-900/80 border-gray-700 hover:border-brand-red'
                    : 'bg-white/80 border-gray-300 hover:border-brand-red'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-brand-red/20' : 'bg-brand-red/10'
                  }`}>
                    <LucideLandPlot className="text-brand-red" size={18} />
                  </div>
                  <div className="text-center">
                    <div 
                      className={`text-xl sm:text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: '"Bebas Neue", "Oswald", sans-serif' }}
                    >
                      54K+
                    </div>
                    <div 
                      className={`text-[10px] sm:text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                      Sq.yards Area
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            {/* ===== Scroll Down Indicator ===== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: scrollY < 100 ? 1 : 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }}
            >
              <div className="flex flex-col items-center">
                <span 
                  className={`text-xs font-semibold tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  SCROLL DOWN
                </span>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-8 h-12 rounded-full border-2 flex items-start justify-center pt-2 ${
                    theme === 'dark' 
                      ? 'border-white/30 hover:border-brand-red' 
                      : 'border-gray-900/30 hover:border-brand-red'
                  } transition-colors duration-300`}
                >
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                      opacity: [1, 0.3, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronDown 
                      size={16} 
                      className={theme === 'dark' ? 'text-white' : 'text-gray-900'} 
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>


          </div>
        </section>

        {/* ===== Stats Section ===== */}
        <section ref={statsRef} className={`py-16 sm:py-28 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} relative overflow-hidden`}>
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-950 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'} opacity-50`}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className={`text-center mb-16 transition-all duration-1000 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold theme-text-primary mb-6">
                By The <span className="text-brand-red">Numbers</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`group relative text-center theme-bg-card backdrop-blur-md p-8 sm:p-12 rounded-2xl border theme-border hover:border-brand-red/50 transition-all duration-1000 hover:scale-105 theme-shadow-lg hover:shadow-brand-red/30 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className={`w-14 h-14 mx-auto mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} group-hover:bg-brand-red/20 rounded-full flex items-center justify-center theme-text-tertiary group-hover:text-brand-red group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {stat.icon}
                  </div>
                  
                  <div className="text-4xl sm:text-6xl font-bold theme-text-primary group-hover:text-brand-red mb-3 transition-colors duration-500">
                    {stat.value}
                  </div>
                  
                  <div className="theme-text-secondary group-hover:text-brand-red/80 text-sm sm:text-base transition-colors font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section ref={ctaRef} className="py-20 sm:py-32 relative overflow-hidden">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-950 to-black' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_70%)] animate-pulse"></div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className={`theme-bg-card backdrop-blur-xl p-10 sm:p-16 rounded-3xl border theme-border hover:border-brand-red/30 transition-all duration-1000 theme-shadow-lg ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8 transition-all duration-1000 delay-200 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <Sparkles className="text-brand-red" size={16} />
                <span className="text-sm font-semibold text-brand-red">Get Started Today</span>
              </div>
              
              <h2 
                className={`text-4xl sm:text-5xl md:text-6xl font-bold theme-text-primary mb-6 transition-all duration-1000 delay-300 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Ready to Find Your <br className="hidden sm:block" />
                <span className="text-brand-red">Perfect Industrial Space?</span>
              </h2>
              
              <p 
                className={`theme-text-tertiary text-lg sm:text-xl mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Contact us today to discuss your requirements and schedule a site visit
              </p>
              
              <div 
                className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <a 
                  href={`https://wa.me/916356766767?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-brand-red/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <FaWhatsapp size={22} className="relative z-10" />
                  <span className="relative z-10">WhatsApp Us</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="tel:+916356766767"
                  className={`group inline-flex items-center justify-center gap-3 px-10 py-5 border-2 theme-border hover:border-brand-red/50 theme-bg-card backdrop-blur-md theme-text-primary font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl`}
                >
                  <Phone size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Call: +91 6356 766767</span>
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
