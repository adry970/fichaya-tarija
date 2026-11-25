// utils/fechas.js: ayudas para manejar fechas en formato 'AAAA-MM-DD' (así se guardarán en SQLite).
// Se escriben a mano (sin toLocaleDateString) para que se vean igual en cualquier celular.
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function aTexto(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return anio + '-' + mes + '-' + dia;
}

function aFecha(texto) {
  const [anio, mes, dia] = texto.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function hoy() {
  return aTexto(new Date());
}

// sumarDias('2026-11-19', 2) → '2026-11-21'
export function sumarDias(texto, cantidad) {
  const fecha = aFecha(texto);
  fecha.setDate(fecha.getDate() + cantidad);
  return aTexto(fecha);
}

// '2026-11-20' → 'Vie 20 nov'
export function formatearFecha(texto) {
  const fecha = aFecha(texto);
  return DIAS[fecha.getDay()] + ' ' + fecha.getDate() + ' ' + MESES[fecha.getMonth()];
}

// Muestra «Hoy» o «Mañana» cuando corresponde
export function nombreDelDia(texto) {
  if (texto === hoy()) return 'Hoy';
  if (texto === sumarDias(hoy(), 1)) return 'Mañana';
  return formatearFecha(texto);
}

export function esDomingo(texto) {
  return aFecha(texto).getDay() === 0;
}

// Los próximos días de atención (sin domingos), empezando hoy
export function proximosDias(cantidad) {
  const lista = [];
  let i = 0;
  while (lista.length < cantidad) {
    const dia = sumarDias(hoy(), i);
    if (!esDomingo(dia)) lista.push(dia);
    i++;
  }
  return lista;
}

// 'Hoy, Jue 19 nov' · 'Mañana, Vie 20 nov' · 'Sáb 21 nov'
export function fechaCompleta(texto) {
  const nombre = nombreDelDia(texto);
  return nombre === formatearFecha(texto) ? nombre : nombre + ', ' + formatearFecha(texto);
}
