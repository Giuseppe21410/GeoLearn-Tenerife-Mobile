/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */
import React from 'react';
import { Star } from 'lucide-react';
import { formatTitleCase, ACTIVIDAD_COLORS } from '../../utils/Textutils.ts';
import { Browser } from '@capacitor/browser';

/* ========================================== */
/* INTERFACES Y TIPOS                         */
/* ========================================== */

interface CenterTableProps {
  items: any[];
  favorites: string[];
  showFavorites: boolean;
  onToggleFavorite: (id: string) => void;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */
/**
 * Tabla principal de visualización de centros filtrados y paginados.
 * Intercepta eventos predeterminados en <a> para forzar la navegación 
 * vía Capacitor In-App-Browser (plugin @capacitor/browser) sin abandonar
 * el contexto webview nativo salvo para enlaces tel: y mailto:
 */
const CenterTable: React.FC<CenterTableProps> = ({
  items,
  favorites,
  showFavorites,
  onToggleFavorite,
}) => {

  /* ========================================== */
  /* FUNCIONES Y MANEJADORES (Handlers)         */
  /* ========================================== */

  const openUrl = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    // Intercepta explícitamente schemas de llamadas y correos para delegarlos a aplicaciones nativas del SO
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.location.href = url;
      return;
    }

    try {
      // Abre enlaces genéricos sin abandonar la SPA empleando In-App Browser nativo
      await Browser.open({ url });
    } catch (err) {
      console.error('Error opening browser:', err);
    }
  };

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <div className="table-container">
      <table aria-label="Listado de centros educativos y culturales">
        <thead>
          <tr>
            <th scope="col" style={{ width: '50px' }} aria-label="Favoritos">
            </th>
            <th scope="col">Nombre</th>
            <th scope="col">Municipio</th>
            <th scope="col">Tipo</th>
            <th scope="col">Dirección</th>
            <th scope="col">CP</th>
            <th scope="col">Web</th>
            <th scope="col">Email</th>
            <th scope="col">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, i) => {
              const p = item.properties;
              const isFav = favorites.includes(p.nombre);
              const formattedType = formatTitleCase(p.actividad_tipo);

              return (
                <tr key={i}>
                  <td>
                    <button
                      onClick={() => onToggleFavorite(p.nombre)}
                      type="button"
                      aria-pressed={isFav}
                      aria-label={isFav ? `Quitar ${formatTitleCase(p.nombre)} de favoritos` : `Añadir ${formatTitleCase(p.nombre)} a favoritos`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                      }}
                    >
                      <Star
                        size={18}
                        fill={isFav ? '#fbc02d' : 'none'}
                        color={isFav ? '#fbc02d' : '#94a3b8'}
                        role="presentation"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                  <td title={formatTitleCase(p?.nombre)}>
                    <strong>{formatTitleCase(p?.nombre)}</strong>
                  </td>
                  <td>{formatTitleCase(p?.municipio_nombre)}</td>
                  <td className="column-tipo">
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          ACTIVIDAD_COLORS[formattedType] || '#e2e8f0',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      {formattedType}
                    </span>
                  </td>
                  <td>{`${p?.tipo_via_descripcion} ${p?.direccion_nombre_via}, ${p?.direccion_numero}`}</td>
                  <td>{p?.direccion_codigo_postal}</td>
                  <td>
                    {p?.web ? (
                      <a
                        href={
                          p.web.startsWith('http') ? p.web : `https://${p.web}`
                        }
                        onClick={(e) => openUrl(e, p.web.startsWith('http') ? p.web : `https://${p.web}`)}
                        className="table-link"
                        aria-label={`Visitar web de ${p?.nombre}`}
                      >
                        Web
                      </a>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td>
                    {p?.email ? (
                      <a
                        href={`mailto:${p.email}`}
                        onClick={(e) => openUrl(e, `mailto:${p.email}`)}
                        className="table-link"
                        aria-label={`Enviar correo a ${p?.nombre}`}
                      >
                        Email
                      </a>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                  <td>
                    {p?.telefono ? (
                      <a
                        href={`tel:${Math.floor(p.telefono)}`}
                        className="table-link"
                        aria-label={`Llamar al teléfono ${Math.floor(p.telefono)}`}
                      >
                        {Math.floor(p.telefono)}
                      </a>
                    ) : (
                      <span className="no-data">-</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={9}
                style={{
                  textAlign: 'center',
                  padding: '50px',
                  color: '#94a3b8',
                }}
                role="status"
                aria-live="polite"
              >
                {showFavorites
                  ? 'No tienes centros favoritos guardados.'
                  : 'No se han encontrado centros.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CenterTable;
