import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const IdeasTable = sqliteTable('idea', {
  uuid: text('uuid').primaryKey().unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  text: text('text').notNull(),
  labelId: text('labelId')
    .references(() => LabelsTable.uuid)
    .notNull(),
})

export type SelectIdea = typeof IdeasTable.$inferSelect
export type NewIdea = typeof IdeasTable.$inferInsert

export const LabelsTable = sqliteTable('label', {
  uuid: text('uuid').primaryKey().unique().notNull(),
  text: text('text').unique().notNull(),
  createdAt: text('date').notNull(),
  updatedAt: text('updatedAt'),
  lastUsedAt: text('lastUsedAt'),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
})

export type SelectLabel = typeof LabelsTable.$inferSelect
export type NewLabel = typeof LabelsTable.$inferInsert
