import { useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../service/config.service';
import FotoReseña from './FotoReseña';
import { StarRating } from './StarRating';

function FormCrearReseña({ detallesRuta, setReview, handleToggleUpdateForm }) {
  const params = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Selecciona una puntuación de 1 a 5 estrellas.');
      return;
    }

    setLoading(true);
    try {
      await service.post('/reviews', {
        title,
        description,
        rating,
        ruta: detallesRuta._id,
        image,
      });
      const responseReseñas = await service.get(`/reviews/rutas/${params.rutaId}`);
      setReview(responseReseñas.data.resenas || []);
      handleToggleUpdateForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo publicar la reseña.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resena-form">
      {/* Puntuación */}
      <div className="ruta-field">
        <label className="ruta-label">Puntuación</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Título */}
      <div className="ruta-field">
        <label className="ruta-label">Título</label>
        <input
          className="ruta-input"
          type="text"
          placeholder="Resume tu experiencia en pocas palabras"
          onChange={e => setTitle(e.target.value)}
          value={title}
          required
          maxLength={100}
        />
      </div>

      {/* Descripción */}
      <div className="ruta-field">
        <label className="ruta-label">Descripción</label>
        <textarea
          className="ruta-input resena-textarea"
          placeholder="Cuenta cómo fue la ruta: condiciones del terreno, puntos de interés, dificultad real..."
          onChange={e => setDescription(e.target.value)}
          value={description}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
        />
      </div>

      {/* Foto opcional */}
      <div className="ruta-field">
        <label className="ruta-label">Foto (opcional)</label>
        <FotoReseña image={image} setImage={setImage} />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          type="button"
          onClick={() => handleToggleUpdateForm(false)}
          style={{
            background: 'var(--bg)',
            color: 'var(--text)',
            border: '2px solid #e5e7eb',
            boxShadow: 'none',
            borderRadius: '50px',
            padding: '9px 20px',
          }}>
          Cancelar
        </button>
        <button
          type="submit"
          className="ruta-submit-btn"
          disabled={loading}
          style={{ padding: '9px 28px', fontSize: '0.9rem' }}>
          {loading ? 'Publicando...' : 'Publicar reseña'}
        </button>
      </div>
    </form>
  );
}

export default FormCrearReseña;
