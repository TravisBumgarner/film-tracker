import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'

import { db } from '@/db/client'
import migrations from '@/db/migrations/migrations'
import { seedDatabase } from '@/db/seed'
import Toast from '@/shared/components/Toast'
import Context from '@/shared/context'
import { performWeeklyBackupIfNeeded } from '@/shared/icloud'
import { ThemeProvider, useTheme } from '@/shared/ThemeContext'

SplashScreen.preventAutoHideAsync()

function App() {
  const { paperTheme } = useTheme()

  return (
    <PaperProvider theme={paperTheme}>
      <Context>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="add-camera" options={{ headerShown: false }} />
            <Stack.Screen name="edit-camera" options={{ headerShown: false }} />
            <Stack.Screen name="add-roll" options={{ headerShown: false }} />
            <Stack.Screen name="edit-roll" options={{ headerShown: false }} />
            <Stack.Screen name="roll-detail" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
        <Toast />
      </Context>
    </PaperProvider>
  )
}

const AppWrapper = () => {
  const { success } = useMigrations(db, migrations)

  useEffect(() => {
    if (success) {
      ;(__DEV__ ? seedDatabase() : Promise.resolve())
        .then(() => performWeeklyBackupIfNeeded())
        .then(() => {
          SplashScreen.hideAsync()
        })
    }
  }, [success])

  if (!success) {
    return null
  }

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

export default AppWrapper
