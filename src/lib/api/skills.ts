import { api } from './client'

export interface StudentSkill {
  id: number
  student_id: number
  skill_id: number
  level: string
  created_at: string
  updated_at: string
  skill_name: string
}

export const skillsApi = {
  list: () => api.get<StudentSkill[]>('/api/skills'),
  create: (data: { name: string; level: string }) => api.post<StudentSkill>('/api/skills', data),
  update: (id: number, data: { name?: string; level?: string }) => api.put<StudentSkill>(`/api/skills/${id}`, data),
  delete: (id: number) => api.delete<void>(`/api/skills/${id}`),
}