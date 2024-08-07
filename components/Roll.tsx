import queries from '@/db/queries'
import { SelectCamera, SelectNote, SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Typography from '@/shared/components/Typography'
import { context } from '@/shared/context'
import { COLORS, SPACING } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { navigateWithParams, orderToPhaseLookup, phaseDisplayNameLookup, phaseOrderLookup } from '@/shared/utilities'
import { useFocusEffect } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import Note from './Note'
import PhaseDisplay from './PhaseDisplay'

type Props = {
  roll: SelectRoll
  onRollChange: () => void
}

const Roll = ({ roll, onRollChange }: Props) => {
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

  const handlePhaseChange = useCallback(async () => {
    const nextPhase = phaseOrderLookup[roll.phase] + 1

    const rollUpdate: Partial<SelectRoll> = {
      phase: orderToPhaseLookup[nextPhase],
    }

    if (rollUpdate.phase === Phase.Exposed) {
      rollUpdate.removedFromCameraAt = new Date().toISOString()
    }

    if (rollUpdate.phase === Phase.Developed) {
      rollUpdate.developedAt = new Date().toISOString()
    }

    if (rollUpdate.phase === Phase.Archived) {
      rollUpdate.archivedAt = new Date().toISOString()
    }

    await queries.update.roll(roll.id, rollUpdate)
    onRollChange()
  }, [roll.id, roll.phase, onRollChange])

  if (!camera) {
    return null
  }

  return (
    <View style={styles.container}>
      <Typography variant="h2">{roll.roll}</Typography>
      <Typography variant="body1">{camera?.model}</Typography>
      <PhaseDisplay roll={roll} />
      <ButtonWrapper
        left={
          <Button variant="link" color="secondary" onPress={handlePhaseChange}>
            Mark as {phaseDisplayNameLookup[orderToPhaseLookup[phaseOrderLookup[roll.phase] + 1]]}
          </Button>
        }
        right={
          <Button variant="link" color="secondary" onPress={handlePhaseChange}>
            Mark as {Phase.Abandoned}
          </Button>
        }
      />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Note onDeleteCallback={RefreshNotes} id={item.id} rollId={roll.id} text={item.text} date={item.createdAt} />}
      />
      <ButtonWrapper
        left={
          <Button variant="link" color="secondary" onPress={editRollCallback}>
            Edit Roll
          </Button>
        }
        right={
          <Button variant="filled" color="primary" onPress={addNoteCallback}>
            Add Note
          </Button>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL[900],
    flex: 1,
    margin: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
  },
})

export default Roll
