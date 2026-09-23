'use server'

import { getCurrentUserId } from '@/lib/auth'
import { parseDateInput } from '@/lib/date'
import { createTask, deleteTask, toggleTask } from '@/db/queries'

type ActionResult = { ok: boolean; error?: string }

export async function addTaskAction(input: {
  title: string
  dueDate?: string
}): Promise<ActionResult> {
  const title = input.title?.trim()
  if (!title) return { ok: false, error: 'Task title is required.' }
  if (title.length > 200) return { ok: false, error: 'Title is too long.' }

  let dueDate: Date | null = null
  if (input.dueDate && input.dueDate.trim()) {
    dueDate = parseDateInput(input.dueDate)
    if (!dueDate) return { ok: false, error: 'Invalid due date. Use YYYY-MM-DD.' }
  }

  const res = await createTask(await getCurrentUserId(), { title, dueDate })
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not create task.' }
}

export async function toggleTaskAction(taskId: number): Promise<ActionResult> {
  const res = await toggleTask(await getCurrentUserId(), taskId)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not update task.' }
}

export async function deleteTaskAction(taskId: number): Promise<ActionResult> {
  const res = await deleteTask(await getCurrentUserId(), taskId)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not delete task.' }
}