const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/og-image.jpg',
  structuredData,
  noindex = false,
}) => {
  const siteUrl = 'https://www.metrodevelopers.co.in';

  const fullCanonical = canonical
    ? `${siteUrl}${canonical.startsWith('/') ? canonical : '/' + canonical}`
    : siteUrl;

  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      <meta name="robots" content={
        noindex
          ? 'noindex, nofollow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      } />

      <meta property="og:type"         content="website" />
      <meta property="og:url"          content={fullCanonical} />
      <meta property="og:title"        content={title} />
      <meta property="og:description"  content={description} />
      <meta property="og:image"        content={fullOgImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={fullCanonical} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={fullOgImage} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
};

export default SEO;
