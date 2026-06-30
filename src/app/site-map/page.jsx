import { SITE_BASE_URL } from '../../data/seoRoutes';
import { propertySchema, createBreadcrumbSchema } from '../../utils/schemas';
import SiteMapPage from '../../pages/SiteMapPage';

export const metadata = {
  title: 'Industrial Shed Site Map & Live Availability | Metro Industrial Park',
  description:
    'Check industrial shed and warehouse unit availability in Moraiya, Changodar, and Ahmedabad with the live interactive site map from Metro Industrial Park.',
  alternates: { canonical: `${SITE_BASE_URL}/site-map` },
  openGraph: {
    title: 'Industrial Shed Site Map & Live Availability | Metro Industrial Park',
    description: 'Live availability map for industrial sheds and warehouses at Metro Industrial Park, Moraiya.',
    url: `${SITE_BASE_URL}/site-map`,
    images: [{ url: '/images/metro-industrial-park-site-plan-moraiya.jpg', width: 1200, height: 630 }],
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Site Map', path: '/site-map' },
]);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([propertySchema, breadcrumb]) }}
      />
      <SiteMapPage />
    </>
  );
}
