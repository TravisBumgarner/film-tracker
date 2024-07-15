import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as ButtonRNP } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { BORDER_RADIUS, COLORS } from '../theme'

const SHARED = {
  mode: 'contained',
  textColor: COLORS.NEUTRAL[200],
} as const

const Button = ({
  children,
  variant,
  ...shared
}: {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'warning' | 'error'
  onPress: () => void
  disabled?: boolean
  icon?: IconSource
}): React.ReactElement => {
  switch (variant) {
    case 'primary':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.primary }} {...SHARED} {...shared}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
    case 'secondary':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.secondary }} {...SHARED} {...shared}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
    case 'warning':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.warning }} {...SHARED} {...shared}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
    case 'error':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.error }} {...SHARED} {...shared}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    width: '100%',
  },
  error: {
    backgroundColor: COLORS.ERROR[300],
  },
  primary: {
    backgroundColor: COLORS.PRIMARY[300],
  },
  secondary: {
    backgroundColor: COLORS.SECONDARY[300],
  },
  warning: {
    backgroundColor: COLORS.WARNING[300],
  },
})

export default Button
