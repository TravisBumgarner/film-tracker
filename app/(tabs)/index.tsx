import * as React from 'react'
import Typography from '@/shared/components/Typography'
import { FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { Phase, RollPreviewListItemData } from '@/shared/types'
import RollPreviewListItem from '@/components/RollPreviewListItem'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import { COLORS } from '@/shared/theme'
import Dropdown from '@/shared/components/Dropdown'
import DropdownWrapper from '@/shared/components/DropdownWrapper'
import queries from '@/db/queries'
import { useAsyncEffect } from 'use-async-effect'

const phaseList = [
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
  const [activeCamera, setActiveCamera] = React.useState('all')
  const [activePhase, setActivePhase] = React.useState('all')

  // const insertInsertData = async () => {
  //   const camera = await queries.insert.camera({ model: 'Yaschica' })
  //   console.log('inserted', camera)
  //   await queries.insert.roll({
  //     cameraId: camera.uuid,
  //     roll: 'Film1',
  //     iso: 400,
  //     phase: Phase.Exposing,
  //   })

  //   await queries.insert.roll({
  //     cameraId: camera.uuid,
  //     roll: 'Film2',
  //     iso: 400,
  //     phase: Phase.Exposed,
  //   })

  //   await queries.insert.roll({
  //     cameraId: camera.uuid,
  //     roll: 'Film1',
  //     iso: 400,
  //     phase: Phase.Archived,
  //   })
  // }

  // useAsyncEffect(async () => {
  //   console.log('I run')
  //   await insertInsertData()
  // }, [insertInsertData])

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     queries.select.rolls().then(console.log)
  //   }, 1000)
  // }, [])

  useAsyncEffect(async () => {
    const cameras = await queries.select.cameras()
    const rolls = await queries.select.rolls()
    setRollsList(rolls)
    setCameraList(cameras.map(camera => ({ label: camera.model, value: camera.uuid })))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h1">Rolls</Typography>
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
      <FlatList
        data={rollsList}
        keyExtractor={item => item.uuid}
        renderItem={({ item }) => (
          <RollPreviewListItem
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
      <ButtonWrapper
        right={
          <Button variant="primary" callback={() => console.log('clicked')}>
            Add Roll
          </Button>
        }
      ></ButtonWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark.opaque,
    flex: 1,
  },
})

export default Rolls
