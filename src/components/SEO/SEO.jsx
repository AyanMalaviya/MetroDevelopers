// src/components/SEO/SEO.jsx
import React from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords,
  ogImage = '/og-image.jpg',
  url 
}) => {
  const siteName = 'Metro Industrial Park';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const siteUrl = 'https://metroindustrialpark.com'; // Replace with your actual domain
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
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Metro Industrial Park" />
    </>
  );
};

export default SEO;
