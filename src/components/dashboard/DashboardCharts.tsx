/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import ActivityPieChart from './ActivityPieChart';
import TopMunicipiosBarChart from './TopMunicipiosBarChart';
import '../../assets/css/DashBoard/DashboardCharts.css';

/* ========================================== */
/* INTERFACES Y TIPOS                         */
/* ========================================== */

interface DashboardChartsProps {
  features: any[];
  filterMunicipio: string;
  filterTipo: string;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */
/**
 * Agrupador visual de los gráficos del panel de control (Dashboard).
 * Renderiza el gráfico de dona y el de barras de municipios.
 * Actúa como contenedor de paso pasivo (prop drilling) enviando el dataset
 * filtrado por el componente padre hacia las dos visualizaciones principales.
 */
const DashboardCharts: React.FC<DashboardChartsProps> = ({
  features,
  filterMunicipio,
  filterTipo,
}) => {

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <section
      className="charts-grid"
    >
      <ActivityPieChart features={features} filterMunicipio={filterMunicipio} />
      <TopMunicipiosBarChart features={features} filterTipo={filterTipo} />
    </section>
  );
};

export default DashboardCharts;
