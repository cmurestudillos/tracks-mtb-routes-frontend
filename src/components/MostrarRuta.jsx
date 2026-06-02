import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
});

function MostrarRuta(props) {
  const map = useMap();
  const { detallesRuta } = props;

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      routeWhileDragging: false,
      lineOptions: { addWaypoints: false },
      show: false,
      plan: L.Routing.plan([L.latLng(...detallesRuta.coordinatesStart), L.latLng(...detallesRuta.coordinatesEnd)], {
        draggableWaypoints: false,
        addWaypoints: false,
      }),
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map]);

  return null;
}

export default MostrarRuta;
