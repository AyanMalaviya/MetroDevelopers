// src/app/page.jsx — Home route
// Full metadata: targets rent + sale + lease + Moraiya + Changodar + Ahmedabad
import { SITE_BASE_URL } from '../data/seoRoutes';
import { propertySchema, realEstateListingSchema, websiteSchema } from '../utils/schemas';
import HomePage from '../pages/HomePage';

export const metadata = {
  title: 'Metro Industrial Park | Industrial Sheds for Sale & Rent in Moraiya, Changodar, Ahmedabad',
  description:
    'Metro Industrial Park — 63 industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad for sale and rent. 4,000–50,000 sq.ft, 30–35 ft height, 60 ft roads, 90-day possession, 6–8% rental yield. Near NH 947 (Sarkhej–Bavla Highway). Call +91 98242 35642.',
  keywords:
    'industrial sheds moraiya, industrial sheds changodar, industrial sheds ahmedabad, industrial shed for sale moraiya, industrial shed for rent changodar, warehouse for lease ahmedabad, industrial park moraiya changodar, shed for sale near nh 947, metro industrial park, metro developers',
  alternates: { canonical: SITE_BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Metro Industrial Park',
    title: 'Metro Industrial Park | Industrial Sheds for Sale & Rent in Moraiya, Changodar, Ahmedabad',
    description:
      '63 industrial sheds and warehouses for sale and rent in Moraiya, Changodar, Ahmedabad. 4,000–50,000 sq.ft, 90-day possession, 6–8% yield. Near NH 947.',
    url: SITE_BASE_URL,
    images: [{
      url: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
      width: 1200,
      height: 630,
      alt: 'Metro Industrial Park — industrial sheds for sale and rent in Moraiya, Changodar, Ahmedabad',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@metroindustrial',
    title: 'Metro Industrial Park | Sheds for Sale & Rent — Moraiya, Changodar, Ahmedabad',
    description: '63 industrial sheds and warehouses for sale and rent in Moraiya, Changodar, Ahmedabad. Near NH 947.',
    images: ['/images/metro-industrial-park-site-map-moraiya-gujarat.jpg'],
  },
  other: {
    'geo.region':    'IN-GJ',
    'geo.placename': 'Moraiya, Changodar, Ahmedabad, Gujarat',
    'geo.position':  '22.914141879249897;72.41748307531053',
    'ICBM':          '22.914141879249897, 72.41748307531053',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([propertySchema, realEstateListingSchema, websiteSchema]),
        }}
      />
      <HomePage />
    </>
  );
}
