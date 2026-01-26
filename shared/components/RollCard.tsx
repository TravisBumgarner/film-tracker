import { Ionicons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Text } from 'react-native-paper'

import { updateRoll, updateRollStatus } from '@/db/queries'
import { COLORS, SPACING } from '../theme'
import { RollStatus, type Roll, type RollStatusType } from '../types'
import { formatDate, navigateWithParams } from '../utilities'

type Props = {
  roll: Roll
  isExpanded?: boolean
  onToggle?: () => void
  onStatusChange?: () => void
}

const getNextStatus = (
  status: RollStatusType
): { label: string; status: RollStatusType } | null => {
  switch (status) {
    case RollStatus.EXPOSING:
      return { label: 'Mark Exposed', status: RollStatus.EXPOSED }
    case RollStatus.EXPOSED:
      return { label: 'Mark Developed', status: RollStatus.DEVELOPED }
    case RollStatus.DEVELOPED:
      return { label: 'Archive', status: RollStatus.ARCHIVED }
    default:
      return null
  }
}

const RollCard: React.FC<Props> = ({
  roll,
  isExpanded = false,
  onToggle,
  onStatusChange,
}) => {
  const [notes, setNotes] = useState(roll.notes || '')
  const nextStatus = getNextStatus(roll.status)

  const handlePress = () => {
    onToggle?.()
  }

  const handleEdit = () => {
    navigateWithParams('edit-roll', { rollId: roll.id })
  }

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text)
  }, [])

  const handleNotesBlur = useCallback(async () => {
    const trimmedNotes = notes.trim()
    if (trimmedNotes !== (roll.notes || '')) {
      await updateRoll(roll.id, { notes: trimmedNotes || null })
    }
  }, [notes, roll.id, roll.notes])

  const handleQuickAction = useCallback(async () => {
    if (nextStatus) {
      await updateRollStatus(roll.id, nextStatus.status)
      onStatusChange?.()
    }
  }, [roll.id, nextStatus, onStatusChange])

  const getStatusDate = (status: RollStatusType): string | null => {
    switch (status) {
      case RollStatus.EXPOSING:
        return roll.exposingAt
      case RollStatus.EXPOSED:
        return roll.exposedAt
      case RollStatus.DEVELOPED:
        return roll.developedAt
      case RollStatus.ARCHIVED:
        return roll.archivedAt
      case RollStatus.ABANDONED:
        return roll.abandonedAt
      default:
        return null
    }
  }

  const statusDate = getStatusDate(roll.status)

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <View style={styles.header}>
          <Text style={styles.filmStock}>{roll.filmStock}</Text>
          <Pressable onPress={handleEdit} style={styles.editRow}>
            <Ionicons
              name="pencil-outline"
              size={14}
              color={COLORS.NEUTRAL[600]}
            />
            <Text style={styles.editHint}>Edit</Text>
          </Pressable>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>{roll.frameCount} frames</Text>
          {roll.iso && <Text style={styles.detailText}>ISO {roll.iso}</Text>}
          <Text style={styles.detailText}>
            {formatDate(roll.updatedAt || roll.createdAt)}
          </Text>
        </View>
        <View style={styles.notesRow}>
          <Ionicons
            name={notes ? 'document-text' : 'document-text-outline'}
            size={14}
            color={notes ? COLORS.NEUTRAL[400] : COLORS.NEUTRAL[600]}
          />
          <Text style={styles.notesHint}>
            {notes ? 'View details' : 'Add details'}
          </Text>
        </View>
      </Pressable>
      {isExpanded && (
        <View style={styles.expandedSection}>
          {statusDate && (
            <Text style={styles.statusDate}>
              Since {formatDate(statusDate)}
            </Text>
          )}
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Add notes..."
            placeholderTextColor={COLORS.NEUTRAL[600]}
            multiline
          />
          {nextStatus && (
            <Pressable style={styles.quickAction} onPress={handleQuickAction}>
              <Text style={styles.quickActionText}>{nextStatus.label}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL[900],
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
  detailText: {
    color: COLORS.NEUTRAL[500],
    fontSize: 13,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XSMALL,
    marginTop: SPACING.XSMALL,
  },
  notesHint: {
    color: COLORS.NEUTRAL[600],
    fontSize: 12,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XSMALL,
  },
  editHint: {
    color: COLORS.NEUTRAL[600],
    fontSize: 12,
  },
  expandedSection: {
    marginTop: SPACING.XSMALL,
    borderTopWidth: 1,
    borderTopColor: COLORS.NEUTRAL[800],
    paddingTop: SPACING.XSMALL,
  },
  statusDate: {
    color: COLORS.NEUTRAL[500],
    fontSize: 12,
    marginBottom: SPACING.XSMALL,
  },
  notesInput: {
    color: COLORS.NEUTRAL[300],
    fontSize: 14,
    paddingVertical: SPACING.XSMALL,
    paddingHorizontal: 0,
    lineHeight: 20,
    minHeight: 40,
  },
  quickAction: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.XSMALL,
    paddingHorizontal: SPACING.SMALL,
    backgroundColor: COLORS.NEUTRAL[800],
    marginTop: SPACING.XSMALL,
  },
  quickActionText: {
    color: COLORS.PRIMARY[300],
    fontSize: 13,
    fontWeight: '500',
  },
})

export default RollCard
