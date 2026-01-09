import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Ruler, Shield, Truck, Phone, CheckCircle, Maximize2, Building2, Factory, Camera, Droplets, Scale, TrendingUp, Clock, MapPin, ExternalLink } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const MetroIndustrialPark = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('areaTables');

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Metro Industrial Park",
    "description": "54,000 sq.yard industrial park with 63 RCC sheds (4K-50K sq.ft), 30-35ft height, 60ft roads, weigh bridge, 6-8% ROI",
    "url": "https://www.metrodevelopers.co.in/projects/metro-industrial-park",
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
      { "@type": "LocationFeatureSpecification", "name": "RCC Construction", "value": true },
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

  // UPDATED FEATURES
  const features = [
    { icon: <Ruler size={24} />, title: 'Flexible Sizes', description: '4,000 - 50,000 sq.ft units available' },
    { icon: <Shield size={24} />, title: 'Security', description: 'CCTV surveillance & guards at main gate' },
    { icon: <Truck size={24} />, title: 'Logistics', description: 'Easy highway and port access' },
    { icon: <Camera size={24} />, title: 'CCTV Coverage', description: 'Complete surveillance system' },
    { icon: <Droplets size={24} />, title: '24x7 Water Supply', description: 'Continuous water availability' },
    { icon: <Scale size={24} />, title: 'Weigh Bridge', description: 'Separate dedicated weigh bridge facility' },
    { icon: <Factory size={24} />, title: 'Waste Management', description: 'Professional waste disposal system' },
    { icon: <Building2 size={24} />, title: 'Infrastructure', description: 'Modern industrial facilities' }
  ];

  // UPDATED SPECIFICATIONS
  const specifications = [
    { label: 'Location', value: 'Moraiya, Changodar' },
    { label: 'Total Area', value: '54,000 sq.yards' },
    { label: 'Units', value: '63 Industrial Sheds' },
    { label: 'Unit Sizes', value: '4,000 - 50,000 sq.ft' },
    { label: 'Height', value: '30-35 feet' },
    { label: 'Road Width', value: '60 feet' },
    { label: 'Possession', value: '90 days' },
    { label: 'Expected ROI', value: '6-8%' },
    { label: 'Status', value: 'Available Now' }
  ];

  // UPDATED AMENITIES
  const amenities = [
    '24x7 Water Supply',
    'CCTV Surveillance',
    'Security Guards at Main Gate',
    'Separate Weigh Bridge',
    'Wide 60 feet Roads',
    'Waste Management System',
    'High Ceiling (30-35 ft)',
    'Modern Infrastructure',
    'Easy Highway Access',
    'Ample Parking Space'
  ];

  // Layout images - REMOVED FLOOR PLAN
  const layoutImages = {
    areaTable1: '/images/metro-industrial-table1.jpeg',
    areaTable2: '/images/metro-industrial-table2.jpeg',
    siteMap: '/images/metro-industrial-map.jpg',
    siteMapPDF: '/pdfs/metro-industrial-map.pdf'
  };

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
    <>
      <SEO 
        title="Metro Industrial Park - 54,000 sq.yard Industrial Sheds | Moraiya, Ahmedabad"
        description="Premium industrial park with 63 RCC sheds (4,000-50,000 sq.ft) in Moraiya, Ahmedabad. ✓ 54,000 sq.yard (4.86 lakh sq.ft) ✓ 30-35ft Height ✓ 60ft Roads ✓ CCTV & Guards ✓ 24x7 Water ✓ Separate Weigh Bridge ✓ Waste Management ✓ 90 Days Possession ✓ 6-8% ROI. Perfect for manufacturing, warehousing, logistics."
        keywords="Metro Industrial Park, 54000 sq yard industrial park, 63 industrial sheds, industrial shed 4000 sqft, warehouse 10000 sqft, factory space 50000 sqft, 60 feet road width, weigh bridge facility, 6 percent ROI, 8 percent ROI, possession 90 days, RCC shed Moraiya, GIDC approved Changodar"
        canonical="/projects/metro-industrial-park"
        ogImage="/images/2shed.jpg"
        structuredData={propertySchema}
      />
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
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-brand-red/90 backdrop-blur-sm rounded-full">
                <Building2 size={16} className="text-white" />
                <span className="text-xs sm:text-sm text-white font-semibold">Available Now</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl">
                Metro Industrial Park
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
                  <span>Inquire Now</span>
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
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">54,000</div>
              <div className="text-xs sm:text-sm text-gray-400">Sq.yards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">63</div>
              <div className="text-xs sm:text-sm text-gray-400">Units Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">60 ft</div>
              <div className="text-xs sm:text-sm text-gray-400">Road Width</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-brand-red mb-1">90 Days</div>
              <div className="text-xs sm:text-sm text-gray-400">Possession</div>
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
              {/* Overview */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Building2 className="text-brand-red" size={28} />
                  Project Overview
                </h2>
                <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Metro Industrial Park is a premier industrial development strategically located in Moraiya, Changodar. 
                    Spread across 54,000 sq.yards, this modern facility offers 63 industrial units ranging from 4,000 to 50,000 sq.ft.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The park features wide 60 feet roads, 24x7 water supply, comprehensive CCTV surveillance, and a dedicated weigh bridge facility. 
                    With possession available in just 90 days, it's the perfect choice for businesses seeking immediate occupancy.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Designed for manufacturing and warehousing operations, the park offers high ceilings (30-35 feet), modern waste management systems, 
                    and excellent connectivity to major highways and ports.
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
                  <Factory className="text-brand-red" size={28} />
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

              {/* Layout Section - REMOVED FLOOR PLAN TAB */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="text-brand-red" size={28} />
                  Layout & Site Plan
                </h2>
                
                {/* Tab Navigation - NO FLOOR PLAN */}
                <div className="flex gap-2 sm:gap-3 mb-6 flex-wrap">
                  <button
                    onClick={() => setActiveTab('areaTables')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                      activeTab === 'areaTables'
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    Area Details
                  </button>
                  <button
                    onClick={() => setActiveTab('siteMap')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                      activeTab === 'siteMap'
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    Site Map
                  </button>
                </div>

                {/* Layout Content */}
                <div className="space-y-6">
                  {/* Area Tables - EQUAL HEIGHT CONTAINERS */}
                  {activeTab === 'areaTables' && (
                    <>
                      {/* Table 1 */}
                      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="min-h-[400px] w-full bg-gray-950 flex flex-col items-center justify-center p-4">
                          <img
                            src={layoutImages.areaTable1}
                            alt="Area Details Table 1"
                            className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageGallery(layoutImages.areaTable1, 'Area Details Table 1')}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Area Details Table 1</p><p class="text-sm">Image will be available soon</p></div>';
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

                      {/* Table 2 */}
                      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="min-h-[400px] w-full bg-gray-950 flex flex-col items-center justify-center p-4">
                          <img
                            src={layoutImages.areaTable2}
                            alt="Area Details Table 2"
                            className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageGallery(layoutImages.areaTable2, 'Area Details Table 2')}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Area Details Table 2</p><p class="text-sm">Image will be available soon</p></div>';
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

                  {/* Site Map - BIG IMAGE WITH ZOOM */}
                  {activeTab === 'siteMap' && (
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="min-h-[600px] w-full bg-gray-950 flex flex-col items-center justify-center p-4">
                        <img
                          src={layoutImages.siteMap}
                          alt="Site Map - High Resolution"
                          className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openImageGallery(layoutImages.siteMap, 'Site Map - High Resolution')}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="text-gray-500 text-center p-8"><p class="text-lg mb-2">Site Map</p><p class="text-sm">High-resolution image will be available soon</p></div>';
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
                          {layoutImages.siteMapPDF && (
                            <a
                              href={layoutImages.siteMapPDF}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all text-sm"
                            >
                              <ExternalLink size={16} />
                              <span>Open PDF</span>
                            </a>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-3">Click on image or button to view in full screen</p>
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

                {/* ROI Highlight - GREEN COLOR */}
                <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="text-green-500" size={28} />
                    <h3 className="text-xl font-bold text-white">Expected ROI</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-500 mb-2">6-8%</p>
                  <p className="text-gray-400 text-sm">Annual return on investment</p>
                </div>

                {/* Quick Contact */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4">Interested?</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Contact us for detailed information, site visits, and booking
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

                {/* Possession Timeline */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="text-brand-red" size={24} />
                    <h3 className="text-lg font-bold text-white">Quick Possession</h3>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">90 Days</p>
                  <p className="text-gray-400 text-sm">Ready for immediate occupancy</p>
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

      {/* Full Screen Image Gallery Modal (No Thumbnails) */}
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
            <p className="text-gray-400 text-sm mt-2">Use pinch to zoom on mobile • Right-click to save</p>
          </div>
        </div>
      )}
      <a
        href="/pdfs/metro-industrial-map.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg"
      >
        <ExternalLink size={16} />
        <span>View PDF</span>
      </a>
    </div>
    </>
  );
};

export default MetroIndustrialPark;
