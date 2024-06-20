import Typography from '@/shared/components/Typography'
import { COLORS } from '@/shared/theme'
import * as React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

const PageWrapper: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => {
  return (
    <SafeAreaView style={styles.container}>
      {title && <Typography variant="h1">{title}</Typography>}
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark.opaque,
    flex: 1,
  },
})

export default PageWrapper
