// datos.js: aquí viven TODAS las sentencias SQL de FichaYa Tarija.
// Las pantallas nunca escriben SQL: llaman a estas funciones (a través de estado/FichasContext.js).
// Regla del curso: los valores del usuario SIEMPRE van como parámetros ? (nunca pegados en el texto del SQL).
import { CONSULTORIOS_INICIALES, FICHAS_EJEMPLO } from './data/ejemplo';

// ---------- CREATE TABLE: se ejecuta una vez al abrir la base (onInit del SQLiteProvider) ----------
export async function iniciarBase(db) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS consultorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      direccion TEXT NOT NULL,
      horario TEXT,
      costo REAL NOT NULL DEFAULT 0,
      cupos_turno INTEGER NOT NULL DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS fichas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultorio_id INTEGER NOT NULL REFERENCES consultorios(id),
      paciente TEXT NOT NULL,
      ci TEXT NOT NULL,
      celular TEXT,
      fecha TEXT NOT NULL,
      turno TEXT NOT NULL,
      motivo TEXT,
      numero INTEGER NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Pendiente'
    );
  `);

  // Solo la PRIMERA vez (tabla vacía) se cargan los consultorios y unas fichas de ejemplo
  const fila = await db.getFirstAsync('SELECT COUNT(*) AS cantidad FROM consultorios');
  if (fila.cantidad === 0) {
    for (const c of CONSULTORIOS_INICIALES) {
      await db.runAsync(
        'INSERT INTO consultorios (nombre, especialidad, direccion, horario, costo, cupos_turno) VALUES (?, ?, ?, ?, ?, ?)',
        [c.nombre, c.especialidad, c.direccion, c.horario, c.costo, c.cupos_turno]
      );
    }
    for (const f of FICHAS_EJEMPLO) {
      await db.runAsync(
        'INSERT INTO fichas (consultorio_id, paciente, ci, celular, fecha, turno, motivo, numero, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [f.consultorio_id, f.paciente, f.ci, f.celular, f.fecha, f.turno, f.motivo, f.numero, f.estado]
      );
    }
  }
}

// ---------- READ ----------
export async function obtenerConsultorios(db) {
  return await db.getAllAsync('SELECT * FROM consultorios ORDER BY id');
}

// Cada ficha trae también el nombre de su consultorio (JOIN entre las dos tablas)
export async function obtenerFichas(db) {
  return await db.getAllAsync(
    'SELECT f.*, c.nombre AS consultorio FROM fichas f ' +
    'JOIN consultorios c ON c.id = f.consultorio_id ' +
    'ORDER BY f.fecha DESC, f.turno'
  );
}

// READ con cálculo: cuántas fichas hay en cada estado (para el resumen de Inicio)
export async function contarPorEstado(db) {
  return await db.getAllAsync('SELECT estado, COUNT(*) AS cantidad FROM fichas GROUP BY estado');
}

// El número de ficha sigue al último entregado ese día y turno (como el talonario del consultorio).
// COALESCE devuelve 0 cuando todavía no hay fichas (MAX daría NULL).
async function siguienteNumero(db, consultorioId, fecha, turno, sinContarId) {
  const fila = await db.getFirstAsync(
    'SELECT COALESCE(MAX(numero), 0) AS ultimo FROM fichas WHERE consultorio_id = ? AND fecha = ? AND turno = ? AND id <> ?',
    [consultorioId, fecha, turno, sinContarId]
  );
  return fila.ultimo + 1;
}

// ---------- CREATE ----------
export async function agregarFicha(db, f) {
  const numero = await siguienteNumero(db, f.consultorio_id, f.fecha, f.turno, 0);
  const resultado = await db.runAsync(
    'INSERT INTO fichas (consultorio_id, paciente, ci, celular, fecha, turno, motivo, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [f.consultorio_id, f.paciente, f.ci, f.celular, f.fecha, f.turno, f.motivo, numero]
  );
  return { id: resultado.lastInsertRowId, numero: numero }; // el id lo puso AUTOINCREMENT
}

// ---------- UPDATE ----------
// Reprogramar: cambia el día y el turno de UNA ficha (por su id)
export async function reprogramarFicha(db, id, fecha, turno) {
  const ficha = await db.getFirstAsync('SELECT consultorio_id FROM fichas WHERE id = ?', [id]);
  const numero = await siguienteNumero(db, ficha.consultorio_id, fecha, turno, id);
  await db.runAsync(
    "UPDATE fichas SET fecha = ?, turno = ?, numero = ?, estado = 'Pendiente' WHERE id = ?",
    [fecha, turno, numero, id]
  );
  return numero;
}

// Cambiar el estado de UNA ficha: 'Pendiente', 'Atendida' o 'Cancelada'
export async function cambiarEstado(db, id, estado) {
  await db.runAsync('UPDATE fichas SET estado = ? WHERE id = ?', [estado, id]);
}

// ---------- DELETE ----------
// Borra UNA ficha (por su id). Sin el WHERE se borrarían todas.
export async function eliminarFicha(db, id) {
  await db.runAsync('DELETE FROM fichas WHERE id = ?', [id]);
}
