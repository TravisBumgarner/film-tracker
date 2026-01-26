import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { BORDER_RADIUS, COLORS, ROLL_STATUS_COLORS, SPACING } from '../theme'
import { ROLL_STATUS_LABELS, RollStatus, type RollStatusType } from '../types'

type Props = {
  value: RollStatusType
  onChange: (status: RollStatusType) => void
}

const STATUS_ORDER: RollStatusType[] = [
  RollStatus.IN_CAMERA,
  RollStatus.EXPOSING,
  RollStatus.EXPOSED,
  RollStatus.DEVELOPED,
  RollStatus.ARCHIVED,
]

const StatusPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.optionsContainer}>
        {STATUS_ORDER.map(status => {
          const isSelected = status === value
          const statusColor = ROLL_STATUS_COLORS[status]

          return (
            <Pressable
              key={status}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isSelected && { borderColor: statusColor },
              ]}
              onPress={() => onChange(status)}
            >
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: statusColor },
                ]}
              />
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: statusColor },
                ]}
              >
                {ROLL_STATUS_LABELS[status]}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.MEDIUM,
  },
  label: {
    color: COLORS.NEUTRAL[400],
    marginBottom: SPACING.SMALL,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XSMALL,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.XSMALL,
    paddingHorizontal: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL[700],
    backgroundColor: COLORS.NEUTRAL[900],
  },
  optionSelected: {
    backgroundColor: COLORS.NEUTRAL[800],
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.XSMALL,
  },
  optionText: {
    color: COLORS.NEUTRAL[300],
  },
})

export default StatusPicker
