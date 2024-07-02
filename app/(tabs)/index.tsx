import RollPreviewListItem from '@/components/RollPreviewListItem'
import queries from '@/db/queries'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import Dropdown from '@/shared/components/Dropdown'
import DropdownWrapper from '@/shared/components/DropdownWrapper'
import PageWrapper from '@/shared/components/PageWrapper'
import Typography from '@/shared/components/Typography'
import { Phase, RollPreviewListItemData } from '@/shared/types'
import { router, useFocusEffect } from 'expo-router'
import * as React from 'react'
import { FlatList, View } from 'react-native'
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

const phaseList = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Exposing',
    value: Phase.Exposing,
  },
  {
    label: 'Exposed',
    value: Phase.Exposed,
  },
  {
    label: 'Developed',
    value: Phase.Developed,
  },
  {
    label: 'Archived',
    value: Phase.Archived,
  },
]

const Rolls = () => {
  const [cameraList, setCameraList] = React.useState<{ label: string; value: string }[]>([])
  const [rollsList, setRollsList] = React.useState<RollPreviewListItemData[]>([])
  const [showFilterByCameraDropdown, setShowFilterByCameraDropdown] = React.useState(false)
  const [showFilterByPhaseDropdown, setShowFilterByPhaseDropdown] = React.useState(false)
  const [activeCamera, setActiveCamera] = React.useState('')
  const [activePhase, setActivePhase] = React.useState('')

  const addRollCallback = React.useCallback(() => {
    router.push('add-roll')
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const fetchAsyncData = async () => {
        const cameras = await queries.select.cameras()
        const rolls = await queries.select.rolls()
        setRollsList(rolls)
        setCameraList([{ label: 'All', value: '' }, ...cameras.map(camera => ({ label: camera.model, value: camera.id }))])
      }

      fetchAsyncData()
    }, [])
  )

  const filteredRollList = React.useMemo(() => {
    return rollsList.filter(roll => {
      if (activeCamera && roll.cameraId !== activeCamera) {
        return false
      }

      if (activePhase && roll.phase !== activePhase) {
        return false
      }

      return true
    })
  }, [rollsList, activeCamera, activePhase])

  if (rollsList.length === 0) {
    return (
      <PageWrapper
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Button variant="primary" onPress={addRollCallback}>
          Add Your First Roll
        </Button>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Rolls">
      <DropdownWrapper
        left={
          <Dropdown
            label={'By Camera'}
            isVisible={showFilterByCameraDropdown}
            setIsVisible={setShowFilterByCameraDropdown}
            value={activeCamera}
            setValue={setActiveCamera}
            list={cameraList}
          />
        }
        right={
          <Dropdown
            label={'By Phase'}
            isVisible={showFilterByPhaseDropdown}
            setIsVisible={setShowFilterByPhaseDropdown}
            value={activePhase}
            setValue={setActivePhase}
            list={phaseList}
          />
        }
      />
      {filteredRollList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h2">No rolls found</Typography>
          <Typography variant="body1">Too many filters applied. </Typography>
        </View>
      ) : (
        <FlatList
          data={filteredRollList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RollPreviewListItem
              id={item.id}
              roll={item.roll}
              camera={item.cameraModel}
              notesCount={item.notesCount}
              phase={item.phase}
              iso={item.iso}
              insertedIntoCameraAt={item.insertedIntoCameraAt}
              removedFromCameraAt={item.removedFromCameraAt}
            />
          )}
        />
      )}
      <ButtonWrapper
        right={
          <Button variant="primary" onPress={addRollCallback}>
            Add Roll
          </Button>
        }
      ></ButtonWrapper>
    </PageWrapper>
  )
}

export default Rolls
