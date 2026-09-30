import { api } from './client'

export interface Goal {
  id: number
  student_id: number
  title: string
  description?: string | null
  category: string
  target_date: string | null
  progress: number
  status: string
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface GoalCreate {
  title: string
  description?: string
  category?: string
  target_date?: string | null
}

export interface GoalUpdate {
  title?: string
  description?: string
  category?: string
  target_date?: string | null
  progress?: number
  status?: string
}

export const goalsApi = {
  list: (status?: string) => api.get<Goal[]>(`/api/goals${status ? `?status=${status}` : ''}`),
  get: (id: number) => api.get<Goal>(`/api/goals/${id}`),
  create: (data: GoalCreate) => api.post<Goal>('/api/goals', data),
  update: (id: number, data: GoalUpdate) => api.put<Goal>(`/api/goals/${id}`, data),
  delete: (id: number) => api.delete<void>(`/api/goals/${id}`),
}