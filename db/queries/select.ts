import { db } from '@/db/client'
import { RollPreviewListItemData } from '@/shared/types'
import { eq, sql } from 'drizzle-orm'

import { CamerasTable, NotesTable, RollsTable, SelectCamera, SelectNote, SelectRoll } from '../schema'

const rolls = async (): Promise<RollPreviewListItemData[]> => {
  // TODO - not sure if this query works.
  return (await db
    .select({
      id: RollsTable.id,
      roll: RollsTable.roll,
      createdAt: RollsTable.createdAt,
      updatedAt: RollsTable.updatedAt,
      iso: RollsTable.iso,
      cameraId: RollsTable.cameraId,
      phase: RollsTable.phase,
      cameraModel: CamerasTable.model,
      notesCount: sql<number>`count(${NotesTable.id})`,
      insertedIntoCameraAt: RollsTable.insertedIntoCameraAt,
      removedFromCameraAt: RollsTable.removedFromCameraAt,
    })
    .from(RollsTable)
    .leftJoin(CamerasTable, eq(RollsTable.cameraId, CamerasTable.id))
    .leftJoin(NotesTable, eq(RollsTable.id, NotesTable.rollId))
    .groupBy(RollsTable.id)) as RollPreviewListItemData[]
  // For some reason the joins make an extra row with null values, so we filter them out
  // .filter(roll => roll.id !== null) as RollPreviewListItemData[]
}

const cameras = async (): Promise<SelectCamera[]> => {
  return await db.select().from(CamerasTable)
}

const rollById = async (id: string): Promise<SelectRoll> => {
  return (await db.select().from(RollsTable).where(eq(RollsTable.id, id)))[0] as SelectRoll
}

const notesByRollId = async (rollId: string): Promise<SelectNote[]> => {
  return await db.select().from(NotesTable).where(eq(NotesTable.rollId, rollId))
}

export default {
  rolls,
  cameras,
  notesByRollId,
  rollById,
}
