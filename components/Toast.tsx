import { context } from '@/shared/context'
import { BORDER_RADIUS, COLORS, SPACING } from '@/shared/theme'
import * as React from 'react'
import { Snackbar, Text } from 'react-native-paper'

const Toast = () => {
  const {
    state: { toast },
    dispatch,
  } = React.useContext(context)

  const onDismissSnackBar = React.useCallback(() => {
    dispatch({ type: 'TOAST', payload: null })
  }, [dispatch])

  if (toast === null) {
    return null
  }

  return (
    <Snackbar
      visible={toast !== null}
      duration={3000}
      onDismiss={onDismissSnackBar}
      style={{
        backgroundColor: COLORS[toast.variant].opaque,
        borderRadius: BORDER_RADIUS.NONE,
        justifyContent: 'center',
        alignItems: 'center',
        margin: SPACING.MEDIUM,
        bottom: -20,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: COLORS.dark.opaque,
          fontWeight: 'bold',
        }}
      >
        {toast?.message}
      </Text>
    </Snackbar>
  )
}

export default Toast
