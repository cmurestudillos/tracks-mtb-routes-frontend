import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import service from '../service/config.service';
import Spinner from '../components/Spinner';
import { ArrowLeftIcon } from '../components/Icons';

function RutasProvincia() {
  const [rutasProvincia, setRutasProvincia] = useState(null);
  const [error, setError] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    service
      .get(`/rutas/query?queryValue=${params.provincia}`)
      .then(res => setRutasProvincia(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true));
  }, [params.provincia]);

  if (error) return <p style={{ padding: 20 }}>No se pudieron cargar las rutas.</p>;
  if (rutasProvincia === null) return <Spinner />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-atras">
        <ArrowLeftIcon size={16} />
        Volver
      </button>
      <h2 style={{ textTransform: 'capitalize' }}>{params.provincia}</h2>
      <div className="card-container2">
        {rutasProvincia.length === 0 ? (
          <h3>Aún no hay rutas en esta provincia.</h3>
        ) : (
          rutasProvincia.map(eachRuta => (
            <Link to={`/rutas/${eachRuta._id}`} key={eachRuta._id}>
              <div className="card2">
                <h3>{eachRuta.name[0].toUpperCase() + eachRuta.name.slice(1)}</h3>
                <img src={eachRuta.image} alt="imagen ruta" width="150px" />
                <h4>Dificultad: {eachRuta.difficulty[0].toUpperCase() + eachRuta.difficulty.slice(1)}</h4>
                <h4>Modalidad: {eachRuta.modalidad[0].toUpperCase() + eachRuta.modalidad.slice(1)}</h4>
                <p>Provincia: {eachRuta.provincia[0].toUpperCase() + eachRuta.provincia.slice(1)}</p>
                <p>Km: {eachRuta.distanciaEnKm}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default RutasProvincia;
