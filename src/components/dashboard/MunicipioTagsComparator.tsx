/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import { X } from 'lucide-react';
import { formatTitleCase } from '../../utils/Textutils.ts';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface MunicipioTagsProps {
  selectedMunicipios: string[];
  onRemoveMunicipio: (municipio: string) => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Renderiza las etiquetas (tags) de los municipios seleccionados con un botón para cerrarlas.
 * Mapea el array de strings de estado devolviendo al evento `onRemoveMunicipio`
 * el id/nombre subyacente de la ciudad clickada para purgarla del Contexto Superior.
 */
const MunicipioTags: React.FC<MunicipioTagsProps> = ({
  selectedMunicipios,
  onRemoveMunicipio,
}) => {

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <div className="selected-tags-container">
      {selectedMunicipios.map(mun => (
        <div key={mun} className="municipio-tag">
          <span id={`mun-tag-${mun.replace(/\s+/g, '-')}`}>{formatTitleCase(mun)}</span>
          <button
            type="button"
            className="mun-remove-btn"
            onClick={() => onRemoveMunicipio(mun)}
            aria-label={`Quitar municipio ${formatTitleCase(mun)}`}
            aria-describedby={`mun-tag-${mun.replace(/\s+/g, '-')}`}
          >
            <X size={14} color="black" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MunicipioTags;
