import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

import { deleteRoll, selectRollById, updateRoll } from '@/db/queries'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  TextInput,
  Typography,
} from '@/shared/components'
import FrameCountPicker from '@/shared/components/FrameCountPicker'
import StatusPicker from '@/shared/components/StatusPicker'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'
import { RollStatus, type RollStatusType } from '@/shared/types'

export default function EditRoll() {
  const { rollId } = useLocalSearchParams<{ rollId: string }>()
  const [filmStock, setFilmStock] = useState('')
  const [status, setStatus] = useState<RollStatusType>(RollStatus.IN_CAMERA)
  const [frameCount, setFrameCount] = useState(36)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [originalStatus, setOriginalStatus] = useState<RollStatusType>(
    RollStatus.IN_CAMERA
  )
  const { dispatch } = useContext(context)

  const loadRoll = useCallback(async () => {
    if (!rollId) return

    try {
      const roll = await selectRollById(rollId)
      if (roll) {
        setFilmStock(roll.filmStock)
        setStatus(roll.status as RollStatusType)
        setOriginalStatus(roll.status as RollStatusType)
        setFrameCount(roll.frameCount)
        setNotes(roll.notes || '')
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

  const handleSave = async () => {
    if (!filmStock.trim()) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Film stock is required', variant: 'ERROR' },
      })
      return
    }

    try {
      const now = new Date().toISOString()
      const updates: Record<string, any> = {
        filmStock: filmStock.trim(),
        status,
        frameCount,
        notes: notes.trim() || null,
      }

      // Handle timestamp updates based on status changes
      if (
        status === RollStatus.EXPOSING &&
        originalStatus !== RollStatus.EXPOSING
      ) {
        updates.startedAt = now
      }
      if (
        status === RollStatus.DEVELOPED &&
        originalStatus !== RollStatus.DEVELOPED
      ) {
        updates.developedAt = now
      }

      await updateRoll(rollId!, updates)

      dispatch({
        type: 'TOAST',
        payload: { message: 'Roll updated', variant: 'SUCCESS' },
      })
      router.back()
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to update roll', variant: 'ERROR' },
      })
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Roll',
      'Are you sure you want to delete this roll? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRoll(rollId!)
              dispatch({
                type: 'TOAST',
                payload: { message: 'Roll deleted', variant: 'SUCCESS' },
              })
              router.back()
            } catch (_error) {
              dispatch({
                type: 'TOAST',
                payload: { message: 'Failed to delete roll', variant: 'ERROR' },
              })
            }
          },
        },
      ]
    )
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <PageWrapper title="Edit Roll">
        <View style={styles.loading}>
          <Typography variant="body1">Loading...</Typography>
        </View>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Edit Roll">
      <ScrollView style={styles.form}>
        <TextInput
          label="Film Stock"
          value={filmStock}
          onChangeText={setFilmStock}
          color={COLORS.PRIMARY[300]}
        />
        <StatusPicker value={status} onChange={setStatus} />
        <FrameCountPicker value={frameCount} onChange={setFrameCount} />
        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          color={COLORS.NEUTRAL[500]}
          multiline
          maxLines={4}
        />
      </ScrollView>
      <ButtonWrapper
        vertical={[
          <ButtonWrapper
            key="actions"
            left={
              <Button color="primary" variant="link" onPress={handleCancel}>
                Cancel
              </Button>
            }
            right={
              <Button
                color="primary"
                variant="filled"
                onPress={handleSave}
                disabled={!filmStock.trim()}
              >
                Save
              </Button>
            }
          />,
          <Button
            key="delete"
            color="warning"
            variant="link"
            onPress={handleDelete}
          >
            Delete Roll
          </Button>,
        ]}
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: SPACING.MEDIUM,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
