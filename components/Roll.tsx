import queries from '@/db/queries'
import { SelectCamera, SelectNote, SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import Typography from '@/shared/components/Typography'
import { COLORS, ICON_SIZE, SPACING } from '@/shared/theme'
import { navigateWithParams } from '@/shared/utilities'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import { Icon } from 'react-native-paper'

import Note from './Note'
import PhaseDisplay from './PhaseDisplay'

type Props = {
  rollId: string
}

const Roll = ({ rollId }: Props) => {
  const [camera, setCamera] = useState<SelectCamera | null>(null)
  const [notes, setNotes] = useState<SelectNote[]>([])
  const [newNoteText, setNewNoteText] = useState('')
  const [roll, setRoll] = useState<SelectRoll | null>(null)

  const fetchDetails = useCallback(async () => {
    const roll = await queries.select.rollById(rollId)
    const camera = await queries.select.cameraById(roll.cameraId)
    const notes = await queries.select.notesByRollId(rollId)

    setRoll(roll)
    setCamera(camera)
    setNotes(notes)
  }, [rollId])

  useFocusEffect(
    useCallback(() => {
      fetchDetails()
    }, [fetchDetails])
  )

  const handleAddNote = useCallback(async () => {
    if (!roll) return

    await queries.insert.note({
      text: newNoteText,
      rollId: roll.id,
    })
    await queries.update.roll(roll.id, {
      lastInteractedAt: new Date().toISOString(),
    })
    setNewNoteText('')
    fetchDetails()
  }, [newNoteText, roll, fetchDetails])

  const editRollCallback = useCallback(() => {
    if (!roll) return

    navigateWithParams('edit-roll', { rollId: roll.id })
  }, [roll])

  if (!camera || !roll) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2">
          {roll.roll}: {camera?.model}
        </Typography>
        <Button variant="link" color="secondary" onPress={editRollCallback}>
          <Icon source="pencil" size={ICON_SIZE.SMALL} color={COLORS.NEUTRAL[400]} />
        </Button>
      </View>
      <PhaseDisplay roll={roll} onPhaseChange={fetchDetails} />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Note onDeleteCallback={fetchDetails} id={item.id} rollId={roll.id} text={item.text} date={item.createdAt} />}
      />
      <TextInput
        value={newNoteText}
        onChangeText={setNewNoteText}
        multiline
        numberOfLines={3}
        style={{ color: COLORS.NEUTRAL[100], backgroundColor: COLORS.NEUTRAL[800] }}
      />
      <Button disabled={newNoteText.length === 0} variant="filled" color="primary" onPress={handleAddNote}>
        Add Note
      </Button>
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
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default Roll
