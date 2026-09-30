import { api } from './client'

export interface Profile {
  id: number
  student_id: number
  name: string
  college?: string | null
  degree?: string | null
  branch?: string | null
  graduation_year?: string | null
  bio?: string | null
  target_role?: string | null
  interests: string[]
  created_at: string
  updated_at: string
}

export const profileApi = {
  get: () => api.get<Profile>('/api/profile'),
  update: (data: {
    name?: string
    college?: string
    degree?: string
    branch?: string
    graduation_year?: string
    bio?: string
    target_role?: string
    interests?: string[]
  }) => api.put<Profile>('/api/profile', data),
}