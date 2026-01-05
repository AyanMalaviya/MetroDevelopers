import React from 'react';
import { MapPin, Calendar, Building2, CheckCircle, Users } from 'lucide-react';

const PastProjects = () => {
  const pastProjects = [
    {
      name: 'Shiv Industrial Estate',
      location: 'Moraiya, Ahmedabad',
      year: '2020-2021',
      area: '30,000 sq.ft',
      units: '8 Industrial Sheds',
      status: 'Fully Occupied',
      description: 'Premium industrial complex with modern amenities and strategic location. Successfully completed and delivered to satisfied clients.',
      highlights: [
        'High-ceiling warehouse units',
        '24/7 power backup',
        'Wide access roads',
        'Modern office spaces'
      ]
    },
    {
      name: 'Chavda Estate Development',
      location: 'Changodar, Ahmedabad',
      year: '2019-2020',
      area: '25,000 sq.ft',
      units: '6 Industrial Units',
      status: 'Completed',
      description: 'State-of-the-art industrial facility designed for manufacturing and logistics operations with excellent infrastructure.',
      highlights: [
        'Heavy-duty flooring',
        'Three-phase power',
        'Ample parking space',
        'Security systems'
      ]
    },
    {
      name: 'Moraiya Industrial Complex',
      location: 'Moraiya, Ahmedabad',
      year: '2018-2019',
      area: '40,000 sq.ft',
      units: '10 Warehouse Units',
      status: 'Operational',
      description: 'Large-scale industrial project catering to diverse business needs with comprehensive facilities and prime location advantages.',
      highlights: [
        'Multi-purpose units',
        'Loading docks',
        'Fire safety systems',
        'CCTV surveillance'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-brand-red">Legacy Projects</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            A proven track record of delivering exceptional industrial infrastructure across Ahmedabad. Our past projects stand as a testament to our commitment to quality and client satisfaction.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8 sm:space-y-12">
          {pastProjects.map((project, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-900 via-brand-grey to-gray-900 rounded-2xl border-2 border-gray-800 hover:border-brand-red transition-all duration-500 hover:shadow-2xl hover:shadow-brand-red/20 overflow-hidden"
            >
              <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 p-6 sm:p-8 md:p-10">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-brand-red/20 border border-brand-red/50 rounded-full">
                      <CheckCircle className="text-brand-red" size={16} />
                      <span className="text-xs sm:text-sm text-brand-red font-semibold">{project.status}</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors duration-300">
                      {project.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-brand-red" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-brand-red" />
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Key Highlights</h4>
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                      {project.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                          <CheckCircle size={16} className="text-brand-red flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-4">
                  <div className="bg-brand-dark/50 p-5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="text-brand-red" size={20} />
                      <span className="text-sm text-gray-400 font-medium">Total Area</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{project.area}</div>
                  </div>

                  <div className="bg-brand-dark/50 p-5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="text-brand-red" size={20} />
                      <span className="text-sm text-gray-400 font-medium">Units Delivered</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{project.units}</div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-red via-red-600 to-brand-red p-5 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">100%</div>
                      <div className="text-sm text-white/90 font-medium">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center bg-gradient-to-r from-gray-900 via-brand-grey to-gray-900 p-8 sm:p-12 rounded-2xl border border-gray-800">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Be Part of Our Success Story?
          </h3>
          <p className="text-gray-400 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Join the ranks of successful businesses that have trusted Metro Enterprise for their industrial space needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-brand-red/50"
          >
            <span>Contact Us Today</span>
            <CheckCircle size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PastProjects;