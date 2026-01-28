import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { useTheme } from '@/shared/ThemeContext'
import { COLORS, SPACING } from '../theme'
import {
  ROLL_STATUS_LABELS,
  type Roll,
  RollStatus,
  type RollStatusType,
} from '../types'
import { navigateWithParams } from '../utilities'
import Button from './Button'
import ButtonWrapper from './ButtonWrapper'
import RollCard from './RollCard'

type Camera = {
  id: string
  name: string
  notes: string | null
}

type Props = {
  camera: Camera
  rolls: Roll[]
  onEditCamera: () => void
  selectedStatuses: Set<RollStatusType>
  onRefresh?: () => void
}

const STATUS_ORDER: RollStatusType[] = [
  RollStatus.EXPOSING,
  RollStatus.EXPOSED,
  RollStatus.DEVELOPED,
  RollStatus.ARCHIVED,
  RollStatus.ABANDONED,
]

const CameraCard: React.FC<Props> = ({
  camera,
  rolls,
  onEditCamera,
  selectedStatuses,
  onRefresh,
}) => {
  // Sort rolls by date (most recent first) within each status group
  const sortedRolls = [...rolls].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime()
    const dateB = new Date(b.updatedAt || b.createdAt).getTime()
    return dateB - dateA
  })

  // Filter rolls by selected statuses
  const filteredRolls = sortedRolls.filter(r => selectedStatuses.has(r.status))

  // Find the most recently modified/created roll from filtered rolls
  const mostRecentRollId = filteredRolls.length > 0 ? filteredRolls[0].id : null

  const { colors } = useTheme()

  // Track which roll is expanded (only one at a time)
  const [expandedRollId, setExpandedRollId] = useState<string | null>(
    mostRecentRollId
  )

  const handleToggleRoll = (rollId: string) => {
    setExpandedRollId(expandedRollId === rollId ? null : rollId)
  }

  const rollsByStatus = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = filteredRolls.filter(r => r.status === status)
      return acc
    },
    {} as Record<RollStatusType, Roll[]>
  )

  const handleAddRoll = () => {
    navigateWithParams('add-roll', { cameraId: camera.id })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                    isExpanded={roll.id === expandedRollId}
                    onToggle={() => handleToggleRoll(roll.id)}
                    onStatusChange={onRefresh}
                  />
                ))}
              </View>
            )
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <ButtonWrapper
          left={
            <Button color="neutral" variant="link" onPress={onEditCamera}>
              Edit Camera
            </Button>
          }
          right={
            <Button color="primary" variant="filled" onPress={handleAddRoll}>
              + Add Roll
            </Button>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
