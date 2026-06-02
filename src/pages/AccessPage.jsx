import { useState } from 'react';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import TextoSinLogin from '../components/TextoSinLogin';

function AccessPage() {
  const [cualFormSeVe, setCualFormSeVe] = useState(null);

  return (
    <div className="access-page">
      <div className="access-hero">
        <h1>Tracks MTB Routes</h1>
        <TextoSinLogin />
      </div>

      {cualFormSeVe === null && (
        <div className="access-actions">
          <button className="access-btn access-btn-secondary" onClick={() => setCualFormSeVe('login')} type="button">
            Acceder
          </button>
          <button className="access-btn access-btn-primary" onClick={() => setCualFormSeVe('signup')} type="button">
            Crear cuenta
          </button>
        </div>
      )}

      {cualFormSeVe !== null && (
        <div className="access-forms">
          {cualFormSeVe === 'signup' ? (
            <>
              <Signup setCualFormSeVe={setCualFormSeVe} />
              <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => setCualFormSeVe('login')}
                  style={{
                    background: 'none',
                    boxShadow: 'none',
                    color: 'var(--gradient-start)',
                    padding: 0,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}>
                  Acceder
                </button>
              </p>
            </>
          ) : (
            <>
              <Login />
              <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setCualFormSeVe('signup')}
                  style={{
                    background: 'none',
                    boxShadow: 'none',
                    color: 'var(--gradient-start)',
                    padding: 0,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}>
                  Registrarse
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AccessPage;
