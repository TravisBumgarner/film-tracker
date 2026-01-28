import { Ionicons } from '@expo/vector-icons'
import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Text } from 'react-native-paper'

import { updateRoll, updateRollStatus } from '@/db/queries'
import { useTheme } from '@/shared/ThemeContext'
import { SPACING } from '../theme'
import { type Roll, RollStatus, type RollStatusType } from '../types'
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
  const { colors } = useTheme()
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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Pressable onPress={handlePress}>
        <View style={styles.header}>
          <Text style={[styles.filmStock, { color: colors.textPrimary }]}>
            {roll.filmStock}
          </Text>
          <Pressable onPress={handleEdit} style={styles.editRow}>
            <Ionicons
              name="pencil-outline"
              size={14}
              color={colors.textDisabled}
            />
            <Text style={[styles.editHint, { color: colors.textDisabled }]}>
              Edit
            </Text>
          </Pressable>
        </View>
        <View style={styles.details}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {roll.frameCount} frames
          </Text>
          {roll.iso && (
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              ISO {roll.iso}
            </Text>
          )}
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatDate(roll.updatedAt || roll.createdAt)}
          </Text>
        </View>
        <View style={styles.notesRow}>
          <Ionicons
            name={notes ? 'document-text' : 'document-text-outline'}
            size={14}
            color={notes ? colors.textSecondary : colors.textDisabled}
          />
          <Text style={[styles.notesHint, { color: colors.textDisabled }]}>
            {notes ? 'View details' : 'Add details'}
          </Text>
        </View>
      </Pressable>
      {isExpanded && (
        <View
          style={[styles.expandedSection, { borderTopColor: colors.border }]}
        >
          {statusDate && (
            <Text style={[styles.statusDate, { color: colors.textSecondary }]}>
              Since {formatDate(statusDate)}
            </Text>
          )}
          <TextInput
            style={[styles.notesInput, { color: colors.textPrimary }]}
            value={notes}
            onChangeText={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Add notes..."
            placeholderTextColor={colors.textDisabled}
            multiline
          />
          {nextStatus && (
            <Pressable
              style={[
                styles.quickAction,
                { backgroundColor: colors.surfaceVariant },
              ]}
              onPress={handleQuickAction}
            >
              <Text style={[styles.quickActionText, { color: colors.primary }]}>
                {nextStatus.label}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SMALL,
  },
  detailText: {
    fontSize: 13,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XSMALL,
    marginTop: SPACING.XSMALL,
  },
  notesHint: {
    fontSize: 12,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XSMALL,
  },
  editHint: {
    fontSize: 12,
  },
  expandedSection: {
    marginTop: SPACING.XSMALL,
    borderTopWidth: 1,
    paddingTop: SPACING.XSMALL,
  },
  statusDate: {
    fontSize: 12,
    marginBottom: SPACING.XSMALL,
  },
  notesInput: {
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
    marginTop: SPACING.XSMALL,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
})

export default RollCard
