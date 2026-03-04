/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import { Browser } from '@capacitor/browser';
import type { TransportStop } from './utils/mapTypes';
import TranviaImg from '../../assets/img/bus.webp';
import BusImg from '../../assets/img/tram.webp';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface InfoPanelTransportProps {
  nearbyTransport: TransportStop[];
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Muestra las opciones de transporte público cercanas al centro seleccionado.
 */
const InfoPanelTransport: React.FC<InfoPanelTransportProps> = ({
  nearbyTransport,
}) => {

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const openUrl = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    try {
      await Browser.open({ url });
    } catch (err) {
      console.error('Error opening browser:', err);
    }
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <ul className="transport-container" aria-label="Opciones de transporte público cercano">
      {nearbyTransport.map((stop, i) => (
        <li key={i}>
          <a
            href={stop.url}
            onClick={(e) => openUrl(e, stop.url)}
            className="transport-card icon-button-tooltip tooltip-left"
            aria-label={`Ruta a la parada de ${stop.type} ${stop.nombre} a ${stop.distance.toFixed(2)} kilómetros`}
            data-label={`Ver ruta de ${stop.nombre}`}
          >
            <img
              src={stop.type === 'tranvia' ? BusImg : TranviaImg}
              alt=""
              aria-hidden="true"
              role="presentation"
            />
            <div className="transport-info">
              <span>{stop.nombre.toUpperCase()}</span>
              <small>{stop.distance.toFixed(2)} km</small>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default InfoPanelTransport;

