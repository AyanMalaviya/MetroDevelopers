import fs from 'node:fs';
import path from 'node:path';
import { SEO_ROUTES } from '../src/data/seoRoutes.js';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found, cannot prerender static routes');
  process.exit(1);
}

const template = fs.readFileSync(indexPath, 'utf8');
let generatedCount = 0;

for (const route of SEO_ROUTES) {
  if (route.path === '/') continue;

  // Clean path (strip leading slash)
  const cleanPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
  const targetDir = path.join(distDir, cleanPath);
  const targetFile = path.join(targetDir, 'index.html');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, template, 'utf8');
  generatedCount++;
}

console.log(`Successfully generated static index.html for ${generatedCount} routes in dist/`);

