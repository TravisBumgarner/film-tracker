import { eq } from 'drizzle-orm'

import { db } from '../client'
import { CamerasTable, RollsTable } from '../schema'

export const updateCamera = async (
  id: string,
  updates: { name?: string; notes?: string | null }
) => {
  return db
    .update(CamerasTable)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(eq(CamerasTable.id, id))
}

export const updateRoll = async (
  id: string,
  updates: {
    filmStock?: string
    status?: string
    frameCount?: number
    framesShot?: number | null
    notes?: string | null
    startedAt?: string | null
    developedAt?: string | null
  }
) => {
  return db
    .update(RollsTable)
    .set({ ...updates, updatedAt: new Date().toISOString() })
    .where(eq(RollsTable.id, id))
}

export const updateRollStatus = async (id: string, status: string) => {
  const now = new Date().toISOString()
  const updates: Record<string, string | null> = {
    status,
    updatedAt: now,
  }

  if (status === 'EXPOSING') {
    updates.startedAt = now
  } else if (status === 'DEVELOPED') {
    updates.developedAt = now
  }

  return db.update(RollsTable).set(updates).where(eq(RollsTable.id, id))
}

export const updateCameraSortOrder = async (id: string, sortOrder: number) => {
  return db
    .update(CamerasTable)
    .set({ sortOrder, updatedAt: new Date().toISOString() })
    .where(eq(CamerasTable.id, id))
}
