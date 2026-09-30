import { api } from './client'
import type { Goal } from './goals'
import type { Project } from './projects'
import type { StudentSkill } from './skills'
import type { Subject } from './subjects'
import type { Task } from './tasks'

export interface Dashboard {
  tasks: {
    due_today: Task[]
    overdue: Task[]
    upcoming: Task[]
    completed_count: number
    pending_count: number
  }
  goals: {
    active: Goal[]
    completed_count: number
  }
  study: {
    subjects: Subject[]
    total_topics: number
    done_topics: number
    progress: number
    week_minutes: number
    next_exam: Subject | null
  }
  projects: {
    active: Project[]
    completed_count: number
  }
  skills: StudentSkill[]
  productivity: {
    completed_tasks: number
    pending_tasks: number
    completed_goals: number
    study_minutes_this_week: number
    active_projects: number
    completed_projects: number
    subject_progress: number
    total_topics: number
    done_topics: number
  }
}

export const dashboardApi = {
  get: () => api.get<Dashboard>('/api/dashboard'),
}