// Etiqueta.js: «pastilla» de color para el estado de una ficha.
import { View, Text, StyleSheet } from 'react-native';

const COLORES_ESTADO = {
  Pendiente: { fondo: '#FFF3CD', texto: '#8A6400' },
  Atendida: { fondo: '#DDF3E4', texto: '#1E7B3C' },
  Cancelada: { fondo: '#ECEFEF', texto: '#5E6E6D' },
};

export default function Etiqueta({ estado }) {
  const c = COLORES_ESTADO[estado] || COLORES_ESTADO.Cancelada;
  return (
    <View style={[estilos.etiqueta, { backgroundColor: c.fondo }]}>
      <Text style={[estilos.texto, { color: c.texto }]}>{estado}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  texto: { fontSize: 12, fontWeight: 'bold' },
});
