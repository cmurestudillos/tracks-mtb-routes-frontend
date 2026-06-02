import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../../service/config.service';

function Signup({ setCualFormSeVe }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmailChange = event => setEmail(event.target.value);
  const handleUsernameChange = event => setUsername(event.target.value);
  const handlePasswordChange = event => setPassword(event.target.value);

  const handleSignup = async event => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await service.post('/auth/signup', { email, username, password });
      setCualFormSeVe('login');
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        setErrorMessage(message || 'Error en el registro');
      } else {
        navigate('/error500');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSignup}>
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className="auth-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="tu_nombre_usuario"
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
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Signup;
