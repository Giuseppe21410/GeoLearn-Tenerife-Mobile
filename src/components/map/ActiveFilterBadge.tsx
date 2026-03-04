/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface ActiveFilterBadgeProps {
  activityFilter: string | null;
  onClear: () => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Muestra el filtro activo en el mapa y permite borrarlo.
 */
const ActiveFilterBadge: React.FC<ActiveFilterBadgeProps> = ({
  activityFilter,
  onClear,
}) => {

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  if (!activityFilter) return null;

  return (
    <div className="active-filter-badge" role="status" aria-live="polite">
      Mostrando: <strong>{activityFilter}</strong>
      <button type="button" onClick={onClear} aria-label={`Borrar el filtro actual de modalidad ${activityFilter}`}>✕</button>
    </div>
  );
};

export default ActiveFilterBadge;

