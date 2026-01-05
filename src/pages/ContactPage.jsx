import React from 'react';
import { Mail, Phone, MapPin, User, MessageSquare, Building2, Clock, ExternalLink } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const ContactPage = () => {
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
      role: 'Partner',
      phone: '+91 96249 65017',
      whatsapp: '919624965017'
    },
    {
      name: 'Kaushar Kalyani',
      role: 'Partner',
      phone: '+91 99796 32986',
      whatsapp: '919979632986'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero Section with Email in Top Right */}
      <section className="relative bg-gradient-to-br from-brand-dark via-gray-900 to-brand-grey py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Email Badge - Top Right */}
        <div className="absolute top-4 right-4 sm:right-6 md:right-8 z-20">
          <a 
            href="mailto:metrodevelopers26@gmail.com"
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-brand-red/90 hover:bg-brand-red backdrop-blur-md rounded-full transition-all duration-300 hover:scale-105 shadow-lg border border-red-500/50"
          >
            <Mail size={16} className="text-white" />
            <span className="text-xs sm:text-sm font-semibold text-white hidden sm:inline">
              metrodevelopers26@gmail.com
            </span>
            <span className="text-xs font-semibold text-white sm:hidden">
              Email Us
            </span>
          </a>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 py-2 bg-brand-red/20 border border-brand-red/50 rounded-full backdrop-blur-sm">
            <MessageSquare className="text-brand-red" size={18} />
            <span className="text-sm text-brand-red font-semibold">Get In Touch</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-500 to-orange-500">Our Team</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to find your perfect industrial space? Our experienced team is here to guide you through every step.
          </p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our <span className="text-brand-red">Partners</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Connect directly with our leadership team for personalized assistance
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-brand-grey via-gray-800 to-brand-grey p-6 sm:p-8 rounded-2xl border-2 border-gray-700 hover:border-brand-red transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-red/20"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Partner Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-red/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-brand-red/30 transition-all duration-300 group-hover:scale-110 mx-auto">
                  <User className="text-brand-red" size={32} />
                </div>

                {/* Partner Details */}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 font-semibold mb-4 sm:mb-6 uppercase tracking-wider">
                    {partner.role}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    {/* Phone */}
                    <a 
                      href={`tel:${partner.phone}`}
                      className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group/phone"
                    >
                      <Phone size={16} className="text-brand-red group-hover/phone:scale-110 transition-transform" />
                      <span className="text-sm sm:text-base font-medium">{partner.phone}</span>
                    </a>

                    {/* Email (only for Amir) */}
                    {partner.email && (
                      <a 
                        href={`mailto:${partner.email}`}
                        className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group/email"
                      >
                        <Mail size={16} className="text-brand-red group-hover/email:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium break-all">{partner.email}</span>
                      </a>
                    )}
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${partner.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-brand-red/50"
                  >
                    <FaWhatsapp size={20} />
                    <span className="text-sm sm:text-base">WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section - Centered */}
      <section className="py-12 sm:py-16 md:py-20 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Address Card with Embedded Map */}
            <div className="bg-gradient-to-br from-brand-grey via-gray-800 to-brand-grey rounded-2xl border-2 border-gray-700 hover:border-brand-red transition-all duration-500 shadow-2xl overflow-hidden">
              {/* Address Info */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-brand-red" size={24} />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">METRO INDUSTRIAL PARK</h4>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      Opp. Suvas Ind Estate, b/h Siya Logistics Park,<br />
                      Moraiya, Ahmedabad,<br />
                      Gujarat - 382213
                    </p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full h-64 sm:h-80 lg:h-96 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.97909554353!2d72.41748307531053!3d22.914141879249897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9729d95d01c7%3A0xf5a131a39485c5f6!2sMetro%20industrial%20park%20moraiya!5e0!3m2!1sen!2sin!4v1767632260527!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Metro Industrial Park Location"
                ></iframe>
              </div>

              {/* Get Directions Button - Centered */}
              <div className="p-4 sm:p-6 flex justify-center">
                <a
                  href="https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-brand-red/50"
                >
                  <MapPin size={18} />
                  <span>Get Directions</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Office Hours & Quick Contact - Side by Side on Desktop */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-brand-grey via-gray-800 to-brand-grey p-6 sm:p-8 rounded-2xl border-2 border-gray-700 hover:border-brand-red transition-all duration-500 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-brand-red" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-3">Office Hours</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Monday - Saturday:</span>
                        <span className="text-white">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Sunday:</span>
                        <span className="text-brand-red font-semibold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-brand-red via-red-600 to-brand-red p-6 sm:p-8 rounded-2xl shadow-2xl">
                <h4 className="text-xl font-bold text-white mb-3">Need Immediate Assistance?</h4>
                <p className="text-white/90 mb-4 text-sm sm:text-base">
                  Contact our director directly for urgent inquiries
                </p>
                <a
                  href="tel:+919824235642"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Phone size={20} />
                  <span className="text-sm sm:text-base">Call: +91 98242 35642</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;