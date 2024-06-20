import Typography from '@/shared/components/Typography'
import { PHASE_TO_COLOR_NAME } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  roll: string
  camera: string
  notesCount: number
  phase: Phase
  iso: string
  insertedIntoCameraAt: string
  removedFromCameraAt: string | null
  id: string
}

const RollPreviewListItem = ({ id, roll, camera, notesCount, phase, iso, insertedIntoCameraAt, removedFromCameraAt }: Props) => {
  const containerStyle = {
    ...styles.container,
    backgroundColor: PHASE_TO_COLOR_NAME[phase].transparent,
    borderColor: PHASE_TO_COLOR_NAME[phase].opaque,
  }

  const openRoll = useCallback(() => {
    router.navigate(`roll/${id}`)
  }, [id])

  return (
    <TouchableOpacity style={containerStyle} onPress={openRoll}>
      <Typography variant="h2">{roll}</Typography>
      <Typography variant="body1">{camera}</Typography>
      <Typography variant="body1">{notesCount} Notes</Typography>
      <Typography variant="body1">{phase}</Typography>
      <Typography variant="body1">{iso} ISO</Typography>
      <Typography variant="body1">{insertedIntoCameraAt}</Typography>
      {removedFromCameraAt && <Typography variant="body1">{removedFromCameraAt}</Typography>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 3,
    flex: 0,
    margin: 8,
    padding: 16,
  },
})

export default RollPreviewListItem
