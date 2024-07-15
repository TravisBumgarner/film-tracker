import queries from '@/db/queries'
import { SelectCamera, SelectNote, SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Typography from '@/shared/components/Typography'
import { context } from '@/shared/context'
import { SPACING } from '@/shared/theme'
import { navigateWithParams } from '@/shared/utilities'
import { useFocusEffect } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import Note from './Note'

type Props = {
  roll: SelectRoll
}

const Roll = ({ roll }: Props) => {
  const { dispatch } = useContext(context)
  const [camera, setCamera] = useState<SelectCamera | null>(null)
  const [notes, setNotes] = useState<SelectNote[]>([])

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const fetchData = async () => {
        const camera = await queries.select.cameraById(roll.cameraId)
        const notes = await queries.select.notesByRollId(roll.id)

        if (!isActive) return

        if (!camera) {
          dispatch({ type: 'TOAST', payload: { message: 'Error loading camera', variant: 'ERROR' } })
        }

        setCamera(camera)
        setNotes(notes)
      }

      fetchData()

      return () => {
        isActive = false
      }
    }, [roll.id, roll.cameraId, dispatch])
  )

  const RefreshNotes = useCallback(async () => {
    const notes = await queries.select.notesByRollId(roll.id)
    setNotes(notes)
  }, [roll.id])

  const editRollCallback = useCallback(() => {
    navigateWithParams('edit-roll', { rollId: roll.id })
  }, [roll.id])

  const addNoteCallback = useCallback(() => {
    navigateWithParams('add-note', { rollId: roll.id })
  }, [roll.id])

  if (!camera) {
    return null
  }

  return (
    <View style={styles.container}>
      <Typography variant="body1">Roll: {roll.roll}</Typography>
      <Typography variant="body1">Camera: {camera?.model}</Typography>
      <Typography variant="body1">Phase: {roll.phase}</Typography>
      <Typography variant="body1">Insert Date: {roll.insertedIntoCameraAt}</Typography>
      {roll.removedFromCameraAt && <Typography variant="body1">Removal Date: {roll.removedFromCameraAt}</Typography>}
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Note onDeleteCallback={RefreshNotes} id={item.id} rollId={roll.id} text={item.text} date={item.createdAt} />}
      />
      <ButtonWrapper
        left={
          <Button variant="secondary" onPress={editRollCallback}>
            Edit Roll
          </Button>
        }
        right={
          <Button variant="primary" onPress={addNoteCallback}>
            Add Note
          </Button>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    flex: 1,
    padding: SPACING.MEDIUM,
  },
})

export default Roll
