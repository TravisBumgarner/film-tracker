import { router, useLocalSearchParams } from 'expo-router'
import { useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { insertRoll } from '@/db/queries'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  TextInput,
} from '@/shared/components'
import FrameCountPicker from '@/shared/components/FrameCountPicker'
import StatusPicker from '@/shared/components/StatusPicker'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'
import { RollStatus, type RollStatusType } from '@/shared/types'
import { generateId } from '@/shared/utilities'

export default function AddRoll() {
  const { cameraId } = useLocalSearchParams<{ cameraId: string }>()
  const [filmStock, setFilmStock] = useState('')
  const [status, setStatus] = useState<RollStatusType>(RollStatus.EXPOSING)
  const [frameCount, setFrameCount] = useState(36)
  const [iso, setIso] = useState('')
  const [notes, setNotes] = useState('')
  const { dispatch } = useContext(context)

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
      await insertRoll({
        id: generateId(),
        cameraId: cameraId!,
        filmStock: filmStock.trim(),
        status,
        frameCount,
        iso: iso.trim() ? parseInt(iso.trim(), 10) : null,
        notes: notes.trim() || null,
        createdAt: now,
        exposingAt: status === RollStatus.EXPOSING ? now : null,
        exposedAt: status === RollStatus.EXPOSED ? now : null,
        developedAt: status === RollStatus.DEVELOPED ? now : null,
        archivedAt: status === RollStatus.ARCHIVED ? now : null,
        abandonedAt: status === RollStatus.ABANDONED ? now : null,
      })

      dispatch({
        type: 'TOAST',
        payload: { message: 'Roll added', variant: 'SUCCESS' },
      })
      router.back()
    } catch (error) {
      console.error('Failed to add roll:', error)
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to add roll', variant: 'ERROR' },
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <PageWrapper title="Add Roll">
      <ScrollView style={styles.form}>
        <TextInput
          label="Film Stock"
          value={filmStock}
          onChangeText={setFilmStock}
          color={COLORS.PRIMARY[300]}
          autoFocus
        />
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <StatusPicker value={status} onChange={setStatus} compact />
          </View>
          <View style={styles.halfWidth}>
            <FrameCountPicker value={frameCount} onChange={setFrameCount} compact />
          </View>
        </View>
        <TextInput
          label="ISO (optional)"
          value={iso}
          onChangeText={setIso}
          color={COLORS.NEUTRAL[500]}
          keyboardType="numeric"
        />
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
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: SPACING.MEDIUM,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.MEDIUM,
  },
  halfWidth: {
    flex: 1,
  },
})
