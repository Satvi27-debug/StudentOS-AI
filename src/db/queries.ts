import { eq, inArray } from 'drizzle-orm'
import { tryDb } from './index'
import { profiles, subjects, topics, tasks } from './schema'
import type { Profile, Subject, Topic, Task } from './schema'
import { parseDateInput } from '@/lib/date'

export type SubjectDetail = Subject & { topics: Topic[] }

export type OpResult<T = boolean> = { ok: boolean; error: string | null; data?: T }

function err<T>(message: string): OpResult<T> {
  return { ok: false, error: message }
}
function okResult<T>(data?: T): OpResult<T> {
  return { ok: true, error: null, data }
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function ensureProfile(userId: string): Promise<OpResult> {
  const res = await tryDb(async (db) => {
    await db.insert(profiles).values({ id: userId }).onConflictDoNothing()
    return true
  })
  return res.error ? err(res.error) : okResult()
}

export async function getProfile(userId: string) {
  return tryDb(async (db) => {
    let rows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)
    if (rows.length === 0) {
      await db.insert(profiles).values({ id: userId }).onConflictDoNothing()
      rows = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1)
    }
    return rows[0] ?? null
  })
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, 'name' | 'college' | 'degree' | 'branch' | 'year' | 'semester' | 'targetRole' | 'skills' | 'interests'>>
): Promise<OpResult> {
  const res = await tryDb(async (db) => {
    await ensureProfile(userId)
    await db.update(profiles).set(patch).where(eq(profiles.id, userId))
    return true
  })
  return res.error ? err(res.error) : okResult()
}

// ---------------------------------------------------------------------------
// Subjects & topics
// ---------------------------------------------------------------------------

export async function listSubjectsDetail(userId: string) {
  return tryDb(async (db) => {
    const byProfile = eq(subjects.profileId, userId)
    const subj = await db.select().from(subjects).where(byProfile).orderBy(subjects.examDate)
    if (subj.length === 0) return [] as SubjectDetail[]
    const ids = subj.map((s) => s.id)
    const allTopics = await db
      .select()
      .from(topics)
      .where(inArray(topics.subjectId, ids))
      .orderBy(topics.createdAt)
    return subj.map((s) => ({
      ...s,
      topics: allTopics.filter((t) => t.subjectId === s.id),
    }))
  })
}

export async function addSubject(
  userId: string,
  input: { name: string; examDate?: string }
): Promise<OpResult<{ id: number }>> {
  const name = input.name.trim().slice(0, 200)
  if (!name) return err('Subject name is required.')
  const examDate = input.examDate ? parseDateInput(input.examDate) : null
  if (input.examDate && !examDate) return err('Invalid exam date. Use YYYY-MM-DD.')
  const res = await tryDb(async (db) => {
    await ensureProfile(userId)
    const rows = await db
      .insert(subjects)
      .values({ profileId: userId, name, examDate })
      .returning({ id: subjects.id })
    return { id: rows[0]?.id ?? -1 }
  })
  return res.error
    ? err(res.error)
    : res.data !== null
      ? okResult(res.data)
      : err('Could not create the subject.')
}

async function subjectOwnedBy(userId: string, subjectId: number) {
  const res = await tryDb(async (db) => {
    const rows = await db
      .select({ id: subjects.id, profileId: subjects.profileId })
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1)
    return rows[0] ?? null
  })
  return !res.error && res.data && res.data.profileId === userId
}

export async function addTopic(
  userId: string,
  subjectId: number,
  name: string
): Promise<OpResult> {
  if (!name.trim()) return err('Topic name is required.')
  if (!(await subjectOwnedBy(userId, subjectId))) return err('Subject not found.')
  const res = await tryDb(async (db) => {
    await db.insert(topics).values({ subjectId, name: name.trim().slice(0, 200) })
    return true
  })
  return res.error ? err(res.error) : okResult()
}

export async function setTopicStatus(
  userId: string,
  topicId: number,
  status: 'todo' | 'in_progress' | 'done'
): Promise<OpResult> {
  const res = await tryDb(async (db) => {
    const topic = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1)
    if (!topic[0]) return { ok: false, error: 'Topic not found.' }
    const owned = await subjectOwnedBy(userId, topic[0].subjectId)
    if (!owned) return { ok: false, error: 'Topic not found.' }
    await db.update(topics).set({ status }).where(eq(topics.id, topicId))
    return { ok: true, error: null }
  })
  return res.error ? err(res.error) : res.data!
}

export async function deleteSubject(userId: string, subjectId: number): Promise<OpResult> {
  if (!(await subjectOwnedBy(userId, subjectId))) return err('Subject not found.')
  const res = await tryDb(async (db) => {
    await db.delete(subjects).where(eq(subjects.id, subjectId))
    return true
  })
  return res.error ? err(res.error) : okResult()
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export async function listTasks(userId: string) {
  return tryDb(async (db) => {
    const rows = await db
      .select()
      .from(tasks)
      .where(eq(tasks.profileId, userId))
      .orderBy(tasks.createdAt)
    return rows as Task[]
  })
}

export async function createTask(
  userId: string,
  input: { title: string; description?: string; dueDate?: Date | null; source?: 'manual' | 'ai' }
): Promise<OpResult<{ id: number }>> {
  const title = input.title.trim().slice(0, 200)
  if (!title) return err('Title is required.')
  const res = await tryDb(async (db) => {
    await ensureProfile(userId)
    const rows = await db
      .insert(tasks)
      .values({
        profileId: userId,
        title,
        description: input.description?.slice(0, 1000) ?? null,
        dueDate: input.dueDate ?? null,
        source: input.source ?? 'manual',
      })
      .returning({ id: tasks.id })
    return { id: rows[0]?.id ?? -1 }
  })
  return res.error
    ? err(res.error)
    : res.data !== null
      ? okResult(res.data)
      : err('Could not create the task.')
}

/** Bulk create used by the AI create_tasks tool. */
export async function createTasksBulk(
  userId: string,
  input: Array<{ title: string; dueDate?: string | null }>
) {
  return tryDb(async (db) => {
    await ensureProfile(userId)
    let created = 0
    const errors: string[] = []
    for (const item of input) {
      const title = item.title?.trim()
      if (!title) {
        errors.push('Skipped a task with no title.')
        continue
      }
      const dueDate = item.dueDate ? parseDateInput(item.dueDate) : null
      if (item.dueDate && !dueDate) {
        errors.push(`Skipped "${title.slice(0, 40)}…": invalid due date.`)
        continue
      }
      try {
        await db.insert(tasks).values({
          profileId: userId,
          title: title.slice(0, 200),
          dueDate,
          source: 'ai',
        })
        created += 1
      } catch {
        errors.push(`Failed to create "${title.slice(0, 40)}…".`)
      }
    }
    return { created, errors }
  })
}

export async function toggleTask(userId: string, taskId: number): Promise<OpResult> {
  const res = await tryDb(async (db) => {
    const row = await db
      .select({ id: tasks.id, profileId: tasks.profileId, status: tasks.status })
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1)
    if (!row[0] || row[0].profileId !== userId) return { ok: false, error: 'Task not found.' }
    const next = row[0].status === 'done' ? 'todo' : 'done'
    await db
      .update(tasks)
      .set({ status: next, completedAt: next === 'done' ? new Date() : null })
      .where(eq(tasks.id, taskId))
    return { ok: true, error: null }
  })
  return res.error ? err(res.error) : res.data!
}

export async function deleteTask(userId: string, taskId: number): Promise<OpResult> {
  const res = await tryDb(async (db) => {
    const row = await db
      .select({ id: tasks.id, profileId: tasks.profileId })
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1)
    if (!row[0] || row[0].profileId !== userId) return { ok: false, error: 'Task not found.' }
    await db.delete(tasks).where(eq(tasks.id, taskId))
    return { ok: true, error: null }
  })
  return res.error ? err(res.error) : res.data!
}