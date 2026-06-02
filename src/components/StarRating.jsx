// StarRating — selector interactivo de 1-5 estrellas
// StarDisplay — solo lectura
// Uso: <StarRating value={rating} onChange={setRating} />
//       <StarDisplay value={rating} />

export function StarRating({ value, onChange }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star-btn ${value >= star ? 'star-active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}>
          ★
        </button>
      ))}
      {value > 0 && <span className="star-value-label">{value}/5</span>}
    </div>
  );
}

export function StarDisplay({ value }) {
  if (!value) return null;
  return (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= value ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
}
