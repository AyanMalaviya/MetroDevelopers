import { notFound } from 'next/navigation';
import { SITE_BASE_URL } from '../../data/seoRoutes';
import { propertySchema, realEstateListingSchema, faqSchema, imageObjectSchema, websiteSchema } from '../../utils/schemas';
import ContactPage from '../../pages/ContactPage';

// Metro Industrial Park = the primary money page
// Re-exporting ContactPage only for the /metro-industrial-park route which renders project details.
// Actual ContactPage lives at /contact.
import HomePage from '../../pages/HomePage';

// This is the primary project page – it uses HomePage layout but for
// /metro-industrial-park slug. In practice the component that renders
// the metro-industrial-park content should be imported here.
// For now we defer to the existing page component used for this route.
import MetroIndustrialParkPage from '../../pages/ContactPage';

export const metadata = {
  title: 'Metro Industrial Park | Industrial Sheds & Warehouses in Moraiya, Changodar',
  description:
    'Explore Metro Industrial Park in Moraiya, Changodar, Ahmedabad — 63 industrial sheds and warehouses from 4,000 to 50,000 sq.ft, 90-day possession, 6–8% rental yield. Call +91 98242 35642.',
  alternates: { canonical: `${SITE_BASE_URL}/metro-industrial-park` },
  openGraph: {
    title: 'Metro Industrial Park | Industrial Sheds & Warehouses in Moraiya, Changodar',
    description: '63 industrial sheds and warehouses from 4,000–50,000 sq.ft, 90-day possession, 6–8% rental yield.',
    url: `${SITE_BASE_URL}/metro-industrial-park`,
    images: [{ url: '/images/industrial-shed-for-sale-moraiya-ahmedabad.jpg', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([propertySchema, realEstateListingSchema, faqSchema, imageObjectSchema, websiteSchema]) }}
      />
      <MetroIndustrialParkPage />
    </>
  );
}
