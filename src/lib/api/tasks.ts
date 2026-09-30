import { api } from './client'

export interface Task {
  id: number
  student_id: number
  title: string
  description?: string | null
  category: string
  priority: string
  status: string
  due_date: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface TaskCreate {
  title: string
  description?: string
  category?: string
  priority?: string
  due_date?: string | null
}

export interface TaskUpdate {
  title?: string
  description?: string
  category?: string
  priority?: string
  status?: string
  due_date?: string | null
}

export const tasksApi = {
  list: (params?: { status?: string; priority?: string; category?: string; sort?: string }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.priority) q.set('priority', params.priority)
    if (params?.category) q.set('category', params.category)
    if (params?.sort) q.set('sort', params.sort)
    const qs = q.toString()
    return api.get<Task[]>(`/api/tasks${qs ? `?${qs}` : ''}`)
  },
  get: (id: number) => api.get<Task>(`/api/tasks/${id}`),
  create: (data: TaskCreate) => api.post<Task>('/api/tasks', data),
  update: (id: number, data: TaskUpdate) => api.put<Task>(`/api/tasks/${id}`, data),
  delete: (id: number) => api.delete<void>(`/api/tasks/${id}`),
}