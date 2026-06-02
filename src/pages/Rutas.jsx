import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import service from '../service/config.service';
import Spinner from '../components/Spinner';
import { ArrowLeftIcon } from '../components/Icons';
import noImage from '../assets/no-image.png';

const DIFFICULTY_BADGE = {
  fácil: { label: 'Fácil', color: '#22c55e' },
  media: { label: 'Media', color: '#f59e0b' },
  difícil: { label: 'Difícil', color: '#f97316' },
  profesional: { label: 'Profesional', color: '#ef4444' },
};

function Rutas() {
  const [rutas, setRutas] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    service
      .get('/rutas')
      .then(res => setRutas(res.data.rutas || []))
      .catch(() => setError(true));
  }, []);

  if (error) return <p style={{ padding: 20 }}>No se pudieron cargar las rutas.</p>;
  if (rutas === null) return <Spinner />;

  const badge = DIFFICULTY_BADGE;

  return (
    <div className="rutas-page">
      {/* Cabecera */}
      <div className="rutas-header">
        <button onClick={() => navigate(-1)} className="btn-atras">
          <ArrowLeftIcon size={16} />
          Volver
        </button>
        <div>
          <h1 className="rutas-title">Rutas MTB</h1>
          <p className="rutas-subtitle">
            {rutas.length === 0
              ? 'Sin rutas todavía'
              : `${rutas.length} ruta${rutas.length !== 1 ? 's' : ''} disponibles`}
          </p>
        </div>
      </div>

      {/* Grid de tarjetas */}
      {rutas.length === 0 ? (
        <div className="rutas-empty">
          <p>Aún no hay rutas publicadas.</p>
          <Link to="/crear-ruta">
            <button>Crea la primera ruta</button>
          </Link>
        </div>
      ) : (
        <div className="rutas-grid">
          {rutas.map(ruta => {
            const diff = badge[ruta.difficulty] ?? { label: ruta.difficulty, color: '#6b7280' };
            return (
              <Link to={`/rutas/${ruta._id}`} key={ruta._id} className="ruta-card-link">
                <div className="ruta-card">
                  {/* Imagen */}
                  <div className="ruta-card-img-wrapper">
                    <img
                      src={ruta.image || noImage}
                      alt={ruta.name}
                      className="ruta-card-img"
                      onError={e => {
                        e.target.src = noImage;
                      }}
                    />
                    {/* Badge de dificultad */}
                    <span className="ruta-card-badge" style={{ background: diff.color }}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="ruta-card-body">
                    <h3 className="ruta-card-name">{ruta.name}</h3>

                    <p className="ruta-card-meta">
                      📍 {ruta.provincia[0].toUpperCase() + ruta.provincia.slice(1)} · {ruta.modalidad}
                    </p>

                    {/* Stats */}
                    <div className="ruta-card-stats">
                      <span>
                        <strong>{ruta.distanciaEnKm}</strong> km
                      </span>
                      <span>
                        <strong>{ruta.desnivelEnM}</strong> m
                      </span>
                      <span>
                        <strong>{ruta.duracionEnHoras}</strong> h
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Rutas;
