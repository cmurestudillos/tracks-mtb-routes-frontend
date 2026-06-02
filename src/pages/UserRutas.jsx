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

function UserRutas() {
  const [tusRutas, setTusRutas] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    service
      .get('/rutas/user')
      .then(res => setTusRutas(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true));
  }, []);

  if (error) return <p style={{ padding: 20 }}>No se pudieron cargar tus rutas.</p>;
  if (tusRutas === null) return <Spinner />;

  return (
    <div className="rutas-page">
      {/* Cabecera */}
      <div className="rutas-header">
        <button onClick={() => navigate(-1)} className="btn-atras">
          <ArrowLeftIcon size={16} />
          Volver
        </button>
        <div className="user-rutas-header-right">
          <div>
            <h1 className="rutas-title">Mis rutas</h1>
            <p className="rutas-subtitle">
              {tusRutas.length === 0
                ? 'Todavía no has creado ninguna ruta'
                : `${tusRutas.length} ruta${tusRutas.length !== 1 ? 's' : ''} creadas`}
            </p>
          </div>
          <Link to="/crear-ruta">
            <button className="ruta-submit-btn" style={{ padding: '10px 22px', fontSize: '0.875rem' }}>
              + Nueva ruta
            </button>
          </Link>
        </div>
      </div>

      {/* Vacío */}
      {tusRutas.length === 0 ? (
        <div className="rutas-empty">
          <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>🚵</p>
          <p>Aún no has creado ninguna ruta.</p>
          <Link to="/crear-ruta">
            <button style={{ marginTop: 8 }}>Crea tu primera ruta</button>
          </Link>
        </div>
      ) : (
        <div className="rutas-grid">
          {tusRutas.map(ruta => {
            const diff = DIFFICULTY_BADGE[ruta.difficulty] ?? { label: ruta.difficulty, color: '#6b7280' };
            return (
              <Link to={`/rutas/${ruta._id}`} key={ruta._id} className="ruta-card-link">
                <div className="ruta-card">
                  <div className="ruta-card-img-wrapper">
                    <img
                      src={ruta.image || noImage}
                      alt={ruta.name}
                      className="ruta-card-img"
                      onError={e => {
                        e.target.src = noImage;
                      }}
                    />
                    <span className="ruta-card-badge" style={{ background: diff.color }}>
                      {diff.label}
                    </span>
                    {/* Indicador "mía" */}
                    <span className="ruta-card-mine">✎ Mía</span>
                  </div>
                  <div className="ruta-card-body">
                    <h3 className="ruta-card-name">{ruta.name}</h3>
                    <p className="ruta-card-meta">
                      📍 {ruta.provincia[0].toUpperCase() + ruta.provincia.slice(1)} · {ruta.modalidad}
                    </p>
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

export default UserRutas;
