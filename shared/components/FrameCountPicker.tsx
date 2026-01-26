import { useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Text, TextInput as TextInputRNP } from 'react-native-paper'

import { BORDER_RADIUS, BORDER_WIDTH, COLORS, SPACING } from '../theme'

type Props = {
  value: number
  onChange: (count: number) => void
}

const PRESET_COUNTS = [12, 24, 36]

const FrameCountPicker: React.FC<Props> = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handleSelect = (count: number) => {
    onChange(count)
    setModalVisible(false)
  }

  const handleCustomSubmit = () => {
    const parsed = parseInt(customValue, 10)
    if (parsed > 0) {
      onChange(parsed)
      setModalVisible(false)
      setCustomValue('')
    }
  }

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.label}>Frame Count</Text>
        <View style={styles.selectedValue}>
          <Text style={styles.selectedText}>{value} frames</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Frame Count</Text>
            <View style={styles.presets}>
              {PRESET_COUNTS.map(count => (
                <Pressable
                  key={count}
                  style={[
                    styles.presetButton,
                    count === value && styles.presetButtonSelected,
                  ]}
                  onPress={() => handleSelect(count)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      count === value && styles.presetTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.customRow}>
              <TextInputRNP
                mode="flat"
                placeholder="Custom"
                value={customValue}
                onChangeText={setCustomValue}
                keyboardType="number-pad"
                style={styles.customInput}
                textColor={COLORS.NEUTRAL[200]}
                underlineStyle={{ borderColor: COLORS.NEUTRAL[500] }}
              />
              <Pressable
                style={styles.customButton}
                onPress={handleCustomSubmit}
              >
                <Text style={styles.customButtonText}>Set</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    paddingVertical: SPACING.MEDIUM,
  },
  label: {
    color: COLORS.NEUTRAL[400],
    paddingBottom: SPACING.MEDIUM,
  },
  selectedValue: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.SMALL,
    backgroundColor: COLORS.NEUTRAL[700],
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: COLORS.NEUTRAL[200],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.NEUTRAL[800],
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.MEDIUM,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: COLORS.NEUTRAL[200],
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.MEDIUM,
  },
  presetButton: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.SMALL,
    backgroundColor: COLORS.NEUTRAL[700],
    borderWidth: BORDER_WIDTH.XSMALL,
    borderColor: COLORS.NEUTRAL[600],
  },
  presetButtonSelected: {
    backgroundColor: COLORS.PRIMARY[400],
    borderColor: COLORS.PRIMARY[300],
  },
  presetText: {
    color: COLORS.NEUTRAL[300],
    fontWeight: 'bold',
  },
  presetTextSelected: {
    color: COLORS.NEUTRAL[100],
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SMALL,
  },
  customInput: {
    flex: 1,
    backgroundColor: COLORS.MISC.TRANSPARENT,
    height: 40,
  },
  customButton: {
    backgroundColor: COLORS.PRIMARY[300],
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.XSMALL,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  customButtonText: {
    color: COLORS.NEUTRAL[900],
    fontWeight: 'bold',
  },
})

export default FrameCountPicker
