import { api } from './client'

export interface ProjectTask {
  id: number
  project_id: number
  title: string
  done: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  student_id: number
  name: string
  description?: string | null
  technology?: string | null
  status: string
  deadline: string | null
  created_at: string
  updated_at: string
  tasks: ProjectTask[]
  progress: number
}

export const projectsApi = {
  list: (status?: string) => api.get<Project[]>(`/api/projects${status ? `?status=${status}` : ''}`),
  get: (id: number) => api.get<Project>(`/api/projects/${id}`),
  create: (data: { name: string; description?: string; technology?: string; deadline?: string | null }) =>
    api.post<Project>('/api/projects', data),
  update: (id: number, data: { name?: string; description?: string; technology?: string; status?: string; deadline?: string | null }) =>
    api.put<Project>(`/api/projects/${id}`, data),
  delete: (id: number) => api.delete<void>(`/api/projects/${id}`),
  listTasks: (projectId: number) => api.get<ProjectTask[]>(`/api/projects/${projectId}/tasks`),
  createTask: (projectId: number, data: { title: string }) =>
    api.post<ProjectTask>(`/api/projects/${projectId}/tasks`, data),
  updateTask: (taskId: number, data: { title?: string; done?: boolean }) =>
    api.put<ProjectTask>(`/api/project-tasks/${taskId}`, data),
  deleteTask: (taskId: number) => api.delete<void>(`/api/project-tasks/${taskId}`),
}