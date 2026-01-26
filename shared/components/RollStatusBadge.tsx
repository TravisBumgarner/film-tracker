import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { COLORS, ROLL_STATUS_COLORS, SPACING } from '../theme'
import { ROLL_STATUS_LABELS, type RollStatusType } from '../types'

type Props = {
  status: RollStatusType
}

const RollStatusBadge: React.FC<Props> = ({ status }) => {
  const backgroundColor = ROLL_STATUS_COLORS[status]
  const label = ROLL_STATUS_LABELS[status]

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.XSMALL,
    paddingVertical: SPACING.XXSMALL,
  },
  text: {
    color: COLORS.NEUTRAL[900],
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default RollStatusBadge
