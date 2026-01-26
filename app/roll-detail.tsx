import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import {
  selectCameraById,
  selectRollById,
  updateRollStatus,
} from '@/db/queries'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  RollStatusBadge,
  Typography,
} from '@/shared/components'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'
import { RollStatus, type RollStatusType } from '@/shared/types'
import { formatDate, navigateWithParams } from '@/shared/utilities'

type RollWithCamera = {
  id: string
  filmStock: string
  status: RollStatusType
  frameCount: number
  framesShot: number | null
  notes: string | null
  createdAt: string
  exposingAt: string | null
  exposedAt: string | null
  developedAt: string | null
  archivedAt: string | null
  abandonedAt: string | null
  cameraName: string
}

const getNextStatus = (current: RollStatusType): RollStatusType | null => {
  const order: RollStatusType[] = [
    RollStatus.EXPOSING,
    RollStatus.EXPOSED,
    RollStatus.DEVELOPED,
    RollStatus.ARCHIVED,
  ]
  const currentIndex = order.indexOf(current)
  if (currentIndex >= 0 && currentIndex < order.length - 1) {
    return order[currentIndex + 1]
  }
  return null
}

const STATUS_ACTION_LABELS: Record<RollStatusType, string> = {
  EXPOSING: 'Mark Exposed',
  EXPOSED: 'Mark Developed',
  DEVELOPED: 'Archive',
  ARCHIVED: '',
  ABANDONED: '',
}

export default function RollDetail() {
  const { rollId } = useLocalSearchParams<{ rollId: string }>()
  const [roll, setRoll] = useState<RollWithCamera | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { dispatch } = useContext(context)

  const loadRoll = useCallback(async () => {
    if (!rollId) return

    try {
      const rollData = await selectRollById(rollId)
      if (rollData) {
        const camera = await selectCameraById(rollData.cameraId)
        setRoll({
          id: rollData.id,
          filmStock: rollData.filmStock,
          status: rollData.status as RollStatusType,
          frameCount: rollData.frameCount,
          framesShot: rollData.framesShot,
          notes: rollData.notes,
          createdAt: rollData.createdAt,
          exposingAt: rollData.exposingAt,
          exposedAt: rollData.exposedAt,
          developedAt: rollData.developedAt,
          archivedAt: rollData.archivedAt,
          abandonedAt: rollData.abandonedAt,
          cameraName: camera?.name || 'Unknown Camera',
        })
      }
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to load roll', variant: 'ERROR' },
      })
    } finally {
      setIsLoading(false)
    }
  }, [rollId, dispatch])

  useFocusEffect(
    useCallback(() => {
      loadRoll()
    }, [loadRoll])
  )

  const handleEdit = () => {
    navigateWithParams('edit-roll', { rollId: rollId! })
  }

  const handleStatusChange = async () => {
    if (!roll) return

    const nextStatus = getNextStatus(roll.status)
    if (!nextStatus) return

    try {
      await updateRollStatus(roll.id, nextStatus)
      setRoll({ ...roll, status: nextStatus })
      dispatch({
        type: 'TOAST',
        payload: {
          message: `Roll marked as ${nextStatus.toLowerCase().replace('_', ' ')}`,
          variant: 'SUCCESS',
        },
      })
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to update status', variant: 'ERROR' },
      })
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <PageWrapper title="Roll Detail">
        <View style={styles.loading}>
          <Typography variant="body1">Loading...</Typography>
        </View>
      </PageWrapper>
    )
  }

  if (!roll) {
    return (
      <PageWrapper title="Roll Detail">
        <View style={styles.loading}>
          <Typography variant="body1">Roll not found</Typography>
        </View>
      </PageWrapper>
    )
  }

  const nextStatus = getNextStatus(roll.status)

  return (
    <PageWrapper>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2">{roll.filmStock}</Typography>
          <Button color="primary" variant="link" onPress={handleEdit}>
            Edit
          </Button>
        </View>

        <View style={styles.statusRow}>
          <RollStatusBadge status={roll.status} />
        </View>

        <View style={styles.infoSection}>
          <InfoRow label="Camera" value={roll.cameraName} />
          <InfoRow label="Frames" value={`${roll.frameCount}`} />
          <InfoRow label="Added" value={formatDate(roll.createdAt)} />
          {roll.exposingAt && (
            <InfoRow label="Started" value={formatDate(roll.exposingAt)} />
          )}
          {roll.exposedAt && (
            <InfoRow label="Exposed" value={formatDate(roll.exposedAt)} />
          )}
          {roll.developedAt && (
            <InfoRow label="Developed" value={formatDate(roll.developedAt)} />
          )}
          {roll.archivedAt && (
            <InfoRow label="Archived" value={formatDate(roll.archivedAt)} />
          )}
          {roll.abandonedAt && (
            <InfoRow label="Abandoned" value={formatDate(roll.abandonedAt)} />
          )}
        </View>

        {roll.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{roll.notes}</Text>
          </View>
        )}

        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            Photos will be shown here
          </Text>
        </View>
      </ScrollView>

      <ButtonWrapper
        vertical={
          [
            nextStatus && (
              <Button
                key="status"
                color="primary"
                variant="filled"
                onPress={handleStatusChange}
              >
                {STATUS_ACTION_LABELS[roll.status]}
              </Button>
            ),
            <Button
              key="back"
              color="primary"
              variant="link"
              onPress={handleBack}
            >
              Back
            </Button>,
          ].filter(Boolean) as React.ReactElement[]
        }
      />
    </PageWrapper>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
  },
  infoSection: {
    backgroundColor: COLORS.NEUTRAL[900],
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.XSMALL,
  },
  infoLabel: {
    color: COLORS.NEUTRAL[400],
  },
  infoValue: {
    color: COLORS.NEUTRAL[100],
  },
  notesSection: {
    backgroundColor: COLORS.NEUTRAL[900],
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
  },
  notesLabel: {
    color: COLORS.NEUTRAL[400],
    marginBottom: SPACING.XSMALL,
  },
  notesText: {
    color: COLORS.NEUTRAL[200],
    lineHeight: 22,
  },
  photoPlaceholder: {
    backgroundColor: COLORS.NEUTRAL[900],
    padding: SPACING.LARGE,
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  photoPlaceholderText: {
    color: COLORS.NEUTRAL[500],
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
