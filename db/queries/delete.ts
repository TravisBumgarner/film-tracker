import { eq } from 'drizzle-orm'

import { db } from '../client'
import { NotesTable } from '../schema'

const note = (id: string) => {
  return db.delete(NotesTable).where(eq(NotesTable.id, id))
}

export default {
  note,
}
