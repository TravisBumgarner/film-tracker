import * as React from 'react'
import Typography from '@/shared/components/Typography'
import { SafeAreaView, StyleSheet } from 'react-native'
import DropDown from 'react-native-paper-dropdown'

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
    value: 'exposing',
  },
  {
    label: 'Exposed',
    value: 'exposed',
  },
  {
    label: 'Developed',
    value: 'developed',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
]

const Rolls = () => {
  const [showFilterByCameraDropdown, setShowFilterByCameraDropdown] = React.useState(false)
  const [showFilterByPhaseDropdown, setShowFilterByPhaseDropdown] = React.useState(false)
  const [activeCamera, setActiveCamera] = React.useState('all')
  const [activePhase, setActivePhase] = React.useState('all')

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h1">Rolls</Typography>
      <DropDown
        label={'Filter By Camera'}
        mode={'outlined'}
        visible={showFilterByCameraDropdown}
        showDropDown={() => setShowFilterByCameraDropdown(true)}
        onDismiss={() => setShowFilterByCameraDropdown(false)}
        value={activeCamera}
        setValue={setActiveCamera}
        list={cameraList}
      />
      <DropDown
        label={'Filter By Phase'}
        mode={'outlined'}
        visible={showFilterByPhaseDropdown}
        showDropDown={() => setShowFilterByPhaseDropdown(true)}
        onDismiss={() => setShowFilterByPhaseDropdown(false)}
        value={activePhase}
        setValue={setActivePhase}
        list={phaseList}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Rolls
