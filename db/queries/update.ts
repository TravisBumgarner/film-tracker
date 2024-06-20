import { db } from '@/db/client'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { eq } from 'drizzle-orm'
import { PartialWithRequiredKeys } from '@/shared/types'

import { NewRoll, RollsTable } from '../schema'

const roll = async (id: string, roll: Partial<NewRoll>): Promise<PartialWithRequiredKeys<NewRoll, 'id'>> => {
  return {
    id,
    ...(await db
      .update(RollsTable)
      .set({
        ...roll,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      })
      .where(eq(RollsTable.id, id))
      .returning()),
  }
}

export default {
  roll,
  // camera,
  // note,
}
