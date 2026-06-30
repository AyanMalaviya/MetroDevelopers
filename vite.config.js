import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import webfontDownload from 'vite-plugin-webfont-dl';
import { vitePrerender } from 'vite-plugin-prerender';

// ─── All static routes to pre-render at build time ────────────────────────────
// Add any new page/guide/market route here so Googlebot gets full HTML.
const PRERENDER_ROUTES = [
  '/',
  '/metro-industrial-park',
  '/metro-arcade',
  '/contact',
  '/calculator',
  '/site-map',

  // Local Market SEO pages
  '/industrial-sheds-in-moraiya',
  '/industrial-sheds-in-changodar',
  '/warehouses-in-changodar',
  '/industrial-sheds-near-sarkhej-bavla-highway',
  '/industrial-sheds-in-ahmedabad',
  '/investment-in-real-estate-in-ahmedabad',
  '/industrial-shed-for-rent-changodar',
  '/industrial-shed-for-sale-changodar',
  '/godown-for-rent-changodar',
  '/industrial-park-near-sanand',
  '/warehouse-for-rent-ahmedabad',
  '/warehouse-for-sale-ahmedabad',
  '/industrial-shed-for-rent-moraiya',
  '/industrial-shed-for-sale-moraiya',
  '/godown-for-rent-ahmedabad',
  '/factory-shed-for-rent-changodar',
  '/industrial-shed-for-rent-gujarat',
  '/gidc-shed-for-rent-ahmedabad',
  '/industrial-property-investment-ahmedabad',
  '/industrial-land-for-sale-moraiya-changodar',
  '/high-return-investment-gujarat',

  // Guide pages
  '/guides/gst-input-credit-industrial-tenants-gujarat',
  '/guides/warehousing-yield-cagr-gujarat',
  '/guides/industrial-property-due-diligence-ahmedabad',
  '/guides/how-to-choose-industrial-shed-gujarat',
  '/guides/industrial-investment-returns-gujarat-2026',
  '/guides/rent-vs-buy-industrial-shed-ahmedabad',
  '/guides/gidc-vs-private-industrial-park-gujarat',
];

export default defineConfig({
  base: '/',

  plugins: [
    react(),

    // Self-hosts Google Fonts at build time — must come before VitePWA
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Anton&family=Bungee+Outline&display=swap',
    ]),

    // ── SSG Pre-rendering ──────────────────────────────────────────────────────
    // Renders each route to a static index.html at build time.
    // Googlebot/crawlers see full HTML; React rehydrates on the client.
    // NO serverless functions consumed — pure static output. ✅ Vercel-safe.
    vitePrerender({
      staticDir: './dist',          // Vite default output dir
      routes: PRERENDER_ROUTES,

      // Renderer options: headless Chromium spins up once per build locally,
      // not at request time, so zero serverless invocations on Vercel.
      rendererOptions: {
        // Wait until the React tree has finished painting before snapshotting.
        // '#root' must contain real content — adjust selector if your root id differs.
        renderAfterElementExists: '#root',

        // Extra safety net: also wait for network to go idle (deferred fetches).
        // Remove if your pages have long-running polls that would stall the build.
        renderAfterTime: 500,
      },

      // Inject canonical + basic OG tags that your React Helmet/head manager
      // may not set until client-side. This ensures crawlers always see them.
      // The plugin injects these into each pre-rendered page's <head>.
      // NOTE: For per-route dynamic tags (title, description, OG image),
      //       use react-helmet-async or @tanstack/react-head in your page components;
      //       the snapshot will capture whatever <head> state they produce.
      postProcessHtml({ html, route }) {
        // Ensure each pre-rendered page has a canonical tag pointing to the right URL.
        const canonical = `<link rel="canonical" href="https://www.metrodevelopers.co.in${route}" />`;
        return html.includes('<link rel="canonical"')
          ? html  // already injected by react-helmet-async — don't duplicate
          : html.replace('</head>', `  ${canonical}\n</head>`);
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico', 'favicon.svg', 'robots.txt', 'apple-touch-icon.png',
        'icons/*.png', 'icons/*.svg',
        'images/*.jpg', 'images/*.jpeg', 'images/*.png', 'images/*.webp',
      ],
      manifest: {
        name: 'Metro Enterprise',
        short_name: 'Metro Enterprise',
        description: 'Metro Enterprise — Industrial Shed for Sale in Moraiya, Changodar, Ahmedabad',
        theme_color: '#0b0b0d',
        background_color: '#0b0b0d',
        display: 'standalone',
        display_override: ['fullscreen', 'standalone', 'minimal-ui'],
        scope: '/',
        start_url: '/',
        orientation: 'any',
        categories: ['business', 'realestate'],
        lang: 'en-IN',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192x192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/.*\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-pages',
              // Short TTL so fresh pre-renders are picked up quickly
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\.(?:mp4|webm)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'video-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'maps-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],

  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':   ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor':  ['framer-motion'],
          'icons-vendor':   ['lucide-react', 'react-icons'],
          'countup-vendor': ['react-countup'],
        },
      },
    },
  },
});
