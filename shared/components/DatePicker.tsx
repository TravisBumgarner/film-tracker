import { useCallback, useState } from 'react'
import { Button } from 'react-native-paper'
import { DatePickerModal as DatePickerModalRNDP } from 'react-native-paper-dates'
import { StyleSheet, View } from 'react-native'

import Typography from './Typography'

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date) => void
}

const DatePickerModal: React.FC<DatePickerProps> = ({ date, setDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onDismissSingle = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const onConfirmSingle = useCallback(
    ({ date }: { date: Date | undefined }) => {
      setIsModalOpen(false)
      if (date) setDate(date)
    },
    [setIsModalOpen, setDate]
  )

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  return (
    <>
      <View style={styles.container}>
        <Typography style={styles.typography} variant="body1">
          {date ? date.toDateString() : ''}
        </Typography>
        <Button onPress={openModal} uppercase={false} mode="outlined">
          Roll Date
        </Button>
      </View>
      <DatePickerModalRNDP locale="en" mode="single" visible={isModalOpen} onDismiss={onDismissSingle} date={date} onConfirm={onConfirmSingle} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    paddingLeft: 16,
  },
  typography: {
    flex: 1,
  },
})

export default DatePickerModal
