import { db } from '@/db/client'
import migrations from '@/db/migrations/migrations'
import Context from '@/shared/context'
import * as Sentry from '@sentry/react-native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MD3DarkTheme, PaperProvider } from 'react-native-paper'

import 'react-native-reanimated'

Sentry.init({
  dsn: 'https://575778108bafbc3e500a1b7dbf14d40c@o196886.ingest.us.sentry.io/4507580290170880',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

function App() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <Context>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="error" />
            <Stack.Screen name="add-roll" options={{ headerShown: false }} />
            <Stack.Screen name="edit-roll" options={{ headerShown: false }} />
            <Stack.Screen name="add-note" options={{ headerShown: false }} />
            <Stack.Screen name="edit-note" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </Context>
    </PaperProvider>
  )
}

const AppWrapper = () => {
  const [loaded] = useFonts({
    Comfortaa: require('../assets/fonts/Comfortaa.ttf'),
  })
  const { success } = useMigrations(db, migrations)

  useEffect(() => {
    if (loaded && success) {
      // I have no idea why but if SplashScreen.hideAsync isn't at the top default export it doesn't work?
      SplashScreen.hideAsync()
    }
  }, [loaded, success])

  if (!loaded && !success) {
    return null
  }

  return <App />
}

export default AppWrapper
