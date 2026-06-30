// src/app/calculator/page.jsx
import { SITE_BASE_URL } from '../../data/seoRoutes';
import CalculatorPage from '../../pages/CalculatorPage';

export const metadata = {
  title: 'Industrial ROI Calculator | Moraiya Changodar Ahmedabad — Metro Industrial Park',
  description:
    'Calculate rental yield, capital appreciation, and total ROI for industrial sheds in Moraiya, Changodar, and Ahmedabad. Use Metro Industrial Park\'s free ROI calculator before buying or leasing.',
  keywords:
    'industrial shed roi calculator, industrial investment calculator ahmedabad, rental yield calculator changodar, warehouse roi moraiya, industrial property return calculator gujarat',
  alternates: { canonical: `${SITE_BASE_URL}/calculator` },
  openGraph: {
    title: 'Industrial ROI Calculator | Moraiya, Changodar, Ahmedabad — Metro Industrial Park',
    description: 'Free ROI calculator for industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad.',
    url: `${SITE_BASE_URL}/calculator`,
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
  return <CalculatorPage />;
}
