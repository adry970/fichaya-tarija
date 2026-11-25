// estado/ClimaContext.js: consulta la API UNA vez al abrir la app y comparte el resultado.
// Maneja los tres estados de toda pantalla con datos remotos: cargando, error y datos.
import { createContext, useContext, useEffect, useState } from 'react';
import { obtenerClima } from '../api';

const ClimaContext = createContext(null);

export function ClimaProvider({ children }) {
  const [clima, setClima] = useState(null); // los datos
  const [cargando, setCargando] = useState(true); // el indicador de carga
  const [error, setError] = useState(''); // el mensaje de error

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setClima(await obtenerClima());
    } catch (e) {
      setError('No se pudo obtener el clima. Revise su conexión.');
    } finally {
      setCargando(false); // se ejecuta siempre: con éxito o con error
    }
  };

  // Una sola vez al abrir la app (el [] evita consultar en un ciclo infinito → error 429)
  useEffect(() => {
    cargar();
  }, []);

  return <ClimaContext.Provider value={{ clima, cargando, error, reintentar: cargar }}>{children}</ClimaContext.Provider>;
}

export function useClima() {
  return useContext(ClimaContext);
}

// Consejo según el pronóstico del día de la ficha
export function consejo(dia) {
  if (dia.lluvia > 0) return 'Lleve paraguas';
  if (dia.max >= 30) return 'Lleve agua: hará calor';
  if (dia.min <= 8) return 'Abríguese: hará frío';
  return 'Buen clima para ir';
}
