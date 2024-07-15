import React from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { Text } from 'react-native-paper'

import { COLORS } from '../theme'

type TypographyProps = {
  children: React.ReactNode
  variant: 'h1' | 'h2' | 'body1' | 'body2'
  style?: StyleProp<TextStyle>
}

const Typography: React.FC<TypographyProps> = ({ children, variant, style: styleProp }): React.ReactElement => {
  switch (variant) {
    case 'h1':
      return (
        <Text style={StyleSheet.flatten([styles.base, styles.h1, styleProp])} variant="displayLarge">
          {children}
        </Text>
      )
    case 'h2':
      return (
        <Text style={StyleSheet.flatten([styles.base, styles.h2, styleProp])} variant="displayMedium">
          {children}
        </Text>
      )
    case 'body1':
      return (
        <Text style={StyleSheet.flatten([styles.base, styles.body1, styleProp])} variant="bodyLarge">
          {children}
        </Text>
      )
    case 'body2':
      return (
        <Text style={StyleSheet.flatten([styles.base, styles.body2, styleProp])} variant="bodySmall">
          {children}
        </Text>
      )
  }
}

const styles = StyleSheet.create({
  base: {
    color: COLORS.NEUTRAL[200],
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 12,
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
