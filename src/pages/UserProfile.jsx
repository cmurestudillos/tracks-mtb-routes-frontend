import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import service from '../service/config.service';
import noImage from '../assets/no-image.png';
import { ArrowLeftIcon } from '../components/Icons';
import EditarFotoUser from '../components/EditarFotoUser';
import EditarUsername from '../components/EditarUsername';
import EditarEmail from '../components/EditarEmail';
import EditarPassword from '../components/EditarPassword';
import Spinner from '../components/Spinner';

const EDIT_TABS = [
  { key: 'photo', label: 'Foto' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'password', label: 'Contraseña' },
];

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [profileFile, setProfileFile] = useState();
  const [editTab, setEditTab] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    service
      .get('/user')
      .then(res => {
        setProfile(res.data);
        setProfileFile(res.data.image);
      })
      .catch(() => setError(true));
  }, []);

  const toggleTab = key => setEditTab(prev => (prev === key ? null : key));

  if (error) return <p className="profile-error">No se pudo cargar el perfil.</p>;
  if (profile === null) return <Spinner />;

  const rutasCount = profile.rutasCreadas?.length ?? 0;
  const favCount = profile.rutasFav?.length ?? 0;

  return (
    <div className="profile-page">
      <button onClick={() => navigate(-1)} className="profile-back">
        <ArrowLeftIcon size={16} />
        Volver
      </button>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-wrapper">
          <img
            src={profile.image || noImage}
            alt="avatar"
            className="profile-avatar"
            onError={e => {
              e.target.src = noImage;
            }}
          />
        </div>

        {/* Info */}
        <div className="profile-info">
          <h2 className="profile-username">@{profile.username}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{rutasCount}</span>
            <span className="profile-stat-label">rutas</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-value">{favCount}</span>
            <span className="profile-stat-label">favoritas</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="profile-actions">
          <Link to="/user-rutas" className="profile-action-btn profile-action-secondary">
            Mis rutas
          </Link>
          <button
            className="profile-action-btn profile-action-primary"
            onClick={() => setEditTab(prev => (prev ? null : 'photo'))}>
            {editTab ? 'Cerrar edición' : 'Editar perfil'}
          </button>
        </div>

        {/* Sección de edición */}
        {editTab && (
          <div className="profile-edit-section">
            {/* Tabs */}
            <div className="profile-edit-tabs">
              {EDIT_TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`profile-edit-tab ${editTab === tab.key ? 'active' : ''}`}
                  onClick={() => toggleTab(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Formulario activo */}
            <div className="profile-edit-form">
              {editTab === 'photo' && (
                <EditarFotoUser
                  profileFile={profileFile}
                  setProfileFile={setProfileFile}
                  setProfile={setProfile}
                  handleToggleUpdateImg={() => setEditTab(null)}
                />
              )}
              {editTab === 'username' && (
                <EditarUsername
                  profile={profile}
                  setProfile={setProfile}
                  handleToggleUpdateUsername={() => setEditTab(null)}
                />
              )}
              {editTab === 'email' && (
                <EditarEmail
                  profile={profile}
                  setProfile={setProfile}
                  handleToggleUpdateEmail={() => setEditTab(null)}
                />
              )}
              {editTab === 'password' && (
                <EditarPassword
                  profile={profile}
                  setProfile={setProfile}
                  handleToggleUpdatePassword={() => setEditTab(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
