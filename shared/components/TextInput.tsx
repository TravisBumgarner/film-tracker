import { StyleSheet, View } from 'react-native'
import { Text, TextInput as TextInputRNP } from 'react-native-paper'

import { BORDER_WIDTH, COLORS, SPACING } from '../theme'

type Props = {
  label?: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  color?: string
  autoFocus?: boolean
}

const TextInput: React.FC<Props> = ({ multiline, label, value, onChangeText, color, autoFocus }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInputRNP
        onChangeText={onChangeText}
        value={value}
        mode="flat"
        multiline={multiline}
        style={StyleSheet.flatten([styles.textInput, { backgroundColor: COLORS.MISC.TRANSPARENT }])}
        textColor={COLORS.NEUTRAL[200]}
        autoFocus={autoFocus} //eslint-disable-line
        underlineStyle={{
          borderColor: color || COLORS.PRIMARY[300],
          borderWidth: BORDER_WIDTH.XSMALL,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: SPACING.MEDIUM,
  },
  label: {
    color: COLORS.NEUTRAL[400],
    paddingBottom: SPACING.MEDIUM,
  },
  textInput: {
    borderRadius: 10,
    fontSize: 24,
    paddingHorizontal: 0,
  },
})

export default TextInput
