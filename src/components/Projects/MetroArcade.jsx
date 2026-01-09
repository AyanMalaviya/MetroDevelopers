import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Phone, CheckCircle, Maximize2, Building2, Home, MapPin, TrendingUp, Users, Package, Car } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroArcade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    { url: '/images/arcade-top.jpeg', alt: 'Metro Arcade Front View', title: 'Metro Arcade', description: 'Modern commercial arcade on main road' },
    { url: '/images/arcade-2.jpg', alt: 'Shop Units', title: 'Commercial Units', description: 'Prime retail and office spaces' },
    { url: '/images/arcade-3.jpg', alt: 'Arcade Interior', title: 'Interior View', description: 'Well-designed commercial spaces' }
  ];

  // UPDATED SPECIFICATIONS FOR METRO ARCADE
  const specifications = [
    { label: 'Location', value: 'Main Road, Moraiya' },
    { label: 'Total Area', value: '15,000 sq.ft' },
    { label: 'Total Units', value: '20 Commercial Shops' },
    { label: 'Unit Size', value: '15x45 ft' },
    { label: 'Building Type', value: 'G+1 Floors' },
    { label: 'Construction', value: 'RCC Structure' },
    { label: 'Parking', value: 'Personal Parking' },
    { label: 'Status', value: 'Taking Investor Bookings' }
  ];

  // AMENITIES FOR METRO ARCADE
  const amenities = [
    'RCC Construction',
    'G+1 Building',
    'Main Road Location',
    'Personal Parking',
    'Modern Design',
    'Prime Visibility',
    'High Rental Yield',
    'Investment Opportunity'
  ];

  // FEATURES
  const features = [
    { icon: <Building2 size={24} />, title: 'RCC Construction', description: 'Solid reinforced concrete structure' },
    { icon: <Home size={24} />, title: 'G+1 Building', description: 'Ground + First Floor configuration' },
    { icon: <MapPin size={24} />, title: 'Prime Location', description: 'Main road frontage with high visibility' },
    { icon: <Car size={24} />, title: 'Personal Parking', description: 'Individual parking spaces for each unit' },
    { icon: <TrendingUp size={24} />, title: 'Investment Ready', description: 'High rental yield potential' },
    { icon: <Users size={24} />, title: 'Commercial Hub', description: 'Ideal for retail and offices' }
  ];

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || isGalleryOpen) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isGalleryOpen, images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const openGallery = (index) => {
    setCurrentSlide(index);
    setIsGalleryOpen(true);
    setIsAutoPlaying(false);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setGalleryImage(null);
  };

  // Open specific image in full-screen gallery
  const openImageGallery = (imageSrc, title) => {
    setGalleryImage({ src: imageSrc, title: title });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
        {/* Slideshow */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Slideshow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-brand-red w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm rounded-full">
                <Package size={16} className="text-black" />
                <span className="text-xs sm:text-sm text-black font-semibold">Taking Investor Bookings</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl">
                Metro Arcade
              </h1>
              
              <p className="text-sm sm:text-lg text-white/90 mb-4 sm:mb-6 drop-shadow-lg">
                {images[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919824235642"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
                >
                  <FaWhatsapp size={18} />
                  <span>Book Now</span>
                </a>
                <button
                  onClick={() => openGallery(currentSlide)}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-lg transition-all text-sm sm:text-base"
                >
                  <Maximize2 size={18} />
                  <span>View Gallery</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-gradient-to-r from-gray-900 to-black border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">15,000</div>
              <div className="text-xs sm:text-sm text-gray-400">Sq.ft Total Area</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">20</div>
              <div className="text-xs sm:text-sm text-gray-400">Commercial Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">G+1</div>
              <div className="text-xs sm:text-sm text-gray-400">Floors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">15x45</div>
              <div className="text-xs sm:text-sm text-gray-400">Unit Size (ft)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Booking Notice */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-transparent rounded-xl p-6 sm:p-8 border border-yellow-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">📢 Now Taking Investor Bookings</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Metro Arcade is currently in the booking phase. This is an excellent opportunity for investors to secure prime commercial spaces on the main road in Moraiya.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Be among the first to invest in this promising commercial development. Contact us today for special pre-launch offers and detailed investment information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Building2 className="text-brand-red" size={28} />
                  Project Overview
                </h2>
                <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Metro Arcade is a modern commercial development strategically located on the main road in Moraiya. 
                    This G+1 floor building offers 20 commercial units, each measuring 15x45 feet, perfect for retail shops, showrooms, or offices.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Built with RCC (Reinforced Cement Concrete) construction, the arcade ensures durability and longevity. 
                    Each unit comes with personal parking space, adding tremendous value for business owners and customers alike.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    With its prime location on the main road, Metro Arcade offers excellent visibility and footfall, 
                    making it an ideal investment for those seeking high rental yields and capital appreciation.
                  </p>
                </div>
              </div>

              {/* Features Grid - 2 COLUMNS ON MOBILE */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <CheckCircle className="text-brand-red" size={28} />
                  Key Features
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-brand-red mx-auto">
                        {feature.icon}
                      </div>
                      <h3 className="text-sm sm:text-lg font-bold text-white mb-2 text-center">{feature.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm text-center">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Checklist */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Home className="text-brand-red" size={28} />
                  Amenities & Facilities
                </h2>
                <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle size={18} className="text-brand-red flex-shrink-0" />
                        <span className="text-sm sm:text-base">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Investment Benefits */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="text-brand-red" size={28} />
                  Investment Benefits
                </h2>
                <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">High Rental Yield</h4>
                        <p className="text-gray-400 text-sm">Prime location ensures strong rental income potential</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Capital Appreciation</h4>
                        <p className="text-gray-400 text-sm">Main road property values continue to rise steadily</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Easy Tenant Availability</h4>
                        <p className="text-gray-400 text-sm">High demand for commercial spaces in this location</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Flexible Usage</h4>
                        <p className="text-gray-400 text-sm">Suitable for retail, showrooms, offices, or clinics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Specifications Card */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-6">Specifications</h3>
                  <div className="space-y-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between items-start border-b border-gray-800 pb-3">
                        <span className="text-gray-400 text-sm">{spec.label}</span>
                        <span className="text-white font-semibold text-sm text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Status */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-transparent rounded-xl p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="text-yellow-500" size={28} />
                    <h3 className="text-xl font-bold text-white">Booking Status</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500 mb-2">Open for Investors</p>
                  <p className="text-gray-400 text-sm">Limited units available - Book early to secure best locations</p>
                </div>

                {/* Quick Contact */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4">Interested?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Contact us for booking details, investment plans, and site visits
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://wa.me/919824235642"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                    >
                      <FaWhatsapp size={20} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+919824235642"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-700 hover:border-brand-red text-white font-bold rounded-lg transition-all"
                    >
                      <Phone size={20} />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>

                {/* Investment Highlights */}
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-6 border border-green-500/30">
                  <h3 className="text-lg font-bold text-white mb-4">💰 Investment Opportunity</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Prime main road location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>High footfall area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Personal parking included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Strong rental demand</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Gallery Modal (Slideshow) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevSlide}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="max-w-6xl mx-auto px-4">
            <img
              src={images[currentSlide].url}
              alt={images[currentSlide].alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-bold mb-2">{images[currentSlide].title}</h3>
              <p className="text-gray-400">{images[currentSlide].description}</p>
              <p className="text-gray-500 text-sm mt-2">
                {currentSlide + 1} / {images.length}
              </p>
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Full Screen Image Gallery Modal */}
      {galleryImage && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="w-full h-full flex flex-col items-center justify-center">
            <img
              src={galleryImage.src}
              alt={galleryImage.title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <p className="text-white text-lg font-semibold mt-4">{galleryImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetroArcade;
