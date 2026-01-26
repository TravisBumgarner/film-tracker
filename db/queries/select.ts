import { asc, eq } from 'drizzle-orm'

import { db } from '../client'
import { CamerasTable, RollPhotosTable, RollsTable } from '../schema'

export const selectCameras = async () => {
  return db.select().from(CamerasTable).orderBy(asc(CamerasTable.sortOrder))
}

export const selectCameraById = async (id: string) => {
  const results = await db
    .select()
    .from(CamerasTable)
    .where(eq(CamerasTable.id, id))
  return results[0] ?? null
}

export const selectRollsByCameraId = async (cameraId: string) => {
  return db
    .select()
    .from(RollsTable)
    .where(eq(RollsTable.cameraId, cameraId))
    .orderBy(asc(RollsTable.createdAt))
}

export const selectRollById = async (id: string) => {
  const results = await db
    .select()
    .from(RollsTable)
    .where(eq(RollsTable.id, id))
  return results[0] ?? null
}

export const selectPhotosByRollId = async (rollId: string) => {
  return db
    .select()
    .from(RollPhotosTable)
    .where(eq(RollPhotosTable.rollId, rollId))
    .orderBy(asc(RollPhotosTable.sortOrder))
}
