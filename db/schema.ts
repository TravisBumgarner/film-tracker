import { Phase } from '@/shared/types'
import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

export const RollsTable = sqliteTable('roll', {
  uuid: text('uuid').primaryKey().unique().notNull(),
  roll: text('roll').notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  iso: int('iso').notNull(),
  cameraId: text('cameraId')
    .references(() => CamerasTable.uuid)
    .notNull(),
  phase: text('phase').notNull(), // Sqlite does not have an enum type
})

export const CamerasTable = sqliteTable('camera', {
  uuid: text('uuid').primaryKey().unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  model: text('model').notNull(),
})

export const NotesTable = sqliteTable('note', {
  uuid: text('uuid').primaryKey().unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  text: text('text').notNull(),
  rollId: text('rollId')
    .references(() => RollsTable.uuid)
    .notNull(),
})

// Sqlite does not have an enum type
export type NewRoll = Omit<typeof RollsTable.$inferInsert, 'phase'> & { phase: Phase }
export type NewCamera = typeof CamerasTable.$inferInsert
export type NewNote = typeof NotesTable.$inferInsert

export type SelectRoll = Omit<typeof RollsTable.$inferSelect, 'phase'> & { phase: Phase }
export type SelectCamera = typeof CamerasTable.$inferSelect
export type SelectNote = typeof NotesTable.$inferSelect
