/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network } from '@capacitor/network';
import '../../assets/css/Home/Introduction.css';
import EducationIllustrationMobile from '../../assets/img/education-illustration-mobile.webp';
import LazyImage from '../common/LazyImage';
import { Map } from 'lucide-react';

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Sección introductoria de la app con un enlace rápido al mapa interactivo.
 * Incorpora un validador de conexión a Internet (Capacitor Network Plugin) antes
 * de permitir el Action Push del React Router previniendo pantallas en blanco offline.
 */
const Introduction: React.FC = () => {

  /* ========================================== */
  /* ESTADOS Y REFERENCIAS                      */
  /* ========================================== */

  const navigate = useNavigate();
  const [networkError, setNetworkError] = useState(false);

  /* ========================================== */
  /* EFECTOS Y CICLO DE VIDA                    */
  /* ========================================== */

  useEffect(() => {
    let timeoutId: number;
    if (networkError) {
      timeoutId = window.setTimeout(() => setNetworkError(false), 3000);
    }
    return () => window.clearTimeout(timeoutId);
  }, [networkError]);

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const handleMapClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const status = await Network.getStatus();
    if (!status.connected) {
      setNetworkError(true);
      return;
    }
    navigate('/mapa');
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (

    <>
      {networkError && (
        <div className="search-error-toast" role="alert" aria-live="assertive">
          Sin conexión a Internet. El mapa requiere acceso a la red.
        </div>
      )}
      <article
        className="introduction-section"
        aria-labelledby="introduction-heading"
      >
        <div className="mobile-interactive-card">
          <div className="mobile-card-header">
            <div className="mobile-icon-container">
              <Map size={24} color="white" aria-hidden="true" />
            </div>
            <h2 id="introduction-heading" className="mobile-card-title">Mapa interactivo</h2>
          </div>
          <p className="mobile-card-description">
            Consulta centros educativos, bibliotecas, museos y todo lo que necesitas para descubrir la cultura de Tenerife.
          </p>
          <a
            href="/mapa"
            onClick={handleMapClick}
            className="mobile-card-button"
            role="button"
            aria-label="Ejecutar y abrir el mapa interactivo de Tenerife"
          >
            Ir al mapa interactivo
          </a>
        </div>
      </article>
      <LazyImage
        src={EducationIllustrationMobile}
        alt="Ilustración de joven estudiante sosteniendo libros en una biblioteca"
        className="introduction-image-mobile"
        role="img"
      />
    </>
  );
};

export default Introduction;
