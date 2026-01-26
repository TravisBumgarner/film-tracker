import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Typography } from '@/shared/components'
import { COLORS, SPACING } from '@/shared/theme'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Typography variant="h1">This screen doesn't exist.</Typography>
        <Link href="/" style={styles.link}>
          <Typography variant="body1">Go to home screen!</Typography>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LARGE,
    backgroundColor: COLORS.NEUTRAL[800],
  },
  link: {
    marginTop: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
  },
})
