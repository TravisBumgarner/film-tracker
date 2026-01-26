import * as React from 'react'
import { Snackbar, Text } from 'react-native-paper'

import { context } from '../context'
import { BORDER_RADIUS, COLORS, SPACING } from '../theme'

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
        backgroundColor: COLORS[toast.variant][400],
        borderRadius: BORDER_RADIUS.NONE,
        justifyContent: 'center',
        alignItems: 'center',
        margin: SPACING.MEDIUM,
        bottom: 40,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: COLORS.NEUTRAL[100],
          fontWeight: 'bold',
        }}
      >
        {toast?.message}
      </Text>
    </Snackbar>
  )
}

export default Toast
