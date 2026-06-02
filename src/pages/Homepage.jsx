import { Link } from 'react-router-dom';
import MapContainer from '../components/mapaDeProvincias/MapContainer';
import Carrousel from '../components/Carrousel';

function Homepage() {
  return (
    <div className="homepage">
      {/* Hero — carrusel a pantalla completa */}
      <Carrousel />

      {/* Sección CTA */}
      <section className="homepage-cta">
        <div className="homepage-cta-inner">
          <h2 className="homepage-cta-title">Explora rutas MTB en España</h2>
          <p className="homepage-cta-text">
            Descubre recorridos creados por ciclistas de todo el país. Filtra por provincia, dificultad o modalidad y
            encuentra tu próxima aventura.
          </p>
          <Link to="/rutas">
            <button className="homepage-cta-btn">Ver todas las rutas →</button>
          </Link>
        </div>
      </section>

      {/* Sección mapa de provincias */}
      <section className="homepage-map-section">
        <div className="homepage-map-header">
          <h2 className="homepage-map-title">Explora por provincia</h2>
          <p className="homepage-map-subtitle">
            Haz click en cualquier provincia del mapa para ver las rutas disponibles
          </p>
        </div>
        <MapContainer />
      </section>
    </div>
  );
}

export default Homepage;
