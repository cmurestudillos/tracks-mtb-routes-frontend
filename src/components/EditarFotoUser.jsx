import { useState } from 'react';
import service from '../service/config.service';
import Spinner from './Spinner';
import noImage from '../assets/no-image.png';

function EditarFotoUser({ profileFile, setProfileFile, setProfile, handleToggleUpdateImg }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async event => {
    if (!event.target.files[0]) return;
    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('image', event.target.files[0]);

    try {
      const response = await service.post('/upload?folder=users', uploadData);
      setProfileFile(response.data.imageUrl);
    } catch {
      setError('No se pudo subir la imagen. Comprueba el formato (JPG, PNG, WebP).');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const response = await service.patch('/user/image', { image: profileFile });
      setProfile(response.data);
      setProfileFile(null);
      handleToggleUpdateImg(false);
    } catch {
      setError('No se pudo guardar la imagen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="auth-field">
        <label>Selecciona una foto</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileUpload}
          disabled={isUploading}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {isUploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Spinner />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subiendo imagen...</span>
        </div>
      )}

      {error && <p className="auth-error">{error}</p>}

      {profileFile && !isUploading && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <img
            src={profileFile || noImage}
            alt="preview"
            onError={e => {
              e.target.src = noImage;
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--gradient-start)',
              marginBottom: 12,
            }}
          />
          <br />
          <button className="auth-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar como foto de perfil'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EditarFotoUser;
