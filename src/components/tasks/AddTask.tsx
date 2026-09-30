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

  const inputCls =
    'rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10'

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task…"
          className={`flex-1 ${inputCls}`}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className={inputCls}
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !title.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          <IconPlus />
          Add
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}