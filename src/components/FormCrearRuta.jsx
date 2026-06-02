import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../service/config.service';
import CrearMapaRutaLeaflet from './CrearMapaRutaLeaflet';
import provinciasJson from '../assets/data/comunidades.json';
import FotoRuta from './FotoRuta';

function FormCrearRuta() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [distanciaEnKm, setDistanciaenKm] = useState('');
  const [desnivelEnM, setDesnivelEnM] = useState('');
  const [duracionEnHoras, setDuracionEnHoras] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [image, setImage] = useState();
  const [coordinatesStart, setCoordinatesStart] = useState();
  const [coordinatesEnd, setCoordinatesEnd] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await service.post('/rutas', {
        name,
        difficulty,
        distanciaEnKm,
        desnivelEnM,
        duracionEnHoras,
        modalidad,
        provincia,
        image,
        coordinatesStart,
        coordinatesEnd,
      });
      navigate('/rutas');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la ruta. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ruta-form">
      {/* Sección 1 — Información básica */}
      <div className="ruta-form-card">
        <h3 className="ruta-form-section-title">
          <span className="ruta-form-section-icon">📝</span>
          Información básica
        </h3>

        <div className="ruta-field">
          <label className="ruta-label">Nombre de la ruta</label>
          <input
            className="ruta-input"
            required
            type="text"
            placeholder="ej: Sierra de Guadarrama — Circular"
            onChange={e => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="ruta-grid-2">
          <div className="ruta-field">
            <label className="ruta-label">Dificultad</label>
            <select className="ruta-select" required onChange={e => setDifficulty(e.target.value)} value={difficulty}>
              <option value="">Seleccionar</option>
              <option value="fácil">🟢 Fácil</option>
              <option value="media">🟡 Media</option>
              <option value="difícil">🟠 Difícil</option>
              <option value="profesional">🔴 Profesional</option>
            </select>
          </div>

          <div className="ruta-field">
            <label className="ruta-label">Modalidad</label>
            <select className="ruta-select" required onChange={e => setModalidad(e.target.value)} value={modalidad}>
              <option value="">Seleccionar</option>
              <option value="montaña">🏔 Montaña</option>
              <option value="urbano">🏙 Urbano</option>
              <option value="carretera">🛣 Carretera</option>
              <option value="gravel">🪨 Gravel</option>
            </select>
          </div>
        </div>

        <div className="ruta-field">
          <label className="ruta-label">Provincia</label>
          <select className="ruta-select" required onChange={e => setProvincia(e.target.value)} value={provincia}>
            <option value="">Selecciona una provincia</option>
            {provinciasJson.provincias.map(p => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sección 2 — Estadísticas */}
      <div className="ruta-form-card">
        <h3 className="ruta-form-section-title">
          <span className="ruta-form-section-icon">📊</span>
          Estadísticas
        </h3>

        <div className="ruta-grid-3">
          <div className="ruta-field">
            <label className="ruta-label">Distancia</label>
            <div className="ruta-input-unit">
              <input
                className="ruta-input"
                required
                type="number"
                min="0.1"
                step="0.1"
                placeholder="0"
                onChange={e => setDistanciaenKm(e.target.value)}
                value={distanciaEnKm}
              />
              <span className="ruta-unit">km</span>
            </div>
          </div>

          <div className="ruta-field">
            <label className="ruta-label">Desnivel</label>
            <div className="ruta-input-unit">
              <input
                className="ruta-input"
                required
                type="number"
                min="0"
                placeholder="0"
                onChange={e => setDesnivelEnM(e.target.value)}
                value={desnivelEnM}
              />
              <span className="ruta-unit">m</span>
            </div>
          </div>

          <div className="ruta-field">
            <label className="ruta-label">Duración</label>
            <div className="ruta-input-unit">
              <input
                className="ruta-input"
                required
                type="number"
                min="0.1"
                step="0.5"
                placeholder="0"
                onChange={e => setDuracionEnHoras(e.target.value)}
                value={duracionEnHoras}
              />
              <span className="ruta-unit">h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 3 — Imagen */}
      <div className="ruta-form-card">
        <h3 className="ruta-form-section-title">
          <span className="ruta-form-section-icon">📸</span>
          Imagen de portada
        </h3>
        <p className="ruta-form-hint">Sube una foto representativa de la ruta (JPG, PNG, WebP — máx 5MB)</p>
        <FotoRuta setImage={setImage} image={image} />
      </div>

      {/* Sección 4 — Mapa */}
      <div className="ruta-form-card">
        <h3 className="ruta-form-section-title">
          <span className="ruta-form-section-icon">🗺️</span>
          Traza tu ruta
        </h3>
        <p className="ruta-form-hint">Haz click en el mapa para marcar el punto de inicio y el punto final.</p>
        <CrearMapaRutaLeaflet setCoordinatesStart={setCoordinatesStart} setCoordinatesEnd={setCoordinatesEnd} />
      </div>

      {/* Submit */}
      {error && (
        <p className="auth-error" style={{ maxWidth: 680, margin: '0 auto 12px' }}>
          {error}
        </p>
      )}
      <div className="ruta-form-submit">
        <button type="submit" className="ruta-submit-btn" disabled={loading}>
          {loading ? 'Creando ruta...' : 'Publicar ruta'}
        </button>
      </div>
    </form>
  );
}

export default FormCrearRuta;
