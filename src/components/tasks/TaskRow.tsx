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
  const [justDone, setJustDone] = useState(false)
  const done = task.status === 'done'

  const toggle = async () => {
    if (busy) return
    setBusy(true)
    const res = await toggleTaskAction(task.id)
    setBusy(false)
    if (res.ok) {
      if (!done) {
        setJustDone(true)
        setTimeout(() => setJustDone(false), 600)
      }
      router.refresh()
    } else {
      setError(res.error ?? 'Could not update task.')
    }
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
    <div
      className={`group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-all duration-200 hover:bg-zinc-50 ${
        justDone ? 'animate-wiggle' : ''
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 active:scale-75 ${
          done
            ? 'border-indigo-600 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30'
            : 'border-zinc-300 bg-white hover:border-indigo-400 hover:shadow-sm'
        }`}
      >
        {done ? (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="m5 13 4 4L19 7"
              strokeDasharray={26}
              className="animate-check-draw"
            />
          </svg>
        ) : null}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm transition-all duration-200 ${
            done ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-900'
          }`}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {task.dueDate ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 ${
                task.overdue && !done
                  ? 'bg-rose-50 font-medium text-rose-600'
                  : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {task.overdue && !done ? 'Overdue · ' : ''}
              {formatDate(task.dueDate)}
            </span>
          ) : null}
          {task.source === 'ai' ? (
            <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600">
              AI
            </span>
          ) : null}
          {error ? <span className="text-rose-600">{error}</span> : null}
        </div>
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label="Delete task"
        className="rounded-lg p-1.5 text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <IconTrash />
      </button>
    </div>
  )
}