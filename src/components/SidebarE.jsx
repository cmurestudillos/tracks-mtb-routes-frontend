import { useState, useContext } from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { LogOutIcon, HomeIcon, PlusCircleIcon, UserIcon, RouteIcon } from './Icons';

const NAV_ITEMS = [
  { to: '/', icon: <HomeIcon size={18} />, label: 'Inicio' },
  { to: '/crear-ruta', icon: <PlusCircleIcon size={18} />, label: 'Crear ruta' },
  { to: '/rutas', icon: <RouteIcon size={18} />, label: 'Todas las rutas' },
  { to: '/profile', icon: <UserIcon size={18} />, label: 'Mi perfil' },
  { to: '/user-rutas', icon: <RouteIcon size={18} />, label: 'Mis rutas' },
];

function SidebarE() {
  const [isOpen, setIsOpen] = useState(false);
  const { authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    close();
    localStorage.removeItem('authToken');
    authenticateUser();
    navigate('/');
  };

  return (
    <Menu isOpen={isOpen} onStateChange={state => setIsOpen(state.isOpen)} width={260}>
      {/* Cabecera del sidebar */}
      <div className="sidebar-header">
        <span className="sidebar-logo">
          Tracks <strong>MTB</strong>
        </span>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <Link key={item.to} to={item.to} className="sidebar-nav-item" onClick={close}>
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOutIcon size={18} />
          Cerrar sesión
        </button>
      </div>
    </Menu>
  );
}

export default SidebarE;
