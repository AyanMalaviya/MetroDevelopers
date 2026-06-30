// src/app/contact/page.jsx
import { SITE_BASE_URL } from '../../data/seoRoutes';
import ContactPage from '../../pages/ContactPage';

export const metadata = {
  title: 'Contact Metro Industrial Park | Industrial Sheds in Moraiya, Changodar, Ahmedabad',
  description:
    'Contact Metro Industrial Park for industrial sheds for sale and rent in Moraiya, Changodar, Ahmedabad. Call +91 98242 35642 or WhatsApp for unit availability, pricing, and site visit booking. Near NH 947 (Sarkhej–Bavla Highway).',
  keywords:
    'contact metro industrial park, industrial shed enquiry moraiya, industrial shed changodar contact, industrial property ahmedabad enquiry, warehouse for rent changodar contact, shed for sale moraiya contact',
  alternates: { canonical: `${SITE_BASE_URL}/contact` },
  openGraph: {
    title: 'Contact Metro Industrial Park | Moraiya, Changodar, Ahmedabad',
    description: 'Call or WhatsApp Metro Industrial Park for sheds for sale and rent in Moraiya, Changodar, Ahmedabad. +91 98242 35642.',
    url: `${SITE_BASE_URL}/contact`,
    images: [{ url: '/images/metro-industrial-park-office-changodar.jpg', width: 1200, height: 630 }],
  },
  other: {
    'geo.region':    'IN-GJ',
    'geo.placename': 'Moraiya, Changodar, Ahmedabad, Gujarat',
    'geo.position':  '22.914141879249897;72.41748307531053',
    'ICBM':          '22.914141879249897, 72.41748307531053',
  },
};

export default function Page() {
  return <ContactPage />;
}
