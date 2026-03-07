/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import { Globe, Phone, MapPin } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import type { PlaceProperties } from './utils/mapTypes';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface InfoPanelDetailsProps {
  selectedItem: PlaceProperties;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Muestra los detalles de contacto y ubicación de un centro en el InfoPanel.
 */
const InfoPanelDetails: React.FC<InfoPanelDetailsProps> = ({ selectedItem }) => {

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

  const openDirections = async (e: React.MouseEvent) => {
    e.preventDefault();
    const lat = selectedItem.latitud;
    const lng = selectedItem.longitud;
    // Usamos la URL universal de Google Maps para todas las plataformas
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    try {
      await Browser.open({ url });
    } catch (err) {
      console.error('Error opening maps:', err);
    }
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <div className="data-row">
      <p role="text">
        <span className="sr-only">Municipio: </span>
        <strong aria-hidden="true">Municipio</strong> {selectedItem.municipio_nombre}
      </p>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Dirección: </span>
          <strong aria-hidden="true">Dirección</strong> {selectedItem.direccion_nombre_via},{' '}
          {selectedItem.direccion_numero}
        </p>
        {selectedItem.direccion_nombre_via && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.latitud},${selectedItem.longitud}`}
            onClick={openDirections}
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Abrir ubicación detallada de ${selectedItem.nombre} en mapas`}
            data-label="Ver ruta"
          >
            <MapPin aria-hidden="true" color="black" />
          </a>
        )}
      </div>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Teléfono: </span>
          <strong aria-hidden="true">Teléfono</strong> {selectedItem.telefono || 'No disponible'}
        </p>
        {selectedItem.telefono && (
          <a
            href={`tel:${selectedItem.telefono}`}
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Llamar por teléfono al centro educativo`}
            data-label="Llamar"
          >
            <Phone aria-hidden="true" color="black" />
          </a>
        )}
      </div>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Sitio Web: </span>
          <strong aria-hidden="true">Web</strong>{' '}
          {selectedItem.web ? selectedItem.web : 'No disponible'}
        </p>
        {selectedItem.web && (
          <a
            href={
              selectedItem.web.startsWith('http')
                ? selectedItem.web
                : `https://${selectedItem.web}`
            }
            onClick={(e) => {
              if (selectedItem.web) {
                openUrl(e, selectedItem.web.startsWith('http') ? selectedItem.web : `https://${selectedItem.web}`);
              } else {
                e.preventDefault();
              }
            }}
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Visitar sitio web oficial`}
            data-label="Visitar Web"
          >
            <Globe aria-hidden="true" color="black" />
          </a>
        )}
      </div>
    </div >
  );
};

export default InfoPanelDetails;

