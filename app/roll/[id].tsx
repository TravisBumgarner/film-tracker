import NoteListItem from '@/components/NoteListItem'
import queries from '@/db/queries'
import { SelectNote, SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Loading from '@/shared/components/Loading'
import PageWrapper from '@/shared/components/PageWrapper'
import Typography from '@/shared/components/Typography'
import { context } from '@/shared/context'
import { navigateWithParams } from '@/shared/utilities'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useContext, useState } from 'react'
import { FlatList, View } from 'react-native'
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

const RollView = () => {
  const { dispatch } = useContext(context)
  const params = useLocalSearchParams<{ id: string }>()
  const [notesList, setNotesList] = useState<SelectNote[]>([])
  const [roll, setRoll] = useState<SelectRoll | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchFromDB = useCallback(async () => {
    if (!params.id) {
      dispatch({ type: 'ADD_ALERT_MESSAGE', payload: 'Roll ID is required' })
      return
    }

    const rollResult = await queries.select.rollById(params.id)
    const notesResult = await queries.select.notesByRollId(params.id)
    setNotesList(notesResult)
    setRoll(rollResult)
    setIsLoading(false)
  }, [params.id, dispatch])

  useFocusEffect(
    useCallback(() => {
      fetchFromDB()
    }, [fetchFromDB])
  )

  const editRoll = useCallback(() => {
    if (!params.id) {
      dispatch({ type: 'ADD_ALERT_MESSAGE', payload: 'Roll ID is required' })
      return
    }

    navigateWithParams('edit-roll', { rollId: params.id })
  }, [params.id, dispatch])

  const addNote = useCallback(() => {
    if (!params.id) {
      dispatch({ type: 'ADD_ALERT_MESSAGE', payload: 'Roll ID is required' })
      return
    }

    navigateWithParams('add-note', { rollId: params.id })
  }, [params.id, dispatch])

  if (isLoading) {
    return <Loading />
  }

  if (!params.id || !roll) {
    return (
      <View>
        <Typography variant="body1">Roll missing. - {params.id}</Typography>
      </View>
    )
  }

  return (
    <PageWrapper title={roll.roll}>
      <FlatList
        data={notesList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NoteListItem onDeleteCallback={fetchFromDB} id={item.id} rollId={roll.id} text={item.text} date={item.createdAt} />}
      />
      <ButtonWrapper
        left={
          <Button variant="secondary" onPress={editRoll}>
            Edit Roll
          </Button>
        }
        right={
          <Button variant="primary" onPress={addNote}>
            Add Note
          </Button>
        }
      />
    </PageWrapper>
  )
}

export default RollView
