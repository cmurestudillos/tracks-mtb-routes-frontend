import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/Icons';

function Error404() {
  const navigate = useNavigate();

  return (
    <div className="erro404" style={{ padding: 40, textAlign: 'center' }}>
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 900,
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
        404
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Vaya, esta página no existe.</p>
      <button onClick={() => navigate(-1)} className="btn-atras">
        <ArrowLeftIcon size={16} />
        Volver
      </button>
    </div>
  );
}

export default Error404;
