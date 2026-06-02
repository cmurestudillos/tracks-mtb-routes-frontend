import { useState } from 'react';
import service from '../service/config.service';
import Spinner from './Spinner';

export default function FotoReseña(props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async event => {
    if (!event.target.files[0]) return;
    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('image', event.target.files[0]);

    try {
      const response = await service.post('/upload?folder=resenas', uploadData);
      props.setImage(response.data.imageUrl);
    } catch {
      setError('No se pudo subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label>Imagen: </label>
      <input type="file" name="image" onChange={handleFileUpload} disabled={isUploading} />
      {isUploading && <Spinner />}
      {error && <p className="auth-error">{error}</p>}
      {props.image && <img src={props.image} alt="preview" width={200} />}
    </div>
  );
}
