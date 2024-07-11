import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown as DropdownRNED } from 'react-native-element-dropdown'
import { Icon } from 'react-native-paper'

import { COLORS, SPACING } from '../theme'
import { Phase } from '../types'

type DropdownEnums = Phase

interface DropdownProps<T extends DropdownEnums | string> {
  data: { label: string; value: T }[]
  onChangeCallback: (value: T) => void
  value: T
  dropdownPosition: 'top' | 'bottom'
}

const Dropdown = <T extends DropdownEnums | string>({ data, onChangeCallback, value, dropdownPosition }: DropdownProps<T>) => {
  const [isFocus, setIsFocus] = useState(false)

  const renderRightIcon = useCallback(() => {
    let source: string

    if (dropdownPosition === 'top') {
      source = isFocus ? 'chevron-down' : 'chevron-up'
    } else {
      source = isFocus ? 'chevron-up' : 'chevron-down'
    }

    return <Icon source={source} size={20} color={COLORS.primary.opaque} />
  }, [isFocus, dropdownPosition])

  const onChange = useCallback(
    (item: { label: string; value: T }) => {
      onChangeCallback(item.value)
      setIsFocus(false)
    },
    [onChangeCallback]
  )

  return (
    <View style={styles.container}>
      <DropdownRNED
        style={[styles.dropdown, isFocus && { borderColor: COLORS.primary.opaque }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        itemTextStyle={styles.itemTextStyle}
        dropdownPosition={dropdownPosition}
        maxHeight={300}
        labelField="label"
        valueField="value"
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        placeholder={!isFocus ? 'Select item' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
        activeColor={COLORS.primary.opaque}
        renderRightIcon={renderRightIcon}
      />
    </View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.MEDIUM,
  },
  containerStyle: {
    backgroundColor: COLORS.dark.opaque,
    borderColor: COLORS.dark.transparent,
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: COLORS.dark.opaque,
    borderColor: COLORS.dark.transparent,
    borderWidth: 1,
    height: 50,
    paddingHorizontal: SPACING.MEDIUM,
  },
  iconStyle: {
    height: 20,
    width: 20,
  },
  itemContainerStyle: {
    backgroundColor: COLORS.dark.opaque,
  },
  itemTextStyle: {
    color: COLORS.light.opaque,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: COLORS.light.opaque,
    fontSize: 16,
  },
})
