import type React from 'react'
import { type StyleProp, StyleSheet, type TextStyle } from 'react-native'
import { Text } from 'react-native-paper'

import { useTheme } from '@/shared/ThemeContext'

type TypographyProps = {
  children: React.ReactNode
  variant: 'h1' | 'h2' | 'body1' | 'caption'
  style?: StyleProp<TextStyle>
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant,
  style: styleProp,
}): React.ReactElement => {
  const { colors } = useTheme()

  switch (variant) {
    case 'h1':
      return (
        <Text
          style={StyleSheet.flatten([
            styles.base,
            styles.h1,
            {
              backgroundColor: colors.background,
              color: colors.textSecondary,
            },
            styleProp,
          ])}
          variant="displayLarge"
        >
          {children}
        </Text>
      )
    case 'h2':
      return (
        <Text
          style={StyleSheet.flatten([
            styles.base,
            styles.h2,
            { color: colors.textPrimary },
            styleProp,
          ])}
          variant="displayMedium"
        >
          {children}
        </Text>
      )
    case 'body1':
      return (
        <Text
          style={StyleSheet.flatten([
            styles.base,
            { color: colors.textPrimary },
            styles.body1,
            styleProp,
          ])}
          variant="bodyLarge"
        >
          {children}
        </Text>
      )
    case 'caption':
      return (
        <Text
          style={StyleSheet.flatten([
            styles.base,
            styles.caption,
            { color: colors.textSecondary },
            styleProp,
          ])}
          variant="bodyLarge"
        >
          {children}
        </Text>
      )
  }
}

const styles = StyleSheet.create({
  base: {},
  body1: {
    fontSize: 16,
  },
  caption: {
    fontSize: 13,
  },
  h1: {
    fontSize: 24,
    textAlign: 'center',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
})

export default Typography
