import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, ScrollView, View } from 'react-native'
import { Menu, TextInput, TouchableRipple } from 'react-native-paper'

import { BORDER_RADIUS, COLORS, SPACING } from '../theme'

export interface DropDownPropsInterface<T extends string | number> {
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  value: T
  setValue: (_value: T) => void
  label?: string | undefined
  placeholder?: string | undefined
  list: Array<{
    label: string
    value: string
    custom?: ReactNode
  }>
}

const DropDown = (props: DropDownPropsInterface<string>) => {
  const { isVisible, setIsVisible, value, setValue, label, placeholder, list } = props
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    const _label = list.find(_ => _.value === value)?.label
    if (_label) {
      setDisplayValue(_label)
    }
  }, [list, value])

  const [inputLayout, setInputLayout] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  })

  const onLayout = (event: LayoutChangeEvent) => {
    setInputLayout(event.nativeEvent.layout)
  }

  const isActive = useCallback(
    (currentValue: string) => {
      return value === currentValue
    },
    [value]
  )

  const onDismiss = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const onOpen = useCallback(() => {
    setIsVisible(true)
  }, [setIsVisible])

  const setActive = useCallback(
    (currentValue: string) => {
      setValue(currentValue)
    },
    [setValue]
  )

  return (
    <Menu
      visible={isVisible}
      onDismiss={onDismiss}
      anchor={
        <TouchableRipple onPress={onOpen} onLayout={onLayout}>
          <View pointerEvents={'none'}>
            <TextInput
              value={displayValue}
              label={label}
              placeholder={placeholder}
              pointerEvents={'none'}
              textColor={COLORS.light.opaque}
              right={<TextInput.Icon color={COLORS.light.opaque} icon={isVisible ? 'menu-up' : 'menu-down'} />}
              underlineColor="transparent"
              theme={{ colors: { onSurfaceVariant: COLORS.light.opaque } }}
              style={{
                borderRadius: BORDER_RADIUS.md,
                // For some reason, something is overriding the border radius so the next two lines are needed.
                borderTopEndRadius: BORDER_RADIUS.md,
                borderTopLeftRadius: BORDER_RADIUS.md,
                backgroundColor: COLORS.light.transparent,
                borderWidth: 1,
                borderColor: COLORS.light.opaque,
            }}
            />
          </View>
        </TouchableRipple>
      }
      contentStyle={{
        backgroundColor: COLORS.dark.opaque,
        borderRadius: BORDER_RADIUS.md,
      }}
      style={{
        width: inputLayout?.width,
        paddingTop: SPACING.md,
        marginTop: inputLayout?.height,
      }}
    >
      <ScrollView
        bounces={false}
        style={{
          maxHeight: 300,
        }}
      >
        {list.map((_item, _index) => (
          <TouchableRipple
            key={_item.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              setActive(_item.value)
              onDismiss()
            }}
          >
            <Menu.Item
              title={_item.custom || _item.label}
              titleStyle={{
                color: isActive(_item.value) ? COLORS.primary.opaque : COLORS.light.opaque,
              }}
            />
          </TouchableRipple>
        ))}
      </ScrollView>
    </Menu>
  )
}
DropDown.displayName = 'DropDown'

export default DropDown
