import { db } from '@/db/client'
import { count, eq } from 'drizzle-orm'
import { Phase, RollPreviewListItemData } from '@/shared/types'

import { RollsTable, SelectRoll, NotesTable, CamerasTable, SelectCamera } from '../schema'

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
    })
    .from(RollsTable)
    .leftJoin(CamerasTable, eq(RollsTable.cameraId, CamerasTable.uuid))
    .leftJoin(NotesTable, eq(RollsTable.uuid, NotesTable.rollId))) as RollPreviewListItemData[]
}

const cameras = async (): Promise<SelectCamera[]> => {
  return await db.select().from(CamerasTable)
}

export default {
  rolls,
  cameras,
}
