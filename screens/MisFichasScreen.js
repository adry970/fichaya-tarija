// Pestaña 3 · Mis fichas: filtro por grupo y FlatList con la tarjeta reutilizable.
import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TarjetaFicha from '../components/TarjetaFicha';
import { useFichas } from '../estado/FichasContext';
import { COLORES } from '../tema';

const FILTROS = ['Todas', 'Pendientes', 'Historial'];

export default function MisFichasScreen({ navigation }) {
  const { fichas, buscarConsultorio } = useFichas();
  const [filtro, setFiltro] = useState('Todas');

  const visibles = fichas
    .filter((f) => filtro === 'Todas' || (filtro === 'Pendientes' ? f.estado === 'Pendiente' : f.estado !== 'Pendiente'))
    .sort((a, b) => b.fecha.localeCompare(a.fecha)); // filter devuelve una copia: ordenarla no cambia el original

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.segmentos}>
        {FILTROS.map((f) => (
          <TouchableOpacity key={f} style={[estilos.segmento, f === filtro && estilos.segmentoActivo]} onPress={() => setFiltro(f)}>
            <Text style={[estilos.textoSegmento, f === filtro && estilos.textoActivo]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TarjetaFicha
            ficha={item}
            consultorio={buscarConsultorio(item.consultorio_id)}
            onPress={() => navigation.navigate('DetalleFicha', { id: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={estilos.vacio}>
            <Ionicons name="ticket-outline" size={40} color={COLORES.borde} />
            <Text style={estilos.textoVacio}>No hay fichas en esta lista.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  segmentos: { flexDirection: 'row', backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 12, padding: 4, margin: 16, marginBottom: 12 },
  segmento: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  segmentoActivo: { backgroundColor: COLORES.principal },
  textoSegmento: { fontSize: 14, fontWeight: '600', color: COLORES.suave },
  textoActivo: { color: COLORES.blanco, fontWeight: 'bold' },
  vacio: { alignItems: 'center', marginTop: 40, gap: 10 },
  textoVacio: { color: COLORES.suave, fontSize: 15 },
});
