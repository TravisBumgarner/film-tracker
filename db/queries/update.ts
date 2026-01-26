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
    exposingAt?: string | null
    exposedAt?: string | null
    developedAt?: string | null
    archivedAt?: string | null
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
    updates.exposingAt = now
  } else if (status === 'EXPOSED') {
    updates.exposedAt = now
  } else if (status === 'DEVELOPED') {
    updates.developedAt = now
  } else if (status === 'ARCHIVED') {
    updates.archivedAt = now
  } else if (status === 'ABANDONED') {
    updates.abandonedAt = now
  }

  return db.update(RollsTable).set(updates).where(eq(RollsTable.id, id))
}

export const updateCameraSortOrder = async (id: string, sortOrder: number) => {
  return db
    .update(CamerasTable)
    .set({ sortOrder, updatedAt: new Date().toISOString() })
    .where(eq(CamerasTable.id, id))
}
