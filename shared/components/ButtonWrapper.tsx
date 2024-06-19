import React from 'react'
import { StyleSheet, View } from 'react-native'

type ButtonWrapperProps = {
  left?: React.ReactElement
  right?: React.ReactElement
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ left, right }) => {
  return (
    <View style={styles.container}>
      <View style={styles.button}>{left}</View>
      <View style={styles.button}>{right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default ButtonWrapper
