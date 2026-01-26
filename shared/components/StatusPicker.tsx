import { useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { BORDER_RADIUS, COLORS, ROLL_STATUS_COLORS, SPACING } from '../theme'
import { ROLL_STATUS_LABELS, RollStatus, type RollStatusType } from '../types'

type Props = {
  value: RollStatusType
  onChange: (status: RollStatusType) => void
  compact?: boolean
}

const STATUS_ORDER: RollStatusType[] = [
  RollStatus.EXPOSING,
  RollStatus.EXPOSED,
  RollStatus.DEVELOPED,
  RollStatus.ARCHIVED,
  RollStatus.ABANDONED,
]

const StatusPicker: React.FC<Props> = ({ value, onChange, compact = false }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handleSelect = (status: RollStatusType) => {
    onChange(status)
    setModalVisible(false)
  }

  return (
    <>
      <Pressable
        style={compact ? styles.triggerCompact : styles.trigger}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.label}>Status</Text>
        <View
          style={[
            styles.selectedValue,
            { backgroundColor: ROLL_STATUS_COLORS[value] },
          ]}
        >
          <Text style={styles.selectedText}>{ROLL_STATUS_LABELS[value]}</Text>
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
            <Text style={styles.modalTitle}>Select Status</Text>
            {STATUS_ORDER.map(status => (
              <Pressable
                key={status}
                style={[
                  styles.option,
                  status === value && styles.optionSelected,
                ]}
                onPress={() => handleSelect(status)}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: ROLL_STATUS_COLORS[status] },
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    status === value && styles.optionTextSelected,
                  ]}
                >
                  {ROLL_STATUS_LABELS[status]}
                </Text>
              </Pressable>
            ))}
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
  triggerCompact: {
    paddingVertical: SPACING.XSMALL,
  },
  label: {
    color: COLORS.NEUTRAL[400],
    paddingBottom: SPACING.XSMALL,
    fontSize: 12,
  },
  selectedValue: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
  },
  selectedText: {
    color: COLORS.NEUTRAL[900],
    fontWeight: 'bold',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  optionSelected: {
    backgroundColor: COLORS.NEUTRAL[700],
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.SMALL,
  },
  optionText: {
    color: COLORS.NEUTRAL[300],
    fontSize: 16,
  },
  optionTextSelected: {
    color: COLORS.NEUTRAL[100],
    fontWeight: 'bold',
  },
})

export default StatusPicker
