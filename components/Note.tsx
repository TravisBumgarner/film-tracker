import queries from '@/db/queries'
import Typography from '@/shared/components/Typography'
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, SPACING } from '@/shared/theme'
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
  }, [id, onDeleteCallback])

  const handleEdit = useCallback(() => {
    navigateWithParams('edit-note', { noteId: id, rollId })
    swipeableRef.current?.close()
  }, [id, rollId])

  const renderLeftActions = useCallback(
    () => (
      <TouchableOpacity onPress={handleDelete} style={StyleSheet.flatten([styles.swipeableBase, styles.swipeableLeft])}>
        <Icon source="delete" size={24} color={COLORS.NEUTRAL[900]} />
      </TouchableOpacity>
    ),
    [handleDelete]
  )

  const renderRightActions = useCallback(
    () => (
      <TouchableOpacity onPress={handleEdit} style={StyleSheet.flatten([styles.swipeableBase, styles.swipeableRight])}>
        <Icon source="pencil" size={24} color={COLORS.NEUTRAL[900]} />
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

const SHARED_SPACING = BORDER_WIDTH.MEDIUM

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL[600],
    marginVertical: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
  },
  swipeableBase: {
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL[600],
    borderRadius: BORDER_RADIUS.NONE,
    justifyContent: 'center',
    marginVertical: SPACING.MEDIUM,
    padding: SPACING.XXSMALL,
  },
  swipeableLeft: {
    marginRight: SHARED_SPACING,
  },
  swipeableRight: {
    marginLeft: SHARED_SPACING,
  },
})

export default NoteListItem
