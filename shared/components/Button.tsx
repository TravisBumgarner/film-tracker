import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as ButtonRNP } from 'react-native-paper'

import { COLORS } from '../theme'

const Button = ({
  children,
  variant,
  callback,
}: {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'warning'
  callback: () => void
}): React.ReactElement => {
  switch (variant) {
    case 'primary':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.primary }} mode="contained" onPress={callback}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
    case 'secondary':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.secondary }} mode="contained" onPress={callback}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
    case 'warning':
      return (
        <ButtonRNP style={{ ...styles.base, ...styles.warning }} mode="contained" onPress={callback}>
          <Text>{children}</Text>
        </ButtonRNP>
      )
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
  },
  primary: {
    backgroundColor: COLORS.primary.opaque,
  },
  secondary: {
    backgroundColor: COLORS.secondary.opaque,
  },
  warning: {
    backgroundColor: COLORS.warning.opaque,
  },
})

export default Button
