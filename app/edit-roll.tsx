import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import DatePickerModal from '@/shared/components/DatePicker'
import Dropdown from '@/shared/components/Dropdown'
import Loading from '@/shared/components/Loading'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { Phase, URLParams } from '@/shared/types'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

const ADD_NEW_CAMERA_MENU_OPTION = {
  label: 'Add new Camera',
  value: 'add_new_camera',
}

const EditRoll = () => {
  const [editId, setEditId] = useState('')
  const [isCameraDropdownVisible, setIsCameraDropdownVisible] = useState(false)
  const [cameraList, setCameraList] = useState<{ label: string; value: string }[]>([ADD_NEW_CAMERA_MENU_OPTION])
  const [activeCamera, setActiveCamera] = useState('')
  const [newCameraInput, setNewCameraInput] = useState('')
  const [editRollInput, setEditRollInput] = useState('')
  const [editDate, setEditDate] = useState<Date>(new Date())
  const [editISOInput, setEditISOInput] = useState('')
  const params = useLocalSearchParams<URLParams['edit-roll']>()
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!params.rollId) {
          console.log('no roll Id found')
          setIsLoading(false) // set loading to false even if rollId is not present
          return
        }

        try {
          const cameras = await queries.select.cameras()
          const roll = await queries.select.rollById(params.rollId)

          setEditRollInput(roll.roll)
          setEditISOInput(roll.iso)
          setEditDate(new Date(roll.insertedIntoCameraAt))
          setActiveCamera(roll.cameraId)
          setEditId(roll.id)

          setCameraList([ADD_NEW_CAMERA_MENU_OPTION, ...cameras.map(camera => ({ label: camera.model, value: camera.id }))])
        } catch (error) {
          console.error('Error fetching data:', error)
        }

        setIsLoading(false)
      }
      if (!isLoading) return
      fetchData()
    }, [params, isLoading])
  )

  const handleCancel = useCallback(() => {
    router.navigate('/')
  }, [])

  const handleEditRoll = useCallback(async () => {
    let newCameraId = activeCamera
    if (activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value) {
      const result = await queries.insert.camera({
        model: newCameraInput,
      })
      newCameraId = result.id
    }

    await queries.update.roll(editId, {
      cameraId: newCameraId,
      roll: editRollInput,
      insertedIntoCameraAt: editDate.toISOString(),
      iso: editISOInput,
      phase: Phase.Exposing,
    })
    router.navigate(`/roll/${editId}`)
  }, [activeCamera, editDate, editISOInput, editRollInput, newCameraInput, editId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <PageWrapper title="Edit Roll">
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
        <TextInput label="Roll Name" value={editRollInput} onChangeText={setEditRollInput} />
        <DatePickerModal date={editDate} setDate={setEditDate} />
        <TextInput label="ISO" value={editISOInput} onChangeText={setEditISOInput} />
      </View>
      <ButtonWrapper
        left={
          <Button variant="warning" callback={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button variant="primary" callback={handleEditRoll}>
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

export default EditRoll
