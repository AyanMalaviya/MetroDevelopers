import { useEffect } from 'react';

import { SITE_BASE_URL } from '../../data/seoRoutes';

const SITE_NAME = 'Metro Enterprise';

const resolveUrl = (value, baseUrl) => {
  if (!value) {
    return baseUrl;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return baseUrl;
  }
};

const snapshotAttributes = (tag) =>
  Array.from(tag.attributes, (attribute) => [attribute.name, attribute.value]);

const restoreAttributes = (tag, attributes) => {
  Array.from(tag.attributes).forEach((attribute) => tag.removeAttribute(attribute.name));
  attributes.forEach(([name, value]) => tag.setAttribute(name, value));
};

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/images/metro-industrial-park-site-map-moraiya-gujarat.jpg',
  ogImageAlt,
  alt,
  structuredData,
  noindex = false,
}) => {
  const siteUrl = SITE_BASE_URL;
  const fullCanonical = canonical ? resolveUrl(canonical, siteUrl) : siteUrl;
  const fullOgImage = resolveUrl(ogImage, siteUrl);
  const resolvedOgImageAlt = ogImageAlt || alt || title || SITE_NAME;
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const head = document.head;
    const previousTitle = document.title;
    const cleanupTasks = [];

    head.querySelectorAll('[data-seo-managed="true"]').forEach((node) => node.remove());

    document.title = title || SITE_NAME;

    const upsertMeta = ({ name, property, content }) => {
      const selector = name
        ? `meta[name="${name}"]`
        : `meta[property="${property}"]`;
      let tag = head.querySelector(selector);
      const existed = Boolean(tag);
      const originalAttributes = existed ? snapshotAttributes(tag) : [];
      const originalTextContent = existed ? tag.textContent : '';

      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('data-seo-managed', 'true');
        head.appendChild(tag);
      }

      if (name) {
        tag.setAttribute('name', name);
        tag.removeAttribute('property');
      } else {
        tag.setAttribute('property', property);
        tag.removeAttribute('name');
      }

      if (content == null || content === '') {
        tag.removeAttribute('content');
      } else {
        tag.setAttribute('content', String(content));
      }

      cleanupTasks.push(() => {
        if (!tag.isConnected) {
          return;
        }

        if (!existed) {
          tag.remove();
          return;
        }

        restoreAttributes(tag, originalAttributes);
        tag.textContent = originalTextContent ?? '';
      });
    };

    const upsertLink = (rel, href) => {
      const selector = `link[rel="${rel}"]`;
      let tag = head.querySelector(selector);
      const existed = Boolean(tag);
      const originalAttributes = existed ? snapshotAttributes(tag) : [];
      const originalTextContent = existed ? tag.textContent : '';

      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('data-seo-managed', 'true');
        head.appendChild(tag);
      }

      tag.setAttribute('rel', rel);
      tag.setAttribute('href', href);

      cleanupTasks.push(() => {
        if (!tag.isConnected) {
          return;
        }

        if (!existed) {
          tag.remove();
          return;
        }

        restoreAttributes(tag, originalAttributes);
        tag.textContent = originalTextContent ?? '';
      });
    };

    const syncStructuredData = (schemas) => {
      const items = Array.isArray(schemas) ? schemas : [schemas];
      const validSchemas = items.filter(Boolean);

      validSchemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-managed', 'true');
        script.textContent = JSON.stringify(schema);
        head.appendChild(script);
      });

      cleanupTasks.push(() => {
        head.querySelectorAll('script[data-seo-managed="true"]').forEach((node) => node.remove());
      });
    };

    upsertMeta({ name: 'description', content: description });

    if (keywords) {
      upsertMeta({ name: 'keywords', content: keywords });
    }

    upsertLink('canonical', fullCanonical);
    upsertMeta({ property: 'og:site_name', content: SITE_NAME });
    upsertMeta({ property: 'og:locale', content: 'en_IN' });
    upsertMeta({ name: 'robots', content: robotsContent });
    upsertMeta({ property: 'og:type', content: 'website' });
    upsertMeta({ property: 'og:url', content: fullCanonical });
    upsertMeta({ property: 'og:title', content: title });
    upsertMeta({ property: 'og:description', content: description });
    upsertMeta({ property: 'og:image', content: fullOgImage });
    upsertMeta({ property: 'og:image:width', content: '1200' });
    upsertMeta({ property: 'og:image:height', content: '630' });
    upsertMeta({ property: 'og:image:alt', content: resolvedOgImageAlt });
    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta({ name: 'twitter:url', content: fullCanonical });
    upsertMeta({ name: 'twitter:title', content: title });
    upsertMeta({ name: 'twitter:description', content: description });
    upsertMeta({ name: 'twitter:image', content: fullOgImage });
    upsertMeta({ name: 'twitter:image:alt', content: resolvedOgImageAlt });

    if (structuredData) {
      syncStructuredData(structuredData);
    }

    return () => {
      document.title = previousTitle;
      cleanupTasks.reverse().forEach((cleanup) => cleanup());
    };
  }, [title, description, keywords, fullCanonical, fullOgImage, resolvedOgImageAlt, robotsContent, structuredData]);

  return null;
};

export default SEO;