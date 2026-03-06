/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import '../assets/css/Loader.css';

import fondoMenu from '../assets/img/fondo-splash.webp';
import logoApp from '../assets/img/logo-pagina.webp';
import logoDatosAbiertos from '../assets/img/datos-abiertos.webp';

const TenerifeMap = lazy(() => import('../pages/TenerifeMap'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Home = lazy(() => import('../pages/Home'));

const FallbackLoader = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #ccc',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Componente raíz que maneja el enrutamiento y la pantalla de carga principal (Splash Screen).
 */
function App() {

  /* ========================================== */
  /* ESTADOS Y REFERENCIAS                      */
  /* ========================================== */

  const [isAppReady, setIsAppReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  /* ========================================== */
  /* EFECTOS Y CICLO DE VIDA                    */
  /* ========================================== */

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        const imagesToPreload = [fondoMenu, logoApp, logoDatosAbiertos];

        const preloadImage = (src: string) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
          });
        };

        await Promise.all(imagesToPreload.map(preloadImage));

        if (isMounted) setImagesLoaded(true);

        // Darle un poco más de tiempo al DOM para renderizar las imágenes precargadas
        await new Promise(resolve => setTimeout(resolve, 400));

        // Ocultar splash nativo (con try/catch interno por si en Android lanza error y nos salta el timeout)
        try {
          await SplashScreen.hide();
        } catch (splashError) {
          console.warn("Aviso al ocultar splash nativo:", splashError);
        }

        // Mantener la pantalla de carga (lápiz) al menos 6 segundos
        await new Promise(resolve => setTimeout(resolve, 6000));

        if (isMounted) setIsAppReady(true);

      } catch (error) {
        console.error("Error iniciando app:", error);
        // Si hay error en la precarga de imágenes, intentamos ocultar y salir
        try {
          await SplashScreen.hide();
        } catch (e) {
          // ignorar
        }
        if (isMounted) setIsAppReady(true);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  if (!isAppReady) {
    return (
      <main style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0a192f',
        backgroundImage: imagesLoaded ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url(${fondoMenu})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden'
      }}>
        {imagesLoaded && (
          <>
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
              <img
                src={logoApp}
                alt="Logo GeoLearn Tenerife"
                style={{
                  width: 'min(85vw, 450px)',
                  height: 'auto',
                  filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))'
                }}
              />
            </div>

            <div
              style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              role="status"
              aria-live="polite"
              aria-label="Cargando aplicación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="pencil">
                <defs>
                  <clipPath id="pencil-eraser">
                    <rect height="30" width="30" ry="5" rx="5"></rect>
                  </clipPath>
                </defs>
                <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth="2" stroke="currentColor" fill="none" r="70" className="pencil__stroke"></circle>
                <g transform="translate(100,100)" className="pencil__rotate">
                  <g fill="none">
                    <circle transform="rotate(-90)" strokeDashoffset="402" strokeDasharray="402.12 402.12" strokeWidth="30" stroke="hsl(223,90%,50%)" r="64" className="pencil__body1"></circle>
                    <circle transform="rotate(-90)" strokeDashoffset="465" strokeDasharray="464.96 464.96" strokeWidth="10" stroke="hsl(223,90%,60%)" r="74" className="pencil__body2"></circle>
                    <circle transform="rotate(-90)" strokeDashoffset="339" strokeDasharray="339.29 339.29" strokeWidth="10" stroke="hsl(223,90%,40%)" r="54" className="pencil__body3"></circle>
                  </g>
                  <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                    <g className="pencil__eraser-skew">
                      <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
                      <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
                      <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                      <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                      <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                      <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
                      <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
                    </g>
                  </g>
                  <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                    <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                    <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                    <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
                  </g>
                </g>
              </svg>
            </div>

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '20px',
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
              paddingTop: '60px',
              background: 'linear-gradient(to top, rgba(10, 25, 47, 1) 0%, rgba(19, 103, 211, 0.4) 60%, transparent 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              pointerEvents: 'none'
            }}>
              <img
                src={logoDatosAbiertos}
                alt="Cabildo de Tenerife"
                style={{ width: '120px', height: 'auto', opacity: 0.9, filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </>
        )}
      </main>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={
          <Suspense fallback={<FallbackLoader />}>
            <TenerifeMap />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<FallbackLoader />}>
            <Dashboard />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;