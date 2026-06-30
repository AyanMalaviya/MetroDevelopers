/**
 * SeoHead — drop this into any page component to inject per-route
 * <title>, <meta description>, Open Graph, and structured data.
 *
 * Uses react-helmet-async which is SSG-compatible: the tags are written
 * into the pre-rendered HTML snapshot so crawlers see them without JS.
 *
 * Usage:
 *   import SeoHead from '../seo/SeoHead';
 *
 *   <SeoHead
 *     title="Industrial Sheds in Changodar | Metro Enterprise"
 *     description="Buy or rent industrial sheds in Changodar, Ahmedabad. Direct from developer."
 *     canonical="/industrial-sheds-in-changodar"
 *     ogImage="/images/og-changodar.jpg"
 *   />
 */
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.metrodevelopers.co.in';
const DEFAULT_OG = '/images/og-default.jpg';

export default function SeoHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  noIndex = false,
  schema = null,        // Pass a JSON-LD object for structured data
}) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : null;
  const fullOgImage   = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  return (
    <Helmet>
      {title       && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {noIndex     && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      {title       && <meta property="og:title"       content={title} />}
      {description && <meta property="og:description" content={description} />}
      {fullCanonical && <meta property="og:url"       content={fullCanonical} />}
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:type"  content="website" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      {title       && <meta name="twitter:title"       content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
