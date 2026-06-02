import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import ClickMarker from './ClickMarker';
import ClickMarkerEnd from './ClickMarkerEnd';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CENTER = [40.034906, -4.121625];

function CrearMapaRutaLeaflet({ setCoordinatesStart, setCoordinatesEnd }) {
  const [clickedPositionStart, setClickedPositionStart] = useState(null);
  const [clickedPositionEnd, setClickedPositionEnd] = useState(null);

  return (
    <div className="mapas-leaflet">
      {/* Mapa inicio */}
      <div>
        <p className="mapa-label">
          📍 Punto de inicio{' '}
          {clickedPositionStart && <span style={{ color: 'var(--gradient-start)', fontWeight: 700 }}>✓ marcado</span>}
        </p>
        <div className="mapa-wrapper">
          <MapContainer center={CENTER} zoom={5} scrollWheelZoom={true}>
            <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
            <ClickMarker setClickedPositionStart={setClickedPositionStart} setCoordinatesStart={setCoordinatesStart} />
            {clickedPositionStart && <Marker position={clickedPositionStart} />}
          </MapContainer>
        </div>
      </div>

      {/* Mapa fin */}
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
    </div>
  );
}

export default CrearMapaRutaLeaflet;
