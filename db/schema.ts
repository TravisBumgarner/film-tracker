import { Phase } from '@/shared/types'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const RollsTable = sqliteTable('roll', {
  id: text('id').primaryKey().unique().notNull(),
  roll: text('roll').notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  cameraId: text('cameraId')
    .references(() => CamerasTable.id)
    .notNull(),
  phase: text('phase').notNull(), // Sqlite does not have an enum type
  insertedIntoCameraAt: text('insertedIntoCameraAt').notNull(),
  removedFromCameraAt: text('removedFromCameraAt'),
  lastInteractedAt: text('lastInteractedAt'),
})

export const CamerasTable = sqliteTable('camera', {
  id: text('id').primaryKey().unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  model: text('model').notNull(),
})

export const NotesTable = sqliteTable('note', {
  id: text('id').primaryKey().unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  text: text('text').notNull(),
  rollId: text('rollId')
    .references(() => RollsTable.id)
    .notNull(),
})

// Sqlite does not have an enum type
export type NewRoll = Omit<typeof RollsTable.$inferInsert, 'phase'> & { phase: Phase }
export type NewCamera = typeof CamerasTable.$inferInsert
export type NewNote = typeof NotesTable.$inferInsert

export type SelectRoll = Omit<typeof RollsTable.$inferSelect, 'phase'> & { phase: Phase }
export type SelectCamera = typeof CamerasTable.$inferSelect
export type SelectNote = typeof NotesTable.$inferSelect
