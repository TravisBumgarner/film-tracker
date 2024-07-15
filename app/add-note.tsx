import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { context } from '@/shared/context'
import { URLParams } from '@/shared/types'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useContext, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

const AddNote = () => {
  const { dispatch } = useContext(context)
  const [newNoteText, setNewNoteText] = useState('')
  const params = useLocalSearchParams<URLParams['add-note']>()

  const handleCancel = useCallback(() => {
    router.navigate(`roll/${params.rollId}`)
  }, [params.rollId])

  const handleAddNote = useCallback(async () => {
    if (!params.rollId) {
      dispatch({
        type: 'TOAST',
        payload: {
          message: 'Roll ID is required',
          variant: 'ERROR',
        },
      })
      return
    }

    await queries.insert.note({
      text: newNoteText,
      rollId: params.rollId,
    })
    await queries.update.roll(params.rollId, {
      lastInteractedAt: new Date().toISOString(),
    })
    router.back()
  }, [newNoteText, params, dispatch])

  return (
    <PageWrapper title="Add Note">
      <ScrollView style={styles.formWrapper}>
        <TextInput
          autoFocus={true} //eslint-disable-line
          value={newNoteText}
          onChangeText={setNewNoteText}
        />
      </ScrollView>
      <ButtonWrapper
        left={
          <Button variant="warning" onPress={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button disabled={newNoteText.length === 0} variant="primary" onPress={handleAddNote}>
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

export default AddNote
