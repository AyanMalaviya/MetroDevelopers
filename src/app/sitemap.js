import { LOCAL_MARKET_PAGES, GUIDE_PAGES, SITE_BASE_URL } from '../data/seoRoutes';

// Generates /sitemap.xml automatically at build time (Next.js App Router)
// Submit this URL to Google Search Console after deploying.
export default function sitemap() {
  const today = new Date().toISOString();

  // Static top-level pages
  const staticRoutes = [
    { url: `${SITE_BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0, lastModified: today },
    { url: `${SITE_BASE_URL}/metro-industrial-park`, changeFrequency: 'weekly', priority: 1.0, lastModified: today },
    { url: `${SITE_BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.8, lastModified: today },
    { url: `${SITE_BASE_URL}/calculator`, changeFrequency: 'monthly', priority: 0.7, lastModified: today },
    { url: `${SITE_BASE_URL}/site-map`, changeFrequency: 'weekly', priority: 0.8, lastModified: today },
  ];

  // All LOCAL_MARKET_PAGES — high priority, these are the money SEO pages
  const localMarketRoutes = LOCAL_MARKET_PAGES.map((page) => ({
    url: `${SITE_BASE_URL}${page.path}`,
    changeFrequency: 'weekly',
    priority: 0.9,
    lastModified: today,
  }));

  // All GUIDE_PAGES — trust + TOFU content
  const guideRoutes = GUIDE_PAGES.map((page) => ({
    url: `${SITE_BASE_URL}${page.path}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: today,
  }));

  return [...staticRoutes, ...localMarketRoutes, ...guideRoutes];
}
