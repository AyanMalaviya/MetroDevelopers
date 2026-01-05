import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Ruler, Store, ShoppingBag, Users, TrendingUp, Phone, CheckCircle, Maximize2, Building2, Coffee, Utensils, ShoppingCart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroArcade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    {
      url: '/images/arcade-top.jpeg',
      alt: 'Metro Arcade Exterior View',
      title: 'Metro Arcade - Premium Commercial Hub',
      description: 'Modern commercial complex with prime visibility and high foot traffic'
    },
    {
      url: '/images/arcade-shops.jpeg',
      alt: 'Retail Spaces - Metro Arcade',
      title: 'Premium Retail Spaces',
      description: 'Well-designed retail units perfect for shops, boutiques, and showrooms'
    }
  ];

  const features = [
    {
      icon: <Store className="text-brand-red" size={24} />,
      title: 'Prime Location',
      description: 'Strategic position on main road with excellent visibility and accessibility'
    },
    {
      icon: <Users className="text-brand-red" size={24} />,
      title: 'High Footfall',
      description: '10,000+ daily visitors from surrounding residential and commercial areas'
    },
    {
      icon: <ShoppingBag className="text-brand-red" size={24} />,
      title: 'Flexible Sizes',
      description: '200-2000 sq.ft units available for retail, F&B, and service businesses'
    },
    {
      icon: <TrendingUp className="text-brand-red" size={24} />,
      title: 'High ROI',
      description: 'Excellent rental yields and strong appreciation potential in prime location'
    },
    {
      icon: <Building2 className="text-brand-red" size={24} />,
      title: 'Modern Amenities',
      description: 'Central AC, escalators, elevators, and premium finishes throughout'
    },
    {
      icon: <ShoppingCart className="text-brand-red" size={24} />,
      title: 'Mixed Tenancy',
      description: 'Diverse retail mix including fashion, electronics, food, and services'
    }
  ];

  const specifications = [
    { label: 'Location', value: 'Main Road, Moraiya' },
    { label: 'Total Area', value: '80,000 sq.ft' },
    { label: 'Retail Units', value: '60+ Shops' },
    { label: 'Unit Sizes', value: '200-2000 sq.ft' },
    { label: 'Parking', value: '200+ Car Parks' },
    { label: 'Floors', value: '3 Floors + Basement' },
    { label: 'Availability', value: 'Lease Available' },
    { label: 'Possession', value: 'Ready to Move' }
  ];

  const amenities = [
    'Central Air Conditioning',
    'High-Speed Elevators',
    'Escalators',
    'Power Backup (100%)',
    'Food Court',
    'ATM & Banking',
    '24/7 Security',
    'CCTV Surveillance',
    'Fire Safety Systems',
    'Ample Parking',
    'Cafeteria',
    'Washroom Facilities'
  ];

  const idealFor = [
    { icon: <Coffee size={20} />, text: 'Cafes & Restaurants' },
    { icon: <ShoppingBag size={20} />, text: 'Fashion & Apparel' },
    { icon: <Store size={20} />, text: 'Electronics Showrooms' },
    { icon: <Utensils size={20} />, text: 'Food & Beverages' },
    { icon: <Building2 size={20} />, text: 'Service Centers' },
    { icon: <ShoppingCart size={20} />, text: 'Supermarkets' }
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
          <button onClick={closeGallery} className="absolute top-4 right-4 z-[110] p-3 bg-brand-red/90 hover:bg-brand-red text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl">
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
              <div key={index} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={image.url} alt={image.alt} className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: 'calc(100vh - 120px)' }} />
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
              <button key={index} onClick={() => goToSlide(index)} className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentSlide ? 'border-brand-red scale-110 shadow-lg shadow-brand-red/50' : 'border-white/30 hover:border-white/70 opacity-70 hover:opacity-100'}`}>
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-brand-dark">
        {/* Hero Slider Section */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
          {/* Image Slider */}
          <div className="absolute inset-0">
            {images.map((image, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/85 via-brand-dark/70 to-gray-900/75"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50"></div>
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
              <button key={index} onClick={() => goToSlide(index)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 sm:w-12 bg-brand-red' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>

          {/* Slide Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-brand-red/30 border border-brand-red/60 rounded-full backdrop-blur-md">
                <Store className="text-brand-red" size={18} />
                <span className="text-xs sm:text-sm text-brand-red font-semibold">Premium Commercial Space</span>
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
        <section className="py-12 sm:py-16 md:py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Metro Arcade <span className="text-brand-red">Overview</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                Experience the future of retail at Metro Arcade – a premium commercial complex strategically located to maximize footfall, equipped with state-of-the-art amenities, and designed to elevate your business success.
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {specifications.map((spec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-xl border border-gray-800 hover:border-brand-red transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-brand-red/20">
                  <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">{spec.label}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group bg-[radial-gradient(circle_at_center,#1f2937_0%,#111827_100%)] p-6 sm:p-8 rounded-2xl border-2 border-gray-800 hover:border-brand-red transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-red/20">
                  <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal For Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Perfect For <span className="text-brand-red">Your Business</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Versatile spaces designed to accommodate diverse business needs
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
              {idealFor.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-xl border border-gray-800 hover:border-brand-red transition-all duration-300 hover:scale-105 text-center">
                  <div className="w-12 h-12 mx-auto bg-brand-red/20 rounded-lg flex items-center justify-center mb-3 text-brand-red">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-white">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                World-Class <span className="text-brand-red">Amenities</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-brand-red transition-all duration-300 hover:scale-105">
                  <CheckCircle className="text-brand-red flex-shrink-0" size={20} />
                  <span className="text-gray-300 text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-brand-red via-red-600 to-brand-red">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Launch Your Business at Metro Arcade
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Join successful brands and entrepreneurs in this thriving commercial hub. Limited units available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/919824235642" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl">
                <FaWhatsapp size={24} />
                <span>WhatsApp Us</span>
              </a>
              <a href="tel:+919824235642" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
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

export default MetroArcade;