'use client'

import { useState } from 'react'
import { useStudent, useStudentActions } from '@/lib/local/store'
import type { Priority, Task, TaskCategory } from '@/lib/local/types'
import { todayKey } from '@/lib/date'
import { AddTask } from '@/components/tasks/AddTask'
import { TaskRow } from '@/components/tasks/TaskRow'

type Filter = 'all' | 'todo' | 'done' | 'overdue' | 'today' | 'upcoming'
type Sort = 'dueDate' | 'priority' | 'category' | 'title'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export default function TasksPage() {
  const { state } = useStudent()
  const actions = useStudentActions()
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('dueDate')
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<Priority>('medium')
  const [editCategory, setEditCategory] = useState<TaskCategory>('personal')
  const [editDueDate, setEditDueDate] = useState('')

  const today = todayKey()

  const filtered = state.tasks
    .filter((t) => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      switch (filter) {
        case 'todo': return t.status !== 'done'
        case 'done': return t.status === 'done'
        case 'overdue': return t.status !== 'done' && t.dueDate !== null && t.dueDate < today
        case 'today': return t.status !== 'done' && t.dueDate === today
        case 'upcoming': return t.status !== 'done' && t.dueDate !== null && t.dueDate > today
        default: return true
      }
    })
    .sort((a, b) => {
      switch (sort) {
        case 'dueDate': return (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')
        case 'priority': return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        case 'category': return a.category.localeCompare(b.category)
        case 'title': return a.title.localeCompare(b.title)
        default: return 0
      }
    })

  const startEdit = (t: Task) => {
    setEditingId(t.id)
    setEditTitle(t.title)
    setEditPriority(t.priority)
    setEditCategory(t.category)
    setEditDueDate(t.dueDate ?? '')
  }

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return
    actions.updateTask(editingId, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || null,
    })
    setEditingId(null)
  }

  const filterTabs: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'To do' },
    { key: 'done', label: 'Done' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
  ]

  const categories: Array<{ key: TaskCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All categories' },
    { key: 'study', label: 'Study' },
    { key: 'coding', label: 'Coding' },
    { key: 'project', label: 'Project' },
    { key: 'career', label: 'Career' },
    { key: 'research', label: 'Research' },
    { key: 'personal', label: 'Personal' },
  ]

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          One task list for everything — create, edit, filter, and track.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <AddTask />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {filterTabs.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-zinc-200" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | 'all')}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 focus:border-indigo-400 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 focus:border-indigo-400 focus:outline-none"
        >
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="category">Sort: Category</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 px-5 py-12 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
              ✅
            </div>
            <p className="text-sm font-medium text-zinc-700">No tasks match this filter</p>
            <p className="mt-0.5 text-xs text-zinc-400">Try a different filter or add a new task above.</p>
          </div>
        ) : (
          filtered.map((t) => {
            if (editingId === t.id) {
              return (
                <div key={t.id} className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                      autoFocus
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as Priority)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    >
                      <option value="study">Study</option>
                      <option value="coding">Coding</option>
                      <option value="project">Project</option>
                      <option value="career">Career</option>
                      <option value="research">Research</option>
                      <option value="personal">Personal</option>
                    </select>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={!editTitle.trim()}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-40"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            }
            return (
              <div key={t.id} className="group relative">
                <TaskRow task={t} />
                <div className="absolute right-10 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    aria-label="Edit task"
                    className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}