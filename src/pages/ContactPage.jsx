import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, User, Building2, Clock, ExternalLink, Star, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import SEO from '../components/SEO/SEO';


const ContactPage = () => {
  const { theme } = useTheme();
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const partnersRef = useRef(null);
  const locationRef = useRef(null);
  const reviewsRef = useRef(null);
  const [partnersInView, setPartnersInView] = useState(false);
  const [locationInView, setLocationInView] = useState(false);
  const [reviewsInView, setReviewsInView] = useState(false);


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Metro Enterprise",
    "description": "Get in touch for industrial sheds and warehouses",
    "url": "https://www.metrodevelopers.co.in/contact",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.metrodevelopers.co.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": "https://www.metrodevelopers.co.in/contact"
        }
      ]
    }
  };


  const partners = [
    {
      name: 'Amir Malaviya',
      role: 'Director',
      phone: '+91 98242 35642',
      email: 'amirmalaviya786@gmail.com',
      whatsapp: '919824235642'
    },
    {
      name: 'Nazim Kazani',
      role: 'Director',
      phone: '+91 96249 65017',
      whatsapp: '919624965017'
    },
    {
      name: 'Kaushar Kalyani',
      role: 'Director'
    }
  ];


  useEffect(() => {
    setIsVisible(true);


    const handleScroll = () => {
      if (partnersRef.current && !partnersInView) {
        const rect = partnersRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setPartnersInView(true);
        }
      }


      if (locationRef.current && !locationInView) {
        const rect = locationRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setLocationInView(true);
        }
      }


      if (reviewsRef.current && !reviewsInView) {
        const rect = reviewsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setReviewsInView(true);
        }
      }


      if (!promptDismissed) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        if (scrollPercentage > 75) {
          setShowReviewPrompt(true);
        }
      }
    };


    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [partnersInView, locationInView, reviewsInView, promptDismissed]);


  const dismissPrompt = () => {
    setShowReviewPrompt(false);
    setPromptDismissed(true);
  };


  return (
    <>
      <SEO 
        title="Contact Us - Metro Enterprise | Industrial Sheds Ahmedabad"
        description="Contact Metro Enterprise for industrial sheds, warehouses in Moraiya, Ahmedabad. Call +91 98242 35642, +91 96249 65017. Email: metrodevelopers26@gmail.com. Visit: Opp. Suvas Ind Estate, Moraiya - 382213."
        keywords="contact Metro Enterprise, industrial shed inquiry Ahmedabad, warehouse contact Moraiya, real estate Ahmedabad contact, Amir Malaviya, Nazim Kazani"
        canonical="/contact"
        structuredData={structuredData}
      />


      <div className="min-h-screen theme-bg-primary">
        {/* ===== Hero Section ===== */}
        <section className={`relative ${theme === 'dark' ? 'bg-gradient-to-b from-gray-950 via-black to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'} pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-36 md:pb-20 overflow-hidden`}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-3xl animate-pulse"></div>
          </div>


          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-bold theme-text-primary mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Get In <span className="text-brand-red">Touch</span>
            </h1>
            <div 
              className={`w-24 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
            ></div>
            <p 
              className={`theme-text-tertiary text-base sm:text-lg max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Contact our team for site visits, inquiries, or investment opportunities
            </p>


            <div 
              className={`flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <a 
                href="mailto:metrodevelopers26@gmail.com"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-3 theme-bg-card backdrop-blur-md rounded-full transition-all text-sm sm:text-base border theme-border hover:border-brand-red/50 theme-shadow-lg`}
              >
                <Mail size={18} className="text-brand-red" />
                <span className="font-semibold theme-text-primary">
                  metrodevelopers26@gmail.com
                </span>
              </a>
            </div>
          </div>
        </section>


        {/* ===== Partners Section ===== */}
        <section ref={partnersRef} className={`py-8 sm:py-16 md:py-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div 
              className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${partnersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold theme-text-primary mb-3">
                Meet Our <span className="text-brand-red">Partners</span>
              </h2>
              <p className="theme-text-tertiary text-sm sm:text-lg max-w-2xl mx-auto">
                Connect directly with our leadership team for personalized assistance
              </p>
            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {partners.map((partner, index) => (
                <div 
                  key={index}
                  className={`group theme-bg-card backdrop-blur-sm p-5 sm:p-6 rounded-xl border theme-border hover:border-brand-red/50 transition-all duration-1000 theme-shadow-lg hover:shadow-brand-red/20 ${partnersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} group-hover:bg-brand-red/20 rounded-full flex items-center justify-center mb-4 sm:mb-5 mx-auto transition-colors`}>
                    <User className="theme-text-tertiary group-hover:text-brand-red transition-colors" size={28} />
                  </div>


                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold theme-text-primary mb-1 group-hover:text-brand-red transition-colors">
                      {partner.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} font-semibold mb-4 uppercase`}>
                      {partner.role}
                    </p>


                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                      {partner.phone && (
                        <a 
                          href={`tel:${partner.phone}`}
                          className="flex items-center justify-center gap-2 theme-text-secondary hover:text-brand-red transition-colors text-sm"
                        >
                          <Phone size={14} className="text-brand-red" />
                          <span className="font-medium">{partner.phone}</span>
                        </a>
                      )}


                      {partner.email && (
                        <a 
                          href={`mailto:${partner.email}`}
                          className="flex items-center justify-center gap-2 theme-text-secondary hover:text-brand-red transition-colors text-xs px-2"
                        >
                          <Mail size={14} className="text-brand-red flex-shrink-0" />
                          <span className="font-medium break-all">{partner.email}</span>
                        </a>
                      )}
                    </div>


                    {partner.whatsapp && (
                      <a
                        href={`https://wa.me/${partner.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-sm"
                      >
                        <FaWhatsapp size={18} />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ===== Location Section ===== */}
        <section ref={locationRef} className={`py-12 sm:py-16 md:py-20 ${theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-950 to-black' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div 
              className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${locationInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold theme-text-primary mb-3">
                Visit Us <span className="text-brand-red">Now</span>
              </h2>
              <p className="theme-text-tertiary text-sm sm:text-lg max-w-2xl mx-auto">
                Just click on the map below to find our location or get directions
              </p>
            </div>


            <div 
              className={`theme-bg-card backdrop-blur-sm rounded-xl border theme-border overflow-hidden transition-all duration-1000 delay-200 ${locationInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Building2 className="text-brand-red" size={22} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold theme-text-primary mb-2">METRO INDUSTRIAL PARK</h4>
                    <p className="theme-text-secondary text-sm sm:text-base">
                      Opp. Suvas Ind Estate, b/h Siya Logistics Park,<br />
                      Moraiya, Ahmedabad, Gujarat - 382213
                    </p>
                  </div>
                </div>
              </div>


              <div className="w-full h-64 sm:h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.97909554353!2d72.41748307531053!3d22.914141879249897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20industrial%20park%20moraiya!5e0!3m2!1sen!2sin!4v1767639082192!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Metro Industrial Park Location"
                ></iframe>
              </div>


              <div className={`p-4 sm:p-5 flex justify-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100/50'}`}>
                <a
                  href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-sm"
                >
                  <MapPin size={16} />
                  <span>Get Directions</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>


            <div 
              className={`grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 transition-all duration-1000 delay-400 ${locationInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className={`theme-bg-card backdrop-blur-sm p-5 sm:p-6 rounded-xl border theme-border`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Clock className="text-brand-red" size={22} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold theme-text-primary mb-3">Office Hours</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Monday - Sunday:</span>
                        <span className="theme-text-primary font-semibold">11:00 AM - 7:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className={`theme-bg-card backdrop-blur-sm p-5 sm:p-6 rounded-xl border theme-border`}>
                <h4 className="text-lg font-bold theme-text-primary mb-2">Need Immediate Help?</h4>
                <p className="theme-text-secondary mb-4 text-sm">
                  Contact our director directly for urgent inquiries
                </p>
                <a
                  href="tel:+916356776767"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm mb-2 w-full justify-center"
                >
                  <Phone size={18} />
                  <span>Call: +91 63567 76767</span>
                </a>
                <div className={`text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm my-2`}>or</div>
                <a
                  href="tel:+916356766767"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm w-full justify-center"
                >
                  <Phone size={18} />
                  <span>Call: +91 63567 66767</span>
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ===== Google Reviews Section ===== */}
        <section ref={reviewsRef} className={`py-12 sm:py-16 ${theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-950' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div 
              className={`mb-6 sm:mb-8 flex justify-center transition-all duration-1000 ${reviewsInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-red/20 rounded-full flex items-center justify-center">
                <Star size={40} className="text-brand-red fill-brand-red sm:w-12 sm:h-12" />
              </div>
            </div>
            
            <h3 
              className={`text-2xl sm:text-3xl md:text-4xl font-bold theme-text-primary mb-3 sm:mb-4 transition-all duration-1000 delay-100 ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Share Your <span className="text-brand-red">Experience</span>
            </h3>
            <p 
              className={`theme-text-tertiary text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Your feedback helps us improve and helps others find the perfect space for their business!
            </p>
            
            <a 
              href="https://g.page/r/CfbFhZSjMaH1EBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-1000 hover:scale-105 shadow-xl text-sm sm:text-base ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <Star size={20} className="fill-white" />
              <span>Leave a Google Review</span>
            </a>


            <div 
              className={`mt-8 sm:mt-10 flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm transition-all duration-1000 delay-400 ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span>•</span>
              <span>Trusted by businesses in Ahmedabad</span>
            </div>
          </div>
        </section>


        {/* ===== Floating Review Prompt ===== */}
        {showReviewPrompt && (
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up max-w-xs sm:max-w-sm">
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 relative border-2 border-brand-red/20">
              <button
                onClick={dismissPrompt}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={20} className="text-white fill-white sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">Enjoying our service?</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Leave us a review!</p>
                </div>
              </div>
              
              <a
                href="https://g.page/r/CfbFhZSjMaH1EBI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 sm:py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-sm"
                onClick={dismissPrompt}
              >
                Write a Review
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


export default ContactPage;
