import Typography from '@/shared/components/Typography'
import { PHASE_TO_COLOR_NAME } from '@/shared/theme'
import { Phase } from '@/shared/types'
import { StyleSheet, View } from 'react-native'

type Props = {
  film: string
  camera: string
  notes: number
  phase: Phase
  iso: number
  startDate: string
  endDate?: string
}

const FilmPreviewListItem = ({ film, camera, notes, phase, iso, startDate, endDate }: Props) => {
  const containerStyle = {
    ...styles.container,
    backgroundColor: PHASE_TO_COLOR_NAME[phase].transparent,
    borderColor: PHASE_TO_COLOR_NAME[phase].opaque,
  }

  return (
    <View style={containerStyle}>
      <Typography variant="h2">{film}</Typography>
      <Typography variant="body1">{camera}</Typography>
      <Typography variant="body1">{notes} Notes</Typography>
      <Typography variant="body1">{phase}</Typography>
      <Typography variant="body1">{iso} ISO</Typography>
      <Typography variant="body1">{startDate}</Typography>
      {endDate && <Typography variant="body1">{endDate}</Typography>}
    </View>
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

export default FilmPreviewListItem
