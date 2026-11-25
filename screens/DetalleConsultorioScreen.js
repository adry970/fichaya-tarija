// Stack · Detalle del consultorio. Recibe { id, nombre } por parámetros (route.params).
import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Boton from '../components/Boton';
import { useFichas } from '../estado/FichasContext';
import { COLORES, ICONO_ESPECIALIDAD } from '../tema';
import { proximosDias, nombreDelDia } from '../utils/fechas';

export default function DetalleConsultorioScreen({ route, navigation }) {
  const { id, nombre } = route.params; // ← datos que llegan desde la lista
  const { buscarConsultorio, libres } = useFichas();
  const consultorio = buscarConsultorio(id);

  useEffect(() => {
    navigation.setOptions({ title: nombre });
  }, [nombre]);

  const dias = proximosDias(3);

  return (
    <View style={estilos.pantalla}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={estilos.cabecera}>
          <View style={estilos.icono}>
            <Ionicons name={ICONO_ESPECIALIDAD[consultorio.especialidad]} size={40} color={COLORES.principal} />
          </View>
          <Text style={estilos.especialidad}>{consultorio.especialidad.toUpperCase()}</Text>
          <Text style={estilos.nombre}>{consultorio.nombre}</Text>
        </View>

        <View style={estilos.cuerpo}>
          {[
            ['location-outline', consultorio.direccion],
            ['time-outline', consultorio.horario],
            ['cash-outline', 'Consulta: Bs ' + consultorio.costo],
            ['people-outline', consultorio.cupos_turno + ' fichas por turno (mañana y tarde)'],
          ].map(([icono, texto]) => (
            <View key={icono} style={estilos.fila}>
              <Ionicons name={icono} size={20} color={COLORES.principal} />
              <Text style={estilos.textoFila}>{texto}</Text>
            </View>
          ))}

          <Text style={estilos.seccion}>Fichas libres</Text>
          <View style={estilos.dias}>
            {dias.map((dia, i) => {
              const total = libres(id, dia, 'Mañana') + libres(id, dia, 'Tarde');
              return (
                <View key={dia} style={[estilos.dia, i === 0 && estilos.diaHoy]}>
                  <Text style={estilos.nombreDia}>{nombreDelDia(dia)}</Text>
                  <Text style={estilos.libres}>{total}</Text>
                  <Text style={estilos.textoLibres}>libres</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={estilos.abajo}>
        <Boton
          tipo="principal"
          icono="add-circle"
          texto="Sacar ficha"
          onPress={() => navigation.navigate('FormularioFicha', { consultorioId: id, consultorio: nombre })}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.blanco },
  cabecera: { backgroundColor: COLORES.principal, alignItems: 'center', paddingTop: 22, paddingBottom: 24, paddingHorizontal: 20 },
  icono: { width: 80, height: 80, borderRadius: 22, backgroundColor: COLORES.blanco, alignItems: 'center', justifyContent: 'center' },
  especialidad: { color: COLORES.blanco, opacity: 0.85, fontSize: 12, fontWeight: 'bold', marginTop: 14 },
  nombre: { color: COLORES.blanco, fontSize: 23, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
  cuerpo: { padding: 20 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  textoFila: { flex: 1, fontSize: 15, color: COLORES.texto },
  seccion: { fontSize: 17, fontWeight: 'bold', color: COLORES.oscuro, marginTop: 8, marginBottom: 10 },
  dias: { flexDirection: 'row', gap: 10 },
  dia: { flex: 1, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  diaHoy: { borderColor: COLORES.principal, backgroundColor: '#E6F4F2' },
  nombreDia: { fontSize: 12, fontWeight: 'bold', color: COLORES.suave },
  libres: { fontSize: 24, fontWeight: 'bold', color: COLORES.principal },
  textoLibres: { fontSize: 12, color: COLORES.suave },
  abajo: { position: 'absolute', left: 20, right: 20, bottom: 24 },
});
