import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import '../assets/css/Toast.css';

import fondoMenu from '../assets/img/fondo-splash.webp';
import logoApp from '../assets/img/logo-pagina.webp';
import logoDatosAbiertos from '../assets/img/datos-abiertos.webp';

const TenerifeMap = lazy(() => import('../pages/TenerifeMap'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Home = lazy(() => import('../pages/Home'));

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

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

        await new Promise(resolve => setTimeout(resolve, 150));

        await SplashScreen.hide();

        await new Promise(resolve => setTimeout(resolve, 4000));

        if (isMounted) setIsAppReady(true);

      } catch (error) {
        console.error("Error iniciando app:", error);
        await SplashScreen.hide();
        if (isMounted) setIsAppReady(true);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAppReady) {
    return (
      <main style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url(${fondoMenu})`,
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
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <img
            src={logoApp}
            alt="Logo GeoLearn Tenerife"
            style={{
              width: '360px',
              height: 'auto',
              filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))'
            }}
          />
        </div>

        <div
          style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          role="status"
          aria-live="polite"
          aria-label="Cargando aplicación"
        >
          <svg className="splash-spinner" viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>

        <div style={{ position: 'absolute', bottom: 'calc(20px + env(safe-area-inset-bottom))', right: '20px' }}>
          <img
            src={logoDatosAbiertos}
            alt="Cabildo de Tenerife"
            style={{ width: '120px', height: 'auto', opacity: 0.9, filter: 'brightness(0) invert(1)', }}
          />
        </div>

        <style>
          {`
            .splash-spinner {
              width: 3.25em;
              transform-origin: center;
              animation: rotate4 2s linear infinite;
            }

            .splash-spinner circle {
              fill: none;
              stroke: #3b82f6;
              stroke-width: 4;
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
              stroke-linecap: round;
              animation: dash4 1.5s ease-in-out infinite;
            }

            @keyframes rotate4 {
              100% {
                transform: rotate(360deg);
              }
            }

            @keyframes dash4 {
              0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
              }
              50% {
                stroke-dasharray: 90, 200;
                stroke-dashoffset: -35px;
              }
              100% {
                stroke-dashoffset: -125px;
              }
            }
          `}
        </style>
      </main>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={
          <Suspense fallback={<div style={{ height: '100vh', backgroundColor: '#f5f5f5' }} />}>
            <TenerifeMap />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<div style={{ height: '100vh', backgroundColor: '#f5f5f5' }} />}>
            <Dashboard />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;