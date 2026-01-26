import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { COLORS, SPACING } from '../theme'
import {
  ROLL_STATUS_LABELS,
  type Roll,
  RollStatus,
  type RollStatusType,
} from '../types'
import { navigateWithParams } from '../utilities'
import Button from './Button'
import RollCard from './RollCard'
import Typography from './Typography'

type Camera = {
  id: string
  name: string
  notes: string | null
}

type Props = {
  camera: Camera
  rolls: Roll[]
  onEditCamera: () => void
}

const STATUS_ORDER: RollStatusType[] = [
  RollStatus.EXPOSING,
  RollStatus.IN_CAMERA,
  RollStatus.EXPOSED,
  RollStatus.DEVELOPED,
  RollStatus.ARCHIVED,
]

const CameraCard: React.FC<Props> = ({ camera, rolls, onEditCamera }) => {
  const rollsByStatus = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = rolls.filter(r => r.status === status)
      return acc
    },
    {} as Record<RollStatusType, Roll[]>
  )

  const handleRollPress = (rollId: string) => {
    navigateWithParams('roll-detail', { rollId })
  }

  const handleAddRoll = () => {
    navigateWithParams('add-roll', { cameraId: camera.id })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Typography variant="h2">{camera.name}</Typography>
          {camera.notes && (
            <Text style={styles.notes} numberOfLines={2}>
              {camera.notes}
            </Text>
          )}
        </View>
        <Button color="primary" variant="link" onPress={onEditCamera}>
          Edit
        </Button>
      </View>

      <ScrollView style={styles.rollsContainer}>
        {rolls.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No rolls yet</Text>
            <Text style={styles.emptySubtext}>
              Add a roll to start tracking
            </Text>
          </View>
        ) : (
          STATUS_ORDER.map(status => {
            const statusRolls = rollsByStatus[status]
            if (statusRolls.length === 0) return null
            return (
              <View key={status} style={styles.statusSection}>
                <Text style={styles.statusLabel}>
                  {ROLL_STATUS_LABELS[status]} ({statusRolls.length})
                </Text>
                {statusRolls.map(roll => (
                  <RollCard
                    key={roll.id}
                    roll={roll}
                    onPress={() => handleRollPress(roll.id)}
                  />
                ))}
              </View>
            )
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button color="primary" variant="filled" onPress={handleAddRoll}>
          + Add Roll
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL[800],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEUTRAL[700],
  },
  headerText: {
    flex: 1,
  },
  notes: {
    color: COLORS.NEUTRAL[400],
    marginTop: SPACING.XXSMALL,
  },
  rollsContainer: {
    flex: 1,
    paddingTop: SPACING.MEDIUM,
  },
  statusSection: {
    marginBottom: SPACING.MEDIUM,
  },
  statusLabel: {
    color: COLORS.NEUTRAL[400],
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: SPACING.XSMALL,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXLARGE,
  },
  emptyText: {
    color: COLORS.NEUTRAL[300],
    fontSize: 18,
  },
  emptySubtext: {
    color: COLORS.NEUTRAL[500],
    fontSize: 14,
    marginTop: SPACING.XSMALL,
  },
  footer: {
    paddingVertical: SPACING.MEDIUM,
  },
})

export default CameraCard
