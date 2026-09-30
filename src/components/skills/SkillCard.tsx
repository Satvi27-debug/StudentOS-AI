'use client'

import { useState } from 'react'
import { useStudentActions } from '@/lib/local/store'
import type { Skill, SkillLevel } from '@/lib/local/types'
import { IconTrash, IconTrendingUp } from '@/components/icons'

const LEVEL_STYLES: Record<SkillLevel, string> = {
  beginner: 'bg-zinc-100 text-zinc-600',
  intermediate: 'bg-indigo-50 text-indigo-700',
  advanced: 'bg-emerald-50 text-emerald-700',
}

const LEVEL_DOTS: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

export function SkillCard({ skill }: { skill: Skill }) {
  const actions = useStudentActions()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(skill.name)
  const [level, setLevel] = useState<SkillLevel>(skill.level)

  const save = () => {
    if (!name.trim()) return
    actions.updateSkill(skill.id, { name: name.trim(), level })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none"
          autoFocus
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as SkillLevel)}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs focus:border-indigo-400 focus:outline-none"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-medium text-white"
        >
          Save
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white px-3.5 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600">
        <IconTrendingUp className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">{skill.name}</p>
        <div className="mt-0.5 flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full ${
                i <= LEVEL_DOTS[skill.level] ? 'bg-indigo-500' : 'bg-zinc-200'
              }`}
            />
          ))}
          <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${LEVEL_STYLES[skill.level]}`}>
            {skill.level}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${skill.name}`}
          className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => actions.deleteSkill(skill.id)}
          aria-label={`Remove ${skill.name}`}
          className="rounded-lg p-1 text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
        >
          <IconTrash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function AddSkillForm({ onDone }: { onDone: () => void }) {
  const actions = useStudentActions()
  const [name, setName] = useState('')
  const [level, setLevel] = useState<SkillLevel>('beginner')

  const submit = () => {
    if (!name.trim()) return
    actions.addSkill(name, level)
    setName('')
    setLevel('beginner')
    onDone()
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Skill name (e.g. Python)"
        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
      />
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value as SkillLevel)}
        className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <button
        type="button"
        onClick={submit}
        disabled={!name.trim()}
        className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:shadow-none"
      >
        Add skill
      </button>
    </div>
  )
}