/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — generates pre-rendered HTML for every page at build time.
  // This is the core fix for Googlebot seeing blank <div id="root"> instead of content.
  // After `next build`, the `out/` folder contains pure static HTML + assets.
  // Deploy `out/` to Vercel, Netlify, or any static host.
  output: 'export',

  // Required for static export: images must use unoptimized mode
  // (Next.js Image Optimization requires a server; static export has none).
  images: {
    unoptimized: true,
  },

  // Trailing slash: makes /industrial-sheds-in-moraiya/ and /industrial-sheds-in-moraiya
  // both resolve to the same page — prevents duplicate content penalties.
  trailingSlash: true,

  // Move src/ pages to app router
  // (already handled by src/app/ directory structure)
};

export default nextConfig;
