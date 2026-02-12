import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Ruler, Shield, Truck, Phone, CheckCircle, Maximize2, Building2, Factory, Camera, Droplets, Scale, TrendingUp, Clock, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO/SEO';

const MetroIndustrialPark = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('areaTables');

  // WhatsApp pre-filled message
  const whatsappMessage = encodeURIComponent("Hello, I would like to inquire about the industrial sheds.");

  const overviewRef = useRef(null);
  const featuresRef = useRef(null);
  const amenitiesRef = useRef(null);
  const layoutRef = useRef(null);
  const [overviewInView, setOverviewInView] = useState(false);
  const [featuresInView, setFeaturesInView] = useState(false);
  const [amenitiesInView, setAmenitiesInView] = useState(false);
  const [layoutInView, setLayoutInView] = useState(false);

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Metro Industrial Park",
    "description": "54,000 sq.yard industrial park with 63 sheds (4K-50K sq.ft), 30-35ft height, 60ft roads, weigh bridge, 6-8% ROI. RCC construction available on request with additional charges.",
    "url": "https://www.metrodevelopers.co.in/metro-industrial-park",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Moraiya, Changodar",
      "addressLocality": "Moraiya",
      "addressRegion": "Gujarat",
      "postalCode": "382213",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.914141879249897",
      "longitude": "72.41748307531053"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Total Area", "value": "54,000 sq.yard" },
      { "@type": "LocationFeatureSpecification", "name": "Total Units", "value": "63 Sheds" },
      { "@type": "LocationFeatureSpecification", "name": "Unit Sizes", "value": "4,000-50,000 sq.ft" },
      { "@type": "LocationFeatureSpecification", "name": "RCC Construction (On Request)", "value": "Available with additional charges" },
      { "@type": "LocationFeatureSpecification", "name": "Height", "value": "30-35 feet" },
      { "@type": "LocationFeatureSpecification", "name": "Road Width", "value": "60 feet" },
      { "@type": "LocationFeatureSpecification", "name": "Possession", "value": "90 days" },
      { "@type": "LocationFeatureSpecification", "name": "Security", "value": "CCTV & Guards" },
      { "@type": "LocationFeatureSpecification", "name": "Water Supply", "value": "24x7" },
      { "@type": "LocationFeatureSpecification", "name": "Weigh Bridge", "value": "Separate" },
      { "@type": "LocationFeatureSpecification", "name": "Waste Management", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "ROI", "value": "6-8%" }
    ]
  };

  const images = [
    { url: '/images/2shed.jpg', alt: 'Modern Industrial Shed', title: 'Modern Industrial Shed', description: 'State-of-the-art industrial sheds with high ceilings' },
    { url: '/images/4shed.jpg', alt: 'Warehouse Facility', title: 'Warehouse Facility', description: 'Spacious warehouse units with optimal storage' },
    { url: '/images/entrance.jpg', alt: 'Park Entrance', title: 'Park Entrance', description: 'Professional entrance with 24/7 security' },
    { url: '/images/mainroad.jpg', alt: 'Main Road & Access', title: 'Main Road & Access', description: 'Wide internal roads for heavy vehicles' },
    { url: '/images/map.jpg', alt: '3D Map View', title: '3D Map View', description: 'Comprehensive site layout' },
    { url: '/images/office.jpg', alt: 'Office Space', title: 'Office Space', description: 'Modern office facilities' }
  ];

  const features = [
    { icon: <Ruler size={24} />, title: 'Flexible Sizes', description: '4,000 - 50,000 sq.ft units available' },
    { icon: <Shield size={24} />, title: 'Security', description: 'CCTV surveillance & guards at main gate' },
    { icon: <Truck size={24} />, title: 'Logistics', description: 'Easy highway and port access' },
    { icon: <Camera size={24} />, title: 'CCTV Coverage', description: 'Complete surveillance system' },
    { icon: <Droplets size={24} />, title: '24x7 Water Supply', description: 'Continuous water availability' },
    { icon: <Scale size={24} />, title: 'Weigh Bridge', description: 'Separate dedicated weigh bridge facility' },
    { icon: <Factory size={24} />, title: 'Waste Management', description: 'Professional waste disposal system' },
    { icon: <Building2 size={24} />, title: 'Infrastructure', description: 'Modern industrial facilities; RCC available on request with additional charges' }
  ];

  const specifications = [
    { label: 'Location', value: 'Moraiya, Changodar' },
    { label: 'Total Area', value: '54,000 sq.yards' },
    { label: 'Units', value: '63 Industrial Sheds' },
    { label: 'Unit Sizes', value: '4,000 - 50,000 sq.ft' },
    { label: 'Height', value: '30-35 feet' },
    { label: 'Road Width', value: '60 feet' },
    { label: 'Possession', value: '90 days' },
    { label: 'Expected ROI', value: '6-8%' },
    { label: 'RCC Option', value: 'Available on request with additional charges' },
    { label: 'Status', value: 'Available Now' }
  ];

  const amenities = [
    '24x7 Water Supply',
    'CCTV Surveillance',
    'Security Guards at Main Gate',
    'Separate Weigh Bridge',
    'Wide 60 feet Roads',
    'Waste Management System',
    'High Ceiling (30-35 ft)',
    'Modern Infrastructure (RCC on request with extra cost)',
    'Easy Highway Access',
    'Ample Parking Space'
  ];

  const layoutImages = {
    areaTable1: '/images/table1.jpg',
    areaTable2: '/images/table2.jpg',
    siteMap: '/images/metro-industrial-map.jpg'
  };

  useEffect(() => {
    if (!isAutoPlaying || isGalleryOpen) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isGalleryOpen, images.length]);

  useEffect(() => {
    const handleScroll = () => {
      const checkInView = (ref, setter, alreadyInView) => {
        if (!ref.current || alreadyInView) return;
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setter(true);
        }
      };

      checkInView(overviewRef, setOverviewInView, overviewInView);
      checkInView(featuresRef, setFeaturesInView, featuresInView);
      checkInView(amenitiesRef, setAmenitiesInView, amenitiesInView);
      checkInView(layoutRef, setLayoutInView, layoutInView);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [overviewInView, featuresInView, amenitiesInView, layoutInView]);

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

  const openImageGallery = (imageSrc, title) => {
    setGalleryImage({ src: imageSrc, title });
  };

  return (
    <>
      <SEO 
        title="Metro Industrial Park - 54,000 sq.yard Industrial Sheds | Moraiya, Ahmedabad"
        description="Premium industrial park with 63 sheds (4,000-50,000 sq.ft) in Moraiya, Ahmedabad. ✓ 54,000 sq.yard ✓ 30-35ft Height ✓ 60ft Roads ✓ CCTV & Guards ✓ 24x7 Water ✓ Separate Weigh Bridge ✓ Waste Management ✓ 90 Days Possession ✓ 6-8% ROI. RCC construction available on request with additional charges."
        keywords="Metro Industrial Park, 54000 sq yard industrial park, 63 industrial sheds, industrial shed 4000 sqft, warehouse 10000 sqft, factory space 50000 sqft, 60 feet road width, weigh bridge facility, 6 percent ROI, 8 percent ROI, possession 90 days, RCC shed on request, Moraiya, GIDC approved Changodar"
        canonical="/metro-industrial-park"
        ogImage="/images/2shed.jpg"
        structuredData={propertySchema}
      />
      <div className="min-h-screen theme-bg-primary">
        {/* ===== Hero Section with Slideshow - IMPROVED VISIBILITY ===== */}
<section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
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
        {/* ENHANCED OVERLAY - Better visibility for both themes */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-t from-black via-black/50 to-transparent' 
            : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent'
        }`}></div>
      </div>
    ))}
  </div>

  {/* Navigation Buttons */}
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
          index === currentSlide ? 'bg-brand-red w-8' : 'bg-white/60 hover:bg-white/80'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>

  {/* Content Overlay */}
  <div className="absolute inset-0 flex items-end">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 w-full">
      <div className="max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-brand-red/90 backdrop-blur-sm rounded-full shadow-lg">
          <Building2 size={16} className="text-white" />
          <span className="text-xs sm:text-sm text-white font-semibold">Available Now</span>
        </div>
        
        {/* Title - Always white for readability on images */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl">
          Metro Industrial Park
        </h1>
        
        {/* Description - Always white/light for readability */}
        <p className="text-sm sm:text-lg text-white mb-4 sm:mb-6 drop-shadow-lg font-medium">
          {images[currentSlide].description}
        </p>

        {/* RCC Notice - Enhanced visibility */}
        <p className="text-xs sm:text-sm text-gray-200 mb-4 drop-shadow-md font-medium">
          RCC construction is available on request with additional charges.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/916356766767?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <FaWhatsapp size={18} />
            <span>Inquire Now</span>
          </a>
          <button
            onClick={() => openGallery(currentSlide)}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md border font-bold rounded-lg transition-all text-sm sm:text-base hover:scale-105 ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                : 'bg-white/20 hover:bg-white/30 border-white/40 text-white shadow-lg'
            }`}
          >
            <Maximize2 size={18} />
            <span>View Gallery</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* ===== Quick Stats Bar ===== */}
        <section className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-black border-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200'} border-y`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">54,000</div>
                <div className="text-xs sm:text-sm theme-text-tertiary">Sq.yards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">63</div>
                <div className="text-xs sm:text-sm theme-text-tertiary">Units Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">60 ft</div>
                <div className="text-xs sm:text-sm theme-text-tertiary">Road Width</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">90 Days</div>
                <div className="text-xs sm:text-sm theme-text-tertiary">Possession</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Main Content ===== */}
        <section className={`py-12 sm:py-16 lg:py-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-12">
                {/* Overview Section */}
                <div ref={overviewRef}>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3 transition-all duration-1000 ${
                      overviewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <Building2 className="text-brand-red" size={28} />
                    Project Overview
                  </h2>
                  <div
                    className={`theme-bg-card rounded-xl p-6 sm:p-8 border theme-border transition-all duration-1000 delay-150 ${
                      overviewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <p className="theme-text-secondary leading-relaxed mb-4">
                      Metro Industrial Park is a premier industrial development strategically located in Moraiya, Changodar. 
                      Spread across 54,000 sq.yards, this modern facility offers 63 industrial units ranging from 4,000 to 50,000 sq.ft.
                    </p>
                    <p className="theme-text-secondary leading-relaxed mb-4">
                      The park features wide 60 feet roads, 24x7 water supply, comprehensive CCTV surveillance, and a dedicated weigh bridge facility. 
                      With possession available in just 90 days, it is suitable for businesses seeking quick occupancy.
                    </p>
                    <p className="theme-text-secondary leading-relaxed mb-2">
                      Designed for manufacturing and warehousing operations, the park offers high ceilings (30-35 feet), modern waste management systems, 
                      and connectivity to major highways and ports.
                    </p>
                    <p className="theme-text-secondary leading-relaxed text-sm mt-3">
                      RCC construction is not standard; it is provided only on request with additional charges.
                    </p>
                  </div>
                </div>

                {/* Features Grid Section */}
                <div ref={featuresRef}>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3 transition-all duration-1000 ${
                      featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <CheckCircle className="text-brand-red" size={28} />
                    Key Features
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`theme-bg-card p-4 sm:p-6 rounded-xl border theme-border hover:border-brand-red/60 transition-all duration-1000 ${
                          featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                        style={{ transitionDelay: `${index * 80}ms` }}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-brand-red mx-auto">
                          {feature.icon}
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold theme-text-primary mb-2 text-center">
                          {feature.title}
                        </h3>
                        <p className="theme-text-secondary text-xs sm:text-sm text-center">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities Section */}
                <div ref={amenitiesRef}>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3 transition-all duration-1000 ${
                      amenitiesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <Factory className="text-brand-red" size={28} />
                    Amenities & Facilities
                  </h2>
                  <div
                    className={`theme-bg-card rounded-xl p-6 sm:p-8 border theme-border transition-all duration-1000 delay-150 ${
                      amenitiesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 theme-text-secondary transition-all duration-700 ${
                            amenitiesInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                          }`}
                          style={{ transitionDelay: `${index * 60}ms` }}
                        >
                          <CheckCircle size={18} className="text-brand-red flex-shrink-0" />
                          <span className="text-sm sm:text-base">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout & Site Plan Section */}
                <div ref={layoutRef}>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold theme-text-primary mb-6 flex items-center gap-3 transition-all duration-1000 ${
                      layoutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <MapPin className="text-brand-red" size={28} />
                    Layout & Site Plan
                  </h2>

                  <div
                    className={`flex gap-2 sm:gap-3 mb-6 flex-wrap transition-all duration-1000 delay-150 ${
                      layoutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <button
                      onClick={() => setActiveTab('areaTables')}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                        activeTab === 'areaTables'
                          ? 'bg-brand-red text-white'
                          : `${theme === 'dark' ? 'bg-gray-900 text-gray-400 hover:bg-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                      }`}
                    >
                      Area Details
                    </button>
                    <button
                      onClick={() => setActiveTab('siteMap')}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                        activeTab === 'siteMap'
                          ? 'bg-brand-red text-white'
                          : `${theme === 'dark' ? 'bg-gray-900 text-gray-400 hover:bg-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                      }`}
                    >
                      Site Map
                    </button>
                  </div>

                  <div
                    className={`space-y-6 transition-all duration-1000 delay-300 ${
                      layoutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    {activeTab === 'areaTables' && (
                      <>
                        <div className={`theme-bg-card rounded-xl border theme-border overflow-hidden`}>
                          <div className={`min-h-[400px] w-full ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} flex flex-col items-center justify-center p-4`}>
                            <img
                              src={layoutImages.areaTable1}
                              alt="Area Details Table 1"
                              className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openImageGallery(layoutImages.areaTable1, 'Area Details Table 1')}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML =
                                  '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Area Details Table 1</p><p class="text-sm">Image will be available soon</p></div>';
                              }}
                            />
                            <button
                              onClick={() => openImageGallery(layoutImages.areaTable1, 'Area Details Table 1')}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red rounded-lg transition-all text-sm"
                            >
                              <Maximize2 size={16} />
                              <span>View Full Size</span>
                            </button>
                          </div>
                        </div>

                        <div className={`theme-bg-card rounded-xl border theme-border overflow-hidden`}>
                          <div className={`min-h-[400px] w-full ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} flex flex-col items-center justify-center p-4`}>
                            <img
                              src={layoutImages.areaTable2}
                              alt="Area Details Table 2"
                              className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openImageGallery(layoutImages.areaTable2, 'Area Details Table 2')}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML =
                                  '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Area Details Table 2</p><p class="text-sm">Image will be available soon</p></div>';
                              }}
                            />
                            <button
                              onClick={() => openImageGallery(layoutImages.areaTable2, 'Area Details Table 2')}
                              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-red/20 hover:bg-brand-red/30 text-brand-red rounded-lg transition-all text-sm"
                            >
                              <Maximize2 size={16} />
                              <span>View Full Size</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === 'siteMap' && (
                      <div className={`theme-bg-card rounded-xl border theme-border overflow-hidden`}>
                        <div className={`min-h-[600px] w-full ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'} flex flex-col items-center justify-center p-4`}>
                          <img
                            src={layoutImages.siteMap}
                            alt="Site Map - High Resolution"
                            className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageGallery(layoutImages.siteMap, 'Site Map - High Resolution')}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML =
                                '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Site Map</p><p class="text-sm">High-resolution image will be available soon</p></div>';
                            }}
                          />
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => openImageGallery(layoutImages.siteMap, 'Site Map - High Resolution')}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg transition-all text-sm font-semibold"
                            >
                              <Maximize2 size={16} />
                              <span>View Full Size</span>
                            </button>
                          </div>
                          <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-xs mt-3`}>
                            Click on image or button to view in full screen
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Specifications Card */}
                  <div className={`theme-bg-card rounded-xl p-6 border theme-border`}>
                    <h3 className="text-xl font-bold theme-text-primary mb-6">Specifications</h3>
                    <div className="space-y-4">
                      {specifications.map((spec, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-start border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} pb-3`}
                        >
                          <span className="theme-text-tertiary text-sm">{spec.label}</span>
                          <span className="theme-text-primary font-semibold text-sm text-right">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROI Highlight */}
                  <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-green-500/20 to-transparent border-green-500/30' : 'bg-gradient-to-br from-green-100 to-transparent border-green-300'} rounded-xl p-6 border`}>
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="text-green-500" size={28} />
                      <h3 className="text-xl font-bold theme-text-primary">Expected ROI</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-500 mb-2">6-8%</p>
                    <p className="theme-text-tertiary text-sm">Annual return on investment</p>
                  </div>

                  {/* Quick Contact */}
                  <div className={`theme-bg-card rounded-xl p-6 border theme-border`}>
                    <h3 className="text-xl font-bold theme-text-primary mb-4">Interested?</h3>
                    <p className="theme-text-tertiary text-sm mb-6">
                      Contact for Personalized options, detailed information, site visits, and booking.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/916356766767?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                      >
                        <FaWhatsapp size={20} />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href="tel:+919635676767"
                        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} hover:border-brand-red theme-text-primary font-bold rounded-lg transition-all`}
                      >
                        <Phone size={20} />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>

                  {/* Possession Timeline */}
                  <div className={`theme-bg-card rounded-xl p-6 border theme-border`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="text-brand-red" size={24} />
                      <h3 className="text-lg font-bold theme-text-primary">Quick Possession</h3>
                    </div>
                    <p className="text-2xl font-bold theme-text-primary mb-2">90 Days</p>
                    <p className="theme-text-tertiary text-sm">Ready for immediate occupancy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Hero Gallery Modal ===== */}
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
                <h3 className="text-white text-xl font-bold mb-2">
                  {images[currentSlide].title}
                </h3>
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

        {/* ===== Full Screen Image Gallery Modal ===== */}
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
              <p className="text-white text-lg font-semibold mt-4">
                {galleryImage.title}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Use pinch to zoom on mobile • Right-click to save
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MetroIndustrialPark;
