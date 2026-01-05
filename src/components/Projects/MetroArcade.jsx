import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Store, ShoppingBag, Users, TrendingUp, Phone, CheckCircle, Maximize2, Building2, Coffee, Utensils, ShoppingCart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroArcade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const images = [
    { url: '/images/arcade-top.jpeg', alt: 'Metro Arcade Top view', title: 'Premium Commercial Hub', description: 'Modern complex with prime visibility' },
    { url: '/images/arcade-shops.jpeg', alt: 'Retail Spaces', title: 'Premium Retail Spaces', description: 'Perfect for shops and showrooms' }
  ];

  const features = [
    { icon: <Store size={24} />, title: 'Prime Location', description: 'Main road with excellent visibility' },
    { icon: <Users size={24} />, title: 'High Footfall', description: '10,000+ daily visitors' },
    { icon: <ShoppingBag size={24} />, title: 'Flexible Sizes', description: '200-2000 sq.ft units available' },
    { icon: <TrendingUp size={24} />, title: 'High ROI', description: 'Excellent rental yields' },
    { icon: <Building2 size={24} />, title: 'Modern Amenities', description: 'Central AC, escalators, elevators' },
    { icon: <ShoppingCart size={24} />, title: 'Mixed Tenancy', description: 'Fashion, electronics, food, services' }
  ];

  const specifications = [
    { label: 'Location', value: 'Main Road, Moraiya' },
    { label: 'Total Area', value: '80,000 sq.ft' },
    { label: 'Units', value: '60+ Shops' },
    { label: 'Sizes', value: '200-2000 sq.ft' },
    { label: 'Parking', value: '200+ Cars' },
    { label: 'Floors', value: '3 + Basement' },
    { label: 'Status', value: 'Lease Available' },
    { label: 'Ready', value: 'Move-in Ready' }
  ];

  const idealFor = [
    { icon: <Coffee size={18} />, text: 'Cafes & Restaurants' },
    { icon: <ShoppingBag size={18} />, text: 'Fashion Stores' },
    { icon: <Store size={18} />, text: 'Electronics' },
    { icon: <Utensils size={18} />, text: 'Food & Beverage' },
    { icon: <Building2 size={18} />, text: 'Service Centers' },
    { icon: <ShoppingCart size={18} />, text: 'Supermarkets' }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const openGallery = () => {
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Touch handlers
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 75) nextSlide();
    if (touchStartX - touchEndX < -75) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') closeGallery();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryOpen]);

  return (
    <>
      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[9999] bg-black" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
            className="absolute top-4 right-4 z-[10000] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-[10000] px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold pointer-events-none">
            {currentSlide + 1} / {images.length}
          </div>

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ pointerEvents: 'none' }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 p-4 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="max-w-full max-h-full object-contain" 
                  style={{ maxHeight: 'calc(100vh - 150px)' }}
                />
              </div>
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-[10000] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft size={28} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-[10000] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] flex gap-2 px-4" style={{ pointerEvents: 'auto' }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  index === currentSlide ? 'border-brand-red scale-110' : 'border-white/40 hover:border-white/70'
                }`}
              >
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black">
        {/* Hero */}
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
                  <div className="absolute inset-0 bg-black/40 sm:bg-black/60"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Controls */}
          <button onClick={prevSlide} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all">
            <ChevronRight size={24} />
          </button>

          {/* Gallery Button */}
          <button onClick={openGallery} className="absolute top-4 right-4 z-10 px-3 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm flex items-center gap-2 transition-all">
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
          <div className="absolute inset-0 z-10 flex items-end sm:items-center justify-center pb-12 sm:pb-0 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
                {images[currentSlide].title}
              </h2>
              <p className="text-sm sm:text-lg text-white/90 drop-shadow-lg">
                {images[currentSlide].description}
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 sm:py-20 bg-gradient-to-b from-black via-gray-950 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                Metro Arcade <span className="text-brand-red">Overview</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg max-w-3xl mx-auto">
                Premium commercial complex for retail success
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-10">
              {specifications.map((spec, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="text-xs text-gray-500 mb-1 uppercase">{spec.label}</div>
                  <div className="text-sm sm:text-lg font-bold text-white">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group bg-gray-900 p-5 sm:p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-3 text-white group-hover:text-brand-red transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal For */}
        <section className="py-12 sm:py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                Perfect For <span className="text-brand-red">Your Business</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {idealFor.map((item, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center hover:border-gray-700 transition-all">
                  <div className="w-10 h-10 mx-auto bg-gray-800 rounded-lg flex items-center justify-center mb-2 text-white">
                    {item.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Launch Your Business at Metro Arcade
            </h2>
            <p className="text-gray-300 text-sm sm:text-lg mb-6">
              Limited units available!
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

export default MetroArcade;