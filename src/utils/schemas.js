// src/utils/schemas.js
// Central schema repository for Metro Industrial Park.
// All structured data follows schema.org vocabulary for Google Rich Results.

const SITE_URL = 'https://www.metrodevelopers.co.in';
const MAPS_URL = 'https://maps.google.com/?cid=17699482589183985142';

export const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Behind Siya Industrial Park, Opp. Suvas Industrial Park',
  addressLocality: 'Moraiya',
  addressRegion: 'Gujarat',
  postalCode: '382213',
  addressCountry: 'IN',
};

export const geoCoordinates = {
  '@type': 'GeoCoordinates',
  latitude: '22.914141879249897',
  longitude: '72.41748307531053',
};

// ─── Opening hours — Mon-Sun 11:00–19:00 ──────────────────────────────────────
const openingHoursSpec = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: [
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
  ],
  opens: '11:00',
  closes: '19:00',
};

export const contactPoints = [
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+919824235642',
    email: 'metrodevelopers26@gmail.com',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    hoursAvailable: openingHoursSpec,
    areaServed: 'IN',
  },
  {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+916356766767',
    email: 'metroenterprise1985@gmail.com',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
    hoursAvailable: openingHoursSpec,
    areaServed: 'IN',
  },
];

// ─── Person schemas for directors (E-E-A-T trust signal) ─────────────────────
export const directorSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#amir-malaviya`,
    name: 'Amir Malaviya',
    jobTitle: 'Director',
    worksFor: { '@id': `${SITE_URL}/#metro-enterprise` },
    telephone: '+919824235642',
    email: 'metrodevelopers26@gmail.com',
    url: `${SITE_URL}/contact`,
    image: `${SITE_URL}/images/amir.png`,
    sameAs: ['https://www.instagram.com/metro.industrialpark/'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#nazim-kazani`,
    name: 'Nazim Kazani',
    jobTitle: 'Director',
    worksFor: { '@id': `${SITE_URL}/#metro-enterprise` },
    telephone: '+916356766767',
    email: 'metroenterprise1985@gmail.com',
    url: `${SITE_URL}/contact`,
    image: `${SITE_URL}/images/nazim.png`,
  },
];

// ─── Website Schema ────────────────────────────────────────────────────────────
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Metro Industrial Park',
  alternateName: ['Metro Developers', 'Metro Enterprise'],
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ─── Homepage WebPage Schema ───────────────────────────────────────────────────
// Gives Google explicit dateModified for freshness scoring.
// isPartOf links to WebSite; about links to the LocalBusiness entity.
export const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/#webpage`,
  name: 'Industrial Sheds for Sale & Lease in Moraiya, Changodar, Ahmedabad | Metro Industrial Park',
  description:
    'Premium industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad. 4,000–50,000 sq.ft units. 6–8% rental yield. 60 ft roads, CCTV, 24x7 water. Call +91 98242 35642.',
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#metro-enterprise` },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    contentUrl: `${SITE_URL}/images/metro-industrial-park-entrance-dawn.jpg`,
    name: 'Metro Industrial Park entrance at dawn',
    description: 'Metro Industrial Park entrance — industrial sheds for sale and lease in Moraiya, Ahmedabad',
    width: 1600,
    height: 900,
  },
  keywords: [
    'industrial sheds moraiya',
    'industrial park changodar',
    'warehouse for rent ahmedabad',
    'warehouse for sale ahmedabad',
    'industrial shed for rent changodar',
    'industrial shed for sale changodar',
    'GIDC shed ahmedabad',
    'industrial property investment gujarat',
    'metro industrial park',
  ].join(', '),
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '[aria-label]'],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    ],
  },
};

// ─── Primary LocalBusiness + RealEstateAgent Schema ───────────────────────────
export const propertySchema = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  '@id': `${SITE_URL}/#metro-developers`,
  name: 'Metro Industrial Park',
  alternateName: 'Metro Developers Moraiya Changodar Ahmedabad',
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
    {
      '@type': 'GeoCircle',
      geoMidpoint: geoCoordinates,
      geoRadius: '25000',
    },
    { '@type': 'Place', name: 'Moraiya' },
    { '@type': 'Place', name: 'Changodar' },
    { '@type': 'City', name: 'Ahmedabad' },
    { '@type': 'Place', name: 'Sanand' },
    { '@type': 'Place', name: 'Bavla' },
  ],
  contactPoint: contactPoints,
  employee: [
    { '@id': `${SITE_URL}/#amir-malaviya` },
    { '@id': `${SITE_URL}/#nazim-kazani` },
  ],
  openingHours: 'Mo-Su 11:00-19:00',
  openingHoursSpecification: openingHoursSpec,
  priceRange: 'Contact for pricing',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Bank Transfer, Cheque',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
  foundingDate: '2020',
  slogan: 'Premium Industrial Spaces in Moraiya, Changodar, Ahmedabad',
  sameAs: [
    'https://www.instagram.com/metro.industrialpark/',
    'https://www.facebook.com/metroindustrialpark1',
    MAPS_URL,
    'https://g.page/r/CfbFhZSjMaH1EBI',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '5',
  },
};

// ─── RealEstateListing Schema ─────────────────────────────────────────────────
export const realEstateListingSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  '@id': `${SITE_URL}/#primary-listing`,
  name: 'Industrial Sheds and Warehouses for Sale and Lease in Moraiya, Changodar, Ahmedabad',
  description:
    'Industrial sheds and warehouses near NH 47 (Sarkhej Bavla Highway) with 30 to 35 ft clear height, 60 ft RCC roads, and rental yield potential of 6 to 8%.',
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
  floorSize: {
    '@type': 'QuantitativeValue',
    minValue: 4000,
    maxValue: 50000,
    unitCode: 'FTK',
    unitText: 'square feet',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '30 to 35 ft clear height', value: true },
    { '@type': 'LocationFeatureSpecification', name: '60 ft RCC internal roads', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24x7 water supply', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'CCTV and security guards', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Weigh bridge on-site', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Underground drainage', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Waste management system', value: true },
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Expected rental yield', value: '6-8%' },
    { '@type': 'PropertyValue', name: 'Expected annual appreciation', value: 'up to 10-12%' },
    { '@type': 'PropertyValue', name: 'Combined potential return', value: '16-20%' },
    { '@type': 'PropertyValue', name: 'Number of units', value: '63' },
    { '@type': 'PropertyValue', name: 'Total park area', value: '54000 sq.yards' },
    { '@type': 'PropertyValue', name: 'Possession timeline', value: '90 days' },
  ],
};

// ─── FAQ Schema ───────────────────────────────────────────────────────────────
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
        text: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad, Gujarat — behind Siya Industrial Park, opposite Suvas Industrial Park, near NH 47 (Sarkhej Bavla Highway).',
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
    {
      '@type': 'Question',
      name: 'Are industrial sheds available for lease in Changodar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Metro Industrial Park in Moraiya, Changodar offers industrial sheds and warehouses on both sale and long-term lease with 5–10 year agreements and annual escalation clauses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far is Metro Industrial Park from NH 47?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Metro Industrial Park in Moraiya is directly accessible from the Sarkhej–Bavla National Highway (NH 47), one of Ahmedabad's primary industrial freight corridors, within a few minutes drive.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I follow Metro Industrial Park on Instagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Follow @metro.industrialpark on Instagram for the latest available units, site updates, construction progress, and property availability at Metro Industrial Park, Moraiya.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum shed size available at Metro Industrial Park?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The minimum industrial shed size available at Metro Industrial Park, Moraiya is 4,000 sq.ft — suitable for small manufacturing, packaging, and warehousing operations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Metro Industrial Park near Sanand GIDC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Metro Industrial Park in Moraiya is located within a short drive of Sanand GIDC and Bavla industrial areas, making it accessible to suppliers and logistics partners across the Ahmedabad industrial belt.',
      },
    },
  ],
};

// ─── Image Gallery Schema ─────────────────────────────────────────────────────
export const imageObjectSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Metro Industrial Park — Industrial Sheds and Warehouses Gallery',
  description: 'Photo gallery of Metro Industrial Park in Moraiya, Changodar, Ahmedabad. Includes unit interiors, roads, entrance, and site plan.',
  url: `${SITE_URL}/metro-industrial-park`,
  image: [
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg`,
      name: 'Industrial Shed for Sale Moraiya Ahmedabad',
      description: 'Industrial shed available for sale at Metro Industrial Park, Moraiya, Changodar, Ahmedabad.',
      width: 1200,
      height: 800,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/60ft-road-metro-industrial-park-ahmedabad.jpg`,
      name: '60ft RCC Road Metro Industrial Park',
      description: 'Wide 60ft RCC internal road inside Metro Industrial Park for heavy vehicle access.',
      width: 1200,
      height: 800,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-site-map-moraiya-gujarat.jpg`,
      name: 'Metro Industrial Park Site Map Moraiya Gujarat',
      description: 'Aerial site plan of Metro Industrial Park showing all 63 industrial units in Moraiya, Gujarat.',
      width: 1200,
      height: 800,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/warehouse-unit-lease-changodar-ahmedabad.jpg`,
      name: 'Warehouse Unit for Lease Changodar Ahmedabad',
      description: 'Large warehouse unit available for lease in Changodar, Ahmedabad at Metro Industrial Park.',
      width: 1200,
      height: 800,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-entrance-security-moraiya.jpg`,
      name: 'Metro Industrial Park Entrance Security Moraiya',
      description: 'Secured entrance gate with CCTV and 24/7 security at Metro Industrial Park, Moraiya.',
      width: 1200,
      height: 800,
    },
    {
      '@type': 'ImageObject',
      contentUrl: `${SITE_URL}/images/metro-industrial-park-office-changodar.jpg`,
      name: 'Metro Industrial Park Office Changodar',
      description: 'Office and inquiry centre at Metro Industrial Park, Changodar, Ahmedabad.',
      width: 1200,
      height: 800,
    },
  ],
};

// ─── Social Presence Schema ───────────────────────────────────────────────────
export const socialProfileSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Metro Industrial Park',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/MDLogoBGH.png`,
    width: 200,
    height: 200,
  },
  contactPoint: contactPoints,
  address: postalAddress,
  sameAs: [
    'https://www.instagram.com/metro.industrialpark/',
    'https://www.facebook.com/metroindustrialpark1',
    MAPS_URL,
    'https://g.page/r/CfbFhZSjMaH1EBI',
  ],
};

// ─── Helper: BreadcrumbList ───────────────────────────────────────────────────
export const createBreadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${SITE_URL}${crumb.path}`,
  })),
});

// ─── Helper: LocationPage Schema ──────────────────────────────────────────────
export const createLocationPageSchema = ({ pageTitle, pageDescription, path, locationName, focusKeyword }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}${path}#webpage`,
  name: pageTitle,
  description: pageDescription,
  url: `${SITE_URL}${path}`,
  inLanguage: 'en-IN',
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#metro-enterprise` },
  keywords: focusKeyword,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.speakable'],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: locationName, item: `${SITE_URL}${path}` },
    ],
  },
});

// ─── Helper: Article / BlogPosting Schema ────────────────────────────────────
export const createArticleSchema = ({ headline, description, path, keywords = [] }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${SITE_URL}${path}#article`,
  headline,
  description,
  url: `${SITE_URL}${path}`,
  inLanguage: 'en-IN',
  keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  publisher: { '@id': `${SITE_URL}/#metro-enterprise` },
  author: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#metro-enterprise`,
    name: 'Metro Industrial Park',
    url: SITE_URL,
  },
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/metro-industrial-park-site-map-moraiya-gujarat.jpg`,
    width: 1200,
    height: 800,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${path}`,
  },
  about: {
    '@type': 'Thing',
    name: 'Industrial Real Estate in Ahmedabad',
    description: 'Industrial sheds, warehouses, and investment property in Moraiya, Changodar, Ahmedabad, Gujarat.',
  },
});


// ─── Metro Industrial Estate Schemas (Plots — "Build Your Own Shed") ────────
export const metroEstateSchema = {
  '@context': 'https://schema.org',
  '@type': ['Place', 'RealEstateAgent', 'LocalBusiness'],
  '@id': `${SITE_URL}/#metro-industrial-estate`,
  name: 'Metro Industrial Estate',
  alternateName: ['Metro Industrial Estate Moraiya Changodar', 'Metro Estate Industrial Plots'],
  description:
    'Clear-title industrial plots for "Build Your Own Shed" opposite Metro Industrial Park in Moraiya, Changodar, Ahmedabad. Features 24/7 security, wide heavy-duty RCC roads, dedicated water, drainage, and industrial power infrastructure.',
  url: `${SITE_URL}/metro-industrial-estate`,
  telephone: '+919824235642',
  email: 'metrodevelopers26@gmail.com',
  address: postalAddress,
  geo: geoCoordinates,
  hasMap: MAPS_URL,
  openingHoursSpecification: openingHoursSpec,
  parentOrganization: { '@id': `${SITE_URL}/#metro-enterprise` },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Build Your Own Shed Customization', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Gated Security and CCTV Surveillance', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wide Heavy-Duty RCC Internal Roads', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Industrial Water Supply', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Underground Drainage System', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'High-Tension Power Provisions', value: true },
    { '@type': 'LocationFeatureSpecification', name: '100% Clear Title & Non-Agricultural (NA) Land', value: true },
  ],
};

export const metroEstateListingSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  '@id': `${SITE_URL}/#metro-estate-listing`,
  name: 'Industrial Plots for Sale — Build Your Own Shed in Moraiya, Changodar',
  description:
    'Premium clear-title industrial plots at Metro Industrial Estate, Moraiya, Changodar. Build your customized industrial shed or warehouse with developer-provided 24/7 security, heavy-duty RCC roads, water, drainage, and power.',
  url: `${SITE_URL}/metro-industrial-estate`,
  provider: { '@id': `${SITE_URL}/#metro-enterprise` },
  address: postalAddress,
  geo: geoCoordinates,
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'INR',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      valueAddedTaxIncluded: false,
      description: 'Contact for current plot rates and custom parcel configurations.',
    },
    eligibleRegion: {
      '@type': 'AdministrativeArea',
      name: 'Ahmedabad, Gujarat, India',
    },
    seller: { '@id': `${SITE_URL}/#metro-enterprise` },
  },
  floorSize: {
    '@type': 'QuantitativeValue',
    minValue: 2800,
    maxValue: 25000,
    unitCode: 'FTK',
    unitText: 'square feet',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Build Your Own Shed layout freedom', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Gated Security & CCTV surveillance', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Heavy-duty RCC internal roads', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Dedicated industrial water connections', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Underground industrial drainage network', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'High-tension power line connectivity', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Clear Title with Immediate Registration', value: true },
  ],
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Project Type', value: 'Industrial Plots / Land' },
    { '@type': 'PropertyValue', name: 'Concept', value: 'Build Your Own Shed' },
    { '@type': 'PropertyValue', name: 'Total Plots', value: '23' },
    { '@type': 'PropertyValue', name: 'Plot Area Range', value: '312 to 1,930 sq.yards' },
    { '@type': 'PropertyValue', name: 'Location', value: 'Opp. Metro Industrial Park, Moraiya, Changodar' },
  ],
};

export const metroEstateFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Metro Industrial Estate in Moraiya, Changodar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Metro Industrial Estate is an industrial plotting project located directly opposite Metro Industrial Park in Moraiya, Changodar, Ahmedabad. It provides clear-title industrial plots where businesses can "Build Your Own Shed" with ready developer infrastructure like 24/7 security and wide RCC roads.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does "Build Your Own Shed" mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '"Build Your Own Shed" allows clients to purchase an industrial plot and construct their own customized factory, warehouse, or workshop tailored to their exact operational needs (custom clear height up to 35-40 ft, specific crane capacities, heavy machine foundations, dock levelers, or custom office layouts).',
      },
    },
    {
      '@type': 'Question',
      name: 'What facilities are provided at Metro Industrial Estate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Metro Developers provides comprehensive estate infrastructure including 24/7 gated security with CCTV surveillance, wide heavy-duty RCC internal roads designed for container trucks, dedicated industrial water supply, underground drainage, and electrical power connectivity provisions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What plot sizes are available at Metro Industrial Estate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Plots range from approximately 312 sq.yards up to 1,930 sq.yards across Block A, Block B, and Block C. Multiple adjacent plots can also be combined for large industrial setups.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the industrial plots clear title and legally approved?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all plots at Metro Industrial Estate have 100% clear legal titles, Non-Agricultural (NA) industrial zoning approval, and are ready for immediate sale deed registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Metro Industrial Estate located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is situated directly opposite Metro Industrial Park in Moraiya, Changodar, Ahmedabad, minutes away from the Sarkhej-Bavla National Highway (NH 47) and close to Sanand GIDC.',
      },
    },
  ],
};
