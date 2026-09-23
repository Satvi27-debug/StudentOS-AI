'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTaskAction } from '@/actions/tasks'
import { IconPlus } from '@/components/icons'

export function AddTask() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    const trimmed = title.trim()
    if (!trimmed || busy) return
    setBusy(true)
    setError('')
    const res = await addTaskAction({ title: trimmed, dueDate })
    setBusy(false)
    if (res.ok) {
      setTitle('')
      setDueDate('')
      router.refresh()
    } else {
      setError(res.error ?? 'Could not add task.')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task…"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !title.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <IconPlus />
          Add
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}