import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as ButtonRNP } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { BORDER_RADIUS, COLORS } from '../theme'

const SHARED = {
  mode: 'contained',
  textColor: COLORS.light.opaque,
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
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    width: '100%',
  },
  error: {
    backgroundColor: COLORS.error.transparent,
    borderColor: COLORS.dark.opaque,
  },
  primary: {
    backgroundColor: COLORS.primary.transparent,
    borderColor: COLORS.primary.opaque,
  },
  secondary: {
    backgroundColor: COLORS.secondary.transparent,
    borderColor: COLORS.secondary.opaque,
  },
  warning: {
    backgroundColor: COLORS.warning.transparent,
    borderColor: COLORS.warning.opaque,
  },
})

export default Button
