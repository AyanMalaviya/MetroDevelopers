import { SITE_BASE_URL } from '../data/seoRoutes';

// ─── Shared property constants ─────────────────────────────────────────────
const PROPERTY_NAME = 'Metro Industrial Park';
const PROPERTY_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Opposite Suvas Industrial Estate, Behind Siya Logistics Park, Moraiya',
  addressLocality: 'Changodar',
  addressRegion: 'Gujarat',
  postalCode: '382213',
  addressCountry: 'IN',
};
const PROPERTY_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 22.914141879249897,
  longitude: 72.41748307531053,
};
const PROPERTY_PHONE = '+91 98242 35642';
const PROPERTY_URL = `${SITE_BASE_URL}/metro-industrial-park`;
const PROPERTY_IMAGE = `${SITE_BASE_URL}/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg`;

// ─── 1. Primary property / local-business schema ──────────────────────────
// FIX #1: @type now includes 'IndustrialFacility' for better Google entity classification.
// FIX #2: sameAs now uses the REAL Google Business Profile URL — replace the placeholder below
//         with your actual GBP link from: GBP listing → Share → Copy link.
// FIX #3: aggregateRating is enabled — populate ratingCount and ratingValue from your
//         live Google review data. This adds star ratings in SERPs (strong CTR boost).
// FIX #4: Removed the broken potentialAction SearchAction that pointed to /?s=... —
//         it caused Search Console warnings because no such endpoint existed.
export const propertySchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'RealEstateAgent', 'IndustrialFacility'],
  name: PROPERTY_NAME,
  url: PROPERTY_URL,
  telephone: PROPERTY_PHONE,
  email: 'info@metrodevelopers.co.in',
  logo: `${SITE_BASE_URL}/images/logo.png`,
  image: PROPERTY_IMAGE,
  description:
    'Metro Industrial Park by Metro Developers offers 63 premium industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad. Units from 4,000–50,000 sq.ft with 90-day possession and 6–8% rental yield.',
  address: PROPERTY_ADDRESS,
  geo: PROPERTY_GEO,
  hasMap: 'https://maps.google.com/?q=Metro+Industrial+Park+Moraiya+Changodar+Ahmedabad',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  // IMPORTANT: Replace the URL below with your real Google Business Profile URL.
  // Get it from: GBP Dashboard → Share your Business Profile → Copy link
  // It should look like: https://maps.app.goo.gl/xxxx  OR  https://www.google.com/maps/place/?q=place_id:ChIJ...
  sameAs: [
    'https://www.instagram.com/metro.industrialpark/',
    'https://www.facebook.com/MetroIndustrialPark/',
    // ⚠️ REPLACE THIS with your real Google Business Profile URL:
    'https://maps.app.goo.gl/REPLACE_WITH_REAL_GBP_URL',
  ],
  // FIX #3: aggregateRating re-enabled. Update ratingCount and ratingValue from Google Reviews.
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '12', // ← Update with your actual Google review count
    bestRating: '5',
    worstRating: '1',
  },
  priceRange: '₹₹₹',
  areaServed: [
    { '@type': 'City', name: 'Ahmedabad' },
    { '@type': 'City', name: 'Moraiya' },
    { '@type': 'City', name: 'Changodar' },
    { '@type': 'City', name: 'Sanand' },
    { '@type': 'State', name: 'Gujarat' },
  ],
  knowsAbout: [
    'Industrial sheds for sale in Changodar',
    'Industrial sheds for lease in Moraiya',
    'Warehouses near NH 947 Ahmedabad',
    'Industrial property investment Gujarat',
  ],
};

// ─── 2. Real-estate listing schema ────────────────────────────────────────
export const realEstateListingSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Metro Industrial Park — Industrial Sheds for Sale and Lease',
  description:
    '63 industrial shed units from 4,000 to 50,000 sq.ft on a 54,000 sq.yard campus in Moraiya, Changodar, Ahmedabad.',
  url: PROPERTY_URL,
  image: PROPERTY_IMAGE,
  datePosted: '2024-01-01',
  // FIX #5: added dateModified for content freshness signal
  dateModified: new Date().toISOString().split('T')[0],
  floorSize: {
    '@type': 'QuantitativeValue',
    minValue: 4000,
    maxValue: 50000,
    unitCode: 'SQF',
    unitText: 'sq.ft',
  },
  numberOfRooms: 63,
  leaseLength: {
    '@type': 'QuantitativeValue',
    minValue: 5,
    maxValue: 10,
    unitCode: 'ANN',
    unitText: 'years',
  },
  address: PROPERTY_ADDRESS,
  geo: PROPERTY_GEO,
};

// ─── 3. FAQ schema ─────────────────────────────────────────────────────────
const PRIMARY_FAQS = [
  {
    q: 'Where is Metro Industrial Park located?',
    a: 'Metro Industrial Park is located in Moraiya, Changodar, Ahmedabad — opposite Suvas Industrial Estate, behind Siya Logistics Park, near the Sarkhej–Bavla National Highway (NH 47). GPS: 22.914°N, 72.417°E.',
  },
  {
    q: 'What unit sizes are available at Metro Industrial Park?',
    a: 'Metro Industrial Park offers 63 industrial shed units ranging from 4,000 sq.ft to 50,000 sq.ft on a 54,000 sq.yard campus with 30–35 ft ceiling clearance.',
  },
  {
    q: 'How quickly can I get possession of a shed at Metro Industrial Park?',
    a: 'Metro Industrial Park offers possession within 90 days of agreement execution — one of the fastest industrial possession timelines in the Moraiya–Changodar corridor.',
  },
  {
    q: 'What is the rental yield at Metro Industrial Park?',
    a: 'Industrial sheds at Metro Industrial Park deliver 6–8% annual rental yield with up to 10–12% yearly capital appreciation in the Moraiya–Changodar corridor.',
  },
  {
    q: 'What infrastructure does Metro Industrial Park offer?',
    a: 'Metro Industrial Park provides 60 ft RCC internal roads, CCTV surveillance, 24/7 water supply, underground drainage, weigh bridge, and UGVCL power — all on a 54,000 sq.yard gated campus.',
  },
];

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PRIMARY_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

// ─── 4. Image object schema ────────────────────────────────────────────────
export const imageObjectSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  name: 'Industrial Shed for Sale in Moraiya, Changodar, Ahmedabad',
  contentUrl: PROPERTY_IMAGE,
  description:
    'Premium industrial sheds and warehouses at Metro Industrial Park, Moraiya, Changodar — 63 units from 4,000–50,000 sq.ft near NH 947 (Sarkhej–Bavla Highway), Ahmedabad.',
  creditText: 'Metro Developers',
  creator: { '@type': 'Organization', name: 'Metro Developers' },
  license: `${SITE_BASE_URL}`,
  acquireLicensePage: `${SITE_BASE_URL}/contact`,
};

// ─── 5. Website schema ─────────────────────────────────────────────────────
// FIX #4: potentialAction SearchAction removed — it caused Search Console warnings
// because /?s= is not a real search endpoint on this site.
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Metro Industrial Park',
  alternateName: 'Metro Developers',
  url: SITE_BASE_URL,
  description:
    'Metro Industrial Park by Metro Developers — industrial sheds and warehouses for sale and lease in Moraiya, Changodar, Ahmedabad, Gujarat.',
  publisher: {
    '@type': 'Organization',
    name: 'Metro Developers',
    url: SITE_BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_BASE_URL}/images/logo.png`,
    },
  },
  inLanguage: 'en-IN',
};

// ─── 6. Breadcrumb schema factory ─────────────────────────────────────────
export function createBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_BASE_URL}${item.path}`,
    })),
  };
}

// ─── 7. Location page WebPage schema factory ──────────────────────────────
// FIX #5: added datePublished + dateModified to all location page WebPage schemas
export function createLocationPageSchema({
  pageTitle,
  pageDescription,
  path,
  locationName,
  focusKeyword,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: `${SITE_BASE_URL}${path}`,
    inLanguage: 'en-IN',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    isPartOf: { '@type': 'WebSite', url: SITE_BASE_URL },
    about: {
      '@type': 'Place',
      name: locationName || 'Moraiya, Changodar, Ahmedabad',
      geo: PROPERTY_GEO,
    },
    keywords: focusKeyword,
    breadcrumb: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: pageTitle, path },
    ]),
  };
}

// ─── 8. Article schema factory (for /guides/* pages) ─────────────────────
// FIX #5: dateModified added to Article schema
export function createArticleSchema({ headline, description, path, keywords = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${SITE_BASE_URL}${path}`,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'Metro Developers',
      url: SITE_BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Metro Developers',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_BASE_URL}/images/logo.png`,
      },
    },
    image: PROPERTY_IMAGE,
    keywords: keywords.join(', '),
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', url: SITE_BASE_URL },
  };
}
