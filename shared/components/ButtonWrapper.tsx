import React from 'react'
import { StyleSheet, View } from 'react-native'

import { SPACING } from '../theme'

type ButtonWrapperProps = {
  left?: React.ReactElement
  right?: React.ReactElement
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ left, right }) => {
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
    marginRight: SPACING.XSMALL,
  },
  buttonRight: {
    flex: 1,
    marginLeft: SPACING.XSMALL,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default ButtonWrapper
