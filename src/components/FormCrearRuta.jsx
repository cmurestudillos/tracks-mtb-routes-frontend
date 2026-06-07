import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import service from '../service/config.service';
import CrearMapaRutaLeaflet from './CrearMapaRutaLeaflet';
import provinciasJson from '../assets/data/comunidades.json';
import FotoRuta from './FotoRuta';
import { parseGPX } from '../utils/gpxParser';

function FormCrearRuta() {
  const navigate = useNavigate();

  // Campos del formulario
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

  // GPX
  const [gpxData, setGpxData] = useState(null); // puntos del track para preview
  const [gpxUrl, setGpxUrl] = useState(null); // URL en Vercel Blob
  const [gpxLoading, setGpxLoading] = useState(false);
  const [gpxError, setGpxError] = useState(null);
  const [gpxFileName, setGpxFileName] = useState(null);

  // Estado general
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Manejador de archivo GPX ──────────────────────────────────────────────
  const handleGPXUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    setGpxError(null);
    setGpxLoading(true);
    setGpxFileName(file.name);

    try {
      // 1. Parsear el GPX en el browser
      const text = await file.text();
      const parsed = parseGPX(text);

      // 2. Auto-rellenar campos disponibles
      if (parsed.name && !name) setName(parsed.name);
      setDistanciaenKm(String(parsed.distanciaEnKm));
      setDesnivelEnM(String(parsed.desnivelEnM));
      if (parsed.duracionEnHoras) setDuracionEnHoras(String(parsed.duracionEnHoras));
      setCoordinatesStart(parsed.coordinatesStart);
      setCoordinatesEnd(parsed.coordinatesEnd);
      setGpxData(parsed);

      // 3. Subir el GPX a Vercel Blob
      const formData = new FormData();
      formData.append('gpx', file);
      const res = await service.post('/upload/gpx', formData);
      setGpxUrl(res.data.gpxUrl);
    } catch (err) {
      setGpxError(err.message || 'Error procesando el archivo GPX.');
      setGpxData(null);
    } finally {
      setGpxLoading(false);
    }
  };

  const handleRemoveGPX = () => {
    setGpxData(null);
    setGpxUrl(null);
    setGpxFileName(null);
    setGpxError(null);
    setCoordinatesStart(undefined);
    setCoordinatesEnd(undefined);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
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
        ...(image && { image }),
        coordinatesStart,
        coordinatesEnd,
        ...(gpxUrl && { gpxUrl }),
        ...(gpxData?.polyline?.length && { trackPoints: gpxData.polyline }),
      });
      navigate('/rutas');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la ruta. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ruta-form">
      {/* Sección GPX */}
      <div className="ruta-form-card gpx-card">
        <h3 className="ruta-form-section-title">
          <span className="ruta-form-section-icon">📡</span>
          Importar desde GPX
          <span className="gpx-optional-badge">Opcional</span>
        </h3>
        <p className="ruta-form-hint">
          Sube un archivo GPX grabado con Garmin, Wahoo, Strava, Komoot o cualquier dispositivo GPS. Los campos de
          distancia, desnivel, duración y coordenadas se rellenarán automáticamente.
        </p>

        {!gpxData ? (
          <label className={`gpx-upload-area ${gpxLoading ? 'gpx-loading' : ''}`}>
            <input
              type="file"
              accept=".gpx,application/gpx+xml"
              onChange={handleGPXUpload}
              disabled={gpxLoading}
              style={{ display: 'none' }}
            />
            {gpxLoading ? (
              <span className="gpx-uploading-text">⏳ Procesando GPX...</span>
            ) : (
              <>
                <span className="gpx-upload-icon">🗂️</span>
                <span className="gpx-upload-label">
                  Haz click para seleccionar un archivo <strong>.gpx</strong>
                </span>
                <span className="gpx-upload-hint">o arrastra aquí el archivo</span>
              </>
            )}
          </label>
        ) : (
          <div className="gpx-success">
            <div className="gpx-success-info">
              <span className="gpx-success-icon">✅</span>
              <div>
                <p className="gpx-success-filename">{gpxFileName}</p>
                <p className="gpx-success-stats">
                  {distanciaEnKm} km · {desnivelEnM} m desnivel
                  {duracionEnHoras ? ` · ${duracionEnHoras} h` : ''}
                  {` · ${gpxData.points.length.toLocaleString()} puntos`}
                </p>
              </div>
            </div>
            <button type="button" className="gpx-remove-btn" onClick={handleRemoveGPX}>
              Eliminar GPX
            </button>
          </div>
        )}

        {gpxError && (
          <p className="auth-error" style={{ marginTop: 10 }}>
            {gpxError}
          </p>
        )}
      </div>

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
          {gpxData && <span className="gpx-autofill-badge">✨ Relleno automático desde GPX</span>}
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
          {gpxData ? 'Trazado importado del GPX' : 'Traza tu ruta manualmente'}
        </h3>
        <p className="ruta-form-hint">
          {gpxData
            ? `Track con ${gpxData.points.length.toLocaleString()} puntos GPS. Puedes ajustar los marcadores si lo necesitas.`
            : 'Haz click en el mapa para marcar el punto de inicio y el punto final.'}
        </p>
        <CrearMapaRutaLeaflet
          setCoordinatesStart={setCoordinatesStart}
          setCoordinatesEnd={setCoordinatesEnd}
          gpxPolyline={gpxData?.polyline}
          gpxStart={gpxData ? gpxData.coordinatesStart : null}
          gpxEnd={gpxData ? gpxData.coordinatesEnd : null}
        />
      </div>

      {error && (
        <p className="auth-error" style={{ maxWidth: 720, margin: '0 auto 12px' }}>
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
