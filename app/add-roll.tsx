import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Dropdown from '@/shared/components/Dropdown'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { COLORS } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useAsyncEffect } from 'use-async-effect'

const ADD_NEW_CAMERA_MENU_OPTION = {
  label: 'Add new Camera',
  value: 'add_new_camera',
}

const AddRoll = () => {
  const [cameraList, setCameraList] = useState<{ label: string; value: string }[]>([ADD_NEW_CAMERA_MENU_OPTION])
  const [activeCamera, setActiveCamera] = useState('')
  const [newCameraInput, setNewCameraInput] = useState('')
  const [newRollInput, setNewRollInput] = useState('')

  const disabledSubmit = !activeCamera || !newRollInput || (activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value && !newCameraInput)

  useAsyncEffect(async () => {
    const cameras = await queries.select.cameras()
    setCameraList([ADD_NEW_CAMERA_MENU_OPTION, ...cameras.map(camera => ({ label: camera.model, value: camera.id }))])

    if (cameras.length > 0) {
      setActiveCamera(cameras[0].id)
    } else {
      setActiveCamera('')
    }
  }, [])

  const handleCancel = useCallback(() => {
    router.navigate('/')
  }, [])

  const handleAddRoll = useCallback(async () => {
    let newCameraId = activeCamera
    if (activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value) {
      const result = await queries.insert.camera({
        model: newCameraInput,
      })
      newCameraId = result.id
    }

    await queries.insert.roll({
      cameraId: newCameraId,
      roll: newRollInput,
      phase: Phase.Exposing,
    })

    router.navigate(`/`)
  }, [activeCamera, newRollInput, newCameraInput])

  return (
    <PageWrapper title="Add Roll">
      <ScrollView style={styles.formWrapper}>
        <Dropdown dropdownPosition="bottom" value={activeCamera} onChangeCallback={setActiveCamera} data={cameraList} />
        {activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value ? (
          <TextInput
            color={COLORS.PRIMARY[300]}
            autoFocus={false} //eslint-disable-line
            label="Add a new Camera"
            value={newCameraInput}
            onChangeText={setNewCameraInput}
          />
        ) : null}
        <TextInput
          color={COLORS.PRIMARY[300]}
          autoFocus={true} //eslint-disable-line
          label="Roll Name"
          value={newRollInput}
          onChangeText={setNewRollInput}
        />
      </ScrollView>
      <ButtonWrapper
        left={
          <Button variant="link" color="warning" onPress={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button disabled={disabledSubmit} variant="filled" color="primary" onPress={handleAddRoll}>
            Add Roll
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

export default AddRoll
