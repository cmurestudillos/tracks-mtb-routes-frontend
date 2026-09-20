import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './PWAPrompt.css';

const INSTALL_DISMISSED_KEY = 'pwaInstallDismissed';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

/**
 * Avisos de la PWA: instalación, app lista para usar sin conexión
 * y nueva versión disponible.
 */
function PWAPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [installEvent, setInstallEvent] = useState(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true' || isStandalone()) return;

    // iOS no dispara beforeinstallprompt: hay que explicar el paso manual
    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const handleBeforeInstall = event => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const handleInstalled = () => setInstallEvent(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const dismissInstall = () => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setInstallEvent(null);
    setShowIosHint(false);
  };

  const closeToast = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (needRefresh) {
    return (
      <div className="pwa-toast" role="alert" aria-live="polite">
        <p className="pwa-toast-text">Hay una nueva versión de Tracks MTB.</p>
        <div className="pwa-toast-actions">
          <button className="pwa-btn pwa-btn-primary" onClick={() => updateServiceWorker(true)}>
            Actualizar
          </button>
          <button className="pwa-btn" onClick={closeToast}>
            Ahora no
          </button>
        </div>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div className="pwa-toast" role="status" aria-live="polite">
        <p className="pwa-toast-text">La app ya funciona sin conexión.</p>
        <div className="pwa-toast-actions">
          <button className="pwa-btn" onClick={closeToast}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (installEvent) {
    return (
      <div className="pwa-toast" role="dialog" aria-label="Instalar aplicación">
        <p className="pwa-toast-text">Instala Tracks MTB en tu dispositivo y úsala como una app más.</p>
        <div className="pwa-toast-actions">
          <button className="pwa-btn pwa-btn-primary" onClick={handleInstall}>
            Instalar
          </button>
          <button className="pwa-btn" onClick={dismissInstall}>
            No, gracias
          </button>
        </div>
      </div>
    );
  }

  if (showIosHint) {
    return (
      <div className="pwa-toast" role="dialog" aria-label="Instalar aplicación">
        <p className="pwa-toast-text">
          Para instalar la app: pulsa <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>.
        </p>
        <div className="pwa-toast-actions">
          <button className="pwa-btn" onClick={dismissInstall}>
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default PWAPrompt;
