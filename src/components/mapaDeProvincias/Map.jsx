import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import mapdata from '../../../utils/mapdata';
import { Link } from 'react-router-dom';

function Map() {
  const [hoveredProvince, setHoveredProvince] = useState(null);

  return (
    <div className="province-map">
      {/* Tooltip de provincia activa */}
      <div className="province-tooltip">
        {hoveredProvince
          ? `📍 ${hoveredProvince[0].toUpperCase()}${hoveredProvince.slice(1)}`
          : 'Pasa el cursor sobre una provincia'}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2200, center: [-3.5, 40] }}
        width={800}
        height={520}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <Geographies geography={mapdata.data}>
          {({ geographies }) =>
            geographies.map(geo => {
              const name = geo.properties.NAME_2;
              return (
                <Link
                  to={`/rutas/provincia/${name}`}
                  key={geo.rsmKey}
                  onMouseEnter={() => setHoveredProvince(name)}
                  onMouseLeave={() => setHoveredProvince(null)}>
                  <Geography
                    geography={geo}
                    style={{
                      default: {
                        fill: 'rgba(255,255,255,0.8)',
                        stroke: 'rgba(213,51,105,0.4)',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#daae51',
                        stroke: '#d53369',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      },
                      pressed: {
                        fill: '#d53369',
                        stroke: '#fff',
                        strokeWidth: 0.8,
                        outline: 'none',
                      },
                    }}
                  />
                </Link>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default Map;
