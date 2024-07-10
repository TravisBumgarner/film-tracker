import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Loading from '@/shared/components/Loading'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { context } from '@/shared/context'
import { URLParams } from '@/shared/types'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useContext, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

const EditNote = () => {
  const { dispatch } = useContext(context)
  const [editId, setEditId] = useState('')
  const [editNoteInput, setEditNoteInput] = useState('')
  const params = useLocalSearchParams<URLParams['edit-note']>()
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!params.noteId) {
          dispatch({ type: 'ADD_ALERT_MESSAGE', payload: 'Note ID is required' })
          setIsLoading(false) // set loading to false even if rollId is not present
          return
        }

        try {
          const note = await queries.select.noteByNoteId(params.noteId)
          setEditNoteInput(note.text)
          setEditId(note.id)
        } catch (error) {
          console.error('Error fetching data:', error)
        }

        setIsLoading(false)
      }
      if (!isLoading) return
      fetchData()
    }, [params, isLoading, dispatch])
  )

  const handleCancel = useCallback(() => {
    router.navigate(`/roll/${params.rollId}`)
  }, [params.rollId])

  const handleEditNote = useCallback(async () => {
    await queries.update.note(editId, {
      text: editNoteInput,
    })
    router.navigate(`/roll/${params.rollId}`)
  }, [params, editNoteInput, editId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <PageWrapper title="Edit Roll">
      <ScrollView style={styles.formWrapper}>
        <TextInput
          autoFocus={true}  //eslint-disable-line
          label="Text"
          value={editNoteInput}
          onChangeText={setEditNoteInput}
        />
      </ScrollView>
      <ButtonWrapper
        left={
          <Button variant="warning" onPress={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button disabled={editNoteInput.length === 0} variant="primary" onPress={handleEditNote}>
            Submit
          </Button>
        }
      />
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
  },
})

export default EditNote
