// App.js: navegación de FichaYa Tarija.
// Navegador 1: Stack (pantallas que se abren encima).
// Navegador 2: Tabs (pestañas de abajo), que va dentro del Stack.
// SQLiteProvider abre (o crea) el archivo fichaya.db y ejecuta iniciarBase una sola vez.
// FichasProvider lee la base y comparte los datos con todas las pantallas.
// ClimaProvider consulta la API Open-Meteo una vez al abrir la app (cargando / error / datos).
import { View, ActivityIndicator, Text } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FichasProvider, useFichas } from './estado/FichasContext';
import { ClimaProvider } from './estado/ClimaContext';
import { iniciarBase } from './datos';
import { COLORES } from './tema';

import InicioScreen from './screens/InicioScreen';
import ConsultoriosScreen from './screens/ConsultoriosScreen';
import MisFichasScreen from './screens/MisFichasScreen';
import DetalleConsultorioScreen from './screens/DetalleConsultorioScreen';
import FormularioFichaScreen from './screens/FormularioFichaScreen';
import DetalleFichaScreen from './screens/DetalleFichaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const encabezado = {
  headerStyle: { backgroundColor: COLORES.principal },
  headerTintColor: COLORES.blanco,
  headerTitleStyle: { fontWeight: 'bold' },
};

const ICONOS = { Inicio: 'home', Consultorios: 'medkit', MisFichas: 'ticket' };

function Pestanas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...encabezado,
        tabBarActiveTintColor: COLORES.principal,
        tabBarInactiveTintColor: '#9AA9A8',
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONOS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} options={{ title: 'FichaYa Tarija', tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Consultorios" component={ConsultoriosScreen} />
      <Tab.Screen name="MisFichas" component={MisFichasScreen} options={{ title: 'Mis fichas' }} />
    </Tab.Navigator>
  );
}

// Mientras se lee la base por primera vez se muestra un indicador de carga
function Contenido() {
  const { cargando } = useFichas();
  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORES.fondo }}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={{ marginTop: 12, color: COLORES.suave }}>Abriendo la base de datos...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={encabezado}>
        <Stack.Screen name="Principal" component={Pestanas} options={{ headerShown: false }} />
        <Stack.Screen name="DetalleConsultorio" component={DetalleConsultorioScreen} options={{ title: 'Detalle del consultorio' }} />
        <Stack.Screen
          name="FormularioFicha"
          component={FormularioFichaScreen}
          options={({ route }) => ({ title: route.params?.fichaId ? 'Reprogramar ficha' : 'Sacar ficha' })}
        />
        <Stack.Screen name="DetalleFicha" component={DetalleFichaScreen} options={{ title: 'Mi ficha' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="fichaya.db" onInit={iniciarBase}>
      <FichasProvider>
        <ClimaProvider>
          <Contenido />
        </ClimaProvider>
      </FichasProvider>
    </SQLiteProvider>
  );
}
