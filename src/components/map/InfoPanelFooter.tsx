/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import { Browser } from '@capacitor/browser';
import { Share2, Info } from 'lucide-react';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface InfoPanelFooterProps {
  onShare: () => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Pie del panel inferior con acciones secundarias y créditos de datos.
 */
const InfoPanelFooter: React.FC<InfoPanelFooterProps> = ({ onShare }) => {

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const openSourceUrl = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await Browser.open({ url: 'https://datos.tenerife.es/es/datos/conjuntos-de-datos/centros-educativos-y-culturales-en-tenerife' });
    } catch (err) {
      console.error('Error opening browser:', err);
    }
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <div className="panel-footer">
      <button
        className="icon-action-btn icon-button-tooltip tooltip-right"
        onClick={onShare}
        aria-label="Compartir este lugar"
        data-label="Compartir"
      >
        <Share2 aria-hidden="true" color="black" />
      </button>
      <span className="error-notice">La información puede contener errores.</span>
      <a
        href="https://datos.tenerife.es/es/datos/conjuntos-de-datos/centros-educativos-y-culturales-en-tenerife"
        onClick={openSourceUrl}
        className="icon-action-btn icon-button-tooltip tooltip-left"
        aria-label="Ver fuente de datos"
        data-label="Fuente de Datos"
      >
        <Info aria-hidden="true" color="black" />
      </a>
    </div>
  );
};

export default InfoPanelFooter;

