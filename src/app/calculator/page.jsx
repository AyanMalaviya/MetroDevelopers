import { SITE_BASE_URL } from '../../data/seoRoutes';
import { propertySchema, createBreadcrumbSchema } from '../../utils/schemas';
import CalculatorPage from '../../pages/CalculatorPage';

export const metadata = {
  title: 'Industrial Shed ROI Calculator | Metro Industrial Park',
  description:
    'Calculate ROI, rental yield, and capital appreciation for industrial sheds and warehouses in Moraiya, Changodar, Ahmedabad using the Metro Industrial Park investment calculator.',
  alternates: { canonical: `${SITE_BASE_URL}/calculator` },
  openGraph: {
    title: 'Industrial Shed ROI Calculator | Metro Industrial Park',
    description: 'Calculate ROI, rental yield, and capital appreciation for industrial sheds in Ahmedabad.',
    url: `${SITE_BASE_URL}/calculator`,
    images: [{ url: '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg', width: 1200, height: 630 }],
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'ROI Calculator', path: '/calculator' },
]);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([propertySchema, breadcrumb]) }}
      />
      <CalculatorPage />
    </>
  );
}
