// src/app/site-map/page.jsx
import { SITE_BASE_URL } from '../../data/seoRoutes';
import SiteMapPage from '../../pages/SiteMapPage';

export const metadata = {
  title: 'Interactive Site Map | Metro Industrial Park — Moraiya, Changodar, Ahmedabad',
  description:
    'Explore the interactive site map of Metro Industrial Park in Moraiya, Changodar, Ahmedabad. View unit layout, available sheds for sale and rent, and campus infrastructure near NH 947 (Sarkhej–Bavla Highway).',
  keywords:
    'metro industrial park site map, industrial park layout moraiya, shed layout changodar, available units metro industrial park, industrial campus map ahmedabad',
  alternates: { canonical: `${SITE_BASE_URL}/site-map` },
  openGraph: {
    title: 'Interactive Site Map | Metro Industrial Park — Moraiya, Changodar, Ahmedabad',
    description: 'View the interactive layout and available units at Metro Industrial Park, Moraiya, Changodar, Ahmedabad.',
    url: `${SITE_BASE_URL}/site-map`,
    images: [{ url: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg', width: 1200, height: 630 }],
  },
  other: {
    'geo.region':    'IN-GJ',
    'geo.placename': 'Moraiya, Changodar, Ahmedabad, Gujarat',
    'geo.position':  '22.914141879249897;72.41748307531053',
    'ICBM':          '22.914141879249897, 72.41748307531053',
  },
};

export default function Page() {
  return <SiteMapPage />;
}
