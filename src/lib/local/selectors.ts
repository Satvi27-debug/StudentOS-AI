import type { StudentState, Subject } from './types'
import { dateKey, todayKey } from '@/lib/date'

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export function tasksDueToday(tasks: StudentState['tasks']) {
  const today = todayKey()
  return tasks.filter((t) => t.status !== 'done' && t.dueDate !== null && t.dueDate <= today)
}

export function tasksOverdue(tasks: StudentState['tasks']) {
  const today = todayKey()
  return tasks.filter((t) => t.status !== 'done' && t.dueDate !== null && t.dueDate < today)
}

export function tasksUpcoming(tasks: StudentState['tasks']) {
  const today = todayKey()
  return tasks.filter((t) => t.status !== 'done' && t.dueDate !== null && t.dueDate > today)
}

export function openTasks(tasks: StudentState['tasks']) {
  return tasks.filter((t) => t.status !== 'done')
}

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

export function subjectProgress(subject: Subject): number {
  if (subject.topics.length === 0) return 0
  const done = subject.topics.filter((t) => t.status === 'done').length
  return Math.round((done / subject.topics.length) * 100)
}

export function overallStudyProgress(subjects: StudentState['subjects']): number {
  const all = subjects.flatMap((s) => s.topics)
  if (all.length === 0) return 0
  const done = all.filter((t) => t.status === 'done').length
  return Math.round((done / all.length) * 100)
}

// ---------------------------------------------------------------------------
// Study sessions
// ---------------------------------------------------------------------------

export function studyTimeOn(sessions: StudentState['studySessions'], date: string): number {
  return sessions.filter((s) => s.date === date).reduce((sum, s) => sum + s.duration, 0)
}

export function studyTimeThisWeek(sessions: StudentState['studySessions']): number {
  const now = new Date()
  const day = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const mondayKey = dateKey(monday) ?? '0000-00-00'
  return sessions.filter((s) => s.date >= mondayKey).reduce((sum, s) => sum + s.duration, 0)
}

export function studyTimeBySubject(
  sessions: StudentState['studySessions'],
  subjects: StudentState['subjects']
): Array<{ subjectId: string; name: string; minutes: number }> {
  const map = new Map<string, number>()
  for (const s of sessions) {
    map.set(s.subjectId, (map.get(s.subjectId) ?? 0) + s.duration)
  }
  return subjects
    .map((sub) => ({ subjectId: sub.id, name: sub.name, minutes: map.get(sub.id) ?? 0 }))
    .filter((x) => x.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export function projectProgress(project: StudentState['projects'][number]): number {
  if (project.tasks.length === 0) return 0
  const done = project.tasks.filter((t) => t.done).length
  return Math.round((done / project.tasks.length) * 100)
}

export function activeProjects(projects: StudentState['projects']) {
  return projects.filter((p) => p.status === 'in_progress' || p.status === 'planning')
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export function completedGoals(goals: StudentState['goals']) {
  return goals.filter((g) => g.status === 'completed')
}

// ---------------------------------------------------------------------------
// Productivity summary
// ---------------------------------------------------------------------------

export function productivitySummary(state: StudentState) {
  const today = todayKey()
  const weekMinutes = studyTimeThisWeek(state.studySessions)
  return {
    completedTasks: state.tasks.filter((t) => t.status === 'done').length,
    pendingTasks: state.tasks.filter((t) => t.status !== 'done').length,
    completedGoals: completedGoals(state.goals).length,
    totalGoals: state.goals.length,
    studyMinutesToday: studyTimeOn(state.studySessions, today),
    studyMinutesThisWeek: weekMinutes,
    activeProjects: activeProjects(state.projects).length,
    completedProjects: state.projects.filter((p) => p.status === 'completed').length,
    totalProjects: state.projects.length,
    subjectProgress: overallStudyProgress(state.subjects),
    totalTopics: state.subjects.flatMap((s) => s.topics).length,
    doneTopics: state.subjects.flatMap((s) => s.topics).filter((t) => t.status === 'done').length,
  }
}