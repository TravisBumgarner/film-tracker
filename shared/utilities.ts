import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import type { URLParams } from './types'

export const saveValueToKeyStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
    return key
  } catch (_e) {
    return null
  }
}

export const getValueFromKeyStore = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch (_e) {
    return null
  }
}

export const navigateWithParams = <T extends keyof URLParams>(
  pathname: T,
  params: URLParams[T]
) => {
  router.push({ pathname, params })
}

export const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const timeAgo = (date: string) => {
  const currentDate = new Date()
  const providedDate = new Date(date)
  const diffInSeconds = Math.floor(
    (currentDate.getTime() - providedDate.getTime()) / 1000
  )
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays >= 1) {
    return providedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } else if (diffInHours >= 1) {
    const remainingMinutes = diffInMinutes % 60
    return `${diffInHours}h ${remainingMinutes}m ago`
  } else {
    return `${diffInMinutes}m ago`
  }
}

export function notNull<T>(value: T | null): value is T {
  return value !== null
}

export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
