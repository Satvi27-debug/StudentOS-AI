'use client'

import { useState } from 'react'
import { useStudentActions } from '@/lib/local/store'
import { IconPlus } from '@/components/icons'

export function AddTask() {
  const actions = useStudentActions()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState<'study' | 'coding' | 'project' | 'career' | 'research' | 'personal'>('personal')

  const submit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    actions.addTask({ title: trimmed, dueDate: dueDate || null, priority, category })
    setTitle('')
    setDueDate('')
    setPriority('medium')
    setCategory('personal')
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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className={inputCls}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'study' | 'coding' | 'project' | 'career' | 'research' | 'personal')}
          className={inputCls}
        >
          <option value="study">Study</option>
          <option value="coding">Coding</option>
          <option value="project">Project</option>
          <option value="career">Career</option>
          <option value="research">Research</option>
          <option value="personal">Personal</option>
        </select>
        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          <IconPlus />
          Add
        </button>
      </div>
    </div>
  )
}