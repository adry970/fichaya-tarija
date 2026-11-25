// TarjetaClima.js: muestra el clima con los TRES estados (cargando, error con «Reintentar» y datos).
//   <TarjetaClima />              → clima de hoy en Tarija (Inicio)
//   <TarjetaClima fecha="..." />  → pronóstico para el día de una ficha (Mi ficha)
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useClima, consejo } from '../estado/ClimaContext';
import { COLORES } from '../tema';
import { hoy } from '../utils/fechas';

export default function TarjetaClima({ fecha }) {
  const { clima, cargando, error, reintentar } = useClima();

  // Estado 1: cargando
  if (cargando) {
    return (
      <View style={estilos.tarjeta}>
        <ActivityIndicator size="small" color={COLORES.principal} />
        <Text style={estilos.texto}>Consultando el clima de Tarija...</Text>
      </View>
    );
  }

  // Estado 2: error, con botón para volver a intentar
  if (error !== '') {
    return (
      <View style={[estilos.tarjeta, estilos.tarjetaError]}>
        <Ionicons name="cloud-offline-outline" size={30} color={COLORES.error} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.textoError}>{error}</Text>
          <TouchableOpacity style={estilos.boton} onPress={reintentar}>
            <Ionicons name="refresh" size={16} color={COLORES.blanco} />
            <Text style={estilos.textoBoton}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Estado 3: datos
  const dia = clima.dias.find((d) => d.fecha === (fecha || hoy()));
  const titulo = fecha ? 'Clima en Tarija ese día' : 'Hoy en Tarija · ' + clima.temperatura + ' °C';

  if (!dia) {
    return (
      <View style={estilos.tarjeta}>
        <Ionicons name="calendar-outline" size={30} color={COLORES.suave} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.texto}>{fecha < hoy() ? 'Esta ficha ya pasó.' : 'El pronóstico aparece 7 días antes.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.tarjeta}>
      <Ionicons name={dia.lluvia > 0 ? 'rainy' : 'partly-sunny'} size={36} color={COLORES.acento} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.texto}>
          Mín. {dia.min}° · Máx. {dia.max}° · {dia.lluvia > 0 ? 'Lluvia ' + dia.lluvia + ' mm' : 'Sin lluvia'}
          {fecha ? '' : ' · Viento ' + clima.viento + ' km/h'}
        </Text>
        <Text style={estilos.consejo}>{consejo(dia)}</Text>
        <Text style={estilos.fuente}>Fuente: Open-Meteo</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORES.blanco, borderRadius: 16, padding: 14 },
  tarjetaError: { backgroundColor: '#FBE1DE' },
  titulo: { fontSize: 15, fontWeight: 'bold', color: COLORES.oscuro },
  texto: { fontSize: 13, color: COLORES.suave, marginTop: 2 },
  consejo: { fontSize: 13, fontWeight: 'bold', color: COLORES.principal, marginTop: 4 },
  fuente: { fontSize: 11, color: '#9AA9A8', marginTop: 3 },
  textoError: { fontSize: 14, fontWeight: '600', color: COLORES.error },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: COLORES.error, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginTop: 8 },
  textoBoton: { color: COLORES.blanco, fontWeight: 'bold', fontSize: 14 },
});
