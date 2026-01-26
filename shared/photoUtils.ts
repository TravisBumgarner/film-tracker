import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`

export const ensurePhotosDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true })
  }
}

export const pickImage = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') {
    return null
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  })

  if (result.canceled || !result.assets[0]) {
    return null
  }

  return result.assets[0].uri
}

export const takePhoto = async (): Promise<string | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  if (status !== 'granted') {
    return null
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 0.8,
  })

  if (result.canceled || !result.assets[0]) {
    return null
  }

  return result.assets[0].uri
}

export const savePhotoToApp = async (sourceUri: string): Promise<string> => {
  await ensurePhotosDirExists()
  const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
  const destUri = `${PHOTOS_DIR}${filename}`
  await FileSystem.copyAsync({ from: sourceUri, to: destUri })
  return destUri
}

export const deletePhotoFile = async (uri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri)
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri)
    }
  } catch (_error) {
    // File may already be deleted
  }
}

export const getPhotoPath = (filename: string): string => {
  return `${PHOTOS_DIR}${filename}`
}
