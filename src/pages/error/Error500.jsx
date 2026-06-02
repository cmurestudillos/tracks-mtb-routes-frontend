import { useNavigate } from 'react-router-dom';

function Error500() {
  const navigate = useNavigate();

  const handleHome = () => navigate('/');
  return (
    <div>
      {/* <Spinner /> */}
      <h1>ERROR AL CONECTAR CON EL SERVIDOR. VUELVE A INTENTARLO EN UNOS MINUTOS</h1>

      <button onClick={handleHome}>VUELVE AL INICIO</button>
    </div>
  );
}

export default Error500;
