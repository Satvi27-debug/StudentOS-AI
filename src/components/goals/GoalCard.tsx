'use client'

import { useState } from 'react'
import { useStudentActions } from '@/lib/local/store'
import type { Goal } from '@/lib/local/types'
import { formatDate } from '@/lib/date'
import { IconCheck, IconTrash } from '@/components/icons'

const CATEGORY_COLORS: Record<string, string> = {
  study: 'bg-blue-50 text-blue-700',
  coding: 'bg-emerald-50 text-emerald-700',
  project: 'bg-violet-50 text-violet-700',
  career: 'bg-amber-50 text-amber-700',
  research: 'bg-rose-50 text-rose-700',
  personal: 'bg-zinc-100 text-zinc-600',
}

export function GoalCard({ goal }: { goal: Goal }) {
  const actions = useStudentActions()
  const [editing, setEditing] = useState(false)
  const [progress, setProgress] = useState(goal.progress)
  const done = goal.status === 'completed'

  const saveProgress = () => {
    const clamped = Math.max(0, Math.min(100, progress))
    setProgress(clamped)
    actions.updateGoal(goal.id, { progress: clamped })
    setEditing(false)
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        done
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-zinc-200/80 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[goal.category] ?? CATEGORY_COLORS.personal}`}>
              {goal.category}
            </span>
            {done ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <IconCheck className="h-3 w-3" /> Done
              </span>
            ) : null}
          </div>
          <p className={`mt-2 text-sm font-semibold ${done ? 'text-emerald-800 line-through' : 'text-zinc-900'}`}>
            {goal.title}
          </p>
          {goal.targetDate ? (
            <p className="mt-0.5 text-xs text-zinc-500">Target: {formatDate(goal.targetDate)}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => actions.toggleGoal(goal.id)}
            aria-label={done ? 'Reopen goal' : 'Complete goal'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90 ${
              done
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-zinc-300 hover:bg-emerald-50 hover:text-emerald-500'
            }`}
          >
            <IconCheck className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => actions.deleteGoal(goal.id)}
            aria-label="Delete goal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-500">Progress</span>
          {editing ? (
            <span className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-14 rounded-md border border-zinc-200 px-1.5 py-0.5 text-right text-xs focus:border-indigo-400 focus:outline-none"
                autoFocus
              />
              <span className="text-zinc-400">%</span>
              <button
                type="button"
                onClick={saveProgress}
                className="rounded-md bg-indigo-600 px-1.5 py-0.5 text-[11px] font-medium text-white"
              >
                Save
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              {goal.progress}%
            </button>
          )}
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${
              done
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-indigo-500 to-violet-500'
            }`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function AddGoalForm({ onDone }: { onDone: () => void }) {
  const actions = useStudentActions()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('personal')
  const [targetDate, setTargetDate] = useState('')

  const submit = () => {
    if (!title.trim()) return
    actions.addGoal({ title, category: category as Goal['category'], targetDate: targetDate || null })
    setTitle('')
    setTargetDate('')
    onDone()
  }

  const inputCls =
    'rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Goal title (e.g. Complete DSA preparation)"
          className={`flex-1 ${inputCls}`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputCls}
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
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          Add goal
        </button>
      </div>
    </div>
  )
}