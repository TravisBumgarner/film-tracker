import Typography from '@/shared/components/Typography'
import { COLORS } from '@/shared/theme'
import { StyleSheet, View } from 'react-native'

type Props = {
  text: string
  date: string
}

const NoteListItem = ({ text, date }: Props) => {
  const containerStyle = {
    ...styles.container,
    backgroundColor: COLORS.light.transparent,
    borderColor: COLORS.light.opaque,
  }

  return (
    <View style={containerStyle}>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="body1">{date}</Typography>
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

export default NoteListItem
