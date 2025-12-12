// src/pages/ContactPage.jsx
import React from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { contactPersons } from '../config/contactConfig';

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Get in touch with our team. We're here to help you find the perfect industrial space for your business.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactPersons.map((person, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-xl p-[2px] hover:scale-105 transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, #b3261e 0%, #2b2b2b 50%, #0a0a0a 100%)'
            }}
          >
            {/* Inner Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#050509] rounded-xl p-6 h-full">
              {/* Decorative gradient overlay */}
              <div 
                className="absolute inset-0 opacity-20 rounded-xl"
                style={{
                  background: 'radial-gradient(circle at top right, #b3261e 0%, transparent 60%)'
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-brand-grey">
                    <User className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {person.name}
                  </h3>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${person.number}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-grey group-hover/item:bg-brand-red transition-colors">
                      <Phone size={18} className="text-gray-400 group-hover/item:text-white" />
                    </div>
                    <span className="text-base">{person.number}</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${person.mail}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group/item"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-grey group-hover/item:bg-brand-red transition-colors">
                      <Mail size={18} className="text-gray-400 group-hover/item:text-white" />
                    </div>
                    <span className="text-base break-all">{person.mail}</span>
                  </a>
                </div>
              </div>

              {/* Gradient shine effect on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, #b3261e 50%, transparent 100%)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* General Contact Section */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-brand-grey/30 to-brand-dark border border-brand-grey">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Visit Our Office</h2>
          <p className="text-gray-300 mb-2">Metro Industrial Park</p>
          <p className="text-gray-400">123 Industrial Area, City Name - 400001</p>
          <p className="text-gray-400 mt-4">Monday - Saturday: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
