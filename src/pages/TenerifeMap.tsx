/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React, { useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import InfoPanel from '../components/map/InfoPanel';
import LayerSelector from '../components/map/LayerSelector';
import MapLegend from '../components/map/MapLegend';
import SearchNavigation from '../components/map/SearchNavigation';
import ActiveFilterBadge from '../components/map/ActiveFilterBadge';
import MapControls from '../components/map/MapControls';
import LeftTopButtons from '../components/map/LeftTopButtons';
import MainMapView from '../components/map/MainMapView';
import { getMarkerColor } from '../components/map/utils/mapLogic';
import '../assets/css/TenerifeMap/MapBase.css';
import '../assets/css/TenerifeMap/MapControls.css';
import '../assets/css/TenerifeMap/MapSearch.css';
import '../assets/css/Toast.css';
import '../assets/css/Tooltip.css'
import { useTenerifeMapController } from '../components/map/utils/useTenerifeMapController';

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Vista principal de pantalla completa para el mapa interactivo.
 * Delega la lógica de filtrado y estado al hook useTenerifeMapController,
 * renderizando capas, marcadores, controles de usuario y el panel de información
 * reactivamente según la selección del usuario.
 */
const TenerifeMap: React.FC = () => {

  /* ========================================== */
  /* ESTADOS Y REFERENCIAS                      */
  /* ========================================== */

  const mapRef = useRef<L.Map | null>(null);
  const {
    features,
    selectedItem,
    isSatellite,
    activeLayer,
    searchResults,
    currentResultIndex,
    activityFilter,
    userLocation,
    notification,
    successNotification,
    filteredFeatures,
    setIsSatellite,
    setActiveLayer,
    setActivityFilter,
    clearSelectedItem,
    handleLocateUser,
    handleSearchResult,
    focusOnFeature,
    nextSearchResult,
  } = useTenerifeMapController(mapRef);

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <main className="map-page-container" aria-label="Mapa interactivo de Tenerife">
      {notification && (
        <div
          className={`search-error-toast ${notification === 'Buscando tu ubicación...' ? 'searching' : ''}`}
          role={notification === 'Buscando tu ubicación...' ? 'status' : 'alert'}
          aria-live={notification === 'Buscando tu ubicación...' ? 'polite' : 'assertive'}
        >
          {notification}
        </div>
      )}
      {successNotification && (
        <div className="search-success-toast" role="status" aria-live="polite">
          {successNotification}
        </div>
      )}

      <MapLegend isPanelOpen={!!selectedItem} />

      <div className={`map-wrapper ${selectedItem ? 'with-panel' : ''}`}>

        <MainMapView
          mapRef={mapRef}
          isSatellite={isSatellite}
          userLocation={userLocation}
          activeLayer={activeLayer}
          activityFilter={activityFilter}
          filteredFeatures={filteredFeatures}
          selectedItemName={selectedItem?.nombre || null}
          onBackgroundClick={() => {
            clearSelectedItem();
          }}
          onMarkerClick={feature => focusOnFeature(feature)}
        />

        <div aria-hidden={!!selectedItem}>
          <ActiveFilterBadge
            activityFilter={activityFilter}
            onClear={() => setActivityFilter(null)}
          />

          <LayerSelector
            activeLayer={activeLayer}
            onLayerChange={layer => {
              setActiveLayer(layer);
              setActivityFilter(null);
            }}
          />

          <MapControls
            isSatellite={isSatellite}
            onToggleSatellite={() => setIsSatellite(!isSatellite)}
            onLocateUser={handleLocateUser}
          />
        </div>
      </div>

      {selectedItem && (
        <InfoPanel
          selectedItem={selectedItem}
          onClose={() => {
            clearSelectedItem();
          }}
          markerColor={getMarkerColor(selectedItem.actividad_tipo, selectedItem.nombre)}
        />
      )}

      <div aria-hidden={!!selectedItem}>
        <SearchNavigation
          searchResults={searchResults}
          currentResultIndex={currentResultIndex}
          onNext={() => {
            nextSearchResult();
          }}
        />

        <LeftTopButtons features={features} onResultFound={handleSearchResult} />
      </div>
    </main>
  );
};

export default TenerifeMap;
