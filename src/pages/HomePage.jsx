// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, ShieldCheck, Phone, Clock, Zap, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO/SEO.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});
  const observerRefs = useRef([]);

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
        title="Premium Industrial Sheds for Lease & Sale"
        description="State-of-the-art industrial sheds at Metro Industrial Park. Prime location, modern infrastructure, flexible lease and purchase options. Contact us for site visit."
        keywords="industrial sheds, industrial park, warehouse for lease, industrial space for sale, manufacturing facility, storage space, business park"
        url="/"
      />
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[85vh] sm:min-h-[100vh] bg-gradient-to-br from-brand-dark via-gray-1000 to-brand-grey overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>

        {/* Hero Content - Fade in animation */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-red/20 border border-brand-red/50 rounded-full backdrop-blur-sm animate-slide-down">
            <Zap className="text-brand-red" size={14} />
            <span className="text-xs sm:text-sm text-brand-red font-semibold">Premium Industrial Solutions</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-4 sm:mb-6 leading-tight animate-slide-up">
            Build Your Business at
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-orange-500 animate-gradient">
              Metro Industrial Park
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 animate-fade-in animation-delay-200">
            State-of-the-art industrial sheds designed for modern enterprises. 
            Ready-to-move spaces available for <span className="text-brand-red font-semibold">lease</span> or <span className="text-brand-red font-semibold">purchase</span> with flexible terms.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-16 px-4 animate-fade-in animation-delay-400">
            <button 
              onClick={() => navigate('/projects')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-red text-white text-sm sm:text-base lg:text-lg font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-red/50 hover:scale-105 active:scale-95"
            >
              Explore Projects
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
          <button 
            // Update the onClick to redirect to the WhatsApp URL
            onClick={() => window.location.href = "https://wa.me/8866235642"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-brand-red text-white text-sm sm:text-base lg:text-lg font-semibold rounded-xl hover:bg-brand-red/10 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FaWhatsapp style={{ color: 'red', fontSize: '2rem' }} />
            Chat on WhatsApp
          </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-2 animate-fade-in animation-delay-600">
            <div className="bg-brand-grey/30 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:scale-105">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-red mb-1 sm:mb-2">50+</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-300 uppercase tracking-wider">Industrial Sheds</div>
            </div>
            <div className="bg-brand-grey/30 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:scale-105 animation-delay-100">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-red mb-1 sm:mb-2">100%</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-300 uppercase tracking-wider">Legal Compliance</div>
            </div>
            <div className="bg-brand-grey/30 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-brand-red transition-all duration-500 hover:scale-105 animation-delay-200">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-red mb-1 sm:mb-2">24/7</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-300 uppercase tracking-wider">Security & Support</div>
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
