/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

/* ========================================== */
/* INTERFACES Y TIPOS                          */
/* ========================================== */

interface MunicipioComparatorChartProps {
  data: { name: string; value: number }[];
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Gráfico de barras que compara estadísticamente los municipios seleccionados.
 * Renderiza condicionalmente el color de la barra (verde para el líder, rojo perdedores)
 * y ajusta dinámicamente sus márgenes, anchos y fuentes usando hooks de resize (Responsive).
 */
const MunicipioComparatorChart: React.FC<MunicipioComparatorChartProps> = ({
  data,
}) => {

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const maxValue = useMemo(
    () => Math.max(...data.map(d => d.value), 0),
    [data],
  );

  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  /* ========================================== */
  /* EFECTOS Y CICLO DE VIDA                    */
  /* ========================================== */

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 900;

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <div
      className="comparator-chart-container"
      aria-label="Gráfico de barras comparativo de municipios"
    >
      {data.length > 0 ? (
        <>
          <ul className="sr-only" aria-label="Resultados de la comparativa entre municipios">
            {data.map((d, i) => (
              <li key={`sr-comp-${i}`} role="text">
                {d.name}: {d.value} centros
              </li>
            ))}
          </ul>
          <div aria-hidden="true" tabIndex={-1}>
            <ResponsiveContainer
              width="100%"
              height={isMobile ? 220 : isTablet ? 240 : 250}
              aria-hidden="true"
            >
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  left: isMobile ? -10 : isTablet ? 5 : 20,
                  right: isMobile ? 35 : 60,
                  top: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 90 : isTablet ? 110 : 140}
                  style={{
                    fontSize: isMobile ? '10px' : '12px',
                    fontWeight: 600,
                    fill: '#475569',
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 10, 10, 0]}
                  barSize={isMobile ? 18 : 25}
                  activeBar={false}
                >
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{
                      fill: '#64748b',
                      fontSize: isMobile ? '11px' : '13px',
                      fontWeight: 'bold',
                    }}
                    offset={isMobile ? 6 : 12}
                  />
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.value === maxValue && maxValue > 0
                          ? '#2ecc71'
                          : '#ff4757'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="empty-chart-state" role="status" aria-live="polite">
          Selecciona una actividad y municipios para comparar
        </div>
      )}
    </div>
  );
};

export default MunicipioComparatorChart;

