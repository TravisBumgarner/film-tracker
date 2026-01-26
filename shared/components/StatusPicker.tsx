import { Pressable, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { BORDER_RADIUS, COLORS, ROLL_STATUS_COLORS, SPACING } from '../theme'
import {
  ROLL_STATUS_LABELS,
  RollStatus,
  type RollStatusType,
} from '../types'

type Props = {
  value: RollStatusType
  onChange: (status: RollStatusType) => void
}

const StatusPicker: React.FC<Props> = ({ value, onChange }) => {
  // Stub: returns empty view
  return <View />
}

const styles = StyleSheet.create({})

export default StatusPicker
