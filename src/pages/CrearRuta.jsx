import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import FormCrearRuta from '../components/FormCrearRuta';
import { ArrowLeftIcon } from '../components/Icons';

function CrearRuta() {
  const navigate = useNavigate();

  return (
    <div className="crear-ruta-page">
      <div className="crear-ruta-header">
        <button onClick={() => navigate(-1)} className="btn-atras">
          <ArrowLeftIcon size={16} />
          Volver
        </button>
        <div>
          <h1 className="crear-ruta-title">Nueva ruta MTB</h1>
          <p className="crear-ruta-subtitle">Diseña y comparte tu recorrido favorito</p>
        </div>
      </div>

      <FormCrearRuta />
    </div>
  );
}

export default CrearRuta;
