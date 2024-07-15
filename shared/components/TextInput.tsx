import * as React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput as TextInputRNP } from 'react-native-paper'

import { COLORS, SPACING } from '../theme'

const TextInput: React.FC<{ autoFocus: boolean; label?: string; value: string; onChangeText: (value: string) => void }> = ({
  label,
  value,
  onChangeText,
  autoFocus,
}) => {
  return (
    <TextInputRNP
      autoFocus={autoFocus} //eslint-disable-line
      style={styles.inputStyle}
      contentStyle={styles.inputContentStyle}
      label={label}
      value={value}
      onChangeText={onChangeText}
      multiline
    />
  )
}

const styles = StyleSheet.create({
  inputContentStyle: {
    backgroundColor: COLORS.NEUTRAL[800],
    color: COLORS.NEUTRAL[200],
  },
  inputStyle: {
    marginBottom: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
  },
})

export default TextInput
