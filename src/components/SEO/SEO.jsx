'use client';
// src/components/SEO/SEO.jsx
//
// In Next.js App Router, page-level <title>, <meta>, <link rel="canonical">,
// og:*, twitter:* and robots tags are ALL handled by the `metadata` /
// `generateMetadata()` exports in each src/app/*/page.jsx file — those run
// on the SERVER and are injected into the raw HTML before any JS executes.
//
// This component now has ONE remaining job: inject JSON-LD <script> tags
// for structured data (schemas) that can't be expressed via the metadata API.
// It does this safely using next/script so Next.js manages deduplication.

import Script from 'next/script';

const SEO = ({ structuredData }) => {
  if (!structuredData) return null;

  const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
  const validSchemas = schemas.filter(Boolean);

  return (
    <>
      {validSchemas.map((schema, i) => (
        <Script
          key={i}
          id={`schema-${i}-${schema['@type'] ?? 'unknown'}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default SEO;
