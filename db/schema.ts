import { Phase } from '@/shared/types'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { Literal, Null, Record, String, Union } from 'runtypes'

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
  developedAt: text('developedAt'),
  archivedAt: text('archivedAt'),
  abandonedAt: text('abandonedAt'),
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

export const RollRunType = Record({
  id: String,
  roll: String,
  createdAt: String,
  updatedAt: String.Or(Null),
  cameraId: String,
  phase: Union(Literal(Phase.Archived), Literal(Phase.Developed), Literal(Phase.Exposed), Literal(Phase.Exposing)),
  insertedIntoCameraAt: String,
  removedFromCameraAt: String.Or(Null),
  lastInteractedAt: String.Or(Null),
})

export const CameraRunType = Record({
  id: String,
  createdAt: String,
  updatedAt: String.Or(Null),
  model: String,
})

export const NoteRunType = Record({
  id: String,
  createdAt: String,
  updatedAt: String.Or(Null),
  text: String,
  rollId: String,
})
