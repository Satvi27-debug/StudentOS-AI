'use client'

import { useState } from 'react'
import { useStudentActions } from '@/lib/local/store'
import type { Project, ProjectStatus } from '@/lib/local/types'
import { projectProgress } from '@/lib/local/selectors'
import { formatDate } from '@/lib/date'
import { IconCheck, IconFolder, IconPlus, IconTrash } from '@/components/icons'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  planning: 'bg-zinc-100 text-zinc-600',
  in_progress: 'bg-indigo-50 text-indigo-700',
  paused: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

export function ProjectCard({ project }: { project: Project }) {
  const actions = useStudentActions()
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [showTasks, setShowTasks] = useState(false)
  const pct = projectProgress(project)

  const addTask = () => {
    if (!newTask.trim()) return
    actions.addProjectTask(project.id, newTask)
    setNewTask('')
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[project.status]}`}>
              {project.status.replace('_', ' ')}
            </span>
            {project.deadline ? (
              <span className="text-xs text-zinc-400">Due {formatDate(project.deadline)}</span>
            ) : null}
          </div>
          <p className="mt-2 text-[15px] font-semibold text-zinc-900">{project.name}</p>
          {project.description ? (
            <p className="mt-0.5 text-xs text-zinc-500">{project.description}</p>
          ) : null}
          {project.technology ? (
            <p className="mt-1 text-xs text-zinc-400">{project.technology}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => actions.deleteProject(project.id)}
          aria-label={`Delete ${project.name}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-500">Progress</span>
          <span className="font-bold text-zinc-700">{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {project.tasks.length > 0 ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowTasks(!showTasks)}
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-600"
          >
            <IconFolder className="h-3.5 w-3.5" />
            {project.tasks.length} task{project.tasks.length === 1 ? '' : 's'}
            <span className="text-zinc-300">{showTasks ? '▲' : '▼'}</span>
          </button>
          {showTasks ? (
            <ul className="mt-2 space-y-1">
              {project.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => actions.toggleProjectTask(project.id, t.id)}
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all active:scale-75 ${
                      t.done
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-zinc-300 bg-white hover:border-indigo-400'
                    }`}
                  >
                    {t.done ? <IconCheck className="h-3 w-3" /> : null}
                  </button>
                  <span className={t.done ? 'text-zinc-400 line-through' : 'text-zinc-700'}>
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 border-t border-zinc-100 pt-3">
        {showAddTask ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="New task"
              autoFocus
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 text-sm placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              onClick={addTask}
              disabled={!newTask.trim()}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-40"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddTask(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95"
          >
            <IconPlus className="h-3.5 w-3.5" />
            Add task
          </button>
        )}
      </div>
    </div>
  )
}

export function AddProjectForm({ onDone }: { onDone: () => void }) {
  const actions = useStudentActions()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [technology, setTechnology] = useState('')
  const [deadline, setDeadline] = useState('')

  const submit = () => {
    if (!name.trim()) return
    actions.addProject({
      name,
      description: description || undefined,
      technology: technology || undefined,
      deadline: deadline || null,
    })
    setName('')
    setDescription('')
    setTechnology('')
    setDeadline('')
    onDone()
  }

  const inputCls =
    'rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className={inputCls}
        />
        <input
          type="text"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          placeholder="Technology (e.g. React, Python)"
          className={inputCls}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className={inputCls}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputCls}
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!name.trim()}
        className="mt-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:shadow-none"
      >
        Add project
      </button>
    </div>
  )
}