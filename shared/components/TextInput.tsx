import { type KeyboardTypeOptions, StyleSheet, View } from 'react-native'
import { Text, TextInput as TextInputRNP } from 'react-native-paper'

import { BORDER_WIDTH, COLORS, SPACING } from '../theme'

type Props = {
  label?: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  color: string
  autoFocus?: boolean
  maxLines?: number
  keyboardType?: KeyboardTypeOptions
}

const LINE_HEIGHT = 36

const TextInput: React.FC<Props> = ({
  multiline,
  label,
  value,
  onChangeText,
  color,
  autoFocus,
  maxLines,
  keyboardType,
}) => {
  const maxHeight = maxLines ? maxLines * LINE_HEIGHT : undefined

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInputRNP
        onChangeText={onChangeText}
        value={value}
        mode="flat"
        multiline={multiline}
        style={StyleSheet.flatten([
          styles.textInput,
          { backgroundColor: COLORS.MISC.TRANSPARENT },
          maxHeight ? { maxHeight } : {},
        ])}
        textColor={COLORS.NEUTRAL[200]}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        underlineStyle={{
          borderColor: color,
          borderWidth: BORDER_WIDTH.XSMALL,
        }}
        scrollEnabled={!!maxLines}
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
