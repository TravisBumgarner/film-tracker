import Toast from '@/components/Toast'
import { db } from '@/db/client'
import migrations from '@/db/migrations/migrations'
import Context, { context } from '@/shared/context'
import * as Sentry from '@sentry/react-native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useFonts } from 'expo-font'
import { Stack, router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useContext, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'

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
  const { success: haveMigrationsRun, error: haveMigrationsErrored } = useMigrations(db, migrations)
  const {
    state: {
      settings: { colorTheme },
    },
  } = useContext(context)

  const [haveFontsLoaded] = useFonts({
    Comfortaa: require('../assets/fonts/Comfortaa.ttf'),
  })

  const hasLoaded = [haveFontsLoaded, haveMigrationsRun].every(i => i)

  const hasErrored = [haveMigrationsErrored].some(i => i)
  const paperTheme = colorTheme === 'dark' ? MD3DarkTheme : MD3LightTheme

  useEffect(() => {
    if (hasErrored) {
      router.replace('error')
    }
  }, [hasErrored])

  useEffect(() => {
    if (hasLoaded || hasErrored) {
      SplashScreen.hideAsync()
    }
  }, [hasLoaded, hasErrored])

  if (!hasLoaded && !hasErrored) {
    return null
  }

  return (
    <PaperProvider theme={paperTheme}>
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
    </PaperProvider>
  )
}

const AppWrapper = () => {
  return (
    <Context>
      <App />
      <Toast />
    </Context>
  )
}

export default Sentry.wrap(AppWrapper)
