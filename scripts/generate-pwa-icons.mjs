/**
 * Genera los iconos PNG de la PWA a partir del logo (la rueda de public/favicon.svg).
 *
 * No depende de librerías externas: rasteriza las figuras a mano con
 * supersampling 4x y escribe los PNG con el zlib de Node.
 *
 * Uso:  pnpm run icons
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

// Colores del gradiente de marca (src/index.css)
const GRADIENT_START = [0xd5, 0x33, 0x69];
const GRADIENT_END = [0xda, 0xae, 0x51];
const WHITE = [0xff, 0xff, 0xff];

const SS = 4; // muestras por eje (antialiasing)

// ---------------------------------------------------------------- png ------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/** Codifica un buffer RGBA (size × size) como PNG. */
function encodePng(rgba, size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filtro "none"
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------ geometría ----

function insideRoundRect(x, y, size, radius) {
  if (x < 0 || y < 0 || x > size || y > size) return false;
  const cx = Math.min(Math.max(x, radius), size - radius);
  const cy = Math.min(Math.max(y, radius), size - radius);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function onRing(x, y, cx, cy, r, width) {
  const d = Math.hypot(x - cx, y - cy);
  return Math.abs(d - r) <= width / 2;
}

function onSegment(x, y, x1, y1, x2, y2, width) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)) <= width / 2;
}

/**
 * Dibuja la rueda (aro + radios + buje) centrada en el lienzo.
 *
 * @param {number} size      lado del PNG en píxeles
 * @param {object} options
 * @param {number} options.scale    tamaño de la rueda respecto al lienzo (0-1)
 * @param {number} options.radius   radio de las esquinas respecto al lado (0-0.5)
 */
function renderIcon(size, { scale = 0.656, radius = 0.1875 } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  const cornerRadius = radius * size;
  const c = size / 2;
  const wheelR = (scale / 2) * size; // radio exterior del aro
  const strokeW = wheelR * (2.2 / 10.5);
  const spokeW = wheelR * (1.2 / 10.5);
  const hubR = wheelR * (2.5 / 10.5);
  const spokeR = wheelR + strokeW / 2; // los radios llegan al borde del aro
  const diag = spokeR * Math.SQRT1_2;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = px + (sx + 0.5) / SS;
          const y = py + (sy + 0.5) / SS;

          if (!insideRoundRect(x, y, size, cornerRadius)) continue;

          const isWhite =
            onRing(x, y, c, c, wheelR, strokeW) ||
            Math.hypot(x - c, y - c) <= hubR ||
            onSegment(x, y, c, c - spokeR, c, c + spokeR, spokeW) ||
            onSegment(x, y, c - spokeR, c, c + spokeR, c, spokeW) ||
            onSegment(x, y, c - diag, c - diag, c + diag, c + diag, spokeW) ||
            onSegment(x, y, c + diag, c - diag, c - diag, c + diag, spokeW);

          let color;
          if (isWhite) {
            color = WHITE;
          } else {
            const t = x / size;
            color = [
              GRADIENT_START[0] + (GRADIENT_END[0] - GRADIENT_START[0]) * t,
              GRADIENT_START[1] + (GRADIENT_END[1] - GRADIENT_START[1]) * t,
              GRADIENT_START[2] + (GRADIENT_END[2] - GRADIENT_START[2]) * t,
            ];
          }

          r += color[0];
          g += color[1];
          b += color[2];
          a += 1;
        }
      }

      const samples = SS * SS;
      const i = (py * size + px) * 4;
      if (a > 0) {
        // color no premultiplicado: promedio sobre las muestras cubiertas
        rgba[i] = Math.round(r / a);
        rgba[i + 1] = Math.round(g / a);
        rgba[i + 2] = Math.round(b / a);
        rgba[i + 3] = Math.round((a / samples) * 255);
      }
    }
  }

  return encodePng(rgba, size);
}

// -------------------------------------------------------------- salida -----

const targets = [
  // Icono normal: esquinas redondeadas como el favicon.
  { file: 'pwa-64x64.png', size: 64 },
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  // Maskable: a sangre y con la rueda dentro de la zona segura (80%).
  { file: 'maskable-icon-512x512.png', size: 512, scale: 0.5, radius: 0 },
  // iOS recorta el icono por su cuenta: sin transparencia ni esquinas.
  { file: 'apple-touch-icon-180x180.png', size: 180, scale: 0.72, radius: 0 },
];

mkdirSync(publicDir, { recursive: true });

for (const { file, size, scale, radius } of targets) {
  const png = renderIcon(size, { scale, radius });
  writeFileSync(resolve(publicDir, file), png);
  console.log(`✓ public/${file} (${size}×${size}, ${(png.length / 1024).toFixed(1)} kB)`);
}
