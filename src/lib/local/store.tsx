'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type {
  Goal,
  Priority,
  Project,
  ProjectStatus,
  Skill,
  SkillLevel,
  StudentProfile,
  StudentState,
  StudySession,
  Task,
  TaskCategory,
  TopicStatus,
} from './types'
import { tasksApi } from '@/lib/api/tasks'
import { goalsApi } from '@/lib/api/goals'
import { subjectsApi } from '@/lib/api/subjects'
import { studyApi } from '@/lib/api/study'
import { projectsApi } from '@/lib/api/projects'
import { skillsApi } from '@/lib/api/skills'
import { profileApi } from '@/lib/api/profile'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StudentContextValue {
  state: StudentState | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const StudentContext = createContext<StudentContextValue | null>(null)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasks, goals, subjects, studySessions, projects, skills, profile] = await Promise.all([
        tasksApi.list(),
        goalsApi.list(),
        subjectsApi.list(),
        studyApi.list(),
        projectsApi.list(),
        skillsApi.list(),
        profileApi.get(),
      ])

      // Transform API responses to local state shape
      const studentProfile: StudentProfile = {
        name: profile.name,
        college: profile.college ?? '',
        degree: profile.degree ?? '',
        branch: profile.branch ?? '',
        graduationYear: profile.graduation_year ?? '',
        bio: profile.bio ?? '',
        targetRole: profile.target_role ?? '',
        interests: profile.interests ?? [],
      }

      const transformedTasks: Task[] = tasks.map((t) => ({
        id: String(t.id),
        title: t.title,
        description: t.description ?? undefined,
        priority: t.priority as Priority,
        category: t.category as TaskCategory,
        dueDate: t.due_date,
        status: t.status as 'todo' | 'done',
        createdAt: t.created_at,
        completedAt: t.completed_at,
      }))

      const transformedGoals: Goal[] = goals.map((g) => ({
        id: String(g.id),
        title: g.title,
        description: g.description ?? undefined,
        category: g.category as TaskCategory,
        targetDate: g.target_date,
        progress: g.progress,
        status: g.status as 'active' | 'completed',
        createdAt: g.created_at,
        completedAt: g.completed_at,
      }))

      const transformedSubjects = subjects.map((s) => ({
        id: String(s.id),
        name: s.name,
        examDate: s.exam_date,
        topics: s.topics.map((t) => ({
          id: String(t.id),
          name: t.name,
          status: t.status as TopicStatus,
        })),
      }))

      const transformedSessions: StudySession[] = studySessions.map((s) => ({
        id: String(s.id),
        subjectId: String(s.subject_id),
        topicId: s.topic_id ? String(s.topic_id) : null,
        duration: s.duration_minutes,
        date: s.session_date,
        notes: s.notes ?? undefined,
        createdAt: s.created_at,
      }))

      const transformedProjects: Project[] = projects.map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description ?? '',
        technology: p.technology ?? '',
        status: p.status as ProjectStatus,
        deadline: p.deadline,
        tasks: p.tasks.map((t) => ({
          id: String(t.id),
          title: t.title,
          done: t.done,
        })),
        createdAt: p.created_at,
      }))

      const transformedSkills: Skill[] = skills.map((s) => ({
        id: String(s.id),
        name: s.skill_name,
        level: s.level as SkillLevel,
      }))

      setState({
        student: studentProfile,
        tasks: transformedTasks,
        goals: transformedGoals,
        subjects: transformedSubjects,
        studySessions: transformedSessions,
        projects: transformedProjects,
        skills: transformedSkills,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial data fetch — setState in effect is intentional here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [])

  return (
    <StudentContext.Provider value={{ state, loading, error, refresh }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>')
  return ctx
}

// ---------------------------------------------------------------------------
// Actions — call the API then refresh local state
// ---------------------------------------------------------------------------

export function useStudentActions() {
  const { state, refresh } = useStudent()

  return {
    // Tasks
    addTask: async (input: {
      title: string
      priority?: Priority
      category?: TaskCategory
      dueDate?: string | null
      description?: string
    }) => {
      const title = input.title.trim()
      if (!title) return
      await tasksApi.create({
        title: title.slice(0, 200),
        description: input.description?.trim() || undefined,
        category: input.category ?? 'personal',
        priority: input.priority ?? 'medium',
        due_date: input.dueDate || null,
      })
      await refresh()
    },
    updateTask: async (id: string, patch: Partial<Task>) => {
      await tasksApi.update(Number(id), {
        title: patch.title,
        description: patch.description,
        category: patch.category,
        priority: patch.priority,
        status: patch.status,
        due_date: patch.dueDate,
      })
      await refresh()
    },
    deleteTask: async (id: string) => {
      await tasksApi.delete(Number(id))
      await refresh()
    },
    toggleTask: async (id: string) => {
      // Find current status from state would require passing state; simpler to just update
      await tasksApi.update(Number(id), { status: 'done' })
      await refresh()
    },

    // Goals
    addGoal: async (input: {
      title: string
      category?: TaskCategory
      targetDate?: string | null
      description?: string
    }) => {
      const title = input.title.trim()
      if (!title) return
      await goalsApi.create({
        title: title.slice(0, 200),
        description: input.description?.trim() || undefined,
        category: input.category ?? 'personal',
        target_date: input.targetDate || null,
      })
      await refresh()
    },
    updateGoal: async (id: string, patch: Partial<Goal>) => {
      await goalsApi.update(Number(id), {
        title: patch.title,
        description: patch.description,
        category: patch.category,
        target_date: patch.targetDate,
        progress: patch.progress,
        status: patch.status,
      })
      await refresh()
    },
    deleteGoal: async (id: string) => {
      await goalsApi.delete(Number(id))
      await refresh()
    },
    toggleGoal: async (id: string) => {
      await goalsApi.update(Number(id), { status: 'completed' })
      await refresh()
    },

    // Subjects & topics
    addSubject: async (name: string, examDate?: string | null) => {
      const trimmed = name.trim()
      if (!trimmed) return
      await subjectsApi.create({ name: trimmed.slice(0, 200), exam_date: examDate || null })
      await refresh()
    },
    deleteSubject: async (id: string) => {
      await subjectsApi.delete(Number(id))
      await refresh()
    },
    addTopic: async (subjectId: string, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      await subjectsApi.createTopic(Number(subjectId), { name: trimmed.slice(0, 200) })
      await refresh()
    },
    deleteTopic: async (subjectId: string, topicId: string) => {
      await subjectsApi.deleteTopic(Number(topicId))
      await refresh()
    },
    cycleTopicStatus: async (subjectId: string, topicId: string) => {
      // Get current status from state via ref, then cycle
      const subject = state?.subjects.find((s) => s.id === subjectId)
      const topic = subject?.topics.find((t) => t.id === topicId)
      if (!topic) return
      const cycle: TopicStatus[] = ['todo', 'in_progress', 'done']
      const next = cycle[(cycle.indexOf(topic.status) + 1) % cycle.length]
      await subjectsApi.updateTopic(Number(topicId), { status: next })
      await refresh()
    },

    // Study sessions
    addStudySession: async (input: {
      subjectId: string
      topicId?: string | null
      duration: number
      date: string
      notes?: string
    }) => {
      if (input.duration <= 0) return
      await studyApi.create({
        subject_id: Number(input.subjectId),
        topic_id: input.topicId ? Number(input.topicId) : null,
        duration_minutes: input.duration,
        session_date: input.date,
        notes: input.notes?.trim() || undefined,
      })
      await refresh()
    },
    deleteStudySession: async (id: string) => {
      await studyApi.delete(Number(id))
      await refresh()
    },

    // Projects
    addProject: async (input: {
      name: string
      description?: string
      technology?: string
      deadline?: string | null
    }) => {
      const name = input.name.trim()
      if (!name) return
      await projectsApi.create({
        name: name.slice(0, 200),
        description: input.description?.trim() || undefined,
        technology: input.technology?.trim() || undefined,
        deadline: input.deadline || null,
      })
      await refresh()
    },
    updateProject: async (id: string, patch: Partial<Project>) => {
      await projectsApi.update(Number(id), {
        name: patch.name,
        description: patch.description,
        technology: patch.technology,
        status: patch.status,
        deadline: patch.deadline,
      })
      await refresh()
    },
    deleteProject: async (id: string) => {
      await projectsApi.delete(Number(id))
      await refresh()
    },
    addProjectTask: async (projectId: string, title: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      await projectsApi.createTask(Number(projectId), { title: trimmed.slice(0, 200) })
      await refresh()
    },
    toggleProjectTask: async (projectId: string, taskId: string) => {
      // Get current done state from ref, then toggle
      const project = state?.projects.find((p) => p.id === projectId)
      const task = project?.tasks.find((t) => t.id === taskId)
      if (!task) return
      await projectsApi.updateTask(Number(taskId), { done: !task.done })
      await refresh()
    },
    deleteProjectTask: async (projectId: string, taskId: string) => {
      await projectsApi.deleteTask(Number(taskId))
      await refresh()
    },

    // Skills
    addSkill: async (name: string, level: SkillLevel) => {
      const trimmed = name.trim()
      if (!trimmed) return
      await skillsApi.create({ name: trimmed.slice(0, 100), level })
      await refresh()
    },
    updateSkill: async (id: string, patch: Partial<Skill>) => {
      await skillsApi.update(Number(id), { name: patch.name, level: patch.level })
      await refresh()
    },
    deleteSkill: async (id: string) => {
      await skillsApi.delete(Number(id))
      await refresh()
    },

    // Student profile
    updateStudent: async (patch: Partial<StudentProfile>) => {
      await profileApi.update({
        name: patch.name,
        college: patch.college,
        degree: patch.degree,
        branch: patch.branch,
        graduation_year: patch.graduationYear,
        bio: patch.bio,
        target_role: patch.targetRole,
        interests: patch.interests,
      })
      await refresh()
    },

    // Reset (clear localStorage fallback — not used in Level 2)
    resetAll: async () => {
      await refresh()
    },
  }
}

export type StudentActions = ReturnType<typeof useStudentActions>