import { db } from '@/db/client'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { CamerasTable, NewCamera, NewNote, NewRoll, NotesTable, RollsTable } from '../schema'

const camera = async (camera: Omit<NewCamera, 'id' | 'createdAt'>): Promise<NewCamera> => {
  return (
    await db
      .insert(CamerasTable)
      .values({
        ...camera,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .returning()
  )[0]
}

const roll = async (roll: Omit<NewRoll, 'id' | 'createdAt'>): Promise<NewRoll> => {
  return (
    await db
      .insert(RollsTable)
      .values({
        ...roll,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .returning()
  )[0] as NewRoll // Is this type safe? TBD.
}

const note = async (note: Omit<NewNote, 'id' | 'createdAt'>): Promise<NewNote> => {
  return (
    await db
      .insert(NotesTable)
      .values({
        ...note,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .returning()
  )[0]
}

export default {
  roll,
  camera,
  note,
}
