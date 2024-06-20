import React from 'react'
import { StyleSheet, View } from 'react-native'
import DropDownRNPD from 'react-native-paper-dropdown'
import { MD3DarkTheme } from 'react-native-paper'

import { COLORS } from '../theme'

type DropdownProps = {
  label: string
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  value: string
  setValue: (value: string) => void
  list: { label: string; value: string }[]
}

const Dropdown: React.FC<DropdownProps> = ({ label, setIsVisible, isVisible, value, setValue, list }) => {
  return (
    <View style={styles.container}>
      <DropDownRNPD
        label={label}
        mode={'outlined'}
        visible={isVisible}
        showDropDown={() => setIsVisible(true)}
        onDismiss={() => setIsVisible(false)}
        value={value}
        setValue={setValue}
        list={list}
        dropDownItemTextStyle={styles.dropDownItemTextStyle}
        theme={MD3DarkTheme}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  dropDownItemTextStyle: {
    color: COLORS.light.opaque,
  },
})

export default Dropdown
