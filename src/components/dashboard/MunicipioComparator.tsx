/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React, { useState, useMemo } from 'react';
import { formatTitleCase } from '../../utils/Textutils.ts';
import MunicipioComparatorHeader from './MunicipioComparatorHeader';
import MunicipioTags from './MunicipioTagsComparator.tsx';
import MunicipioComparatorChart from './MunicipioComparatorChart';
import '../../assets/css/DashBoard/DashboardComparator.css';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface MunicipioComparatorProps {
  features: any[];
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Gestor del comparador de municipios.
 * Coordina la cabecera, etiquetas seleccionadas y el gráfico de resultados.
 * Calcula (memoizado) las matrices cruzadas entre las ubicaciones escogidas
 * y la única actividad seleccionada, inyectando la data formateada al SVG Chart.
 */
const MunicipioComparator: React.FC<MunicipioComparatorProps> = ({
  features,
}) => {

  /* ========================================== */
  /* ESTADOS Y REFERENCIAS                      */
  /* ========================================== */

  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const actividades = useMemo(
    () =>
      Array.from(
        new Set(
          features.map(f => f.properties.actividad_tipo).filter(Boolean),
        ),
      ).sort(),
    [features],
  );

  const municipiosDisponibles = useMemo(
    () =>
      Array.from(
        new Set(
          features.map(f => f.properties.municipio_nombre).filter(Boolean),
        ),
      )
        .filter(m => !selectedMunicipios.includes(m))
        .sort(),
    [features, selectedMunicipios],
  );

  const chartData = useMemo(() => {
    if (!selectedActivity || selectedMunicipios.length === 0) return [];
    const data = selectedMunicipios.map(mun => {
      const count = features.filter(
        f =>
          f.properties.municipio_nombre === mun &&
          f.properties.actividad_tipo === selectedActivity,
      ).length;
      return { name: formatTitleCase(mun), value: count };
    });
    return data.sort((a, b) => b.value - a.value);
  }, [features, selectedActivity, selectedMunicipios]);

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <section className="comparator-section glass">
      <MunicipioComparatorHeader
        selectedActivity={selectedActivity}
        selectedMunicipios={selectedMunicipios}
        actividades={actividades}
        municipiosDisponibles={municipiosDisponibles}
        onSelectActivity={setSelectedActivity}
        onAddMunicipio={mun =>
          setSelectedMunicipios([...selectedMunicipios, mun])
        }
      />

      <MunicipioTags
        selectedMunicipios={selectedMunicipios}
        onRemoveMunicipio={mun =>
          setSelectedMunicipios(
            selectedMunicipios.filter(municipio => municipio !== mun),
          )
        }
      />

      <MunicipioComparatorChart data={chartData} />
    </section>
  );
};

export default MunicipioComparator;
