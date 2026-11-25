// Stack · Formulario de ficha. Sirve para dos cosas:
//   SACAR una ficha nueva → recibe { consultorioId, consultorio }
//   REPROGRAMAR una ficha  → recibe { fichaId } (solo se cambia el día y el turno)
// Todos los TextInput son controlados (value + onChangeText) y se validan antes de guardar.
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import { useFichas } from '../estado/FichasContext';
import { COLORES } from '../tema';
import { proximosDias, nombreDelDia, formatearFecha } from '../utils/fechas';

const TURNOS = [
  { nombre: 'Mañana', icono: 'sunny-outline' },
  { nombre: 'Tarde', icono: 'moon-outline' },
];

export default function FormularioFichaScreen({ route, navigation }) {
  const { fichas, buscarConsultorio, libres, agregarFicha, reprogramarFicha } = useFichas();
  const fichaId = route.params?.fichaId;
  const fichaEditada = fichas.find((f) => f.id === fichaId);
  const editando = fichaEditada !== undefined;
  const consultorio = buscarConsultorio(editando ? fichaEditada.consultorio_id : route.params.consultorioId);

  const [paciente, setPaciente] = useState(editando ? fichaEditada.paciente : '');
  const [ci, setCi] = useState(editando ? fichaEditada.ci : '');
  const [celular, setCelular] = useState(editando ? fichaEditada.celular : '');
  const [fecha, setFecha] = useState(editando ? fichaEditada.fecha : '');
  const [turno, setTurno] = useState(editando ? fichaEditada.turno : '');
  const [motivo, setMotivo] = useState(editando ? fichaEditada.motivo : '');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const dias = proximosDias(5);

  // Al corregir un campo, su mensaje de error desaparece
  const cambiar = (campo, guardarValor) => (valor) => {
    guardarValor(valor);
    if (errores[campo]) setErrores({ ...errores, [campo]: undefined });
  };
  const hayErrores = Object.values(errores).some((e) => e);

  const validar = () => {
    const e = {};
    const nombre = paciente.trim();
    if (nombre === '') e.paciente = 'Escriba el nombre del paciente.';
    else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(nombre)) e.paciente = 'El nombre solo puede tener letras.';
    else if (nombre.split(' ').filter((p) => p !== '').length < 2) e.paciente = 'Escriba nombre y apellido.';

    if (ci.trim() === '') e.ci = 'Escriba el carnet de identidad.';
    else if (!/^\d{5,10}$/.test(ci.trim())) e.ci = 'El CI debe tener solo números (de 5 a 10 dígitos).';

    if (celular.trim() !== '' && !/^[67]\d{7}$/.test(celular.trim()))
      e.celular = 'El celular debe tener 8 dígitos y empezar con 6 o 7.';

    if (fecha === '') e.fecha = 'Elija el día de la ficha.';
    if (turno === '') e.turno = 'Elija el turno.';
    else if (fecha !== '' && libres(consultorio.id, fecha, turno, fichaId) <= 0)
      e.turno = 'Ya no quedan fichas en ese turno. Elija otro día o turno.';

    if (motivo.length > 150) e.motivo = 'El motivo puede tener como máximo 150 letras.';

    // No se permite dos fichas del mismo CI el mismo día en el mismo consultorio
    const repetida = fichas.some(
      (f) => f.ci === ci.trim() && f.consultorio_id === consultorio.id && f.fecha === fecha &&
        f.estado !== 'Cancelada' && f.id !== fichaId
    );
    if (!e.ci && !e.fecha && repetida) e.ci = 'Ese CI ya tiene una ficha ese día en este consultorio.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (guardando || !validar()) return;
    setGuardando(true); // evita guardar dos veces si se toca rápido el botón
    try {
      if (editando) {
        const numero = await reprogramarFicha(fichaId, fecha, turno); // UPDATE
        Alert.alert('Ficha reprogramada', 'Tu nueva ficha es la N° ' + numero + ' para el ' + formatearFecha(fecha) + ', turno ' + turno.toLowerCase() + '.');
        navigation.goBack();
      } else {
        const nueva = await agregarFicha({ // INSERT
          consultorio_id: consultorio.id,
          paciente: paciente.trim(),
          ci: ci.trim(),
          celular: celular.trim(),
          fecha: fecha,
          turno: turno,
          motivo: motivo.trim(),
        });
        Alert.alert('Ficha confirmada', 'Tu ficha es la N° ' + nueva.numero + ' para el ' + formatearFecha(fecha) + ', turno ' + turno.toLowerCase() + '.');
        navigation.replace('DetalleFicha', { id: nueva.id });
      }
    } catch (e) {
      Alert.alert('No se pudo guardar', 'Ocurrió un problema con la base de datos. Intente de nuevo.');
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        <View style={estilos.consultorio}>
          <Ionicons name="business" size={22} color={COLORES.principal} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.nombreConsultorio}>{consultorio.nombre}</Text>
            <Text style={estilos.detalleConsultorio}>{consultorio.especialidad} · Consulta Bs {consultorio.costo}</Text>
          </View>
        </View>

        <Text style={estilos.seccion}>1. Datos del paciente</Text>
        {editando ? (
          <View style={estilos.soloLectura}>
            <Text style={estilos.textoLectura}>{paciente} · CI {ci}</Text>
            <Text style={estilos.ayuda}>Al reprogramar solo se cambia el día y el turno.</Text>
          </View>
        ) : (
          <>
            <CampoTexto etiqueta="Nombre y apellido *" valor={paciente} alCambiar={cambiar('paciente', setPaciente)} error={errores.paciente} placeholder="Ej.: Juan Pérez" />
            <CampoTexto etiqueta="Carnet de identidad *" valor={ci} alCambiar={cambiar('ci', setCi)} error={errores.ci} placeholder="Ej.: 7654321" keyboardType="numeric" maxLength={10} />
            <CampoTexto etiqueta="Celular (opcional)" valor={celular} alCambiar={cambiar('celular', setCelular)} error={errores.celular} placeholder="Ej.: 71234567" keyboardType="phone-pad" maxLength={8} />
          </>
        )}

        <Text style={estilos.seccion}>2. Día *</Text>
        <View style={estilos.dias}>
          {dias.map((dia) => (
            <TouchableOpacity key={dia} style={[estilos.dia, dia === fecha && estilos.activo]} onPress={() => {
                setFecha(dia);
                setErrores({ ...errores, fecha: undefined, turno: undefined }); // otro día puede tener cupo
              }}>
              <Text style={[estilos.textoDia, dia === fecha && estilos.textoActivo]}>{nombreDelDia(dia)}</Text>
              <Text style={[estilos.fechaDia, dia === fecha && estilos.textoActivo]}>{formatearFecha(dia).split(' ').slice(1).join(' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errores.fecha ? <Text style={estilos.error}>{errores.fecha}</Text> : null}

        <Text style={estilos.seccion}>3. Turno *</Text>
        {TURNOS.map((t) => {
          const quedan = fecha ? libres(consultorio.id, fecha, t.nombre, fichaId) : null;
          const elegido = turno === t.nombre;
          return (
            <TouchableOpacity key={t.nombre} style={[estilos.turno, elegido && estilos.turnoActivo]} onPress={() => cambiar('turno', setTurno)(t.nombre)}>
              <View style={estilos.radio}>{elegido ? <View style={estilos.punto} /> : null}</View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.nombreTurno}>{t.nombre}</Text>
                <Text style={estilos.ayuda}>{quedan === null ? 'Elija primero el día' : quedan > 0 ? quedan + ' fichas libres' : 'Sin fichas'}</Text>
              </View>
              <Ionicons name={t.icono} size={22} color={elegido ? COLORES.acento : COLORES.suave} />
            </TouchableOpacity>
          );
        })}
        {errores.turno ? <Text style={estilos.error}>{errores.turno}</Text> : null}

        {!editando ? (
          <>
            <Text style={estilos.seccion}>4. Motivo de la consulta</Text>
            <CampoTexto etiqueta={'Opcional · ' + motivo.length + '/150'} valor={motivo} alCambiar={cambiar('motivo', setMotivo)} error={errores.motivo} placeholder="Ej.: Dolor de garganta y fiebre" multiline />
          </>
        ) : null}

        {hayErrores ? (
          <View style={estilos.aviso}>
            <Ionicons name="alert-circle" size={20} color={COLORES.error} />
            <Text style={estilos.textoAviso}>Revise los campos marcados en rojo.</Text>
          </View>
        ) : null}

        <Boton tipo="principal" icono="checkmark-circle" texto={guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Confirmar ficha'} onPress={guardar} estilo={{ marginTop: 8 }} />
        <Boton tipo="borde" texto="Cancelar" onPress={() => navigation.goBack()} estilo={{ marginTop: 10 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  contenido: { padding: 18, paddingBottom: 40 },
  consultorio: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORES.blanco, borderRadius: 14, padding: 14 },
  nombreConsultorio: { fontSize: 16, fontWeight: 'bold', color: COLORES.oscuro },
  detalleConsultorio: { fontSize: 13, color: COLORES.suave },
  seccion: { fontSize: 16, fontWeight: 'bold', color: COLORES.oscuro, marginTop: 18, marginBottom: 10 },
  soloLectura: { backgroundColor: COLORES.borde, borderRadius: 12, padding: 14 },
  textoLectura: { fontSize: 15, fontWeight: 'bold', color: COLORES.oscuro },
  dias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dia: { width: '31%', backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  activo: { backgroundColor: COLORES.principal, borderColor: COLORES.principal },
  textoDia: { fontSize: 13, fontWeight: 'bold', color: COLORES.oscuro },
  fechaDia: { fontSize: 12, color: COLORES.suave },
  textoActivo: { color: COLORES.blanco },
  turno: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 14, padding: 14, marginBottom: 10 },
  turnoActivo: { borderColor: COLORES.principal, backgroundColor: '#E6F4F2' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORES.principal, alignItems: 'center', justifyContent: 'center' },
  punto: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORES.principal },
  nombreTurno: { fontSize: 15, fontWeight: 'bold', color: COLORES.oscuro },
  ayuda: { fontSize: 13, color: COLORES.suave, marginTop: 2 },
  error: { color: COLORES.error, fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 4 },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FBE1DE', borderRadius: 12, padding: 12, marginTop: 6 },
  textoAviso: { color: COLORES.error, fontWeight: '600', fontSize: 14 },
});
