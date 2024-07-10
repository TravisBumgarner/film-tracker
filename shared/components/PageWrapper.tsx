import Typography from '@/shared/components/Typography'
import { COLORS, SPACING } from '@/shared/theme'
import * as React from 'react'
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleProp, StyleSheet, ViewStyle } from 'react-native'

const PageWrapper: React.FC<{
  style?: StyleProp<ViewStyle>
  title?: string
  children?: React.ReactNode
}> = ({ title, children, style }) => {
  const styleSheet = StyleSheet.flatten([styles.container, style])

  return (
    <SafeAreaView style={styleSheet}>
      <KeyboardAvoidingView style={styleSheet} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {title && <Typography variant="h1">{title}</Typography>}
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark.opaque,
    flex: 1,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
  },
})

export default PageWrapper
