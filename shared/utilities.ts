import AsyncStorage from '@react-native-async-storage/async-storage'

export const areSameDay = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) {
    return false
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const formatDisplayDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

export const saveValueToKeyStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
    return key
  } catch (e) {
    return null
  }
}

export const getValueFromKeyStore = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (e) {
    return null
  }
}
