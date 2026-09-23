'use server'

import { getCurrentUserId } from '@/lib/auth'
import { addSubject, addTopic, deleteSubject, setTopicStatus } from '@/db/queries'

type ActionResult = { ok: boolean; error?: string }

export async function addSubjectAction(input: {
  name: string
  examDate?: string
}): Promise<ActionResult> {
  const res = await addSubject(await getCurrentUserId(), {
    name: input.name,
    examDate: input.examDate,
  })
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not add subject.' }
}

export async function addTopicAction(input: {
  subjectId: number
  name: string
}): Promise<ActionResult> {
  const res = await addTopic(await getCurrentUserId(), input.subjectId, input.name)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not add topic.' }
}

export async function setTopicStatusAction(input: {
  topicId: number
  status: 'todo' | 'in_progress' | 'done'
}): Promise<ActionResult> {
  const res = await setTopicStatus(await getCurrentUserId(), input.topicId, input.status)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not update topic.' }
}

export async function deleteSubjectAction(subjectId: number): Promise<ActionResult> {
  const res = await deleteSubject(await getCurrentUserId(), subjectId)
  return res.ok ? { ok: true } : { ok: false, error: res.error ?? 'Could not delete subject.' }
}