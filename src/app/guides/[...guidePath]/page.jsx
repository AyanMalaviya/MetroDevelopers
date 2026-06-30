import { notFound } from 'next/navigation';
import { GUIDE_PAGES, SITE_BASE_URL } from '../../../data/seoRoutes';
import {
  propertySchema,
  createArticleSchema,
  createBreadcrumbSchema,
} from '../../../utils/schemas';
import InsightGuidePage from '../../../pages/InsightGuidePage';

// Build all /guides/xxx routes statically at build time
export function generateStaticParams() {
  return GUIDE_PAGES.map((page) => ({
    // page.path is e.g. "/guides/gst-input-credit-industrial-tenants-gujarat"
    // Strip leading "/guides/" to get the catch-all segments
    guidePath: page.path.replace(/^\/guides\//, '').split('/'),
  }));
}

export async function generateMetadata({ params }) {
  const { guidePath } = await params;
  const fullPath = `/guides/${guidePath.join('/')}`;
  const page = GUIDE_PAGES.find((p) => p.path === fullPath);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `${SITE_BASE_URL}${page.path}` },
    openGraph: {
      type: 'article',
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
  };
}

export default async function Page({ params }) {
  const { guidePath } = await params;
  const fullPath = `/guides/${guidePath.join('/')}`;
  const page = GUIDE_PAGES.find((p) => p.path === fullPath);
  if (!page) notFound();

  const articleSchema = createArticleSchema({
    headline: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords.split(',').map((k) => k.trim()),
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
          __html: JSON.stringify([propertySchema, articleSchema, breadcrumbSchema]),
        }}
      />
      <InsightGuidePage />
    </>
  );
}
