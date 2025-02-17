import Typography from '@/shared/components/Typography'
import { PHASE_TO_COLOR_NAME, SPACING } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  roll: string
  camera: string
  notesCount: number
  phase: Phase
  removedFromCameraAt: string | null
  id: string
}

const RollPreviewListItem = ({ id, roll, camera, notesCount, phase, removedFromCameraAt }: Props) => {
  const containerStyle = {
    ...styles.container,
    backgroundColor: PHASE_TO_COLOR_NAME[phase][300],
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
      {removedFromCameraAt && <Typography variant="body1">{removedFromCameraAt}</Typography>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    marginTop: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
  },
})

export default RollPreviewListItem
