// src/components/SEO/StructuredData.jsx
import React from 'react';

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Metro Industrial Park",
    "description": "Premium industrial sheds for lease and sale",
    "url": "https://metroindustrialpark.com",
    "logo": "https://metroindustrialpark.com/Logo.jpeg",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export default StructuredData;
