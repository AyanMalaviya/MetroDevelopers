import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  base: '/',

  plugins: [
    react(),

    // Self-hosts Google Fonts at build time — must come before VitePWA
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Anton&family=Bungee+Outline&display=swap',
    ]),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 'favicon.svg', 'robots.txt', 'apple-touch-icon.png',
        'images/*.jpg', 'images/*.jpeg', 'images/*.png', 'images/*.webp',
      ],
      manifest: {
        name:             'Metro Enterprise - Industrial & Warehouse Spaces',
        short_name:       'Metro Enterprise',
        description:      'Premium industrial parks and warehouse spaces in Ahmedabad',
        theme_color:      '#000000',
        background_color: '#000000',
        display:          'standalone',
        display_override: ['fullscreen', 'standalone', 'minimal-ui'],
        scope:            '/',
        start_url:        '/',
        orientation:      'any',
        categories:       ['business', 'productivity'],
        lang:             'en-IN',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any'      },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any'      },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff2}'],
        runtimeCaching: [
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
