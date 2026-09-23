import {
  pgTable,
  text,
  varchar,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core'

/**
 * Student profile — the central context layer for every agent.
 * `id` is the Clerk user id when Clerk is enabled, otherwise 'local'.
 */
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Student'),
  college: text('college'),
  degree: text('degree'),
  branch: text('branch'),
  year: text('year'),
  semester: text('semester'),
  targetRole: text('target_role'),
  skills: text('skills').array(),
  interests: text('interests').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

/** Course → Subject → Unit/Topic hierarchy (MVP covers Subject → Topic). */
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  examDate: timestamp('exam_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  subjectId: serial('subject_id')
    .notNull()
    .references(() => subjects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  /** todo | in_progress | done */
  status: varchar('status', { length: 20 }).notNull().default('todo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

/**
 * Unified task system — tasks can be created by the student,
 * by AI agents (via the create_tasks tool), or by study plans.
 */
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  /** todo | done */
  status: varchar('status', { length: 20 }).notNull().default('todo'),
  /** manual | ai */
  source: varchar('source', { length: 20 }).notNull().default('manual'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Subject = typeof subjects.$inferSelect
export type Topic = typeof topics.$inferSelect
export type Task = typeof tasks.$inferSelect
