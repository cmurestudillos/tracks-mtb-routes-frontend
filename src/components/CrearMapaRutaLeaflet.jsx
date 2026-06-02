import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import ClickMarker from './ClickMarker';
import ClickMarkerEnd from './ClickMarkerEnd';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CENTER = [40.034906, -4.121625];

// Componente auxiliar que centra el mapa en el track GPX importado
function FitBoundsToTrack({ polyline }) {
  const map = useMap();
  useEffect(() => {
    if (polyline && polyline.length > 1) {
      map.fitBounds(polyline, { padding: [20, 20] });
    }
  }, [polyline, map]);
  return null;
}

function CrearMapaRutaLeaflet({ setCoordinatesStart, setCoordinatesEnd, gpxPolyline, gpxStart, gpxEnd }) {
  const [clickedPositionStart, setClickedPositionStart] = useState(gpxStart || null);
  const [clickedPositionEnd, setClickedPositionEnd] = useState(gpxEnd || null);

  // Sincronizar marcadores cuando llegan datos del GPX
  useEffect(() => {
    if (gpxStart) {
      setClickedPositionStart(gpxStart); // [lat, lon] para Leaflet
      setCoordinatesStart(gpxStart);     // [lat, lon] igual que rutas manuales
    }
    if (gpxEnd) {
      setClickedPositionEnd(gpxEnd);     // [lat, lon] para Leaflet
      setCoordinatesEnd(gpxEnd);         // [lat, lon] igual que rutas manuales
    }
  }, [gpxStart, gpxEnd, setCoordinatesStart, setCoordinatesEnd]);

  const hasGpx = gpxPolyline && gpxPolyline.length > 1;

  return (
    <div className="mapas-leaflet">
      {/* Mapa único cuando hay GPX (muestra el track completo) */}
      {hasGpx ? (
        <div>
          <p className="mapa-label">
            🗺️ Track completo importado
            <span style={{ color: 'var(--gradient-start)', fontWeight: 700, marginLeft: 8 }}>
              ✓ {gpxPolyline.length.toLocaleString()} puntos GPS
            </span>
          </p>
          <div className="mapa-wrapper">
            <MapContainer center={CENTER} zoom={6} scrollWheelZoom={true}>
              <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
              <FitBoundsToTrack polyline={gpxPolyline} />
              {/* Track completo */}
              <Polyline positions={gpxPolyline} pathOptions={{ color: '#d53369', weight: 3, opacity: 0.85 }} />
              {/* Marcadores inicio/fin */}
              {clickedPositionStart && <Marker position={clickedPositionStart} />}
              {clickedPositionEnd && <Marker position={clickedPositionEnd} />}
            </MapContainer>
          </div>
        </div>
      ) : (
        /* Sin GPX: dos mapas para marcar inicio y fin manualmente */
        <>
          <div>
            <p className="mapa-label">
              📍 Punto de inicio{' '}
              {clickedPositionStart && (
                <span style={{ color: 'var(--gradient-start)', fontWeight: 700 }}>✓ marcado</span>
              )}
            </p>
            <div className="mapa-wrapper">
              <MapContainer center={CENTER} zoom={5} scrollWheelZoom={true}>
                <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
                <ClickMarker
                  setClickedPositionStart={setClickedPositionStart}
                  setCoordinatesStart={setCoordinatesStart}
                />
                {clickedPositionStart && <Marker position={clickedPositionStart} />}
              </MapContainer>
            </div>
          </div>

          <div>
            <p className="mapa-label">
              🏁 Punto final{' '}
              {clickedPositionEnd && <span style={{ color: 'var(--gradient-start)', fontWeight: 700 }}>✓ marcado</span>}
            </p>
            <div className="mapa-wrapper">
              <MapContainer center={CENTER} zoom={5} scrollWheelZoom={true}>
                <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
                <ClickMarkerEnd setClickedPositionEnd={setClickedPositionEnd} setCoordinatesEnd={setCoordinatesEnd} />
                {clickedPositionEnd && <Marker position={clickedPositionEnd} />}
              </MapContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CrearMapaRutaLeaflet;
