import Typography from '@/shared/components/Typography'
import { COLORS, SPACING } from '@/shared/theme'
import * as React from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleProp, StyleSheet, ViewStyle } from 'react-native'

const PageWrapper: React.FC<{
  style?: StyleProp<ViewStyle>
  title?: string
  children?: React.ReactNode
  ignoreMargin?: boolean
}> = ({ title, children, style, ignoreMargin }) => {
  const styleSheet = StyleSheet.flatten([styles.container, style])

  return (
    <SafeAreaView style={styleSheet}>
      <KeyboardAvoidingView style={{ flex: 1, margin: ignoreMargin ? 0 : SPACING.MEDIUM }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
  },
})

export default PageWrapper
