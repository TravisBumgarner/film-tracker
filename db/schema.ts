import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { Null, Number, Record, String } from 'runtypes'

export const CamerasTable = sqliteTable('camera', {
  id: text('id').primaryKey().unique().notNull(),
  name: text('name').notNull(),
  notes: text('notes'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt'),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export type SelectCamera = typeof CamerasTable.$inferSelect
export type NewCamera = typeof CamerasTable.$inferInsert

export const CameraRunType = Record({
  id: String,
  name: String,
  notes: String.Or(Null),
  createdAt: String,
  updatedAt: String.Or(Null),
  sortOrder: Number,
})

export const RollsTable = sqliteTable('roll', {
  id: text('id').primaryKey().unique().notNull(),
  cameraId: text('cameraId')
    .references(() => CamerasTable.id, { onDelete: 'cascade' })
    .notNull(),
  filmStock: text('filmStock').notNull(),
  status: text('status').notNull().default('EXPOSING'),
  frameCount: integer('frameCount').notNull().default(36),
  framesShot: integer('framesShot'),
  iso: integer('iso'),
  notes: text('notes'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt'),
  exposingAt: text('exposingAt'),
  exposedAt: text('exposedAt'),
  developedAt: text('developedAt'),
  archivedAt: text('archivedAt'),
  abandonedAt: text('abandonedAt'),
})

export type SelectRoll = typeof RollsTable.$inferSelect
export type NewRoll = typeof RollsTable.$inferInsert

export const RollRunType = Record({
  id: String,
  cameraId: String,
  filmStock: String,
  status: String,
  frameCount: Number,
  framesShot: Number.Or(Null),
  iso: Number.Or(Null),
  notes: String.Or(Null),
  createdAt: String,
  updatedAt: String.Or(Null),
  exposingAt: String.Or(Null),
  exposedAt: String.Or(Null),
  developedAt: String.Or(Null),
  archivedAt: String.Or(Null),
  abandonedAt: String.Or(Null),
})

export const RollPhotosTable = sqliteTable('roll_photo', {
  id: text('id').primaryKey().unique().notNull(),
  rollId: text('rollId')
    .references(() => RollsTable.id, { onDelete: 'cascade' })
    .notNull(),
  uri: text('uri').notNull(),
  createdAt: text('createdAt').notNull(),
  sortOrder: integer('sortOrder').notNull().default(0),
})

export type SelectRollPhoto = typeof RollPhotosTable.$inferSelect
export type NewRollPhoto = typeof RollPhotosTable.$inferInsert

export const RollPhotoRunType = Record({
  id: String,
  rollId: String,
  uri: String,
  createdAt: String,
  sortOrder: Number,
})
