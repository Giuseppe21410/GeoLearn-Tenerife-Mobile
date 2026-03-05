# GeoLearn Tenerife — Descripción Técnica y Memoria de Datos Abiertos

## Tabla de contenidos
- Resumen ejecutivo
- Funcionalidades clave
- Requisitos previos
- Instalación y ejecución
- Estructura del repositorio
- Guía de uso
- Arquitectura y diseño
- Módulos principales
- Integración de datos abiertos
- Anexo — Memoria justificativa
- Tecnologías y versiones
- Rendimiento, accesibilidad y privacidad
- Flujo del asistente conversacional
- Consideraciones de despliegue
- Configuración y variables de entorno
- Calidad de código
- Extensibilidad
- Atribuciones y licencias
- FAQ
- Roadmap

## Resumen ejecutivo
GeoLearn Tenerife es una aplicación móvil y web centrada en la localización, consulta y visualización de centros educativos y culturales de la isla de Tenerife. Combina un mapa interactivo con filtros por actividades (museos, bibliotecas, centros culturales y red de enseñanza) y un panel analítico de indicadores. Integra además un asistente conversacional (LearnBot) que interpreta preguntas en lenguaje natural, cruza palabras clave con el dataset local y devuelve resultados breves y accionables.

La solución está optimizada para uso móvil (Capacitor 8, iOS ≥ 15), funciona como SPA React con Vite y coordina datos abiertos del Cabildo (CKAN) mediante un pipeline de ingestión que descarga, limpia y compacta GeoJSON, sirviéndolo localmente para reducir latencia y dependencia de red.

## Funcionalidades clave
- Mapa interactivo con clústeres y marcadores por tipo de centro, vista base y satélite.
- Selector de capas: “Favoritos”, “Centros Educativos”, “Museos”, “Bibliotecas”, “Culturales”.
- Ficha de cada centro con detalles (nombre, municipio, dirección, web/teléfono) y acciones (abrir web, compartir).
- Transporte cercano: cálculo Haversine a paradas de guagua y tranvía y listado de las 4 más próximas.
- Búsqueda por texto con normalización semántica de actividades y toponimia.
- Asistente LearnBot: extrae keywords con IA, recupera contexto local y responde de forma concisa.
- Dashboard analítico: KPIs y gráficos por municipio/tipo y tabla filtrable.
- Accesibilidad: roles ARIA, textos para lector, controles “sr-only” de zoom/pan y tooltips.

## Requisitos previos
- Node.js ≥ 18 y npm.
- iOS (opcional para binario): Xcode ≥ 15, CocoaPods, cuenta de desarrollo.
- Android (opcional para binario): Android Studio y SDK actualizados.
- Acceso a red para tiles del mapa y funciones IA (serverless).

## Instalación y ejecución

```
# Instalar dependencias
npm install

# Desarrollo (Vite)
npm run dev

# Actualizar datos abiertos (GeoJSON locales)
npm run update-data

# Construcción (incluye actualización de datos y compilación TS)
npm run build

# Vista previa de build
npm run preview
```

Empaquetado móvil con Capacitor:
```
# Sincronizar plataformas nativas
npx cap sync

# Abrir Xcode / Android Studio
npx cap open ios
npx cap open android
```

## Estructura del repositorio
```
.
├─ public/
│  └─ data/                # GeoJSON optimizados (centros, guagua, tranvía)
├─ src/
│  ├─ app/                 # Enrutado principal (App.tsx)
│  ├─ pages/               # Home, TenerifeMap, Dashboard
│  ├─ components/          # UI modular (mapa, paneles, charts, etc.)
│  ├─ services/            # GeminiService, DataService
│  ├─ utils/               # Geolocation y normalización de texto
│  └─ assets/              # CSS y recursos (WebP)
├─ api/                    # Endpoints serverless (Vercel)
├─ ios/                    # Proyecto iOS (Capacitor)
├─ UpdateData.js           # Pipeline CKAN → GeoJSON local
├─ vite.config.ts          # Configuración Vite + Image optimizer
└─ capacitor.config.ts     # Configuración Capacitor
```

## Guía de uso
- Inicio:
  - Búsqueda rápida por texto; categorías y estadísticas introductorias; acceso a LearnBot.
- Mapa:
  - Cambiar entre Mapa/Satélite, centrar en Mi Ubicación (solo si dentro del BBox de Tenerife).
  - Seleccionar capas: favoritos, educativos, museos, bibliotecas, culturales.
  - Pulsar un marcador para ver la ficha; abrir web, compartir, ver transporte cercano.
- Favoritos:
  - Añadir/quitar favoritos desde la ficha; capa “Favoritos” los filtra rápidamente.
- Dashboard:
  - Filtros por municipio y tipo; KPIs, gráficos y tabla con búsqueda.
- LearnBot:
  - Lanzar chat flotante, escribir una consulta (p. ej., “museos en La Laguna”); el bot devuelve lista breve con datos útiles.

## Arquitectura y diseño

### Vista general
```
Usuario (móvil/web)
      |
      v
React SPA (Vite) ── Rutas: Home / Mapa / Dashboard
  |  Estado y lógica de mapa (useTenerifeMapController)
  |  Componentes (Map, InfoPanel, LayerSelector, etc.)
  v
Datos locales (public/data/*.geojson)
  ^
  |  Build-time
  |
Pipeline datos (UpdateData.js) ← CKAN Cabildo (package_show → recurso GeoJSON)
```

### Estructura UI (wireframe)
```
Home
 ├─ Hero (logo, subtítulo, buscador)
 ├─ Categorías rápidas y estadísticas
 ├─ Chatbot flotante (abrir/cerrar)
 └─ Pie con enlaces

Mapa
 ├─ Controles: Mapa/Satélite • Mi Ubicación • Dashboard
 ├─ Selector de capas
 ├─ Clústeres + marcadores (Leaflet)
 └─ Panel de Ficha: cabecera, detalle, transporte cercano, acciones

Dashboard
 ├─ Filtros (municipio, tipo)
 ├─ KPIs y gráficos
 └─ Tabla detallada con búsqueda
```

## Módulos principales
- App shell y enrutado: SPA React con rutas Home, TenerifeMap y Dashboard (carga diferida de páginas) y splash optimizado en móvil.
- Mapa interactivo:
  - Tiles: OpenStreetMap (base) y Esri World Imagery (satélite).
  - Clústeres: agrupación con carga troceada (chunked) y radio adaptable.
  - Marcadores: color por tipo, realce visual del seleccionado; foco con flyTo.
  - Capas y filtros: por tipo (“museo”, “biblioteca”, “cultural”, “otros/educativos”, “favoritos”) o por actividad normalizada.
  - Ficha: apertura de navegador nativo, compartir, accesos rápidos.
- Transporte cercano: unión on-the-fly de centros con paradas de guagua/tranvía mediante distancia geodésica y ordenación ascendente.
- Búsqueda y normalización:
  - Normalización de consultas a familias semánticas (museos, bibliotecas, FP, etc.).
  - Búsqueda por palabras clave en el dataset local con puntuación y desempate por aleatoriedad mínima.
- Chat conversacional:
  - Extracción de keywords (endpoint serverless) → filtro local → respuesta IA (endpoint serverless).
  - Control de conectividad para mostrar avisos si no hay red.
- Dashboard analítico:
  - KPIs, gráficos (Recharts) y tabla filtrable.
  - Deriva de los mismos GeoJSON locales garantizando coherencia entre mapa y analítica.

## Integración de datos abiertos
### Origen y acceso
- Portal CKAN del Cabildo de Tenerife: `package_show` para obtener metadatos y localizar el recurso en formato GeoJSON.
- Conjuntos utilizados:
  - Centros Educativos y Culturales — ID: `573a49e8-e2fb-4fe4-b47b-ac5dec1bf580`
  - Paradas de Guagua — ID: `749d9208-ad97-47f9-a497-0385df40420d`
  - Paradas de Tranvía — ID: `19914413-77e1-441c-83a7-8f0f45c0767a`

### Proceso de ingestión y optimización (build-time)
1. Descarga de metadatos CKAN y selección del recurso con `format == GeoJSON`.
2. Descarga del GeoJSON fuente.
3. Limpieza:
   - Exclusión de actividades no alineadas con el propósito (p. ej., “centro comercial hogar informática telecomunicaciones”, “café”).
   - Redondeo de coordenadas a 5 decimales (≈1 m).
   - Poda de propiedades redundantes (fechas, referencias internas, lat/long duplicadas).
   - Eliminación de campos nulos o vacíos.
4. Persistencia del resultado en `public/data/*.geojson`.
5. Métrica de reducción: informe en consola del ahorro de tamaño.

### Consumo en cliente
- Mapa y Dashboard consumen `centros-educativos-y-culturales.geojson`.
- Transporte cercano consume `paradas-tranvia.geojson` y `paradas-guaguas.geojson`.
- Filtros por capa/actividad y resultados de búsqueda operan sobre el mismo array de features, garantizando consistencia.

### Frecuencia de actualización
- Encadenada al proceso de build: `npm run build` ejecuta `npm run update-data` antes de compilar, asegurando frescura del dato abierto.

## Anexo — Memoria justificativa del uso de datos abiertos
### Justificación
- Relevancia pública: los centros educativos/culturales, junto a paradas de transporte, son infraestructuras clave para el aprendizaje, la cultura y la movilidad sostenible.
- Eficiencia: servir GeoJSON local optimizado reduce llamadas de red y aumenta responsividad en móviles de gama media.
- Transparencia y reutilización: se respetan las estructuras y atributos útiles del dataset oficial, manteniendo trazabilidad.

### Procesamiento aplicado
- Filtrado de outliers tipológicos.
- Normalización de coordenadas y poda de metadatos.
- Reindexación de propiedades para uso directo en UI (nombre, actividad_tipo, municipio, dirección, web, teléfono).

### Papel en la aplicación
- Núcleo de la experiencia: el dataset alimenta mapa, panel analítico y las respuestas del asistente.
- Mejora de la orientación: paradas cercanas facilitan desplazamientos con transporte público.

### Limitaciones y mitigaciones
- Calidad del origen: posibles desactualizaciones o clasificaciones imperfectas; se mitiga con reprocesos de build y filtros robustos.
- Redondeo de coordenadas: reducción de tamaño con pérdida de precisión no significativa para uso urbano.
- Dependencia de tiles remotos: sin red no se cargan los mosaicos de mapa; la app mantiene fichas y búsquedas locales.

### Licencias y ética
- Respeto a la licencia de los datasets publicados por el Portal de Datos Abiertos.
- No se almacenan datos personales; la geolocalización solo se usa para centrar el mapa con permiso explícito del usuario.

## Tecnologías y versiones
- Lenguajes: TypeScript 5.9 (cliente), JavaScript (Node) para el pipeline.
- Frameworks/Librerías:
  - React 19, React Router 7.
  - Leaflet 1.9 + react-leaflet 5 + clústeres.
  - Capacitor 8 (core y plugins: geolocation, network, share, browser, splash-screen, status-bar, filesystem).
  - Recharts 3 para analítica.
  - Iconografía con lucide-react.
  - Optimización de imágenes en build (Sharp, integración Vite).
- Empaquetado móvil: Capacitor (iOS mínimo 15).
- Build tool: Vite (plugins React, optimización de imágenes, ajustes de chunking).

## Rendimiento, accesibilidad y privacidad
- Rendimiento:
  - Clúster incremental con chunked loading y radio de agrupación adaptado.
  - GeoJSON depurado y compacto servido desde `/public/data`.
  - Imágenes WebP/AVIF y pipeline de optimización en build.
- Accesibilidad:
  - ARIA roles y textos para lector de pantalla.
  - Controles “sr-only” para zoom/pan accesible por teclado.
  - Tooltips y estados de foco/selección con contraste.
- Privacidad:
  - Geolocalización no persistida; solo centra el mapa si el usuario está dentro del BBox de Tenerife.
  - Las funciones serverless usan `GEMINI_API_KEY` en backend; la clave nunca se expone en el cliente.

## Flujo del asistente conversacional
1. Usuario pregunta (p. ej., “museos en La Laguna”).
2. Extracción de keywords en endpoint serverless (Gemini).
3. Búsqueda local: intersección de keywords con el GeoJSON de centros.
4. Generación de respuesta breve en endpoint serverless, incorporando datos (web/teléfono si procede) y formato compacto.

## Configuración y variables de entorno
- Serverless (Vercel):
  - Definir `GEMINI_API_KEY` como variable de entorno en el proyecto Vercel.
  - Endpoints: `/api/keywords` y `/api/chat` gestionan CORS y usan la clave en backend.
- Cliente:
  - La constante `VERCEL_URL` en `src/services/GeminiService.ts` apunta al dominio desplegado. Ajustarla si se usa otro entorno.
- Capacitor:
  - `capacitor.config.ts` define appId, appName, webDir y plugins (SplashScreen, StatusBar, etc.).

## Calidad de código
- Linting: ESLint con reglas modernas para React y Hooks.
  - Ejecutar: `npm run lint`.
- TypeScript estricto:
  - Configuración `tsconfig.app.json` con `strict: true` y opciones de higiene (noUnusedLocals/Parameters).
- Imágenes:
  - Optimización en build con `vite-plugin-image-optimizer` (calidades controladas y soporte WebP/AVIF).

## Extensibilidad
### Añadir un nuevo dataset/capa
1. Pipeline:
   - Editar `UpdateData.js` y añadir entrada en `DATASETS` con `id` CKAN y `outputFile`.
   - Ejecutar `npm run update-data` para generar el nuevo GeoJSON en `public/data`.
2. Consumo en cliente:
   - Cargar el nuevo archivo donde corresponda (mapa, panel, etc.).
3. Clasificación visual:
   - Ampliar `mapLogic.ts` (`getIcon`, `getMarkerColor`, `getLayerFromType`, `filterFeatures`) si introduce una categoría nueva.
   - Añadir botón en `LayerSelector.tsx` si procede.
4. Estilos y leyenda:
   - Ajustar colores y leyendas en CSS y en `MapLegend` si aplica.


## Consideraciones de despliegue
- Cliente como PWA y/o empaquetado móvil vía Capacitor.
- Endpoints `/api/keywords` y `/api/chat` desplegados como funciones serverless (Vercel) con control CORS y uso de `GEMINI_API_KEY` en variables de entorno.
## Atribuciones y licencias
- Datos abiertos:
  - Portal CKAN del Cabildo de Tenerife. Consultar licencia de cada conjunto (habitualmente CC BY 4.0). Se mantiene trazabilidad y atribución.
- Mapas base:
  - OpenStreetMap © colaboradores de OSM (uso conforme a ODbL y políticas de tile usage).
  - Esri World Imagery sujeto a sus términos de uso.
- Iconos:
  - Paquete `lucide-react` bajo su licencia correspondiente.

## FAQ
- No se cargan los tiles del mapa:
  - Verificar conexión a Internet. El dataset local funciona sin red, pero los mosaicos base son remotos.
- La geolocalización no centra el mapa:
  - Confirmar permisos del dispositivo y que la posición está dentro del BBox de Tenerife.
- El asistente no responde:
  - Verificar que el endpoint Vercel está accesible y `GEMINI_API_KEY` configurada.
- Los datos no reflejan cambios recientes:
  - Ejecutar `npm run update-data` y luego `npm run build`.
- Problemas iOS:
  - Ejecutar `npx cap sync ios` y abrir en Xcode; revisar firmas/provisioning.

## Roadmap
- Internacionalización (i18n) con carga dinámica de locales.
- Service Worker para mejorar cacheo de assets y, opcionalmente, tiles.
- Empaquetado Android y publicación en Play Store.
- Nuevos datasets: patrimonio, salas de estudio, rutas temáticas.
- Suite de pruebas E2E y de regresión visual.


---

