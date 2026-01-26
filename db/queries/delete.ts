import { eq } from 'drizzle-orm'

import { db } from '../client'
import { CamerasTable, RollPhotosTable, RollsTable } from '../schema'

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

export const deleteAllData = async () => {
  await db.delete(RollPhotosTable)
  await db.delete(RollsTable)
  await db.delete(CamerasTable)
}
