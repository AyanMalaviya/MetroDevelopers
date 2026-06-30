// src/app/metro-industrial-park/page.jsx
// Primary money page — industrial sheds for sale and rent in Moraiya, Changodar, Ahmedabad
import { SITE_BASE_URL } from '../../data/seoRoutes';
import {
  propertySchema,
  realEstateListingSchema,
  faqSchema,
  imageObjectSchema,
  websiteSchema,
} from '../../utils/schemas';
import MetroIndustrialParkPage from '../../pages/ContactPage';

export const metadata = {
  title: 'Metro Industrial Park | Industrial Sheds for Sale & Rent in Moraiya, Changodar',
  description:
    'Metro Industrial Park, Moraiya, Changodar, Ahmedabad — 63 industrial sheds and warehouses for sale and rent. 4,000–50,000 sq.ft, 30–35 ft height, 60 ft RCC roads, 24/7 CCTV, 90-day possession, 6–8% rental yield. Near NH 947 (Sarkhej–Bavla Highway). Call +91 98242 35642.',
  keywords:
    'metro industrial park, industrial sheds moraiya, industrial sheds changodar, industrial shed for sale moraiya, industrial shed for rent moraiya, industrial shed for lease changodar, warehouse moraiya ahmedabad, industrial property changodar ahmedabad, shed for sale near nh 947, factory shed moraiya',
  alternates: { canonical: `${SITE_BASE_URL}/metro-industrial-park` },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Metro Industrial Park',
    title: 'Metro Industrial Park | Industrial Sheds for Sale & Rent in Moraiya, Changodar',
    description:
      '63 industrial sheds and warehouses for sale and rent in Moraiya, Changodar, Ahmedabad. 4,000–50,000 sq.ft, 90-day possession, 6–8% yield. Near NH 947.',
    url: `${SITE_BASE_URL}/metro-industrial-park`,
    images: [{
      url: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg',
      width: 1200,
      height: 630,
      alt: 'Industrial sheds for sale and rent in Moraiya, Changodar, Ahmedabad — Metro Industrial Park',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@metroindustrial',
    title: 'Metro Industrial Park | Sheds for Sale & Rent — Moraiya, Changodar',
    description: '63 industrial sheds for sale and rent in Moraiya, Changodar, Ahmedabad. Near NH 947.',
    images: ['/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg'],
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
          __html: JSON.stringify([propertySchema, realEstateListingSchema, faqSchema, imageObjectSchema, websiteSchema]),
        }}
      />
      <MetroIndustrialParkPage />
    </>
  );
}
