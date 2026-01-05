import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Ruler, Calendar, Zap, Shield, Truck, Wifi, Phone, CheckCircle, ArrowRight, Maximize2, Building2, Factory, Warehouse } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroIndustrialPark = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    {
      url: '/images/2shed.jpg',
      alt: 'Modern Industrial Shed - Metro Industrial Park',
      title: 'Modern Industrial Shed',
      description: 'State-of-the-art industrial sheds with high ceilings and robust construction'
    },
    {
      url: '/images/4shed.jpg',
      alt: 'Warehouse Facility - Metro Industrial Park',
      title: 'Warehouse Facility',
      description: 'Spacious warehouse units with optimal loading and storage capacity'
    },
    {
      url: '/images/entrance.jpg',
      alt: 'Industrial Space - Metro Industrial Park',
      title: 'Park Entrance',
      description: 'Professional entrance with 24/7 security and access control'
    },
    {
      url: '/images/mainroad.jpg',
      alt: 'Big roads for convenience - Metro Industrial Park',
      title: 'Main Road & Access',
      description: 'Wide internal roads for seamless heavy vehicle movement'
    },
    {
      url: '/images/map.jpg',
      alt: 'Metro Industrial Park 3D Map view',
      title: '3D Map View',
      description: 'Comprehensive site layout with strategic plot positioning'
    },
    {
      url: '/images/office.jpg',
      alt: 'Office Space - Metro Industrial Park',
      title: 'Office Space',
      description: 'Modern office facilities integrated with industrial units'
    }
  ];

  const features = [
    {
      icon: <Ruler className="text-brand-red" size={24} />,
      title: 'Flexible Sizes',
      description: '5,000 - 50,000 sq.ft units available for lease or purchase'
    },
    {
      icon: <Zap className="text-brand-red" size={24} />,
      title: 'Power Backup',
      description: '500 KVA power supply with 24/7 backup generators'
    },
    {
      icon: <Shield className="text-brand-red" size={24} />,
      title: 'Security',
      description: 'CCTV surveillance, security guards, and biometric access'
    },
    {
      icon: <Truck className="text-brand-red" size={24} />,
      title: 'Logistics',
      description: 'Easy access to highways, ports, and freight corridors'
    },
    {
      icon: <Wifi className="text-brand-red" size={24} />,
      title: 'Connectivity',
      description: 'High-speed internet and modern communication infrastructure'
    },
    {
      icon: <Factory className="text-brand-red" size={24} />,
      title: 'Infrastructure',
      description: 'Fire safety, water supply, drainage, and waste management'
    }
  ];

  const amenities = [
    'Spacious Loading & Unloading Area',
    'High Ceiling Height (30-35 ft)',
    'Three-Phase Power Supply',
    'Overhead Water Tank',
    'Cafeteria & Restrooms',
    'Ample Parking Space',
    'Fire Fighting Equipment',
    'Industrial-Grade Flooring',
    'Pollution Control Compliance',
    'GIDC Approved Location'
  ];

  const specifications = [
    { label: 'Location', value: 'Moraiya, Changodar, Ahmedabad' },
    { label: 'Total Area', value: '50,000+ sq.ft' },
    { label: 'Available Units', value: '15+ Industrial Sheds' },
    { label: 'Shed Height', value: '30-35 feet' },
    { label: 'Road Width', value: '40 feet internal roads' },
    { label: 'Power Capacity', value: '500 KVA' },
    { label: 'Lease Terms', value: 'Flexible 11/33/99 months' },
    { label: 'Possession', value: 'Immediate' }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying && !isGalleryOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isGalleryOpen, images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const openGallery = () => {
    setIsGalleryOpen(true);
    setIsAutoPlaying(false);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setIsAutoPlaying(true);
    document.body.style.overflow = 'auto';
  };

  // Keyboard navigation
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

  return (
    <>
      {/* Full-Screen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-[110] p-3 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-4 z-[110] px-4 py-2 bg-gray-900/90 backdrop-blur-md text-white rounded-full text-sm font-semibold">
            {currentSlide + 1} / {images.length}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110] px-6 py-2 bg-gray-900/90 backdrop-blur-md text-white rounded-full text-sm md:text-base font-semibold max-w-md text-center">
            {images[currentSlide].title}
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            {images.map((image, index) => (
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

          <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[110] p-4 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl">
            <ChevronLeft size={32} />
          </button>

          <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[110] p-4 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl">
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2 md:gap-3 overflow-x-auto max-w-full px-4 pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === currentSlide ? 'border-brand-red scale-110 shadow-lg shadow-brand-red/50' : 'border-white/30 hover:border-white/70 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black">
        {/* Hero Slider Section */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
          {/* Image Slider */}
          <div className="absolute inset-0">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image.url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-brand-red/80 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg">
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-brand-red/80 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg">
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button onClick={openGallery} className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg text-xs sm:text-sm font-semibold">
            <Maximize2 size={16} />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 sm:w-12 bg-brand-red' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Slide Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-brand-red/30 border border-brand-red/60 rounded-full backdrop-blur-md">
                <Building2 className="text-brand-red" size={18} />
                <span className="text-xs sm:text-sm text-brand-red font-semibold">Premium Industrial Space</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl">
                {images[currentSlide].title}
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-lg">
                {images[currentSlide].description}
              </p>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="absolute inset-0 bg-pattern-grid"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Metro Industrial Park <span className="text-brand-red">Overview</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                Experience unparalleled industrial infrastructure at Moraiya, Changodar – strategically positioned for seamless connectivity, equipped with cutting-edge facilities, and designed to accelerate your business growth.
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {specifications.map((spec, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-xl border border-gray-800 hover:border-brand-red transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20"
                >
                  <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">{spec.label}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-[radial-gradient(circle_at_center,#1f2937_0%,#111827_100%)] p-6 sm:p-8 rounded-2xl border-2 border-gray-800 hover:border-brand-red transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-red/20"
                >
                  <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                World-Class <span className="text-brand-red">Amenities</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Every detail meticulously crafted to ensure operational excellence
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {amenities.map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 rounded-lg border border-gray-800 hover:border-brand-red transition-all duration-300 hover:scale-105"
                >
                  <CheckCircle className="text-brand-red flex-shrink-0" size={20} />
                  <span className="text-gray-300 text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-brand-red via-red-600 to-brand-red relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-diagonal opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Ready to Transform Your Business?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto drop-shadow">
              Schedule a site visit today and discover why leading enterprises choose Metro Industrial Park
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919824235642"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <FaWhatsapp size={24} />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="tel:+919824235642"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Phone size={20} />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MetroIndustrialPark;