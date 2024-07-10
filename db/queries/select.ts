import { db } from '@/db/client'
import { desc, eq } from 'drizzle-orm'

import { CamerasTable, NotesTable, RollsTable, SelectCamera, SelectNote, SelectRoll } from '../schema'

const rolls = async (): Promise<SelectRoll[]> => {
  return (await db.select().from(RollsTable).orderBy(desc(RollsTable.lastInteractedAt))) as SelectRoll[]
}

const cameras = async (): Promise<SelectCamera[]> => {
  return await db.select().from(CamerasTable)
}

const rollById = async (id: string): Promise<SelectRoll> => {
  const result = (await db.select().from(RollsTable).where(eq(RollsTable.id, id)))[0] as SelectRoll
  return result
}

const notesByRollId = async (rollId: string): Promise<SelectNote[]> => {
  return await db.select().from(NotesTable).where(eq(NotesTable.rollId, rollId)).orderBy(desc(NotesTable.createdAt))
}

const noteByNoteId = async (noteId: string): Promise<SelectNote> => {
  return (await db.select().from(NotesTable).where(eq(NotesTable.id, noteId)))[0]
}

const cameraById = async (cameraId: string): Promise<SelectCamera> => {
  return (await db.select().from(CamerasTable).where(eq(CamerasTable.id, cameraId)))[0]
}

export default {
  rolls,
  cameras,
  notesByRollId,
  noteByNoteId,
  rollById,
  cameraById,
}
