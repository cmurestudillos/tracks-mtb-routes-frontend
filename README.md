# Tracks MTB Routes — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**SPA para explorar y compartir rutas de mountain bike por España**

[Demo](https://tracks-mtb.netlify.app) · [API Backend](https://tracks-mtb-api.vercel.app/api-docs)

</div>

---

## Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool y dev server |
| React Router | 6.x | Enrutamiento SPA |
| Bootstrap | 5.3 | Componentes UI |
| Leaflet + react-leaflet | 1.9 | Mapas interactivos |
| leaflet-routing-machine | 3.2 | Trazado de rutas |
| react-simple-maps | 3.0 | Mapa SVG de provincias |
| axios | 1.x | Cliente HTTP |
| react-spinners | 0.14 | Indicadores de carga |
| react-burger-menu | 3.1 | Sidebar móvil |
| ESLint 8 | legacy config | Linting |
| Prettier | 3.x | Formateo |

---

## Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env
# Edita .env con la URL de tu backend

# Desarrollo (puerto 3000)
pnpm dev

# Build de producción
pnpm build
```

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_SERVER_URL` | URL base de la API — ej: `http://localhost:5005/api` |

---

## Estructura

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Rutas React Router
├── App.css                   # Estilos globales y componentes
├── index.css                 # Variables CSS (gradiente, colores)
├── Sidebar.css               # Estilos sidebar móvil
├── globalStyle.module.css    # CSS Module para mapa de provincias
├── assets/                   # Imágenes e iconos
├── context/
│   └── auth.context.jsx      # AuthContext + AuthWrapper (JWT)
├── service/
│   └── config.service.js     # Axios instance con interceptor de token
├── components/
│   ├── NavbarComp.jsx        # Navbar con logo de texto + búsqueda
│   ├── SidebarE.jsx          # Sidebar móvil (burger menu)
│   ├── Footer.jsx            # Footer con enlaces
│   ├── Carrousel.jsx         # Carrusel rutas destacadas
│   ├── SearchBar.jsx         # Barra de búsqueda
│   ├── Spinner.jsx           # Loading spinner
│   ├── MostrarRuta.jsx       # Leaflet routing machine (visualizar ruta)
│   ├── CrearMapaRutaLeaflet.jsx  # Mapa para crear rutas
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   └── mapaDeProvincias/
│       ├── Map.jsx           # SVG mapa España con react-simple-maps
│       └── MapContainer.jsx
└── pages/
    ├── Homepage.jsx          # Home: carrusel + mapa provincias
    ├── AccessPage.jsx        # Landing sin sesión (login/signup)
    ├── Rutas.jsx             # Listado de rutas
    ├── RutasProvincia.jsx    # Rutas por provincia
    ├── DetallesRuta.jsx      # Detalle + mapa + reseñas
    ├── CrearRuta.jsx         # Crear nueva ruta
    ├── UserProfile.jsx       # Perfil del usuario
    ├── UserRutas.jsx         # Mis rutas
    ├── About.jsx             # Información del proyecto
    └── error/
        ├── Error404.jsx
        └── Error500.jsx
```

---

## Diseño

La identidad visual usa el gradiente `linear-gradient(90deg, #d53369 0%, #daae51 100%)` aplicado a navbar, footer, botones y el sidebar. Los colores se gestionan mediante variables CSS en `index.css`:

```css
--gradient: linear-gradient(90deg, #d53369 0%, #daae51 100%);
--bg: #f7f3ee;
--text: #1c1c2e;
--text-on-gradient: #ffffff;
```

---

## Scripts

```bash
pnpm dev          # Desarrollo con hot-reload
pnpm build        # Build de producción
pnpm preview      # Preview del build local
pnpm lint         # Verificar ESLint
pnpm lint:fix     # Corregir ESLint automáticamente
```

---

## Deploy en Netlify

El archivo `public/_redirects` ya configura el SPA routing:
```
/* /index.html 200
```

Pasos:
1. Conecta el repositorio en Netlify
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Añade la variable de entorno `VITE_SERVER_URL` con la URL del backend en producción
