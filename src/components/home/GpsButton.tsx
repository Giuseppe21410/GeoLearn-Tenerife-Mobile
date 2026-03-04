/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import { LocateFixed } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { isLocationInTenerife } from '../../utils/GeolocationUtils';
import '../../assets/css/Home/GpsButton.css';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface GpsButtonProps {
  onLocationFound: (coords: { lat: number; lng: number } | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Botón para obtener la ubicación actual del usuario usando Capacitor Geolocation.
 * Valida si las coordenadas están en Tenerife, interceptando permisos o fallos nativos
 * pasándolos como callbacks (onError/onLoadingChange) delegando el UI a sus parientes.
 */
const GpsButton: React.FC<GpsButtonProps> = ({ onLocationFound, onLoadingChange, onError }) => {

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const toggleLocation = async () => {
    if (onError) onError(null);
    if (onLoadingChange) onLoadingChange(true);

    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
      if (onLoadingChange) onLoadingChange(false);
      const { latitude, longitude } = position.coords;

      if (!isLocationInTenerife(latitude, longitude)) {
        const msg = "Lo sentimos, solo mostramos centros dentro de la isla de Tenerife.";
        if (onError) onError(msg);
        onLocationFound(null);
        return;
      }

      const coords = {
        lat: latitude,
        lng: longitude,
      };
      onLocationFound(coords);
      if (onError) onError(null);
    } catch (error) {
      if (onLoadingChange) onLoadingChange(false);
      console.error("Error obteniendo ubicación:", error);
      const msg = "No se pudo acceder a tu ubicación. Revisa los permisos de la aplicación.";
      if (onError) onError(msg);
      onLocationFound(null);
    }
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <>
      <button
        className="gps-button-home icon-button-tooltip"
        onClick={toggleLocation}
        type="button"
        aria-label="Buscar centros usando mi ubicación actual"
        data-label="Mi Ubicación"
      >
        <LocateFixed aria-hidden="true" color='black' />
      </button>
    </>
  );
};

export default GpsButton;
