/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

const VERCEL_URL = "https://geolearn-tenerife.vercel.app";

/* ========================================== */
/* FUNCIONES Y SERVICIOS                      */
/* ========================================== */

/**
 * Extrae palabras clave de la consulta del usuario mediante Gemini.
 * Llama al endpoint Vercel `/api/keywords`, enviando la petición
 * natural para que el LLM devuelva un listado filtrado de ubicaciones
 * o tipos de centros, manejando las caídas del API de respaldo.
 */
export const getSearchKeywords = async (userQuery: string): Promise<string[]> => {
  try {
    const response = await fetch(`${VERCEL_URL}/api/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery })
    });

    const data = await response.json();
    return data.keywords;
  } catch (error) {
    console.error("Error extrayendo keywords desde Vercel:", error);
    return userQuery.toLowerCase().split(' ').filter(w => w.length > 3);
  }
};

/**
 * Solicita una respuesta conversacional enriquecida al chatbot de Gemini.
 * Delega el procesamiento a la función Serverless `/api/chat` en Vercel,
 * construyendo el prompt en el backend pasándole el contexto de centros locales
 * encontrados previamente y la query original del usuario.
 */
export const getAiResponse = async (userQuery: string, contextData: any[]): Promise<string> => {
  try {
    const response = await fetch(`${VERCEL_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery, contextData })
    });

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.error("Error obteniendo respuesta de la IA en Vercel:", error);
    return "Lo siento, tengo un problema técnico de conexión. ¿Puedes probar de nuevo en unos segundos?";
  }
};