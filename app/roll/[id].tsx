import NoteListItem from '@/components/NoteListItem'
import queries from '@/db/queries'
import { SelectNote, SelectRoll } from '@/db/schema'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Loading from '@/shared/components/Loading'
import PageWrapper from '@/shared/components/PageWrapper'
import Typography from '@/shared/components/Typography'
import { navigateWithParams } from '@/shared/utilities'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

const RollView = () => {
  const params = useLocalSearchParams<{ id: string }>()
  const [notesList, setNotesList] = useState<SelectNote[]>([])
  const [roll, setRoll] = useState<SelectRoll | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('RollView', params.id)

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!params.id) {
          console.log('RollView', 'no id')
          // SSP-238
          return
        }
        const rollResult = await queries.select.rollById(params.id)
        const notesResult = await queries.select.notesByRollId(params.id)
        setNotesList(notesResult)
        setRoll(rollResult)
        setIsLoading(false)
      }

      fetchData()
    }, [params.id])
  )

  const editRoll = useCallback(() => {
    if (!params.id) {
      // SSP-238
      return
    }

    navigateWithParams('edit-roll', { rollId: params.id })
  }, [params.id])

  const addNote = useCallback(() => {
    if (!params.id) {
      // SSP-238
      return
    }

    navigateWithParams('add-note', { rollId: params.id })
    if (!params.id) return
    // const urlParams: URLParams['add-note'] = { rollId: id }
  }, [params.id])

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
        renderItem={({ item }) => <NoteListItem text={item.text} roll={roll?.roll} date={item.createdAt} />}
      />
      <ButtonWrapper
        left={
          <Button variant="secondary" callback={editRoll}>
            Edit Roll
          </Button>
        }
        right={
          <Button variant="primary" callback={addNote}>
            Add Note
          </Button>
        }
      />
    </PageWrapper>
  )
}

export default RollView
