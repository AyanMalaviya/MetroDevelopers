// src/utils/schemas.js

const SITE_URL = 'https://www.metrodevelopers.co.in';
const MAPS_URL = 'https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Ahmedabad';

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Opp. Suvas Ind Estate, b/h Siya Logistics Park',
  addressLocality: 'Moraiya',
  addressRegion: 'Gujarat',
  postalCode: '382213',
  addressCountry: 'IN',
};

const geoCoordinates = {
  '@type': 'GeoCoordinates',
  latitude: '22.914141879249897',
  longitude: '72.41748307531053',
};

const contactPoints = [
  {
    '@type': 'ContactPoint',
    contactType: 'director',
    telephone: '+919824235642',
    email: 'metrodevelopers26@gmail.com',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    areaServed: 'IN',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'director',
    telephone: '+919624965017',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    areaServed: 'IN',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+916356776767',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    areaServed: 'IN',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+916356766767',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    areaServed: 'IN',
  },
];

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Metro Enterprise',
  alternateName: 'Metro Developers',
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
};

export const propertySchema = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  '@id': `${SITE_URL}/#metro-enterprise`,
  name: 'Industrial Sheds and Warehouses in Moraiya, Changodar, Ahmedabad | Metro Enterprise',
  alternateName: 'Metro Enterprise Moraiya Changodar Ahmedabad',
  description:
    'Industrial sheds and warehouses for sale and lease in Moraiya, Changodar, and Ahmedabad. Unit sizes from 4,000 to 50,000 sq.ft with modern infrastructure and fast possession support.',
  url: SITE_URL,
  logo: `${SITE_URL}/MDLogoBGH.png`,
  image: `${SITE_URL}/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg`,
  telephone: '+919824235642',
  email: 'metrodevelopers26@gmail.com',
  address: postalAddress,
  geo: geoCoordinates,
  hasMap: MAPS_URL,
  areaServed: [
    { '@type': 'Place', name: 'Moraiya, Changodar' },
    { '@type': 'City', name: 'Ahmedabad' },
    { '@type': 'Place', name: 'Sanand' },
  ],
  contactPoint: contactPoints,
  openingHours: 'Mo-Su 10:00-19:00',
  priceRange: 'Contact for pricing',
  sameAs: [
    'https://www.facebook.com/metroindustrialpark1',
    'https://www.instagram.com/metro.industrialpark/',
  ],
};

export const realEstateListingSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  '@id': `${SITE_URL}/#primary-listing`,
  name: 'Industrial Sheds and Warehouses for Sale and Lease in Moraiya, Changodar, Ahmedabad',
  description:
    'Industrial sheds and warehouses near Sarkhej Bavla Highway with 30 to 35 ft clear height, 60 ft RCC roads, and rental yield potential of 6 to 8%.',
  url: SITE_URL,
  provider: { '@id': `${SITE_URL}/#metro-enterprise` },
  address: postalAddress,
  geo: geoCoordinates,
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    availabilityStarts: '2026-01-01',
    priceCurrency: 'INR',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      valueAddedTaxIncluded: false,
      description: 'Contact for current sale and lease pricing.',
    },
    eligibleRegion: {
      '@type': 'AdministrativeArea',
      name: 'Ahmedabad, Gujarat, India',
    },
    seller: { '@id': `${SITE_URL}/#metro-enterprise` },
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '30 to 35 ft clear height', value: true },
    { '@type': 'LocationFeatureSpecification', name: '60 ft RCC internal roads', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24x7 water supply', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'CCTV and security guards', value: true },
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Expected rental yield', value: '6-8%' },
    { '@type': 'PropertyValue', name: 'Expected annual appreciation', value: 'up to 10-12%' },
    { '@type': 'PropertyValue', name: 'Combined potential return', value: '16-20%' },
  ],
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the price of industrial sheds in Moraiya, Ahmedabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Industrial sheds at Metro Industrial Park in Moraiya are available for sale and lease. Contact us at +91 98242 35642 for current pricing and customised unit options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sizes are available at Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Units range from 4,000 sq.ft to 50,000 sq.ft across 63 sheds in a 54,000 sq.yard park in Moraiya, Changodar.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does possession take at Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Possession is available within 90 days of booking at Metro Industrial Park, Moraiya.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the expected ROI on industrial sheds in Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rental yield is 6-8%, yearly appreciation can add up to 10-12%, and the combined potential is 16-20% for industrial sheds and warehouses at Metro Industrial Park, Moraiya, Ahmedabad.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is RCC construction available at Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'RCC construction is not standard but is available on request with additional charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Metro Industrial Park located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad, Gujarat - opposite Suvas Industrial Estate, behind Siya Logistics Park, near the Sarkhej Bavla Highway.',
      },
    },
    {
      '@type': 'Question',
      name: 'What amenities are available at Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The park offers 24x7 water supply, CCTV surveillance, security guards, a dedicated weigh bridge, 60 ft internal roads, waste management, and high ceilings of 30-35 feet.',
      },
    },
  ],
};

export const imageObjectSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Metro Industrial Park - Industrial Sheds and Warehouses Moraiya Ahmedabad',
  description:
    'Photo gallery of Metro Industrial Park, 63 industrial sheds for sale and lease in Moraiya, Changodar, Ahmedabad.',
  url: `${SITE_URL}/metro-industrial-park`,
  image: [
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg`,
      name: 'Industrial Shed for Sale in Moraiya Ahmedabad',
      description:
        'State-of-the-art industrial sheds with high ceilings of 30-35 ft at Metro Industrial Park, Moraiya.',
      width: 1920,
      height: 1080,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/warehouse-unit-lease-changodar-ahmedabad.jpg`,
      name: 'Warehouse Unit Available for Lease near Changodar Ahmedabad',
      description: 'Spacious warehouse units for lease at Metro Industrial Park, Changodar, Ahmedabad.',
      width: 1920,
      height: 1080,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-entrance-security-moraiya.jpg`,
      name: 'Metro Industrial Park Entrance with 24x7 Security - Moraiya',
      description:
        'Professional park entrance with 24/7 CCTV surveillance and security guards at Metro Industrial Park.',
      width: 1920,
      height: 1080,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/60ft-road-metro-industrial-park-ahmedabad.jpg`,
      name: '60ft Wide Internal Road at Metro Industrial Park Ahmedabad',
      description: '60 feet wide RCC road inside Metro Industrial Park, Moraiya, engineered for heavy-duty vehicles.',
      width: 1920,
      height: 1080,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-site-map-moraiya-gujarat.jpg`,
      name: 'Metro Industrial Park Aerial Site Map - Moraiya Gujarat',
      description: 'Drone view site map of Metro Industrial Park in Moraiya, Changodar, Ahmedabad, Gujarat.',
      width: 1920,
      height: 1080,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-office-changodar.jpg`,
      name: 'Metro Industrial Park Office - Changodar Ahmedabad',
      description: 'Modern office facility inside Metro Industrial Park, Changodar, Ahmedabad.',
      width: 1920,
      height: 1080,
    },
  ],
};

export const createBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const createArticleSchema = ({
  headline,
  description,
  path,
  datePublished = '2026-04-12',
  dateModified = '2026-04-12',
  keywords = [],
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  description,
  mainEntityOfPage: `${SITE_URL}${path}`,
  datePublished,
  dateModified,
  inLanguage: 'en-IN',
  keywords,
  author: {
    '@type': 'Organization',
    name: 'Metro Enterprise',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Metro Enterprise',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/MDLogoBGH.png`,
    },
  },
});

export const createLocationPageSchema = ({
  pageTitle,
  pageDescription,
  path,
  locationName,
  focusKeyword,
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageTitle,
  description: pageDescription,
  url: `${SITE_URL}${path}`,
  inLanguage: 'en-IN',
  about: [
    {
      '@type': 'Place',
      name: locationName,
      geo: geoCoordinates,
    },
    {
      '@type': 'Thing',
      name: focusKeyword,
    },
  ],
  isPartOf: {
    '@id': `${SITE_URL}/#website`,
  },
});