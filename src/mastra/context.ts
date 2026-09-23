import { getProfile, listSubjectsDetail, listTasks } from '@/db/queries'
import { dateKey, formatDate, todayKey } from '@/lib/date'

export type StudentContext = {
  available: boolean
  text: string
  /** Message shown when the database could not be loaded. */
  notice: string
}

/**
 * Assemble the student's relevant context as a compact prompt block.
 * Never throws — if the database is down the agent is told so
 * instead of hallucinating student data.
 */
export async function buildStudentContext(userId: string): Promise<StudentContext> {
  const [profileQ, subjectsQ, tasksQ] = await Promise.all([
    getProfile(userId),
    listSubjectsDetail(userId),
    listTasks(userId),
  ])

  if ((profileQ.error && !profileQ.data) || (subjectsQ.error && !subjectsQ.data)) {
    return {
      available: false,
      text: '',
      notice:
        'Note: the student database could not be loaded right now. If this question depends on the student’s data, say so and offer to retry later.',
    }
  }

  const profile = profileQ.data
  const subjectRows = subjectsQ.data ?? []
  const allTasks = (tasksQ.data ?? []).filter((t) => t.status !== 'done')
  const tKey = todayKey()

  const lines: string[] = []

  if (profile) {
    const basic = [profile.name, profile.degree, profile.branch, profile.year, profile.semester]
      .filter(Boolean)
      .join(' · ')
    if (basic) lines.push(`- Student: ${basic}`)
    if (profile.college) lines.push(`- College: ${profile.college}`)
    if (profile.skills?.length) lines.push(`- Skills: ${profile.skills.join(', ')}`)
    if (profile.targetRole) lines.push(`- Target role: ${profile.targetRole}`)
    if (profile.interests?.length) lines.push(`- Interests: ${profile.interests.slice(0, 8).join(', ')}`)
  }

  if (subjectRows.length) {
    lines.push('- Subjects:')
    for (const s of subjectRows) {
      const due = s.examDate ? ` (exam ${formatDate(s.examDate)})` : ''
      const done = s.topics.filter((t) => t.status === 'done').length
      const total = s.topics.length
      const prog = total ? ` — ${done}/${total} topics done` : ''
      lines.push(`  - ${s.name}${due}${prog}`)
      const pending = s.topics
        .filter((t) => t.status !== 'done')
        .slice(0, 8)
        .map((t) => t.name)
      if (pending.length) {
        lines.push(`    Pending topics: ${pending.join(', ')}`)
      }
    }
  }

  if (allTasks.length) {
    lines.push('- Open tasks:')
    for (const t of allTasks.slice(0, 12)) {
      const due = t.dueDate ? `, due ${formatDate(t.dueDate)}` : ''
      const overdue = t.dueDate ? (dateKey(t.dueDate) ?? 'zzz') < tKey ? ' [OVERDUE]' : '' : ''
      lines.push(`  - ${t.title}${due}${overdue}`)
    }
  }

  const text =
    lines.length > 0
      ? lines.join('\n')
      : 'No student profile, subjects, or tasks recorded yet — help the student get started.'

  const maxLen = 4000
  return { available: true, text: text.slice(0, maxLen), notice: '' }
}