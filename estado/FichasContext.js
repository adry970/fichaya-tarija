// estado/FichasContext.js: comparte con todas las pantallas lo que hay en la base de datos.
// Cada operación llama a datos.js (SQLite) y después
// se VUELVE A LEER la base (recargar), así la pantalla siempre muestra lo que está guardado.
// La fuente de la verdad es la base de datos; el estado de React solo la refleja.
import { createContext, useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as datos from '../datos';

const FichasContext = createContext(null);

export function FichasProvider({ children }) {
  const db = useSQLiteContext(); // la base abierta por <SQLiteProvider> en App.js
  const [consultorios, setConsultorios] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [resumen, setResumen] = useState({ Pendiente: 0, Atendida: 0, Cancelada: 0 });
  const [cargando, setCargando] = useState(true);

  // Lee todo de la base: SELECT de consultorios, de fichas y el COUNT por estado
  const recargar = async () => {
    setConsultorios(await datos.obtenerConsultorios(db));
    setFichas(await datos.obtenerFichas(db));
    const filas = await datos.contarPorEstado(db);
    const conteo = { Pendiente: 0, Atendida: 0, Cancelada: 0 };
    filas.forEach((f) => (conteo[f.estado] = f.cantidad));
    setResumen(conteo);
    setCargando(false);
  };

  useEffect(() => {
    recargar(); // una sola vez, al abrir la app
  }, []);

  const buscarConsultorio = (id) => consultorios.find((c) => c.id === id);

  // Fichas libres = cupos del turno − fichas no canceladas de ese día y turno
  const libres = (consultorioId, fecha, turno, sinContarId) => {
    const ocupadas = fichas.filter(
      (f) => f.consultorio_id === consultorioId && f.fecha === fecha && f.turno === turno &&
        f.estado !== 'Cancelada' && f.id !== sinContarId
    ).length;
    return buscarConsultorio(consultorioId).cupos_turno - ocupadas;
  };

  // CREATE → INSERT
  const agregarFicha = async (ficha) => {
    const nueva = await datos.agregarFicha(db, ficha);
    await recargar();
    return nueva; // { id, numero }
  };

  // UPDATE → cambiar día y turno
  const reprogramarFicha = async (id, fecha, turno) => {
    const numero = await datos.reprogramarFicha(db, id, fecha, turno);
    await recargar();
    return numero;
  };

  // UPDATE → cambiar estado
  const cambiarEstado = async (id, estado) => {
    await datos.cambiarEstado(db, id, estado);
    await recargar();
  };

  // DELETE
  const eliminarFicha = async (id) => {
    await datos.eliminarFicha(db, id);
    await recargar();
  };

  return (
    <FichasContext.Provider
      value={{ cargando, consultorios, fichas, resumen, buscarConsultorio, libres, agregarFicha, reprogramarFicha, cambiarEstado, eliminarFicha }}
    >
      {children}
    </FichasContext.Provider>
  );
}

export function useFichas() {
  return useContext(FichasContext);
}
