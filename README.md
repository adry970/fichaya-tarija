# FichaYa Tarija

App móvil para sacar ficha en consultorios médicos de Tarija desde el celular, sin hacer fila.

**Grupo 02 · Aplicaciones Móviles I (SIS-0180) · UPDS Tarija**
Integrantes: Fernandez Gareca Alejandro · Gallardo Ramos Adriana Jimena
Docente: Ing. Juan Huanto Villca

## Descargar el APK

Ir a **Releases → v1.0.0** y descargar `grupo02-fichayatarija-v1.0.0.apk`.
El SHA-256 del archivo está escrito en la descripción del release.

## Qué hace

- Lista de consultorios con filtro por especialidad y búsqueda por nombre o zona.
- Sacar, reprogramar, cancelar y eliminar fichas (CRUD con SQLite, `expo-sqlite`).
- Clima y pronóstico de Tarija desde la API pública Open-Meteo, con estados de carga, error y «Reintentar».
- Cada ficha muestra el clima de su día y un consejo.

## Tecnologías

React Native + Expo SDK 58 · React Navigation (Stack + Tabs) · expo-sqlite · fetch a Open-Meteo.

## Ejecutar el código

```
npm install
npx expo start
```
