// Pestaña 2 · Consultorios: buscador, filtro por especialidad y FlatList con la tarjeta reutilizable.
import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TarjetaConsultorio from '../components/TarjetaConsultorio';
import { useFichas } from '../estado/FichasContext';
import { ESPECIALIDADES } from '../data/ejemplo';
import { COLORES } from '../tema';
import { hoy, esDomingo } from '../utils/fechas';

export default function ConsultoriosScreen({ navigation }) {
  const { consultorios, libres } = useFichas(); // consultorios: SELECT * FROM consultorios
  const [busqueda, setBusqueda] = useState('');
  const [especialidad, setEspecialidad] = useState('Todas');

  const texto = busqueda.trim().toLowerCase();
  const visibles = consultorios.filter(
    (c) =>
      (especialidad === 'Todas' || c.especialidad === especialidad) &&
      (c.nombre.toLowerCase().includes(texto) || c.direccion.toLowerCase().includes(texto))
  );

  // Fichas libres hoy = mañana + tarde (los domingos no hay atención)
  const libresHoy = (c) => (esDomingo(hoy()) ? 0 : libres(c.id, hoy(), 'Mañana') + libres(c.id, hoy(), 'Tarde'));

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={19} color={COLORES.suave} />
        <TextInput
          style={estilos.input}
          placeholder="Buscar por nombre o zona"
          placeholderTextColor="#9AA9A8"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <View style={estilos.chips}>
        {ESPECIALIDADES.map((e) => (
          <TouchableOpacity key={e} style={[estilos.chip, e === especialidad && estilos.chipActivo]} onPress={() => setEspecialidad(e)}>
            <Text style={[estilos.textoChip, e === especialidad && estilos.textoChipActivo]}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TarjetaConsultorio
            consultorio={item}
            libresHoy={libresHoy(item)}
            onPress={() => navigation.navigate('DetalleConsultorio', { id: item.id, nombre: item.nombre })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<Text style={estilos.vacio}>No hay consultorios con esa búsqueda.</Text>}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  buscador: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 12, paddingHorizontal: 14, margin: 16, marginBottom: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: COLORES.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  chip: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999, backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde },
  chipActivo: { backgroundColor: COLORES.principal, borderColor: COLORES.principal },
  textoChip: { fontSize: 13, fontWeight: '600', color: COLORES.oscuro },
  textoChipActivo: { color: COLORES.blanco },
  vacio: { textAlign: 'center', color: COLORES.suave, marginTop: 30, fontSize: 15 },
});
