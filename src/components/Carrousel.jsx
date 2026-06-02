import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../service/config.service';
import { Carousel } from 'react-bootstrap';
import Spinner from './Spinner';
import noImage from '../assets/no-image.png';

const DIFFICULTY_LABEL = {
  fácil: '🟢 Fácil',
  media: '🟡 Media',
  difícil: '🟠 Difícil',
  profesional: '🔴 Profesional',
};

function Carrousel() {
  const [mainRutas, setMainRutas] = useState(null);
  const [error, setError] = useState(false);

  const shuffleArray = array => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    service
      .get('/rutas')
      .then(res => setMainRutas(shuffleArray(res.data.rutas || [])))
      .catch(() => setError(true));
  }, []);

  if (error) return null;
  if (mainRutas === null) return <Spinner />;

  const slides = mainRutas.slice(0, 6);
  if (slides.length === 0) return null;

  return (
    <div className="hero-carousel">
      <Carousel fade interval={3500} controls={slides.length > 1} indicators={slides.length > 1}>
        {slides.map(ruta => (
          <Carousel.Item key={ruta._id}>
            <Link to={`/rutas/${ruta._id}`} className="hero-slide-link">
              <div className="hero-slide">
                <img
                  src={ruta.image || noImage}
                  alt={ruta.name}
                  className="hero-slide-img"
                  onError={e => {
                    e.target.src = noImage;
                  }}
                />
                {/* Overlay gradiente */}
                <div className="hero-slide-overlay" />
              </div>
            </Link>

            {/* Caption sobre el overlay */}
            <Carousel.Caption className="hero-caption">
              <div className="hero-caption-badges">
                {ruta.difficulty && (
                  <span className="hero-badge">{DIFFICULTY_LABEL[ruta.difficulty] ?? ruta.difficulty}</span>
                )}
                {ruta.modalidad && <span className="hero-badge hero-badge-secondary">{ruta.modalidad}</span>}
              </div>
              <h2 className="hero-caption-title">{ruta.name}</h2>
              <p className="hero-caption-meta">
                📍 {ruta.provincia?.[0]?.toUpperCase()}
                {ruta.provincia?.slice(1)}
                {' · '}
                {ruta.distanciaEnKm} km
                {' · '}
                {ruta.duracionEnHoras} h
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Carrousel;
