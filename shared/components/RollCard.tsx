import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { BORDER_RADIUS, BORDER_WIDTH, COLORS, SPACING } from '../theme'
import type { Roll } from '../types'
import RollStatusBadge from './RollStatusBadge'

type Props = {
  roll: Roll
  onPress: () => void
}

const RollCard: React.FC<Props> = ({ roll, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filmStock}>{roll.filmStock}</Text>
        <RollStatusBadge status={roll.status} />
      </View>
      <View style={styles.details}>
        <Text style={styles.frameCount}>{roll.frameCount} frames</Text>
        {roll.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {roll.notes}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL[900],
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderLeftWidth: BORDER_WIDTH.MEDIUM,
    borderLeftColor: COLORS.PRIMARY[300],
    padding: SPACING.SMALL,
    marginBottom: SPACING.XSMALL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XXSMALL,
  },
  filmStock: {
    color: COLORS.NEUTRAL[100],
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SMALL,
  },
  frameCount: {
    color: COLORS.NEUTRAL[400],
    fontSize: 13,
  },
  notes: {
    color: COLORS.NEUTRAL[500],
    fontSize: 13,
    flex: 1,
  },
})

export default RollCard
