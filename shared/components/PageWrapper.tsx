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

import { COLORS, SPACING } from '@/shared/theme'

import Typography from './Typography'

const PageWrapper: React.FC<{
  style?: StyleProp<ViewStyle>
  title?: string
  children?: React.ReactNode
}> = ({ title, children, style }) => {
  const styleSheet = StyleSheet.flatten([styles.container, style])

  return (
    <SafeAreaView style={styleSheet}>
      <KeyboardAvoidingView
        style={styleSheet}
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
    backgroundColor: COLORS.NEUTRAL[800],
    flex: 1,
    paddingHorizontal: SPACING.SMALL,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})

export default PageWrapper
