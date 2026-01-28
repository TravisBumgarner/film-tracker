import type React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as ButtonRNP } from 'react-native-paper'
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { BORDER_RADIUS, BORDER_WIDTH, COLORS } from '../theme'

const SHARED = {
  textColor: COLORS.NEUTRAL[100],
} as const

type ButtonVariant = 'filled' | 'outlined' | 'link'

const COLOR_MAP = {
  primary: COLORS.PRIMARY[300],
  warning: COLORS.WARNING[300],
  neutral: COLORS.NEUTRAL[600],
} as const

const getButtonStyle = (
  color: 'primary' | 'warning' | 'neutral',
  variant: ButtonVariant,
  disabled?: boolean
) => {
  const colorValue = COLOR_MAP[color]

  if (disabled) {
    return {
      button: {
        ...buttonStyles.base,
        backgroundColor: COLORS.NEUTRAL[700],
        ...(variant === 'outlined'
          ? {
              backgroundColor: COLORS.MISC.TRANSPARENT,
              borderWidth: BORDER_WIDTH.SMALL,
              borderColor: COLORS.NEUTRAL[700],
            }
          : {}),
      },
      text: { color: COLORS.NEUTRAL[400] },
    }
  }

  switch (variant) {
    case 'filled':
      return {
        button: { ...buttonStyles.base, backgroundColor: colorValue },
        text: { color: COLORS.NEUTRAL[900], fontWeight: 'bold' as const },
      }
    case 'outlined':
      return {
        button: {
          ...buttonStyles.base,
          backgroundColor: COLORS.MISC.TRANSPARENT,
          borderWidth: BORDER_WIDTH.SMALL,
          borderColor: colorValue,
        },
        text: { color: colorValue, fontWeight: 'bold' as const },
      }
    case 'link':
      return {
        button: {
          ...buttonStyles.base,
          backgroundColor: COLORS.MISC.TRANSPARENT,
        },
        text: {
          color: color === 'neutral' ? COLORS.NEUTRAL[400] : colorValue,
        },
      }
  }
}

const Button = ({
  children,
  color,
  variant,
  onPress,
  disabled,
  icon,
}: {
  children: React.ReactNode
  color: 'primary' | 'warning' | 'neutral'
  onPress: () => void
  disabled?: boolean
  icon?: IconSource
  variant: ButtonVariant
}): React.ReactElement => {
  const styles = getButtonStyle(color, variant, disabled)

  return (
    <ButtonRNP
      style={StyleSheet.flatten([styles.button])}
      onPress={onPress}
      disabled={disabled}
      icon={icon}
      {...SHARED}
    >
      <Text style={StyleSheet.flatten([styles.text])}>{children}</Text>
    </ButtonRNP>
  )
}

const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.NONE,
    width: '100%',
  },
})

export default Button
