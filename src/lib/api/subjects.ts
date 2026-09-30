import { api } from './client'

export interface Topic {
  id: number
  subject_id: number
  name: string
  status: string
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  student_id: number
  name: string
  description?: string | null
  exam_date: string | null
  created_at: string
  updated_at: string
  topics: Topic[]
  progress: number
}

export const subjectsApi = {
  list: () => api.get<Subject[]>('/api/subjects'),
  create: (data: { name: string; description?: string; exam_date?: string | null }) =>
    api.post<Subject>('/api/subjects', data),
  update: (id: number, data: { name?: string; description?: string; exam_date?: string | null }) =>
    api.put<Subject>(`/api/subjects/${id}`, data),
  delete: (id: number) => api.delete<void>(`/api/subjects/${id}`),
  listTopics: (subjectId: number) => api.get<Topic[]>(`/api/subjects/${subjectId}/topics`),
  createTopic: (subjectId: number, data: { name: string }) =>
    api.post<Topic>(`/api/subjects/${subjectId}/topics`, data),
  updateTopic: (topicId: number, data: { name?: string; status?: string }) =>
    api.put<Topic>(`/api/topics/${topicId}`, data),
  deleteTopic: (topicId: number) => api.delete<void>(`/api/topics/${topicId}`),
}