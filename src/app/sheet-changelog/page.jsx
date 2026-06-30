// src/app/sheet-changelog/page.jsx
import { SITE_BASE_URL } from '../../data/seoRoutes';
import SheetChangelogPage from '../../pages/SheetChangelogPage';

export const metadata = {
  title: 'Unit Availability Changelog | Metro Industrial Park — Moraiya, Changodar',
  description:
    'Latest unit availability updates for Metro Industrial Park in Moraiya, Changodar, Ahmedabad. Track which industrial sheds and warehouses are available for sale and rent in real time.',
  keywords:
    'metro industrial park availability, industrial shed availability moraiya, unit availability changodar, warehouse availability ahmedabad, shed for rent available',
  alternates: { canonical: `${SITE_BASE_URL}/sheet-changelog` },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Unit Availability Changelog | Metro Industrial Park',
    description: 'Latest availability updates for industrial sheds and warehouses at Metro Industrial Park, Moraiya, Changodar.',
    url: `${SITE_BASE_URL}/sheet-changelog`,
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
  return <SheetChangelogPage />;
}
