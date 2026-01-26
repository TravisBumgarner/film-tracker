import { eq } from 'drizzle-orm'
import * as FileSystem from 'expo-file-system'

import { db } from '../client'
import { CamerasTable, RollPhotosTable, RollsTable } from '../schema'
import { selectPhotoById } from './select'

export const deleteCamera = async (id: string) => {
  // Rolls and photos are deleted via cascade
  return db.delete(CamerasTable).where(eq(CamerasTable.id, id))
}

export const deleteRoll = async (id: string) => {
  // Photos are deleted via cascade
  return db.delete(RollsTable).where(eq(RollsTable.id, id))
}

export const deleteRollPhoto = async (id: string) => {
  return db.delete(RollPhotosTable).where(eq(RollPhotosTable.id, id))
}

export const deleteRollPhotoWithCleanup = async (id: string) => {
  // Get photo to retrieve file URI
  const photo = await selectPhotoById(id)
  if (photo) {
    // Delete file from filesystem
    try {
      const fileInfo = await FileSystem.getInfoAsync(photo.uri)
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photo.uri)
      }
    } catch (_error) {
      // File may already be deleted, continue with DB deletion
    }
  }
  // Delete from database
  return db.delete(RollPhotosTable).where(eq(RollPhotosTable.id, id))
}

export const deleteAllData = async () => {
  await db.delete(RollPhotosTable)
  await db.delete(RollsTable)
  await db.delete(CamerasTable)
}
