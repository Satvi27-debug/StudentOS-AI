export type Priority = 'low' | 'medium' | 'high'
export type TaskCategory = 'study' | 'coding' | 'project' | 'career' | 'research' | 'personal'
export type TaskStatus = 'todo' | 'done'
export type GoalStatus = 'active' | 'completed'
export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'
export type TopicStatus = 'todo' | 'in_progress' | 'done'

export interface StudentProfile {
  name: string
  college: string
  degree: string
  branch: string
  graduationYear: string
  bio: string
  targetRole: string
  interests: string[]
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  category: TaskCategory
  dueDate: string | null
  status: TaskStatus
  createdAt: string
  completedAt: string | null
}

export interface Goal {
  id: string
  title: string
  description?: string
  category: TaskCategory
  targetDate: string | null
  progress: number
  status: GoalStatus
  createdAt: string
  completedAt: string | null
}

export interface Topic {
  id: string
  name: string
  status: TopicStatus
}

export interface Subject {
  id: string
  name: string
  examDate: string | null
  topics: Topic[]
}

export interface StudySession {
  id: string
  subjectId: string
  topicId: string | null
  duration: number
  date: string
  notes?: string
  createdAt: string
}

export interface ProjectTask {
  id: string
  title: string
  done: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  technology: string
  status: ProjectStatus
  deadline: string | null
  tasks: ProjectTask[]
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  level: SkillLevel
}

export interface StudentState {
  student: StudentProfile
  tasks: Task[]
  goals: Goal[]
  subjects: Subject[]
  studySessions: StudySession[]
  projects: Project[]
  skills: Skill[]
}