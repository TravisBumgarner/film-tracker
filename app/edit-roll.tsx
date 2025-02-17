import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import DatePickerModal from '@/shared/components/DatePicker'
import Dropdown from '@/shared/components/Dropdown'
import Loading from '@/shared/components/Loading'
import PageWrapper from '@/shared/components/PageWrapper'
import TextInput from '@/shared/components/TextInput'
import { context } from '@/shared/context'
import { COLORS } from '@/shared/theme'
import { Phase, URLParams } from '@/shared/types'
import { PHASE_LIST } from '@/shared/utilities'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useContext, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

const ADD_NEW_CAMERA_MENU_OPTION = {
  label: 'Add new Camera',
  value: 'add_new_camera',
}

const EditRoll = () => {
  const { dispatch } = useContext(context)
  const [editId, setEditId] = useState('')
  const [cameraList, setCameraList] = useState<{ label: string; value: string }[]>([ADD_NEW_CAMERA_MENU_OPTION])
  const [activeCamera, setActiveCamera] = useState('')
  const [newCameraInput, setNewCameraInput] = useState('')
  const [editRollInput, setEditRollInput] = useState('')
  const [editDate, setEditDate] = useState<Date>(new Date())
  const params = useLocalSearchParams<URLParams['edit-roll']>()
  const [isLoading, setIsLoading] = useState(true)
  const [phase, setPhase] = useState<Phase>(Phase.Exposing)

  const disabledSubmit = !activeCamera || !editRollInput || (activeCamera === ADD_NEW_CAMERA_MENU_OPTION.value && !newCameraInput) || !editDate

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!params.rollId) {
          dispatch({
            type: 'TOAST',
            payload: { message: 'Roll ID is required', variant: 'ERROR' },
          })
          setIsLoading(false) // set loading to false even if rollId is not present
          return
        }

        try {
          const cameras = await queries.select.cameras()
          const roll = await queries.select.rollById(params.rollId)

          setEditRollInput(roll.roll)
          setActiveCamera(roll.cameraId)
          setEditId(roll.id)
          setPhase(roll.phase)

          setCameraList([ADD_NEW_CAMERA_MENU_OPTION, ...cameras.map(camera => ({ label: camera.model, value: camera.id }))])
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
    router.back()
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
      phase,
    })
    router.back()
  }, [activeCamera, editRollInput, newCameraInput, editId, phase])

  if (isLoading) {
    return <Loading />
  }

  return (
    <PageWrapper title="Edit Roll">
      <ScrollView style={styles.formWrapper}>
        <Dropdown<string> dropdownPosition="bottom" value={activeCamera} onChangeCallback={setActiveCamera} data={cameraList} />
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
          autoFocus={false} //eslint-disable-line
          label="Roll Name"
          value={editRollInput}
          onChangeText={setEditRollInput}
        />
        <DatePickerModal date={editDate} setDate={setEditDate} />
        <Dropdown<Phase> dropdownPosition="bottom" value={phase} onChangeCallback={setPhase} data={PHASE_LIST} />
      </ScrollView>
      <ButtonWrapper
        left={
          <Button variant="link" color="warning" onPress={handleCancel}>
            Cancel
          </Button>
        }
        right={
          <Button disabled={disabledSubmit} variant="filled" color="primary" onPress={handleEditRoll}>
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
