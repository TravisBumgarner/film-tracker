import queries from '@/db/queries'
import Typography from '@/shared/components/Typography'
import { BORDER_RADIUS, COLORS, SPACING } from '@/shared/theme'
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
      <TouchableOpacity
        onPress={handleDelete}
        style={{
          backgroundColor: COLORS.light.opaque,
          justifyContent: 'center',
          alignItems: 'center',
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
          marginRight: SPACING.md,
          marginBottom: SPACING.md,
        }}
      >
        <Icon source="delete" size={24} color={COLORS.dark.opaque} />
      </TouchableOpacity>
    ),
    [handleDelete]
  )

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity
        onPress={handleEdit}
        style={{
          backgroundColor: COLORS.light.opaque,
          justifyContent: 'center',
          alignItems: 'center',
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
          marginLeft: SPACING.md,
          marginBottom: SPACING.md,
        }}
      >
        <Icon source="pencil" size={24} color={COLORS.dark.opaque} />
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
    backgroundColor: COLORS.light.transparent,
    borderColor: COLORS.light.opaque,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    flex: 0,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
})

export default NoteListItem
