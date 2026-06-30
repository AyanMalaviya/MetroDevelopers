import { SITE_BASE_URL } from '../data/seoRoutes';

// Generates /robots.txt automatically at build time (Next.js App Router)
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block internal/utility pages that should not be indexed
        disallow: [
          '/sheet-changelog',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
    host: SITE_BASE_URL,
  };
}
