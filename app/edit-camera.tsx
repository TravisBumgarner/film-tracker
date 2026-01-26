import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import { deleteCamera, selectCameraById, updateCamera } from '@/db/queries'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  TextInput,
  Typography,
} from '@/shared/components'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'

export default function EditCamera() {
  const { cameraId } = useLocalSearchParams<{ cameraId: string }>()
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { dispatch } = useContext(context)

  const loadCamera = useCallback(async () => {
    if (!cameraId) return

    try {
      const camera = await selectCameraById(cameraId)
      if (camera) {
        setName(camera.name)
        setNotes(camera.notes || '')
      }
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to load camera', variant: 'ERROR' },
      })
    } finally {
      setIsLoading(false)
    }
  }, [cameraId, dispatch])

  useFocusEffect(
    useCallback(() => {
      loadCamera()
    }, [loadCamera])
  )

  const handleSave = async () => {
    if (!name.trim()) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Camera name is required', variant: 'ERROR' },
      })
      return
    }

    try {
      await updateCamera(cameraId!, {
        name: name.trim(),
        notes: notes.trim() || null,
      })

      dispatch({
        type: 'TOAST',
        payload: { message: 'Camera updated', variant: 'SUCCESS' },
      })
      router.back()
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to update camera', variant: 'ERROR' },
      })
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Camera',
      'Are you sure? This will also delete all rolls associated with this camera.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCamera(cameraId!)
              dispatch({
                type: 'TOAST',
                payload: { message: 'Camera deleted', variant: 'SUCCESS' },
              })
              router.back()
            } catch (_error) {
              dispatch({
                type: 'TOAST',
                payload: {
                  message: 'Failed to delete camera',
                  variant: 'ERROR',
                },
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
      <PageWrapper title="Edit Camera">
        <View style={styles.loading}>
          <Typography variant="body1">Loading...</Typography>
        </View>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Edit Camera">
      <View style={styles.form}>
        <TextInput
          label="Camera Name"
          value={name}
          onChangeText={setName}
          color={COLORS.PRIMARY[300]}
        />
        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          color={COLORS.NEUTRAL[500]}
          multiline
          maxLines={4}
        />
      </View>
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
                disabled={!name.trim()}
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
            Delete Camera
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
