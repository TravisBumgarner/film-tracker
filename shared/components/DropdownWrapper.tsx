import React from 'react'
import { StyleSheet, View } from 'react-native'

type DropdownWrapperProps = {
  left?: React.ReactElement
  right?: React.ReactElement
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({ left, right }) => {
  return (
    <View style={styles.container}>
      <View style={{ ...styles.dropdownBase, ...styles.dropdownLeft }}>{left}</View>
      <View style={{ ...styles.dropdownBase, ...styles.dropdownRight }}>{right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownBase: {
    flex: 1,
    margin: 10,
  },
  dropdownLeft: {
    marginRight: 5,
  },
  dropdownRight: {
    marginLeft: 5,
  },
})

export default DropdownWrapper
