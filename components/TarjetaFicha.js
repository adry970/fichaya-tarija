// TarjetaFicha.js: tarjeta reutilizable de una ficha (se usa en Mis fichas).
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Etiqueta from './Etiqueta';
import { COLORES } from '../tema';
import { fechaCompleta } from '../utils/fechas';

export default function TarjetaFicha({ ficha, consultorio, onPress }) {
  const activa = ficha.estado === 'Pendiente';
  return (
    <TouchableOpacity style={estilos.tarjeta} onPress={onPress}>
      <View style={[estilos.numero, activa && estilos.numeroActivo]}>
        <Text style={[estilos.nro, activa && estilos.blanco]}>N°</Text>
        <Text style={[estilos.valor, activa && estilos.blanco]}>{ficha.numero}</Text>
      </View>
      <View style={estilos.centro}>
        <Text style={estilos.consultorio}>{consultorio.nombre}</Text>
        <Text style={estilos.detalle}>
          {fechaCompleta(ficha.fecha)} · Turno {ficha.turno.toLowerCase()}
        </Text>
        <Etiqueta estado={ficha.estado} />
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9AA9A8" />
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORES.blanco, borderRadius: 16, padding: 14, gap: 12, elevation: 2, shadowColor: '#073B3A', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  numero: { width: 58, height: 58, borderRadius: 14, backgroundColor: COLORES.borde, alignItems: 'center', justifyContent: 'center' },
  numeroActivo: { backgroundColor: COLORES.principal },
  nro: { fontSize: 11, fontWeight: 'bold', color: COLORES.principal },
  valor: { fontSize: 22, fontWeight: 'bold', color: COLORES.principal, lineHeight: 24 },
  blanco: { color: COLORES.blanco },
  centro: { flex: 1, gap: 4 },
  consultorio: { fontSize: 15, fontWeight: 'bold', color: COLORES.oscuro },
  detalle: { fontSize: 13, color: COLORES.suave },
});
