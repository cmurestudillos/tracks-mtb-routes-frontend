import { useContext } from 'react';
import SearchBar from './SearchBar';
import { AuthContext } from '../context/auth.context';
import { Link, useNavigate } from 'react-router-dom';
import SidebarE from './SidebarE';
import { LogOutIcon } from './Icons';

function NavbarComp() {
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    authenticateUser();
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="menu-burger">
        {isLoggedIn && <SidebarE pageWrapID={'page-wrap'} outerContainerId={'outer-container'} />}
      </div>

      <div className="logo-search">
        <Link to={'/'} className="navbar-logo">
          <span className="navbar-logo-tracks">Tracks</span>
          <span className="navbar-logo-mtb">MTB</span>
        </Link>
        <div className="searchbar">{isLoggedIn && <SearchBar />}</div>
      </div>

      <div>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logoutbtn" title="Cerrar sesión">
            <LogOutIcon size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default NavbarComp;
