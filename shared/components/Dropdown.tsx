import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Dropdown as DropdownRNED } from 'react-native-element-dropdown'
import { Icon } from 'react-native-paper'

import { COLORS, SPACING } from '../theme'

interface DropdownProps {
  data: { label: string; value: string }[]
  onChangeCallback: (value: string) => void
  value: string
  dropdownPosition: 'top' | 'bottom'
}

const Dropdown = ({ data, onChangeCallback, value, dropdownPosition }: DropdownProps) => {
  const [isFocus, setIsFocus] = useState(false)

  const renderRightIcon = useCallback(() => {
    let source: string

    if (dropdownPosition === 'top') {
      source = isFocus ? 'chevron-down' : 'chevron-up'
    } else {
      source = isFocus ? 'chevron-up' : 'chevron-down'
    }

    return <Icon source={source} size={20} color={COLORS.PRIMARY[300]} />
  }, [isFocus, dropdownPosition])

  const onChange = useCallback(
    (item: { label: string; value: string }) => {
      onChangeCallback(item.value)
      setIsFocus(false)
    },
    [onChangeCallback]
  )

  return (
    <View style={styles.container}>
      <DropdownRNED
        style={styles.dropdown}
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
        placeholder={!isFocus ? 'Select Camera' : '...'}
        value={value as string}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
        activeColor={COLORS.PRIMARY[300]}
        renderRightIcon={renderRightIcon}
      />
    </View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.PRIMARY[500],
    paddingVertical: SPACING.MEDIUM,
  },
  containerStyle: {
    backgroundColor: COLORS.NEUTRAL[900],
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: COLORS.NEUTRAL[900],
    height: 50,
    paddingHorizontal: SPACING.MEDIUM,
  },
  iconStyle: {
    height: 20,
    width: 20,
  },
  itemContainerStyle: {
    backgroundColor: COLORS.NEUTRAL[900],
  },
  itemTextStyle: {
    color: COLORS.NEUTRAL[200],
  },
  placeholderStyle: {
    color: COLORS.NEUTRAL[200],
    fontSize: 16,
  },
  selectedTextStyle: {
    color: COLORS.NEUTRAL[200],
    fontSize: 16,
  },
})
