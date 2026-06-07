import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Polyline, useMap } from 'react-leaflet';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
});

function MostrarRuta({ detallesRuta }) {
  const map = useMap();
  const hasTrack = detallesRuta.trackPoints?.length > 1;

  useEffect(() => {
    if (hasTrack) {
      const bounds = L.latLngBounds(detallesRuta.trackPoints.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [30, 30] });
      return;
    }

    if (!detallesRuta.coordinatesStart?.length || !detallesRuta.coordinatesEnd?.length) return;

    const routingControl = L.Routing.control({
      routeWhileDragging: false,
      lineOptions: { addWaypoints: false },
      show: false,
      plan: L.Routing.plan(
        [L.latLng(...detallesRuta.coordinatesStart), L.latLng(...detallesRuta.coordinatesEnd)],
        { draggableWaypoints: false, addWaypoints: false }
      ),
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, hasTrack]);

  if (hasTrack) {
    return <Polyline positions={detallesRuta.trackPoints} color="#3b82f6" weight={3} />;
  }

  return null;
}

export default MostrarRuta;
