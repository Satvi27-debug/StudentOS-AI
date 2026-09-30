import { api } from './client'

export interface StudySession {
  id: number
  student_id: number
  subject_id: number
  topic_id: number | null
  duration_minutes: number
  notes?: string | null
  session_date: string
  created_at: string
}

export interface StudyStats {
  today_minutes: number
  week_minutes: number
  month_minutes: number
  by_subject: Array<{ subject: string; minutes: number }>
}

export const studyApi = {
  list: () => api.get<StudySession[]>('/api/study-sessions'),
  create: (data: { subject_id: number; topic_id?: number | null; duration_minutes: number; notes?: string; session_date: string }) =>
    api.post<StudySession>('/api/study-sessions', data),
  delete: (id: number) => api.delete<void>(`/api/study-sessions/${id}`),
  stats: () => api.get<StudyStats>('/api/study-sessions/stats'),
}