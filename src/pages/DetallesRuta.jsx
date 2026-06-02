import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../service/config.service';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ArrowLeftIcon } from '../components/Icons';
import FormCrearReseña from '../components/FormCrearReseña';
import BorrarReseña from '../components/BorrarReseña';
import MostrarRuta from '../components/MostrarRuta';
import BorrarRuta from '../components/BorrarRuta';
import Spinner from '../components/Spinner';
import noImage from '../assets/no-image.png';
import { StarDisplay } from '../components/StarRating';

const DIFFICULTY_COLOR = {
  fácil: '#22c55e',
  media: '#f59e0b',
  difícil: '#f97316',
  profesional: '#ef4444',
};

function DetallesRuta({ loggedUserId }) {
  const [detallesRuta, setDetallesRuta] = useState(null);
  const [center] = useState([40.034906, -4.121625]);
  const [reviewArr, setReviewArr] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    Promise.all([service.get(`/rutas/${params.rutaId}`), service.get(`/reviews/rutas/${params.rutaId}`)])
      .then(([rutaRes, reseñasRes]) => {
        setDetallesRuta(rutaRes.data);
        setReviewArr(reseñasRes.data.resenas || []);
      })
      .catch(() => setError(true));
  }, [params.rutaId]);

  if (error) return <p style={{ padding: 20 }}>No se pudo cargar la ruta.</p>;
  if (detallesRuta === null) return <Spinner />;

  const isOwner = detallesRuta.creador?._id === loggedUserId;
  const diffColor = DIFFICULTY_COLOR[detallesRuta.difficulty] ?? '#6b7280';

  return (
    <div className="detalle-page">
      {/* Volver */}
      <button onClick={() => navigate(-1)} className="btn-atras detalle-back">
        <ArrowLeftIcon size={16} />
        Volver
      </button>

      {/* Hero image */}
      <div className="detalle-hero">
        <img
          src={detallesRuta.image || noImage}
          alt={detallesRuta.name}
          className="detalle-hero-img"
          onError={e => {
            e.target.src = noImage;
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="detalle-content">
        {/* Cabecera info */}
        <div className="detalle-info-header">
          <div>
            <h1 className="detalle-name">{detallesRuta.name}</h1>
            <p className="detalle-meta">
              Por <strong>@{detallesRuta.creador?.username}</strong> · 📍{' '}
              {detallesRuta.provincia[0].toUpperCase() + detallesRuta.provincia.slice(1)}
            </p>
          </div>
          <span className="detalle-difficulty-badge" style={{ background: diffColor }}>
            {detallesRuta.difficulty[0].toUpperCase() + detallesRuta.difficulty.slice(1)}
          </span>
        </div>

        {/* Stats */}
        <div className="detalle-stats">
          <div className="detalle-stat">
            <span className="detalle-stat-value">{detallesRuta.distanciaEnKm}</span>
            <span className="detalle-stat-label">km</span>
          </div>
          <div className="detalle-stat">
            <span className="detalle-stat-value">{detallesRuta.desnivelEnM}</span>
            <span className="detalle-stat-label">m desnivel</span>
          </div>
          <div className="detalle-stat">
            <span className="detalle-stat-value">{detallesRuta.duracionEnHoras}</span>
            <span className="detalle-stat-label">horas</span>
          </div>
          <div className="detalle-stat">
            <span className="detalle-stat-value" style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
              {detallesRuta.modalidad}
            </span>
            <span className="detalle-stat-label">modalidad</span>
          </div>
        </div>

        {/* Mapa */}
        <div className="mapa-detalles-ruta">
          <MapContainer center={center} zoom={6} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MostrarRuta detallesRuta={detallesRuta} />
          </MapContainer>
        </div>

        {/* Acciones del propietario */}
        {isOwner && (
          <div className="detalle-owner-actions">
            <BorrarRuta />
          </div>
        )}

        {/* Sección de reseñas */}
        <div className="detalle-reviews-section">
          <div className="detalle-reviews-header">
            <h2 className="detalle-reviews-title">
              Reseñas <span className="detalle-reviews-count">{reviewArr.length}</span>
            </h2>
            <button className="detalle-review-btn" onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}>
              {isReviewFormOpen ? 'Cancelar' : '+ Añadir reseña'}
            </button>
          </div>

          {/* Formulario nueva reseña */}
          {isReviewFormOpen && (
            <div className="detalle-review-form-wrapper">
              <FormCrearReseña
                detallesRuta={detallesRuta}
                setReview={setReviewArr}
                handleToggleUpdateForm={() => setIsReviewFormOpen(false)}
              />
            </div>
          )}

          {/* Lista de reseñas */}
          {reviewArr.length === 0 ? (
            <p className="detalle-reviews-empty">Sé el primero en dejar una reseña.</p>
          ) : (
            <div className="detalle-reviews-list">
              {reviewArr.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-card-header">
                    <div className="review-card-author-row">
                      <div className="review-avatar">{(review.creador?.username?.[0] ?? '?').toUpperCase()}</div>
                      <strong className="review-author">@{review.creador?.username}</strong>
                    </div>
                    {review.creador?._id === loggedUserId && (
                      <BorrarReseña review={review} setReview={setReviewArr} reviewArr={reviewArr} />
                    )}
                  </div>
                  <div className="review-rating-row">
                    <StarDisplay value={review.rating} />
                  </div>
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-description">{review.description}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt={review.title}
                      className="review-img"
                      onError={e => {
                        e.target.src = noImage;
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetallesRuta;
