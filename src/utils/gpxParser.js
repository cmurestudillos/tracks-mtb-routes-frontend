/**
 * Parser de archivos GPX (GPS Exchange Format)
 * Extrae: puntos del track, coordenadas inicio/fin, distancia, desnivel, duración
 */

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Fórmula Haversine — distancia entre dos coordenadas (km) */
function haversineKm(p1, p2) {
  const R = 6371;
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lon - p1.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Parsea el contenido de un archivo GPX
 * @param {string} gpxText - Contenido del archivo GPX como texto
 * @returns {{ points, coordinatesStart, coordinatesEnd, distanciaEnKm, desnivelEnM, duracionEnHoras, name } | null}
 */
export function parseGPX(gpxText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxText, 'application/xml');

  // Detectar errores de parsing
  if (doc.querySelector('parsererror')) {
    throw new Error('El archivo GPX no tiene un formato válido.');
  }

  // Extraer nombre de la ruta (metadatos GPX)
  const gpxName =
    doc.querySelector('metadata > name')?.textContent ||
    doc.querySelector('trk > name')?.textContent ||
    '';

  // Obtener todos los puntos del track (trkpt) o de la ruta (rtept)
  const trkpts = doc.querySelectorAll('trkpt, rtept');

  if (trkpts.length === 0) {
    throw new Error('El archivo GPX no contiene puntos de track (trkpt/rtept).');
  }

  const points = Array.from(trkpts).map(pt => ({
    lat: parseFloat(pt.getAttribute('lat')),
    lon: parseFloat(pt.getAttribute('lon')),
    ele: parseFloat(pt.querySelector('ele')?.textContent ?? 0) || 0,
    time: pt.querySelector('time')?.textContent ?? null,
  }));

  // Filtrar puntos inválidos
  const validPoints = points.filter(
    p => !isNaN(p.lat) && !isNaN(p.lon) && isFinite(p.lat) && isFinite(p.lon)
  );

  if (validPoints.length < 2) {
    throw new Error('El GPX necesita al menos 2 puntos válidos.');
  }

  // ---- Distancia total ----
  let totalKm = 0;
  for (let i = 1; i < validPoints.length; i++) {
    totalKm += haversineKm(validPoints[i - 1], validPoints[i]);
  }

  // ---- Desnivel acumulado positivo ----
  let elevationGain = 0;
  for (let i = 1; i < validPoints.length; i++) {
    const diff = validPoints[i].ele - validPoints[i - 1].ele;
    if (diff > 0) elevationGain += diff;
  }

  // ---- Duración (si el GPX tiene timestamps) ----
  let durationHours = 0;
  const firstTime = validPoints.find(p => p.time)?.time;
  const lastTime = [...validPoints].reverse().find(p => p.time)?.time;
  if (firstTime && lastTime) {
    const ms = new Date(lastTime) - new Date(firstTime);
    if (ms > 0) durationHours = ms / (1000 * 60 * 60);
  }

  return {
    name: gpxName,
    points: validPoints,
    // [lat, lon] — igual que las rutas manuales (ClickMarker usa obj.lat, obj.lng)
    coordinatesStart: [validPoints[0].lat, validPoints[0].lon],
    coordinatesEnd: [validPoints[validPoints.length - 1].lat, validPoints[validPoints.length - 1].lon],
    distanciaEnKm: parseFloat(totalKm.toFixed(1)),
    desnivelEnM: Math.round(elevationGain),
    duracionEnHoras: durationHours > 0 ? parseFloat(durationHours.toFixed(1)) : null,
    // Leaflet espera [lat, lon] para Polyline
    polyline: validPoints.map(p => [p.lat, p.lon]),
  };
}
