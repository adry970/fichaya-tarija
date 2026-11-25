// CampoTexto.js: TextInput controlado con su etiqueta arriba y el mensaje de error abajo.
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORES } from '../tema';

export default function CampoTexto({ etiqueta, valor, alCambiar, error, ...otros }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[estilos.input, error ? estilos.inputError : null, otros.multiline ? estilos.multilinea : null]}
        value={valor}
        onChangeText={alCambiar}
        placeholderTextColor="#9AA9A8"
        {...otros}
      />
      {error ? <Text style={estilos.error}>{error}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { marginBottom: 14 },
  etiqueta: { fontSize: 14, fontWeight: 'bold', color: COLORES.oscuro, marginBottom: 6 },
  input: { backgroundColor: COLORES.blanco, borderWidth: 1.5, borderColor: COLORES.borde, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: COLORES.texto },
  inputError: { borderColor: COLORES.error },
  multilinea: { minHeight: 80, textAlignVertical: 'top' },
  error: { color: COLORES.error, fontSize: 13, marginTop: 5, fontWeight: '600' },
});
