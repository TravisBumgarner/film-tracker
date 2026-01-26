import { Platform } from 'react-native'
import { CloudStorage } from 'react-native-cloud-storage'

import { db } from '@/db/client'
import { deleteAllData } from '@/db/queries/delete'
import { insertCamera, insertRoll, insertRollPhoto } from '@/db/queries/insert'
import {
  CameraRunType,
  CamerasTable,
  RollPhotoRunType,
  RollPhotosTable,
  RollRunType,
  RollsTable,
  type SelectCamera,
  type SelectRoll,
  type SelectRollPhoto,
} from '@/db/schema'

import { getValueFromKeyStore, saveValueToKeyStore } from './utilities'

const ICLOUD_BACKUP_ENABLED_KEY = 'icloud_backup_enabled'
const ICLOUD_LAST_BACKUP_KEY = 'icloud_last_backup_timestamp'
const BACKUP_FILENAME = 'filmtracker-backup.json'
const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const isIOS = Platform.OS === 'ios'

export async function getICloudBackupEnabled(): Promise<boolean> {
  if (!isIOS) return false
  const value = await getValueFromKeyStore(ICLOUD_BACKUP_ENABLED_KEY)
  return value === 'true'
}

export async function setICloudBackupEnabled(enabled: boolean): Promise<void> {
  await saveValueToKeyStore(
    ICLOUD_BACKUP_ENABLED_KEY,
    enabled ? 'true' : 'false'
  )
}

export async function getLastBackupTimestamp(): Promise<number | null> {
  const value = await getValueFromKeyStore(ICLOUD_LAST_BACKUP_KEY)
  return value ? parseInt(value, 10) : null
}

async function setLastBackupTimestamp(timestamp: number): Promise<void> {
  await saveValueToKeyStore(ICLOUD_LAST_BACKUP_KEY, timestamp.toString())
}

export async function isBackupNeeded(): Promise<boolean> {
  const enabled = await getICloudBackupEnabled()
  if (!enabled) return false

  const lastBackup = await getLastBackupTimestamp()
  if (!lastBackup) return true

  const now = Date.now()
  return now - lastBackup >= ONE_DAY_MS
}

export async function checkICloudAvailable(): Promise<boolean> {
  if (!isIOS) return false
  try {
    return await CloudStorage.isCloudAvailable()
  } catch {
    return false
  }
}

export async function backupToICloud(): Promise<{
  success: boolean
  error?: string
}> {
  if (!isIOS) {
    return { success: false, error: 'iCloud backup is only available on iOS' }
  }

  try {
    const available = await CloudStorage.isCloudAvailable()
    if (!available) {
      return { success: false, error: 'iCloud is not available' }
    }

    const cameras = await db.select().from(CamerasTable)
    const rolls = await db.select().from(RollsTable)
    const rollPhotos = await db.select().from(RollPhotosTable)

    const backupData = JSON.stringify({
      cameras,
      rolls,
      rollPhotos,
      backupDate: new Date().toISOString(),
    })

    await CloudStorage.writeFile(BACKUP_FILENAME, backupData)
    await setLastBackupTimestamp(Date.now())

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getICloudBackupInfo(): Promise<{
  exists: boolean
  backupDate?: string
  error?: string
}> {
  if (!isIOS) {
    return { exists: false, error: 'iCloud is only available on iOS' }
  }

  try {
    const available = await CloudStorage.isCloudAvailable()
    if (!available) {
      return { exists: false, error: 'iCloud is not available' }
    }

    const fileExists = await CloudStorage.exists(BACKUP_FILENAME)
    if (!fileExists) {
      return { exists: false }
    }

    const content = await CloudStorage.readFile(BACKUP_FILENAME)
    const data = JSON.parse(content)

    return {
      exists: true,
      backupDate: data.backupDate,
    }
  } catch {
    return { exists: false }
  }
}

export async function restoreFromICloud(): Promise<{
  success: boolean
  error?: string
  restoredCameras?: number
  restoredRolls?: number
  restoredPhotos?: number
}> {
  if (!isIOS) {
    return { success: false, error: 'iCloud restore is only available on iOS' }
  }

  try {
    const available = await CloudStorage.isCloudAvailable()
    if (!available) {
      return { success: false, error: 'iCloud is not available' }
    }

    const fileExists = await CloudStorage.exists(BACKUP_FILENAME)
    if (!fileExists) {
      return { success: false, error: 'No iCloud backup found' }
    }

    const content = await CloudStorage.readFile(BACKUP_FILENAME)
    const {
      cameras: rawCameras,
      rolls: rawRolls,
      rollPhotos: rawRollPhotos,
    } = JSON.parse(content)

    if (
      !Array.isArray(rawCameras) ||
      !Array.isArray(rawRolls) ||
      !Array.isArray(rawRollPhotos)
    ) {
      return { success: false, error: 'Invalid backup file format' }
    }

    const cameras: SelectCamera[] = rawCameras.map(camera =>
      CameraRunType.check(camera)
    )
    const rolls: SelectRoll[] = rawRolls.map(roll => RollRunType.check(roll))
    const rollPhotos: SelectRollPhoto[] = rawRollPhotos.map(photo =>
      RollPhotoRunType.check(photo)
    )

    await deleteAllData()

    for (const camera of cameras) {
      await insertCamera(camera)
    }
    for (const roll of rolls) {
      await insertRoll(roll)
    }
    for (const photo of rollPhotos) {
      await insertRollPhoto(photo)
    }

    return {
      success: true,
      restoredCameras: cameras.length,
      restoredRolls: rolls.length,
      restoredPhotos: rollPhotos.length,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function performDailyBackupIfNeeded(): Promise<void> {
  try {
    const needed = await isBackupNeeded()
    if (needed) {
      await backupToICloud()
    }
  } catch {
    // Silently fail for automatic backups
  }
}
