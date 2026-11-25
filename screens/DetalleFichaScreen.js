// Stack · Mi ficha. Recibe { id } por parámetros y busca la ficha.
// Desde aquí se reprograma, se marca como atendida, se cancela o se elimina.
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Boton from '../components/Boton';
import Etiqueta from '../components/Etiqueta';
import { useFichas } from '../estado/FichasContext';
import TarjetaClima from '../components/TarjetaClima';
import { COLORES } from '../tema';
import { fechaCompleta } from '../utils/fechas';

export default function DetalleFichaScreen({ route, navigation }) {
  const { id } = route.params; // ← dato que llega desde Mis fichas, Inicio o el formulario
  const { fichas, buscarConsultorio, cambiarEstado, eliminarFicha } = useFichas();
  const ficha = fichas.find((f) => f.id === id);

  if (!ficha) {
    return (
      <View style={[estilos.pantalla, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={estilos.ayuda}>Esta ficha ya no existe.</Text>
      </View>
    );
  }

  const consultorio = buscarConsultorio(ficha.consultorio_id);
  const pendiente = ficha.estado === 'Pendiente';

  const cancelar = () => {
    Alert.alert('Cancelar ficha', '¿Seguro que quiere cancelar la ficha N° ' + ficha.numero + '? El cupo quedará libre.', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => cambiarEstado(ficha.id, 'Cancelada') }, // UPDATE
    ]);
  };

  const eliminar = () => {
    Alert.alert('Eliminar ficha', 'La ficha se borrará de su historial. Esta acción no se puede deshacer.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          navigation.goBack();
          await eliminarFicha(ficha.id); // DELETE ... WHERE id = ?
        },
      },
    ]);
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.ticket}>
        <Text style={estilos.etiquetaTicket}>TU FICHA</Text>
        <Text style={[estilos.numero, !pendiente && { color: COLORES.suave }]}>N° {ficha.numero}</Text>
        <Text style={estilos.consultorio}>{consultorio.nombre}</Text>
        <Text style={estilos.ayuda}>{fechaCompleta(ficha.fecha)} · Turno {ficha.turno.toLowerCase()}</Text>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Etiqueta estado={ficha.estado} />
        </View>
        <View style={estilos.linea} />
        {[
          ['person-outline', 'Paciente', ficha.paciente],
          ['card-outline', 'CI', ficha.ci],
          ['call-outline', 'Celular', ficha.celular || '—'],
          ['location-outline', 'Dirección', consultorio.direccion],
          ['document-text-outline', 'Motivo', ficha.motivo || '—'],
        ].map(([icono, etiqueta, valor]) => (
          <View key={etiqueta} style={estilos.fila}>
            <Ionicons name={icono} size={18} color={COLORES.principal} />
            <Text style={estilos.etiqueta}>{etiqueta}</Text>
            <Text style={estilos.valor}>{valor}</Text>
          </View>
        ))}
      </View>

      {/* INTEGRACIÓN: la fecha sale de SQLite y el pronóstico de esa fecha sale de la API */}
      <View style={{ marginVertical: 14 }}>
        <TarjetaClima fecha={ficha.fecha} />
      </View>

      {pendiente ? (
        <>
          <Boton icono="create-outline" texto="Reprogramar" onPress={() => navigation.navigate('FormularioFicha', { fichaId: ficha.id })} />
          <Boton tipo="borde" icono="checkmark-circle" texto="Marcar como atendida" onPress={() => cambiarEstado(ficha.id, 'Atendida')} estilo={{ marginTop: 10 }} />
          <Boton tipo="peligro" icono="close-circle" texto="Cancelar ficha" onPress={cancelar} estilo={{ marginTop: 10 }} />
        </>
      ) : (
        <Boton tipo="peligro" icono="trash-outline" texto="Eliminar del historial" onPress={eliminar} />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  contenido: { padding: 18, paddingBottom: 36 },
  ticket: { backgroundColor: COLORES.blanco, borderRadius: 22, padding: 20, alignItems: 'stretch' },
  etiquetaTicket: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: COLORES.suave, letterSpacing: 1 },
  numero: { textAlign: 'center', fontSize: 64, fontWeight: 'bold', color: COLORES.principal },
  consultorio: { textAlign: 'center', fontSize: 17, fontWeight: 'bold', color: COLORES.oscuro },
  ayuda: { textAlign: 'center', fontSize: 14, color: COLORES.suave, marginTop: 3 },
  linea: { borderTopWidth: 2, borderStyle: 'dashed', borderColor: COLORES.borde, marginVertical: 16 },
  fila: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  etiqueta: { width: 76, fontSize: 14, color: COLORES.suave },
  valor: { flex: 1, fontSize: 14, fontWeight: 'bold', color: COLORES.oscuro, textAlign: 'right' },
});
