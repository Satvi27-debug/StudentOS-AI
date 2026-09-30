'use client'

import { useState } from 'react'
import { useStudent } from '@/lib/local/store'
import { GoalCard, AddGoalForm } from '@/components/goals/GoalCard'
import { IconTarget } from '@/components/icons'

export default function GoalsPage() {
  const { state } = useStudent()
  const [showAdd, setShowAdd] = useState(false)

  const active = state.goals.filter((g) => g.status === 'active')
  const completed = state.goals.filter((g) => g.status === 'completed')

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Goals</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Set targets, track progress, and celebrate wins.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
        >
          <IconTarget className="h-4 w-4" />
          New goal
        </button>
      </header>

      {showAdd ? (
        <div className="animate-fade-in-up">
          <AddGoalForm onDone={() => setShowAdd(false)} />
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {active.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 px-5 py-12 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
            🎯
          </div>
          <p className="text-sm font-medium text-zinc-700">No active goals</p>
          <p className="mt-0.5 text-xs text-zinc-400">Create your first goal to get started.</p>
        </div>
      )}

      {completed.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-500">Completed</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {completed.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}