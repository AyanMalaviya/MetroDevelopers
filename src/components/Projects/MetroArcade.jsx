import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Store, ShoppingBag, Users, TrendingUp, Phone, CheckCircle, Maximize2, Building2, Coffee, Utensils, ShoppingCart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroArcade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = [
    { url: '/images/arcade-exterior.jpg', alt: 'Metro Arcade Exterior', title: 'Premium Commercial Hub', description: 'Modern complex with prime visibility' },
    { url: '/images/arcade-shops.jpg', alt: 'Retail Spaces', title: 'Premium Retail Spaces', description: 'Perfect for shops and showrooms' },
    { url: '/images/arcade-food.jpg', alt: 'Food Court', title: 'Food Court & Dining', description: 'Spacious food court area' },
    { url: '/images/arcade-parking.jpg', alt: 'Parking', title: 'Ample Parking', description: 'Multi-level parking for 200+ vehicles' },
    { url: '/images/arcade-interior.jpg', alt: 'Interior', title: 'Modern Interiors', description: 'Contemporary design with excellent lighting' }
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

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

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
          <button onClick={closeGallery} className="absolute top-2 right-2 z-[110] p-2 sm:p-3 bg-black/80 text-white rounded-full">
            <X size={20} />
          </button>
          <div className="absolute top-2 left-2 z-[110] px-3 py-1 bg-black/80 text-white rounded-full text-xs sm:text-sm font-semibold">
            {currentSlide + 1} / {images.length}
          </div>
          <div className="relative w-full h-full flex items-center justify-center" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {images.map((image, index) => (
              <div key={index} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <img src={image.url} alt={image.alt} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
          <button onClick={prevSlide} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-black/80 text-white rounded-full">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 bg-black/80 text-white rounded-full">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[110] flex gap-2 overflow-x-auto max-w-full px-4">
            {images.map((image, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 ${index === currentSlide ? 'border-brand-red' : 'border-white/30'}`}>
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden">
          <div className="absolute inset-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {images.map((image, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image.url})` }}>
                  <div className="absolute inset-0 bg-black/40 sm:bg-black/60"></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={prevSlide} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 text-white rounded-full">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 text-white rounded-full">
            <ChevronRight size={24} />
          </button>
          <button onClick={openGallery} className="absolute top-4 right-4 z-10 px-3 py-2 bg-black/60 text-white rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Maximize2 size={14} />
            <span className="hidden sm:inline">Gallery</span>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex items-end sm:items-center justify-center pb-12 sm:pb-0">
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
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <div className="text-xs text-gray-500 mb-1 uppercase">{spec.label}</div>
                  <div className="text-sm sm:text-lg font-bold text-white">{spec.value}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group bg-gray-900 p-5 sm:p-6 rounded-xl border border-gray-800">
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
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
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
              <a href="https://wa.me/919824235642" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg">
                <FaWhatsapp size={20} />
                <span>WhatsApp Us</span>
              </a>
              <a href="tel:+919824235642" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-700 text-white font-bold rounded-lg">
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