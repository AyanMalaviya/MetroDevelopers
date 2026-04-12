import fs from 'node:fs';
import path from 'node:path';
import { SEO_ROUTES, SITE_BASE_URL } from '../src/data/seoRoutes.js';

const TODAY = new Date().toISOString().split('T')[0];

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const normalizeUrl = (value) => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${SITE_BASE_URL}${value}`;
};

const xml = [];
xml.push('<?xml version="1.0" encoding="UTF-8"?>');
xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

for (const route of SEO_ROUTES) {
  xml.push('  <url>');
  xml.push(`    <loc>${escapeXml(normalizeUrl(route.path))}</loc>`);
  xml.push(`    <lastmod>${TODAY}</lastmod>`);
  xml.push(`    <changefreq>${route.changefreq}</changefreq>`);
  xml.push(`    <priority>${route.priority.toFixed(1)}</priority>`);

  if (Array.isArray(route.images)) {
    for (const image of route.images) {
      xml.push('    <image:image>');
      xml.push(`      <image:loc>${escapeXml(normalizeUrl(image.loc))}</image:loc>`);

      if (image.title) {
        xml.push(`      <image:title>${escapeXml(image.title)}</image:title>`);
      }

      if (image.caption) {
        xml.push(`      <image:caption>${escapeXml(image.caption)}</image:caption>`);
      }

      xml.push('    </image:image>');
    }
  }

  xml.push('  </url>');
}

xml.push('</urlset>');

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, `${xml.join('\n')}\n`, 'utf8');

console.log(`Generated sitemap with ${SEO_ROUTES.length} URLs at ${outputPath}`);
