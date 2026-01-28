import type * as React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'

import { useTheme } from '@/shared/ThemeContext'
import { SPACING } from '@/shared/theme'

import Typography from './Typography'

const PageWrapper: React.FC<{
  style?: StyleProp<ViewStyle>
  title?: string
  children?: React.ReactNode
}> = ({ title, children, style }) => {
  const { colors } = useTheme()

  const containerStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: colors.background },
    style,
  ])

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        style={containerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {title && <Typography variant="h1">{title}</Typography>}
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.SMALL,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})

export default PageWrapper
