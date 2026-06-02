import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../../service/config.service';
import { AuthContext } from '../../context/auth.context';

function Login() {
  const { authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCredentialChange = event => setCredential(event.target.value);
  const handlePasswordChange = event => setPassword(event.target.value);

  const handleLogin = async event => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await service.post('/auth/login', { credential, password });
      localStorage.setItem('authToken', response.data.authToken);
      await authenticateUser();
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400 || status === 401 || status === 403) {
        setErrorMessage(message || 'Credenciales incorrectas');
      } else {
        navigate('/error500');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Acceder</h2>
      <form onSubmit={handleLogin}>
        <div className="auth-field">
          <label>Email o Username</label>
          <input
            type="text"
            name="credential"
            value={credential}
            onChange={handleCredentialChange}
            placeholder="email o username"
            required
          />
        </div>
        <div className="auth-field">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            required
          />
        </div>
        {errorMessage && <p className="auth-error">{errorMessage}</p>}
        <button type="submit" className="auth-btn">
          Acceder
        </button>
      </form>
    </div>
  );
}

export default Login;
