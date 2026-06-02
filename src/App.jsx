import './App.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CrearRuta from './pages/CrearRuta';
import DetallesRuta from './pages/DetallesRuta';
import Rutas from './pages/Rutas';
import RutasProvincia from './pages/RutasProvincia';
import UserProfile from './pages/UserProfile';
import UserRutas from './pages/UserRutas';
import Error404 from './pages/error/Error404';
import Error500 from './pages/error/Error500';
import NavbarComp from './components/NavbarComp';
import Footer from './components/Footer';
import { AuthContext } from './context/auth.context';
import { useContext } from 'react';
import AccessPage from './pages/AccessPage';

function App() {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  return (
    <div className="app">
      <NavbarComp />
      <main className="app-main">
        <Routes>
          <Route path={'/'} element={isLoggedIn ? <Homepage /> : <AccessPage />} />
          <Route path={'/crear-ruta'} element={isLoggedIn && <CrearRuta />} />
          <Route path={'/rutas/:rutaId'} element={isLoggedIn && <DetallesRuta loggedUserId={loggedUserId} />} />
          <Route path={'/rutas'} element={isLoggedIn && <Rutas />} />
          <Route path={'/rutas/provincia/:provincia'} element={isLoggedIn && <RutasProvincia />} />
          <Route path={'/profile'} element={isLoggedIn && <UserProfile />} />
          <Route path={'/user-rutas'} element={isLoggedIn && <UserRutas loggedUserId={loggedUserId} />} />
          <Route path={'/error500'} element={<Error500 />} />
          <Route path={'*'} element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
