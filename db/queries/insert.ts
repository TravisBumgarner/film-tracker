import { db } from '@/db/client'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { CamerasTable, NewCamera, NewNote, NewRoll, NotesTable, RollsTable } from '../schema'

const camera = async (camera: Omit<NewCamera, 'uuid' | 'createdAt'>): Promise<NewCamera> => {
  return (
    await db
      .insert(CamerasTable)
      .values({
        ...camera,
        uuid: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .returning()
  )[0]
}

const roll = async (roll: Omit<NewRoll, 'uuid' | 'createdAt'>): Promise<NewRoll> => {
  return (
    await db
      .insert(RollsTable)
      .values({
        ...roll,
        uuid: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .returning()
  )[0] as NewRoll // Is this type safe? TBD.
}

const note = async (note: Omit<NewNote, 'uuid' | 'createdAt'>): Promise<NewNote> => {
  return (
    await db
      .insert(NotesTable)
      .values({
        ...note,
        uuid: uuidv4(),
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
