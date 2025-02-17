import { eq } from 'drizzle-orm'

import { db } from '../client'
import { CamerasTable, NotesTable, RollsTable } from '../schema'

const note = (id: string) => {
  return db.delete(NotesTable).where(eq(NotesTable.id, id))
}

const camera = (id: string) => {
  return db.delete(CamerasTable).where(eq(CamerasTable.id, id))
}

const everything = async () => {
  await db.delete(NotesTable).all()
  await db.delete(CamerasTable).all()
  await db.delete(RollsTable).all()
}

export default {
  note,
  everything,
  camera,
}
