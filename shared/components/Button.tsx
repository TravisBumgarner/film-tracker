import type React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button as ButtonRNP } from 'react-native-paper'
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { BORDER_RADIUS, COLORS } from '../theme'

const SHARED = {
  textColor: COLORS.NEUTRAL[100],
} as const

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
  variant: 'filled' | 'link'
}): React.ReactElement => {
  switch (color) {
    case 'primary':
      return (
        <ButtonRNP
          style={StyleSheet.flatten([
            {
              ...buttonStyles.base,
              ...(variant === 'filled'
                ? buttonStyles.primaryFilled
                : buttonStyles.primaryLink),
              ...(disabled ? { backgroundColor: COLORS.NEUTRAL[700] } : {}),
            },
          ])}
          onPress={onPress}
          disabled={disabled}
          icon={icon}
          {...SHARED}
        >
          <Text
            style={{
              ...(variant === 'filled'
                ? textStyles.primaryFilled
                : textStyles.primaryLink),
              ...(disabled ? { color: COLORS.NEUTRAL[400] } : {}),
            }}
          >
            {children}
          </Text>
        </ButtonRNP>
      )
    case 'warning':
      return (
        <ButtonRNP
          style={StyleSheet.flatten([
            {
              ...buttonStyles.base,
              ...(variant === 'filled'
                ? buttonStyles.warningFilled
                : buttonStyles.warningLink),
              ...(disabled ? { backgroundColor: COLORS.NEUTRAL[700] } : {}),
            },
          ])}
          {...SHARED}
          onPress={onPress}
          disabled={disabled}
          icon={icon}
        >
          <Text
            style={StyleSheet.flatten([
              {
                ...(variant === 'filled'
                  ? textStyles.warningFilled
                  : textStyles.warningLink),
                ...(disabled ? { color: COLORS.NEUTRAL[400] } : {}),
              },
            ])}
          >
            {children}
          </Text>
        </ButtonRNP>
      )
    case 'neutral':
      return (
        <ButtonRNP
          style={StyleSheet.flatten([
            {
              ...buttonStyles.base,
              ...(variant === 'filled'
                ? buttonStyles.neutralFilled
                : buttonStyles.neutralLink),
              ...(disabled ? { backgroundColor: COLORS.NEUTRAL[700] } : {}),
            },
          ])}
          {...SHARED}
          onPress={onPress}
          disabled={disabled}
          icon={icon}
        >
          <Text
            style={StyleSheet.flatten([
              {
                ...(variant === 'filled'
                  ? textStyles.neutralFilled
                  : textStyles.neutralLink),
                ...(disabled ? { color: COLORS.NEUTRAL[400] } : {}),
              },
            ])}
          >
            {children}
          </Text>
        </ButtonRNP>
      )
  }
}

const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.NONE,
    width: '100%',
  },
  primaryFilled: {
    backgroundColor: COLORS.PRIMARY[300],
  },
  primaryLink: {
    backgroundColor: COLORS.MISC.TRANSPARENT,
  },
  warningFilled: {
    backgroundColor: COLORS.WARNING[300],
  },
  warningLink: {
    backgroundColor: COLORS.MISC.TRANSPARENT,
  },
  neutralFilled: {
    backgroundColor: COLORS.NEUTRAL[600],
  },
  neutralLink: {
    backgroundColor: COLORS.MISC.TRANSPARENT,
  },
})

const textStyles = StyleSheet.create({
  primaryFilled: {
    color: COLORS.NEUTRAL[900],
    fontWeight: 'bold',
  },
  primaryLink: {
    color: COLORS.PRIMARY[300],
  },
  warningFilled: {
    color: COLORS.NEUTRAL[900],
    fontWeight: 'bold',
  },
  warningLink: {
    color: COLORS.WARNING[300],
  },
  neutralFilled: {
    color: COLORS.NEUTRAL[100],
    fontWeight: 'bold',
  },
  neutralLink: {
    color: COLORS.NEUTRAL[400],
  },
})

export default Button
