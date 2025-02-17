import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { COLORS } from '@/shared/theme'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'

const AddCamera = () => {
  const [newCameraInput, setNewCameraInput] = useState('')

  const disabledSubmit = !newCameraInput

  const handleCancel = useCallback(() => {
    router.back()
  }, [])

  const handleAddCamera = useCallback(async () => {
    await queries.insert.camera({
      model: newCameraInput,
    })
    setNewCameraInput('')
    router.navigate('/cameras')
  }, [newCameraInput])

  return (
    <PageWrapper title="Add Camera">
      <TextInput
        color={COLORS.PRIMARY[300]}
        autoFocus={false} //eslint-disable-line
        label="Add a new Camera"
        value={newCameraInput}
        onChangeText={setNewCameraInput}
      />
      <ButtonWrapper
        left={
          <Button variant="link" color="warning" onPress={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button disabled={disabledSubmit} variant="filled" color="primary" onPress={handleAddCamera}>
            Add Camera
          </Button>
        }
      />
    </PageWrapper>
  )
}

// const styles = StyleSheet.create({
//   formWrapper: {
//     flex: 1,
//   },
// })

export default AddCamera
