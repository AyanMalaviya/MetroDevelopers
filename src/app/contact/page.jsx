import { SITE_BASE_URL } from '../../data/seoRoutes';
import { propertySchema, createBreadcrumbSchema } from '../../utils/schemas';
import ContactPage from '../../pages/ContactPage';

export const metadata = {
  title: 'Contact Metro Industrial Park | Moraiya, Changodar, Ahmedabad',
  description:
    'Contact Metro Industrial Park for industrial shed and warehouse inquiries in Moraiya, Changodar, Ahmedabad. Call +91 98242 35642 or WhatsApp. Site visits by appointment.',
  alternates: { canonical: `${SITE_BASE_URL}/contact` },
  openGraph: {
    title: 'Contact Metro Industrial Park',
    description: 'Call or WhatsApp +91 98242 35642. Site visits available. Moraiya, Changodar, Ahmedabad.',
    url: `${SITE_BASE_URL}/contact`,
    images: [{ url: '/images/metro-industrial-park-office-changodar.jpg', width: 1200, height: 630 }],
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([propertySchema, breadcrumb]) }}
      />
      <ContactPage />
    </>
  );
}
