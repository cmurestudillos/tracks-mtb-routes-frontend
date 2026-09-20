import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

/** Escapa una URL para poder usarla como prefijo dentro de una expresión regular. */
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiUrl = env.VITE_SERVER_URL ?? '';

  return {
    plugins: [
      react(),
      VitePWA({
        // El usuario decide cuándo recargar: mostramos un aviso (src/components/PWAPrompt.jsx)
        registerType: 'prompt',
        injectRegister: null,
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
        manifest: {
          id: '/',
          name: 'Tracks MTB Routes',
          short_name: 'Tracks MTB',
          description: 'Explora y comparte rutas de mountain bike por España',
          lang: 'es',
          dir: 'ltr',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#d53369',
          background_color: '#f7f3ee',
          categories: ['sports', 'travel', 'navigation'],
          icons: [
            { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: '/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Ver rutas',
              short_name: 'Rutas',
              url: '/rutas',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'Crear ruta',
              short_name: 'Crear',
              url: '/crear-ruta',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          // El bundle incluye utils/mapdata.js (~200 kB): el límite por defecto (2 MiB) se queda corto
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              // Teselas de OpenStreetMap: no cambian, se pueden servir desde caché
              urlPattern: /^https:\/\/[a-z]\.tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles',
                expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Iconos de marcador de Leaflet servidos desde unpkg
              urlPattern: /^https:\/\/unpkg\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'leaflet-assets',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            ...(apiUrl
              ? [
                  {
                    // API: red primero, con la última respuesta guardada como red de seguridad
                    urlPattern: new RegExp(`^${escapeRegExp(apiUrl)}`, 'i'),
                    handler: 'NetworkFirst',
                    method: 'GET',
                    options: {
                      cacheName: 'api-get',
                      networkTimeoutSeconds: 8,
                      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
                      cacheableResponse: { statuses: [0, 200] },
                    },
                  },
                ]
              : []),
            {
              // Fotos de rutas, reseñas y perfiles alojadas fuera de la app
              urlPattern: ({ request, sameOrigin }) => !sameOrigin && request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'remote-images',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: {
          // `pnpm dev:pwa` levanta el servidor de desarrollo con el service worker activo
          enabled: mode === 'pwa',
          type: 'module',
          navigateFallback: 'index.html',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
