'use client'

import { useState } from 'react'
import { useStudent, useStudentActions } from '@/lib/local/store'
import { IconTarget } from '@/components/icons'

export default function CareerPage() {
  const { state, loading, error } = useStudent()
  const actions = useStudentActions()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    targetRole: state?.student.targetRole ?? '',
    interests: state?.student.interests?.join(', ') ?? '',
  })

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

  const save = () => {
    actions.updateStudent({
      targetRole: form.targetRole.trim(),
      interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Career</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your target role, skills, and preparation — used by the Career Agent to plan your next steps.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Target role</label>
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="e.g. Machine Learning Engineer"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Interests (comma-separated)</label>
              <input
                type="text"
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="e.g. AI/ML, Web Development, System Design"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={save}
                className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg active:scale-95"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <IconTarget className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-zinc-500">Target role</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {state.student.targetRole || 'Not set'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95"
              >
                Edit
              </button>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500">Interests</p>
              {state.student.interests?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {state.student.interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Not set</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500">Skills</p>
              {state.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {state.skills.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No skills added yet.</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500">Projects</p>
              {state.projects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {state.projects.map((p) => (
                    <span
                      key={p.id}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No projects yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}