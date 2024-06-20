import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import DatePickerModal from '@/shared/components/DatePicker'
import Dropdown from '@/shared/components/Dropdown'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { Phase } from '@/shared/types'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useAsyncEffect } from 'use-async-effect'

const ADD_NEW_CAMERA_MENU_OPTION = {
  label: 'Add new Camera',
  value: 'add_new_camera',
}

const AddRoll = () => {
  const [isCameraDropdownVisible, setIsCameraDropdownVisible] = useState(false)
  const [cameraList, setCameraList] = useState<{ label: string; value: string }[]>([ADD_NEW_CAMERA_MENU_OPTION])
  const [activeCamera, setActiveCamera] = useState('')
  const [newCameraInput, setNewCameraInput] = useState('')
  const [newRollInput, setNewRollInput] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [newISOInput, setNewISOInput] = useState('')

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

    queries.insert.roll({
      cameraId: newCameraId,
      roll: newRollInput,
      insertedIntoCameraAt: date.toISOString(),
      iso: newISOInput,
      phase: Phase.Exposing,
    })
  }, [activeCamera, date, newISOInput, newRollInput, newCameraInput])

  return (
    <PageWrapper title="Add Roll">
      <View style={styles.formWrapper}>
        <Dropdown
          label={'Select a Camera'}
          isVisible={isCameraDropdownVisible}
          setIsVisible={setIsCameraDropdownVisible}
          value={activeCamera}
          setValue={setActiveCamera}
          list={cameraList}
        />
        {activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value ? (
          <TextInput label="Add a new Camera" value={newCameraInput} onChangeText={setNewCameraInput} />
        ) : null}
        <TextInput label="Roll Name" value={newRollInput} onChangeText={setNewRollInput} />
        <DatePickerModal date={date} setDate={setDate} />
        <TextInput label="ISO" value={newISOInput} onChangeText={setNewISOInput} />
      </View>
      <ButtonWrapper
        left={
          <Button variant="warning" callback={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button variant="primary" callback={handleAddRoll}>
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
