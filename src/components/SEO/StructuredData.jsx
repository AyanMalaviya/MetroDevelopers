import React from 'react';

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstate",
    "name": "Metro Enterprise - Metro Industrial Park",
    "alternateName": "Metro Industrial Park Changodar",
    "description": "Premium industrial sheds for lease and sale in Moraiya, Changodar, Ahmedabad. Past projects in Shiv Industrial Estate, Moraiya, and Chavda Estate.",
    "url": "https://metrodevelopers.co.in",
    "logo": "https://metrodevelopers.co.in/Logo.jpeg",
    "image": "https://metrodevelopers.co.in/og-image.jpg",
    "telephone": "+91-9824235642",
    "email": "metrodevelopers26@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Changodar",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "382213",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.9870",
      "longitude": "72.5530"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Ahmedabad"
      },
      {
        "@type": "Place",
        "name": "Changodar"
      },
      {
        "@type": "Place",
        "name": "Moraiya"
      },
      {
        "@type": "Place",
        "name": "Sanand"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "telephone": "+91-9824235642",
      "email": "metrodevelopers26@gmail.com",
      "availableLanguage": ["English", "Hindi", "Gujarati"],
      "areaServed": "IN"
    },
    "priceRange": "Contact for pricing",
    "openingHours": "Mo-Sa 09:00-18:00",
    "sameAs": [
      "https://www.facebook.com/metroindustrialpark1",
      "https://www.instagram.com/metro.indsutrialpark/",
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export default StructuredData;
