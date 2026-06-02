import { useState } from 'react';
import service from '../service/config.service';

function EditarEmail({ profile, setProfile, handleToggleUpdateEmail }) {
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await service.patch('/user/email', { email, password });
      setProfile(response.data);
      handleToggleUpdateEmail(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Nuevo email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>
      <div className="auth-field">
        <label>Confirma con tu contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}

export default EditarEmail;
