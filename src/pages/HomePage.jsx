import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, ShieldCheck, Phone, Clock, Zap, MessageCircle, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';
import StructuredData from '../components/SEO/StructuredData.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const observerRefs = useRef([]);
  const autoPlayRef = useRef(null);

  // Hero images array - add more images as needed
  const heroImages = [
    {
      url: '/images/2shed.jpg',
      alt: 'Modern Industrial Shed - Metro Industrial Park'
    },
    {
      url: '/images/4shed.jpg',
      alt: 'Warehouse Facility - Metro Industrial Park'
    },
    {
      url: '/images/entrance.jpg',
      alt: 'Industrial Space - Metro Industrial Park'
    },
    {
      url: '/images/mainroad.jpg',
      alt: 'Big roads for convenience - Metro Industrial Park'
    },
    {
      url: '/images/map.jpg',
      alt: 'Metro Industrial Park 3D Map view'
    },
    {
      url: '/images/office.jpg',
      alt: 'Office Space - Metro Industrial Park'
    }
  ];

  // Auto-slide functionality (disabled in gallery mode)
  useEffect(() => {
    if (isAutoPlaying && !isGalleryOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 10000); // 10 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isGalleryOpen, heroImages.length]);

  // Pause auto-play when user interacts
  const handleSlideChange = (newSlide) => {
    setCurrentSlide(newSlide);
    setIsAutoPlaying(false);
    // Resume auto-play after 30 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 30000);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % heroImages.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
  };

  const openGallery = () => {
    setIsGalleryOpen(true);
    setIsAutoPlaying(false);
    // Prevent body scroll when gallery is open
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setIsAutoPlaying(true);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGalleryOpen) {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryOpen, currentSlide]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.dataset.section]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observerRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  return (
    <>
    <SEO 
        title="Industrial Sheds in Changodar, Ahmedabad - Lease & Sale"
        description="Premium industrial sheds by Metro Enterprise at Metro Industrial Park in Changodar, Ahmedabad. Projects in Shiv Industrial Estate, Moraiya & Chavda Estate. Flexible lease & purchase options. Contact for site visit."
        keywords="industrial sheds Changodar, warehouse for lease Ahmedabad, industrial space Moraiya, manufacturing facility Changodar, Shiv Industrial Estate, Chavda Estate industrial shed, Metro Enterprise Ahmedabad, industrial park Gujarat, warehouse for sale Changodar, factory shed Ahmedabad"
        url="/"
      />
    <StructuredData />
    <div className="min-h-screen">
      {/* Full-Screen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-[110] p-3 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-[110] px-4 py-2 bg-brand-grey/90 backdrop-blur-md text-white rounded-full text-sm font-semibold shadow-lg">
            {currentSlide + 1} / {heroImages.length}
          </div>

          {/* Image Title */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-6 py-2 bg-brand-grey/90 backdrop-blur-md text-white rounded-full text-sm md:text-base font-semibold shadow-lg max-w-md text-center">
            {heroImages[currentSlide].title}
          </div>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 120px)' }}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[110] p-4 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[110] p-4 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          {/* Thumbnail Strip (Bottom) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2 md:gap-3 overflow-x-auto max-w-full px-4 pb-2">
            {heroImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentSlide
                    ? 'border-brand-red scale-110 shadow-lg shadow-brand-red/50'
                    : 'border-white/30 hover:border-white/70 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section className="relative flex items-center justify-center min-h-[85vh] sm:min-h-[100vh] overflow-hidden">
        {/* Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundPosition: 'center center',
                }}
              >
                {/* Overlay gradients - darker for better mobile visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/90 via-brand-dark/80 to-gray-900/85 sm:from-brand-dark/85 sm:via-brand-dark/75 sm:to-gray-900/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/70"></div>
              </div>
            </div>
          ))}

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 z-[1] pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-brand-red/80 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto backdrop-blur-sm shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-brand-red/80 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto backdrop-blur-sm shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* View Gallery Button - Top Right */}
          <button
            onClick={openGallery}
            className="absolute top-20 sm:top-24 right-2 sm:right-4 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto backdrop-blur-sm shadow-lg z-20 text-xs sm:text-sm font-semibold"
            aria-label="View full gallery"
          >
            <Maximize2 size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 pointer-events-auto">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 sm:w-12 bg-brand-red' 
                    : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-gray-900 to-transparent z-[2]"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-red/30 border border-brand-red/60 rounded-full backdrop-blur-md animate-slide-down shadow-lg">
            <Zap className="text-brand-red" size={14} />
            <span className="text-xs sm:text-sm text-brand-red font-semibold">Premium Industrial Solutions</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-3 sm:mb-4 md:mb-6 leading-tight animate-slide-up drop-shadow-2xl">
            Build Your Business at
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-orange-500 animate-gradient">
              Metro Industrial Park
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xs sm:text-sm md:text-base lg:text-xl text-gray-100 mb-4 sm:mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 animate-fade-in animation-delay-200 drop-shadow-lg">
            State-of-the-art industrial sheds designed for modern enterprises. 
            Ready-to-move spaces available for <span className="text-brand-red font-semibold">lease</span> or <span className="text-brand-red font-semibold">purchase</span> with flexible terms.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center mb-6 sm:mb-10 md:mb-16 px-4 animate-fade-in animation-delay-400">
            <button 
              onClick={() => navigate('/projects')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-brand-red text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-lg md:rounded-xl hover:bg-red-700 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-red/50 hover:scale-105 active:scale-95"
            >
              Explore Projects
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            
            <button 
              onClick={() => window.location.href = "https://wa.me/8866235642"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-2 border-white/90 text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-lg md:rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaWhatsapp style={{ fontSize: '1.2rem' }} className="sm:text-xl" />
              Chat on WhatsApp
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-3xl mx-auto px-2 animate-fade-in animation-delay-600">
            <div className="bg-brand-grey/50 backdrop-blur-md p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-700/60 hover:border-brand-red transition-all duration-500 hover:scale-105">
              <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-red mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg">50+</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-200 uppercase tracking-wider">Industrial Sheds</div>
            </div>
            <div className="bg-brand-grey/50 backdrop-blur-md p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-700/60 hover:border-brand-red transition-all duration-500 hover:scale-105 animation-delay-100">
              <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-red mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg">100%</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-200 uppercase tracking-wider">Legal Compliance</div>
            </div>
            <div className="bg-brand-grey/50 backdrop-blur-md p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-700/60 hover:border-brand-red transition-all duration-500 hover:scale-105 animation-delay-200">
              <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-red mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg">24/7</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-200 uppercase tracking-wider">Security & Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={addToRefs}
        data-section="features"
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gray-900 relative"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Why Choose Metro Industrial Park?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Strategic location, modern infrastructure, and unmatched facilities for your industrial needs
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className={`group bg-brand-grey/50 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-brand-red/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110">
                <MapPin className="text-brand-red" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Prime Location</h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                Strategically located with excellent connectivity to highways, ports, and major transport hubs for seamless logistics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`group bg-brand-grey/50 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-brand-red/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110">
                <Building2 className="text-brand-red" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Modern Infrastructure</h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                State-of-the-art facilities with power backup, water supply, fire safety systems, and advanced security infrastructure.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`group bg-brand-grey/50 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-brand-red/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110">
                <ShieldCheck className="text-brand-red" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Flexible Terms</h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                Choose between lease or purchase options with customizable terms, transparent pricing, and no hidden costs.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div 
            ref={addToRefs}
            data-section="additional"
            className={`grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 transition-all duration-700 ${
              isVisible.additional ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4 bg-brand-dark/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-gray-800 hover:border-brand-red transition-all duration-300 hover:scale-105">
              <Clock className="text-brand-red flex-shrink-0 mt-1 transition-transform duration-300 hover:rotate-12" size={20} />
              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">Quick Move-In</h4>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Ready-to-occupy sheds with minimal setup time. Start operations within days.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 sm:gap-4 bg-brand-dark/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-gray-800 hover:border-brand-red transition-all duration-300 hover:scale-105">
              <Zap className="text-brand-red flex-shrink-0 mt-1 transition-transform duration-300 hover:scale-110" size={20} />
              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">Uninterrupted Power</h4>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">High-capacity power supply with backup generators ensuring 24/7 operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={addToRefs}
        data-section="cta"
        className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-r from-red-900 via-gray-1000 to-gray-950 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23001f3f' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-700 ${
          isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Expand Your Business?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
            Get in touch with our team to schedule a site visit and discuss your industrial space requirements. 
            We're here to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button 
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-brand-red text-sm sm:text-base lg:text-lg font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            >
              Schedule Site Visit
            </button>
            <button 
              onClick={() => navigate('/projects')}
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 border-2 border-white text-white text-sm sm:text-base lg:text-lg font-bold rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View All Projects
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;