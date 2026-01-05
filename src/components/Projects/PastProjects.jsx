// src/components/Projects/PastProjects.jsx
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
      description: 'Premium industrial complex with modern amenities. Successfully completed and delivered.',
      highlights: ['High-ceiling units', '24/7 power backup', 'Wide access roads', 'Modern offices']
    },
    {
      name: 'Chavda Estate Development',
      location: 'Changodar, Ahmedabad',
      year: '2019-2020',
      area: '25,000 sq.ft',
      units: '6 Industrial Units',
      status: 'Completed',
      description: 'State-of-the-art facility for manufacturing and logistics operations.',
      highlights: ['Heavy-duty flooring', 'Three-phase power', 'Ample parking', 'Security systems']
    },
    {
      name: 'Moraiya Industrial Complex',
      location: 'Moraiya, Ahmedabad',
      year: '2018-2019',
      area: '40,000 sq.ft',
      units: '10 Warehouse Units',
      status: 'Operational',
      description: 'Large-scale project catering to diverse business needs with comprehensive facilities.',
      highlights: ['Multi-purpose units', 'Loading docks', 'Fire safety', 'CCTV surveillance']
    }
  ];

  return (
    <div className="min-h-screen bg-black py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Our <span className="text-brand-red">Legacy Projects</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg max-w-3xl mx-auto">
            A proven track record of delivering exceptional industrial infrastructure
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {pastProjects.map((project, index) => (
            <div key={index} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 p-5 sm:p-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-gray-800 rounded-full text-xs text-green-400 font-semibold">
                      <CheckCircle size={14} />
                      {project.status}
                    </div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
                      {project.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-brand-red" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand-red" />
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {project.description}
                  </p>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-2">Key Highlights</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {project.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                          <CheckCircle size={14} className="text-brand-red flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                      <Building2 size={16} />
                      <span>Total Area</span>
                    </div>
                    <div className="text-xl font-bold text-white">{project.area}</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                      <Users size={16} />
                      <span>Units Delivered</span>
                    </div>
                    <div className="text-xl font-bold text-white">{project.units}</div>
                  </div>
                  <div className="bg-gradient-to-br from-brand-red to-red-700 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-xs text-white/90">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center bg-gray-900 p-6 sm:p-10 rounded-2xl border border-gray-800">
          <h3 className="text-xl sm:text-3xl font-bold text-white mb-3">
            Want to Be Part of Our Success Story?
          </h3>
          <p className="text-gray-400 text-sm sm:text-lg mb-6">
            Join successful businesses that trusted Metro Enterprise
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all">
            <span>Contact Us Today</span>
            <CheckCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PastProjects;
