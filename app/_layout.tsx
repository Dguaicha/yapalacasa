import { Stack } from 'expo-router'
import * as ExpoSplash from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import '../src/global.css'
import { CartProvider } from '../src/context/CartContext'
import { LocationProvider } from '../src/context/LocationContext'
import { setupGlobalErrorHandler, logger } from '../src/services/logger'

// Setup global error handler for uncaught errors
setupGlobalErrorHandler()

void ExpoSplash.preventAutoHideAsync()

logger.info('App initialized')

export default function RootLayout() {
  return (
    <SafeAreaProvider>
    <LocationProvider>
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="restaurante/[id]" />
        <Stack.Screen name="filtros" />
        <Stack.Screen name="ubicacion" />
        <Stack.Screen name="carrito" />
        <Stack.Screen name="mis-reservas" />
        <Stack.Screen name="configuracion/index" />
        <Stack.Screen name="configuracion/cuenta" />
        <Stack.Screen name="configuracion/notificaciones" />
        <Stack.Screen name="configuracion/soporte" />
        <Stack.Screen name="configuracion/negocio" />
        <Stack.Screen name="negocio/index" />
        <Stack.Screen name="negocio/editar" />
        <Stack.Screen name="auth/callback" />
      </Stack>
    </CartProvider>
    </LocationProvider>
    </SafeAreaProvider>
  )
}
