import queries from '@/db/queries'
import { SelectCamera } from '@/db/schema'
import Typography from '@/shared/components/Typography'
import { BORDER_RADIUS, BORDER_WIDTH, COLORS, SPACING } from '@/shared/theme'
import { useCallback, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Icon } from 'react-native-paper'

type Props = {
  camera: SelectCamera
  onDeleteCallback: () => void
}

const CameraListItem = ({ camera, onDeleteCallback }: Props) => {
  const swipeableRef = useRef<Swipeable>(null)

  const handleDelete = useCallback(async () => {
    await queries.delete.camera(camera.id)
    onDeleteCallback()
  }, [camera, onDeleteCallback])

  const renderLeftActions = useCallback(
    () => (
      <TouchableOpacity onPress={handleDelete} style={StyleSheet.flatten([styles.swipeableBase, styles.swipeableLeft])}>
        <Icon source="delete" size={24} color={COLORS.NEUTRAL[900]} />
      </TouchableOpacity>
    ),
    [handleDelete]
  )

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      // renderRightActions={renderRightActions}
    >
      <View style={styles.container}>
        <Typography variant="body2">{camera.model}</Typography>
      </View>
    </Swipeable>
  )
}

const SHARED_SPACING = BORDER_WIDTH.MEDIUM

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL[600],
    height: 60, // Can't see icon otherwise.
    marginVertical: SPACING.XXSMALL,
    padding: SPACING.XSMALL,
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
  // swipeableRight: {
  //   marginLeft: SHARED_SPACING,
  // },
})

export default CameraListItem
