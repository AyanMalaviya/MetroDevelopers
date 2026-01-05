import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, TrendingUp, Shield, Users, Zap, ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const HomePage = () => {
  const projects = [
    {
      id: 1,
      name: 'Metro Industrial Park',
      location: 'Moraiya, Changodar',
      area: '50,000+ sq.ft',
      units: '15+ Industrial Sheds',
      image: '/images/2shed.jpg',
      status: 'Available',
      link: '/projects'
    },
    {
      id: 2,
      name: 'Metro Arcade',
      location: 'Main Road, Moraiya',
      area: '80,000 sq.ft',
      units: '60+ Commercial Shops',
      image: '/images/arcade-top.jpeg',
      status: 'Leasing',
      link: '/projects'
    }
  ];

  const features = [
    {
      icon: <Building2 size={32} />,
      title: 'Prime Locations',
      description: 'Strategic positioning in Ahmedabad\'s industrial corridors'
    },
    {
      icon: <Shield size={32} />,
      title: 'Quality Construction',
      description: 'High-grade materials and modern building standards'
    },
    {
      icon: <Zap size={32} />,
      title: 'Modern Amenities',
      description: '24/7 power backup, security, and essential facilities'
    },
    {
      icon: <Users size={32} />,
      title: 'Client-Focused',
      description: 'Personalized service and flexible lease terms'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Sq.ft Developed' },
    { value: '15+', label: 'Industrial Units' },
    { value: '100%', label: 'Client Satisfaction' },
    { value: '10+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - ZOOMED AND CROPPED */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/hero-bg.jpg')",
            backgroundSize: '140%',
            backgroundPosition: 'center center'
          }}
        >
          {/* Lighter Overlay */}
          <div className="absolute inset-0 bg-black/30 sm:bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full">
            <Building2 className="text-brand-red" size={18} />
            <span className="text-sm text-white font-semibold">Industrial & Commercial Spaces</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-2xl">
            Premium Infrastructure for <br />
            <span className="text-brand-red">Growing Businesses</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-lg">
            Modern industrial parks and commercial spaces strategically located in Ahmedabad. 
            Built for efficiency, designed for success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <span>Explore Projects</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="https://wa.me/919824235642"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/50 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FaWhatsapp size={20} />
              <span>Contact Us</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-12 sm:mt-16">
            <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">50,000+</div>
              <div className="text-xs sm:text-sm text-white/80">Sq.ft Available</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">15+</div>
              <div className="text-xs sm:text-sm text-white/80">Industrial Units</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
              <div className="text-2xl sm:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-xs sm:text-sm text-white/80">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/60" size={32} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-brand-red">Metro Enterprise</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              We deliver world-class industrial and commercial infrastructure with unmatched quality and service
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-white group-hover:text-brand-red transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 sm:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Featured <span className="text-brand-red">Projects</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
              Explore our premium industrial and commercial developments
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Link 
                key={project.id}
                to={project.link}
                className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-red rounded-full text-white text-xs font-semibold">
                    {project.status}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors">
                    {project.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={16} className="text-brand-red" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Building2 size={16} className="text-brand-red" />
                      <span>{project.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <CheckCircle size={16} className="text-brand-red" />
                      <span>{project.units}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-brand-red font-semibold">
                    <span>View Details</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold rounded-lg transition-all"
            >
              <span>View All Projects</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-800">
                <div className="text-4xl sm:text-5xl font-bold text-brand-red mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Find Your <span className="text-brand-red">Perfect Space?</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10">
            Contact us today to discuss your requirements and schedule a site visit
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/919824235642"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              <FaWhatsapp size={20} />
              <span>WhatsApp Us</span>
            </a>
            
            <a 
              href="tel:+919824235642"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-700 hover:border-gray-600 text-white font-bold rounded-lg transition-all"
            >
              <Phone size={20} />
              <span>Call: +91 98242 35642</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;