import { useState } from 'react';
import service from '../service/config.service';

function EditarUsername({ profile, setProfile, handleToggleUpdateUsername }) {
  const [username, setUsername] = useState(profile.username);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await service.patch('/user/username', { username });
      setProfile(response.data);
      handleToggleUpdateUsername(false);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Nuevo username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="tu_username"
          required
          minLength={3}
          maxLength={30}
        />
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}

export default EditarUsername;
