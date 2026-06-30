import { notFound } from 'next/navigation';
import { LOCAL_MARKET_PAGES, SITE_BASE_URL } from '../../data/seoRoutes';
import {
  propertySchema,
  createLocationPageSchema,
  createBreadcrumbSchema,
} from '../../utils/schemas';
import LocalMarketPage from '../../pages/LocalMarketPage';

// Build static params at build time — one route per LOCAL_MARKET_PAGE
export function generateStaticParams() {
  return LOCAL_MARKET_PAGES.map((page) => ({
    slug: page.path.replace(/^\//, ''),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = LOCAL_MARKET_PAGES.find((p) => p.path === `/${slug}`);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `${SITE_BASE_URL}${page.path}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${SITE_BASE_URL}${page.path}`,
      images: [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.ogImageAlt || page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [page.image],
    },
    other: {
      'geo.region': 'IN-GJ',
      'geo.placename': page.locationName || 'Moraiya, Changodar, Ahmedabad, Gujarat',
      'geo.position': '22.914141879249897;72.41748307531053',
      'ICBM': '22.914141879249897, 72.41748307531053',
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = LOCAL_MARKET_PAGES.find((p) => p.path === `/${slug}`);
  if (!page) notFound();

  const locationPageSchema = createLocationPageSchema({
    pageTitle: page.title,
    pageDescription: page.description,
    path: page.path,
    locationName: page.locationName,
    focusKeyword: page.focusKeyword,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: page.breadcrumb, path: page.path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([propertySchema, locationPageSchema, breadcrumbSchema]),
        }}
      />
      <LocalMarketPage />
    </>
  );
}
