// api.js: aquí viven las llamadas fetch a la API pública.
// API: Open-Meteo (pública, sin clave, uso no comercial). Tarija: latitud -21.53, longitud -64.73.
// No hay ninguna clave escrita en el código: esta API no la necesita.
const URL_CLIMA =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=-21.53&longitude=-64.73' +
  '&current=temperature_2m,wind_speed_10m' +
  '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
  '&timezone=America%2FLa_Paz&forecast_days=7';

// Devuelve { temperatura, viento, dias: [{ fecha, max, min, lluvia }, ...] }
export async function obtenerClima() {
  const respuesta = await fetch(URL_CLIMA);

  // fetch NO lanza error con un 404 o un 500: hay que revisar respuesta.ok
  if (!respuesta.ok) {
    throw new Error('El servidor respondió con el estado ' + respuesta.status);
  }

  const datos = await respuesta.json();

  // La API entrega arreglos paralelos (fechas, máximas, mínimas, lluvia).
  // Con map los unimos en un arreglo de objetos: un objeto por día.
  const dias = datos.daily.time.map((fecha, i) => ({
    fecha: fecha, // 'AAAA-MM-DD', el mismo formato que guardamos en SQLite
    max: Math.round(datos.daily.temperature_2m_max[i]),
    min: Math.round(datos.daily.temperature_2m_min[i]),
    lluvia: datos.daily.precipitation_sum[i],
  }));

  return {
    temperatura: Math.round(datos.current.temperature_2m),
    viento: Math.round(datos.current.wind_speed_10m),
    dias: dias,
  };
}
