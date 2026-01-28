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
const ICLOUD_BACKUP_SLOT_KEY = 'icloud_backup_current_slot'
const LEGACY_BACKUP_FILENAME = 'filmtracker-backup.json'
const BACKUP_SLOTS = 7
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const isIOS = Platform.OS === 'ios'

function getBackupFilename(slot: number): string {
  return `filmtracker-backup-${slot}.json`
}

async function getCurrentSlot(): Promise<number> {
  const value = await getValueFromKeyStore(ICLOUD_BACKUP_SLOT_KEY)
  return value ? parseInt(value, 10) : 0
}

async function setCurrentSlot(slot: number): Promise<void> {
  await saveValueToKeyStore(ICLOUD_BACKUP_SLOT_KEY, slot.toString())
}

export type ICloudBackupEntry = {
  filename: string
  backupDate: string
  cameraCount: number
  rollCount: number
  photoCount: number
  sizeBytes: number
}

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
  return now - lastBackup >= ONE_WEEK_MS
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

    const currentSlot = await getCurrentSlot()
    const filename = getBackupFilename(currentSlot)
    await CloudStorage.writeFile(filename, backupData)

    const nextSlot = (currentSlot + 1) % BACKUP_SLOTS
    await setCurrentSlot(nextSlot)
    await setLastBackupTimestamp(Date.now())

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getAvailableICloudBackups(): Promise<
  ICloudBackupEntry[]
> {
  if (!isIOS) return []

  try {
    const available = await CloudStorage.isCloudAvailable()
    if (!available) return []

    const entries: ICloudBackupEntry[] = []

    // Check all slot files
    for (let i = 0; i < BACKUP_SLOTS; i++) {
      const filename = getBackupFilename(i)
      try {
        const exists = await CloudStorage.exists(filename)
        if (exists) {
          const content = await CloudStorage.readFile(filename)
          const data = JSON.parse(content)
          entries.push({
            filename,
            backupDate: data.backupDate || 'Unknown',
            cameraCount: Array.isArray(data.cameras) ? data.cameras.length : 0,
            rollCount: Array.isArray(data.rolls) ? data.rolls.length : 0,
            photoCount: Array.isArray(data.rollPhotos)
              ? data.rollPhotos.length
              : 0,
            sizeBytes: new Blob([content]).size,
          })
        }
      } catch {
        // Skip unreadable files
      }
    }

    // Check legacy file
    try {
      const legacyExists = await CloudStorage.exists(LEGACY_BACKUP_FILENAME)
      if (legacyExists) {
        const content = await CloudStorage.readFile(LEGACY_BACKUP_FILENAME)
        const data = JSON.parse(content)
        entries.push({
          filename: LEGACY_BACKUP_FILENAME,
          backupDate: data.backupDate || 'Unknown',
          cameraCount: Array.isArray(data.cameras) ? data.cameras.length : 0,
          rollCount: Array.isArray(data.rolls) ? data.rolls.length : 0,
          photoCount: Array.isArray(data.rollPhotos)
            ? data.rollPhotos.length
            : 0,
          sizeBytes: new Blob([content]).size,
        })
      }
    } catch {
      // Skip legacy if unreadable
    }

    // Sort by backup date descending (newest first)
    entries.sort(
      (a, b) =>
        new Date(b.backupDate).getTime() - new Date(a.backupDate).getTime()
    )

    return entries
  } catch {
    return []
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
    const entries = await getAvailableICloudBackups()
    if (entries.length === 0) {
      return { exists: false }
    }

    return {
      exists: true,
      backupDate: entries[0].backupDate,
    }
  } catch {
    return { exists: false }
  }
}

export async function restoreFromICloud(filename: string): Promise<{
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

    const fileExists = await CloudStorage.exists(filename)
    if (!fileExists) {
      return { success: false, error: 'No iCloud backup found' }
    }

    const content = await CloudStorage.readFile(filename)
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

export async function performWeeklyBackupIfNeeded(): Promise<void> {
  try {
    const needed = await isBackupNeeded()
    if (needed) {
      await backupToICloud()
    }
  } catch {
    // Silently fail for automatic backups
  }
}
