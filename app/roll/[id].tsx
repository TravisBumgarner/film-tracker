import NoteListItem from '@/components/NoteListItem'
import queries from '@/db/queries'
import { SelectNote, SelectRoll } from '@/db/schema'
import PageWrapper from '@/shared/components/PageWrapper'
import Typography from '@/shared/components/Typography'
import { useLocalSearchParams } from 'expo-router'
import * as React from 'react'
import { FlatList, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { en, registerTranslation } from 'react-native-paper-dates'
import { useAsyncEffect } from 'use-async-effect'
registerTranslation('en', en)

const RollView = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [notesList, setNotesList] = React.useState<SelectNote[]>([])
  const [roll, setRoll] = React.useState<SelectRoll | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  useAsyncEffect(async () => {
    if (!id) return
    const rollResult = await queries.select.rollById(id)
    const notesResult = await queries.select.notesByRollId(id)
    setNotesList(notesResult)
    setRoll(rollResult)
  }, [])

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (!id || !roll) {
    return (
      <View>
        <Typography variant="body1">Roll missing.</Typography>
      </View>
    )
  }

  return (
    <PageWrapper title="Rolls">
      <FlatList
        data={notesList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NoteListItem text={item.text} roll={roll?.roll} date={item.createdAt} />}
      />
    </PageWrapper>
  )
}

export default RollView
