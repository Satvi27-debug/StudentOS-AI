'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTaskAction, deleteTaskAction } from '@/actions/tasks'
import { formatDate } from '@/lib/date'
import { IconTrash } from '@/components/icons'

export type TaskView = {
  id: number
  title: string
  description?: string | null
  dueDate: string | null
  status: 'todo' | 'done'
  source: string
  overdue?: boolean
}

export function TaskRow({ task }: { task: TaskView }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const done = task.status === 'done'

  const toggle = async () => {
    if (busy) return
    setBusy(true)
    const res = await toggleTaskAction(task.id)
    setBusy(false)
    if (res.ok) router.refresh()
    else setError(res.error ?? 'Could not update task.')
  }

  const remove = async () => {
    if (busy) return
    setBusy(true)
    const res = await deleteTaskAction(task.id)
    setBusy(false)
    if (res.ok) router.refresh()
    else setError(res.error ?? 'Could not delete task.')
  }

  return (
    <div className="group flex items-start gap-3 px-2 py-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
          done
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-zinc-300 bg-white hover:border-blue-500'
        }`}
      >
        {done ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        ) : null}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm ${done ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {task.dueDate ? (
            <span className={task.overdue && !done ? 'font-medium text-red-600' : ''}>
              {task.overdue && !done ? 'Overdue · ' : ''}
              {formatDate(task.dueDate)}
            </span>
          ) : null}
          {task.source === 'ai' ? (
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
              AI
            </span>
          ) : null}
          {error ? <span className="text-red-600">{error}</span> : null}
        </div>
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label="Delete task"
        className="rounded-md p-1 text-zinc-400 opacity-100 hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <IconTrash />
      </button>
    </div>
  )
}