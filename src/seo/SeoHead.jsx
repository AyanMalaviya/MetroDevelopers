
import { Helmet } from 'react-helmet-async';

const BASE_URL   = 'https://www.metrodevelopers.co.in';
const SITE_NAME  = 'Metro Industrial Park';
const DEFAULT_OG = '/images/og-default.jpg';

export default function SeoHead({
  title,
  description,
  canonical,
  ogImage      = DEFAULT_OG,
  ogImageAlt   = 'Metro Industrial Park — Industrial Sheds in Moraiya, Changodar, Ahmedabad',
  noIndex      = false,
  schema       = null,
  dateModified = null,
}) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : null;
  const fullOgImage   = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  // Support both a single schema object and an array of schema objects
  const schemas = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [];

  return (
    <Helmet>
      {/* ── Core ── */}
      {title       && <title>{title}</title>}
      {description && <meta name="description"  content={description} />}
      {fullCanonical && <link rel="canonical"   href={fullCanonical} />}
      {noIndex     && <meta name="robots"        content="noindex, nofollow" />}
      {dateModified && <meta name="revised"      content={dateModified} />}

      {/* ── Open Graph ── */}
      {title        && <meta property="og:title"       content={title} />}
      {description  && <meta property="og:description" content={description} />}
      {fullCanonical && <meta property="og:url"        content={fullCanonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image"     content={fullOgImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content={ogImageAlt} />
      <meta property="og:type"         content="website" />
      <meta property="og:locale"       content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"  content="summary_large_image" />
      {title       && <meta name="twitter:title"       content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"     content={fullOgImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* ── JSON-LD Structured Data (one <script> per schema object) ── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
