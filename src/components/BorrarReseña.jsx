import { useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../service/config.service';

function BorrarReseña(props) {
  const [error, setError] = useState(false);
  const params = useParams();

  const handleRemoveReview = async () => {
    try {
      await service.delete(`/reviews/${props.review._id}`);
      const res = await service.get(`/reviews/rutas/${params.rutaId}`);
      props.setReview(res.data.resenas || []);
    } catch {
      setError(true);
    }
  };

  return (
    <div>
      <button onClick={handleRemoveReview}>Borrar</button>
      {error && <p className="auth-error">No se pudo borrar la reseña.</p>}
    </div>
  );
}

export default BorrarReseña;
