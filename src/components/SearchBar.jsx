import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../service/config.service';
import { SearchIcon, XIcon } from './Icons';
import noImage from '../assets/no-image.png';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce 700ms
  useEffect(() => {
    if (query.trim() === '') {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(() => {
      service
        .get(`/rutas/query?queryValue=${encodeURIComponent(query.trim())}`)
        .then(res => {
          setResults(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 700);

    return () => clearTimeout(delay);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
  };

  const handleSelect = () => {
    handleClear();
  };

  const isOpen = results !== null || loading;

  return (
    <div className="searchbar-wrapper" ref={containerRef}>
      {/* Input */}
      <div className={`searchbar-input-row ${isOpen ? 'searchbar-open' : ''}`}>
        <span className="searchbar-icon">
          <SearchIcon size={15} />
        </span>
        <input
          className="searchbar-input"
          type="text"
          autoComplete="off"
          placeholder="Buscar rutas..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && handleClear()}
        />
        {query && (
          <button className="searchbar-clear" onClick={handleClear} type="button" aria-label="Limpiar">
            <XIcon size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="searchbar-dropdown">
          {loading && (
            <div className="searchbar-loading">
              <span className="searchbar-loading-dot" />
              <span className="searchbar-loading-dot" />
              <span className="searchbar-loading-dot" />
            </div>
          )}

          {!loading && results !== null && results.length === 0 && (
            <p className="searchbar-empty">Sin resultados para &ldquo;{query}&rdquo;</p>
          )}

          {!loading && results && results.length > 0 && (
            <ul className="searchbar-results">
              {results.map(ruta => (
                <li key={ruta._id} className="searchbar-result-item">
                  <Link to={`/rutas/${ruta._id}`} className="searchbar-result-link" onClick={handleSelect}>
                    <img
                      src={ruta.image || noImage}
                      alt={ruta.name}
                      className="searchbar-result-img"
                      onError={e => {
                        e.target.src = noImage;
                      }}
                    />
                    <div className="searchbar-result-info">
                      <span className="searchbar-result-name">{ruta.name}</span>
                      <span className="searchbar-result-meta">
                        {ruta.provincia} · {ruta.difficulty} · {ruta.distanciaEnKm} km
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
