import React from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords,
  ogImage = '/og-image.jpg',
  url 
}) => {
  const siteName = 'Metro Enterprise - Metro Industrial Park';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const siteUrl = 'https://metrodevelopers.co.in';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Metro Enterprise" />
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Changodar, Ahmedabad, Gujarat" />
      <meta name="geo.position" content="22.9870;72.5530" /> {/* Approximate Changodar coordinates */}
      <meta name="ICBM" content="22.9870, 72.5530" />
    </>
  );
};

export default SEO;
