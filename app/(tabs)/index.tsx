import * as React from 'react'
import Typography from '@/shared/components/Typography'
import { FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { Phase } from '@/shared/types'
import FilmPreviewListItem from '@/components/FilmPreviewListItem'
import Button from '@/shared/components/Button'
import ButtonWrapper from '@/shared/components/ButtonWrapper'
import { COLORS } from '@/shared/theme'
import Dropdown from '@/shared/components/Dropdown'

const cameraList = [
  {
    label: 'Yaschica',
    value: 'yascshica',
  },
  {
    label: 'Olympus',
    value: 'olyumpus',
  },
]

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

const data = [
  { film: 'Film1', camera: 'Camera1', notes: 0, phase: Phase.Exposing, iso: 400, startDate: '2021-01-01' },
  { film: 'Film2', camera: 'Camera2', notes: 1, phase: Phase.Developed, iso: 200, startDate: '2021-02-01' },
  { film: 'Film3', camera: 'Camera2', notes: 1, phase: Phase.Developed, iso: 200, startDate: '2021-02-01' },
  { film: 'Film4', camera: 'Camera2', notes: 1, phase: Phase.Developed, iso: 200, startDate: '2021-02-01' },
  { film: 'Film5', camera: 'Camera2', notes: 1, phase: Phase.Developed, iso: 200, startDate: '2021-02-01' },
  { film: 'Film6', camera: 'Camera2', notes: 1, phase: Phase.Developed, iso: 200, startDate: '2021-02-01' },
  // Add more items here...
]

const Rolls = () => {
  const [showFilterByCameraDropdown, setShowFilterByCameraDropdown] = React.useState(false)
  const [showFilterByPhaseDropdown, setShowFilterByPhaseDropdown] = React.useState(false)
  const [activeCamera, setActiveCamera] = React.useState('all')
  const [activePhase, setActivePhase] = React.useState('all')

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h1">Rolls</Typography>
      <Dropdown
        label={'Filter By Camera'}
        isVisible={showFilterByCameraDropdown}
        setIsVisible={setShowFilterByCameraDropdown}
        value={activeCamera}
        setValue={setActiveCamera}
        list={cameraList}
      />
      <Dropdown
        label={'Filter By Phase'}
        isVisible={showFilterByPhaseDropdown}
        setIsVisible={setShowFilterByPhaseDropdown}
        value={activePhase}
        setValue={setActivePhase}
        list={phaseList}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.film}
        renderItem={({ item }) => (
          <FilmPreviewListItem film={item.film} camera={item.camera} notes={item.notes} phase={item.phase} iso={item.iso} startDate={item.startDate} />
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
