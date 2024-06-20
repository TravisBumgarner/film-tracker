import { db } from '@/db/client'
import { PartialWithRequiredKeys } from '@/shared/types'
import { eq } from 'drizzle-orm'
import 'react-native-get-random-values'

import { NewRoll, RollsTable } from '../schema'

const roll = async (id: string, roll: Partial<NewRoll>): Promise<PartialWithRequiredKeys<NewRoll, 'id'>> => {
  return {
    id,
    ...(await db
      .update(RollsTable)
      .set({
        ...roll,
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
