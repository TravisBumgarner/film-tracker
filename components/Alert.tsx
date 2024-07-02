import Button from '@/shared/components/Button'
import Typography from '@/shared/components/Typography'
import { context } from '@/shared/context'
import { COLORS } from '@/shared/theme'
import { useCallback, useContext } from 'react'
import { Modal, StyleSheet, View } from 'react-native'

const Alert = () => {
  const {
    state: { alertMessage },
    dispatch,
  } = useContext(context)

  const hasMessage = alertMessage !== null

  const hideDialog = useCallback(() => {
    dispatch({ type: 'CLEAR_ALERT_MESSAGE' })
  }, [dispatch])

  if (!hasMessage) return null

  return (
    <Modal animationType="fade" transparent={true} visible={hasMessage} onRequestClose={hideDialog}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Typography style={styles.text} variant="body1">
            {alertMessage}asd
          </Typography>
          <Button variant="primary" onPress={hideDialog}>
            Done
          </Button>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.warning.transparent,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: COLORS.light.opaque,
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    minWidth: 300,
    padding: 35,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: COLORS.dark.opaque,
  },
})

export default Alert
