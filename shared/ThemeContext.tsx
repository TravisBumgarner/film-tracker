import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper'

import { DARK_THEME, LIGHT_THEME, type SemanticColors } from './theme'

export type ThemeMode = 'system' | 'light' | 'dark'

const THEME_MODE_KEY = 'app_theme_mode'

type ThemeContextValue = {
  colors: SemanticColors
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  paperTheme: MD3Theme
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: DARK_THEME,
  mode: 'system',
  isDark: true,
  setMode: () => {},
  paperTheme: MD3DarkTheme,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const [mode, setModeState] = useState<ThemeMode>('system')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then(stored => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored)
      }
      setLoaded(true)
    })
  }, [])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    AsyncStorage.setItem(THEME_MODE_KEY, newMode)
  }, [])

  const isDark = useMemo(() => {
    if (mode === 'system') return systemScheme !== 'light'
    return mode === 'dark'
  }, [mode, systemScheme])

  const colors = isDark ? DARK_THEME : LIGHT_THEME

  const paperTheme = useMemo(
    () => (isDark ? MD3DarkTheme : MD3LightTheme),
    [isDark]
  )

  const value = useMemo(
    () => ({ colors, mode, isDark, setMode, paperTheme }),
    [colors, mode, isDark, setMode, paperTheme]
  )

  if (!loaded) return null

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
