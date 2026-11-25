// TarjetaConsultorio.js: tarjeta reutilizable de un consultorio (se usa en la lista de Consultorios).
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, ICONO_ESPECIALIDAD } from '../tema';

export default function TarjetaConsultorio({ consultorio, libresHoy, onPress }) {
  const zona = consultorio.direccion.split(', ')[1];
  return (
    <TouchableOpacity style={estilos.tarjeta} onPress={onPress}>
      <View style={estilos.icono}>
        <Ionicons name={ICONO_ESPECIALIDAD[consultorio.especialidad]} size={24} color={COLORES.principal} />
      </View>
      <View style={estilos.centro}>
        <Text style={estilos.nombre}>{consultorio.nombre}</Text>
        <Text style={estilos.detalle}>{consultorio.especialidad} · {zona}</Text>
        <View style={estilos.fila}>
          <View style={[estilos.cupos, libresHoy === 0 && estilos.sinCupos]}>
            <Text style={[estilos.textoCupos, libresHoy === 0 && estilos.textoSinCupos]}>
              {libresHoy > 0 ? libresHoy + ' fichas libres hoy' : 'Sin fichas hoy'}
            </Text>
          </View>
          <Text style={estilos.costo}>Bs {consultorio.costo}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9AA9A8" />
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORES.blanco, borderRadius: 16, padding: 14, gap: 12, elevation: 2, shadowColor: '#073B3A', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  icono: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORES.borde, alignItems: 'center', justifyContent: 'center' },
  centro: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: 'bold', color: COLORES.oscuro },
  detalle: { fontSize: 13, color: COLORES.suave, marginTop: 2 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cupos: { backgroundColor: '#DDF3E4', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  sinCupos: { backgroundColor: '#ECEFEF' },
  textoCupos: { fontSize: 12, fontWeight: 'bold', color: '#1E7B3C' },
  textoSinCupos: { color: COLORES.suave },
  costo: { fontSize: 13, fontWeight: 'bold', color: COLORES.principal },
});
