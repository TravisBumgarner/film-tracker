import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { context } from '@/shared/context'
import { URLParams } from '@/shared/types'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

const AddNote = () => {
  const { dispatch } = useContext(context)
  const [newNoteText, setNewNoteText] = useState('')
  const params = useLocalSearchParams<URLParams['add-note']>()

  const handleCancel = useCallback(() => {
    router.navigate('/')
  }, [])

  const handleAddNote = useCallback(async () => {
    if (!params.rollId) {
      dispatch({ type: 'ADD_ALERT_MESSAGE', payload: 'Roll ID is required' })
      return
    }

    await queries.insert.note({
      text: newNoteText,
      rollId: params.rollId,
    })
    router.navigate(`/roll/${params.rollId}`)
  }, [newNoteText, params, dispatch])

  return (
    <PageWrapper title="Add Roll">
      <View style={styles.formWrapper}>
        <TextInput value={newNoteText} onChangeText={setNewNoteText} />
      </View>
      <ButtonWrapper
        left={
          <Button variant="warning" callback={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button variant="primary" callback={handleAddNote}>
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
