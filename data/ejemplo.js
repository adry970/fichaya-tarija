// data/ejemplo.js: datos INICIALES que se guardan en SQLite la primera vez que se abre la app
// (ver iniciarBase en datos.js). Desde ahí, todo se lee y se escribe en la base de datos.
// Los consultorios y los pacientes son ficticios.
import { hoy, sumarDias, proximosDias } from '../utils/fechas';

// Tabla consultorios (el id lo pone AUTOINCREMENT: 1, 2, 3...)
export const CONSULTORIOS_INICIALES = [
  { id: 1, nombre: 'Consultorio San Martín', especialidad: 'Medicina general', direccion: 'Calle Sucre 450, Zona Central', horario: 'Lun a Sáb · 8:00–12:00 y 15:00–19:00', costo: 50, cupos_turno: 10 },
  { id: 2, nombre: 'Centro Pediátrico Los Chapacos', especialidad: 'Pediatría', direccion: 'Av. Las Américas 210, Barrio Las Panosas', horario: 'Lun a Sáb · 8:00–12:00 y 15:00–18:00', costo: 70, cupos_turno: 8 },
  { id: 3, nombre: 'Dental Sonrisa', especialidad: 'Odontología', direccion: 'Av. La Paz 1180, Zona El Molino', horario: 'Lun a Vie · 9:00–12:30 y 15:30–19:30', costo: 60, cupos_turno: 6 },
  { id: 4, nombre: 'Consultorio Vecinal Lourdes', especialidad: 'Medicina general', direccion: 'Calle Colón 89, Barrio Lourdes', horario: 'Lun a Sáb · 7:30–12:00 y 14:30–18:00', costo: 20, cupos_turno: 12 },
  { id: 5, nombre: 'Consultorio Dra. Rojas', especialidad: 'Ginecología', direccion: 'Calle Ingavi 345, Zona Central', horario: 'Lun a Vie · 8:30–12:00 y 15:00–20:00', costo: 80, cupos_turno: 6 },
];

export const ESPECIALIDADES = ['Todas', 'Medicina general', 'Pediatría', 'Odontología', 'Ginecología'];

const dias = proximosDias(3); // [hoy, siguiente día de atención, ...]

// Tabla fichas: 4 fichas de ejemplo para que la app no empiece vacía
export const FICHAS_EJEMPLO = [
  { id: 1, consultorio_id: 1, paciente: 'Alejandro Fernandez Gareca', ci: '7654321', celular: '71234567', fecha: dias[0], turno: 'Mañana', motivo: 'Dolor de garganta y fiebre', numero: 7, estado: 'Pendiente' },
  { id: 2, consultorio_id: 3, paciente: 'Alejandro Fernandez Gareca', ci: '7654321', celular: '71234567', fecha: dias[2], turno: 'Tarde', motivo: 'Limpieza dental', numero: 2, estado: 'Pendiente' },
  { id: 3, consultorio_id: 2, paciente: 'María López Vargas', ci: '8123456', celular: '', fecha: sumarDias(hoy(), -6), turno: 'Mañana', motivo: 'Control de vacunas de mi hijo', numero: 5, estado: 'Atendida' },
  { id: 4, consultorio_id: 1, paciente: 'Alejandro Fernandez Gareca', ci: '7654321', celular: '71234567', fecha: sumarDias(hoy(), -13), turno: 'Tarde', motivo: 'Chequeo general', numero: 11, estado: 'Cancelada' },
];
