/* ========================================== */
/* CONSTANTES EXPORTABLES                     */
/* ========================================== */

export const TENERIFE_BOUNDS = {
    minLat: 27.95,
    maxLat: 28.65,
    minLng: -16.95,
    maxLng: -16.05,
};

/* ========================================== */
/* FUNCIONES AUXILIARES                       */
/* ========================================== */

/**
 * Verifica geográficamente si unas coordenadas de GPS corresponden a Tenerife.
 * Utiliza un Bounding Box estático con latitudes y longitudes predefinidas
 * evitando centrar la aplicación erróneamente en el mapa mundial si el
 * usuario está en el extranjero o en la península.
 */
export const isLocationInTenerife = (lat: number, lng: number): boolean => {
    return (
        lat >= TENERIFE_BOUNDS.minLat &&
        lat <= TENERIFE_BOUNDS.maxLat &&
        lng >= TENERIFE_BOUNDS.minLng &&
        lng <= TENERIFE_BOUNDS.maxLng
    );
};
