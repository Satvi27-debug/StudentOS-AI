'use client'

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import type {
  Goal,
  Priority,
  Project,
  ProjectTask,
  Skill,
  SkillLevel,
  StudentProfile,
  StudentState,
  StudySession,
  Task,
  TaskCategory,
  TopicStatus,
} from './types'
import { createSeedState } from './seed'
import { clearState, loadState, saveState } from './storage'

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type Action =
  | { type: 'task/add'; task: Task }
  | { type: 'task/update'; id: string; patch: Partial<Task> }
  | { type: 'task/delete'; id: string }
  | { type: 'task/toggle'; id: string }
  | { type: 'goal/add'; goal: Goal }
  | { type: 'goal/update'; id: string; patch: Partial<Goal> }
  | { type: 'goal/delete'; id: string }
  | { type: 'goal/toggle'; id: string }
  | { type: 'subject/add'; subject: StudentState['subjects'][number] }
  | { type: 'subject/delete'; id: string }
  | { type: 'topic/add'; subjectId: string; topic: StudentState['subjects'][number]['topics'][number] }
  | { type: 'topic/delete'; subjectId: string; topicId: string }
  | { type: 'topic/cycle'; subjectId: string; topicId: string }
  | { type: 'session/add'; session: StudySession }
  | { type: 'session/delete'; id: string }
  | { type: 'project/add'; project: Project }
  | { type: 'project/update'; id: string; patch: Partial<Project> }
  | { type: 'project/delete'; id: string }
  | { type: 'projectTask/add'; projectId: string; task: ProjectTask }
  | { type: 'projectTask/toggle'; projectId: string; taskId: string }
  | { type: 'projectTask/delete'; projectId: string; taskId: string }
  | { type: 'skill/add'; skill: Skill }
  | { type: 'skill/update'; id: string; patch: Partial<Skill> }
  | { type: 'skill/delete'; id: string }
  | { type: 'student/update'; patch: Partial<StudentProfile> }
  | { type: 'reset' }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: StudentState, action: Action): StudentState {
  switch (action.type) {
    case 'task/add':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'task/update':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      }
    case 'task/delete':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    case 'task/toggle':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t
          const done = t.status !== 'done'
          return {
            ...t,
            status: done ? 'done' : 'todo',
            completedAt: done ? new Date().toISOString() : null,
          }
        }),
      }

    case 'goal/add':
      return { ...state, goals: [action.goal, ...state.goals] }
    case 'goal/update':
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.id ? { ...g, ...action.patch } : g)),
      }
    case 'goal/delete':
      return { ...state, goals: state.goals.filter((g) => g.id !== action.id) }
    case 'goal/toggle':
      return {
        ...state,
        goals: state.goals.map((g) => {
          if (g.id !== action.id) return g
          const done = g.status !== 'completed'
          return {
            ...g,
            status: done ? 'completed' : 'active',
            progress: done ? 100 : g.progress,
            completedAt: done ? new Date().toISOString() : null,
          }
        }),
      }

    case 'subject/add':
      return { ...state, subjects: [...state.subjects, action.subject] }
    case 'subject/delete':
      return { ...state, subjects: state.subjects.filter((s) => s.id !== action.id) }
    case 'topic/add':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.subjectId ? { ...s, topics: [...s.topics, action.topic] } : s
        ),
      }
    case 'topic/delete':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.subjectId
            ? { ...s, topics: s.topics.filter((t) => t.id !== action.topicId) }
            : s
        ),
      }
    case 'topic/cycle': {
      const cycle: TopicStatus[] = ['todo', 'in_progress', 'done']
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.subjectId
            ? {
                ...s,
                topics: s.topics.map((t) => {
                  if (t.id !== action.topicId) return t
                  const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length]
                  return { ...t, status: next }
                }),
              }
            : s
        ),
      }
    }

    case 'session/add':
      return { ...state, studySessions: [action.session, ...state.studySessions] }
    case 'session/delete':
      return { ...state, studySessions: state.studySessions.filter((s) => s.id !== action.id) }

    case 'project/add':
      return { ...state, projects: [action.project, ...state.projects] }
    case 'project/update':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }
    case 'project/delete':
      return { ...state, projects: state.projects.filter((p) => p.id !== action.id) }
    case 'projectTask/add':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId ? { ...p, tasks: [...p.tasks, action.task] } : p
        ),
      }
    case 'projectTask/toggle':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === action.taskId ? { ...t, done: !t.done } : t
                ),
              }
            : p
        ),
      }
    case 'projectTask/delete':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? { ...p, tasks: p.tasks.filter((t) => t.id !== action.taskId) }
            : p
        ),
      }

    case 'skill/add':
      return { ...state, skills: [...state.skills, action.skill] }
    case 'skill/update':
      return {
        ...state,
        skills: state.skills.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      }
    case 'skill/delete':
      return { ...state, skills: state.skills.filter((s) => s.id !== action.id) }

    case 'student/update':
      return { ...state, student: { ...state.student, ...action.patch } }

    case 'reset':
      return createSeedState()

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StudentContextValue {
  state: StudentState
  dispatch: React.Dispatch<Action>
}

const StudentContext = createContext<StudentContextValue | null>(null)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    loadState<StudentState>(createSeedState())
  )

  // Persist on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <StudentContext.Provider value={{ state, dispatch }}>
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
// Action creators — thin wrappers so components don't build action objects
// ---------------------------------------------------------------------------

let idCounter = 0
function uid(): string {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function useStudentActions() {
  const { dispatch } = useStudent()

  return {
    // Tasks
    addTask: (input: {
      title: string
      priority?: Priority
      category?: TaskCategory
      dueDate?: string | null
      description?: string
    }) => {
      const title = input.title.trim()
      if (!title) return
      dispatch({
        type: 'task/add',
        task: {
          id: uid(),
          title: title.slice(0, 200),
          description: input.description?.trim() || undefined,
          priority: input.priority ?? 'medium',
          category: input.category ?? 'personal',
          dueDate: input.dueDate || null,
          status: 'todo',
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      })
    },
    updateTask: (id: string, patch: Partial<Task>) => dispatch({ type: 'task/update', id, patch }),
    deleteTask: (id: string) => dispatch({ type: 'task/delete', id }),
    toggleTask: (id: string) => dispatch({ type: 'task/toggle', id }),

    // Goals
    addGoal: (input: {
      title: string
      category?: TaskCategory
      targetDate?: string | null
      description?: string
    }) => {
      const title = input.title.trim()
      if (!title) return
      dispatch({
        type: 'goal/add',
        goal: {
          id: uid(),
          title: title.slice(0, 200),
          description: input.description?.trim() || undefined,
          category: input.category ?? 'personal',
          targetDate: input.targetDate || null,
          progress: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      })
    },
    updateGoal: (id: string, patch: Partial<Goal>) => dispatch({ type: 'goal/update', id, patch }),
    deleteGoal: (id: string) => dispatch({ type: 'goal/delete', id }),
    toggleGoal: (id: string) => dispatch({ type: 'goal/toggle', id }),

    // Subjects & topics
    addSubject: (name: string, examDate?: string | null) => {
      const trimmed = name.trim()
      if (!trimmed) return
      dispatch({
        type: 'subject/add',
        subject: {
          id: uid(),
          name: trimmed.slice(0, 200),
          examDate: examDate || null,
          topics: [],
        },
      })
    },
    deleteSubject: (id: string) => dispatch({ type: 'subject/delete', id }),
    addTopic: (subjectId: string, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      dispatch({
        type: 'topic/add',
        subjectId,
        topic: { id: uid(), name: trimmed.slice(0, 200), status: 'todo' },
      })
    },
    deleteTopic: (subjectId: string, topicId: string) =>
      dispatch({ type: 'topic/delete', subjectId, topicId }),
    cycleTopicStatus: (subjectId: string, topicId: string) =>
      dispatch({ type: 'topic/cycle', subjectId, topicId }),

    // Study sessions
    addStudySession: (input: {
      subjectId: string
      topicId?: string | null
      duration: number
      date: string
      notes?: string
    }) => {
      if (input.duration <= 0) return
      dispatch({
        type: 'session/add',
        session: {
          id: uid(),
          subjectId: input.subjectId,
          topicId: input.topicId || null,
          duration: input.duration,
          date: input.date,
          notes: input.notes?.trim() || undefined,
          createdAt: new Date().toISOString(),
        },
      })
    },
    deleteStudySession: (id: string) => dispatch({ type: 'session/delete', id }),

    // Projects
    addProject: (input: {
      name: string
      description?: string
      technology?: string
      deadline?: string | null
    }) => {
      const name = input.name.trim()
      if (!name) return
      dispatch({
        type: 'project/add',
        project: {
          id: uid(),
          name: name.slice(0, 200),
          description: input.description?.trim() || '',
          technology: input.technology?.trim() || '',
          status: 'planning',
          deadline: input.deadline || null,
          tasks: [],
          createdAt: new Date().toISOString(),
        },
      })
    },
    updateProject: (id: string, patch: Partial<Project>) =>
      dispatch({ type: 'project/update', id, patch }),
    deleteProject: (id: string) => dispatch({ type: 'project/delete', id }),
    addProjectTask: (projectId: string, title: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      dispatch({
        type: 'projectTask/add',
        projectId,
        task: { id: uid(), title: trimmed.slice(0, 200), done: false },
      })
    },
    toggleProjectTask: (projectId: string, taskId: string) =>
      dispatch({ type: 'projectTask/toggle', projectId, taskId }),
    deleteProjectTask: (projectId: string, taskId: string) =>
      dispatch({ type: 'projectTask/delete', projectId, taskId }),

    // Skills
    addSkill: (name: string, level: SkillLevel) => {
      const trimmed = name.trim()
      if (!trimmed) return
      dispatch({
        type: 'skill/add',
        skill: { id: uid(), name: trimmed.slice(0, 100), level },
      })
    },
    updateSkill: (id: string, patch: Partial<Skill>) => dispatch({ type: 'skill/update', id, patch }),
    deleteSkill: (id: string) => dispatch({ type: 'skill/delete', id }),

    // Student profile
    updateStudent: (patch: Partial<StudentProfile>) => dispatch({ type: 'student/update', patch }),

    // Reset to seed data
    resetAll: () => {
      clearState()
      dispatch({ type: 'reset' })
    },
  }
}

export type StudentActions = ReturnType<typeof useStudentActions>