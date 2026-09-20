# Tracks MTB Routes — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**SPA para explorar y compartir rutas MTB por España**

[Demo](https://tracks-mtb-routes.vercel.app) · [API Docs](https://tracks-mtb-routes-service.vercel.app/api-docs)

</div>

---

## Instalación rápida

```bash
pnpm install
cp .env.example .env   # editar VITE_SERVER_URL
pnpm dev               # http://localhost:3000
```

---

## Variables de entorno

```env
# Desarrollo
VITE_SERVER_URL=http://localhost:5005/api

# Producción (Vercel)
# VITE_SERVER_URL=https://tracks-mtb-routes-service.vercel.app/api
```

---

## Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool (puerto 3000) |
| React Router | 6.x | Enrutamiento SPA |
| Bootstrap + React Bootstrap | 5.3 | Carousel, componentes UI |
| Leaflet + react-leaflet | 1.9 | Mapas interactivos |
| leaflet-routing-machine | 3.2 | Trazado de rutas |
| react-simple-maps | 3.0 | Mapa SVG provincias de España |
| axios | 1.x | HTTP client + interceptor JWT |
| react-burger-menu | 3.1 | Sidebar móvil (slide) |
| react-spinners | 0.14 | Loading spinners |
| vite-plugin-pwa + Workbox | 1.3 | Service worker, manifiesto e instalación |

---

## Diseño — Sistema de colores

Gradiente de marca: `linear-gradient(90deg, #d53369 0%, #daae51 100%)`

Aplicado en navbar, footer, sidebar, botones principales, hero carousel, mapa de provincias, AccessPage y badges de dificultad.

```css
--gradient-start: #d53369;   /* magenta/rosa */
--gradient-end: #daae51;     /* dorado */
--bg: #f7f3ee;               /* fondo cálido */
--text: #1c1c2e;             /* casi negro */
```

---

## Páginas principales

| Ruta | Descripción |
|------|-------------|
| `/` | **Homepage**: hero carousel full-width + CTA + mapa de provincias |
| `/` (sin login) | **AccessPage**: hero con gradiente + formulario login/signup |
| `/rutas` | **Rutas**: grid 3 columnas con imagen, badge dificultad y stats |
| `/rutas/:id` | **DetallesRuta**: hero image + stats bar + mapa Leaflet + reseñas con ⭐ |
| `/crear-ruta` | **CrearRuta**: formulario por secciones + importar GPX |
| `/profile` | **UserProfile**: avatar circular + stats + tabs de edición |
| `/user-rutas` | **UserRutas**: mis rutas con badge "✎ Mía" + botón nueva ruta |

---

## Feature: Importar GPX

En la página `/crear-ruta` puedes subir un archivo `.gpx` grabado con cualquier dispositivo GPS (Garmin, Wahoo, Polar, Strava export, Komoot export, etc.).

**Lo que hace automáticamente:**
- Extrae distancia (fórmula Haversine sobre todos los puntos)
- Calcula desnivel acumulado positivo
- Calcula duración (si el GPX tiene timestamps)
- Muestra el track completo como Polyline en el mapa
- Hace zoom automático al área de la ruta
- Sube el archivo GPX a Vercel Blob y guarda la URL

**Formatos soportados:** GPX 1.0, GPX 1.1, `<trkpt>`, `<rtept>`

---

## Reseñas con valoración

Las reseñas incluyen valoración de 1 a 5 estrellas (obligatoria). Se muestra:
- Selector interactivo en el formulario (`StarRating`)
- Display de estrellas en cada tarjeta de reseña (`StarDisplay`)

---

## Iconos

Todos los iconos son SVG inline en `src/components/Icons.jsx` — sin dependencias externas.

`ArrowLeftIcon` · `LogOutIcon` · `HomeIcon` · `PlusCircleIcon` · `UserIcon` · `RouteIcon` · `SearchIcon` · `XIcon` · `MenuIcon`

---

## Buscador

El buscador en la navbar es un dropdown posicionado absolutamente con:
- Debounce de 700ms
- Cierre al hacer click fuera
- Cierre con tecla Escape
- Thumbnails 42×42px por resultado
- Máximo 6 resultados

---

## Sidebar

Panel lateral con animación `slide` (react-burger-menu). Se cierra automáticamente al navegar a cualquier página. Estado controlado con `isOpen`.

---

## PWA — App instalable y offline

La app es una Progressive Web App: se puede instalar en móvil y escritorio y sigue funcionando sin conexión.

**Qué incluye:**

| Pieza | Dónde |
|-------|-------|
| Manifiesto (nombre, iconos, colores, atajos) | generado por `vite-plugin-pwa` → `dist/manifest.webmanifest` |
| Service worker (precaché + caché en runtime) | generado por Workbox → `dist/sw.js` |
| Avisos de instalar / actualizar / offline | `src/components/PWAPrompt.jsx` |
| Iconos PNG (64, 192, 512, maskable, apple-touch) | `public/pwa-*.png` — se generan con `pnpm icons` |

**Estrategias de caché:**

| Contenido | Estrategia | Caducidad |
|-----------|-----------|-----------|
| App shell (JS, CSS, HTML, iconos) | Precaché | por versión del build |
| Teselas de OpenStreetMap | CacheFirst | 1000 teselas / 30 días |
| Marcadores de Leaflet (unpkg) | CacheFirst | 1 año |
| `GET` a la API (`VITE_SERVER_URL`) | NetworkFirst (8 s de espera) | 24 h |
| Fotos de rutas, reseñas y perfiles | CacheFirst | 200 imágenes / 30 días |

Sin conexión se abre la app y se ven las rutas ya visitadas junto a sus mapas; crear o editar sí necesita red.

**Actualizaciones:** el modo es `prompt`, así que una versión nueva no se aplica sola — aparece un aviso *«Hay una nueva versión»* y la recarga la decide la persona usuaria.

**Probar el service worker en local:**

```bash
pnpm build && pnpm preview     # http://localhost:4173
pnpm dev:pwa                   # servidor de desarrollo con el service worker activo
```

En Chrome: DevTools → *Application* → *Service Workers* / *Manifest*, y *Network → Offline* para comprobar el modo sin conexión.

**Regenerar los iconos:** `pnpm icons` rasteriza la rueda de `public/favicon.svg` a los PNG del manifiesto (script sin dependencias, en `scripts/generate-pwa-icons.mjs`). Solo hace falta si cambia el logo o los colores de marca.

---

## Scripts

```bash
pnpm dev          # desarrollo (puerto 3000, hot-reload)
pnpm dev:pwa      # desarrollo con el service worker activo (probar la PWA)
pnpm build        # build producción
pnpm preview      # preview del build local
pnpm lint         # ESLint — 0 errores
pnpm lint:fix     # corregir automáticamente
pnpm icons        # regenerar los iconos PNG de la PWA
```

---

## Deploy en Vercel

`vercel.json` en la raíz configura el SPA routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Sin esto, navegar directamente a `/rutas` o `/profile` devuelve 404.

Añade la variable `VITE_SERVER_URL` en **Vercel → Settings → Environment Variables**. Se inyecta en el build y también define la regla de caché de la API dentro del service worker, así que debe estar presente al desplegar.

`vercel.json` añade además cabeceras `Cache-Control: max-age=0, must-revalidate` para `/sw.js` y `/manifest.webmanifest`: sin ellas el CDN podría servir un service worker viejo y las actualizaciones tardarían en llegar.
