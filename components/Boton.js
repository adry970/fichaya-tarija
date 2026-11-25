// Boton.js: botón reutilizable con tres estilos: principal (coral), normal (verde) y borde.
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../tema';

export default function Boton({ texto, onPress, tipo = 'normal', icono, estilo }) {
  const colores = {
    principal: { fondo: COLORES.acento, texto: COLORES.blanco, borde: COLORES.acento },
    normal: { fondo: COLORES.principal, texto: COLORES.blanco, borde: COLORES.principal },
    borde: { fondo: COLORES.blanco, texto: COLORES.principal, borde: COLORES.principal },
    peligro: { fondo: COLORES.blanco, texto: COLORES.error, borde: '#E7B7B1' },
  }[tipo];

  return (
    <TouchableOpacity
      style={[estilos.boton, { backgroundColor: colores.fondo, borderColor: colores.borde }, estilo]}
      onPress={onPress}
    >
      {icono ? <Ionicons name={icono} size={19} color={colores.texto} /> : null}
      <Text style={[estilos.texto, { color: colores.texto }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  boton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 2 },
  texto: { fontSize: 16, fontWeight: 'bold' },
});
