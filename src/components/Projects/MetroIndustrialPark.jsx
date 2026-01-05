import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Ruler, Zap, Shield, Truck, Wifi, Phone, CheckCircle, Maximize2, Building2, Factory } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroIndustrialPark = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = [
    { url: '/images/2shed.jpg', alt: 'Modern Industrial Shed', title: 'Modern Industrial Shed', description: 'State-of-the-art industrial sheds with high ceilings' },
    { url: '/images/4shed.jpg', alt: 'Warehouse Facility', title: 'Warehouse Facility', description: 'Spacious warehouse units with optimal storage' },
    { url: '/images/entrance.jpg', alt: 'Park Entrance', title: 'Park Entrance', description: 'Professional entrance with 24/7 security' },
    { url: '/images/mainroad.jpg', alt: 'Main Road & Access', title: 'Main Road & Access', description: 'Wide internal roads for heavy vehicles' },
    { url: '/images/map.jpg', alt: '3D Map View', title: '3D Map View', description: 'Comprehensive site layout' },
    { url: '/images/office.jpg', alt: 'Office Space', title: 'Office Space', description: 'Modern office facilities' }
  ];

  const features = [
    { icon: <Ruler size={24} />, title: 'Flexible Sizes', description: '5,000 - 50,000 sq.ft units available' },
    { icon: <Zap size={24} />, title: 'Power Backup', description: '500 KVA with 24/7 generators' },
    { icon: <Shield size={24} />, title: 'Security', description: 'CCTV surveillance & biometric access' },
    { icon: <Truck size={24} />, title: 'Logistics', description: 'Easy highway and port access' },
    { icon: <Wifi size={24} />, title: 'Connectivity', description: 'High-speed internet infrastructure' },
    { icon: <Factory size={24} />, title: 'Infrastructure', description: 'Fire safety & waste management' }
  ];

  const specifications = [
    { label: 'Location', value: 'Moraiya, Changodar' },
    { label: 'Total Area', value: '50,000+ sq.ft' },
    { label: 'Units', value: '15+ Sheds' },
    { label: 'Height', value: '30-35 feet' },
    { label: 'Road Width', value: '40 feet' },
    { label: 'Power', value: '500 KVA' },
    { label: 'Lease', value: 'Flexible terms' },
    { label: 'Possession', value: 'Immediate' }
  ];

  const amenities = [
    'Loading & Unloading Area', 'High Ceiling (30-35 ft)', 'Three-Phase Power', 'Water Tank',
    'Cafeteria & Restrooms', 'Ample Parking', 'Fire Equipment', 'Industrial Flooring',
    'Pollution Control', 'GIDC Approved'
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index) => setCurrentSlide(index);

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

  // Touch handlers for swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && !isGalleryOpen) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isGalleryOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGalleryOpen) {
        if (e.key === 'Escape') closeGallery();
        else if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight') nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryOpen]);

  return (
    <>
      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black">
          <button onClick={closeGallery} className="absolute top-2 right-2 z-[110] p-2 sm:p-3 bg-black/80 hover:bg-black text-white rounded-full">
            <X size={20} />
          </button>

          <div className="absolute top-2 left-2 z-[110] px-3 py-1 bg-black/80 text-white rounded-full text-xs sm:text-sm font-semibold">
            {currentSlide + 1} / {images.length}
          </div>

          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div key={index} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <img src={image.url} alt={image.alt} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>

          {/* Desktop arrows only */}
          <button onClick={prevSlide} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-black/80 hover:bg-black text-white rounded-full">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-black/80 hover:bg-black text-white rounded-full">
            <ChevronRight size={24} />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[110] flex gap-2 overflow-x-auto max-w-full px-4">
            {images.map((image, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentSlide ? 'border-brand-red' : 'border-white/30'}`}>
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black">
        {/* Hero Slider */}
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden">
          <div 
            className="absolute inset-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }}>
                  {/* Lighter overlay for mobile */}
                  <div className="absolute inset-0 bg-black/40 sm:bg-black/60"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Controls */}
          <button onClick={prevSlide} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full">
            <ChevronRight size={24} />
          </button>

          {/* Gallery Button - Top Right */}
          <button onClick={openGallery} className="absolute top-4 right-4 z-10 px-3 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm flex items-center gap-2">
            <Maximize2 size={14} />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex items-end sm:items-center justify-center pb-12 sm:pb-0">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl">
                {images[currentSlide].title}
              </h2>
              <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                {images[currentSlide].description}
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 sm:py-20 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                Metro Industrial Park <span className="text-brand-red">Overview</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg max-w-3xl mx-auto">
                Strategic location with cutting-edge facilities designed for business growth
              </p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-10">
              {specifications.map((spec, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="text-xs text-gray-500 mb-1 uppercase">{spec.label}</div>
                  <div className="text-sm sm:text-lg font-bold text-white">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group bg-gray-900 p-5 sm:p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-3 text-white group-hover:text-brand-red transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="py-12 sm:py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                World-Class <span className="text-brand-red">Amenities</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <CheckCircle className="text-brand-red flex-shrink-0" size={16} />
                  <span className="text-gray-300 text-xs sm:text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 text-sm sm:text-lg mb-6 sm:mb-8">
              Schedule a site visit today
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/919824235642" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all">
                <FaWhatsapp size={20} />
                <span>WhatsApp Us</span>
              </a>
              <a href="tel:+919824235642" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-700 hover:border-gray-600 text-white font-bold rounded-lg transition-all">
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