import { useMapEvents } from 'react-leaflet/hooks';

function ClickMarker({ setClickedPositionStart, setCoordinatesStart }) {
  useMapEvents({
    click: event => {
      const obj = event.latlng;
      setClickedPositionStart([obj.lat.toFixed(5), obj.lng.toFixed(5)]);
      setCoordinatesStart([obj.lat.toFixed(5), obj.lng.toFixed(5)]);
    },
  });
  return null;
}

export default ClickMarker;
