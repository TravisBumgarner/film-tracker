import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

import { COLORS } from '../theme'

const Typography = ({ children, variant }: { children: React.ReactNode; variant: 'h1' | 'h2' | 'body1' }): React.ReactElement => {
  switch (variant) {
    case 'h1':
      return (
        <Text style={{ ...styles.base, ...styles.h1 }} variant="displayLarge">
          {children}
        </Text>
      )
    case 'h2':
      return (
        <Text style={{ ...styles.base, ...styles.h2 }} variant="displayMedium">
          {children}
        </Text>
      )
    case 'body1':
      return (
        <Text style={{ ...styles.base, ...styles.body1 }} variant="bodyLarge">
          {children}
        </Text>
      )
  }
}

const styles = StyleSheet.create({
  base: {
    color: COLORS.light.opaque,
  },
  body1: {
    fontSize: 16,
  },
  h1: {
    fontSize: 24,
    textAlign: 'center',
  },
  h2: {
    fontSize: 20,
  },
})

export default Typography
