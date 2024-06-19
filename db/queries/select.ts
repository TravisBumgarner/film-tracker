import { db } from '@/db/client'
import { count, eq } from 'drizzle-orm'
import { RollPreviewListItemData } from '@/shared/types'

import { RollsTable, NotesTable, CamerasTable, SelectCamera, SelectNote } from '../schema'

const rolls = async (): Promise<RollPreviewListItemData[]> => {
  return (await db
    .select({
      uuid: RollsTable.uuid,
      roll: RollsTable.roll,
      createdAt: RollsTable.createdAt,
      updatedAt: RollsTable.updatedAt,
      iso: RollsTable.iso,
      cameraId: RollsTable.cameraId,
      phase: RollsTable.phase,
      cameraModel: CamerasTable.model,
      notesCount: count(NotesTable),
      insertedIntoCameraAt: RollsTable.insertedIntoCameraAt,
      removedFromCameraAt: RollsTable.removedFromCameraAt,
    })
    .from(RollsTable)
    .leftJoin(CamerasTable, eq(RollsTable.cameraId, CamerasTable.uuid))
    .leftJoin(NotesTable, eq(RollsTable.uuid, NotesTable.rollId))) as RollPreviewListItemData[]
}

const cameras = async (): Promise<SelectCamera[]> => {
  return await db.select().from(CamerasTable)
}

const notesByRollId = async (rollId: string): Promise<SelectNote[]> => {
  return await db.select().from(NotesTable).where(eq(NotesTable.rollId, rollId))
}

export default {
  rolls,
  cameras,
  notesByRollId,
}
