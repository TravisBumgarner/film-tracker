import { useFonts } from 'expo-font'
import { Stack, router } from 'expo-router'
import { useContext, useEffect } from 'react'
import 'react-native-reanimated'
import * as SplashScreen from 'expo-splash-screen'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import { db } from '@/db/client'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import Context, { context } from '@/shared/context'
import migrations from '@/db/migrations/migrations'

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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="error" />
        <Stack.Screen name="add-roll" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  )
}

const AppWrapper = () => {
  return (
    <Context>
      <App />
    </Context>
  )
}

export default AppWrapper
