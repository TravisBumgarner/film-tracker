import queries from '@/db/queries'
import Typography from '@/shared/components/Typography'
import { COLORS } from '@/shared/theme'
import { navigateWithParams } from '@/shared/utilities'
import { useCallback, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Icon } from 'react-native-paper'

type Props = {
  text: string
  date: string
  id: string
  rollId: string
  onDeleteCallback: () => void
}

const NoteListItem = ({ text, date, id, rollId, onDeleteCallback }: Props) => {
  const swipeableRef = useRef<Swipeable>(null)

  const handleDelete = useCallback(async () => {
    await queries.delete.note(id)
    onDeleteCallback()

    console.log('navigating?', rollId)
  }, [rollId, id, onDeleteCallback])

  const handleEdit = useCallback(() => {
    navigateWithParams('edit-note', { noteId: id, rollId })
    swipeableRef.current?.close()
  }, [id, rollId])

  const renderLeftActions = useCallback(
    () => (
      <TouchableOpacity onPress={handleDelete} style={{}}>
        <Icon source="delete" size={24} color={COLORS.primary.opaque} />
      </TouchableOpacity>
    ),
    [handleDelete]
  )

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity onPress={handleEdit} style={{}}>
        <Icon source="pencil" size={24} color={COLORS.primary.opaque} />
      </TouchableOpacity>
    ),
    [handleEdit]
  )

  return (
    <Swipeable ref={swipeableRef} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Typography variant="body2">{date}</Typography>
        <Typography variant="body1">{text}</Typography>
      </View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: COLORS.light.opaque,
    borderTopWidth: 1,
    height: 50,
  },
})

export default NoteListItem