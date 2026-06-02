import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../service/config.service';

function BorrarRuta() {
  const [error, setError] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const handleRemoveRuta = async () => {
    try {
      await service.delete(`/rutas/${params.rutaId}`);
      navigate('/rutas');
    } catch {
      setError(true);
    }
  };

  return (
    <div>
      <button onClick={handleRemoveRuta}>Eliminar ruta</button>
      {error && <p className="auth-error">No se pudo eliminar la ruta.</p>}
    </div>
  );
}

export default BorrarRuta;
