/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface SearchNavigationProps {
  searchResults: any[];
  currentResultIndex: number;
  onNext: () => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Controles de paginación para iterar sobre los resultados de una búsqueda en el mapa.
 */
const SearchNavigation: React.FC<SearchNavigationProps> = ({
  searchResults,
  currentResultIndex,
  onNext,
}) => {

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  if (searchResults.length <= 1) return null;

  return (
    <div className="search-navigation" aria-live="polite">
      <button
        type="button"
        onClick={onNext}
        aria-label={`Ver siguiente resultado, actualmente viendo ${currentResultIndex + 1} de ${searchResults.length}`}
      >
        Siguiente ({currentResultIndex + 1} de {searchResults.length})
      </button>
    </div>
  );
};

export default SearchNavigation;

