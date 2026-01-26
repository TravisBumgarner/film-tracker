import { router } from 'expo-router'
import { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { insertCamera, selectCameras } from '@/db/queries'
import {
  Button,
  ButtonWrapper,
  PageWrapper,
  TextInput,
} from '@/shared/components'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'
import { generateId } from '@/shared/utilities'

export default function AddCamera() {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const { dispatch } = useContext(context)

  const handleSave = async () => {
    if (!name.trim()) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Camera name is required', variant: 'ERROR' },
      })
      return
    }

    try {
      const cameras = await selectCameras()
      const maxSortOrder = cameras.reduce(
        (max, c) => Math.max(max, c.sortOrder),
        -1
      )

      await insertCamera({
        id: generateId(),
        name: name.trim(),
        notes: notes.trim() || null,
        createdAt: new Date().toISOString(),
        sortOrder: maxSortOrder + 1,
      })

      dispatch({
        type: 'TOAST',
        payload: { message: 'Camera added', variant: 'SUCCESS' },
      })
      router.back()
    } catch (_error) {
      dispatch({
        type: 'TOAST',
        payload: { message: 'Failed to add camera', variant: 'ERROR' },
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <PageWrapper title="Add Camera">
      <View style={styles.form}>
        <TextInput
          label="Camera Name"
          value={name}
          onChangeText={setName}
          color={COLORS.PRIMARY[300]}
          autoFocus
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
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: SPACING.MEDIUM,
  },
})
