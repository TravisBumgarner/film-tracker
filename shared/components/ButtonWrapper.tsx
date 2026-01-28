import type React from 'react'
import { StyleSheet, View } from 'react-native'

import { SPACING } from '../theme'

type ButtonWrapperProps = {
  left?: React.ReactElement
  right?: React.ReactElement
  full?: React.ReactElement
  vertical?: React.ReactElement[]
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  left,
  right,
  full,
  vertical,
}) => {
  if (vertical) {
    return (
      <View style={styles.vertical}>
        {vertical.map((child, index) => (
          <View key={index} style={styles.verticalChild}>
            {child}
          </View>
        ))}
      </View>
    )
  }

  if (full) {
    return (
      <View style={styles.container}>
        <View style={styles.full}>{full}</View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonLeft}>{left}</View>
      <View style={styles.buttonRight}>{right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonLeft: {
    flex: 1,
    marginRight: SPACING.XXSMALL,
  },
  buttonRight: {
    flex: 1,
    marginLeft: SPACING.XXSMALL,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
  },
  full: {
    flex: 1,
  },
  vertical: {
    flexDirection: 'column',
  },
  verticalChild: {
    marginTop: SPACING.SMALL,
  },
})

export default ButtonWrapper
