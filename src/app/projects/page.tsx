'use client'

import { useState } from 'react'
import { useStudent } from '@/lib/local/store'
import { ProjectCard, AddProjectForm } from '@/components/projects/ProjectCard'
import { IconFolder } from '@/components/icons'

export default function ProjectsPage() {
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

  const active = state.projects.filter((p) => p.status === 'in_progress' || p.status === 'planning')
  const completed = state.projects.filter((p) => p.status === 'completed')
  const paused = state.projects.filter((p) => p.status === 'paused')

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Build, track, and ship your student projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
        >
          <IconFolder className="h-4 w-4" />
          New project
        </button>
      </header>

      {showAdd ? (
        <div className="animate-fade-in-up">
          <AddProjectForm onDone={() => setShowAdd(false)} />
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {active.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/60 px-5 py-12 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
            🚀
          </div>
          <p className="text-sm font-medium text-zinc-700">No active projects</p>
          <p className="mt-0.5 text-xs text-zinc-400">Start your first project to get building.</p>
        </div>
      )}

      {paused.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-500">Paused</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {paused.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : null}

      {completed.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-500">Completed</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {completed.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}