import { BORDER_RADIUS } from '@/app/theme'
import { useCallback } from 'react'
import { Button, Icon } from 'react-native-paper'

type ReadonlyCondition =
  | {
      readonly: false
      handlePress: () => void
    }
  | {
      readonly: true
    }

type Props = {
  color: string
  icon: string
  text: string
  fullWidth?: boolean
}

const Label = ({ color, icon, text, ...rest }: Props & ReadonlyCondition) => {
  const handlePress = useCallback(() => {
    rest.readonly ? null : rest.handlePress()
  }, [rest])

  return (
    <Button
      icon={() => <Icon source={icon} size={24} color="#fff" />}
      mode="contained"
      buttonColor={color}
      style={{
        borderRadius: BORDER_RADIUS.md,
      }}
      onPress={handlePress}
    >
      {text}
    </Button>
  )
}

export default Label
