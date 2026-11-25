// Pestaña 1 · Inicio: saludo, próxima ficha (SQLite) con su clima (API), resumen (COUNT) y clima de hoy (API).
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFichas } from '../estado/FichasContext';
import TarjetaClima from '../components/TarjetaClima';
import { useClima, consejo } from '../estado/ClimaContext';
import { COLORES } from '../tema';
import { hoy, fechaCompleta } from '../utils/fechas';

export default function InicioScreen({ navigation }) {
  const { fichas, resumen, buscarConsultorio } = useFichas();

  // Próxima ficha: la primera pendiente desde hoy, ordenada por fecha (sobre una copia)
  const pendientes = fichas.filter((f) => f.estado === 'Pendiente' && f.fecha >= hoy());
  const proxima = [...pendientes].sort((a, b) => (a.fecha + a.turno).localeCompare(b.fecha + b.turno))[0];

  // Resumen: viene de SELECT estado, COUNT(*) ... GROUP BY estado (datos.js)
  const contar = (estado) => resumen[estado];
  // INTEGRACIÓN: la ficha viene de SQLite y el pronóstico de ese día viene de la API
  const { clima } = useClima();
  const climaProxima = proxima && clima ? clima.dias.find((d) => d.fecha === proxima.fecha) : null;

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.saludo}>
        <Image source={require('../assets/logo.png')} style={estilos.logo} />
        <View style={{ flex: 1 }}>
          <Text style={estilos.hola}>¡Hola!</Text>
          <Text style={estilos.subtitulo}>Saca tu ficha sin hacer fila</Text>
        </View>
      </View>

      {proxima ? (
        <TouchableOpacity style={estilos.proxima} onPress={() => navigation.navigate('DetalleFicha', { id: proxima.id })}>
          <Text style={estilos.etiquetaProxima}>TU PRÓXIMA FICHA</Text>
          <View style={estilos.filaProxima}>
            <Text style={estilos.numero}>N° {proxima.numero}</Text>
            <View style={{ flex: 1 }}>
              <Text style={estilos.consultorio}>{buscarConsultorio(proxima.consultorio_id).nombre}</Text>
              <Text style={estilos.cuando}>{fechaCompleta(proxima.fecha)} · Turno {proxima.turno.toLowerCase()}</Text>
            </View>
          </View>
          {climaProxima ? (
            <View style={estilos.climaProxima}>
              <Ionicons name={climaProxima.lluvia > 0 ? 'rainy' : 'partly-sunny'} size={18} color={COLORES.blanco} />
              <Text style={estilos.textoClimaProxima}>
                Ese día: {climaProxima.min}° / {climaProxima.max}° · {consejo(climaProxima)}
              </Text>
            </View>
          ) : null}
          <View style={estilos.verTurno}>
            <Text style={estilos.textoVerTurno}>Ver mi ficha</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORES.blanco} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={estilos.sinFicha}>
          <Ionicons name="ticket-outline" size={30} color={COLORES.principal} />
          <Text style={estilos.textoSinFicha}>No tienes fichas pendientes.</Text>
        </View>
      )}

      <View style={estilos.resumen}>
        {[['Pendiente', 'Pendientes', '#8A6400'], ['Atendida', 'Atendidas', '#1E7B3C'], ['Cancelada', 'Canceladas', COLORES.suave]].map(
          ([estado, texto, color]) => (
            <View key={estado} style={estilos.cuadro}>
              <Text style={[estilos.cantidad, { color: color }]}>{contar(estado)}</Text>
              <Text style={estilos.textoCuadro}>{texto}</Text>
            </View>
          )
        )}
      </View>

      <View style={{ marginTop: 14 }}>
        <TarjetaClima />
      </View>

      <Text style={estilos.seccion}>Accesos rápidos</Text>
      <View style={estilos.accesos}>
        <TouchableOpacity style={estilos.acceso} onPress={() => navigation.navigate('Consultorios')}>
          <View style={[estilos.iconoAcceso, { backgroundColor: '#FDE7DE' }]}>
            <Ionicons name="add-circle" size={26} color={COLORES.acento} />
          </View>
          <Text style={estilos.textoAcceso}>Sacar ficha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.acceso} onPress={() => navigation.navigate('MisFichas')}>
          <View style={estilos.iconoAcceso}>
            <Ionicons name="ticket" size={24} color={COLORES.principal} />
          </View>
          <Text style={estilos.textoAcceso}>Mis fichas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  contenido: { padding: 18, paddingBottom: 30 },
  saludo: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  logo: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: COLORES.borde },
  hola: { fontSize: 26, fontWeight: 'bold', color: COLORES.oscuro },
  subtitulo: { fontSize: 14, color: COLORES.suave },
  proxima: { backgroundColor: COLORES.principal, borderRadius: 20, padding: 18 },
  etiquetaProxima: { color: COLORES.blanco, opacity: 0.85, fontSize: 12, fontWeight: 'bold' },
  filaProxima: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  numero: { fontSize: 46, fontWeight: 'bold', color: COLORES.blanco },
  consultorio: { fontSize: 16, fontWeight: 'bold', color: COLORES.blanco },
  cuando: { fontSize: 13, color: COLORES.blanco, opacity: 0.85, marginTop: 2 },
  verTurno: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: 11, marginTop: 14 },
  textoVerTurno: { color: COLORES.blanco, fontSize: 14 },
  sinFicha: { backgroundColor: COLORES.blanco, borderRadius: 20, padding: 22, alignItems: 'center', gap: 8 },
  textoSinFicha: { fontSize: 15, color: COLORES.suave },
  resumen: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cuadro: { flex: 1, backgroundColor: COLORES.blanco, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  cantidad: { fontSize: 24, fontWeight: 'bold' },
  textoCuadro: { fontSize: 12, color: COLORES.suave },
  climaProxima: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  textoClimaProxima: { color: COLORES.blanco, fontSize: 13, fontWeight: '600' },
  seccion: { fontSize: 17, fontWeight: 'bold', color: COLORES.oscuro, marginTop: 20, marginBottom: 10 },
  accesos: { flexDirection: 'row', gap: 12 },
  acceso: { flex: 1, backgroundColor: COLORES.blanco, borderRadius: 16, padding: 16, gap: 10 },
  iconoAcceso: { width: 46, height: 46, borderRadius: 12, backgroundColor: COLORES.borde, alignItems: 'center', justifyContent: 'center' },
  textoAcceso: { fontSize: 15, fontWeight: 'bold', color: COLORES.oscuro },
});
