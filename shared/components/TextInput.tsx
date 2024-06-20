import * as React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput as TextInputRNP } from 'react-native-paper'

import { COLORS } from '../theme'

const TextInput: React.FC<{ label: string; value: string; onChangeText: (value: string) => void }> = ({ label, value, onChangeText }) => {
  return <TextInputRNP style={styles.inputStyle} contentStyle={styles.inputContentStyle} label={label} value={value} onChangeText={onChangeText} />
}

const styles = StyleSheet.create({
  inputContentStyle: {
    backgroundColor: COLORS.dark.opaque,
    color: COLORS.light.opaque,
  },
  inputStyle: {
    margin: 10,
  },
})

export default TextInput
