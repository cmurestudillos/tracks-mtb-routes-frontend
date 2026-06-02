import { useState } from 'react';
import service from '../service/config.service';

function EditarPassword({ handleToggleUpdatePassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await service.patch('/user/password', { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => handleToggleUpdatePassword(false), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Contraseña actual</label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <div className="auth-field">
        <label>Nueva contraseña</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="mínimo 8 caracteres"
          required
          minLength={8}
        />
      </div>
      {error && <p className="auth-error">{error}</p>}
      {success && (
        <p style={{ color: 'var(--gradient-start)', fontWeight: 600, marginBottom: 8 }}>✓ Contraseña actualizada</p>
      )}
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}

export default EditarPassword;
