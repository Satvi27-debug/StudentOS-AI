'use client'

import { useState } from 'react'
import { useStudent } from '@/lib/local/store'
import { SkillCard, AddSkillForm } from '@/components/skills/SkillCard'
import { IconTrendingUp } from '@/components/icons'

export default function SkillsPage() {
  const { state, loading, error } = useStudent()
  const [showAdd, setShowAdd] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-zinc-400">Loading…</p>
      </div>
    )
  }

  if (error || !state) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-rose-500">{error ?? 'Failed to load data'}</p>
      </div>
    )
  }

  const sorted = [...state.skills].sort((a, b) => {
    const order = { advanced: 0, intermediate: 1, beginner: 2 }
    return order[a.level] - order[b.level]
  })

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Skills</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your proficiency and see where to grow next.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
        >
          <IconTrendingUp className="h-4 w-4" />
          Add skill
        </button>
      </header>

      {showAdd ? (
        <div className="animate-fade-in-up">
          <AddSkillForm onDone={() => setShowAdd(false)} />
        </div>
      ) : null}

      {sorted.length > 0 ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 px-5 py-12 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
            💡
          </div>
          <p className="text-sm font-medium text-zinc-700">No skills yet</p>
          <p className="mt-0.5 text-xs text-zinc-400">Add your first skill to start tracking.</p>
        </div>
      )}
    </div>
  )
}